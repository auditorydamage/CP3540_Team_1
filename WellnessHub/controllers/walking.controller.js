const Account = require("../models/account.model");

// Add a walking record
const addWalkingRecord = async (req, res) => {
    try {
        const { date, distance, unit } = req.body;

        if (
            typeof distance !== "number" ||
            distance < 0 
        ) {
            return res.status(400).json({
                message: "A valid distance is required."
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
                message: "Walking tracking is available only to user accounts."
            });
        }

        if (!account.userData) {
            account.userData = {};
        }

        account.userData.walkingLog.push({
            date: date || new Date(),
            distance: distance,
            unit: unit
        });

        await account.save();

        const newRecord =
            account.userData.walkingLog[
                account.userData.walkingLog.length - 1
            ];

        return res.status(201).json({
            message: "Walking record added successfully.",
            walkingRecord: newRecord
        });
    } catch (error) {
        return res.status(500).json({
            message: "Unable to add walking record.",
            error: error.message
        });
    }
};

// Retrieve all walking records
const getWalkingRecords = async (req, res) => {
    try {
        const account = await Account.findById(
            req.account.accountId
        ).select("userData.walkingLog");

        if (!account) {
            return res.status(404).json({
                message: "Account not found."
            });
        }
        

        return res.status(200).json({
            message: "Walking records retrieved successfully.",
            walkingRecords: account.userData?.walkingLog || []
        });
    } catch (error) {
        return res.status(500).json({
            message: "Unable to retrieve walking records.",
            error: error.message
        });
    }
};
// Update a walking record
const updateWalkingRecord = async (req, res) => {
    try {
        const { recordId } = req.params;
        const { date, distance, unit } = req.body;

        if (
            typeof distance !== "number" ||
            distance < 0
        ) {
            return res.status(400).json({
                message: "A valid distance is required."
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

        const walkingRecords = account.userData?.walkingLog || [];

const walkingRecord = walkingRecords.find(
    record => String(record._id) === String(recordId).trim()
);

if (!walkingRecord) {
    return res.status(404).json({
        message: "Walking record not found."
           });
}

        if (date) {
            walkingRecord.date = date;
        }

        await account.save();

        return res.status(200).json({
            message: "Walking record updated successfully.",
            walkingRecord
        });
    } catch (error) {
        return res.status(500).json({
            message: "Unable to update walking record.",
            error: error.message
        });
    }
};

// Delete a walking record
const deleteWalkingRecord = async (req, res) => {
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

        const walkingRecords = account.userData?.walkingLog || [];

        const recordIndex = walkingRecords.findIndex(
            record =>
                String(record._id) === String(recordId).trim()
        );

        if (recordIndex === -1) {
            return res.status(404).json({
                message: "Walking record not found."
            });
        }

        const deletedRecord = walkingRecords[recordIndex];

        walkingRecords.splice(recordIndex, 1);
        await account.save();

        return res.status(200).json({
            message: "Walking record deleted successfully.",
            walkingRecord: deletedRecord
        });
    } catch (error) {
        return res.status(500).json({
            message: "Unable to delete walking record.",
            error: error.message
        });
    }
};
    
module.exports = {
    addWalkingRecord,
    getWalkingRecords,
    updateWalkingRecord,
    deleteWalkingRecord
};