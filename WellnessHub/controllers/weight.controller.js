const Account = require("../models/account.model");

const allowedUnits = ["kg", "lb"];

// Add a weight record
const addWeightRecord = async (req, res) => {
    try {
        const { weight, unit, date } = req.body;

        if (
            typeof weight !== "number" ||
            weight <= 0 ||
            !allowedUnits.includes(unit)
        ) {
            return res.status(400).json({
                message: "A positive weight and valid unit are required."
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
                message: "Weight tracking is available only to user accounts."
            });
        }

        if (!account.userData) {
            account.userData = {};
        }

        if (!account.userData.weightLog) {
            account.userData.weightLog = [];
        }

        account.userData.weightLog.push({
            date: date || new Date(),
            weight,
            unit
        });

        await account.save();

        const newRecord =
            account.userData.weightLog[
                account.userData.weightLog.length - 1
            ];

        return res.status(201).json({
            message: "Weight record added successfully.",
            weightRecord: newRecord
        });
    } catch (error) {
        return res.status(500).json({
            message: "Unable to add weight record.",
            error: error.message
        });
    }
};

// Retrieve all weight records
const getWeightRecords = async (req, res) => {
    try {
        const account = await Account.findById(
            req.account.accountId
        ).select("accountType userData.weightLog");

        if (!account) {
            return res.status(404).json({
                message: "Account not found."
            });
        }

        if (account.accountType !== "user") {
            return res.status(403).json({
                message: "Weight tracking is available only to user accounts."
            });
        }

        return res.status(200).json({
            message: "Weight records retrieved successfully.",
            weightRecords: account.userData?.weightLog || []
        });
    } catch (error) {
        return res.status(500).json({
            message: "Unable to retrieve weight records.",
            error: error.message
        });
    }
};

// Update a weight record
const updateWeightRecord = async (req, res) => {
    try {
        const { recordId } = req.params;
        const { weight, unit, date } = req.body;

        if (
            typeof weight !== "number" ||
            weight <= 0 ||
            !allowedUnits.includes(unit)
        ) {
            return res.status(400).json({
                message: "A positive weight and valid unit are required."
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
                message: "Weight tracking is available only to user accounts."
            });
        }

        const weightRecords = account.userData?.weightLog || [];

        const weightRecord = weightRecords.find(
            record =>
                String(record._id) === String(recordId).trim()
        );

        if (!weightRecord) {
            return res.status(404).json({
                message: "Weight record not found."
            });
        }

        weightRecord.weight = weight;
        weightRecord.unit = unit;

        if (date) {
            weightRecord.date = date;
        }

        await account.save();

        return res.status(200).json({
            message: "Weight record updated successfully.",
            weightRecord
        });
    } catch (error) {
        return res.status(500).json({
            message: "Unable to update weight record.",
            error: error.message
        });
    }
};

// Delete a weight record
const deleteWeightRecord = async (req, res) => {
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
                message: "Weight tracking is available only to user accounts."
            });
        }

        const weightRecords = account.userData?.weightLog || [];

        const recordIndex = weightRecords.findIndex(
            record =>
                String(record._id) === String(recordId).trim()
        );

        if (recordIndex === -1) {
            return res.status(404).json({
                message: "Weight record not found."
            });
        }

        const deletedRecord = weightRecords[recordIndex];

        weightRecords.splice(recordIndex, 1);
        await account.save();

        return res.status(200).json({
            message: "Weight record deleted successfully.",
            weightRecord: deletedRecord
        });
    } catch (error) {
        return res.status(500).json({
            message: "Unable to delete weight record.",
            error: error.message
        });
    }
};

module.exports = {
    addWeightRecord,
    getWeightRecords,
    updateWeightRecord,
    deleteWeightRecord
};