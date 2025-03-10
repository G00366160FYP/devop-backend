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
        HOST: process.env.DB_HOST || "database-register.ctu6uiwugr5b.eu-north-1.rds.amazonaws.com",
        USER:  process.env.DB_USER || "admin",
        PASSWORD: process.env.DB_PASSWORD || '3Usz.feE4*Y(syFRfn:A#iFq0bMK',
        DB: process.env.DB_NAME || "registerDB",
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
console.log("Pool settings:", config.development.pool)