import express from "express";
import dotenv from "dotenv"
import mongoose from "mongoose";
import cors from 'cors'

import shortUrl from './models/shortUrl.js'


const app=express()
dotenv.config()

const connect=async()=>{
    try{
        await mongoose.connect(process.env.MONGO)
        console.log("Connected to MongoDB")
    }catch(error){
        throw error
    }
}

mongoose.connection.on("disconnected",()=>{
    console.log("mongoDB disconnected!")
})

mongoose.connection.on("connected",()=>{
    console.log("mongoDB connected!")
})

app.use(cors())
app.use(express.json())


app.post('/shortUrl',async (req,res)=>{
    // console.log(req)
    let response=await shortUrl.findOne({full:req.body.full})
   
    if(response==null){
        response= await shortUrl.create({title:req.body.title,full:req.body.full})
    }
    else{
        response.clicks++
        response.save()
    }
    return res.send(response)
})

app.use((err,req,res,next)=>{
    const errorStatus=err.status||500
    const errorMessage=err.message||"Something went wrong!"
    return res.status(errorStatus).json({
        success:false,
        status:errorStatus,
        message:errorMessage,
        stack:err.stack
    })
})


app.get('/:short',async(req,res)=>{
    const requestUrl=await shortUrl.findOne({short:req.params.short})
    console.log(req.params)
    if (requestUrl == null) return res.sendStatus(404)

    requestUrl.clicks++
    requestUrl.save()
    res.redirect(requestUrl.full)
})

app.listen(process.env.PORT ||8800,()=>{
    connect()
    console.log("Connected to backend!")
})

