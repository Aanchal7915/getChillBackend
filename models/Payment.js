const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    razorpay_payment_id: { type: String, required: true },
    razorpay_order_id: { type: String, required: true },
    razorpay_signature: { type: String, required: true },
    status: { type: String, enum: ["success", "failed"], required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Payment", paymentSchema);
