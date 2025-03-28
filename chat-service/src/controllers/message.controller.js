import DB from "../../config/models/index.js"
const MESSAGE = DB.MESSAGE
const ChatRoom = DB.CHATROOM
const RoomParticipant = DB.ROOMPARTICIPANT
const USER = DB.USER

export const create = async (req, res) => {
    try {
        if (!req.body.content) {
            return res.status(400).send({
                message: "Message content cannot be empty!"
            })
        }

        const message = {
            content: req.body.content,
            roomId: req.params.roomId,
            senderId: req.userId
        }

        const newMessage = await MESSAGE.create(message)
        res.status(201).send(newMessage)
    } catch (error) {
        res.status(500).send({
            message: error.message || "An error occurred while creating the message."
        })
    }
}