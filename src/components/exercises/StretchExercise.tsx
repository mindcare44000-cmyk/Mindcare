import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronLeft, ChevronRight, Activity, Sparkles, Check } from "lucide-react";
import { BaseExerciseProps } from "./BaseExerciseProps";

const ALL_MOVEMENTS = [
  {
    title: "Élévation Céleste",
    instructions: "Lève lentement les deux bras vers le ciel en inspirant profondément par le nez. Sens ta colonne vertébrale s'allonger doucement. Grandis-toi au maximum de tes capacités de l'instant, sans forcer.",
    focus: "Ouverture thoracique & étirement doux",
    ambientClass: "from-orange-100/60 to-orange-50/50",
    accentBorder: "border-orange-200",
    icon: "🙌"
  },
  {
    title: "Le Soupir Libérateur",
    instructions: "Bloque ta respiration pendant 2 petites secondes au sommet, étire le bout des doigts, puis laisse retomber tes bras d'un coup sec vers le bas en poussant un très long soupir bruyant par la bouche, en relâchant tout d'un coup.",
    focus: "Déblocage immédiat du diaphragme & décharge de stress",
    ambientClass: "from-orange-100/40 to-amber-50/30",
    accentBorder: "border-orange-200",
    icon: "💨"
  },
  {
    title: "Rotation des Trapèzes",
    instructions: "Roule lentement tes épaules vers l'arrière dans un mouvement bien circulaire et régulier. Fais-le trois fois à ton rythme pour libérer les trapèzes et délier les tensions de la nuque.",
    focus: "Détente musculaire cervicales & trapèzes supérieurs",
    ambientClass: "from-amber-100/50 to-orange-50/30",
    accentBorder: "border-amber-200",
    icon: "🔄"
  },
  {
    title: "Le Roseau Souple",
    instructions: "Enlace tes doigts au-dessus de ta tête, paumes vers le haut. Penche-toi délicatement vers la gauche en expirant, ressens l'étirement du flanc droit, puis reviens au centre à l'inspiration. Fais de même vers la droite.",
    focus: "Étirement des muscles intercostaux & respiration latérale",
    ambientClass: "from-orange-100/50 to-orange-50/40",
    accentBorder: "border-orange-300/60",
    icon: "🌾"
  },
  {
    title: "Ouverture du Cœur",
    instructions: "Place tes mains sur le bas de ton dos, les coudes pointant vers l'arrière. En inspirant, incline doucement le haut de ton torse vers le haut, en rapprochant tes omoplates. Ouvre la poitrine et respire.",
    focus: "Correction de la posture & ouverture de la cage thoracique",
    ambientClass: "from-amber-100/60 to-orange-50/50",
    accentBorder: "border-amber-200",
    icon: "💖"
  },
  {
    title: "Flexion de l'Ancre",
    instructions: "Debout ou assis, fléchis doucement le buste vers l'avant. Relâche complètement ta tête, ton cou et tes bras vers le sol. Balance-toi légèrement de gauche à droite, sentant le poids éliminer tes soucis.",
    focus: "Relâchement de la chaîne postérieure & décompression lombaire",
    ambientClass: "from-orange-150/50 to-amber-50/40",
    accentBorder: "border-orange-200",
    icon: "⚓"
  },
  {
    title: "Étirement du Sphinx",
    instructions: "Garde le dos bien droit. Tourne lentement la tête vers l'épaule gauche, maintiens 3 secondes, puis tourne vers l'épaule droite. Respire amplement à chaque rotation pour libérer le cou.",
    focus: "Mobilité cervicale & relâchement des tensions du regard",
    ambientClass: "from-orange-100/50 to-amber-100/30",
    accentBorder: "border-orange-150",
    icon: "🦁"
  },
  {
    title: "Le Chat Somnolent",
    instructions: "Assis(e) sur ta chaise ou au sol, pose tes mains sur tes genoux. En expirant, arrondis le dos au maximum en rentrant le menton. En inspirant, creuse doucement le haut du dos en bombant le torse.",
    focus: "Assouplissement de toute la colonne vertébrale",
    ambientClass: "from-amber-100/40 to-orange-100/40",
    accentBorder: "border-amber-150",
    icon: "🐱"
  },
  {
    title: "Détente du Poignet",
    instructions: "Tends un bras devant toi, paume vers l'avant, doigts vers le bas. Avec ton autre main, tire doucement tes doigts vers toi. Respire calmement en relâchant les crispations accumulées sur le clavier.",
    focus: "Soulagement des tensions des mains, poignets et canaux",
    ambientClass: "from-orange-50 to-orange-100/30",
    accentBorder: "border-orange-100",
    icon: "✍️"
  },
  {
    title: "Torsion de la Chaise",
    instructions: "Assis(e), place ta main droite sur ton genou gauche et pivote doucement le buste vers la gauche en regardant derrière toi. Garde le dos grandi. Prends deux respirations complètes, puis change de côté.",
    focus: "Détoxification de la colonne & relâchement vertébral",
    ambientClass: "from-amber-50 to-orange-100/40",
    accentBorder: "border-amber-200",
    icon: "🪑"
  },
  {
    title: "Le Souffle du Guerrier",
    instructions: "Ouvre grand les bras en croix sur une grande inspiration. Ferme les poings puis ramène-les sur ton cœur en expirant vigoureusement. Sens la puissance et la chaleur circuler dans tes bras.",
    focus: "Relance énergétique globale & ancrage corporel",
    ambientClass: "from-orange-100 to-orange-55",
    accentBorder: "border-orange-300",
    icon: "🧘"
  },
  {
    title: "La Pince Douce",
    instructions: "Allonge les jambes devant toi. Glisse doucement tes mains le long de tes cuisses vers tes chevilles. Pas besoin de toucher tes pieds, apprécie juste l'étirement doux.",
    focus: "Étirement des muscles fessiers & arrière des cuisses",
    ambientClass: "from-amber-100/40 to-orange-50",
    accentBorder: "border-amber-150",
    icon: "🦵"
  },
  {
    title: "Auto-Massage de la Nuque",
    instructions: "Pose tes mains fraîches à la base de ta nuque. Exerce de petites pressions fermes et circulaires de chaque côté de la colonne vertébrale en montant vers le crâne. Expire en relâchant tes trapèzes.",
    focus: "Irrigation sanguine de la tête & libération du stress mental",
    ambientClass: "from-orange-100/40 to-amber-100/30",
    accentBorder: "border-orange-200",
    icon: "💆"
  },
  {
    title: "Le Press-Épaules",
    instructions: "Amène ton bras droit tendu devant toi puis presse-le contre ta poitrine à l'aide de ton avant-bras gauche. Garde l'épaule droite bien basse. Respire 3 fois puis change de côté.",
    focus: "Étirement de l'arrière de l'épaule & des deltoïdes",
    ambientClass: "from-amber-100/50 to-orange-100/30",
    accentBorder: "border-amber-150",
    icon: "👐"
  },
  {
    title: "La Fleur de Lotus",
    instructions: "Joins tes paumes devant la poitrine. En inspirant, ouvre les doigts en gardant la base des mains scellées, comme une fleur qui s'ouvre au soleil. Expire en fermant doucement les boutons de fleur.",
    focus: "Mobilisation des articulations des doigts & pleine conscience",
    ambientClass: "from-orange-100/50 to-orange-50/50",
    accentBorder: "border-orange-200",
    icon: "🪷"
  }
];

export const StretchExercise: React.FC<BaseExerciseProps> = ({
  onComplete,
  onCancel,
}) => {
  const [stretchStep, setStretchStep] = useState(0);

  const [movements] = useState(() => {
    const shuffled = [...ALL_MOVEMENTS].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 3).map((item, idx) => ({
      ...item,
      num: idx + 1
    }));
  });

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
