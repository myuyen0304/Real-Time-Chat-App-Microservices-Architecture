import express from "express";
import dotenv from "dotenv";
import { starSendOtpConsumer } from "./consumer.js";

dotenv.config()
starSendOtpConsumer();

const app = express();

const port = process.env.PORT;

app.listen(port, () =>{
    console.log(`Server is running on port ${port}`);
});