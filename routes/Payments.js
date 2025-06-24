// Import the required modules
const express = require("express")
const router = express.Router()

const { capturePayment, verifySignature } = require("../controllers/Payment");
router.post("/create-order", capturePayment)
router.post("/verifySignature", verifySignature)

module.exports = router