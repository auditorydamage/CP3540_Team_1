const express = require("express");
const router = express.Router();

const {
    addWaterRecord,
    getWaterRecords,
    updateWaterRecord,
    deleteWaterRecord
} = require("../controllers/water.controller");

const {
    verifyToken
} = require("../middleware/auth.middleware");

router.post("/", verifyToken, addWaterRecord);
router.get("/", verifyToken, getWaterRecords);
router.put("/:recordId", verifyToken, updateWaterRecord);
router.delete("/:recordId", verifyToken, deleteWaterRecord);

module.exports = router;
