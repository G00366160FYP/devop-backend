// imports
import { Server } from 'socket.io'
import jwt from 'jsonwebtoken'
import DB from '../../../config/models/index.js'

// Import the message model from the database
const Message = DB.MESSAGE

// Secret for JWT signing and encryption
const secret = "temp-test-secret"

// setup websocket server
export default function setupSocketIO(server) {
    const io = new Server(server, {
        cors: {
            origin: '*',
            methods: ['GET', 'POST']
        },
        path: '/ws/socket.io',
    })

    // Checks if the user is authenticated before allowing them to connect to the socket
    io.use((socket, next) => {
        const token = socket.handshake.auth.token
        if (token) {
            jwt.verify(token, secret, (err, decoded) => {
                if (err) {
                    return next(new Error('Authentication error'))
                }
                socket.userId = decoded.id
                socket.username = decoded.username
                next()
            })
        } else {
            next(new Error('Authentication error'))
        }
    })

    // Listen for incoming connections
    io.on('connection', (socket) => {
        console.log(`User connected: ${socket.userId}`)

        // Listen for the 'join-room' event to join a specific room
        socket.on('join-room', (roomId, callback) => {
            socket.join(`room-${roomId}`);
            console.log(`${socket.username} joined room-${roomId}`)

            if (typeof callback === 'function'){
                callback({ status: 'success', roomId: roomId })
            }

        })

        // Listen for the send-message event to send a message to a specific room
        socket.on('send-message', async (data, callback) => {
        try{
            const message = await Message.create({
                content: data.content,
                roomId: data.roomId,
                userId: socket.userId
            })
            
            io.to(`room-${data.roomId}`).emit('receive-message', {
                ...data,
                id: message.id,
                createdAt: message.createdAt,
                user:{ 
                    id: socket.userId,
                    username: socket.username,
                }
             
            })
            if(callback) callback({ success: true})
        } catch (error) {
            console.error("Error sending message: ", error)
            if (callback) callback({ success: false, error: error.message })
        }
    })

    // Listen for the disconnect event to handle user disconnection
        socket.on('disconnect', () => {
            console.log(`User disconnected: ${socket.userId}`)
        })

        // Listen for the delete-message event to delete a message
        socket.on('delete-message', async (data, callback) => {
            try {
                const message = await Message.destroy({
                    where: {
                        id: data.messageId,
                        userId: socket.userId
                    }
                })
                if (message) {
                    io.to(`room-${data.roomId}`).emit('message-deleted', data.messageId)
                    if (callback) callback({ success: true })
                } else {
                    if (callback) callback({ success: false, error: 'Message not found or not authorized' })
                }
            } catch (error) {
                console.error("Error deleting message: ", error)
                if (callback) callback({ success: false, error: error.message })
            }
        })

    })

    return io
}