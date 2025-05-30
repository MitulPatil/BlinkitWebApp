const express = require("express")
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {adminModel} = require("../models/admin");
const validateAdmin = require("../middlewares/admin");

require("dotenv").config();

if(typeof process.env.NODE_ENV != undefined &&
    process.env.NODE_ENV === "DEVELOPMENT"
){
    router.get('/create',async function(req,res){
    
            try{
                let salt = await bcrypt.genSalt(10);
                let hash = await bcrypt.hash("admin",salt);
    
                let user = new adminModel({
                    name:"mitul",
                    email:"admin123@test.com",
                    password:hash,
                    role:"admin",
                })
    
                await user.save();
    
                let token = jwt.sign({email:"admin123@test.com"},process.env.JWT_KEY);
                res.cookie("token",token);
                res.send("admin created successfully");
            }catch(err){
                res.send(err.message);
            }
        }) 
    
}

router.get("/login",function(req,res){
    res.render("admin_login");
})

router.post("/login",async function(req,res){
    let {email,password} = req.body;
    let admin = await adminModel.findOne({email});
    if(!admin) return res.send("this admin is not avilable");

    let valid = await bcrypt.compare(password,admin.password); // it return ture or false

    if(valid){
        let token  = jwt.sign({email:"admit123@test.com"},process.env.JWT_KEY)
        res.cookie("token",token);
        res.redirect("/admin/dashboard");
    }
})

router.get("/dashboard",validateAdmin,function(req,res){
    res.render("admin_dashboard");
})

router.get("/logout",function(res,res){
    res.cookie("token","");
    res.redirect("/admin/login");
})

module.exports = router;