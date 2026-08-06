const Account = require("../models/account.model");

// Add a mood record
const addMoodRecord = async (req, res) => {
    try {
        const { date, mood } = req.body;

        if (
            typeof mood !== "number" ||
            mood < 1 ||
            mood > 7
        ) {
            return res.status(400).json({
                message: "A valid mood selection is required."
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
                message: "Mood tracking is available only to user accounts."
            });
        }

        if (!account.userData) {
            account.userData = {};
        }

        account.userData.moodLog.push({
            date: date || new Date(),
            mood: mood
        });

        await account.save();

        const newRecord =
            account.userData.moodLog[
                account.userData.moodLog.length - 1
            ];

        return res.status(201).json({
            message: "Mood record added successfully.",
            moodRecord: newRecord
        });
    } catch (error) {
        return res.status(500).json({
            message: "Unable to add mood record.",
            error: error.message
        });
    }
};

// Retrieve all mood records
const getMoodRecords = async (req, res) => {
    try {
        const account = await Account.findById(
            req.account.accountId
        ).select("userData.moodLog");

        if (!account) {
            return res.status(404).json({
                message: "Account not found."
            });
        }
        

        return res.status(200).json({
            message: "Mood records retrieved successfully.",
            moodRecords: account.userData?.moodLog || []
        });
    } catch (error) {
        return res.status(500).json({
            message: "Unable to retrieve mood records.",
            error: error.message
        });
    }
};

// Update a mood record
const updateMoodRecord = async (req, res) => {
    try {
        const { recordId } = req.params;
        const { date, mood } = req.body;

        if (
            typeof mood !== "number" ||
            mood < 1 ||
            mood > 7
        ) {
            return res.status(400).json({
                message: "A valid mood selection is required."
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

        const moodRecords = account.userData?.moodLog || [];

        const moodRecord = moodRecords.find(
            record => String(record._id) === String(recordId).trim()
        );
        
        if (!moodRecord) {
            return res.status(404).json({
                message: "Mood record not found."
                   });
        }
        
        if (date) {
            moodRecord.date = date;
        }

        await account.save();

        return res.status(200).json({
            message: "Mood record updated successfully.",
            moodRecord
        });
    } catch (error) {
        return res.status(500).json({
            message: "Unable to update mood record.",
            error: error.message
        });
    }
};

// Delete a mood record
const deleteMoodRecord = async (req, res) => {
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

        const moodRecords = account.userData?.moodLog || [];

        const recordIndex = moodRecords.findIndex(
            record =>
                String(record._id) === String(recordId).trim()
        );

        if (recordIndex === -1) {
            return res.status(404).json({
                message: "Mood record not found."
            });
        }

        const deletedRecord = moodRecords[recordIndex];

        moodRecords.splice(recordIndex, 1);
        await account.save();

        return res.status(200).json({
            message: "Mood record deleted successfully.",
            moodRecord: deletedRecord
        });
    } catch (error) {
        return res.status(500).json({
            message: "Unable to delete mood record.",
            error: error.message
        });
    }
};
    
module.exports = {
    addMoodRecord,
    getMoodRecords,
    updateMoodRecord,
    deleteMoodRecord
};