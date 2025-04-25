//Imports.
import express from 'express';
import cors from 'cors'
import DB from '../config/models/index.js'
import chatRoomRoutes from './src/routes/chatRoom.routes.js'
import messageRoutes from './src/routes/message.routes.js'
import http from 'http'
import setupSocketIO from './src/services/socket.js';

// Server setup
const app = express();
const port = 3002
const server = http.createServer(app)
const io = setupSocketIO(server)

// Request allowed from anywhere, 
// http methods allowed are GET, PUT, POST, DELETE
// and the headers allowed are Content-Type, Authorization, x-access-token
const corsOptions = {
  origin: '*',
  methods: 'GET,PUT,POST,DELETE',
  allowedHeaders: 'Content-Type,Authorization,x-access-token',
}

// Middleware setup
app.use(cors(corsOptions))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Routes for chatrooms and sending messages in chatrooms.
app.use('/chatRoom', chatRoomRoutes)
app.use('/message', messageRoutes)

// Connect to the database.
DB.sequelize.sync().then(()=> {
  console.log('Drop and Resync Database with { force: true }')
})

app.get('/', function (req, res) {
  res.send('Hello World!');
});


server.listen(port,function () {
  console.log('Example app listening on port ' + port)
});