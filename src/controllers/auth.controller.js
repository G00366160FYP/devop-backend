import db from "../models/index.js"
import bcrypt from "bcryptjs"

const USER = db.USER

export const register = async (req,res) => {
    try{
        const REG_USER = await USER.create({
            username: req.body.username,
            email: req.body.email,
            password: bcrypt.hashSync(req.body.password, 10)
        })

        res.send({ message: "User Registed"})
    }catch(error){
        res.status(500).send({ message: error.message})
    }
    
}