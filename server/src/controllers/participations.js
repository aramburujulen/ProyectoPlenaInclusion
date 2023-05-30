import Activities from "../models/activityModel.js";
import Users from "../models/userModel.js";
import Participation from "../models/participationModel.js";


export const AddParticipation = async (req, res) => {
    const { userId, activityId } = req.body;
    try {
        await Participation.create({
            userId: userId,
            activityId: activityId,
        });
        res.json({ msg: "Your participation was added succesfully" });
    } catch (error) {
        console.log(error);
    }
}
export const GetParticipations = async (req, res) => {
    try {
        const participations = await Participation.findAll({
            include: {
                model: Activities,
                attributes: ['name']
            },
            attributes: ['userId', 'activityId'],
        });
        res.json(participations);
    } catch (error) {
        console.log(error);
    }
}
export const GetNullParticipations = async (req, res) => {
    try {
        const { nameToSearch } = req.body;
        const usersActivities = await Participation.findAll({
            include: [{
                model: Activities,
                attributes: ['name']
            }, {
                model: Users,
                where: {
                    name: nameToSearch,
                },
                attributes: ['name']
            }],
            attributes: ['userId', 'activityId'],
        });
        console.log(usersActivities);
        const allActivities = await Activities.findAll({
            attributes: ["id", "name", "description", "isActive", "maxParticipants", "date"]
        });
        for (let i = 0; i < usersActivities.length; i++) {
            for (let j = 0; j < allActivities.length; j++) {
                if (usersActivities[i].activityId === allActivities[j].id) {
                    allActivities.splice(j, 1);
                }
            }
        }
        res.json(allActivities);
    } catch (error) {
        console.log(error);
    }
}
export const GetParticipantParticipations = async (req, res) => {
    try {
        const { nameToSearch } = req.body;
        const usersActivities = await Participation.findAll({
            include: [{
                model: Activities,
                attributes: ['name']
            }, {
                model: Users,
                where: {
                    name: nameToSearch,
                },
                attributes: ['name']
            }],
            attributes: ['userId', 'activityId'],
        });
        if (usersActivities.length == 0) return res.json({ msg: "Sorry, " + nameToSearch + " has not joined any activity yet" });
        res.json(usersActivities);
    } catch (error) {
        console.log(error);
    }
}
export const GetJoinedActivities = async (id) => {
    try {
        const usersActivities = await Participation.findAll({
            include: [{
                model: Activities,
                attributes: ['name']
            }, {
                model: Users,
                where: {
                    id: id,
                },
                attributes: ['name']
            }],
            attributes: ['userId', 'activityId'],
        });
        const allActivities = await Activities.findAll({
            attributes: ["id", "name", "description", "isActive", "maxParticipants", "date"]
        });
        for (let i = 0; i < usersActivities.length; i++) {
            for (let j = 0; j < allActivities.length; j++) {
                if (usersActivities[i].activityId != allActivities[j].id) {
                    allActivities.splice(j, 1);
                }
            }
        }
        return allActivities;
    } catch(error){
        console.log(error);
    }
}
export const RemoveParticipation = async (req, res) => {
    try {
        const { idUs, idAc } = req.body;
        await Participation.destroy({
            where: {
                activityId: idAc,
                userId: idUs
            }
        });
        res.json({ msg: "Participation removed" });
    } catch (error) {
        console.log(error);
    }
}