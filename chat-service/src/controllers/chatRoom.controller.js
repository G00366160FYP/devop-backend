// iMPORTS 
import DB from "../../../config/models/index.js"

// importing database models
const ChatRoom = DB.CHATROOM
const RoomParticipant = DB.ROOMPARTICIPANT
const USER = DB.USER

//importing database connection
const Op = DB.Sequelize.Op

// Creates a new chat room
export const createChatRoom = async (req, res) => {
    // If chat room is empty return http 400 and a error message
    try{
    if (!req.body.name) {
        return res.status(400).send({
            message: "Chat room name cannot be empty!"
        })
    }

    // Check if the chat room name already exists
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

    // Create a new chat room object from the body of the request
    const chatRoom = {
        name: req.body.name,
        description: req.body.description || "",
        isPrivate: req.body.isPrivate || false,
        createdBy: req.userId
    }

    // Create a new chat room in the database
    const newRoom = await ChatRoom.create(chatRoom)

    // Add the creator as a participant in the chat room
    await RoomParticipant.create({
        userId: req.userId,
        roomId: newRoom.id
    })

    // Send a http response 201 with the new chat room object
    res.status(201).send(newRoom)
    // if the chat room is not created return http 500 and a error message
} catch (error){
    res.status(500).send({ 
        message: error.message || "An error occurred while creating the chat room."
    })
}
}
// Adds a user to a chat room
export const join = async (req, res) => {
    try {
        // Get the room ID from the request parameters and the user ID from the request object
        const roomId = req.params.id
        const userId = req.userId
        
        // Check if the chat room exists in the database
        const chatRoom = await ChatRoom.findByPk(roomId)

        // If the chat room does not exist, return a 404 error
        if (!chatRoom) {
            return res.status(404).send({
                message: "Chat room not found."
            })
        }

        //Check if the user is already a participant in the chat room
        const participant = await RoomParticipant.findOne({
            where: {
                userId: userId,
                roomId: roomId
            }
        })

        // If the user is already a participant, return a http 400 error and a error message
        if (participant) {
            return res.status(400).send({
                message: "User already joined the chat room."
            })
        }

        // Add the user as a participant in the chat room
        await RoomParticipant.create({
            userId: userId,
            roomId: roomId
        })

        // Return a http 200 response with a success message
        res.status(200).send({
            message: "User joined the chat room successfully."
        })
    } catch (error) {
        res.status(500).send({
            message: error.message || "An error occurred while joining the chat room."
        })
    }
}   
// Retrieves all chat rooms from the database
export const getAllChatRooms = async (req, res) => {
    try {
        const chatRooms = await ChatRoom.findAll({
            // shows all chatrooms with an option to search my name
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

        // return http 200 with the chat rooms
        res.status(200).send(chatRooms)
    } catch (error) {
        // return http 500 with a error message
        res.status(500).send({
            message: error.message || "An error occurred while retrieving chat rooms."
        })
    }
}

// Retrieves a chat room by ID from the database
export const getChatRoomById = async (req, res) => {
    try {
        // Get the chat room ID from the request parameters
        const chatRoom = await ChatRoom.findByPk(req.params.id, {
            // Include the participants in the chat room
            include: [{
                model: USER,
                attributes: ['id', 'username'],
                through: {
                    attributes: []
                }
            }]
        })

        // If the chat room does not exist, return a 404 error
        if (!chatRoom) {
            return res.status(404).send({
                message: "Chat room not found."
            })
        }

        // Return a http 200 response with the chat room object
        res.status(200).send(chatRoom)
    } catch (error) {
        // return http 500 with a error message
        res.status(500).send({
            message: error.message || "An error occurred while retrieving the chat room."
        })
    }
}

// Deletes a user from a chat room
export const leaveChatRoom = async (req, res) => {
    try {
        // Get the room ID from the request parameters and the user ID from the request object
        const roomId = req.params.id
        const userId = req.userId

        // Leaves the chat room if the user is a participant
        const result = await RoomParticipant.destroy({
            where: {
                userId: userId,
                roomId: roomId
            }
        })

        // If the user is not a participant, return a 404 error
        if (result == 0) {
            return res.status(404).send({
                message: "Not a partcipant in this room."
            })
        }


        //If the user is a participant, return a http 200 response with a success message
        res.status(200).send({
            message: "User left the chat room successfully."
        })
    } catch (error) {
        // return http 500 with a error message
        res.status(500).send({
            message: error.message || "An error occurred while leaving the chat room."
        })
    }
}

// Deletes a chat room from the database
export const deleteChatRoom = async (req, res) => {
    try {
        // Get the chat room ID from the request parameters and the user ID from the request object
        const chatRoomId = req.params.id
        const userId = req.userId

        // Query the database to find the chat room by ID
        const chatRoom = await ChatRoom.findByPk(req.params.id)

        // If the chat room does not exist, return a 404 error
        if (!chatRoom) {
            return res.status(404).send({
                message: "Chat room not found."
            })
        }

        // Check if the user is the creator of the chat room
        if (chatRoom.createdBy !== userId) {
            return res.status(403).send({
                message: "Only the creator can delete the chat room."
            })
        }

        // Delete the chat room from the database
        await chatRoom.destroy()

        // Deleted the chat room from the database
        res.status(200).send({
            message: "Chat room deleted successfully."
        })
    } catch (error) {
        res.status(500).send({
            message: error.message || "An error occurred while deleting the chat room."
        })
    }
}