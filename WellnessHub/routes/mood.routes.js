const express = require("express");
const router = express.Router();

const {
    addMoodRecord,
    getMoodRecords,
    updateMoodRecord,
    deleteMoodRecord
} = require("../controllers/mood.controller");

const {
    verifyToken
} = require("../middleware/auth.middleware");

router.post("/", verifyToken, addMoodRecord);
router.get("/", verifyToken, getMoodRecords);
router.put("/:recordId", verifyToken, updateMoodRecord);
router.delete("/:recordId", verifyToken, deleteMoodRecord);

module.exports = router;
