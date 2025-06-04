const express = require("express");
const router = express.Router();
const {categoryModel} = require("../models/category");
const {validateAdmin} = require("../middlewares/admin");

router.post("/create",validateAdmin,async function(req,res){
    if(req.user.admin){
        let name = req.body.name;
        name = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
        
        await categoryModel.create({name});
        return res.redirect("/admin/dashboard");
    }
    res.send("you are not allowed to create category.");
})

module.exports = router;