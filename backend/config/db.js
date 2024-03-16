import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    // Connect to MongoDB server
    const connectionOptions = {
      useNewUrlParser: true,
      useUnifiedTopology: true
    };
    const conn = await mongoose.connect(process.env.MONGO_URI, connectionOptions);
    // Log successful connection
    console.log(`MongoDB connected to host: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
