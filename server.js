const express = require("express");
const path = require("path");
const dotenv = require("dotenv");
const morgan = require("morgan");
const colours = require("colours");
const bootcamps = require("./routes/bootcamps.js");
const courses = require("./routes/courses.js");
const auth = require("./routes/auth");
const reviews = require("./routes/reviews");
const users = require("./routes/users");
const connectDB = require("./config/db.js");
const errorHandeler = require("./middleware/error.js");
const fileUpload = require("express-fileupload");
const cookieParser = require("cookie-parser");

//load env vars
dotenv.config({path:"./config/config.env"});

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// mounting cookie parser...
app.use(cookieParser());

//connect to database
connectDB();



// Dev logging middleware via morgan
if(process.env.NODE_ENV === "developement"){
   app.use(morgan("dev"));
}

// using a static folder
app.use(express.static(path.join(__dirname, "public")));

// mounting fileupload miidleware
app.use(fileUpload());

// mounting bootcamp routers
app.use("/api/v1/bootcamps", bootcamps);

// mounting courses routers
app.use("/api/v1/courses", courses);

// mounting the auth router
app.use("/api/v1/auth/", auth)

// mounting the users router
app.use("/api/v1/users", users);

// mounting the reviews router
app.use("/api/v1/reviews", reviews);

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

