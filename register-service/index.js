import express from 'express';
import cors from 'cors'
import DB from '../config/models/index.js'
import authRoutes from './src/routes/auth.routes.js';

const app = express();
const port = 3000

const corsOptions = {
  origin: '*',
  methods: 'GET,PUT,POST,DELETE',
  allowedHeaders: 'Content-Type,Authorization',
}

app.use(cors(corsOptions))

app.use(express.json())

app.use(express.urlencoded({ extended: true }))

app.use('/auth', authRoutes)

DB.sequelize.sync().then(()=> {
  console.log('Drop and Resync Database with { force: true }')
})

app.get('/', function (req, res) {
  res.send('Hello World!');
});


app.listen(port,function () {
  console.log('Example app listening on port ' + port)
});