const mongoose = require('mongoose');

//Connect app with database
const MONGO_URI = "mongodb+srv://puneet:puneet09@cluster0.wacuc1r.mongodb.net/";
mongoose.connect(MONGO_URI). 
then( ()=> console.log('Connection to database')). 
catch((e) => console.error('Error occured during connection to database ',e))
