import { Sequelize } from "sequelize";
import db from "../config/database.js";

const { DataTypes } = Sequelize;
const Activities = db.define("activities",{
    name:{
        type: DataTypes.STRING
    },
    description:{
        type: DataTypes.TEXT
    },
    isActive:{
        type: DataTypes.BOOLEAN
    },
    maxParticipants:{
        type: DataTypes.INTEGER
    },
    date:{
        type: DataTypes.DATEONLY
    }

},{
    freezeTableName: true
});

(async () => {
    await db.sync();
})();

export default Activities;