const Account = require("../models/account.model");

// Add a sleep record
const addSleepRecord = async (req, res) => {
    try {
        const { hours, date } = req.body;

        if (
            typeof hours !== "number" ||
            hours <= 0 ||
            hours > 24
        ) {
            return res.status(400).json({
                message: "Sleep hours must be a number between 0 and 24."
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
                message: "Sleep tracking is available only to user accounts."
            });
        }

        if (!account.userData) {
            account.userData = {};
        }

        if (!account.userData.sleepLog) {
            account.userData.sleepLog = [];
        }

        account.userData.sleepLog.push({
            date: date || new Date(),
            hours
        });

        await account.save();

        const newRecord =
            account.userData.sleepLog[
                account.userData.sleepLog.length - 1
            ];

        return res.status(201).json({
            message: "Sleep record added successfully.",
            sleepRecord: newRecord
        });
    } catch (error) {
        return res.status(500).json({
            message: "Unable to add sleep record.",
            error: error.message
        });
    }
};

// Retrieve all sleep records
const getSleepRecords = async (req, res) => {
    try {
        const account = await Account.findById(
            req.account.accountId
        ).select("accountType userData.sleepLog");

        if (!account) {
            return res.status(404).json({
                message: "Account not found."
            });
        }

        if (account.accountType !== "user") {
            return res.status(403).json({
                message: "Sleep tracking is available only to user accounts."
            });
        }

        return res.status(200).json({
            message: "Sleep records retrieved successfully.",
            sleepRecords: account.userData?.sleepLog || []
        });
    } catch (error) {
        return res.status(500).json({
            message: "Unable to retrieve sleep records.",
            error: error.message
        });
    }
};

// Update a sleep record
const updateSleepRecord = async (req, res) => {
    try {
        const { recordId } = req.params;
        const { hours, date } = req.body;

        if (
            typeof hours !== "number" ||
            hours <= 0 ||
            hours > 24
        ) {
            return res.status(400).json({
                message: "Sleep hours must be a number between 0 and 24."
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
                message: "Sleep tracking is available only to user accounts."
            });
        }

        const sleepRecords = account.userData?.sleepLog || [];

        const sleepRecord = sleepRecords.find(
            record =>
                String(record._id) === String(recordId).trim()
        );

        if (!sleepRecord) {
            return res.status(404).json({
                message: "Sleep record not found."
            });
        }

        sleepRecord.hours = hours;

        if (date) {
            sleepRecord.date = date;
        }

        await account.save();

        return res.status(200).json({
            message: "Sleep record updated successfully.",
            sleepRecord
        });
    } catch (error) {
        return res.status(500).json({
            message: "Unable to update sleep record.",
            error: error.message
        });
    }
};

// Delete a sleep record
const deleteSleepRecord = async (req, res) => {
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
                message: "Sleep tracking is available only to user accounts."
            });
        }

        const sleepRecords = account.userData?.sleepLog || [];

        const recordIndex = sleepRecords.findIndex(
            record =>
                String(record._id) === String(recordId).trim()
        );

        if (recordIndex === -1) {
            return res.status(404).json({
                message: "Sleep record not found."
            });
        }

        const deletedRecord = sleepRecords[recordIndex];

        sleepRecords.splice(recordIndex, 1);
        await account.save();

        return res.status(200).json({
            message: "Sleep record deleted successfully.",
            sleepRecord: deletedRecord
        });
    } catch (error) {
        return res.status(500).json({
            message: "Unable to delete sleep record.",
            error: error.message
        });
    }
};

module.exports = {
    addSleepRecord,
    getSleepRecords,
    updateSleepRecord,
    deleteSleepRecord
};