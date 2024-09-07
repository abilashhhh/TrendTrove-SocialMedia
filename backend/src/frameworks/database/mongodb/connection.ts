import mongoose from "mongoose";
import configurationKeys from "../../../config";

const connectToMongoDB = async () => {
    try {
        await mongoose.connect(configurationKeys.MONGODB);
        console.log("Connected to MongoDB");
        console.log("---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------");
    } catch (err) {
        console.error("Error connecting to MongoDB:", err);
    }
};

export default connectToMongoDB;
