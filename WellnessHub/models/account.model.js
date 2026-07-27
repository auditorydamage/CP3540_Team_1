const mongoose = require('mongoose');

const accountSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true
    },
    accountType: {
        type: String,
        enum: ["user", "provider", "admin"],
        required: true
    },
    creationDate: {
        type: Number,
        required: true
    },
    $cond: {
        if: { $eq: []}
    }
});

const Account = mongoose.model("wh_account", AccountSchema);
module.exports = Account;