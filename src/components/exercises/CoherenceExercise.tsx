import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronLeft, Volume2, VolumeX, Play, Pause, RefreshCw, Sparkles } from "lucide-react";
import { BaseExerciseProps } from "./BaseExerciseProps";

export const CoherenceExercise: React.FC<BaseExerciseProps> = ({
  onComplete,
  onCancel,
  soundEnabled,
  setSoundEnabled,
}) => {
  const [timer, setTimer] = useState(180); // 3 minutes
  const [isPlaying, setIsPlaying] = useState(true);
  const [breathPhase, setBreathPhase] = useState<"inspire" | "expire">("inspire");
  const [breathCount, setBreathCount] = useState(5);

  // Breathing interval hook
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && timer > 0) {
      interval = setInterval(() => {
        setBreathCount((prev) => {
          if (prev <= 1) {
            setBreathPhase((p) => (p === "inspire" ? "expire" : "inspire"));
            return 5;
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
  }, [isPlaying, timer, breathPhase]);

  const progressPercent = ((180 - timer) / 180) * 100;

  return (
    <div className="absolute inset-0 bg-[#ECFDF5] text-emerald-950 flex flex-col justify-between p-6 select-none overflow-hidden font-sans">
      
      {/* Background ambient auroras */}
      <div className="absolute top-[-20%] left-[-20%] w-[150%] h-[150%] pointer-events-none opacity-50">
        <div className="absolute top-[10%] left-[20%] w-96 h-96 rounded-full bg-white/70 blur-[120px]" />
        <div className="absolute bottom-[20%] right-[10%] w-80 h-80 rounded-full bg-emerald-100/55 blur-[100px]" />
      </div>

      {/* Header controls */}
      <div className="relative z-10 flex justify-between items-center">
        <button
          onClick={onCancel}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-white border border-emerald-100 hover:bg-emerald-50 transition text-xs font-semibold text-emerald-800"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Quitter</span>
        </button>

        <span className="text-xs font-extrabold tracking-widest uppercase text-emerald-800">
          Cohérence Cardiaque
        </span>

        <button
          onClick={() => setSoundEnabled(!soundEnabled)}
          className={`p-2 rounded-full transition border ${
            soundEnabled ? "bg-white border-emerald-200 text-emerald-700 shadow-sm" : "bg-white/50 border-emerald-100 text-emerald-400"
          }`}
        >
          {soundEnabled ? <Volume2 className="w-4 h-5" /> : <VolumeX className="w-4 h-5" />}
        </button>
      </div>

      {/* Center breathing space */}
      <div className="relative z-10 flex-1 flex flex-col justify-center items-center space-y-12">
        
        {/* Status display */}
        <div className="text-center space-y-2">
          <AnimatePresence mode="wait">
            <motion.h3
              key={breathPhase}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.5 }}
              className="text-4xl font-extrabold tracking-tight text-emerald-900 capitalize md:text-5xl"
            >
              {breathPhase === "inspire" ? "Inspire doucement" : "Expire lentement"}
            </motion.h3>
          </AnimatePresence>
          <p className="text-xs text-emerald-700/80 max-w-xs mx-auto">
            Harmonise ton cœur en suivant le mouvement de la sphère
          </p>
        </div>

        {/* Breathing Sphere */}
        <div className="relative flex items-center justify-center w-64 h-64">
          
          {/* Animated concentric breathing ring */}
          <motion.div
            animate={{
              scale: breathPhase === "inspire" ? 1.6 : 1.0,
            }}
            transition={{
              duration: 5,
              ease: "easeInOut",
            }}
            className="absolute inset-0 rounded-full border-2 border-emerald-200 bg-white/40"
          />

          {/* Secondary glowing ring */}
          <motion.div
            animate={{
              scale: breathPhase === "inspire" ? 1.3 : 1.0,
            }}
            transition={{
              duration: 5,
              ease: "easeInOut",
            }}
            className="absolute w-[80%] h-[80%] rounded-full border border-emerald-200/60 bg-emerald-50/50"
          />

          {/* Inner core orb */}
          <motion.div
            animate={{
              scale: breathPhase === "inspire" ? 1.1 : 0.9,
              boxShadow: breathPhase === "inspire" 
                ? "0 10px 30px rgba(16,185,129,0.15)" 
                : "0 4px 10px rgba(16,185,129,0.05)"
            }}
            transition={{
              duration: 5,
              ease: "easeInOut",
            }}
            className="relative w-36 h-36 rounded-full bg-white border border-emerald-200 flex flex-col items-center justify-center shadow-md"
          >
            <span className="text-4xl font-black text-emerald-800 font-mono tracking-tight">
              {breathCount}
            </span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-600/70">
              secondes
            </span>
          </motion.div>

          {/* Ambient particle wave */}
          <motion.div
            animate={{ scale: [1, 1.9, 1], opacity: [0.35, 0, 0.35] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-0 rounded-full border border-dashed border-emerald-300/40 pointer-events-none"
          />
        </div>

        {/* Circular Progress Timer */}
        <div className="flex flex-col items-center space-y-1">
          <span className="text-xl font-extrabold text-emerald-800 tracking-tight font-mono">
            {Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, "0")}
          </span>
          <span className="text-[10px] uppercase tracking-widest text-emerald-600 font-bold">
            temps restant
          </span>
        </div>
      </div>

      {/* Footer Controls & Progress Bar */}
      <div className="relative z-10 space-y-6">
        
        {/* Progress Bar Container */}
        <div className="w-full bg-emerald-100 h-1.5 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-emerald-400 to-emerald-500"
            style={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>

        {/* Control buttons */}
        <div className="flex justify-center items-center space-x-6 pb-2">
          
          {/* Refresh/Reset button */}
          <button
            onClick={() => {
              setTimer(180);
              setBreathCount(5);
              setBreathPhase("inspire");
            }}
            className="p-3 rounded-full bg-white border border-emerald-200 hover:bg-emerald-50 transition text-emerald-700 shadow-sm"
            title="Recommencer"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          {/* Toggle button */}
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="px-8 py-3.5 bg-emerald-600 text-white rounded-full hover:bg-emerald-700 transition shadow-md flex items-center space-x-2 font-bold text-sm"
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

          {/* Dynamic finish button showing up when timer is done */}
          <button
            onClick={onComplete}
            className="p-3 rounded-full bg-white border border-emerald-200 hover:bg-emerald-50 text-emerald-700 font-semibold transition text-xs flex items-center space-x-1 shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Valider</span>
          </button>
        </div>
      </div>
    </div>
  );
};
