export default (sequelize, Sequelize) => {
    const Message = sequelize.define("message", {
        content: {
            type: Sequelize.TEXT,
            allowNull: false
        },
        userId: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        roomId: {
            type: Sequelize.INTEGER,
            allowNull: false
        }
    })
    
    return Message
}