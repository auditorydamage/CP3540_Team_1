const mongoose = require('mongoose');

const WeightLogSchema = mongoose.Schema({
    date: Date,
    weight: Number,
    unit: {
        type: String,
        enum: ["kg", "lb"]
    }
});

const MoodLogSchema = mongoose.Schema({
    date: Date,
    mood: {
        type: Number,
        min: 1,
        max: 7
    }
});

const WaterLogSchema = mongoose.Schema({
    date: Date,
    amount: Number,
    unit: {
        type: String,
        enum: ["ml", "fl. oz", "gal.", "glass", "cup"]
    }
});

const HeartRateLogSchema = mongoose.Schema({
    date: Date,
    heartRate: Number
});

const ActivityLogSchema = mongoose.Schema({
    date: Date,
    activity: String
});

const WalkingLogSchema = mongoose.Schema({
    date: Date,
    distance: Number,
    unit: {
        type: String,
        enum: ["mi", "km", "yd", "ft", "steps"]
    }
});

const SleepLogSchema = mongoose.Schema({
    date: Date,
    hours: Number,
})

const MealPlanSchema = mongoose.Schema({
    date: Date,
    meal: String
})

const UserDataSchema = mongoose.Schema({
    userPic: String,
    height: Number,
    activityLevel: {
        type: String,
        enum: ["sedentary", "lightly active", "moderately active", "very active", "extra active"]
    },
    wellnessGoal: [String],
    weightLog: [WeightLogSchema],
    moodLog: [MoodLogSchema],
    waterLog: [WaterLogSchema],
    heartRateLog: [HeartRateLogSchema],
    activityLog: [ActivityLogSchema],
    walkingLog: [WalkingLogSchema],
    sleepLog: [SleepLogSchema],
    mealPlans: [MealPlanSchema]
});

const ProviderDataSchema = mongoose.Schema({
    userPic: String,
    bio: String,
    speciality: String
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
    isActive: {
        type: Boolean,
        default: false,
        required: true
    },
    adminData: AdminDataSchema,
    providerData: ProviderDataSchema,
    userData: UserDataSchema
}, { timestamps: true });

const Account = mongoose.model("wh_account", AccountSchema);
module.exports = Account;