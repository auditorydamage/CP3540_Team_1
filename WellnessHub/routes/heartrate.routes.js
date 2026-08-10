const express = require("express");
const router = express.Router();

const {
    addHeartRateRecord,
    getHeartRateRecords,
    updateHeartRateRecord,
    deleteHeartRateRecord
} = require("../controllers/heartrate.controller");

const {
    verifyToken
} = require("../middleware/auth.middleware");

router.post("/", verifyToken, addHeartRateRecord);
router.get("/", verifyToken, getHeartRateRecords);
router.put("/:recordId", verifyToken, updateHeartRateRecord);
router.delete("/:recordId", verifyToken, deleteHeartRateRecord);

module.exports = router;
