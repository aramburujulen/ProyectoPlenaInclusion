import Participants from "../models/participantModel.js";
import generator from "generate-password";
import bcrypt, { hash } from "bcrypt";
import Users from "../models/userModel.js";


export const GenerateAccount = async(req, res) => {
    const{email, name, age, notifications, disability} = req.body;
    console.log(notifications);
    var password = generator.generate({
        length: 10,
        numbers: true
    });
    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(password, salt);
    try{
        const user =  await Users.create({
            email: email,
            name: name,
            password: hashPassword,
            age: age
        })
        await Participants.create({
            notifications: true,
            disability: disability,
            userId: user.id
        });
        res.json({msg: "Registration Successful: Your password is: "+password});
    }catch(error){
        console.log(error);
    }
}

export const RemoveParticipant = async(req, res) => {
    try{
        const{id} = req.body;
        const partDelete = await Participants.findOne({
            where: {
                id:id
            }
        })
        await Participants.destroy({
            where: {
                id: id,
            }
        });
        console.log(partDelete.userId);
        await Users.destroy({
            where: {
                id: partDelete.userId
            }
        });
        res.json({msg: "PARTICIPANT DELETED"});
    }catch(error){
        console.log(error);
    }
}

export const ModifyParticipant = async(req, res) => {
    try{
        const {id, email, name, age, disability} = req.body;
        var password = generator.generate({
            length: 10,
            numbers: true
        });
        const salt = await bcrypt.genSalt();
        const hashPassword = await bcrypt.hash(password, salt);
        var valuesParticipant = {
            disability: disability,
            notifications: true
        }
        var selectorParticipant = {
            where: {
                id:id
            }
        }
        await Participants.update(valuesParticipant, selectorParticipant);
        var valuesUser = {
            email: email,
            name: name,
            age: age,
            password: hashPassword
        }
        const partUser = await Participants.findOne({
            where: {
                id:id
            }
        })
        console.log(partUser.userId);
        var selectorUser = {
            where: {
                id: partUser.userId
            }
            
        }
        await Users.update(valuesUser, selectorUser);
        res.json("Participant modified, new password is: " +password);
    }catch(error){
        console.log(error);
    }
}