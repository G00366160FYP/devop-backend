export default (sequelize, Sequelize) => {
    const USER = sequelize.define("users", {
        username : {
         type: Sequelize.STRING
        },
        password : {
            type: Sequelize.STRING
        },
        email : {
            type: Sequelize.STRING
        }
    })

    return USER
}