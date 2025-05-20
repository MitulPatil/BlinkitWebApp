const mongoose = require("mongoose");
const Joi = require("joi");

// Mongoose Category Schema with validation
const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 3,
    maxlength: 50,
    unique: true,
  },
});
 

// Joi validation function
function validateCategory(data) {
  const schema = Joi.object({
    name: Joi.string().min(3).max(50).required().trim(),
  });

  return schema.validate(data);
}

module.exports = {
  categoryModel:mongoose.model("category", categorySchema),
  validateCategory,
};
