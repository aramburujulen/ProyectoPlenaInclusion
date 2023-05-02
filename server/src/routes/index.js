import express from "express";
import { AddActivity, FindActivityById, GetActivities, GetAvailableActivities, ModifyActivity, RemoveActivity } from "../controllers/activities.js";
import { AddParticipation, GetNullParticipations, GetParticipantParticipations, GetParticipations, RemoveParticipation } from "../controllers/participations.js";
import  { ChangeEmail, ChangePassword, GetUsers }  from "../controllers/users.js";
import { LogIn, ModifyProfessional, RegisterProfessional, RemoveProfessional } from "../controllers/professionals.js";
import { GenerateAccount, ModifyParticipant, RemoveParticipant } from "../controllers/participants.js";
const router = express.Router();

router.get("/", (req, res) => {
    res.render("pages/index");
});

//#region router
router.post("/getUsers", GetUsers);
router.post("/addActivity", AddActivity);
router.post("/findActivityById",FindActivityById);
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
router.post("/removeParticipation", RemoveParticipation);
router.post("/modifyParticipant", ModifyParticipant);
router.post("/modifyActivity", ModifyActivity);
router.post("/modifyProfessional", ModifyProfessional);
router.post("/logIn", LogIn);
router.post("/changeEmail", ChangeEmail);
router.post("/changePassword", ChangePassword);
router.post("/getNullParticipations", GetNullParticipations);

//#endregion
export default router;