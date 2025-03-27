import express from 'express';
import * as chatRoomController from '../controllers/chatRoom.controller.js';
import authJwt from '../middleware/authJwt.js'

const router = express.Router();
    router.use((req, res, next)=>{
        res.header("Access-control-Allow-Headers", "x-access-token, Origin, Content-Type, Accept")
        next()
    })

router.post(
    '/create', 
    [authJwt.verifyToken],
    chatRoomController.createChatRoom
    )
export default router