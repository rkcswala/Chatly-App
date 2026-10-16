
import Chat from "../models/chatModel.js";
import Message from "../models/messageModel.js";
import { getReceiversocketId, io } from "../socket/socket.js";
import Imageuploadcloudinary from "../config/cloudnary.js"


const uploadImageToCloudinary = async (fileBuffer) => {
  const result = await new Promise((resolve, reject) => {
    const stream = Imageuploadcloudinary.uploader.upload_stream(
      {
        folder: "chat-images",
        resource_type: "image",
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );

    stream.end(fileBuffer);
  });

  return result.secure_url;
};




export const sendMessage = async (req, res) => {
  try {
    const sender = req.userId;
    const { receiver } = req.params;

    const message = req.body?.message?.trim() || "";
    const file = req.file;

    if (!sender || !receiver) {
      return res.status(400).json({
        message: "Sender and receiver are required",
      });
    }

    if (!message && !file) {
      return res.status(400).json({
        message: "Message or image is required",
      });
    }




    let imageUrl = "";

    if (file) {
      const uploadedImage = await Imageuploadcloudinary(file.buffer);
      imageUrl = uploadedImage.secure_url;
    }
    let conversation = await Chat.findOne({
      participants: { $all: [sender, receiver] },
    });

    const newMessage = await Message.create({
      sender,
      receiver,
      message: message.trim(),
      image: imageUrl,
    });

    if (!conversation) {
      conversation = await Chat.create({
        participants: [sender, receiver],
        messages: [newMessage._id],
      });
    } else {
      conversation.messages.push(newMessage._id);
      await conversation.save();
    }

    const receiverSocketId = getReceiversocketId(String(receiver));

    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    return res.status(201).json({
      // message: "Message sent successfully",
      newMessage,
    });
  } catch (error) {
    console.error("Send message error:", error);

    return res.status(500).json({
      message: "Send message error",
      error: error.message,
    });
  }
};



export const getMessages = async (req, res) => {
  try {
    const senderId = req.userId;
    const receiverId = req.params.receiver;

    // console.log("Logged-in user:", senderId);
    // console.log("Selected receiver:", receiverId);

    const chat = await Chat.findOne({
      participants: {
        $all: [senderId, receiverId],
      },
    }).populate("messages");

    return res.status(200).json({
      success: true,
      messages: chat?.messages || [],
    });
  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


