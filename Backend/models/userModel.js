import mongoose from 'mongoose'

const userSchema = mongoose.Schema({
    name:{
        type:String,
        trim:true
    },

    email:{
        type:String,
        required: true,
        unique: true
    },

    password:{
        type:String,
        required: true
    },

   image: {
      type: String,
      default: "",
    },

    
},{timestamp : true})

const User =  mongoose.model("User", userSchema)

export default User