const express=require('express');
const { registrationController, loginController, refreshController,verifyController, forgotPasswordController,resetPasswordController }=require('../controller/authController');
const router=express.Router();    

router.post('/registration', registrationController)
router.post('/verify/:token', verifyController)

router.post('/login', loginController)
router.post('/refresh', refreshController)
router.post('/forgot-password', forgotPasswordController)
router.post('/reset-password/:token', resetPasswordController)

module.exports=router;