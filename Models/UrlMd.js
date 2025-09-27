import mongoose from "mongoose";

const UrlSchema = new mongoose.Schema(
  {
    url: {
      type: String,
      required: true,
    },
    shortCode: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    image: {
      type: String,
      default: null,
    },
    accessCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);
const Url = mongoose.model("Url", UrlSchema);
export default Url;
