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
    

let loginController= async(req,res)=>{

    const {email,password}=req.body;

    if(!email){
        return res.send({error:"Email is required"});
    }
    if(!password){
        return res.send({error:"Password is required"});
    }

    const userExists=await User.findOne({email:email});
    if(!userExists){
        return res.send({error:"User not found"});
    }
    if(!userExists.isVerified){
        return res.send({error:"Please verify your email"});
    }
    const isPasswordMatch= await bcrypt.compare(password,userExists.password);
    if(!isPasswordMatch){
        return res.send({error:"Invalid password"});
    }
    const accessToken=generateAccessToken(userExists);
    const refreshToken=generateRefreshToken(userExists);
    userExists.refreshToken=refreshToken;
    await userExists.save();
    res.cookie('refreshToken',refreshToken,{
        httpOnly:true,
        Secure:false,
        sameSite:'strict',
        maxAge:30*24*60*60*1000 //30 days

    });
    res.send({message:"Login successful",
        accessToken:accessToken,
        username:userExists.username,
        email:userExists.email
    });

    
    
}

const refreshController= async(req,res)=>{
    const token= req.cookies.refreshToken;
    if(!token){
        return res.send({error:"Token not found"});
    }
    const userExists=await User.findOne({refreshToken:token});
    if(!userExists){
        return res.send({error:"Invalid token"});
    }
    jwt.verify(token,process.env.REFRESH_TOKEN,(err,decoded)=>{
        if(err){
            return res.send({error:"Invalid token"});
        }
        const accessToken=generateAccessToken(userExists);
        res.send({accessToken});
    })


   

} 


const forgotPasswordController=async(req,res)=>{
    const {email}=req.body;
    if(!email){
        return res.send({error:"Email is required"});
    }
    const userExists=await User.findOne({email:email});
    if(!userExists){
        return res.send({error:"User not found"});
    }
    
    const resetToken=jwt.sign({id:userExists._id},process.env.ACCESS_SECRET,{expiresIn:'15m'});
    const resetLink=`${process.env.CLIENT_URL}/reset-password/${resetToken}`;
    try {
        await transporter.sendMail({
            from:process.env.EMAIL_USER,
            to:userExists.email,
            subject:"Reset your password",
            html:`<h4>Hello ${userExists.username}, please reset your password</h4>
                <p>Please reset your password by clicking the following link:</p>
                <a href="${resetLink}">Reset Now</a>
                <p>This link will expire in 15 minutes.</p>
                <p>If you did not request this, please ignore this email.</p>`
        })
        res.send({message:"please check your email to reset your password"});
        
    } catch (error) {

        res.send({ error: "Forgot password failed. Please try again later." });

    }
}



const resetPasswordController=async(req,res)=>{
       const {token}=req.params;
       const {password}=req.body;

       try {
            const decoded=jwt.verify(token,process.env.ACCESS_SECRET);

            const userExists=await User.findById(decoded.id);
            if(!userExists){
                return res.send({error:"User not found"});
            }
           
            userExists.password=await bcrypt.hash(password,10);
            await userExists.save();
            res.send({message:"Password reset successful"});
            
            
       } catch (error) {
        res.send({error:"Invalid token or token expired"});
        
       }

        
}

module.exports={
    registrationController,
    verifyController,
    loginController, 
    refreshController,
    forgotPasswordController,
    resetPasswordController

}