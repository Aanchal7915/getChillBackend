const express = require("express");
const app = express();

const paymentRoutes = require("./routes/Payments");

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
                origin:"http://localhost:5173",
                credentials:true,//HW explore, its flag
        })
)


//routes
app.use("/api/v1/payment", paymentRoutes);

app.get("/", (req, res) => {
        return res.json({
                success:true,
                message:'Your server is up and running....'
        });
});

app.listen(PORT, () => {
        console.log(`App is running at ${PORT}`)
})