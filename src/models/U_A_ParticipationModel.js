import { Sequelize } from "sequelize";
import db from "../config/database.js";
import Activities from "./activityModel.js";
import Users from "./userModel.js";

const U_A_Participation = db.define("U_A_Participation", {
    userId:{
        type: DataTypes.INTEGER,
        references: {
            model: Users,
            key: 'id'
        }
    },
    activityId:{
        type: DataTypes.INTEGER,
        references: {
            model: Activities,
            key: 'id'
        }
    }
});

Users.belongsToMany(Activities, { through: U_A_Participation });
Activities.belongsToMany(Users, { through: U_A_Participation });
(async () => {
    await db.sync();
})();

export default U_A_Participation;