import mongoose, { Schema } from "mongoose";

const userSchema = new Schema({
  fullName: {
    type: String,
    required: [true, "Username is required"],
    trim: true,
    minlength: [2, "Full name must be at least 2 characters"],
    maxlength: [50, "Full name cannot exceed 50 characters"]
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, "Please provide a valid email address"]

  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: [6, "Password must be at least 6 characters"],
  },
  avatar: {
    type: String,
    default: ""
  },
  bio: {
    type: String,
    maxlength: 200,
    default: ""
  },

  // Authentication
  isVerified: {
    type: Boolean,
    default: false,
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user"
  },

  // Security tokens
  forgotPasswordToken: String,
  forgotPasswordTokenExpiryDate: Date,
  verifyToken: String,
  verifyTokenExpiryDate: Date,

  // App preferences
  preferences: {
    theme: {
      type: String,
      enum: ["light", "dark", "auto"],
      default: "auto"
    },
    language: {
      type: String,
      default: "en"
    },
    defaultView: {
      type: String,
      enum: ["list", "map", "calendar"],
      default: "list"
    }
  },

  // User stats
  stats: {
    totalEntries: {
      type: Number,
      default: 0
    },
    totalJournals: {
      type: Number,
      default: 0
    },
    streak: {
      type: Number,
      default: 0
    },
    joinedAt: {
      type: Date,
      default: Date.now
    },
    isDeleted: {
      type: Boolean,
      default: false
    }
  }

}, {
  timestamps: true // Adds createdAt and updatedAt automatically
});


userSchema.index({ "stats.streak": -1 });

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;