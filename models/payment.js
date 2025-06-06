const mongoose = require("mongoose");
const Joi = require("joi");

// Mongoose Payment Schema with validation
const paymentSchema = new mongoose.Schema({
  orderId: {
    type: String,
    required: true,
  },
  paymentId: {
    type: String,
    required:true,
  },
  signature: {
    type: String,
  },
  amount: {
    type: Number,
    required: true,
    min:0
  },
  currency: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    default: 'pending',
  },
}, { timestamps: true });
 

// Joi validation function
function validatePayment(data) {
  const schema = Joi.object({
    orderId: Joi.string().required(),
    paymentId: Joi.string().required(),
    signature: Joi.string(),
    amount: Joi.number().min(0).required(),
    currency: Joi.string().required(),
    status: Joi.string().required(),
    // method: Joi.string().required(),
    // transactionID: Joi.string().required(),
  });

  return schema.validate(data);
}

module.exports = {
  paymentModel:mongoose.model("payment", paymentSchema),
  validatePayment,
};
