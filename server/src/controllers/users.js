import Users from "../models/userModel.js";
import bcrypt from "bcrypt";

//npm install bcrypt

export const GetUsers = async(req, res) => {
    try{
        const users = await Users.findAll({
            attributes:["id","email", "name","password", "age"]
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

export const ChangeEmail = async(req, res) => {
    const{email, newEmail} = req.body;
    const userToChange = await Users.findOne({
        where: {
            email: email,
        }
    })
    var values = {
        email: newEmail,
    }

    var selector = {
        where: {
            email: userToChange.email,
        }
        
    }
    await Users.update(values, selector);
    res.json({msg: "Email modificado: " +newEmail});
}

export const ChangePassword = async(req, res) => {
    const{oldPw, newPw} = req.body;
    const salt = await bcrypt.genSalt();
    const newHashPassword = await bcrypt.hash(newPw, salt);

    const userToChange = await Users.findOne({
        where: {
            password: oldPw,
        }
    })
    var values = {
        password: newHashPassword,
    }

    var selector = {
        where: {
            email: userToChange.email,
        }
        
    }
    await Users.update(values, selector);
    res.json({msg: "Contraseña modificada: " +newPw});
}
