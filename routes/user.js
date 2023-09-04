const {Router} = require('express');
const User = require('../schema/user');
const { createHmac, randomBytes } = require('node:crypto');
const {createJwtToken} = require('../service/authentication');
const router = Router();

router.get('/signin',(req,res) =>{
    return res.render('signin');
});

router.get('/signup',(req,res) =>{
    return res.render('signup');
});

router.post('/signup',async(req,res)=>{
    
    const {fullName,email,password} = req.body;
    await User.create({
        fullName,
        email,
        password,
    });
    return res.redirect('/');
});

router.post('/signin',async(req,res)=>{
    const {email,password} = req.body;
    const user =await User.findOne({email});
    console.log(user);
    if(!user) return res.render("signin",{
        error:"Incorrect User Or Password",
    });
    const salt = user.salt;
    const hashedPassword = user.password;
    const userHashedPassword = createHmac('sha256', salt)
    .update(password)
    .digest("hex");
    if(hashedPassword === userHashedPassword) {
        console.log("correct password");
        const token = createJwtToken(user);
        return res.cookie("token" , token).redirect('/');
    }
    return res.render("signin",{
        error:"Incorrect User Or Password",
    });
});

router.get('/logout',(req,res) =>{
    res.clearCookie("token").redirect("/");
});

module.exports=router;