const Account = require("../models/account.model");

// Add a meal-plan record
const addMealPlan = async (req, res) => {
    try {
        const { meal, date } = req.body;

        if (typeof meal !== "string" || meal.trim() === "") {
            return res.status(400).json({
                message: "Meal must be a non-empty string."
            });
        }

        const account = await Account.findById(
            req.account.accountId
        );

        if (!account) {
            return res.status(404).json({
                message: "Account not found."
            });
        }

        if (account.accountType !== "user") {
            return res.status(403).json({
                message: "Meal-plan tracking is available only to user accounts."
            });
        }

        if (!account.userData) {
            account.userData = {};
        }

        if (!account.userData.mealPlans) {
            account.userData.mealPlans = [];
        }

        account.userData.mealPlans.push({
            date: date || new Date(),
            meal: meal.trim()
        });

        await account.save();

        const newMealPlan =
            account.userData.mealPlans[
                account.userData.mealPlans.length - 1
            ];

        return res.status(201).json({
            message: "Meal plan added successfully.",
            mealPlan: newMealPlan
        });
    } catch (error) {
        return res.status(500).json({
            message: "Unable to add meal plan.",
            error: error.message
        });
    }
};

// Retrieve all meal plans
const getMealPlans = async (req, res) => {
    try {
        const account = await Account.findById(
            req.account.accountId
        ).select("accountType userData.mealPlans");

        if (!account) {
            return res.status(404).json({
                message: "Account not found."
            });
        }

        if (account.accountType !== "user") {
            return res.status(403).json({
                message: "Meal-plan tracking is available only to user accounts."
            });
        }

        return res.status(200).json({
            message: "Meal plans retrieved successfully.",
            mealPlans: account.userData?.mealPlans || []
        });
    } catch (error) {
        return res.status(500).json({
            message: "Unable to retrieve meal plans.",
            error: error.message
        });
    }
};

// Update a meal plan
const updateMealPlan = async (req, res) => {
    try {
        const { recordId } = req.params;
        const { meal, date } = req.body;

        if (typeof meal !== "string" || meal.trim() === "") {
            return res.status(400).json({
                message: "Meal must be a non-empty string."
            });
        }

        const account = await Account.findById(
            req.account.accountId
        );

        if (!account) {
            return res.status(404).json({
                message: "Account not found."
            });
        }

        if (account.accountType !== "user") {
            return res.status(403).json({
                message: "Meal-plan tracking is available only to user accounts."
            });
        }

        const mealPlans = account.userData?.mealPlans || [];

        const mealPlan = mealPlans.find(
            record =>
                String(record._id) === String(recordId).trim()
        );

        if (!mealPlan) {
            return res.status(404).json({
                message: "Meal plan not found."
            });
        }

        mealPlan.meal = meal.trim();

        if (date) {
            mealPlan.date = date;
        }

        await account.save();

        return res.status(200).json({
            message: "Meal plan updated successfully.",
            mealPlan
        });
    } catch (error) {
        return res.status(500).json({
            message: "Unable to update meal plan.",
            error: error.message
        });
    }
};

// Delete a meal plan
const deleteMealPlan = async (req, res) => {
    try {
        const { recordId } = req.params;

        const account = await Account.findById(
            req.account.accountId
        );

        if (!account) {
            return res.status(404).json({
                message: "Account not found."
            });
        }

        if (account.accountType !== "user") {
            return res.status(403).json({
                message: "Meal-plan tracking is available only to user accounts."
            });
        }

        const mealPlans = account.userData?.mealPlans || [];

        const recordIndex = mealPlans.findIndex(
            record =>
                String(record._id) === String(recordId).trim()
        );

        if (recordIndex === -1) {
            return res.status(404).json({
                message: "Meal plan not found."
            });
        }

        const deletedMealPlan = mealPlans[recordIndex];

        mealPlans.splice(recordIndex, 1);
        await account.save();

        return res.status(200).json({
            message: "Meal plan deleted successfully.",
            mealPlan: deletedMealPlan
        });
    } catch (error) {
        return res.status(500).json({
            message: "Unable to delete meal plan.",
            error: error.message
        });
    }
};

module.exports = {
    addMealPlan,
    getMealPlans,
    updateMealPlan,
    deleteMealPlan
};