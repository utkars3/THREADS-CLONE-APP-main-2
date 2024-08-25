import mongoose from 'mongoose';

const connectDB = async ()=> {
    try {
        
        // Connect to the database
        const conn=await mongoose.connect(process.env.MONGO_URI);

        // Log success message
        console.log(`Successfully connected : ${conn.connection.host}`);

    } catch (error) {
        // Handle connection errors
        console.error('Error connecting to the database:', error.message);
        process.exit(1)
    }
};

export default connectDB;
