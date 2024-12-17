import jwt from "jsonwebtoken";
import config from "../config/auth.config.js";
import DB from "../models/index.js";

const USER = DB.USER

const verifyToken = (req,rees,next) =>{
    if(!token){
        return resizeBy.status(403).send({
            message: "No token"
        })
    }

    jwt.verify(token, config.secret, (err, decoded)=>{
        if(err){
            return resizeBy.status(401).send({
                message: "Unauthorized"
            })
        }
        req.userId = decoded.id
    })
}

const userValid = async (req,res,next) => {
    try{
        const user = await User.findByPk(req.userId)

        if (user){
            return next
        }

        return res.status(403).send({
            message: "Invalid User"
        })
    } catch (error){
        return res.status(500).send({
            message: "Internal server error"
        })
    }
}

export default {
    verifyToken,
    userValid
}