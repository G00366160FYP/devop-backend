export default (sequelize, Sequelize) => {
    const ChatRoom = sequelize.define("chatRoom", {
        name: {
            type: Sequelize.STRING,
            allowNull: false
        },
        description: {
            type: Sequelize.STRING
        },
        isPrivate: {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        },
        createdBy: {
            type: Sequelize.INTEGER,
            allowNull: false
        }
    })
    return ChatRoom
}