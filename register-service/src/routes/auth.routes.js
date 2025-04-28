import verifyRegister from "../middleware/verifiyRegister.js"
import {register} from "../controllers/register.controller.js"
import express from "express"


// Endpoint for register service
const router = express.Router()
    router.use((req, res, next)=>{
        res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept")    
        next()
    })

    router.post(
        "/register",
        [verifyRegister.checkDupicate],
        register
    )

export default router

