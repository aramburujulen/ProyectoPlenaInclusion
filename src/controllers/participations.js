import Activities from "../models/activityModel.js";
import Users from "../models/userModel.js";
import Participation from "../models/participationModel.js";

export const AddParticipation = async(req, res) => {
    const{userId, activityId} = req.body;
    try{
        await Participation.create({
            userId: userId,
            activityId: activityId,
        });
        res.json({msg: "Your participation was added succesfully"});
    }catch(error){
        console.log(error);
    }
}
export const GetParticipations = async(req, res) => {
    try{
        const participations = await Participation.findAll({
            include: {
                model: Activities,
                attributes: ['name']
            },
            attributes: ['userId', 'activityId'],
        });
        res.json(participations);
    }catch(error){
        console.log(error);
    }
}

export const GetParticipantParticipations = async(req, res) => {
    try{
        const {nameToSearch} = req.body;
        const usersActivities = await Participation.findAll({
            include: [{
                model: Activities,
                attributes: ['name']
            }, {
                model: Users,
                where:{
                    name: nameToSearch,
                },
                attributes: ['name']
            }],
            attributes: ['userId', 'activityId'],
            }); 
            if(usersActivities.length == 0)  res.json({msg: "Sorry, "+nameToSearch+" has not joined any activity yet"});
            res.json(usersActivities);
    }catch(error){
        console.log(error);
    }
}