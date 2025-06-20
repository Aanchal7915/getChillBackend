const express = require("express");
const app = express();

const paymentRoutes = require("./routes/Payments");
const authRoute=require("./routes/Auth")
const adminRoute=require("./routes/Admin")

const database = require("./config/database");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();
const PORT = process.env.PORT || 4000;

//database connect
database.connect();

//middlewares
app.use(express.json());
app.use(
        cors({
                origin:"*",
                credentials:true,
        })
)
app.use((req, res, next) => {
  console.log("req came:", req.method, req.url);
  next();
});


//routes
app.use("/api/v1/payment", paymentRoutes);
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/admin", adminRoute);

app.get("/", (req, res) => {
        return res.json({
                success:true,
                message:'Your server is up and running....'
        });
});

app.listen(PORT, () => {
        console.log(`App is running at ${PORT}`)
})