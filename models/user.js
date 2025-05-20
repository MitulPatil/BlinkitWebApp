const mongoose = require("mongoose");
const Joi = require("joi");

// Mongoose Address Schema with validation
const AddressSchema = new mongoose.Schema({
  state: {
    type: String,
    required: true,
    minlength:2,
    maxlength:50,
    trim:true,
  },
  zip: {
    type: Number,
    required: true,
    min:10000,
    max:999999,
  },
  city: {
    type: String,
    required: true,
    minlength:2,
    maxlength:50,
    trim:true,
  },
  address: {
    type: String,
    required: true,
    minlength: 5,
    maxlength:255,
  },
});

// Mongoose User Schema with validation
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 50,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      match: /^\S+@\S+\.\S+$/,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    phone: {
      type: Number,
      required: true,
      match:/^[0-9]{10}$/,
    },
    addresses: {
      type: [AddressSchema],
      required: true,
    },
  },
  { timestamps: true }
);



// Joi Validation Function
function validateUser(data) {
  const addressSchema = Joi.object({
    state: Joi.string().min(3).max(50).required(),
    zip: Joi.number().min(10000).max(99999).required(),
    city: Joi.string().min(3).max(50).required(),
    address: Joi.string().min(5).max(255).required(),
  });

  const schema = Joi.object({
    name: Joi.string().min(3).max(50).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    phone: Joi.string()
      .pattern(/^[0-9]{10}$/)
      .required(),
    addresses: Joi.array().items(addressSchema).min(1).max(5).required(),
  });

  return schema.validate(data);
}

module.exports = {
  userModel:mongoose.model("user",userSchema),
  validateUser,
};
