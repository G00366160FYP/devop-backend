import express from 'express';
import cors from 'cors'

const app = express();
const port = 3000

const corsOptions = {
  origin: 'http://localhost:8081'
}

app.use(cors(corsOptions))

app.use(express.json())

app.use(express.urlencoded({ extended: true }))

app.get('/', function (req, res) {
  res.send('Hello World!');
});

app.listen(port, function () {
  console.log('Example app listening on port ' + port);
});