import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { ChevronLeft, Flame, PhoneCall, ShieldAlert, Sparkles } from "lucide-react";
import { BaseExerciseProps } from "./BaseExerciseProps";

export const StopSosExercise: React.FC<BaseExerciseProps> = ({
  onComplete,
  onCancel,
}) => {
  const [pulsePhase, setPulsePhase] = useState<"inspire" | "expire">("inspire");
  const [pulseCount, setPulseCount] = useState(3);

  useEffect(() => {
    const interval = setInterval(() => {
      setPulseCount((prev) => {
        if (prev <= 1) {
          setPulsePhase((p) => (p === "inspire" ? "expire" : "inspire"));
          return 3;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute inset-0 bg-[#FFF1F2] text-rose-950 flex flex-col justify-between p-6 select-none overflow-y-auto font-sans">
      
      {/* Background ambient safety glow light */}
      <div className="absolute top-[-10%] left-[-20%] w-[140%] h-[140%] pointer-events-none opacity-50">
        <div className="absolute top-[30%] left-[25%] w-96 h-96 rounded-full bg-white blur-[130px]" />
        <div className="absolute bottom-[20%] right-[30%] w-80 h-80 rounded-full bg-rose-100/40 blur-[100px]" />
      </div>

      {/* Header controls */}
      <div className="relative z-10 flex justify-between items-center shrink-0">
        <button
          onClick={onCancel}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-white border border-rose-150 hover:bg-rose-50 transition text-xs font-semibold text-rose-800"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Quitter</span>
        </button>

        <span className="text-xs font-extrabold tracking-widest uppercase text-red-750 bg-red-50 border border-red-150 px-3 py-1 rounded-full flex items-center space-x-1">
          <ShieldAlert className="w-3.5 h-3.5 animate-bounce" />
          <span>Urgence Émotionnelle</span>
        </span>

        <div className="w-8" />
      </div>

      {/* Main Container */}
      <div className="relative z-10 flex-1 flex flex-col justify-center max-w-sm mx-auto w-full py-6 space-y-6">
        
        {/* Reassurance panel */}
        <div className="text-center space-y-2 animate-fade-in">
          <h2 className="text-3xl font-extrabold text-rose-900 leading-tight">Tu es en Sécurité.</h2>
          <p className="text-xs text-rose-750 max-w-xs mx-auto leading-relaxed font-bold">
            L'anxiété est une vague physique inconfortable, mais elle passera toujours. Concentre-toi uniquement sur cet instant précis, à ton propre rythme.
          </p>
        </div>

        {/* Breathing pacer circle */}
        <div className="bg-white border border-rose-150 p-4 rounded-[32px] flex flex-col items-center justify-center space-y-4 shadow-sm backdrop-blur-xl">
          
          <span className="text-[9px] text-red-650 uppercase tracking-widest font-black flex items-center space-x-1">
            <Flame className="w-3.5 h-3.5" />
            <span>Respiration d'ancrage rapide</span>
          </span>

          <div className="relative flex items-center justify-center w-28 h-28">
            <motion.div
              animate={{
                scale: pulsePhase === "inspire" ? 1.25 : 1.0,
              }}
              transition={{ duration: 3, ease: "easeInOut" }}
              className="absolute inset-0 rounded-full bg-rose-50 border border-rose-200/40"
            />
            
            <motion.div
              animate={{
                scale: pulsePhase === "inspire" ? 1.15 : 0.9,
              }}
              transition={{ duration: 3, ease: "easeInOut" }}
              className="absolute w-20 h-20 rounded-full bg-rose-100 border border-rose-250 flex flex-col items-center justify-center shadow-sm"
            >
              <span className="text-xs font-bold text-rose-800 capitalize">
                {pulsePhase === "inspire" ? "Inspire" : "Expire"}
              </span>
              <span className="text-lg font-black text-rose-900 font-mono leading-none mt-1">
                {pulseCount}s
              </span>
            </motion.div>
          </div>

          <span className="text-[9px] text-stone-500 font-bold">Suis la bulle d'air calmement</span>
        </div>

        {/* Helpline contacts */}
        <div className="bg-rose-50 border border-rose-200 p-4 rounded-[28px] text-left space-y-3 shadow-xs">
          <h4 className="text-[10px] font-black uppercase text-rose-900 tracking-wider flex items-center space-x-1.5 border-b border-rose-150 pb-1.5">
            <PhoneCall className="w-3.5 h-3.5" />
            <span>Ressources Gratuites 24/7 (France) :</span>
          </h4>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between items-center border-b border-rose-100 pb-1.5">
              <span className="font-semibold text-stone-700">Prévention du Suicide :</span>
              <span className="font-extrabold text-rose-800 bg-white border border-rose-200 px-3 py-0.5 rounded-full text-[11px]">3114</span>
            </div>
            <div className="flex justify-between items-center border-b border-rose-100 pb-1.5">
              <span className="font-semibold text-stone-700">Secours Médical (SAMU) :</span>
              <span className="font-extrabold text-rose-800 bg-white border border-rose-200 px-3 py-0.5 rounded-full text-[11px]">15</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-stone-700 font-sans">SOS Amitié (Écoute) :</span>
              <span className="font-black text-red-700">09 72 39 40 50</span>
            </div>
          </div>
        </div>

      </div>

      {/* Footer bar */}
      <div className="relative z-10 space-y-5 shrink-0">
        <p className="text-[10px] text-rose-800/85 text-center italic leading-relaxed max-w-xs mx-auto px-2 font-bold">
          "Tu as de la valeur pour nous, et ce moment d'orage va finir par passer. Respire."
        </p>

        <div className="flex space-x-3.5 pb-2">
          <button
            onClick={onComplete}
            className="flex-1 py-3.5 bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-650 hover:to-rose-700 transition text-white font-bold rounded-full text-xs shadow-sm flex items-center justify-center space-x-2"
          >
            <Sparkles className="w-4 h-4 text-white" />
            <span>Je me sens mieux</span>
          </button>
        </div>
      </div>
    </div>
  );
};
