import { Sequelize } from "sequelize";
import db from "../config/database.js";
import Users from "./userModel.js";
const {DataTypes} = Sequelize;

const Professionals = db.define("professionals",{
    specialization: {
        type: DataTypes.STRING,
        default: "none"
    },
    availability: {
        type: DataTypes.STRING,
        default: "todos"
    }
    
},{
    freezeTableName: true
})

Users.hasMany(Professionals);
Professionals.belongsTo(Users);

(async () => {
    await db.sync();
})();

export default Professionals;