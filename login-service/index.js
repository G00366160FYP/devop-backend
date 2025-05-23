// Imports
import express from 'express';
import cors from 'cors'
import DB from '../config/models/index.js'
import loginRoutes from './src/routes/login.routes.js'


// Server setup
const app = express();
const port = 3001
const corsOptions = {
    origin: '*',
    methods: 'GET,PUT,POST,DELETE',
    allowedHeaders: 'Content-Type,Authorization',
}
app.use(cors(corsOptions))

app.use(express.json())

app.use(express.urlencoded({ extended: true }))

// Routes for login endpoint.
app.use('/auth', loginRoutes)

// Connect to the database.
DB.sequelize.sync().then(()=> {
  console.log('Drop and Resync Database with { force: true }')
 })

app.get('/', function (req, res) {
  res.send('Hello World!');
});

app.listen(port, function () {
  console.log('Example app listening on port ' + port)
});