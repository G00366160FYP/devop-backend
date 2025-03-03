import DB from "../models/index.js"
const {USER} = DB
// console.log(DB);  

const checkDupicate = async (req,res, next) => {
    try{
        const userNameExists = await USER.findOne({
            where: {
                username: req.body.username 
            }
        })

        if(userNameExists){
            return res.status(400).send({
                message: "Username exists"
            })
        }

        const emailExists = await USER.findOne({
            where: {
                email: req.body.email 
            }
        })

        if(emailExists){
            return res.status(400).send({
                message: "Username exists"
            })
        }

        next()
    } catch(error){
        console.error(error.stack)
        return res.status(500).send({
            message:"I was triggered Internal server error"
        })
    }
}

const verifyRegister = {
    checkDupicate
}

export default verifyRegister