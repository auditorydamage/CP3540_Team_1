const express = require("express");
const router = express.Router();

const {
    addMealPlan,
    getMealPlans,
    updateMealPlan,
    deleteMealPlan
} = require("../controllers/mealplan.controller");

const {
    verifyToken
} = require("../middleware/auth.middleware");

router.post("/", verifyToken, addMealPlan);
router.get("/", verifyToken, getMealPlans);
router.put("/:recordId", verifyToken, updateMealPlan);
router.delete("/:recordId", verifyToken, deleteMealPlan);

module.exports = router;