import {config} from "../config/db.config.js"
import Sequelize from "sequelize"
import userModel from "../models/user.model.js"

const SEQUELIZE = new Sequelize(config.DB,config.USER,config.PASSWORD, {
    host: config.HOST,
    dialect: config.dialect,
    pool: {
        max: config.pool.max,
        min: config.pool.min,
        acquire: config.pool.acquire,
        idle: config.pool.idle
    }
})

const DB = {}

DB.Sequelize = Sequelize
DB.sequelize = SEQUELIZE

DB.USER = userModel(SEQUELIZE,Sequelize)

export default DB
