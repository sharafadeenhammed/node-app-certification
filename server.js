const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const colours = require("colours")
const bootcamps = require("./routes/bootcamps.js");
const connectDB = require("./config/db.js");
const errorHandeler = require("./middleware/error.js");
const deviceDetector  = require("node-device-detector");
const detector = new deviceDetector({
   clientIndexes: true,
   deviceIndexes: true,
   deviceAliasCode: false,
 });

//load env vars
dotenv.config({path:"./config/config.env"});

const app = express();
app.use(express.json());
app.use(express(express.urlencoded({extended:false})));

//connect to database
connectDB();

/*
// using the  node device detector...
//{status:"error",message:"cannot dereminethe type of device..."}
//req.headers["user-agent"]
app.get("/",(req,res)=>{
   res.send(req.headers["user-agent"] ? detector.detect(req.headers["user-agent"]) : {status:"error",message:"cannot deremine the type of device..."});
})
*/



// Dev logging middleware via morgan
if(process.env.NODE_ENV === "developement"){
   app.use(morgan("dev"));
}

// mount routers
app.use("/api/v1/bootcamps",bootcamps);

// mounting error handeler middle ware
app.use(errorHandeler);

const port = process.env.PORT || 4040;
const server = app.listen(port, ()=>{
   console.log( `server running on port ${port} in "${process.env.NODE_ENV} mode"`.yellow.bold);
})

process.on("unhandledRejection",(err,promise)=>{
   console.log(`unhandeled rejections ${err.message}`.trimEnd.bolder);
   server.close(()=>{process.exit(1)});
})

