import {config} from 'dotenv'
import express from 'express'
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import morgan from 'morgan';



config()


const app = express();

app.use(express.json())

app.use(morgan("dev"))

app.get("/", (req, res) => {
    res.send("Hello World!");
});


app.use(passport.initialize())

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/auth/google/callback"
},(_, __,profile,done) => {
    console.log(profile)
    return done(null, profile)
}))

app.get("/auth/google", 
    passport.authenticate("google", { scope: ["profile", "email"] })
)


app.get("/auth/google/callback", 
    passport.authenticate("google", { session: false, failureRedirect: "/" }),
    (req , res) => {
        console.log(req.user)
        res.send("Google Authentication Successfully");
    }
)


app.listen(3000, () => {
    console.log("Server is running on port 3000");
})