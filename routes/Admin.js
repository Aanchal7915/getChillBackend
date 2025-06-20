const express = require("express");
const router = express.Router();
const { login } = require("../controllers/Auth");
const {authN, authZ} = require("../middleware/AuthNAuthZ");
const { getAllBookings, updateServiceStatus } = require("../controllers/Admin");
router.post("/login", login);

// Only admin can access this route
router.get("/admin-data", authN, authZ("admin"), getAllBookings);
router.put("/update-status", /*authN, authZ("admin"),*/ updateServiceStatus);
module.exports = router;