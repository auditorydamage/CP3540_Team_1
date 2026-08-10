const express = require("express");
const router = express.Router();

const {
    addWeightRecord,
    getWeightRecords,
    updateWeightRecord,
    deleteWeightRecord
} = require("../controllers/weight.controller");

const {
    verifyToken
} = require("../middleware/auth.middleware");

router.post("/", verifyToken, addWeightRecord);
router.get("/", verifyToken, getWeightRecords);
router.put("/:recordId", verifyToken, updateWeightRecord);
router.delete("/:recordId", verifyToken, deleteWeightRecord);

module.exports = router;