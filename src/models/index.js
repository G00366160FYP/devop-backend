import {config} from "../config/db.config.js"
import Sequelize from "sequelize"
import userModel from "../models/user.model.js"


/* development 
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
*/

// Production.
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

async function dbConnect(){
    try{
        await SEQUELIZE.authenticate()
console.log("connected")
    } catch(error){
        console.error("cant connect", error)
    }
}




dbConnect()

const DB = {}

DB.Sequelize = Sequelize
DB.sequelize = SEQUELIZE

DB.USER = userModel(SEQUELIZE,Sequelize)

export default DB
