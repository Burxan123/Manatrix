import mongoose from "mongoose";

const newUsers = mongoose.Schema(
  {
    userEmail: {
      type: String,
      required: true,
      max: 50,
    },
    name: {
      type: String,
      required: true
    },
    surname: {
      type: String,
      required: true
    },
    category: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
);

const newUser = mongoose.model("newUser", newUsers);
export default newUser;
