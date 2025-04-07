import jwt from "jsonwebtoken"

const SECRET ="temp-test-secret"

const token = jwt.sign({ id: 1, username: "test"},
    SECRET,
    {
        algorithm: "HS256",
        expiresIn: 86400,
    }
)

    console.log("Gen tokedn ", token)

    try{
        const decoded = jwt.verify(token, SECRET)
        console.log("Decoded token: ", decoded)
    } catch(error){
        console.error("Error verifying token: ", error)
    }
