
// Imports
import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"
import db from "../../../config/models/index.js"

// Secret for JWT signing and encryption
const secret = "temp-test-secret"

// Import the user model from the database
const User = db.USER

// Function to login user.
export const signIn = async (req, res) => {
    // Check if username already exists in the database
    User.findOne({
        where: {
            username: req.body.username
        }
    }).then(User => {
        if (!User){
            return res.status(404).send({ message: "User Not Found."})  
        }

        // Check if password is correct
        const validPass = bcrypt.compareSync(
            req.body.password,
            User.password
        )

        // If password is incorrect, return 401 status code and error message
        if (!validPass){
            return res.status(401).send({
                accessToken: null,
                message: "Invalid Password"
            })
        }
            
            
            console.log("FULL SECRET:", secret)
        // If password is correct, create a JWT token with user id and username and send in the response.
        const token = jwt.sign({ id: User.id, username: User.username},
                                secret,
                               {
                                algorithm: "HS256",
                                expiresIn: 86400,
                                allowInsecureKeySizes: true,
                               }     
        )
        console.log("FULL TOKEN:", token);
        
        res.status(200).send({
            id: User.id,
            username: User.username,
            email: User.email,
            accessToken: token
        })
    }).catch(err => {
        res.status(500).send({ message: err.message})
    })
}   
    