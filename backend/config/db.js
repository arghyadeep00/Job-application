import mongoose from "mongoose";
import dns from 'dns'
const conn = async () => {
  try {
    dns.setServers(['8.8.8.8']);
    await mongoose.connect(process.env.MONGO_URI);
    console.log("mongodb connected");
  } catch (error) {
    console.log(error)
    console.log("mongodb connection failed")
  }
};

export default conn;