import Users from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";

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
    const{userId, newPw} = req.body;
    const user = await Users.findOne({
        where:{
            id: userId,
        }
    })
    const oldPw = user.password;
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

export const LogIn = async(req, res) => {
    try{
        console.log(process.env.ACCESS_TOKEN_SECRET);
        console.log(process.env.REFRESH_TOKEN_SECRET);
        const {email, password} = req.body;
        const emailUser = await Users.findOne({
            where: {
                email: email,
            }
        });
        if(!emailUser){
            res.json({msg: "Email Incorrecto"});
            return
        }
        var valid = await bcrypt.compare(password, emailUser.password);
        if(!valid){
            res.json({msg: "Contraseña Incorrecta"});
            return
        }
        const userId = emailUser.id;
        const name  = emailUser.name;
        const userEmail = emailUser.email; 
        const accessToken = jwt.sign({userId, name, userEmail}, process.env.ACCESS_TOKEN_SECRET,{
            expiresIn: '15s'
        });
        const refreshToken = jwt.sign({userId, name, userEmail}, process.env.REFRESH_TOKEN_SECRET,{
            expiresIn: '1d'
        });
        await Users.update({refreshToken: refreshToken},{
            where:{
                id: userId
            }
        });
        res.cookie('refreshToken', refreshToken,{
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000
        });
        res.json({msg: "¡Datos Correctos, Bienvenido!", emailUser, accessToken: accessToken});
    }catch(error){
        console.log(error);
    }
}

export const Logout = async(req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if(!refreshToken) return res.sendStatus(204);
    const user = await Users.findAll({
        where:{
            refreshToken: refreshToken
        }
    });
    if(!user[0]) return res.sendStatus(204);
    const userId = user[0].id;
    await Users.update({refresh_token: null},{
        where:{
            id: userId
        }
    });
    res.clearCookie('refreshToken');
    return res.sendStatus(200);
}
