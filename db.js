const mongoose = require('mongoose');

//Connect app with database
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/authentication";
mongoose.connect(MONGO_URI). 
then( ()=> console.log('Connection to database')). 
catch((e) => console.error('Error occured during connection to database ',e))