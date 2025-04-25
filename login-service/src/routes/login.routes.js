import { signIn } from "../controllers/login.controller.js"
import express from "express"

// Routes for login endpoint.
const router = express.Router()
    router.use((req, res, next)=>{
        res.header("Access-control-Allow-Headers", "x-access-token, Origin, Content-Type, Accept")
        next()
    })

    router.post(
        "/login",
        signIn
    )

export default router