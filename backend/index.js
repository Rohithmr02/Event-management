
require('dotenv').config()
const express=require('express')
const cors=require('cors')
const mongoose=require('mongoose')
const app=express()
const AuthRoute=require('./Controllers/Auth')
const EventRoute=require('./Controllers/Event')

app.use(express.json({ limit: '50mb' }));
app.use(cors())



mongoose.connect(process.env.MONGO_URI)
.then(()=>{
    console.log("db is connected")
}).catch((e)=>{
    console.log(e);
})


app.use('/auth/user',AuthRoute)
app.use('/auth/event',EventRoute)

app.listen(process.env.PORT||8000,()=>{
    console.log(`server is running on the port ${process.env.PORT||8000}`)
})