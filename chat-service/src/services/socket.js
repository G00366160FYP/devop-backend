import { Server } from 'socket.io'
import jwt from 'jsonwebtoken'
import DB from '../../../config/models/index.js'

const Message = DB.MESSAGE
const secret = "temp-test-secret"

export default function setupSocketIO(server) {
    const io = new Server(server, {
        cors: {
            origin: '*',
            methods: ['GET', 'POST']
        },
        path: '/ws/socket.io',
    })

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

    io.on('connection', (socket) => {
        console.log(`User connected: ${socket.userId}`)

        socket.on('join-room', (roomId, callback) => {
            socket.join(`room-${roomId}`);
            console.log(`${socket.username} joined room-${roomId}`)

            if (typeof callback === 'function'){
                callback({ status: 'success', roomId: roomId })
            }

        })

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

        socket.on('disconnect', () => {
            console.log(`User disconnected: ${socket.userId}`)
        })

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