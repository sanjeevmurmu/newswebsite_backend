import mongoose from "mongoose";
import ShortUniqueId from "short-unique-id";

const uid=new ShortUniqueId({length:10});

const shortUrlSchema =new mongoose.Schema({
    title:{
        type:String
    },
    full:{
        type:String,
        required:true
    },
    short:{
        type:String,
    },
    clicks:{
        type:Number,
        default:0
    }
})

shortUrlSchema.pre('save', function(next) {
    // Only generate a short URL if it doesn't already exist
    if (!this.short) {
      this.short = `https://newswebsite-backend.onrender.com/${this.title.trim()}-` + uid.rnd();
    }
    next();
  });
 
export default mongoose.model('ShortUrl', shortUrlSchema)