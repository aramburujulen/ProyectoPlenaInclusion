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