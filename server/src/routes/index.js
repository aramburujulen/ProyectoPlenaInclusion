import express from "express";
import { AddActivity, FindActivityById, GetActivities, GetAvailableActivities, ModifyActivity, RemoveActivity } from "../controllers/activities.js";
import { AddParticipation, GetNullParticipations, GetParticipantParticipations, GetParticipations, RemoveParticipation } from "../controllers/participations.js";
import  { ChangeEmail, ChangePassword, GetUsers, LogIn, Logout }  from "../controllers/users.js";
import { ModifyProfessional, RegisterProfessional, RemoveProfessional } from "../controllers/professionals.js";
import { GenerateAccount, ModifyParticipant, RemoveParticipant, changeNotifs } from "../controllers/participants.js";
import  {verifyToken} from "../middleware/VerifyToken.js";
import { refreshToken } from "../controllers/RefreshToken.js";
const router = express.Router();

router.get("/", (req, res) => {
    res.render("pages/index");
});

//#region router
router.post("/getUsers", verifyToken, GetUsers);
router.post("/addActivity", AddActivity);
router.post("/findActivityById", FindActivityById);
router.post("/getActivities", GetActivities);
router.post("/addParticipation", verifyToken, AddParticipation);
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
router.post("/changeEmail", verifyToken, ChangeEmail);
router.post("/changePassword", verifyToken, ChangePassword);
router.post("/getNullParticipations", GetNullParticipations);
router.get('/token', refreshToken);
router.post("/changeNotifs", changeNotifs);
router.delete('/logout', Logout);
//#endregion
export default router;