import React, { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Wifi, Signal, Battery, PhoneCall, Home, BarChart2, MessageSquare, Compass, Settings, ShieldAlert } from "lucide-react";

interface PhoneShellProps {
  children: React.ReactNode;
  currentPath: string;
  setPath: (path: string) => void;
  showNav: boolean;
}

export default function PhoneShell({ children, currentPath, setPath, showNav }: PhoneShellProps) {
  const [time, setTime] = useState("09:41");
  const [batteryLevel, setBatteryLevel] = useState(100);

  // Real-time clock for status bar
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(
        `${now.getHours().toString().padStart(2, "0")}:${now
          .getMinutes()
          .toString()
          .padStart(2, "0")}`
      );
    };
    updateTime();
    const inv = setInterval(updateTime, 1000);
    return () => clearInterval(inv);
  }, []);

  // Battery draining
  useEffect(() => {
    const inv = setInterval(() => {
      setBatteryLevel((b) => (b > 15 ? b - 1 : 100));
    }, 45000);
    return () => clearInterval(inv);
  }, []);

  return (
    <div className="h-screen w-full bg-white flex flex-col select-none overflow-hidden relative font-sans">
      {/* Subtle soothing ambient glows on the canvas outer space */}
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-purple-200/40 blur-[130px] opacity-70 pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-emerald-100/30 blur-[120px] opacity-60 pointer-events-none" />

      {/* Modern edge-to-edge layout container */}
      <motion.div
        id="phone-mockup"
        initial={{ opacity: 0, scale: 0.99 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full h-full bg-white flex flex-col relative overflow-hidden text-neutral-dark mx-auto"
      >
        {/* 1. Status Bar */}
        <div className="bg-zinc-50/85 backdrop-blur-md z-40 select-none border-b border-zinc-100/30 shrink-0">
          <div className="flex justify-between items-center text-[11px] text-zinc-600 font-semibold px-6 pt-8 pb-3 max-w-md mx-auto">
            <span>{time}</span>
            <div className="flex items-center space-x-1.5">
              <Signal className="w-3.5 h-3.5" strokeWidth={2} />
              <Wifi className="w-3.5 h-3.5" strokeWidth={2} />
              <div className="flex items-center space-x-1">
                <span>{batteryLevel}%</span>
                <Battery className="w-4 h-4 text-zinc-700" strokeWidth={2.5} />
              </div>
            </div>
          </div>
        </div>

        {/* 3. Primary Content Area */}
        <div 
          className="flex-1 overflow-hidden min-h-0 pt-1 bg-zinc-50 flex flex-col relative"
          id="primary-content-area"
          style={{ contentVisibility: "auto" }}
        >
          {children}
        </div>

        {/* 4. Bottom Tab Bar Navigation */}
        {showNav && currentPath !== "chatbot" && (
          <div className="border-t border-zinc-100 bg-white/95 backdrop-blur-md z-40 select-none shrink-0">
            <div className="px-2 py-2 flex justify-around items-center max-w-md mx-auto">
              <button
                onClick={() => setPath("dashboard")}
                className={`flex flex-col items-center flex-1 transition-colors ${
                  currentPath === "dashboard" ? "text-brand-medium font-semibold" : "text-zinc-400 hover:text-zinc-600"
                }`}
              >
                <Home className="w-5 h-5 mb-0.5" />
                <span className="text-[10px]">Accueil</span>
              </button>
              <button
                onClick={() => setPath("check-in")}
                className={`flex flex-col items-center flex-1 transition-colors ${
                  currentPath === "check-in" ? "text-brand-medium font-semibold" : "text-zinc-400 hover:text-zinc-600"
                }`}
              >
                <BarChart2 className="w-5 h-5 mb-0.5" />
                <span className="text-[10px]">Suivi</span>
              </button>
              <button
                onClick={() => setPath("chatbot")}
                className={`flex flex-col items-center flex-1 transition-colors relative ${
                  currentPath === "chatbot" ? "text-brand-medium font-semibold" : "text-zinc-400 hover:text-zinc-600"
                }`}
              >
                <MessageSquare className="w-5 h-5 mb-0.5" />
                <span className="text-[10px]">Mindy</span>
                <span className="absolute top-0 right-5 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white" />
              </button>
              <button
                onClick={() => setPath("exercices")}
                className={`flex flex-col items-center flex-1 transition-colors ${
                  currentPath.startsWith("exercices") ? "text-brand-medium font-semibold" : "text-zinc-400 hover:text-zinc-600"
                }`}
              >
                <Compass className="w-5 h-5 mb-0.5" />
                <span className="text-[10px]">Activités</span>
              </button>
              <button
                onClick={() => setPath("parametres")}
                className={`flex flex-col items-center flex-1 transition-colors ${
                  currentPath.startsWith("parametres") ? "text-brand-medium font-semibold" : "text-zinc-400 hover:text-zinc-600"
                }`}
              >
                <Settings className="w-5 h-5 mb-0.5" />
                <span className="text-[10px]">Option</span>
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
