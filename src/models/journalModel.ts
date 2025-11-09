import mongoose, { Schema } from "mongoose";

const journalSchema = new Schema({
  title: {
    type: String,
    required: [true, "Journal title is required"],
    trim: true,
    maxlength: [100, "Title cannot exceed 100 characters"]
  },
  description: {
    type: String,
    maxlength: [500, "Description cannot exceed 500 characters"],
    default: ""
  },
  color: {
    type: String,
    default: "#3b82f6"
  },
  coverImage: {
    type: String,
    default: ""
  },
  isShared: {
    type: Boolean,
    default: false
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  }
}, {
  timestamps: true
});

// Create indexes
journalSchema.index({ createdBy: 1 });
journalSchema.index({ createdAt: -1 });

const Journal = mongoose.models.Journal || mongoose.model("Journal", journalSchema);

export default Journal;