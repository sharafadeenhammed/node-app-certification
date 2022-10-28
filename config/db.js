const mongoose = require("mongoose");

const connectDB =async ()=>{
    const conn = await mongoose.connect(process.env.MONGO_LOCAL_URI);
    
    console.log(`\nmongoDB conneected to: ${conn.connection.host}:${conn.connection.port} and using the ${conn.connection.name} DATA-BASE`.cyan.underline);
}

module.exports= connectDB;