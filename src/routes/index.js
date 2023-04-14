import express from "express";
import { AddActivity, GetActivities, GetAvailableActivities, RemoveActivity } from "../controllers/activities.js";
import { AddParticipation, GetParticipantParticipations, GetParticipations } from "../controllers/participations.js";
import  { GetUsers }  from "../controllers/users.js";
import { RegisterProfessional, RemoveProfessional } from "../controllers/professionals.js";
import { GenerateAccount, RemoveParticipant } from "../controllers/participants.js";
const router = express.Router();

router.get("/", (req, res) => {
    res.render("pages/index");
});

router.post("/login", (req, res) => {
    console.log(req.body);
    res.render("pages/show_info", {
        username: req.body.username,
        password: req.body.password
    });
});
//#region router
router.post("/getUsers", GetUsers);
router.post("/addActivity", AddActivity);
router.post("/getActivities", GetActivities);
router.post("/addParticipation", AddParticipation);
//router.post("/getParticipations", GetParticipations);
router.post("/registerProfessional", RegisterProfessional);
router.post("/getUserParticipations", GetParticipantParticipations);
router.post("/getAvailableActivities", GetAvailableActivities);
router.post("/generateAccount", GenerateAccount);
router.post("/removeActivity", RemoveActivity);
router.post("/removeParticipant", RemoveParticipant);
router.post("/removeProfessional", RemoveProfessional);
//#endregion
export default router;