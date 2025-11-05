const express=require('express');
const router=express.Router();    

router.post('/registration', () => {
    console.log("ami registration");
    
})
router.post('/login', () => {
    console.log("ami login");
    
})

module.exports=router;