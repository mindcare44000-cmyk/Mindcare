import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronLeft, Volume2, VolumeX, Play, Pause, RefreshCw, Sparkles } from "lucide-react";
import { BaseExerciseProps } from "./BaseExerciseProps";

export const RespirationCarreeExercise: React.FC<BaseExerciseProps> = ({
  onComplete,
  onCancel,
  soundEnabled,
  setSoundEnabled,
}) => {
  const [timer, setTimer] = useState(180); // 3 minutes
  const [isPlaying, setIsPlaying] = useState(true);
  const [carreIndex, setCarreIndex] = useState(0); // 0:Inhale, 1:Hold, 2:Exhale, 3:Hold
  const [breathCount, setBreathCount] = useState(4);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && timer > 0) {
      interval = setInterval(() => {
        setBreathCount((prev) => {
          if (prev <= 1) {
            setCarreIndex((idx) => (idx + 1) % 4);
            return 4;
          }
          return prev - 1;
        });
        setTimer((t) => {
          if (t <= 1) {
            setIsPlaying(false);
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, timer]);

  const progressPercent = ((180 - timer) / 180) * 100;

  const phaseInstruction = [
    { title: "Inspire par le nez", desc: "Gonfle ton abdomen librement" },
    { title: "Retiens ton souffle", desc: "Garde l'air calme en toi" },
    { title: "Expire par la bouche", desc: "Laisse aller toutes tes tensions" },
    { title: "Poumons vides", desc: "Reste immobile et détendu" },
  ];

  return (
    <div className="absolute inset-0 bg-[#F0F9FF] text-sky-950 flex flex-col justify-between p-6 select-none overflow-hidden font-sans">
      
      {/* Background glowing gradients */}
      <div className="absolute top-[-20%] right-[-20%] w-[130%] h-[130%] pointer-events-none opacity-50">
        <div className="absolute top-[20%] right-[30%] w-96 h-96 rounded-full bg-white/70 blur-[130px]" />
        <div className="absolute bottom-[30%] left-[20%] w-80 h-80 rounded-full bg-sky-100/40 blur-[100px]" />
      </div>

      {/* Header */}
      <div className="relative z-10 flex justify-between items-center">
        <button
          onClick={onCancel}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-white border border-sky-100 hover:bg-sky-50 transition text-xs font-semibold text-sky-800"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Quitter</span>
        </button>

        <span className="text-xs font-extrabold tracking-widest uppercase text-sky-850">
          Respiration Carrée
        </span>

        <button
          onClick={() => setSoundEnabled(!soundEnabled)}
          className={`p-2 rounded-full transition border ${
            soundEnabled ? "bg-white border-sky-200 text-sky-700 shadow-sm" : "bg-white/50 border-sky-100 text-sky-400"
          }`}
        >
          {soundEnabled ? <Volume2 className="w-4 h-5" /> : <VolumeX className="w-4 h-5" />}
        </button>
      </div>

      {/* Main Breathing Area */}
      <div className="relative z-10 flex-1 flex flex-col justify-center items-center space-y-12">
        
        {/* Step Guide text */}
        <div className="text-center space-y-2">
          <AnimatePresence mode="wait">
            <motion.div
              key={carreIndex}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4 }}
              className="space-y-1"
            >
              <h3 className="text-3xl font-extrabold text-sky-900">
                {phaseInstruction[carreIndex].title}
              </h3>
              <p className="text-xs text-sky-700/80">
                {phaseInstruction[carreIndex].desc}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Square visualizer */}
        <div className="relative w-52 h-52 flex items-center justify-center">
          
          {/* Box background */}
          <div className="absolute inset-0 border-2 border-sky-150 rounded-[32px] bg-white shadow-md" />

          {/* Dynamic corner/edges glowing guides */}
          <div className="absolute inset-0 pointer-events-none rounded-[32px]">
            {/* Top Side */}
            <div
              className={`absolute top-0 left-0 right-0 h-1.5 rounded-t-[32px] transition-all duration-500 ${
                carreIndex === 0 ? "bg-sky-400 shadow-sm" : "bg-transparent"
              }`}
            />
            {/* Right Side */}
            <div
              className={`absolute top-0 bottom-0 right-0 w-1.5 rounded-r-[32px] transition-all duration-500 ${
                carreIndex === 1 ? "bg-sky-500 shadow-sm" : "bg-transparent"
              }`}
            />
            {/* Bottom Side */}
            <div
              className={`absolute bottom-0 left-0 right-0 h-1.5 rounded-b-[32px] transition-all duration-500 ${
                carreIndex === 2 ? "bg-sky-600 shadow-sm" : "bg-transparent"
              }`}
            />
            {/* Left Side */}
            <div
              className={`absolute top-0 bottom-0 left-0 w-1.5 rounded-l-[32px] transition-all duration-500 ${
                carreIndex === 3 ? "bg-sky-400 shadow-sm" : "bg-transparent"
              }`}
            />
          </div>

          {/* Inner core timing number */}
          <div className="text-center relative z-10 flex flex-col items-center justify-center">
            <motion.span
              key={breathCount}
              initial={{ scale: 1.2, opacity: 0.5 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-6xl font-black text-sky-800 font-mono tracking-tight leading-none"
            >
              {breathCount}
            </motion.span>
            <span className="text-[10px] tracking-widest uppercase font-bold text-sky-600/70 mt-2">
              {carreIndex === 1 || carreIndex === 3 ? "Retiens" : "Respire"}
            </span>
          </div>

          {/* Floating breathing circle indicator that changes scale based on index */}
          <motion.div
            animate={{
              scale: carreIndex === 0 ? 1.25 : carreIndex === 1 ? 1.25 : carreIndex === 2 ? 0.8 : 0.8,
            }}
            transition={{ duration: 4, ease: "linear" }}
            className="absolute w-24 h-24 rounded-full bg-sky-100/50 border border-sky-200/40 -z-10"
          />
        </div>

        {/* Global timing */}
        <div className="flex flex-col items-center">
          <span className="text-xl font-bold font-mono text-sky-850">
            {Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, "0")}
          </span>
          <span className="text-[9px] uppercase tracking-widest text-sky-600 font-extrabold">
            session totale
          </span>
        </div>
      </div>

      {/* Footer controls */}
      <div className="relative z-10 space-y-6">
        
        {/* Progress bar */}
        <div className="w-full bg-sky-105 h-1.5 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-sky-400 to-sky-500"
            style={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>

        {/* Footer actions */}
        <div className="flex justify-center items-center space-x-6 pb-2">
          
          {/* Refresh */}
          <button
            onClick={() => {
              setTimer(180);
              setBreathCount(4);
              setCarreIndex(0);
            }}
            className="p-3 rounded-full bg-white border border-sky-200 text-sky-700 hover:text-sky-900 transition shadow-sm"
            title="Recommencer"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          {/* Play/Pause */}
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="px-8 py-3.5 bg-sky-600 text-white rounded-full hover:bg-sky-700 transition shadow-md flex items-center space-x-2 font-bold text-sm"
          >
            {isPlaying ? (
              <>
                <Pause className="w-4 h-4 fill-current" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                <span>Reprendre</span>
              </>
            )}
          </button>

          {/* Validate */}
          <button
            onClick={onComplete}
            className="p-3 rounded-full bg-white border border-sky-200 text-sky-700 font-semibold transition text-xs flex items-center space-x-1 shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Valider</span>
          </button>
        </div>
      </div>
    </div>
  );
};
