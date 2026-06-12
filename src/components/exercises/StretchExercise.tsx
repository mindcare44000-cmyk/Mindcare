import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronLeft, ChevronRight, Activity, Sparkles, Check } from "lucide-react";
import { BaseExerciseProps } from "./BaseExerciseProps";

export const StretchExercise: React.FC<BaseExerciseProps> = ({
  onComplete,
  onCancel,
}) => {
  const [stretchStep, setStretchStep] = useState(0);

  const movements = [
    {
      num: 1,
      title: "Élévation Céleste",
      instructions: "Lève lentement les deux bras vers le ciel en inspirant profondément par le nez. Sens ta colonne vertébrale s'allonger doucement. Grandis-toi au maximum de tes capacités de l'instant, sans forcer.",
      focus: "Ouverture thoracique & étirement doux",
      ambientClass: "from-orange-100/60 to-orange-50/50",
      accentBorder: "border-orange-200",
      icon: "🙌"
    },
    {
      num: 2,
      title: "Le Soupir Libérateur",
      instructions: "Bloque ta respiration pendant 2 petites secondes au sommet, étire le bout des doigts, puis laisse retomber tes bras d'un coup sec vers le bas en poussant un très long soupir bruyant par la bouche, en relâchant tout d'un coup.",
      focus: "Déblocage immédiat du diaphragme & décharge de stress",
      ambientClass: "from-orange-100/40 to-amber-50/30",
      accentBorder: "border-orange-200",
      icon: "💨"
    },
    {
      num: 3,
      title: "Rotation des Trapèzes",
      instructions: "Roule lentement tes épaules vers l'arrière dans un mouvement bien circulaire et régulier. Fais-le trois fois à ton rythme pour libérer les trapèzes et délier les tensions de la nuque.",
      focus: "Détente musculaire cervicales & trapèzes supérieurs",
      ambientClass: "from-amber-100/50 to-orange-50/30",
      accentBorder: "border-amber-200",
      icon: "🔄"
    }
  ];

  const currentMov = movements[stretchStep];
  const progressPercent = ((stretchStep + 1) / movements.length) * 100;

  const handleNext = () => {
    if (stretchStep < movements.length - 1) {
      setStretchStep((s) => s + 1);
    } else {
      onComplete();
    }
  };

  const handlePrev = () => {
    if (stretchStep > 0) {
      setStretchStep((s) => s - 1);
    }
  };

  return (
    <div className="absolute inset-0 bg-[#FFF7ED] text-orange-950 flex flex-col justify-between p-6 select-none overflow-hidden font-sans">
      
      {/* Background glow flares */}
      <div className="absolute top-[-25%] left-[-15%] w-[130%] h-[130%] pointer-events-none opacity-50">
        <div className="absolute top-[20%] left-[25%] w-96 h-96 rounded-full bg-white blur-[130px]" />
        <div className="absolute bottom-[20%] right-[30%] w-80 h-80 rounded-full bg-orange-150/40 blur-[100px]" />
      </div>

      {/* Header */}
      <div className="relative z-10 flex justify-between items-center">
        <button
          onClick={onCancel}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-white border border-orange-150 hover:bg-orange-100/50 transition text-xs font-semibold text-orange-850"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Quitter</span>
        </button>

        <span className="text-xs font-extrabold tracking-widest uppercase text-orange-800">
          Stretch Corporel
        </span>

        <div className="w-8" />
      </div>

      {/* Main Container */}
      <div className="relative z-10 flex-1 flex flex-col justify-center max-w-sm mx-auto w-full">
        <div className="text-center space-y-2 mb-8 animate-fade-in">
          <h2 className="text-3xl font-extrabold text-orange-900">Ancrage & Stretch</h2>
          <p className="text-xs text-orange-700/80 max-w-xs mx-auto">
            Trois gestes physiques conscients pour soulager le diaphragme comprimé
          </p>
        </div>

        {/* Swipe Card */}
        <div className="min-h-[295px] relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={stretchStep}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.3 }}
              className={`w-full bg-gradient-to-b ${currentMov.ambientClass} border ${currentMov.accentBorder} backdrop-blur-xl p-6 rounded-3xl space-y-6 shadow-sm flex flex-col justify-between`}
            >
              <div className="flex justify-between items-start">
                <div className="w-14 h-14 rounded-2xl bg-white border border-orange-200 shadow-sm flex items-center justify-center text-3xl">
                  {currentMov.icon}
                </div>
                <div className="flex items-center space-x-1 text-[10px] uppercase font-bold tracking-widest bg-orange-400/10 text-orange-800 px-3 py-1 rounded-full border border-orange-250 shadow-xs">
                  <Activity className="w-3.5 h-3.5" />
                  <span>Étape {currentMov.num}</span>
                </div>
              </div>

              <div className="space-y-1.5">
                <h4 className="text-lg font-bold text-orange-950 tracking-tight">
                  {currentMov.title}
                </h4>
                <p className="text-xs text-stone-705 leading-relaxed font-semibold">
                  {currentMov.instructions}
                </p>
              </div>

              <div className="text-[10px] text-orange-800 font-extrabold border-t border-orange-100 pt-3 uppercase tracking-wider flex items-center space-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-ping" />
                <span>Cible : {currentMov.focus}</span>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Footer controls */}
      <div className="relative z-10 space-y-6">
        
        {/* Step index */}
        <div className="flex justify-between items-center text-xs text-orange-800/80 font-semibold px-1">
          <span>Séquence active ({stretchStep + 1} / {movements.length})</span>
          <span className="text-orange-800 font-extrabold">Énergie corporelle</span>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-orange-100 h-1.5 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-orange-400 to-orange-550"
            style={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>

        {/* Button container */}
        <div className="flex justify-between items-center pb-2">
          <button
            disabled={stretchStep === 0}
            onClick={handlePrev}
            className="px-5 py-3 border border-orange-200 rounded-full text-xs font-bold text-stone-700 hover:text-stone-900 bg-white hover:bg-orange-50/50 disabled:opacity-30 disabled:pointer-events-none transition"
          >
            Précédent
          </button>

          <button
            onClick={handleNext}
            className="px-8 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-full text-xs font-bold hover:brightness-105 transition flex items-center space-x-2 shadow-sm"
          >
            {stretchStep < movements.length - 1 ? (
              <>
                <span>Mouvement Fait</span>
                <ChevronRight className="w-4 h-4" />
              </>
            ) : (
              <>
                <Check className="w-4 h-4" />
                <span>Terminer</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
