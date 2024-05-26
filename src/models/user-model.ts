import { model, Schema } from "mongoose";

type UserType = {
  username: string;
  password: string;
  email: string;
};

const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
});

const User = model("user", UserSchema);

export { User, UserType };
