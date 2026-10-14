import mongoose from "mongoose";

const connectdb = async () =>{
    try{
        const conn = await mongoose.connect(process.env.MONGO_URL)
        console.log('Db connect successfullly !');
        
    }catch(err){
        console.log('Db connect Faild',err);
        
    }
}

export default connectdb
