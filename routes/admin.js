const express = require("express")
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {adminModel} = require("../models/admin");
const {productModel} = require("../models/product");
const {categoryModel} = require("../models/category");
const {validateAdmin} = require("../middlewares/admin");

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
    
                let token = jwt.sign({email:"admin123@test.com",admin:true},process.env.JWT_KEY);
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
        let token  = jwt.sign({email:"admit123@test.com",admin:true},process.env.JWT_KEY)
        res.cookie("token",token);
        res.redirect("/admin/dashboard");
    }
})

router.get("/dashboard",validateAdmin,async function(req,res){
    let prodcount= await productModel.countDocuments();
    let catecount= await categoryModel.countDocuments();
    res.render("admin_dashboard",{prodcount,catecount});
})

router.get("/products",validateAdmin,async function(req,res){
    
    const resultArray = await productModel.aggregate([
    {
        $group: {
        _id: "$category",
        products: { $push: "$$ROOT" }
        }
    },
    {
        $project: {
        _id: 0,
        category: "$_id",
        products: { $slice: ["$products", 10] }
        }
    }
    ]);

    // Convert the array to an object with category names as keys
    const resultObject = {};
    resultArray.forEach(cat => {
    resultObject[cat.category] = cat.products;
    });

    res.render("admin_products",{products: resultObject});
    
})

router.get("/logout",validateAdmin,function(res,res){
    res.cookie("token","");
    res.redirect("/admin/login");
})

module.exports = router;