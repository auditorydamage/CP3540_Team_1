import { createContext, useContext, useState } from "react";

const WellnessContext = createContext();

export function WellnessProvider({ children }) {
  const [waterIntake, setWaterIntake] = useState(0);
  const [waterGoal, setWaterGoal] = useState(2500);

  const [latestMood, setLatestMood] = useState(null);

  const [exerciseMinutes, setExerciseMinutes] = useState(0);
  const [exerciseGoal, setExerciseGoal] = useState(45);

  const value = {
    waterIntake,
    setWaterIntake,
    waterGoal,
    setWaterGoal,

    latestMood,
    setLatestMood,

    exerciseMinutes,
    setExerciseMinutes,
    exerciseGoal,
    setExerciseGoal
  };

  return (
    <WellnessContext.Provider value={value}>
      {children}
    </WellnessContext.Provider>
  );
}

export function useWellness() {
  return useContext(WellnessContext);
}