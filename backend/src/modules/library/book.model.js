import mongoose from "mongoose";

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      index: true,
    },
    author: {
      type: String,
      required: true,
      index: true,
    },
    isbn: {
      type: String,
      index: true,
    },
    bookNumber: {
      type: String,
      required: true,
      unique: true,
      index: true, // e.g. LIB-CS-00123
    },
    accessionNumber: {
      type: String,
      unique: true,
      sparse: true,
    },

    category: {
      type: String,
      index: true,
    },
    publisher: String,
    publishedYear: Number,

    status: {
      type: String,
      enum: ["AVAILABLE", "ISSUED", "LOST", "DAMAGED"],
      default: "AVAILABLE",
      index: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Book", bookSchema);
