const mongoose = require("mongoose");
const Joi = require("joi");

// Mongoose Order Schema with validation
const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  products: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "product",
      required: true,
    },
  ],
  totalPrice: {
    type: Number,
    required: true,
    min: 0,
  },
  address: {
    type: String,
    required: true,
    trim: true,
    minlength: 5,
    maxlength: 255,
  },
  status: {
    type: String,
    enum: ["pending", "confirmed", "shipped", "delivered", "cancelled"],
    required: true,
  },
  payment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "payment",
    required: true,
  },
  delivery: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "delivery",
  },
}, { timestamps: true });


// Joi validation function
function validateOrder(data) {
  const schema = Joi.object({
    user: Joi.string().required(),
    products: Joi.array()
      .items(Joi.string().required()).required(),
    totalPrice: Joi.number().min(0).required(),
    address: Joi.string().min(5).max(255).required(),
    status: Joi.string().valid("pending", "confirmed", "shipped", "delivered", "cancelled").required(),
    payment: Joi.string().required(),
    delivery: Joi.string().optional(),
  });

  return schema.validate(data);
}

module.exports = {
  orderModel:mongoose.model("order", orderSchema),
  validateOrder,
};
