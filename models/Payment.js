const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    razorpay_payment_id: { type: String, required: true },
    razorpay_order_id: { type: String},
    razorpay_signature: { type: String},
    status: { type: String, enum: ["success", "failed"] },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Payment", paymentSchema);
