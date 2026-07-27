const mongoose = require('mongoose');

const WeightLogSchema = mongoose.Schema({
    date: Date,
    weight: Number,
    unit: String
});

const MoodLogSchema = mongoose.Schema({
    date: Date,
    mood: String
});

const WaterLogSchema = mongoose.Schema({
    date: Date,
    amount: Number,
    unit: String
});

const HeartRateLogSchema = mongoose.Schema({
    date: Date,
    heartRate: Number
});

const ActivityLogSchema = mongoose.Schema({
    date: Date,
    activity: String
});

const MealPlanSchema = mongoose.Schema({
    date: Date,
    meal: String
})

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
    calorieGoal: {
        type: Number
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