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

export const RemoveActivity = async(req, res) => {
    try{
        const{id} = req.body;
        await Activities.destroy({
            where: {
                id: id,
            }
        });
        res.json({msg: "ACTIVITY DELETED"});
    }catch(error){
        console.log(error);
    }
}

export const ModifyActivity = async(req, res) => {
    try{
        const{id, name, description, maxParticipants, date} = req.body;
        var values = {
            name: name,
            description: description,
            maxParticipants: maxParticipants,
            date: date
        };
        var selector = {
            where: {
                id: id
            }
        };
        await Activities.update(values, selector);
        res.json({msg: "Activity changed"});
    }catch(error){
        console.log(error)
    }
}

export const FindActivityById = async(req, res) => {
    try{
        const{id} = req.body;
        console.log(id);
        const activity = await Activities.findOne({
            where: {
                id:id
            },
            attributes:["id", "name", "description", "maxParticipants", "date"],
        })
        res.json(activity);
    }catch(error){
        console.log(error)
    }
}