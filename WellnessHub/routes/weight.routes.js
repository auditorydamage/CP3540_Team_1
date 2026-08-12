const express = require("express");
const router = express.Router();

const {
    addWeightRecord,
    getWeightRecords,
    updateWeightRecord,
    deleteWeightRecord
} = require("../controllers/weight.controller");

const {
    verifyToken,
    authorizeRoles
} = require("../middleware/auth.middleware");

router.post(
    "/",
    verifyToken,
    authorizeRoles("user"),
    addWeightRecord
);

router.get(
    "/",
    verifyToken,
    authorizeRoles("user"),
    getWeightRecords
);

router.put(
    "/:recordId",
    verifyToken,
    authorizeRoles("user"),
    updateWeightRecord
);

router.delete(
    "/:recordId",
    verifyToken,
    authorizeRoles("user"),
    deleteWeightRecord
);

module.exports = router;