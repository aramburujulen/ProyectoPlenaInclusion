import Participation from "../models/participationModel.js";

export const GetParticipations = async(req, res) => {
    try{
        const participations = await Participation.findAll({
            attributes:["idUser", "idActivity"]
        });
        res.json(participations);
    }catch(error){
        console.log(error);
    }
}