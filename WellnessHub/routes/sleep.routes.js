const express = require("express");
const router = express.Router();

const {
    addSleepRecord,
    getSleepRecords,
    updateSleepRecord,
    deleteSleepRecord
} = require("../controllers/sleep.controller");

const {
    verifyToken
} = require("../middleware/auth.middleware");

router.post("/", verifyToken, addSleepRecord);
router.get("/", verifyToken, getSleepRecords);
router.put("/:recordId", verifyToken, updateSleepRecord);
router.delete("/:recordId", verifyToken, deleteSleepRecord);

module.exports = router;