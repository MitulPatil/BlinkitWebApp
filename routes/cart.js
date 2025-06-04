const express = require("express");
const router = express.Router();
const {cartModel, validateCart} = require("../models/cart");
const {validateAdmin, userIsLoggedIn} = require("../middlewares/admin");
const {productModel} = require("../models/product"); 

router.get("/",userIsLoggedIn,async function(req,res){
    try{
        let cart = await cartModel.find({user: req.session.passport.user})
        res.send(cart);
    }catch(err){
        res.send(err.message);
    }
})

router.get("/add/:id",userIsLoggedIn,async function(req,res){
    try{
        let cart = await cartModel.findOne({user: req.session.passport.user});
        let product = await productModel.findOne({_id: req.params.id});
        if(!cart){
            cart = await cartModel.create({
                user : req.session.passport.user,
                products:[req.params.id],
                totalPrice:Number(product.price),
            });
        }
        else{
            cart.products.push(req.params.id);
            cart.totalPrice = Number(cart.totalPrice) + Number(product.price);

            await cart.save();
        }

        res.send(cart);
    }catch(err){
        res.send(err.message);
    }
})

module.exports = router;