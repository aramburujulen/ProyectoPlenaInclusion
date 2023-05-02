import { Sequelize } from "sequelize";

//npm install sequelize

const db = new Sequelize("plenainclusion", "root", "YouCan", {
    host: "localhost",
    dialect: "mysql"
});

export default db;