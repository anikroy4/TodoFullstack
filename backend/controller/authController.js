const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../model/userModel');

const generateAccessToken = (user) => {
        return jwt.sign({id:user._id}, process.env.ACCESS_SECRET, {expiresIn:'15m'} );
    };
const generateRefreshToken = (user) => {
        return jwt.sign({id:user._id}, process.env.REFRESH_TOKEN, {expiresIn:'30d'} );
    };

let registrationController=async(req,res)=>{

    const {username,email,password}=req.body;

    const hashed= await bcrypt.hash(password,10);

    const user= new User({
        username:username,
        email:email,
        password:hashed,
        isVerified:false

    });

    user.save();

    res.send("Registration successful. Please check your email to verify your account.");
    

}
    

let loginController=(req,res)=>{
    res.send("ami login krse");
    
}

module.exports={
    registrationController,
    loginController
}