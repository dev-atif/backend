const nodemailer = require('nodemailer')
const Token = require('../Models/tokenModel')
const crypto =  require('crypto')
const sendEmail = async(req,res)=>{
   
/* try{
    let transport = nodemailer.createTransport({
        host:'smtp.gmail.com',
        service: "gmail",
        port: 587,
        secure:false,
        auth: {
          user: 'atifali5410@gmail.com',
          pass: 'kqvqtbatrqatjgjo'
        }
    })
    const uniqueCode = crypto.randomBytes(32).toString('hex');
    let info = await transport.sendMail({
        from:'<atifali5410@gmail.com>', 
        to: email ,'bugxbunny112233@gmail.com ' ,
        subject:"Atif Jan",
        text:`"this code is generated by me jan " ${uniqueCode}`,
        html:'<p>To verify yourself, please click on this link:</p><a href="/login">Verify</a>'
    })
    console.log("Message Sent: %s", info.messageId);
    res.json(info);
} catch (error) {
console.error("Error sending email:", error);
res.status(500).json({ error: "An error occurred while sending the email." });
} */
} 

module.exports=sendEmail;