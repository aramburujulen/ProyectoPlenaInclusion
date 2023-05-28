import Professionals from "../models/professionalModel.js";
import bcrypt from "bcrypt";
import Users from "../models/userModel.js";

export const RegisterProfessional = async(req,res) =>{
    const{email, name, age, specialization, availability, password, confPassword} = req.body;
    if(password !== confPassword) return res.status(400).json({msg: "Password and Confirmation don't match"});
    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(password, salt);
    try{
        const user = await Users.create({
            email: email,
            name: name,
            age: age,
            password: hashPassword
        })
        await Professionals.create({
            specialization: specialization,
            availability: availability,
            userId: user.id
        });
        res.json({msg: "Registration Successful"});
    }catch(error){
        console.log(error);
    }
}

export const RemoveProfessional = async(req, res) => {
    try{
        const{id} = req.body;
        const proDelete = await Professionals.findOne({
            where: {
                id:id
            }
        })
        await Professionals.destroy({
            where: {
                id: id,
            }
        });
        await Users.destroy({
            where: {
                id: proDelete.userId
            }
        });
        res.json({msg: "PROFESSIONAL DELETED"});
    }catch(error){
        console.log(error);
    }
}

export const ModifyProfessional = async(req, res) => {
    try{
        const {id, email, name, password, age, specialization, availability} = req.body;
        const salt = await bcrypt.genSalt();
        const hashPassword = await bcrypt.hash(password, salt);
        var valuesParticipant = {
            specialization: specialization,
            availability: availability
        }
        var selectorParticipant = {
            where: {
                id:id
            }
        }
        await Professionals.update(valuesParticipant, selectorParticipant);
        var valuesUser = {
            email: email,
            name: name,
            age: age,
            password: hashPassword
        }
        const proUser = await Professionals.findOne({
            where: {
                id:id
            }
        })
        var selectorUser = {
            where: {
                id: proUser.userId
            }
            
        }
        await Users.update(valuesUser, selectorUser);
        res.json("Professional modified");
    }catch(error){
        console.log(error);
    }
}


