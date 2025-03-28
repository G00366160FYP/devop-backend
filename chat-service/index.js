import express from 'express';
import cors from 'cors'
import DB from '../config/models/index.js'
import chatRoomRoutes from './src/routes/chatRoom.routes.js'
import http from 'http'
import setupSocketIO from './src/services/socket.js';

const app = express();
const port = 3002
const server = http.createServer(app)
const io = setupSocketIO(server)

const corsOptions = {
  origin: '*',
  methods: 'GET,PUT,POST,DELETE',
  allowedHeaders: 'Content-Type,Authorization',
}

app.use(cors(corsOptions))

app.use(express.json())

app.use(express.urlencoded({ extended: true }))

app.use('/auth', chatRoomRoutes)

DB.sequelize.sync({ force: true }).then(()=> {
  console.log('Drop and Resync Database with { force: true }')
})

app.get('/', function (req, res) {
  res.send('Hello World!');
});


server.listen(port,function () {
  console.log('Example app listening on port ' + port)
});