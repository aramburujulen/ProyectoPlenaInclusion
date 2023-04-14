import Participants from "../models/participantModel.js";
import generator from "generate-password";
import bcrypt from "bcrypt";
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