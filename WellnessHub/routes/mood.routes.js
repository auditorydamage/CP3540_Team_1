const express = require("express");
const router = express.Router();

const {
    addMoodRecord,
    getMoodRecords,
    updateMoodRecord,
    deleteMoodRecord
} = require("../controllers/mood.controller");

const {
    verifyToken,
    authorizeRoles
} = require("../middleware/auth.middleware");

router.post(
    "/",
    verifyToken,
    authorizeRoles("user"),
    addMoodRecord
);

router.get(
    "/",
    verifyToken,
    authorizeRoles("user"),
    getMoodRecords
);

router.put(
    "/:recordId",
    verifyToken,
    authorizeRoles("user"),
    updateMoodRecord
);

router.delete(
    "/:recordId",
    verifyToken,
    authorizeRoles("user"),
    deleteMoodRecord
);

module.exports = router;