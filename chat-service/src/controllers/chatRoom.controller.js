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

    const existingRoom = await ChatRoom.findOne({
        where: {
            name: req.body.name,
        }
    })

    if (existingRoom) {
        return res.status(400).send({
            message: "Chat room name already exists!"
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

export const join = async (req, res) => {
    try {
        const roomId = req.params.id
        const userId = req.userId
        
        const chatRoom = await ChatRoom.findByPk(roomId)

        if (!chatRoom) {
            return res.status(404).send({
                message: "Chat room not found."
            })
        }

        const participant = await RoomParticipant.findOne({
            where: {
                userId: userId,
                roomId: roomId
            }
        })

        if (participant) {
            return res.status(400).send({
                message: "User already joined the chat room."
            })
        }

        await RoomParticipant.create({
            userId: userId,
            roomId: roomId
        })

        res.status(200).send({
            message: "User joined the chat room successfully."
        })
    } catch (error) {
        res.status(500).send({
            message: error.message || "An error occurred while joining the chat room."
        })
    }
}
export const getAllChatRooms = async (req, res) => {
    try {
        const chatRooms = await ChatRoom.findAll({
            where: req.query.name
            ? { name: { [Op.like]: `%${req.query.name}%` } }
            : {},
            include: [{
                model: USER,
                attributes: ['id', 'username'],
                through: {
                    attributes: []
                }
            }]
        })

        res.status(200).send(chatRooms)
    } catch (error) {
        res.status(500).send({
            message: error.message || "An error occurred while retrieving chat rooms."
        })
    }
}

export const getChatRoomById = async (req, res) => {
    try {
        const chatRoom = await ChatRoom.findByPk(req.params.id, {
            include: [{
                model: USER,
                attributes: ['id', 'username'],
                through: {
                    attributes: []
                }
            }]
        })

        if (!chatRoom) {
            return res.status(404).send({
                message: "Chat room not found."
            })
        }

        res.status(200).send(chatRoom)
    } catch (error) {
        res.status(500).send({
            message: error.message || "An error occurred while retrieving the chat room."
        })
    }
}

export const leaveChatRoom = async (req, res) => {
    try {
        const roomId = req.params.id
        const userId = req.userId

        const result = await RoomParticipant.destroy({
            where: {
                userId: userId,
                roomId: roomId
            }
        })

        if (result == 0) {
            return res.status(404).send({
                message: "Not a partcipant in this room."
            })
        }


        res.status(200).send({
            message: "User left the chat room successfully."
        })
    } catch (error) {
        res.status(500).send({
            message: error.message || "An error occurred while leaving the chat room."
        })
    }
}

export const deleteChatRoom = async (req, res) => {
    try {
        const chatRoomId = req.params.id
        const userId = req.userId

        const chatRoom = await ChatRoom.findByPk(req.params.id)

        if (!chatRoom) {
            return res.status(404).send({
                message: "Chat room not found."
            })
        }

        if (chatRoom.createdBy !== userId) {
            return res.status(403).send({
                message: "Only the creator can delete the chat room."
            })
        }

        await chatRoom.destroy()

        res.status(200).send({
            message: "Chat room deleted successfully."
        })
    } catch (error) {
        res.status(500).send({
            message: error.message || "An error occurred while deleting the chat room."
        })
    }
}