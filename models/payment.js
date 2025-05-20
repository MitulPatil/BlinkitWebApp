const mongoose = require("mongoose");
const Joi = require("joi");

// Mongoose Payment Schema with validation
const paymentSchema = new mongoose.Schema({
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "order",
    required: true,
  },
  amount: {
    type: Number,
    required: true,
    min: 0,
  },
  method: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
  transactionID: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
}, { timestamps: true });
 

// Joi validation function
function validatePayment(data) {
  const schema = Joi.object({
    order: Joi.string().required(),
    amount: Joi.number().min(0).required(),
    method: Joi.string().required(),
    status: Joi.string().required(),
    transactionID: Joi.string().required(),
  });

  return schema.validate(data);
}

module.exports = {
  paymentModel:mongoose.model("payment", paymentSchema),
  validatePayment,
};
