import {
  BrowserRouter,
  Navigate,
  Route,
  Routes
} from "react-router-dom";

import DashboardLayout from "./layouts/DashboardLayout";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import WaterTracker from "./pages/WaterTracker";
import MoodCheckIn from "./pages/MoodCheckIn";
import Exercise from "./pages/Exercise";
import Recipes from "./pages/Recipes";
import Profile from "./pages/Profile";
import Register from "./pages/Register";
import { WellnessProvider } from "./context/WellnessContext";

function App() {
  return (
  <WellnessProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/water" element={<WaterTracker />} />
          <Route path="/mood" element={<MoodCheckIn />} />
          <Route path="/exercise" element={<Exercise />} />
          <Route path="/recipes" element={<Recipes />} />
          <Route path="/profile" element={<Profile />} />
        </Route>

        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  </WellnessProvider>
  );
}

export default App;