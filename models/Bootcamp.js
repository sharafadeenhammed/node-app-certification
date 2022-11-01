const mongoose = require("mongoose");
const slugify = require("slugify");
const geocoder = require("../utils/geocoder");


const BootcampSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,"please add a name"],
        unique:true,
        trim:true,
        maxLength:[50,"name can not be more than 50 characters"]
    },
    slug: String,
    description:{
        type:String,
        required:[true,"please add a description for your bootcamp"],
        maxLength:[500,"descrption cannot be more than 500 characters"]
    },
    website:{
        type:String,
        match:[
            /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,"please enter a valid URL with HTTP or HTTPS"
        ]
    },
    phone:{
        type:String,
        maxLength:[20,"phone number can not be more than 20 characters"]
    },
    email:{
        type:String,
        match:[
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            "please enter a valid email"
        ]
    },
    address:{
        type:String,
        required:[true,"please add an address"]
    },
    location:{
        // Geojson point
        type:{
            type:String,
            enum:["point"],
        },
        coordinates:{
            type:[Number],
            index:"2dsphere"
        },
        formattedAddress:String,
        street:String,
        city:String,
        state:String,
        zipcode:String,
        country:String
    },
    careers:{
        type:[String],
        required:true,
        enum:[
            "Web Development",
            "web development",
            "Mobile Development",
            "UI/UX",
            "Data Science",
            "Business",
            "Others"
        ]
    },
    averageRating:{
        type:Number,
        min:[1,"Rating muist be at least 1"],
        max:[10,"rating cannot be more than 10"],
    },
    averageCost:Number,
    photo:{
        type:String,
        default:"no-photo.jpg"
    },
    housing:{
        type:Boolean,
        default:false,
    },
    jobAssistance:{
        type:Boolean,
        default:false
    },
    jobGuarantee:{
        type:Boolean,
        default:false
    }
    ,
    acceptGi:{
        type:Boolean,
        default:false
    },
    createdAt:{
        type:Date,
        deafult: Date.now
    }


},{
    toJSON:{virtuals:true},
    toObject:{virtuals:true}
});

// create botcamp slug from the name
BootcampSchema.pre("save",function(next){
    this.slug = slugify(this.name,{lower:true});
    next();
})

// GEOCODE AND CREATE LOCATION FIELDS
BootcampSchema.pre("save",async function(next){
    await geocoder.geocode(this.address)
    .then(loc=>{
        const locObject =  loc[0];
        this.location = {
        type:"point",
        coordinates:[locObject.longitude,locObject.latitude],
        formattedAddress:locObject.formattedAddress || null,
        street:locObject.streetName || null,
        city:locObject.city || null,
        state:locObject.stateCode || null,
        zipcode:locObject.zipcode || null,
        country:locObject.countryCode || null,
        
        }
   
    })
    //    delete this.address;
    //    this.address = undefined;

   next();
})

// Reverse populate with virtuals...
BootcampSchema.virtual("courses",{
    ref:"Course",
    localField:"_id",
    foreignField:"bootcamp",
    justOne:false
})

// delete all courses associated with bootcamp
BootcampSchema.pre("remove", async function(req,res,next){
    console.log("courses being removed from bootcamp",this._id);
    await this.model("Course").deleteMany({bootcamp:this._id});
    next(); 
})
module.exports = mongoose.model("Bootcamp",BootcampSchema);