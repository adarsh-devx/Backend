import mongoose from "mongoose";

const priceSchema = new mongoose.Schema(
  {
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      enum: ["USD", "INR"],
      default: "INR",
    },
  },
  {
    _id: false,
    versionKey: false,
  },
);

export default priceSchema;