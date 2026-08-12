const express = require("express");
const router = express.Router();

const {
    addSleepRecord,
    getSleepRecords,
    updateSleepRecord,
    deleteSleepRecord
} = require("../controllers/sleep.controller");

const {
    verifyToken,
    authorizeRoles
} = require("../middleware/auth.middleware");

router.post(
    "/",
    verifyToken,
    authorizeRoles("user"),
    addSleepRecord
);

router.get(
    "/",
    verifyToken,
    authorizeRoles("user"),
    getSleepRecords
);

router.put(
    "/:recordId",
    verifyToken,
    authorizeRoles("user"),
    updateSleepRecord
);

router.delete(
    "/:recordId",
    verifyToken,
    authorizeRoles("user"),
    deleteSleepRecord
);

module.exports = router;