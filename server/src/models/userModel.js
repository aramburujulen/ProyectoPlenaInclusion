import { Sequelize } from "sequelize";
import db from "../config/database.js";

const { DataTypes } = Sequelize;

const Users = db.define("users",{
    email:{
        type: DataTypes.STRING
    },
    name:{
        type: DataTypes.STRING
    },
    password:{
        type: DataTypes.STRING
    },
    age:{
        type: DataTypes.INTEGER
    }
},{
    freezeTableName: true
});

(async () => {
    await db.sync();
})();
export default Users;

