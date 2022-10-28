const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
    title:{
        type:String,
        required:[true,"please add a course title"],
        trim:true
    },
    description:{
        type:String,
        required:[true,"please add a description"]
    },
    weeks:{
        type:String,
        required:[true,"plese add a number of weeks"]
    },
    tuition:{
        type:Number,
        required:[true,"please add a tuition cost"]
    },
    minimumSkill:{
        required:[true,"please adda minimun skill"],
        type:String,
        enum:["beginner","intermediate","advanced"]
    },
    scholarshipAvailable:{
        type:Boolean,
        default:false
    },
    createdAt:{
        type:Date,
        default: Date.now
    },
    bootcamp:{
        type:mongoose.Schema.ObjectId,
        ref:"Bootcamp",
        required:true
    }
})

module.exports = mongoose.model("Course",courseSchema);