const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    username: {
      type: String,
      required: [true, "Enter your first name"],
    },
    email:{
      type: String,
      required:[true, "Email is required"]
    },
    password: {
      type: String,
      required: [true, "Enter your password"],
    },
  })
  
  const users = mongoose.model("users", userSchema);
  
  module.exports = users;