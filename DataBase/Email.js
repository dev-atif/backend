const nodemailer = require('nodemailer')

const VerifyEmail = async(email,link,name)=>{
   
 try{
    let transport = nodemailer.createTransport({
        host:'smtp.gmail.com',
        service: "gmail",
        port: 587,
        secure:false,
        auth: {
          user: 'atifali5410@gmail.com',
          pass: 'uvcmbfjoqznxeopb'
        }
    })
   
    let info = await transport.sendMail({
        from:'<atifali5410@gmail.com>', 
        to: email ,
        subject:"Email Verification",
        text:`"To Login In to Your Account Please Verify Your Email `,
        html: `<div>
        <h3> Dear ${name} Thank You  for Chosing Us Please Click Below to Verify Your-Self </h3>
        <a href="${link}">Click here to Verify</a></div>`
    })
    console.log("Message Sent: %s", info.messageId);
    
} catch (error) {
console.error("Error sending email:", error);

} 
} 

module.exports=VerifyEmail;