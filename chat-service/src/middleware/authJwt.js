import jwt from "jsonwebtoken";
// import {secret} from "../../../config/jwtSecrets/secrets.js"
import DB from "../../../config/models/index.js"

const secret = "temp-test-secret"


const USER = DB.USER
const verifyToken = (req,res,next) =>{
    let token = req.headers["x-access-token"]
    if(!token){
        return res.status(403).send({
            message: "No token"
        })
    }
    console.log("FULL SECRET:", secret);
    console.log("FULL TOKEN:", token);
    jwt.verify(token, secret, (err, decoded)=>{
        if(err){
            console.log("JWT error: ", err.message)
            return res.status(401).send({
                message: "Unauthorized"
            })
        }
        req.userId = decoded.id
        req.username = decoded.username
        next()
    })
}

const userValid = async (req,res,next) => {
    try{
        const user = await USER.findByPk(req.userId)

        if (user){
            return next()
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

const authJwt ={
    verifyToken:verifyToken
}

export default authJwt