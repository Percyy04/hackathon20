const { default: mongoose, Schema } = require("mongoose");

const userSchema = new Schema(
  {
    username: {
      type: Stirng,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Users = mongoose.model("Users", userSchema);
module.exports = Users;
