const express = require("express");
const router = express.Router();

const {
    addActivity,
    getActivities,
    updateActivity,
    deleteActivity
} = require("../controllers/activity.controller");

const {
    verifyToken
} = require("../middleware/auth.middleware");

router.post("/", verifyToken, addActivity);
router.get("/", verifyToken, getActivities);
router.put("/:recordId", verifyToken, updateActivity);
router.delete("/:recordId", verifyToken, deleteActivity);

module.exports = router;