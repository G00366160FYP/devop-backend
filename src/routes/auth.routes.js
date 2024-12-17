import verifyRegister from "../middleware/verifiyRegister.js"
import {register} from "../controllers/auth.controller.js"
import express from "express"

const router = express.Router()
    router.use((req, res, next)=>{
        res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept")    
        next()
    })

    router.post(
        "/auth/register",
        [verifyRegister.checkDupicate],
        register
    )

export default router

