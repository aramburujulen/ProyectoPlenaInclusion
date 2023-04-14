import { Sequelize } from "sequelize";
import db from "../config/database.js";
import Users from "./userModel.js";
const {DataTypes} = Sequelize;

const Participants = db.define("participants",{
    notifications: {
        type: DataTypes.BOOLEAN,
    },
    disability: {
        type: DataTypes.STRING,
        allowNull: true
    }
    
},{
    freezeTableName: true
})


Users.hasMany(Participants);
Participants.belongsTo(Users, {
    onDelete: 'CASCADE'
});
(async () => {
    await db.sync();
})();

export default Participants;