const mongoose = require("mongoose");

const useSchema = new mongoose.Schema({
  name: String,
  lastname: String,
  username: String,
  image:String,
  cloudinary_id:String,
  number: String,
  country: String,
  city: String,
  zip_code: String,
  state: String,
  email: String,
  pasword: String,
  confirmpasword: String,
  reset_pasword_token: String,
  isBusiness: Boolean,
  isCustomer: Boolean,
  verificationToken: String,
  verified: { type: Boolean, default: false },
});

module.exports = mongoose.model("Users", useSchema, "Users");
