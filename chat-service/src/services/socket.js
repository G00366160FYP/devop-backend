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

        socket.on('join-room', (roomId) => {
            socket.join(`room-${roomId}`);
            console.log(`${socket.username} joined room-${roomId}`)

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
    })

    return io
}