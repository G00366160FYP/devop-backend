import express from 'express';
import * as chatRoomController from '../controllers/chatRoom.controller.js';
import authJwt from '../middleware/authJwt.js'

// endpoints and there methods
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

router.get("/", 
    [authJwt.verifyToken], 
    chatRoomController.getAllChatRooms
)


router.get("/:id", 
    [authJwt.verifyToken], 
    chatRoomController.getChatRoomById
)

router.post("/:id/join", 
    [authJwt.verifyToken], 
    chatRoomController.join)

router.delete("/:id/leave", 
    [authJwt.verifyToken], 
    chatRoomController.leaveChatRoom
)

router.delete("/:id", 
    [authJwt.verifyToken], 
    chatRoomController.deleteChatRoom
)
export default router