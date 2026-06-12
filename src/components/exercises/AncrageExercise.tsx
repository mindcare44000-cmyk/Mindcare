import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronLeft, ChevronRight, Sparkles, Eye, Hand, Volume2, Flame, Heart } from "lucide-react";
import { BaseExerciseProps } from "./BaseExerciseProps";

export const AncrageExercise: React.FC<BaseExerciseProps> = ({
  onComplete,
  onCancel,
}) => {
  const [sensorIdx, setSensorIdx] = useState(0);
  const [sensorNotes, setSensorNotes] = useState(["", "", "", "", ""]);

  const steps = [
    {
      title: "👀 Ancrage Visuel",
      subtitle: "Trouve et saisis 5 choses visibles autour de toi",
      placeholder: "Ex: un stylo bleu, les motifs du bois, une plante verte...",
      colorTheme: "from-amber-100/55 to-amber-50/50",
      accentBorder: "border-amber-200",
      icon: <Eye className="w-8 h-8 text-amber-600" />,
      tag: "5 éléments"
    },
    {
      title: "✋ Ancrage Tactile",
      subtitle: "Sens 4 textures ou appuis physiques distincts",
      placeholder: "Ex: le dossier de la chaise sur mon dos, le coton doux de mon t-shirt...",
      colorTheme: "from-orange-100/55 to-amber-50/50",
      accentBorder: "border-orange-200/80",
      icon: <Hand className="w-8 h-8 text-orange-600" />,
      tag: "4 éléments"
    },
    {
      title: "👂 Ancrage Auditif",
      subtitle: "Capte 3 bruits distincts parvenant à ton oreille",
      placeholder: "Ex: le ronronnement lointain d'un moteur, les oiseaux dehors, ma propre respiration...",
      colorTheme: "from-amber-100/50 to-amber-50/40",
      accentBorder: "border-amber-200/70",
      icon: <Volume2 className="w-8 h-8 text-amber-650" />,
      tag: "3 éléments"
    },
    {
      title: "👃 Ancrage Olfactif",
      subtitle: "Détecte 2 parfums ou odeurs particulières",
      placeholder: "Ex: l'odeur réconfortante du café, le papier d'un carnet de notes...",
      colorTheme: "from-amber-100/60 to-orange-100/20",
      accentBorder: "border-amber-200",
      icon: <Flame className="w-8 h-8 text-amber-605" />,
      tag: "2 éléments"
    },
    {
      title: "👅 Ancrage Interne ou Gustatif",
      subtitle: "Identifie 1 goût agréable ou sensation interne de vie",
      placeholder: "Ex: l'arrière-goût mentholé de mon thé, une sensation d'air tiède sur mon visage...",
      colorTheme: "from-orange-100/55 to-amber-100/30",
      accentBorder: "border-orange-200/70",
      icon: <Heart className="w-8 h-8 text-orange-550" />,
      tag: "1 élément"
    }
  ];

  const currentStep = steps[sensorIdx];

  const handleNext = () => {
    if (sensorIdx < 4) {
      setSensorIdx((i) => i + 1);
    } else {
      onComplete();
    }
  };

  const handlePrev = () => {
    if (sensorIdx > 0) {
      setSensorIdx((i) => i - 1);
    }
  };

  const progressPercent = ((sensorIdx + 1) / 5) * 100;

  return (
    <div className="absolute inset-0 bg-[#FFFBEB] text-amber-950 flex flex-col justify-between p-6 select-none overflow-hidden font-sans">
      
      {/* Background soft sun beams */}
      <div className="absolute top-[-20%] left-[-25%] w-[140%] h-[140%] pointer-events-none opacity-50">
        <div className="absolute top-[20%] left-[30%] w-96 h-96 rounded-full bg-white blur-[140px]" />
        <div className="absolute bottom-[30%] right-[20%] w-80 h-80 rounded-full bg-amber-100/40 blur-[110px]" />
      </div>

      {/* Header controls */}
      <div className="relative z-10 flex justify-between items-center">
        <button
          onClick={onCancel}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-white border border-amber-150 hover:bg-amber-50 transition text-xs font-semibold text-amber-800"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Quitter</span>
        </button>

        <span className="text-xs font-extrabold tracking-widest uppercase text-amber-850">
          Ancrage Sensoriel
        </span>

        <div className="w-8" /> {/* Spacer */}
      </div>

      {/* Grounding Slide space */}
      <div className="relative z-10 flex-1 flex flex-col justify-center max-w-sm mx-auto w-full">
        <div className="text-center space-y-2 mb-8">
          <h2 className="text-3xl font-extrabold text-amber-900">Méthode 5-4-3-2-1</h2>
          <p className="text-xs text-amber-700/80">
            Rebranche ton cerveau sur tes sens présents pour faire fondre les ruminations
          </p>
        </div>

        {/* Step Card with AnimatePresence */}
        <div className="min-h-[295px] relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={sensorIdx}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className={`w-full bg-gradient-to-b ${currentStep.colorTheme} border ${currentStep.accentBorder} backdrop-blur-xl p-5 rounded-3xl space-y-6 shadow-sm flex flex-col justify-between`}
            >
              <div className="flex justify-between items-start">
                <div className="p-3 bg-white rounded-2xl shadow-sm border border-amber-100">
                  {currentStep.icon}
                </div>
                <span className="text-[10px] uppercase tracking-widest font-extrabold bg-amber-500/10 text-amber-800 px-3 py-1 rounded-full border border-amber-250">
                  {currentStep.tag}
                </span>
              </div>

              <div className="space-y-1">
                <h4 className="text-lg font-bold text-amber-950">{currentStep.title}</h4>
                <p className="text-xs text-stone-700 leading-relaxed font-semibold">
                  {currentStep.subtitle}
                </p>
              </div>

              <div className="space-y-1">
                <input
                  type="text"
                  value={sensorNotes[sensorIdx]}
                  onChange={(e) => {
                    const n = [...sensorNotes];
                    n[sensorIdx] = e.target.value;
                    setSensorNotes(n);
                  }}
                  placeholder={currentStep.placeholder}
                  className="w-full bg-white text-stone-800 placeholder-amber-900/40 rounded-2xl py-3.5 px-4 text-xs font-semibold border border-amber-200 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/10 transition-all shadow-sm"
                />
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Footer step controller */}
      <div className="relative z-10 space-y-6">
        
        {/* Step Progress indicators */}
        <div className="flex justify-between items-center text-xs text-amber-800/80 font-semibold px-1">
          <span>Étape {sensorIdx + 1} de 5</span>
          <span className="text-amber-800 font-extrabold">Ancrage Sensoriel actif</span>
        </div>

        {/* Floating progress line */}
        <div className="w-full bg-amber-100 h-1.5 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-amber-400 to-orange-400"
            style={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>

        {/* Next and Back buttons */}
        <div className="flex justify-between items-center pb-2">
          <button
            disabled={sensorIdx === 0}
            onClick={handlePrev}
            className="px-5 py-3 border border-amber-200 rounded-full text-xs font-bold text-stone-700 hover:text-stone-900 bg-white hover:bg-amber-50/50 disabled:opacity-30 disabled:pointer-events-none transition"
          >
            Précédent
          </button>

          <button
            onClick={handleNext}
            className="px-7 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-full text-xs font-bold hover:brightness-105 transition flex items-center space-x-1.5 shadow-sm"
          >
            {sensorIdx < 4 ? (
              <>
                <span>Suivant</span>
                <ChevronRight className="w-4 h-4" />
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Terminer</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
