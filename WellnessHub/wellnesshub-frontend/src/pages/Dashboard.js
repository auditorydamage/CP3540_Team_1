import { useEffect, useState } from "react";
import { useWellness } from "../context/WellnessContext";
import { apiRequest } from "../services/api";

const moodOptions = [
  { value: 1, emoji: "😢", label: "Very Low" },
  { value: 2, emoji: "😞", label: "Low" },
  { value: 3, emoji: "😕", label: "Not Great" },
  { value: 4, emoji: "😐", label: "Okay" },
  { value: 5, emoji: "🙂", label: "Good" },
  { value: 6, emoji: "😊", label: "Very Good" },
  { value: 7, emoji: "😁", label: "Great" }
];

function Dashboard() {
  const {
    waterIntake,
    setWaterIntake,
    waterGoal,
    latestMood,
    setLatestMood,
    exerciseMinutes,
    setExerciseMinutes,
    exerciseGoal
  } = useWellness();

  const [latestWeight, setLatestWeight] = useState(null);
  const [latestSleep, setLatestSleep] = useState(null);
  const [latestHeartRate, setLatestHeartRate] = useState(null);
  const [todaysMeal, setTodaysMeal] = useState(null);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const [
          waterData,
          moodData,
          activityData,
          weightData,
          sleepData,
          heartRateData,
          mealData
        ] = await Promise.all([
          apiRequest("/water"),
          apiRequest("/mood"),
          apiRequest("/activities"),
          apiRequest("/weight"),
          apiRequest("/sleep"),
          apiRequest("/heartrate"),
          apiRequest("/mealplans")
        ]);

        // Water
        const todaysWater = (waterData.waterRecords || []).filter(
          (record) => isToday(record.date)
        );

        const waterTotal = todaysWater.reduce(
          (total, record) =>
            total +
            convertToMillilitres(
              Number(record.amount),
              record.unit
            ),
          0
        );

        setWaterIntake(Math.round(waterTotal));

        // Mood
        const sortedMoods = [...(moodData.moodRecords || [])].sort(
          (a, b) => new Date(b.date) - new Date(a.date)
        );

        if (sortedMoods.length > 0) {
          setLatestMood(
            getMoodDetails(sortedMoods[0].mood)
          );
        } else {
          setLatestMood(null);
        }

        // Exercise
        const todaysActivities =
          (activityData.activities || []).filter(
            (record) => isToday(record.date)
          );

        const activityTotal = todaysActivities.reduce(
          (total, record) =>
            total + parseActivity(record.activity).minutes,
          0
        );

        setExerciseMinutes(activityTotal);

        // Weight
        const sortedWeights = [
          ...(weightData.weightRecords || [])
        ].sort(
          (a, b) => new Date(b.date) - new Date(a.date)
        );

        setLatestWeight(
          sortedWeights.length > 0 ? sortedWeights[0] : null
        );

        // Sleep
        const sortedSleep = [
          ...(sleepData.sleepRecords || [])
        ].sort(
          (a, b) => new Date(b.date) - new Date(a.date)
        );

        setLatestSleep(
          sortedSleep.length > 0 ? sortedSleep[0] : null
        );

        // Heart Rate
        const sortedHeartRates = [
          ...(heartRateData.heartRateRecords || [])
        ].sort(
          (a, b) => new Date(b.date) - new Date(a.date)
        );

        setLatestHeartRate(
          sortedHeartRates.length > 0
            ? sortedHeartRates[0]
            : null
        );

        // Today's Meal
        const todaysMeals = (mealData.mealPlans || [])
          .filter((record) => isToday(record.date))
          .sort(
            (a, b) => new Date(b.date) - new Date(a.date)
          );

        setTodaysMeal(
          todaysMeals.length > 0 ? todaysMeals[0] : null
        );
      } catch (error) {
        console.error(
          "Unable to load dashboard data:",
          error
        );
      }
    }

    loadDashboardData();
  }, [
    setWaterIntake,
    setLatestMood,
    setExerciseMinutes
  ]);

  return (
    <div style={{ padding: "30px" }}>
      <h1>Welcome to WellnessHub!</h1>

      <p>Your personalized wellness dashboard.</p>

      <div style={dashboardGridStyle}>
        <div style={cardStyle}>
          <div style={iconStyle}>💧</div>
          <h3>Water</h3>
          <p>
            {waterIntake} / {waterGoal} mL
          </p>
        </div>

        <div style={cardStyle}>
          <div style={iconStyle}>😊</div>
          <h3>Mood</h3>
          <p>
            {latestMood
              ? `${latestMood.emoji} ${latestMood.label}`
              : "No check-in yet"}
          </p>
        </div>

        <div style={cardStyle}>
          <div style={iconStyle}>🏃</div>
          <h3>Exercise</h3>
          <p>
            {exerciseMinutes} / {exerciseGoal} minutes
          </p>
        </div>

        <div style={cardStyle}>
          <div style={iconStyle}>⚖️</div>
          <h3>Latest Weight</h3>
          <p>
            {latestWeight
              ? `${latestWeight.weight} ${latestWeight.unit}`
              : "No weight recorded"}
          </p>
        </div>

        <div style={cardStyle}>
          <div style={iconStyle}>😴</div>
          <h3>Sleep</h3>
          <p>
            {latestSleep
              ? `${latestSleep.hours} hours`
              : "No sleep recorded"}
          </p>
        </div>

        <div style={cardStyle}>
          <div style={iconStyle}>❤️</div>
          <h3>Heart Rate</h3>
          <p>
            {latestHeartRate
              ? `${latestHeartRate.heartRate} bpm`
              : "No heart rate recorded"}
          </p>
        </div>

        <div style={mealCardStyle}>
          <div style={iconStyle}>🍎</div>
          <h3>Today's Meal</h3>
          <p>
            {todaysMeal
              ? todaysMeal.meal
              : "No meal planned today"}
          </p>
        </div>
      </div>
    </div>
  );
}

function getMoodDetails(value) {
  return moodOptions.find(
    (mood) => mood.value === Number(value)
  );
}

function parseActivity(activity) {
  const parts = String(activity || "").split("|");
  const name = parts[0]?.trim() || "Activity";

  if (parts.length < 2) {
    return { name, minutes: 0 };
  }

  const minuteMatch = parts[1].match(/(\d+(?:\.\d+)?)/);

  return {
    name,
    minutes: minuteMatch
      ? Number(minuteMatch[1])
      : 0
  };
}

function isToday(dateValue) {
  const recordDate = new Date(dateValue);
  const today = new Date();

  return (
    recordDate.getFullYear() === today.getFullYear() &&
    recordDate.getMonth() === today.getMonth() &&
    recordDate.getDate() === today.getDate()
  );
}

function convertToMillilitres(amount, unit) {
  switch (unit) {
    case "fl. oz":
      return amount * 29.5735;

    case "gal.":
      return amount * 3785.41;

    case "glass":
      return amount * 250;

    case "cup":
      return amount * 236.588;

    default:
      return amount;
  }
}

const dashboardGridStyle = {
  display: "grid",
  gridTemplateColumns:
    "repeat(auto-fit, minmax(220px, 1fr))",
  gap: "20px",
  marginTop: "30px",
  maxWidth: "1100px"
};

const cardStyle = {
  backgroundColor: "#ffffff",
  padding: "22px",
  borderRadius: "12px",
  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.12)"
};

const mealCardStyle = {
  ...cardStyle,
  gridColumn: "span 2"
};

const iconStyle = {
  fontSize: "28px",
  marginBottom: "8px"
};

export default Dashboard;