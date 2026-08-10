const express = require("express");
const router = express.Router();

const {
    addWaterRecord,
    getWaterRecords,
    updateWaterRecord,
    deleteWaterRecord
} = require("../controllers/water.controller");

const {
    verifyToken,
    authorizeRoles
} = require("../middleware/auth.middleware");

router.post(
    "/",
    verifyToken,
    authorizeRoles("user"),
    addWaterRecord
);

router.get(
    "/",
    verifyToken,
    authorizeRoles("user"),
    getWaterRecords
);

router.put(
    "/:recordId",
    verifyToken,
    authorizeRoles("user"),
    updateWaterRecord
);

router.delete(
    "/:recordId",
    verifyToken,
    authorizeRoles("user"),
    deleteWaterRecord
);

module.exports = router;