const mongoose = require("mongoose");

export const UserSchema = new mongoose.Schema({
  FirstName: {
    type: String,
    required: true,
  },
  LastName: {
    type: String,
    required: true,
  },
  Email: {
    type: String,
    required: true,
  },
});

// userSchema.virtual("FullName").get(function () {
//   return `${this.FirstName} ${this.LastName}`;
// });

// module.exports = mongoose.model("User", UserSchema, "Users");
