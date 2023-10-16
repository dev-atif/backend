const mongoose = require("mongoose");

const useSchema = new mongoose.Schema({
  name: String,
  lastname: String,

  number: String,
  country: String,
  email: String,
  pasword: String,
  confirmpasword: String,
  reset_pasword_token:String,
  isBusiness: Boolean,
  isCustomer: Boolean,
  verificationToken: String,
  verified: { type: Boolean, default: false },
});

module.exports = mongoose.model("Users", useSchema, "Users");
