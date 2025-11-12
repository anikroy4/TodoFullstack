const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../model/userModel');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    }   

})

const generateAccessToken = (user) => {
        return jwt.sign({id: user._id}, process.env.ACCESS_SECRET, {expiresIn:'15m'} );
    }; 
 const generateRefreshToken = (user) => {
        return jwt.sign({id: user._id}, process.env.REFRESH_TOKEN, {expiresIn:'30d'} );
    };

let registrationController=async(req,res)=>{ 

    const {username,email,password}=req.body;


    // Username Password email validation start

    if(!username){
        return res.send({error:"Username is required"});
    }
    if(!email){
        return res.send({error:"Email is required"});
    }
    if(!password){
        return res.send({error:"Password is required"});
    }

    // email validation start
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.send({ error: "Invalid email format" });
    }

    // password validation start
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;
    if (!passwordRegex.test(password)) {
        return res.send({ error: "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one digit." });
    }   

    // Username Password email validation End


    const userExists=await User.findOne({email:email});

     if(userExists){
        return res.send({error:`${email} already exists`});
     }

    const hashed= await bcrypt.hash(password,10);

    const user= new User({
        username:username,
        email:email,
        password:hashed,
        isVerified:false
    }); 
    try {
        await user.save();
        const varificationToken= jwt.sign({id:user._id},process.env.ACCESS_SECRET, {expiresIn :'15m'});
        const verifyLink = `${process.env.CLIENT_URL}/verify/${varificationToken}`;
        await transporter.sendMail({
            from:process.env.EMAIL_USER,
            to:user.email,
            subject:"Verify your account",
            html:`<h4>Hello ${user.username}, please verify your Email</h4>
                <p>Please verify your account by clicking the following link:</p>
                <a href="${verifyLink}">Verify Now</a>
                <p>This link will expire in 15 minutes.</p>
                <p>If you did not request this, please ignore this email.</p>`
        })
        res.send("Registration successful. Please check your email to verify your account.");
    } catch (error) {
        console.log("Error during registration:", error);
        res.send({ error: "Registration failed. Please try again later." });
    }

    

    

}


let verifyController= async(req,res)=>{
    const {token}=req.params;

    try {
        const decoded = jwt.verify(token, process.env.ACCESS_SECRET);

        const userExists = await User.findOne({ _id: decoded.id });

        if (!userExists) {
            return res.send({error:"User not found"});
        }
        userExists.isVerified = true;
        await userExists.save();
        res.send({message:"Email verified successfully"});
        
    } catch (error) {
        res.send({error:"Invalid token or token expired"});
    }

    

}
    

let loginController=(req,res)=>{
    res.send("ami login krse");
    
}

module.exports={
    registrationController,
    verifyController,
    loginController
}