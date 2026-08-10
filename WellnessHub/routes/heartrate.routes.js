const express = require("express");
const router = express.Router();

const {
    addHeartRateRecord,
    getHeartRateRecords,
    updateHeartRateRecord,
    deleteHeartRateRecord
} = require("../controllers/heartrate.controller");

const {
    verifyToken,
    authorizeRoles
} = require("../middleware/auth.middleware");

router.post(
    "/",
    verifyToken,
    authorizeRoles("user"),
    addHeartRateRecord
);

router.get(
    "/",
    verifyToken,
    authorizeRoles("user"),
    getHeartRateRecords
);

router.put(
    "/:recordId",
    verifyToken,
    authorizeRoles("user"),
    updateHeartRateRecord
);

router.delete(
    "/:recordId",
    verifyToken,
    authorizeRoles("user"),
    deleteHeartRateRecord
);

module.exports = router;