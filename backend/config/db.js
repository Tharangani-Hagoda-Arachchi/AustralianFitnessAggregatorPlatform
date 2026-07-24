import mongoose from "mongoose";

//create mongodb connection with new db
export const connectDB = async() =>{
    try{
        const connection = await mongoose.connect(process.env.MONGO_URI, {
            dbName: "fitnessmanager"
        });
        console.log("MongoDB connected successfully");

        mongoose.connection.on("error", (err) =>{
            console.error("MongoDB connection have error");
            console.error(err.message)
        });

        mongoose.connection.on("disconnected", () =>{
            console.warn("MongoDB disconnected");
        });
        
        process.on("SIGINT", async() =>{
            await mongoose.connection.close();
            console.log("MongoDB connection closed");
            process.exit(0);
        });
        

    }catch(error){
         console.error("MongoDB connection error");
         console.error(error.message);
         process.exit(1);
    }
};