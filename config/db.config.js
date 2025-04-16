export const config = {
    development:{
        HOST: process.env.DB_HOST || "localhost",
        USER:  process.env.DB_USER || "root",
        PASSWORD: process.env.DB_PASSWORD || 'root',
        DB: process.env.DB_NAME || "authdb",
        dialect: "mysql",
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        }
    },
    production:{
        HOST: "backend-mysql-db.ctu6uiwugr5b.eu-north-1.rds.amazonaws.com",
        USER:  "root",
        PASSWORD: 'rootroot',
        DB: "auth",
        dialect: "mysql",
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        }
    }
}

console.log("Config loaded:", config)
console.log("Pool settings:", config.production.pool)