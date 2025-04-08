import DB from "../../../config/models/index.js"
const MESSAGE = DB.MESSAGE
const ChatRoom = DB.CHATROOM
const RoomParticipant = DB.ROOMPARTICIPANT
const USER = DB.USER

export const create = async (req, res) => {
    try {
        console.log("Request body:", req.body)
        console.log("Request params:", req.params)
        console.log("Request userId:", req.userId)
        if (!req.body.content) {
            return res.status(400).send({
                message: "Message content cannot be empty!"
            })
        }

        const message = {
            content: req.body.content,
            roomId: req.params.roomId,
            userId: req.userId
        }

        console.log("creating message with data:", message)

        const newMessage = await MESSAGE.create(message)
        res.status(201).send(newMessage)
    } catch (error) {
        res.status(500).send({
            message: error.message || "An error occurred while creating the message."
        })
    }
}

export const findByRoom = async (req, res) => {
    try {
        const roomId = req.params.roomId

        const chatRoom = await ChatRoom.findByPk(roomId)

        if (!chatRoom) {
            return res.status(404).send({
                message: "Chat room not found."
            })
        }

        const participant = await RoomParticipant.findOne({
            where: {
                userId: req.userId,
                roomId: roomId
            }
        })

        if (!participant) {
            return res.status(403).send({
                message: "User not a participant of the chat room."
            })
        }

        const messages = await MESSAGE.findAll({
            where: {
                roomId: roomId
            },
            include: [{
                model: USER,
                as: 'user',
                attributes: ['id', 'username']
            }],
            order: [['createdAt', 'DESC']]
        })

        res.status(200).send(messages)
    } catch (error) {
        res.status(500).send({
            message: error.message || "An error occurred while retrieving messages."
        })
    }
}

export const deleteMessage = async (req, res) => {
    try {
        const messageId = req.params.id

        const message = await MESSAGE.findByPk(messageId)

        if (!message) {
            return res.status(404).send({
                message: "Message not found."
            })
        }
// Add this debugging before the comparison
console.log("Message sender ID:", message.senderId, typeof message.senderId);
console.log("Request user ID:", req.userId, typeof req.userId);
        if (Number(message.userId) !== Number(req.userId)) {
            return res.status(403).send({
                message: "You are not authorized to delete this message."
            })
        }

        await MESSAGE.destroy({
            where: {
                id: messageId
            }
        })

        res.status(200).send({
            message: "Message deleted successfully."
        })
    } catch (error) {
        res.status(500).send({
            message: error.message || "An error occurred while deleting the message."
        })
    }
}