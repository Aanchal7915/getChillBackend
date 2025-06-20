const Payment = require("../models/Payment"); // Adjust path if needed

// Fetch bookings with filters and pagination
exports.getAllBookings = async (req, res) => {
  try {
    // Query parameters
    let { paymentStatus, serviceStatus, page = 1, limit = 10 } = req.query;
    paymentStatus=paymentStatus?.toLowerCase();
    serviceStatus=serviceStatus?.toLowerCase();
    console.log(serviceStatus, paymentStatus)

    // Build filter object
    const filter = {};
    if (paymentStatus) filter.paymentStatus = paymentStatus;
    if (serviceStatus !== undefined) filter.serviceStatus = serviceStatus == "true";

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    // Fetch filtered and paginated bookings
    const bookings = await Payment.find(filter)
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    // Get total count for pagination info
    const total = await Payment.countDocuments(filter);
    res.json({
      success: true,
      data: bookings,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Update finalStatus of a booking
exports.updateServiceStatus = async (req, res) => {
  const { bookingId, serviceStatus } = req.body;
  try {
    const booking = await Payment.findByIdAndUpdate(
      bookingId,
      { serviceStatus },
      { new: true }
    );
    if (!booking) {
      return res.status(404).json({ success: false, message: "Booking not found" });
    }
    res.json({ success: true, data: booking });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};