import { useState } from "react";
import PhoneShell from "./components/PhoneShell";
import Auth from "./pages/Auth";
import Onboarding from "./pages/Onboarding";
import CheckIn from "./pages/CheckIn";
import Dashboard from "./pages/Dashboard";
import Chatbot from "./pages/Chatbot";
import Exercises from "./pages/Exercises";
import Settings from "./pages/Settings";
import { UserProfile, CheckInRecord } from "./types";

export default function App() {
  const [currentPath, setPath] = useState<string>("auth");
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: "",
    email: "",
    isRegistered: false,
    isOnboarded: false,
    premium: false,
    streak: 3,
    badges: ["first-step"],
    notificationsEnabled: true,
    gdprAccepted: false,
  });
  const [checkIns, setCheckIns] = useState<CheckInRecord[]>([]);

  const updateProfile = (profile: Partial<UserProfile>) => {
    setUserProfile((prev) => ({ ...prev, ...profile }));
  };

  const addCheckIn = (record: CheckInRecord) => {
    setCheckIns((prev) => [...prev, record]);
    // Auto-advance streak
    setUserProfile((prev) => ({ ...prev, streak: prev.streak + 1 }));
  };

  // Determine whether to display the bottom navigation bar
  const showNav = userProfile.isRegistered && userProfile.isOnboarded;

  try {
    return (
      <PhoneShell currentPath={currentPath} setPath={setPath} showNav={showNav}>
        
        {/* Entrance Authorization Routes */}
        {!userProfile.isRegistered && (
          <Auth
            currentPath={currentPath}
            setPath={setPath}
            userProfile={userProfile}
            updateProfile={updateProfile}
          />
        )}

        {/* Onboarding Routes */}
        {userProfile.isRegistered && !userProfile.isOnboarded && (
          <Onboarding
            currentPath={currentPath}
            setPath={setPath}
            userProfile={userProfile}
            updateProfile={updateProfile}
          />
        )}

        {/* Authenticated Internal App Routes */}
        {userProfile.isRegistered && userProfile.isOnboarded && (
          <>
            {currentPath === "dashboard" && (
              <Dashboard
                setPath={setPath}
                userProfile={userProfile}
                checkIns={checkIns}
              />
            )}

            {currentPath === "check-in" && (
              <CheckIn
                setPath={setPath}
                userProfile={userProfile}
                addCheckIn={addCheckIn}
              />
            )}

            {currentPath === "chatbot" && (
              <Chatbot
                setPath={setPath}
                userProfile={userProfile}
              />
            )}

            {currentPath.startsWith("exercices") && (
              <Exercises
                currentPath={currentPath}
                setPath={setPath}
                userProfile={userProfile}
              />
            )}

            {currentPath.startsWith("parametres") && (
              <Settings
                currentPath={currentPath}
                setPath={setPath}
                userProfile={userProfile}
                updateProfile={updateProfile}
              />
            )}
          </>
        )}

      </PhoneShell>
    );
  } catch (error) {
    console.error("Critical rendering error:", error);
    return (
      <div className="p-6 bg-red-50 text-red-800 rounded-3xl text-center font-sans">
        <h2 className="font-bold">Une erreur est survenue</h2>
        <p className="text-xs mt-2">Nous travaillons à rétablir la douceur de MindCare.</p>
      </div>
    );
  }
}
