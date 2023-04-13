import Users from "../models/userModel.js";
import bcrypt from "bcrypt";

//npm install bcrypt

export const GetUsers = async(req, res) => {
    try{
        const users = await Users.findAll({
            attributes:["id","name","password"]
        });
        res.json(users);
    } catch(error){
        console.log(error);
    }
}
export const Register = async(req,res) =>{
    const{username, password, confPassword} = req.body;
    if(password !== confPassword) return res.status(400).json({msg: "Password and Confirmation don't match"});
    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(password, salt);
    try{
        await Users.create({
            name: username,
            password: hashPassword
        });
        res.json({msg: "Registration Successful"});
    }catch(error){
        console.log(error);
    }
}
