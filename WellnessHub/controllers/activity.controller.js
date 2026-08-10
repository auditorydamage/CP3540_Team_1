const Account = require("../models/account.model");

// Add an activity record
const addActivity = async (req, res) => {
    try {
        const { activity, date } = req.body;

        if (typeof activity !== "string" || activity.trim() === "") {
            return res.status(400).json({
                message: "Activity must be a non-empty string."
            });
        }

        const account = await Account.findById(req.account.accountId);

        if (!account) {
            return res.status(404).json({
                message: "Account not found."
            });
        }

        if (account.accountType !== "user") {
            return res.status(403).json({
                message: "Activity tracking is available only to user accounts."
            });
        }

        if (!account.userData) {
            account.userData = {};
        }

        if (!account.userData.activityLog) {
            account.userData.activityLog = [];
        }

        account.userData.activityLog.push({
            date: date || new Date(),
            activity: activity.trim()
        });

        await account.save();

        const newActivity =
            account.userData.activityLog[
                account.userData.activityLog.length - 1
            ];

        return res.status(201).json({
            message: "Activity added successfully.",
            activity: newActivity
        });
    } catch (error) {
        return res.status(500).json({
            message: "Unable to add activity.",
            error: error.message
        });
    }
};

// Retrieve all activity records
const getActivities = async (req, res) => {
    try {
        const account = await Account.findById(
            req.account.accountId
        ).select("accountType userData.activityLog");

        if (!account) {
            return res.status(404).json({
                message: "Account not found."
            });
        }

        if (account.accountType !== "user") {
            return res.status(403).json({
                message: "Activity tracking is available only to user accounts."
            });
        }

        return res.status(200).json({
            message: "Activities retrieved successfully.",
            activities: account.userData?.activityLog || []
        });
    } catch (error) {
        return res.status(500).json({
            message: "Unable to retrieve activities.",
            error: error.message
        });
    }
};

// Update an activity record
const updateActivity = async (req, res) => {
    try {
        const { recordId } = req.params;
        const { activity, date } = req.body;

        if (typeof activity !== "string" || activity.trim() === "") {
            return res.status(400).json({
                message: "Activity must be a non-empty string."
            });
        }

        const account = await Account.findById(req.account.accountId);

        if (!account) {
            return res.status(404).json({
                message: "Account not found."
            });
        }

        if (account.accountType !== "user") {
            return res.status(403).json({
                message: "Activity tracking is available only to user accounts."
            });
        }

        const activities = account.userData?.activityLog || [];

        const activityRecord = activities.find(
            record => String(record._id) === String(recordId).trim()
        );

        if (!activityRecord) {
            return res.status(404).json({
                message: "Activity record not found."
            });
        }

        activityRecord.activity = activity.trim();

        if (date) {
            activityRecord.date = date;
        }

        await account.save();

        return res.status(200).json({
            message: "Activity updated successfully.",
            activity: activityRecord
        });
    } catch (error) {
        return res.status(500).json({
            message: "Unable to update activity.",
            error: error.message
        });
    }
};

// Delete an activity record
const deleteActivity = async (req, res) => {
    try {
        const { recordId } = req.params;

        const account = await Account.findById(req.account.accountId);

        if (!account) {
            return res.status(404).json({
                message: "Account not found."
            });
        }

        if (account.accountType !== "user") {
            return res.status(403).json({
                message: "Activity tracking is available only to user accounts."
            });
        }

        const activities = account.userData?.activityLog || [];

        const recordIndex = activities.findIndex(
            record => String(record._id) === String(recordId).trim()
        );

        if (recordIndex === -1) {
            return res.status(404).json({
                message: "Activity record not found."
            });
        }

        const deletedActivity = activities[recordIndex];

        activities.splice(recordIndex, 1);
        await account.save();

        return res.status(200).json({
            message: "Activity deleted successfully.",
            activity: deletedActivity
        });
    } catch (error) {
        return res.status(500).json({
            message: "Unable to delete activity.",
            error: error.message
        });
    }
};

module.exports = {
    addActivity,
    getActivities,
    updateActivity,
    deleteActivity
};