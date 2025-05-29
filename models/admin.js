const mongoose = require("mongoose");
const Joi = require("joi");

// Mongoose Admin Schema with validation
const adminSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 3,
    maxlength: 50,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    unique: true,
    match: /^\S+@\S+\.\S+$/,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
    enum: ["superadmin", "admin"], // example roles
    default: "admin",
  },
  },
  {timestamps:true},
);


// Joi validation function
function validateAdmin(data) {
  const schema = Joi.object({
    name: Joi.string().min(3).max(50).required(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    role: Joi.string().valid("superadmin", "admin").required(),
  });

  return schema.validate(data);
}

module.exports = {
  adminModel:mongoose.model("admin", adminSchema),
  validateAdmin,
};
