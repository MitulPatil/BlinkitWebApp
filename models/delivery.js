const mongoose = require("mongoose");
const Joi = require("joi");

// Mongoose Delivery Schema with validation
const deliverySchema = new mongoose.Schema({
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "order",
    required: true,
  },
  deliveryBoy: {
    type: String,
    required: true,
    trim: true,
    minlength: 3,
    maxlength: 50,
  },
  status: {
    type: String,
    required: true,
    enum: ["pending", "in-transit", "delivered", "cancelled"],
  },
  trackingURL: {
    type: String,
    trim: true,
  },
  astimatedDeliveryTime: {
    type: Number,
    min: 0,
    required: true,
  },
}, { timestamps: true });
 

// Joi validation function
function validateDelivery(data) {
  const schema = Joi.object({
    order: Joi.string().required(),
    deliveryBoy: Joi.string().min(3).max(50).required(),
    status: Joi.string().valid("pending", "in-transit", "delivered", "cancelled").required(),
    trackingURL: Joi.string().uri().optional(),
    astimatedDeliveryTime: Joi.number().min(0).required(),
  });

  return schema.validate(data);
}

module.exports = {
  deliveryModel:mongoose.model("delivery", deliverySchema),
  validateDelivery,
};
