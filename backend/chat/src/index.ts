import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import chatRoutes from "./routes/chat.js";
import cors from "cors";
import { app, server } from "./config/socket.js";

dotenv.config();
const port = process.env.PORT;
// const app = express();

app.use(express.json());
app.use(cors());
app.use("/api/v1", chatRoutes);

connectDB()

server.listen(port, () =>{
    console.log(`Server is running on port ${port}`);
});


