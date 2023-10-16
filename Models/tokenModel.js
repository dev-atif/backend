const { mongoose } = require("mongoose");
const Schema = mongoose.Schema

const tokenSchema = new Schema({
    userId:{
        type:String,
        require:true,
        ref:"User",
        unique:true,
    },
    token:{type:String,require:true,},
    createdAt:{type:Date,default:Date.now(),expires:3600} // 1 hour


})
module.exports = mongoose.model('token',tokenSchema,'token')