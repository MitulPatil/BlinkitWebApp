const mongoose = require("mongoose");
const Joi = require("joi");

// Mongoose Product Schema with validation
const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 3,
    maxlength: 100,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  category: {
    type: String,
    required: true,
    minlength:3,
    maxlength:50,
  },
  stock: {
    type: Boolean,
    required: true,
  },
  description: {
    type: String,
  },
  image: {
    type: String,
  },
}, { timestamps: true });
 

// Joi validation function
function validateProduct(data) {
  const schema = Joi.object({
    name: Joi.string().min(3).max(100).required().trim(),
    price: Joi.number().min(0).required(),
    category: Joi.string().min(3).max(50).required(),
    stock: Joi.boolean().required(),
    description: Joi.string().optional(),
    image: Joi.string().optional(),
  });

  return schema.validate(data);
}

module.exports = {
  productModel:mongoose.model("product", productSchema),
  validateProduct,
};
