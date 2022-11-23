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
        required:[true,"please add a minimun skill(beginner,intermidiate,or advanced)"],
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
    },
    user:{
        type:mongoose.Schema.ObjectId,
        ref:"User",
        required:true
    }
})

//creating sttic function to calculate avg course tuition
courseSchema.statics.getAverageCost = async function (bootcampId) {
    // console.log("running avg...");
    let obj = await this.aggregate([
        {
           $match:{bootcamp:bootcampId}
        },
        {
            $group:{
                _id: "$bootcamp",
                averageCost:{$avg:"$tuition"}
            }
        }
    ]);
    try {
        await this.model("Bootcamp").findByIdAndUpdate(bootcampId, { averageCost: Math.ceil(obj[0].averageCost||0) });
    }
    catch(error){
        console.log(error);
    }

}

courseSchema.post("save", async function(){
    await this.constructor.getAverageCost(this.bootcamp);
})

courseSchema.pre("remove", async function(){
    await this.constructor.getAverageCost(this.bootcamp);
    console.log("removing...");

})

module.exports = mongoose.model("Course",courseSchema);
/*
     "title": "IOS Development One",
		"description": "Get started building mobile applications for IOS using Swift and other tools",
		"weeks": 8,
		"tuition": 6000,
		"minimumSkill": "intermediate",
		"scholarhipsAvailable": false,
		"bootcamp": "5d725a1b7b292f5f8ceff788"
*/