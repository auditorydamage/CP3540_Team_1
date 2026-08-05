const Account = require("../models/account.model");

// Add a heart rate record
const addHeartRateRecord = async (req, res) => {
    try {
        const { date, heartRate } = req.body;

        if (
            typeof heartRate !== "number" ||
            heartRate < 1
        
        ) {
            return res.status(400).json({
                message: "A valid heart rate is required."
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
                message: "Heart rate tracking is available only to user accounts."
            });
        }

        if (!account.userData) {
            account.userData = {};
        }

        account.userData.heartRateLog.push({
            date: date || new Date(),
            heartRate: heartRate
        });

        await account.save();

        const newRecord =
            account.userData.heartRateLog[
                account.userData.heartRateLog.length - 1
            ];

        return res.status(201).json({
            message: "Heart rate record added successfully.",
            heartRateRecord: newRecord
        });
    } catch (error) {
        return res.status(500).json({
            message: "Unable to add heart rate record.",
            error: error.message
        });
    }
};

// Retrieve all heart rate records
const getHeartRateRecords = async (req, res) => {
    try {
        const account = await Account.findById(
            req.account.accountId
        ).select("userData.heartRateLog");

        if (!account) {
            return res.status(404).json({
                message: "Account not found."
            });
        }
        

        return res.status(200).json({
            message: "Heart rate records retrieved successfully.",
            heartRateRecords: account.userData?.heartRateLog || []
        });
    } catch (error) {
        return res.status(500).json({
            message: "Unable to retrieve heart rate records.",
            error: error.message
        });
    }
};
// Update a heart rate record
const updateHeartRateRecord = async (req, res) => {
    try {
        const { recordId } = req.params;
        const { date, heartRate } = req.body;

        if (
            typeof heartRate !== "number" ||
            heartRate < 1
        ) {
            return res.status(400).json({
                message: "A valid heart rate is required."
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

        const heartRateRecords = account.userData?.heartRateLog || [];

const heartRateRecord = heartRateRecords.find(
    record => String(record._id) === String(recordId).trim()
);

if (!heartRateRecord) {
    return res.status(404).json({
        message: "Heart rate record not found."
           });
}

        if (date) {
            heartRateRecord.date = date;
        }

        await account.save();

        return res.status(200).json({
            message: "Heart rate record updated successfully.",
            heartRateRecord
        });
    } catch (error) {
        return res.status(500).json({
            message: "Unable to update heart rate record.",
            error: error.message
        });
    }
};

// Delete a heart rate record
const deleteHeartRateRecord = async (req, res) => {
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

        const heartRateRecords = account.userData?.heartRateLog || [];

        const recordIndex = heartRateRecords.findIndex(
            record =>
                String(record._id) === String(recordId).trim()
        );

        if (recordIndex === -1) {
            return res.status(404).json({
                message: "Heart rate record not found."
            });
        }

        const deletedRecord = heartRateRecords[recordIndex];

        heartRateRecords.splice(recordIndex, 1);
        await account.save();

        return res.status(200).json({
            message: "Heart rate record deleted successfully.",
            heartRateRecord: deletedRecord
        });
    } catch (error) {
        return res.status(500).json({
            message: "Unable to delete heart rate record.",
            error: error.message
        });
    }
};
    
module.exports = {
    addHeartRateRecord,
    getHeartRateRecords,
    updateHeartRateRecord,
    deleteHeartRateRecord
};