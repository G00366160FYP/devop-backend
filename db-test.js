const mysql = require('mysql2/promise')

async function main () {
    console.log("Connecting to database...")

    try{
        const connection = await mysql.createConnection({
            host: 'backend-mysql-db.ctu6uiwugr5b.eu-north-1.rds.amazonaws.com',
            user: 'root',  
            password: 'rootroot', 
            connectTimeout: 30000
        })

        console.log("Connected to database")
        const [rows] = await connection.query('SELECT 1')
        console.log("Query result:", rows)
        await connection.end()
    }catch(error){
        console.error("Error connecting to database:", error)
    }
}

main();
