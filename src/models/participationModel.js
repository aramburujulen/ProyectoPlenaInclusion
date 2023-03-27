import { Sequelize } from "sequelize";
import db from "../config/database.js";
import Activities from "./activityModel.js";
import Users from "./userModel.js";

const { DataTypes } = Sequelize;

const Participation = db.define("Participation", {
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
},{
    freezeTableName: true
});


Users.belongsToMany(Activities, { through: Participation });
Activities.belongsToMany(Users, { through: Participation });
(async () => {
    await db.sync();
})();

export default Participation;