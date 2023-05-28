import Participants from "../models/participantModel.js";
import generator from "generate-password";
import bcrypt, { hash } from "bcrypt";
import Users from "../models/userModel.js";
import nodemailer from "nodemailer";
import { GetJoinedActivities, GetParticipantParticipations } from "./participations.js";
import cron from "node-cron";


const sendEmail = async(email, userName, pass, isWeekly, id) => {
    const transport = nodemailer.createTransport({
        service: "gmail",
        auth:{
            user: "llorenteguay@gmail.com",
            pass: "oojyvrkqanhtazne"
        }
    });

    if(isWeekly){
        console.log(id);
        const activities = await GetJoinedActivities(id); // Retrieve activities
        const activityNames = [];
        for(let i = 0; i < activities.length; i++){
            activityNames.push(activities[i].name);
        }

        const weeklyMailOptions = {
            from: "llorenteguay@gmail.com",
            to: email,
            subject: `Actividades de esta semana`,
            text: `Hola, ${userName}, hoy es el mejor lunes de la semana, tienes las siguientes actividades: ${activityNames.join(', ')}`
        }

        transport.sendMail(weeklyMailOptions, function(error, info){
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });
    }else{
        const mailOptions = {
            from: "llorenteguay@gmail.com",
            to: email,
            subject: `Gracias por registrarte, ${userName}`,
            text: `Tu contraseña es: ${pass}`
        }
        transport.sendMail(mailOptions, function(error, info){
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });
    }
    
}
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
        sendEmail(email, name, password,false, 0);
        res.json({msg: "Registration Successful: Your password is: "+password});
    }catch(error){
        console.log(error);
    }
}
const getAllParticipantsWithCheck = async() => {
    try {
        // Fetch all participants from the database
        const participantIds = await Participants.findAll({
            attributes: ['userId'],
            where:{
                notifications: 1,
            }
        });
        let participants = [];
        for (let i = 0; i < participantIds.length; i++) {
            const participantId = participantIds[i].userId;
            const participant = await Users.findOne({
                where: {
                id: participantId,
                },
            });
            console.log("Participant:", participant);
            participants.push(participant);
        }
        console.log("Participants:", participants);
        return participants;
        } catch (error) {
            console.log(error);
    }
};
cron.schedule('43 19 * * SUN', async () => {
    try {
        const participants = await getAllParticipantsWithCheck();
        for (let i = 0; i < participants.length; i++) {
            console.log("SENDING EMAIL WITH "+participants[i].id);
            await sendEmail(participants[i].email, participants[i].name, null, true, participants[i].id);
        }
        console.log('Weekly emails sent to all participants');
    } catch (error) {
        console.error('Error sending weekly emails:', error);
    }
});
export const changeNotifs = async(req, res) => {
    try{
        const{id, notifications} = req.body;
        var values = {
            notifications: notifications
        }
        var selector = {
            where:{
                userId:id
            }
        }
        await Participants.update(values, selector);
        res.json({msg: "Notificaciones cambiadas"});
    } catch(error){
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