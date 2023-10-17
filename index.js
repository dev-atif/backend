const express = require("express");
const app = express();
require("./DataBase/connection");
const User = require("./DataBase/User");
const cors = require("cors");
app.use(express.json());
app.use(cors());
const nodemailer = require("nodemailer");
const sendEmail = require("./Emailverification/Regemail");
const bodyParser = require("body-parser");
const Token = require("./Models/tokenModel");
const crypto = require("crypto");
const VerifyEmail = require("./DataBase/Email");

//JASON WEB TOKEN
const Jwt = require("jsonwebtoken");
const Jwtkey = "local";
app.use(bodyParser.json());


app.get('/',async(req,res)=>{
res.send('Upload successfully')
})
//Registration Code ---------------------------------------------------------

app.post("/register", async (req, resp) => {
  try {
    let user = new User(req.body);
    let result = await user.save();
    //Token Schema ------------
    const token = new Token({
      userId: user._id,
      token: crypto.randomBytes(16).toString("hex"),
    });
    await token.save();
    console.log(token);
    //-------------------------------------
    const link = `http://localhost:3000/user/${user._id}/verify/${token.token}`;
    await VerifyEmail(req.body.email, link, req.body.name);
    result = result.toObject();
    delete result.pasword;
    delete result.confirmpasword;
    Jwt.sign({ result }, Jwtkey, (err, token) => {
      resp.send({ result, auth: token });
    });
  } catch (error) {
    console.error("Error creating user:", error);
    resp.status(500).send("Error creating user");
  }
});

/* ------------------------------------------------------------------------------------------------ */
/* --Login APi ------------------------------------------------------------------------------------- */

app.post("/login", async (req, resp) => {
  let user = await User.findOne(req.body).select("-pasword -confirmpasword");
  if (req.body.pasword && req.body.email) {
    if (user) {
      //If user find then apply JWT
      Jwt.sign({ user }, Jwtkey, (err, token) => {
        resp.send({ user, auth: token });
      });
    } else {
      resp.send("No User Found");
    }
  } else {
    resp.send("Enter All Fields");
  }
});

/* ------------------------------------------------------------------------------------------------- */
//Active Account or Verify to Active

app.get("/user/:id/verify/:token", async (req, res) => {
  try {
    const token = await Token.findOne({
      userId: req.params.id, // Use req.params.id to find the user by ID
      token: req.params.token,
    });

    if (!token) {
      return res.status(404).send("Token not found");
    }

    // Update the user's verified status
    await User.updateOne(
      {
        _id: req.params.id,
      },
      { $set: { verified: true } }
    );

    // Remove the token after it has been used
    await Token.findByIdAndRemove(token._id);
    res.redirect("http://localhost:5173/Login");
  } catch (error) {
    res.status(500).send("Error verifying email");
  }
});
//---------------------------------------------------------------------------------------------------------------------
//Pasword Reset Apis------------------------

app.post("/resetlink", async (req, res) => {
  let user = await User.findOne({ email: req.body.email });
  if (!user) {
    // Handle the case where the user is not found
    return res.status(404).json({ message: "User not found" });
  }
  //Generate Token using JWT
  const token = Jwt.sign({ _id: user._id }, Jwtkey, { expiresIn: "2m" });
  //Update data store token in field user Schema
  const usertoken = await User.findByIdAndUpdate(
    { _id: user._id },
    { reset_pasword_token: token },
    { new: true }
  );
  // generate mail option
  if (usertoken) {
    let transport = nodemailer.createTransport({
      host: "smtp.gmail.com",
      service: "gmail",
      port: 587,
      secure: false,
      auth: {
        user: "atifali5410@gmail.com",
        pass: "uvcmbfjoqznxeopb",
      },
    });

    let info = await transport.sendMail({
      from: "<atifali5410@gmail.com>",
      to: req.body.email,
      subject: "reset link",
      text: `this link is valid for 2 Minutes http://localhost:5173/resetpassword/${user.id}?token=${usertoken.reset_pasword_token}`,
    });
    console.log("Message Sent: %s", info.messageId);
    res.status(200).json({ message: "Email sent successfully" });
  } else {
    res.status(500).json({ message: "Error sending email" });
  }
});

//verify user for pasword reset is he is verified or not
app.get("/forgotpasword/:id/:token", async (req, res) => {
  //get id and token from frontend params
  const { id, token } = req.params;

  try {
    //check if id and token available in db
    const validUser = await User.findOne({
      _id: id,
      reset_pasword_token: token,
    });
    //check token exxpires or not and tokenVeify._id means we have id in token or not
    const tokenVerify = Jwt.verify(token, Jwtkey);
    if (validUser && tokenVerify._id) {
      res.status(201);
    } else {
      res.status(401).json({ status: 401, message: "User is not exists" });
    }
  } catch (error) {
    res.status(401).json({ status: 401, error });
  }
});

//Update password with new password
app.post("/:id/:token", async (req, res) => {
  //get id token password and token using params from frontend
  const { id, token } = req.params;
  const { pasword, confirm_pasword } = req.body;
  try {
    //verify User
    const validUser = await User.findOne({
      _id: id,
      reset_pasword_token: token,
    });
    // check for valid token
    const tokenVerify = Jwt.verify(token, Jwtkey);
    //validation if both are correct
    if (validUser && tokenVerify._id) {
      const newPassword = await User.findByIdAndUpdate(
        { _id: id },
        { pasword: pasword, confirmpasword: confirm_pasword },
        { new: true }
      );
      if (newPassword) {
        res.status(200).json({ message: 'Password updated successfully' });
        newPassword.save();
      } else {
        res.status(500).json({ message: 'Failed to update password' });
      }
    } else {
      res.status(401).json({ message: 'Invalid user or token' });
    }
    } catch (error) {
      res.status(500).json({ message: 'Link Is expired' });
    }
});

app.listen(3000);

module.exports=app
