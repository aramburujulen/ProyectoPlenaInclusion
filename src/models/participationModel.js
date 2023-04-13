import { Sequelize } from "sequelize";
import db from "../config/database.js";
import Users from "./userModel.js";
import Activities from "./activityModel.js";

const { DataTypes } = Sequelize;

const Participation = db.define("Participation", {
    userId:{
        type: DataTypes.INTEGER,
        references: {
            model: db.models.Users,
            key: 'id'
        }
    },
    activityId:{
        type: DataTypes.INTEGER,
        references: {
            model: db.models.Activities,
            key: 'id'
        }
    }
},{
    freezeTableName: true
});
Users.belongsToMany(Activities, { through: Participation });
Activities.belongsToMany(Users, { through: Participation });
/**
 * In order to access an attribute from one of the tables whose relationship create an N:N table, it's required for us to initialize
 * an extra association between the N:N table and the one we want to get information from.
 */
Participation.belongsTo(Activities);
Participation.belongsTo(Users);

(async () => {
    await db.sync();
})();


export default Participation;