const {instance}= require("../config/razorpay");
const { default: mongoose } = require("mongoose");
const Payment=require('../models/Payment')
const crypto = require("crypto");

//capture the payment and initiate the razorpay order
exports.capturePayment=async(req,res)=>{
    try{
        //get courseId and userId
        const {phoneNu, name, amount : price}=req.body;        
       
        //order create
        const amount=parseFloat(price);
        const currency='INR';
        const options={
            amount:amount*100,
            currency:currency,
            receipt:Math.random(Date.now()).toString(),
            notes:{
                phoneNu,
                name
            }
        };
        try{
            //initiate the payment using razorpay
            const paymentResponse=await instance.orders.create(options);
            console.log(paymentResponse);
            return res.status(200).json({
                success:true,
                orderId: paymentResponse.id,
                currency:paymentResponse.currency,
                amount:paymentResponse.amount,
            });
        }catch(err){
            console.log("From cpature-payment error:",err);
            return res.json({
                success:false,
                message:"could not initiate order"
            });
        }
        //return re
        return res.status(200).json({
            success:true,
            
        })
    }catch(err){
        return res.json({
            success:false,
            message:"Please provide valid course ID"
        });
    }
}

//verifySignature of Razorpay and server
exports.verifySignature=async(req,res)=>{
    try{
        const webhookSecrete="12345";
        
        const signature=req.headers['x-razorpay-signature'];
        const shasum=crypto.createHmac("sha256",webhookSecrete);
        shasum.update(JSON.stringify(req.body));
        const digest=shasum.digest("hex");
        if(signature===digest){
            console.log("payment is Authorised!");

            const payment=req.body.payload.payment.entity;
            console.log("payment: ", payment)
            try{
                //fullfill the action
                await Payment.create({
                    name: payment.notes?.name || "N/A",
                    phone: payment.notes?.phoneNu || "N/A",
                    razorpay_payment_id: payment.id,
                    razorpay_order_id: payment.order_id,
                    razorpay_signature: signature,
                    status: "success",
                });

                return res.status(200).json({
                    success:true,
                    message:"Signature verified and course added!"
                });
            }catch(err){
                console.log("error from verify payment inner tyr: ", err)
                return res.status(500).json({
                    success:false,
                    message:"server error!"
                });
            }
        }else{
            return res.status(400).json({
                success:false,
                message:"Invalid request!"
            });
        }

    }catch(err){ 
        console.log("error from verify payment outer tyr: ", err)
        return res.status(500).json({
            success:false,
            message:"Server Error!"
        });
    }
}
