import express from "express";
import { AddActivity, GetActivities } from "../controllers/activities.js";
import { AddParticipation, GetParticipations } from "../controllers/participations.js";
import  { GetUsers, Register }  from "../controllers/users.js";
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

router.post("/getUsers", GetUsers);
router.post("/registerUser", Register);
router.post("/addActivity", AddActivity);
router.post("/getActivities", GetActivities);
router.post("/addParticipation", AddParticipation);
router.post("/getParticipations", GetParticipations);
export default router;