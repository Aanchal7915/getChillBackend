// Import the required modules
const express = require("express")
const router = express.Router()
const {authN, authZ} = require("../middleware/AuthNAuthZ");

const { capturePayment, verifySignature } = require("../controllers/Payment");
router.post("/create-order", capturePayment)
router.post("/verifySignature", express.raw({ type: 'application/json' }), verifySignature)

module.exports = router