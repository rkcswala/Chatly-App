
import Chat from "../models/chatModel.js";
import Message from "../models/messageModel.js";
import { getReceiversocketId, io } from "../socket/socket.js";

export const sendMessage = async (req, res) => {
  try {
    const sender = req.userId;
    const { receiver } = req.params;
    const { message } = req.body;


    if (!sender || !receiver || !message?.trim()) {
      return res.status(400).json({
        message: "Sender, receiver and message are required",
      });
    }

    let conversation = await Chat.findOne({
      participants: {
        $all: [sender, receiver],
      },
    });

    const newMessage = await Message.create({
      sender,
      receiver,
      message: message.trim(),
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

    // console.log("Receiver ID:", receiver);
    // console.log("Receiver socket ID:", receiverSocketId);

    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }
    return res.status(201).json({
      message: "Message sent successfully",
      newMessage,
    });

  } catch (error) {

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


