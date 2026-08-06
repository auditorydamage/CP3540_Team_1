const Account = require("../models/account.model");


const allowedUnits = ["ml", "fl. oz", "gal.", "glass", "cup"];

// Add a water record
const addWaterRecord = async (req, res) => {
    try {
        const { amount, unit, date } = req.body;

        if (
            typeof amount !== "number" ||
            amount <= 0 ||
            !allowedUnits.includes(unit)
        ) {
            return res.status(400).json({
                message: "A positive amount and valid unit are required."
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
                message: "Water tracking is available only to user accounts."
            });
        }

        if (!account.userData) {
            account.userData = {};
        }

        
        account.userData.waterLog.push({
            date: date || new Date(),
            amount,
            unit
        });

        await account.save();

        const newRecord =
            account.userData.waterLog[
                account.userData.waterLog.length - 1
            ];

        return res.status(201).json({
            message: "Water record added successfully.",
            waterRecord: newRecord
        });
    } catch (error) {
        return res.status(500).json({
            message: "Unable to add water record.",
            error: error.message
        });
    }
};

// Retrieve all water records
const getWaterRecords = async (req, res) => {
    try {
        const account = await Account.findById(
            req.account.accountId
        ).select("userData.waterLog");

        if (!account) {
            return res.status(404).json({
                message: "Account not found."
            });
        }
        

        return res.status(200).json({
            message: "Water records retrieved successfully.",
            waterRecords: account.userData?.waterLog || []
        });
    } catch (error) {
        return res.status(500).json({
            message: "Unable to retrieve water records.",
            error: error.message
        });
    }
};
// Update a water record
const updateWaterRecord = async (req, res) => {
    try {
        const { recordId } = req.params;
        const { amount, unit, date } = req.body;

        if (
            typeof amount !== "number" ||
            amount <= 0 ||
            !allowedUnits.includes(unit)
        ) {
            return res.status(400).json({
                message: "A positive amount and valid unit are required."
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

        const waterRecords = account.userData?.waterLog || [];

const waterRecord = waterRecords.find(
    record => String(record._id) === String(recordId).trim()
);

if (!waterRecord) {
    return res.status(404).json({
        message: "Water record not found."
           });
}

        waterRecord.amount = amount;
        waterRecord.unit = unit;

        if (date) {
            waterRecord.date = date;
        }

        await account.save();

        return res.status(200).json({
            message: "Water record updated successfully.",
            waterRecord
        });
    } catch (error) {
        return res.status(500).json({
            message: "Unable to update water record.",
            error: error.message
        });
    }
};

// Delete a water record
const deleteWaterRecord = async (req, res) => {
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

        const waterRecords = account.userData?.waterLog || [];

        const recordIndex = waterRecords.findIndex(
            record =>
                String(record._id) === String(recordId).trim()
        );

        if (recordIndex === -1) {
            return res.status(404).json({
                message: "Water record not found."
            });
        }

        const deletedRecord = waterRecords[recordIndex];

        waterRecords.splice(recordIndex, 1);
        await account.save();

        return res.status(200).json({
            message: "Water record deleted successfully.",
            waterRecord: deletedRecord
        });
    } catch (error) {
        return res.status(500).json({
            message: "Unable to delete water record.",
            error: error.message
        });
    }
};
    
module.exports = {
    addWaterRecord,
    getWaterRecords,
    updateWaterRecord,
    deleteWaterRecord
};