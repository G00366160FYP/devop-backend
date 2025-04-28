// Unused configuration
import DB from "../models/index.js"

async function dbInit() {
    try {
        await DB.sequelize.authenticate()
        console.log("connected successfully.");

        await DB.sequelize.sync({ alter: process.env.DB_ALTER == 'true'})
        console.log("Database synchronized successfully.");

      return true
    } catch (error) {
        console.error("Error synchronizing the database:", error);
        throw error
    }
}

if(require.main === module) {
    dbInit()
        .then(() =>{  
            console.log("Database initialized successfully.")
            process.exit(0)
        })
        .catch(() => { 
            console.error("Error initializing database:")
            process.exit(1)
        })
}

export { dbInit}