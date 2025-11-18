import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRETE = process.env.JWT_SECRETE as string;

export const generateToken = (user:any) =>{
    return jwt.sign({user}, JWT_SECRETE, {expiresIn: "15d"});
};