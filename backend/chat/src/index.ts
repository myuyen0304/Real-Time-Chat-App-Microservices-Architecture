import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import chatRoutes from "./routes/chat.js";

dotenv.config();
const port = process.env.PORT;
const app = express();

app.use(express.json());
app.use("/api/v1", chatRoutes);

connectDB()

app.listen(port, () =>{
    console.log(`Server is running on port ${port}`);
});


