const express = require("express")
const dotenv = require("dotenv")


//load env vars
dotenv.config({path:"./config/config.env"});

const app = express();

const port = process.env.PORT || 4040;

// 
app.listen(port ,()=>{
   console.log( `server runniong on port ${port} in "${process.env.NODE_ENV} mode"`);
})