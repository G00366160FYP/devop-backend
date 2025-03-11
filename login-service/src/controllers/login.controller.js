import DB from "../../../config/models"
import { config } from "../../../config/db.config"
import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"
import { User } from "../../../config/models/user.model"


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

        const token = jwt.sign({ id: User.id},
                               config.secret,
                               {
                                algorithm: "HS256",
                                expiresIn: 86400,
                                allowInsecureKeySizes: true,
                               }     
        )

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
    