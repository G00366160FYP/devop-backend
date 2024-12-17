import DB from "../models/index.js"

const {user: User} = DB

const checkDupicate = async (req,res, next) => {
    try{
        const userNameExists = await User.findOne({
            where: {
                username: req.body.username 
            }
        })

        if(userNameExists){
            return res.stats(400).send({
                message: "Username exists"
            })
        }

        const emailExists = await User.findOne({
            where: {
                email: req.body.email 
            }
        })

        if(emailExists){
            return res.stats(400).send({
                message: "Username exists"
            })
        }

        next()
    } catch(error){
        return res.status(500).send({
            message:"Internal server error"
        })
    }
}

const verifyRegister = {
    checkDupicate
}

export default verifyRegister