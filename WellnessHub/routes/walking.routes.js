const express = require("express");
const router = express.Router();

const {
    addWalkingRecord,
    getWalkingRecords,
    updateWalkingRecord,
    deleteWalkingRecord
} = require("../controllers/walking.controller");

const {
    verifyToken,
    authorizeRoles
} = require("../middleware/auth.middleware");

router.post(
    "/",
    verifyToken,
    authorizeRoles("user"),
    addWalkingRecord
);

router.get(
    "/",
    verifyToken,
    authorizeRoles("user"),
    getWalkingRecords
);

router.put(
    "/:recordId",
    verifyToken,
    authorizeRoles("user"),
    updateWalkingRecord
);

router.delete(
    "/:recordId",
    verifyToken,
    authorizeRoles("user"),
    deleteWalkingRecord
);

module.exports = router;