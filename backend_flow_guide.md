# 🚀 Backend Development — Complete Flow Guide (Hinglish)

> Ye document tumhare **insta-clone backend** ke poore flow ko step-by-step explain karta hai.
> Jab bhi naya backend banao, isko reference ki tarah use karo.

---

## 📁 Project Structure

```
day-12/
├── server.js                          ← Entry point (yahan se sab shuru hota hai)
├── package.json                       ← Dependencies & scripts
├── .env                               ← Secret keys (MONGO_URI, JWT_SECRET, etc.)
├── .gitignore                         ← Git se ignore karne wali files
└── src/
    ├── app.js                         ← Express app setup + middlewares + routes
    ├── config/
    │   └── database.js                ← MongoDB connection
    ├── models/
    │   ├── user.model.js              ← User ka schema (data ka shape)
    │   ├── post.model.js              ← Post ka schema
    │   ├── follow.model.js            ← Follow relationship (pending/accepted/rejected)
    │   └── like.model.js              ← Post like schema
    ├── controllers/
    │   ├── auth.controller.js         ← Register & Login logic (stores id and username in JWT)
    │   ├── post.controller.js         ← Post CRUD + Like logic
    │   └── user.controller.js         ← Follow system logic
    ├── middlewares/
    │   └── auth.middleware.js          ← Token verify karke id aur username req pe chipkata hai
    └── routes/
        ├── auth.routes.js             ← Auth URLs
        ├── post.routes.js             ← Post URLs (contains likes route)
        └── user.routes.js             ← User/Follow URLs
```

---

## 🔄 Step-by-Step Flow: Server Start Hone Se Lekar Response Tak

### Step 1: Server Start (`server.js`)

```
npm run dev → nodemon server.js chalata hai
```

**Kya hota hai:**
1. `dotenv` se `.env` file load hoti hai (MONGO_URI, JWT_SECRET, etc.)
2. `connectDB()` call hota hai → MongoDB se connection banta hai
3. `app.listen(3000)` → Server port 3000 pe sunne lagta hai

```js
require('dotenv').config()       // .env load karo
const app = require("./src/app")
const connectDB = require("./src/config/database")

connectDB()                       // MongoDB connect karo
app.listen(3000, () => {          // Server chalu karo
  console.log("server is running on port 3000")
})
```

---

### Step 2: Database Connect (`config/database.js`)

```js
async function connectDB() {
  await mongoose.connect(process.env.MONGO_URI)  // .env se URL leke connect
  console.log("database is connected")
}
```

- `MONGO_URI` = MongoDB Atlas ya local MongoDB ka URL
- Agar fail ho toh `process.exit(1)` se server band ho jaata hai

---

### Step 3: Express App Setup (`app.js`)

```js
const app = express()

// Global Middlewares (har request pe chalte hain)
app.use(express.json())         // JSON body parse karta hai
app.use(cookieParser())         // Cookies read karne ke liye

// Routes register karo
app.use("/api/auth", authRouter)   // /api/auth/* → auth routes
app.use("/api/posts", postRouter)  // /api/posts/* → post routes
app.use("/api/users", userRouter)  // /api/users/* → user/follow routes
```

**Middleware kya karta hai:**
- `express.json()` → `req.body` mein JSON data available karata hai
- `cookieParser()` → `req.cookies` mein cookies available karata hai

---

### Step 4: Routes — URL se Controller Mapping

Routes decide karte hain ki **konsa URL → konsa function** chalega.

#### Auth Routes (`routes/auth.routes.js`)

| Method | URL | Controller | Kya karta hai |
|--------|-----|------------|---------------|
| POST | `/api/auth/register` | `registerController` | Naya user banana + JWT mein id aur username store karna |
| POST | `/api/auth/login` | `loginController` | User login karna + Cookie mein token set karna |

#### Post Routes (`routes/post.routes.js`)

| Method | URL | Middleware | Controller | Kya karta hai |
|--------|-----|-----------|------------|---------------|
| POST | `/api/posts/` | `authMiddleware` + `multer` | `createPostController` | Nayi post banana |
| GET | `/api/posts/` | `authMiddleware` | `getPostController` | Apni saari posts lana |
| GET | `/api/posts/details/:postId` | `authMiddleware` | `getPostDetailsController` | Ek post ka detail lana |
| POST | `/api/posts/like/:postId` | `authMiddleware` | `likePostController` | Post ko like karna |

#### User Routes (`routes/user.routes.js`)

| Method | URL | Middleware | Controller | Kya karta hai |
|--------|-----|-----------|------------|---------------|
| POST | `/api/users/follow/:username` | `authMiddleware` | `followUserController` | Follow request bhejna (`pending`) |
| POST | `/api/users/unfollow/:username` | `authMiddleware` | `unfollowUserController` | Unfollow karna (delete relationship) |
| POST | `/api/users/accept/:username` | `authMiddleware` | `acceptFollowController` | Follow request accept karna (`accepted`) |
| POST | `/api/users/reject/:username` | `authMiddleware` | `rejectFollowController` | Follow request reject karna (`rejected`) |
| GET | `/api/users/requests` | `authMiddleware` | `getFollowRequestsController` | Apne pending requests lana |

---

### Step 5: Models — Data Ka Shape Define Karo

#### User Model (`models/user.model.js`)

```js
{
  username:     String  (unique, required),
  email:        String  (unique, required),
  password:     String  (required, hashed),
  bio:          String,
  profileImage: String  (default image URL),
}
```

#### Post Model (`models/post.model.js`)

```js
{
  caption:   String  (default: ""),
  imgURL:    String  (required),
  user:      ObjectId → references "users",
}
```

#### Follow Model (`models/follow.model.js`)

```js
{
  follower:  String (follower ka username),
  following: String (jisko follow kar rahe ho uska username),
  status:    String (default: "pending", enum: ["pending", "accepted", "rejected"]),
}
// Unique compound index: { follower + following } → ek user doosre ko sirf ek baar follow request bhej sake
```

#### Like Model (`models/like.model.js`)

```js
{
  post: ObjectId → references "posts" (required),
  user: String   (user ka username jo like kar raha hai) (required),
}
// Unique compound index: { user + post } → ek user ek post ko sirf ek baar like kar sake
```

---

### Step 6: Middleware — Security Guard

#### Auth Middleware (`middlewares/auth.middleware.js`)

```
Request aaya
    ↓
Cookie mein token hai? ─── NAHI ──→ 401 "UnAuthorized Access"
    ↓ HAAN
jwt.verify() se valid hai? ── NAHI ──→ 401 "Invalid or expired token"
    ↓ HAAN
req.userId = decoded.id
req.username = decoded.username    ← id aur username dono request pe chipka do
    ↓
next() ──→ Controller ko bhejo ✅
```

---

### Step 7: Controllers — Business Logic

#### 🔐 Auth Controller
- Register aur Login dono mein `jwt.sign` karte waqt **`id`** aur **`username`** dono payload mein pass karte hain.
- Response mein cookie set hoti hai.

#### 📸 Post Controller
- **`createPostController`**: Image ImageKit par upload hoti hai, database mein post entry banayi jaati hai.
- **`getPostController`**: Logged-in user ki posts fetch karta hai.
- **`getPostDetailsController`**: Single post ki details user-validation ke sath fetch karta hai.
- **`likePostController`**: Post check karta hai, fir Like Model mein entry karta hai. Unique index duplicate likes ko block karta hai.

#### 👥 User Controller
- **`followUserController`**: Check karta hai ki user khud ko follow toh nahi kar raha, target user exists karta hai, aur already follow record toh nahi hai:
  - Agar already follow record status `"accepted"` ya `"pending"` hai, toh warning return karta hai.
  - Agar status `"rejected"` hai, toh status ko wapas `"pending"` set karke request ko resend kar deta hai.
- **`unfollowUserController`**: Database se relationship document ko complete delete kar deta hai.
- **`acceptFollowController`**: Target pending request ko dhundhta hai aur status update karke `"accepted"` kar deta hai.
- **`rejectFollowController`**: Target pending request ko dhundhta hai aur status update karke `"rejected"` kar deta hai.
- **`getFollowRequestsController`**: `status: "pending"` wali saari follow requests user ke liye fetch karta hai.

---

## 🌊 Request Journey (Example: Follow User)

```
User clicks "Follow" button on Virat's profile
        ↓
Frontend sends: POST /api/users/follow/virat
  - Cookie: token=eyJhbG... (containing follower username: "adarsh")
        ↓
Express app triggers middlewares
  - cookieParser() reads cookie
        ↓
authMiddleware:
  - reads token
  - jwt.verify() decodes payload
  - sets req.username = "adarsh", req.userId = "..."
  - calls next() ✅
        ↓
userRouter matches: POST /follow/:username
        ↓
followUserController:
  - check: "virat" !== "adarsh" (cannot follow self)
  - check: "virat" user exists in DB?
  - check: follow record already exists?
  - creates followRecord: { follower: "adarsh", following: "virat", status: "pending" }
  - returns res.status(201).json({ message: "Follow request sent to virat", ... })
```

---

## 🧩 Key Concepts & Quick Reference

1. **Scalable Follow/Like Design**:
   Unbounded arrays user/post model ke andar 16MB document limit ko crash kar sakte hain (e.g. 312M followers of Virat). Solution is creating separate collection (`follows`, `likes`) and using **compound unique index** to prevent duplicates:
   ```js
   followSchema.index({ follower: 1, following: 1 }, { unique: true });
   ```

2. **Destructuring Payload vs setting on Req**:
   Payload se data nikalna:
   ```js
   const { id, username } = decoded;
   req.userId = id;
   req.username = username;
   ```

3. **Database query patterns**:
   - `findOneAndUpdate(filter, update, { returnDocument: "after" })` -> updates and returns updated document.
   - `findOneAndDelete(filter)` -> deletes and returns deleted document.
   - `deleteOne(filter)` -> deletes and returns only count `{ deletedCount: 1 }`.

---

> **💡 Quick Tip:** Jab bhi naya feature aaye:
> 1. Model banao (unbounded arrays mat banao)
> 2. Controller logic likho (use req.userId/req.username)
> 3. Route register karo + authMiddleware lagao
> 4. Postman se cookies ke sath test karo! 🚀
