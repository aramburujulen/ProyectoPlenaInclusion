import { Sequelize } from "sequelize";
import Activities from "../models/activityModel.js";

export const AddActivity = async(req, res) => {
    const{name, description, maxParticipants, date} = req.body;
    try{
        await Activities.create({
            name: name,
            description: description,
            isActive: true,
            maxParticipants: maxParticipants,
            date: date,
        });
        res.json({msg: "Your activity " +name+ " was added succesfully"});
    }catch(error){
        console.log(error);
    }
}

export const GetActivities = async(req, res) => {
    try{
        const activities = await Activities.findAll({
            attributes:["id", "name", "description", "isActive", "maxParticipants", "date"]
        });
        res.json(activities);
    }catch(error){
        console.log(error);
    }
}

export const GetAvailableActivities = async(req, res) => {
    try{
        const {dateInit, dateEnd} = req.body;
        const availableActivities = await Activities.findAll({
            where: {
                date: {
                    [Sequelize.Op.between]: [dateInit, dateEnd],
                },
                isActive: true
            },
            attributes:["id", "name", "description", "maxParticipants", "date"],
        });
        console.log(dateInit, dateEnd)
        res.json(availableActivities);
    }catch(error){
        console.log(error);
    }
}