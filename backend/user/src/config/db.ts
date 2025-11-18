import mongoose from "mongoose";

const connectDB = async() => {
    const url = process.env.MONGO_URI;

    if(!url){
        throw new Error("MONGO_URI is not defined in env variables");
    }
    try {
        await mongoose.connect(url, {
            dbName: "ChatappMicroservice"
        });
        console.log("Connected to Mongodb")
    } catch (error) {
        console.error("Failed to connect to Mongodb", error);
        process.exit(1);
    }
};

export default connectDB;