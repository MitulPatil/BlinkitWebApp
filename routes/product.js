const express = require("express")
const router = express.Router();
const {productModel, validateProduct } = require("../models/product");
const {categoryModel , validateCategory} = require("../models/category");
const upload = require("../config/multer_config");

router.get("/",async function(req,res){ // to get all products 
    let prods = await productModel.find();
    res.send(prods);
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

    let isCategory = await categoryModel.findOne({name: category});

    if(!isCategory){
        await categoryModel.create({name:category});
    }    
    //console.log(req.file); // when you store your image using multer you image is store in req.file

    await productModel.create({
        name,
        price,
        category,
        stock,
        description,
        image : req.file.buffer,
    })

    res.redirect(`/admin/dashboard`);    
})

module.exports = router;