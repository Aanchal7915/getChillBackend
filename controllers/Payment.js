const { instance } = require("../config/razorpay");
const { default: mongoose } = require("mongoose");
const Payment = require('../models/Payment')
const crypto = require("crypto");
require("dotenv").config();

//capture the payment and initiate the razorpay order
exports.capturePayment = async (req, res) => {
    try {
        //get courseId and userId
        const { phoneNu, name, amount: price, address } = req.body;

        //order create
        const amount = parseFloat(price);
        const currency = 'INR';
        const options = {
            amount: amount * 100,
            currency: currency,
            receipt: `order_${name}_${Date.now()}`,
            notes: {
                contact:phoneNu,
                name,
                address
            }
        };
        try {
            //initiate the payment using razorpay
            const paymentResponse = await instance.orders.create(options);
            console.log(paymentResponse);
            return res.status(200).json({
                success: true,
                orderId: paymentResponse.id,
                currency: paymentResponse.currency,
                amount: paymentResponse.amount,
            });
        } catch (err) {
            console.log("From cpature-payment error:", err);
            return res.json({
                success: false,
                message: "could not initiate order"
            });
        }
        //return re
        return res.status(200).json({
            success: true,

        })
    } catch (err) {
        return res.json({
            success: false,
            message: "Please provide valid course ID"
        });
    }
}

//verifySignature of Razorpay and server
exports.verifySignature = async (req, res) => {
    try {
        console.log("verify payment called!");
        const webhookSecrete = process.env.RAZORPAY_WEBHOOK_SECRET;

        const signature = req.headers['x-razorpay-signature'];
        const shasum = crypto.createHmac("sha256", webhookSecrete);
        shasum.update(JSON.stringify(req.body));
        const digest = shasum.digest("hex");
        consoel.log("digest: ", digest, signature);
        if (signature === digest) {
            console.log("payment is Authorised!");

            const payment = req.body.payload.payment.entity;
            console.log("payment: ", payment)

            const statusEntry = {
                status: payment.status,
                at: new Date(payment.created_at * 1000)
            };

            const paymentDetails = {
                upi: payment.vpa,
                bank: payment.bank,
                wallet: payment.wallet,
                card_id: payment.card_id,
                ...payment.upi,
                ...payment.acquirer_data
            };

            const updatedData = {
                razorpay_payment_id: payment.id,
                razorpay_order_id: payment.order_id,
                razorpay_signature: req.body.signature, // if included

                name: payment.notes?.name,
                address:payment.notes?.address,
                email: payment.email,
                contact: payment.contact,
                location:payment.notes?.location,

                method: payment.method,
                payment_details: paymentDetails,

                amount: payment.amount/100,
                base_amount: payment.base_amount,
                currency: payment.currency,
                fee: payment.fee,
                tax: payment.tax,

                description: payment.description,
                captured: payment.captured,
                international: payment.international,
                reward: payment.reward,
                acquirer_data: payment.acquirer_data,

                error_code: payment.error_code,
                error_description: payment.error_description,
                error_reason: payment.error_reason,

                paymentStatus: payment.status,
            };



            try {
                //fullfill the action
                const saved = await Payment.findOneAndUpdate(
                    { razorpay_payment_id: payment.id },
                    {
                        $set: updatedData,
                        $push: { status_history: statusEntry },
                        $setOnInsert: { createdAt: new Date() },
                    },
                    { upsert: true, new: true }
                );

                return res.status(200).json({
                    success: true,
                    message: "Signature verified and course added!",
                    data: saved
                });
            } catch (err) {
                console.log("error from verify payment inner tyr: ", err)
                return res.status(500).json({
                    success: false,
                    message: "server error!"
                });
            }
        } else {
            console.log("payment is not authorised!");
            return res.status(400).json({
                success: false,
                message: "Invalid request!"
            });
        }

    } catch (err) {
        console.log("error from verify payment outer try: ", err)
        return res.status(500).json({
            success: false,
            message: "Server Error!"
        });
    }
}
