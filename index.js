import express from 'express';
import cors from 'cors'
import DB from './src/models/index.js'
import authRoutes from './src/routes/auth.routes.js';

const app = express();
const port = 3000


const corsOptions = {
  origin: 'http://k8s-default-devopfro-3395a783d4-103de2cc0dd57654.elb.eu-north-1.amazonaws.com/#/register',
  methods: 'POST',
  allowedHeaders: 'Origin, Content-Type, Accept'
}

app.use(cors(corsOptions))

app.use(express.json())

app.use(express.urlencoded({ extended: true }))

app.use('/auth', authRoutes)

DB.sequelize.sync({ force: true }).then(()=> {
  console.log('Drop and Resync Database with { force: true }')
})

app.get('/', function (req, res) {
  res.send('Hello World!');
});

app.listen(port, function () {
  console.log('Example app listening on port ' + port);
});