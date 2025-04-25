// Imports.
import jwt from "jsonwebtoken";
import DB from "../../../config/models/index.js"


// Secret for JWT signing and encryption
const secret = "temp-test-secret"

// Import the user model from the database
const USER = DB.USER

// Middleware to verify the JWT token
const verifyToken = (req,res,next) =>{
    // Check if the request has an authorization header
    let token = req.headers["x-access-token"]
    // If the token is not in the header, return 403 forbidden.
    if(!token){
        return res.status(403).send({
            message: "No token"
        })
    }
    // debugging
    console.log("FULL SECRET:", secret);
    console.log("FULL TOKEN:", token);

    // Verify the token using the secret
    // If the token is valid, decode it and set the userId and username in the request object
    jwt.verify(token, secret, (err, decoded)=>{
        if(err){
            console.log("JWT error: ", err.message)
            return res.status(401).send({
                message: "Unauthorized"
            })
        }
        req.userId = decoded.id
        req.username = decoded.username
        // execute the next middleware function in the stack
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