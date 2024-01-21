require('dotenv').config() //When you install first column dependies
require('./db') //When configure your connection with database

const express = require('express')
const app = express();

//When use your app any json object or form fill up
app.use(express.json())
app.use(express.urlencoded({extended:false}))

app.use(express.static('public'))

app.get('/',(req,res)=>{
    return res.render('index.html');
})

app.get('/register',(req,res)=>{
    return res.render('register.html');
})

app.get('/admin',(req,res)=>{
    return res.render('home.html');
})

//Setup our routes dependence of versions
if(process.env.VERSION == 'v1'){
    console.log('v1')
    
    const routers = require('./src/api/v1/routers') //Connect your routes here

    app.use('/api/user',routers) //Can define path or respose of your apis path
}

const Server = process.env.SERVER || 'http://localhost';
const Port = process.env.PORT || 8000 ;

app.listen(Port,()=> console.info(`Application listen at ${Server}:${Port}`))