const mongoose = require("mongoose");

const statusSchema = new mongoose.Schema({
  status: { type: String, enum: ["authorized", "captured", "failed"], required: true },
  at: { type: Date, default: Date.now }
}, { _id: false });

const paymentSchema = new mongoose.Schema({
  razorpay_payment_id: { type: String, required: true, unique: true },
  razorpay_order_id: { type: String },
  razorpay_signature: { type: String },

  name: { type: String },
  phone: { type: String },
  email: { type: String },
  contact: { type: String },
  service:{type:string},

  method: { type: String, enum: ["upi", "card", "netbanking", "wallet", "emi"] },
  payment_details: { type: mongoose.Schema.Types.Mixed }, // e.g. vpa, card network, bank name

  amount: { type: Number, required: true },
  base_amount: { type: Number },
  currency: { type: String, default: "INR" },
  fee: { type: Number },
  tax: { type: Number },

  description: { type: String },
  captured: { type: Boolean },
  international: { type: Boolean },
  reward: { type: mongoose.Schema.Types.Mixed },

  acquirer_data: { type: mongoose.Schema.Types.Mixed },

  error_code: { type: String },
  error_description: { type: String },
  error_reason: { type: String },

  service_name: { type: String },
  service_id: { type: mongoose.Schema.Types.ObjectId, ref: "Service" },

  status_history: [statusSchema],
  finalStatus: { type: String, enum: ["authorized", "captured", "failed"], default: "authorized" }
}, { timestamps: true });

paymentSchema.index({ razorpay_payment_id: 1 }, { unique: true });

module.exports = mongoose.model("Payment", paymentSchema);
