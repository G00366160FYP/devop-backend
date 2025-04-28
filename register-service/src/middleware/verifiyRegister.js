import DB from "../../../config/models/index.js"
const {USER} = DB
// console.log(DB);  

const checkDupicate = async (req,res, next) => {
    
    try{
        // Checks if the username exists in the database
        const userNameExists = await USER.findOne({
            where: {
                username: req.body.username 
            }
        })

        // If the username exists, return a 400 error with a message
        if(userNameExists){
            return res.status(400).send({
                message: "Username exists"
            })
        }

        // Checks if the email exists in the database
        const emailExists = await USER.findOne({
            where: {
                email: req.body.email 
            }
        })

        // If the email exists, return a 400 error with a message
        if(emailExists){
            return res.status(400).send({
                message: "Email exists"
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