import Activities from "../models/activityModel.js";

export const AddActivity = async(req, res) => {
    const{name, description, maxParticipants} = req.body;
    try{
        await Activities.create({
            name: name,
            description: description,
            isActive: true,
            maxParticipants: maxParticipants,
        });
        res.json({msg: "Your activity" +name+ "was added succesfully"});
    }catch(error){
        console.log(error);
    }
}

export const GetActivities = async(req, res) => {
    try{
        const activities = await Activities.findAll({
            attributes:["name", "description", "isActive", "maxParticipants"]
        });
        res.json(activities);
    }catch(error){
        console.log(error);
    }
}