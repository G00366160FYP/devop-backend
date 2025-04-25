//Imports
import {config} from "../db.config.js"
import userModel from "./user.model.js"
import messageModel from "./message.model.js"
import chatRoomModel from "./chatRoom.model.js"
import roomParticipantModel from "./roomParticipant.model.js"
import Sequelize from "sequelize"


 // configures sequlize object to interact with the database.
console.log("Config loaded in Sequelize:", config)
console.log("Pool settings:", config.production.pool)
const SEQUELIZE = new Sequelize(config.production.DB,config.production.USER,config.production.PASSWORD, {
    host: config.production.HOST,
    dialect: config.production.dialect,
    pool: {
        max: config.production.pool.max,
        min: config.production.pool.min,
        acquire: config.production.pool.acquire,
        idle: config.production.pool.idle
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

// connect to the database.
async function dbConnect(){
    try{
        await SEQUELIZE.authenticate()
console.log("connected")
    } catch(error){
        console.error("cant connect", error)
    }
}




// Start the connection to the database
dbConnect()


// Container for database parts
const DB = {}

// Store the seqelize libaary and database connection in the DB object
DB.Sequelize = Sequelize
DB.sequelize = SEQUELIZE

// Create tables from the models
DB.USER = userModel(SEQUELIZE,Sequelize)
DB.MESSAGE = messageModel(SEQUELIZE,Sequelize)
DB.CHATROOM = chatRoomModel(SEQUELIZE,Sequelize)
DB.ROOMPARTICIPANT = roomParticipantModel(SEQUELIZE,Sequelize)

// Define the relationships between the tables
DB.USER.hasMany(DB.MESSAGE, {foreignKey: "userId" })
DB.MESSAGE.belongsTo(DB.USER, {foreignKey: "userId" })
DB.CHATROOM.hasMany(DB.MESSAGE, {foreignKey: "roomId" })
DB.MESSAGE.belongsTo(DB.CHATROOM, {foreignKey: "roomId" })
DB.USER.belongsToMany(DB.CHATROOM, {through: DB.ROOMPARTICIPANT, foreignKey: "userId",})
DB.CHATROOM.belongsToMany(DB.USER, {through: DB.ROOMPARTICIPANT, foreignKey: "roomId",})

// Create a dummy user for testing purposes
async function seed() {
    const user = await DB.USER.create({username: "sam", password:"bleach123", email:"sam@gmail.com" })
}

// Add the dummy user to the database.
seed().then(() => {
    console.log("Seeding completed.")
}).catch((error) => {
    console.error("Error during seeding:", error)
})

export default DB
