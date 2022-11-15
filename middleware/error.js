const ErrorResponse = require("../utils/errorResponse.js");
function errorHandeler(err,req,res,next){
    let error = {...err};
    //mongoosse bad Object ID.
    if(err.name === "CastError"){
        const message = error.message?error.message:`Invalid Search Attempted With an ID of ${err.value}`;
        error = new ErrorResponse(message, 400);
        
    }

    //mongoose duplicate key
    if(err.code === 11000){
        const message = `Duplicate field value entered`;
        error = new ErrorResponse(message,400)
    }
    
   
   if(err.name === "ValidationError"){
    let message = ""
        for(e in err.errors){
            message += err.errors[e].properties.message+","
        }
        message = message.substring(0,message.length-1); 
        error = new ErrorResponse(message,400)        
    }
    res.status(error.statusCode || 500).json({
        success: false,
        err: error.message || error.msg || "Server Error"
    })
}
module.exports = errorHandeler