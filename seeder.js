const fs = require("fs");
const dotenv = require("dotenv");
const colours = require("colours");
const moongoose = require("mongoose");
const Bootcamp = require("./models/Bootcamp.js");
const Course = require("./models/Course.js");
const User = require("./models/User.js");
const bcrypt = require("bcryptjs");

dotenv.config({path:"./config/config.env"});
const bootcamps =  JSON.parse(fs.readFileSync("./_data/bootcamps.json","utf-8"));

const courses = JSON.parse(fs.readFileSync("./_data/courses.json", "utf-8"));

const users = JSON.parse(fs.readFileSync("./_data/users.json", "utf-8"));
moongoose.connect(process.env.MONGO_LOCAL_URI);

console.log("running seeder...");

// import bootcamp data into DB
const importBootcamps = async ()=>{
    try {
        await Bootcamp.create(bootcamps)
        console.log("Bootcamp Data Imported".green.inverse);
        process.exit(1);
    } catch (error) {
        console.log(error);
    }
}

//delete bootcamps data from DB
const deleteBootcamps = async ()=>{
    try {
        await Bootcamp.deleteMany();
        console.log("Bootcamp Data Destroyed".red.inverse);
        process.exit(1);
    } catch (error) {
        console.log(error);
    }
}

// import courses to DB
const importCourses = async ()=>{
    try {
        await Course.create(courses);
        console.log("Courses Imported".green.inverse);
        process.exit(1);
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}
//delete Course from DB
const deleteCourses = async ()=>{
    try {
        await Course.deleteMany();
        console.log("Courses Destroyed".red.inverse);
        process.exit(1);
    } catch (error) {
        console.log(error);
        process.exit(1)
    }
}

// import users data into DB
const importUsers = async ()=>{
    try {
        // users.forEach((user) => {
        //     async function createUser(user) {
        //         // console.log("creating user...\n")
        //         const salt = bcrypt.genSaltSync(10);
        //         const hashed = bcrypt.hashSync(user.password, salt);
        //         // user.password = hashed;
        //         // user.createdAt = Date.now();
        //         const dbUser = await User.create(user);
        //         console.log("created user:\n",dbUser);
        //     }
        //     createUser(user);
        // });

        newd = await User.create(users);
        console.log(newd);
        
        
    console.log("  User Data Imported  ".green.inverse);
    process.exit(1);
    } catch (error) {
        console.log(error);
    }
}

//delete users data from DB
const deleteUsers = async ()=>{
    try {
        await User.deleteMany();
        console.log("Users Data Destroyed".red.inverse);
        process.exit(1);
    } catch (error) {
        console.log(error);
    }
}


if(process.argv[2] === "-ib"){
    importBootcamps();

}else if(process.argv[2] === "-db"){
    deleteBootcamps();
}
else if(process.argv[2] === "-ic"){
    importCourses();
}
else if(process.argv[2] === "-dc"){
    deleteCourses();
}
else if (process.argv[2] === "-iu") {
    importUsers();
}
else if (process.argv[2] === "-du") {
    deleteUsers();
}
else {
    console.log("invalid command exiting...".yellow.inverse);
    process.exit(1);
}





