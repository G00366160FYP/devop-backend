import DB from "../../../config/models/index.js"

const ChatRoom = DB.CHATROOM
const RoomParticipant = DB.ROOMPARTICIPANT
const USER = DB.USER
const Op = DB.Sequelize.Op

export const createChatRoom = async (req, res) => {
    try{
    if (!req.body.name) {
        return res.status(400).send({
            message: "Chat room name cannot be empty!"
        })
    }

    const chatRoom = {
        name: req.body.name,
        description: req.body.description || "",
        isPrivate: req.body.isPrivate || false,
        createdBy: req.userId
    }

    const newRoom = await ChatRoom.create(chatRoom)

    await RoomParticipant.create({
        userId: req.userId,
        roomId: newRoom.id
    })

    res.status(201).send(newRoom)
} catch (error){
    res.status(500).send({ 
        message: error.message || "An error occurred while creating the chat room."
    })
}
}