import crypto from "crypto";
import { model, Schema } from "mongoose";

type UserType = {
  username: string;
  password: string;
  email: string;
};

type UserWithId = UserType & { _id: string };

const UserSchema = new Schema(
  {
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
    passwordResetToken: String,
    passwordResetTokenExpires: Number,
  },
  {
    methods: {
      createResetPasswordToken() {
        const resetToken = crypto.randomBytes(32).toString("hex");
        this.passwordResetToken = crypto
          .createHash("sha256")
          .update(resetToken)
          .digest("hex");
        this.passwordResetTokenExpires = Date.now() + 10 * 60 * 1000;
        return resetToken;
      },
    },
  },
);

// UserSchema.methods.createResetPasswordToken = function () {
//   const resetToken = crypto.randomBytes(32).toString("hex");
//   this.passwordResetTokenExpires = crypto
//     .createHash("sha256")
//     .update(resetToken)
//     .digest("hex");
//   this.passwordResetTokenExpires = Date.now() + 10 * 60 * 1000;
//   return resetToken;
// };

const User = model("user", UserSchema);

export { User, UserType, UserWithId };
