import mongoose from "mongoose";
import bcrypt from "bcryptjs";

// ── User Schema Definition ───────────────────────────────────────────────────
const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    contact: {
      type: String,
      required: false, // Optional for Google OAuth users
    },
    password: {
      type: String,
      // Password is only mandatory for standard registrations (not required for Google OAuth logins)
      required: function () {
        return !this.googleId;
      },
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    role: {
      type: String,
      enum: ["buyer", "seller"],
      default: "buyer", // Default user is a buyer, can register as seller via toggle
    },
    googleId: {
      type: String, // Stores Google OAuth ID if user signed in with Google
    },
  },
  { timestamps: true },
);

// ── Mongoose Pre-save Hook: Hash Password ────────────────────────────────────
// Automatically hashes the plain-text password using bcrypt before persisting to DB
userSchema.pre("save", async function () {
  // Only hash password if it was created or modified
  if (!this.isModified("password") || !this.password) return;
  const hash = await bcrypt.hash(this.password, 10);
  this.password = hash;
});

// ── Schema Method: Verify Password ───────────────────────────────────────────
// Compares an incoming plain-text password against the stored bcrypt hash
userSchema.methods.comparePassword = async function (password) {
  if (!this.password) return false;
  return await bcrypt.compare(password, this.password);
};

const userModel = mongoose.model("user", userSchema);
export default userModel;
