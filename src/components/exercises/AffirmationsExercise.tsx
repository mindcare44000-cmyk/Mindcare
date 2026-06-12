import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronLeft, Sparkles, Heart, RefreshCw, CheckCircle2 } from "lucide-react";
import { BaseExerciseProps } from "./BaseExerciseProps";

export const AffirmationsExercise: React.FC<BaseExerciseProps> = ({
  onComplete,
  onCancel,
}) => {
  const [affirmIndex, setAffirmIndex] = useState(0);
  const [favorites, setFavorites] = useState<number[]>([]);

  const affirmationsList = [
    "Je fais de mon mieux, et cela est amplement suffisant aujourd'hui.",
    "Je m'accorde le droit de ralentir et de prendre soin de mon esprit.",
    "Mes émotions sont bienvenues, elles traversent juste mon ciel intérieur.",
    "Chaque respiration douce ramène un peu de calme et de sécurité en moi.",
    "Je suis digne de douceur, de confiance et de bienveillance.",
    "Je libère les attentes des autres pour retrouver mon propre rythme.",
  ];

  const nextAffirmation = () => {
    setAffirmIndex((idx) => (idx + 1) % affirmationsList.length);
  };

  const toggleFavorite = (idx: number) => {
    if (favorites.includes(idx)) {
      setFavorites(favorites.filter((f) => f !== idx));
    } else {
      setFavorites([...favorites, idx]);
    }
  };

  const progressPercent = ((affirmIndex + 1) / affirmationsList.length) * 100;

  return (
    <div className="absolute inset-0 bg-[#FFF1F2] text-rose-950 flex flex-col justify-between p-6 select-none overflow-hidden font-sans">
      
      {/* Background ambient glowing spheres */}
      <div className="absolute top-[-20%] right-[-10%] w-[130%] h-[130%] pointer-events-none opacity-50">
        <div className="absolute top-[20%] right-[25%] w-96 h-96 rounded-full bg-white blur-[120px]" />
        <div className="absolute bottom-[30%] left-[20%] w-80 h-80 rounded-full bg-rose-100/40 blur-[100px]" />
      </div>

      {/* Header controls */}
      <div className="relative z-10 flex justify-between items-center">
        <button
          onClick={onCancel}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-white border border-rose-150 hover:bg-rose-50 transition text-xs font-semibold text-rose-800"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Quitter</span>
        </button>

        <span className="text-xs font-extrabold tracking-widest uppercase text-rose-800">
          Affirmations Positives
        </span>

        <div className="w-8" />
      </div>

      {/* Oracle card container */}
      <div className="relative z-10 flex-1 flex flex-col justify-center max-w-sm mx-auto w-full">
        <div className="text-center space-y-2 mb-8 animate-fade-in">
          <h2 className="text-3xl font-extrabold text-rose-900">Espace de Pensées Douces</h2>
          <p className="text-xs text-rose-700/80 max-w-xs mx-auto font-medium">
            Laisse vibrer ces paroles bienveillantes pour apaiser la critique intérieure
          </p>
        </div>

        {/* Card space */}
        <div className="min-h-[290px] relative flex flex-col justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={affirmIndex}
              initial={{ opacity: 0, scale: 0.94, rotate: -1 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, scale: 0.94, rotate: 1 }}
              transition={{ duration: 0.45 }}
              className="w-full bg-gradient-to-b from-rose-100/60 to-orange-50/50 border border-rose-200 backdrop-blur-2xl p-7 rounded-[40px] space-y-6 shadow-sm relative flex flex-col justify-between items-center text-center"
            >
              {/* Sparkle indicators */}
              <div className="absolute top-4 left-5 text-rose-405 opacity-60">✨</div>
              <div className="absolute bottom-4 right-5 text-orange-400 opacity-60">✨</div>

              {/* Heart Badge */}
              <button
                onClick={() => toggleFavorite(affirmIndex)}
                className={`p-3 rounded-full border transition cursor-pointer ${
                  favorites.includes(affirmIndex)
                    ? "bg-rose-50 border-rose-300 text-rose-605 shadow-xs"
                    : "bg-white border-rose-150 text-rose-400 hover:text-rose-600"
                }`}
                title="Garder en cœur"
              >
                <Heart className={`w-5 h-5 ${favorites.includes(affirmIndex) ? "fill-current" : ""}`} />
              </button>

              {/* Affirmation Text */}
              <div className="py-2 px-1">
                <p className="text-md sm:text-lg font-bold text-rose-950 leading-relaxed italic">
                  "{affirmationsList[affirmIndex]}"
                </p>
              </div>

              {/* Static support note */}
              <span className="text-[9px] uppercase tracking-widest font-extrabold text-rose-700/60">
                Respire et répète cette phrase intérieurement
              </span>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Bottom controls */}
      <div className="relative z-10 space-y-6">
        
        {/* Progress indicators */}
        <div className="flex justify-between items-center text-xs text-rose-800/80 font-semibold px-1">
          <span>Pensée {affirmIndex + 1} de {affirmationsList.length}</span>
          <span className="text-rose-700 flex items-center space-x-1 text-[10px] font-extrabold">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Estime de soi</span>
          </span>
        </div>

        {/* Progress line */}
        <div className="w-full bg-rose-100 h-1.5 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-rose-400 to-rose-500"
            style={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>

        {/* Primary interactions */}
        <div className="flex space-x-4 pb-2">
          
          <button
            onClick={() => setAffirmIndex(0)}
            className="p-3.5 border border-rose-200 rounded-full text-xs font-bold text-rose-800 bg-white hover:bg-rose-50 transition shadow-sm"
            title="Première pensée"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          <button
            onClick={nextAffirmation}
            className="flex-1 py-3.5 bg-gradient-to-r from-rose-500 to-rose-600 text-white rounded-full text-xs font-bold hover:brightness-105 transition flex items-center justify-center space-x-2 shadow-sm"
          >
            <span>Affirmation Suivante</span>
            <Sparkles className="w-4 h-4" />
          </button>

          <button
            onClick={onComplete}
            className="px-6 py-3.5 bg-white border border-rose-200 hover:bg-rose-50 text-rose-700 rounded-full text-xs font-bold transition shadow-sm"
          >
            Terminer
          </button>
        </div>
      </div>
    </div>
  );
};
