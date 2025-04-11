const mongoose = require("mongoose");

const ReviewSchema = new mongoose.Schema({
    title: {
        type: String,
        maxlength: 100,
        required: [true, "please add a review title"],
    },
    text: {
        type: String,
        required:[true,"please add content of your review"]
    },
    date: {
        type: Date,
        default:Date.now
    },
    rating: {
        type:Number,
        min: 1,
        max: 10,
        required:[true,"please add a rating between 1 and 10"]
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: [true, "please include a user ID"]
    },
    bootcamp: {
        type: mongoose.Schema.ObjectId,
        ref: "Bootcamp",
        required: [true, "please include a bootcamp ID "]
    }
})

// ReviewSchema.index({bootcamp:true,user:true})
ReviewSchema.index({ bootcamp: 1, user: 1 }, { unique: true });

//creating static function to calculate avgerage rating
ReviewSchema.statics.getAverageRating = async function (bootcampId) {
    let obj = await this.aggregate([
        {
           $match:{bootcamp:bootcampId}
        },
        {
            $group:{
                _id: "$bootcamp",
                averageRating:{$avg:"$rating"}
            }
        }
    ]);
    try {
        await this.model("Bootcamp").findByIdAndUpdate(bootcampId, { averageRating: obj[0].averageRating });
    }
    catch(error){
        console.log(error);
    }

}

ReviewSchema.post("save", async function(){
    await this.constructor.getAverageRating(this.bootcamp);
})

ReviewSchema.pre("remove", async function(){
    await this.constructor.getAverageRating(this.bootcamp);
})

module.exports = mongoose.model("Review", ReviewSchema);

