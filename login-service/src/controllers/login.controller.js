import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"
import db from "../../../config/models/index.js"
// import { secret } from "../../../config/jwtSecrets/secrets.js"
const secret = "temp-test-secret"
const User = db.USER

export const signIn = async (req, res) => {
    User.findOne({
        where: {
            username: req.body.username
        }
    }).then(User => {
        if (!User){
            return res.status(404).send({ message: "User Not Found."})  
        }

        const validPass = bcrypt.compareSync(
            req.body.password,
            User.password
        )

        if (!validPass){
            return res.status(401).send({
                accessToken: null,
                message: "Invalid Password"
            })
        }
            // In login service when creating token
            
            
            console.log("FULL SECRET:", secret);
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
    