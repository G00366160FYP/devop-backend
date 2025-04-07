import {config} from "../db.config.js"
import userModel from "./user.model.js"
import messageModel from "./message.model.js"
import chatRoomModel from "./chatRoom.model.js"
import roomParticipantModel from "./roomParticipant.model.js"
import Sequelize from "sequelize"


 // development 
console.log("Config loaded in Sequelize:", config)
console.log("Pool settings:", config.development.pool)
const SEQUELIZE = new Sequelize(config.development.DB,config.development.USER,config.development.PASSWORD, {
    host: config.development.HOST,
    dialect: config.development.dialect,
    pool: {
        max: config.development.pool.max,
        min: config.development.pool.min,
        acquire: config.development.pool.acquire,
        idle: config.development.pool.idle
    }
})


// Production.
//console.log("Config loaded in Sequelize:", config)
//console.log("Pool settings:", config.production.pool)
//const SEQUELIZE = new Sequelize(config.production.DB,config.production.USER,config.production.PASSWORD, {
//    host: config.production.HOST,
 //   dialect: config.production.dialect,
//    pool: {
//        max: config.production.pool.max,
//        min: config.production.pool.min,
//        acquire: config.production.pool.acquire,
//        idle: config.production.pool.idle
//    }
// })

async function dbConnect(){
    try{
        await SEQUELIZE.authenticate()
console.log("connected")
    } catch(error){
        console.error("cant connect", error)
    }
}




// Call the database connection function
dbConnect()


const DB = {}

DB.Sequelize = Sequelize
DB.sequelize = SEQUELIZE

DB.USER = userModel(SEQUELIZE,Sequelize)
DB.MESSAGE = messageModel(SEQUELIZE,Sequelize)
DB.CHATROOM = chatRoomModel(SEQUELIZE,Sequelize)
DB.ROOMPARTICIPANT = roomParticipantModel(SEQUELIZE,Sequelize)

DB.USER.hasMany(DB.MESSAGE, {foreignKey: "userId" })

DB.MESSAGE.belongsTo(DB.USER, {foreignKey: "userId" })

DB.CHATROOM.hasMany(DB.MESSAGE, {foreignKey: "roomId" })

DB.MESSAGE.belongsTo(DB.CHATROOM, {foreignKey: "roomId" })

DB.USER.belongsToMany(DB.CHATROOM, {through: DB.ROOMPARTICIPANT, foreignKey: "userId",})
DB.CHATROOM.belongsToMany(DB.USER, {through: DB.ROOMPARTICIPANT, foreignKey: "roomId",})

async function seed() {
    const user = await DB.USER.create({username: "sam", password:"bleach123", email:"sam@gmail.com" })
}

seed().then(() => {
    console.log("Seeding completed.")
}).catch((error) => {
    console.error("Error during seeding:", error)
})

export default DB
