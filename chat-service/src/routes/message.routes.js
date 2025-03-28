import express from 'express';
import * as messageController from '../controllers/message.controller.js';
import authJwt from '../middleware/authJwt.js';

const router = express.Router();
    router.use((req, res, next)=>{
        res.header("Access-control-Allow-Headers", "x-access-token, Origin, Content-Type, Accept")
        next()
})

router.post("/", authJwt.verifyToken, messageController.create)
