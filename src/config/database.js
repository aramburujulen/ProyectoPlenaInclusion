import { Sequelize } from "sequelize";

//npm install sequelize

const db = new Sequelize("plenainclusion", "root", "666666", {
    host: "localhost",
    dialect: "mysql"
});
console.log("Hola data");
export default db;