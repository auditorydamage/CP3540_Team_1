const express = require("express");
const router = express.Router();

const {
    addWalkingRecord,
    getWalkingRecords,
    updateWalkingRecord,
    deleteWalkingRecord
} = require("../controllers/walking.controller");

const {
    verifyToken
} = require("../middleware/auth.middleware");

router.post("/", verifyToken, addWalkingRecord);
router.get("/", verifyToken, getWalkingRecords);
router.put("/:recordId", verifyToken, updateWalkingRecord);
router.delete("/:recordId", verifyToken, deleteWalkingRecord);

module.exports = router;
