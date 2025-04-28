export default (sequelize, Sequelize) => {
    const RoomParticipant = sequelize.define("roomParticipant", {
        userId: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        roomId: {
            type: Sequelize.INTEGER,
            allowNull: false
        }
    })
    
    return RoomParticipant
}