import mongoose from "mongoose"
import User from "./userModel.js"

const messageSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: User,
        required: true
    },

    receiver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: User,
        required: true
    },

    message: {
        type: String,
        required: false,
        default: ""
    },
    image: {
        type: String,
        default: "",
    }

}, { timestamps: true })

const Message = mongoose.model("Message", messageSchema)

export default Message