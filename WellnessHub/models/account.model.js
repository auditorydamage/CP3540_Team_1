const mongoose = require('mongoose');

const UserDataSchema = mongoose.Schema({
    userPic: {
        type: String,
        required: false
    },
    height: {
        type: Number,
        unit: String,
        required: true
    },
    activityLevel: {
        type: String,
        enum: ["sedentary", "lightly active", "moderately active", "very active", "extra active"],
        required: true
    },
    weightLog: {
        type: [WeightLogSchema],
        required: false
    },
    moodLog: {
        type: [MoodLogSchema],
        required: false
    },
    waterLog: {
        type: [WaterLogSchema],
        required: false
    },
    heartRateLog: {
        type: [HeartRateLogSchema],
        required: false
    },
    activityLog: {
        type: [ActivityLogSchema],
        required: false
    },
    mealPlans: {
        type: [MealPlanSchema],
        required: false
    }
});

const ProviderDataSchema = mongoose.Schema({
    userPic: {
        type: String,
        required: false
    },
    bio: {
        type: String,
        required: false
    },
    speciality: {
        type: String,
        required: false
    }
});

const AdminDataSchema = mongoose.Schema({});

const AccountSchema = mongoose.Schema({
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
    $switch: {
        branches: [
            { case: {$eq: [ "accountType", "admin" ]}, then: {adminData: AdminDataSchema}},
            { case: {$eq: [ "accountType", "provider" ]}, then: {providerData: ProviderDataSchema}}
        ],
        default: { userData: UserDataSchema }
    }
}, { timestamps: true });

const Account = mongoose.model("wh_account", AccountSchema);
module.exports = Account;