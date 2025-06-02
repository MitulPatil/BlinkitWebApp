const express = require("express")
const router = express.Router();
const {productModel, validateProduct } = require("../models/product");
const {categoryModel , validateCategory} = require("../models/category");
const upload = require("../config/multer_config");
const validateAdmin = require("../middlewares/admin");

router.get("/",async function(req,res){ // to get all products 
    let prods = await productModel.find();
    res.render("index");
})
router.post("/", upload.single('image'),async function(req,res){ // it will create product 
    let {name,price,category,stock,description,image} = req.body;
    
    let {error} = validateProduct({
        name,
        price,
        category,
        stock,
        description,
        image
    })
    if (error) return res.send(error.message);

    let categoryName = category.charAt(0).toUpperCase() + category.slice(1).toLowerCase();
    let isCategory = await categoryModel.findOne({name: categoryName});

    if(!isCategory){
        await categoryModel.create({name:category});
    }    
    //console.log(req.file); // when you store your image using multer you image is store in req.file

    await productModel.create({
        name,
        price,
        category:categoryName,
        stock,
        description,
        image : req.file.buffer,
    })

    res.redirect(`/admin/dashboard`);    
})

router.get("/delete/:id",validateAdmin,async function(req,res){
    if(req.user.admin){
        let prods = await productModel.findOneAndDelete({_id: req.params.id});
        return  res.redirect("/admin/products");
    }
    res.send("you are not allowed to delete this product.");
})

router.post("/delete", validateAdmin ,async function(req,res){
    if(req.user.admin){
        let prods = await productModel.findOneAndDelete({_id: req.body.product_id});
        return  res.redirect("back"); // using back you will redirect to the previous page 
    }
    res.send("you are not allowed to delete this product.");
})

module.exports = router;