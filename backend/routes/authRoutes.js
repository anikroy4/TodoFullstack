const express=require('express');
const { registrationController, loginController, verifyController }=require('../controller/authController');
const router=express.Router();    

router.post('/registration', registrationController)
router.post('/verify/:token', verifyController)
router.post('/login', loginController)

module.exports=router;