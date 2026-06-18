import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronLeft, ChevronRight, Feather, Sparkles, Accessibility } from "lucide-react";
import { BaseExerciseProps } from "./BaseExerciseProps";

const ALL_SCAN_PARTS = [
  { 
    part: "Le sommet du crâne & le front", 
    instruction: "Relâche les sourcils, laisse tes yeux flotter librement en fermant doucement les paupières. Sens le crâne se détendre.",
    ambientClass: "from-indigo-100/60 to-indigo-50/50",
    accentBorder: "border-indigo-200",
    zone: "Tête & Esprit"
  },
  { 
    part: "La mâchoire & le visage", 
    instruction: "Desserre les dents, laisse la langue se reposer loin du palais. Expire longuement par les lèvres détendues.",
    ambientClass: "from-indigo-100/50 to-purple-100/40",
    accentBorder: "border-purple-200/80",
    zone: "Visage"
  },
  { 
    part: "Les épaules & le cou", 
    instruction: "Laisse tes épaules s'abaisser naturellement. Imagine qu'elles fondent vers le sol lors de l'expiration paisible.",
    ambientClass: "from-purple-100/50 to-indigo-100/30",
    accentBorder: "border-purple-200/70",
    zone: "Tronc supérieur"
  },
  { 
    part: "La poitrine & le cœur", 
    instruction: "Sens la poitrine s'ouvrir calmement à l'inspiration, et s'apaiser à l'expiration. Respire au rythme du battement.",
    ambientClass: "from-indigo-100/60 to-purple-100/30",
    accentBorder: "border-indigo-200",
    zone: "Cœur & Poumons"
  },
  { 
    part: "L'abdomen & le ventre", 
    instruction: "Laisse ton ventre se gonfler sans contrainte à l'inspiration naturelle. Souffle avec une lenteur purificatrice.",
    ambientClass: "from-indigo-100/55 to-indigo-50/55",
    accentBorder: "border-indigo-200/80",
    zone: "Diaphragme & Digestion"
  },
  { 
    part: "Les jambes & les pieds", 
    instruction: "Ressens le contact lourd de tes talons contre le sol solide. Tu es pleinement ancré, en parfaite sécurité.",
    ambientClass: "from-indigo-100/65 to-indigo-50/50",
    accentBorder: "border-indigo-200",
    zone: "Enracinement"
  },
  { 
    part: "Les yeux & les tempes", 
    instruction: "Relâche les micro-muscles du contour des yeux. Visualise une chaleur douce se diffuser sur tes tempes fatiguées par les écrans.",
    ambientClass: "from-purple-100/60 to-indigo-50/50",
    accentBorder: "border-indigo-200/60",
    zone: "Regard & mental"
  },
  { 
    part: "Les oreilles & la nuque", 
    instruction: "Sois à l'écoute des sons lointains sans chercher à les analyser. Sens la base du crâne s'ouvrir et s'alléger.",
    ambientClass: "from-indigo-100/50 to-indigo-50/60",
    accentBorder: "border-purple-200/50",
    zone: "Audition & Port de tête"
  },
  { 
    part: "Le haut du dos & les omoplates", 
    instruction: "Imagine qu'un espace spacieux se crée entre tes deux omoplates. Laisse aller le poids invisible du stress quotidien.",
    ambientClass: "from-purple-100/70 to-indigo-100/40",
    accentBorder: "border-purple-300/50",
    zone: "Posture & Résilience"
  },
  { 
    part: "Le milieu & bas du dos", 
    instruction: "Sens le contact du siège ou du matelas soutenir fermement tes reins. Laisse s'envoler les raideurs lombaires.",
    ambientClass: "from-indigo-100/50 to-indigo-50/55",
    accentBorder: "border-indigo-200/70",
    zone: "Soutien lombaire"
  },
  { 
    part: "Les bras & les coudes", 
    instruction: "Sens l'énergie couler le long de tes bras, des biceps jusqu'aux coudes. Tes bras sont lourds et détendus au repos.",
    ambientClass: "from-purple-50 to-indigo-100/40",
    accentBorder: "border-indigo-150",
    zone: "Membres supérieurs"
  },
  { 
    part: "Les poignets & les mains", 
    instruction: "Baigne ton attention dans la paume de tes mains. Sens les vibrations ou la chaleur s'accumuler au bout de chaque doigt.",
    ambientClass: "from-indigo-100/40 to-indigo-50/35",
    accentBorder: "border-indigo-150",
    zone: "Force & Création"
  },
  { 
    part: "Le bassin & les hanches", 
    instruction: "Respire profondément au centre de ton bassin. Relâche les tensions profondes logées au confluent de tes membres.",
    ambientClass: "from-purple-100/45 to-purple-50/45",
    accentBorder: "border-purple-200",
    zone: "Stabilité centrale"
  },
  { 
    part: "Les cuisses", 
    instruction: "Lâche l'engagement des grands muscles fléchisseurs. Laisse tes cuisses s'étaler sur ton assise, douces et relâchées.",
    ambientClass: "from-indigo-100/50 to-indigo-50/50",
    accentBorder: "border-indigo-200",
    zone: "Grande mobilité"
  },
  { 
    part: "Les genoux", 
    instruction: "Porte une attention douce sur l'articulation de tes deux genoux. Remercie-les d'absorber tes pas et tes courses.",
    ambientClass: "from-purple-100/40 to-indigo-50/40",
    accentBorder: "border-purple-150",
    zone: "Flexibilité libre"
  },
  { 
    part: "Les mollets & chevilles", 
    instruction: "Ressens tes mollets totalement libres de toute velléité de départ ou de tension. Tes chevilles sont souples et en paix.",
    ambientClass: "from-indigo-150/40 to-indigo-50/40",
    accentBorder: "border-indigo-200",
    zone: "Légèreté & marche"
  },
  { 
    part: "La plante des pieds", 
    instruction: "Sens la peau fine sous tes pieds. C'est l'interface de ton corps avec le monde physique. Accueille cette sensation d'enracinement.",
    ambientClass: "from-indigo-100/65 to-purple-50/55",
    accentBorder: "border-indigo-250/60",
    zone: "Connexion Terre"
  },
  { 
    part: "Le corps tout entier", 
    instruction: "Prends une inspire globale : sens tout ton corps vibrer de la tête aux pieds, unifié dans le calme et la quiétude absolue.",
    ambientClass: "from-indigo-200/45 to-purple-100/40",
    accentBorder: "border-indigo-300",
    zone: "Unité & Sagesse"
  }
];

export const ScanCorporelExercise: React.FC<BaseExerciseProps> = ({
  onComplete,
  onCancel,
}) => {
  const [scanStep, setScanStep] = useState(0);

  const [scanParts] = useState(() => {
    const shuffled = [...ALL_SCAN_PARTS].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 6);
  });

  const currentPart = scanParts[scanStep];
  const progressPercent = ((scanStep + 1) / scanParts.length) * 100;

  const handleNext = () => {
    if (scanStep < scanParts.length - 1) {
      setScanStep((s) => s + 1);
    } else {
      onComplete();
    }
  };

  const handlePrev = () => {
    if (scanStep > 0) {
      setScanStep((s) => s - 1);
    }
  };

  return (
    <div className="absolute inset-0 bg-[#EEF2FF] text-indigo-950 flex flex-col justify-between p-6 select-none overflow-hidden font-sans">
      
      {/* Soft floating auroras */}
      <div className="absolute top-[-30%] right-[-10%] w-[130%] h-[130%] pointer-events-none opacity-50">
        <div className="absolute top-[20%] right-[20%] w-96 h-96 rounded-full bg-white blur-[130px]" />
        <div className="absolute bottom-[20%] left-[30%] w-80 h-80 rounded-full bg-indigo-100/40 blur-[110px]" />
      </div>

      {/* Header */}
      <div className="relative z-10 flex justify-between items-center">
        <button
          onClick={onCancel}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-white border border-indigo-100 hover:bg-indigo-50 transition text-xs font-semibold text-indigo-800"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Quitter</span>
        </button>

        <span className="text-xs font-extrabold tracking-widest uppercase text-indigo-850">
          Scan Corporel
        </span>

        <div className="w-8" />
      </div>

      {/* Main Scan area */}
      <div className="relative z-10 flex-1 flex flex-col justify-center max-w-sm mx-auto w-full">
        <div className="text-center space-y-2 mb-8">
          <h2 className="text-3xl font-extrabold text-indigo-900">Scan Corporel</h2>
          <p className="text-xs text-indigo-700/80">
            Parcours mentalement chaque zone pour dénouer les tensions accumulées
          </p>
        </div>

        {/* Part card with interactive details */}
        <div className="min-h-[290px] relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={scanStep}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className={`w-full bg-gradient-to-b ${currentPart.ambientClass} border ${currentPart.accentBorder} backdrop-blur-2xl p-6 rounded-3xl space-y-6 shadow-sm flex flex-col justify-between`}
            >
              <div className="flex justify-between items-start">
                <div className="p-3.5 bg-white rounded-2xl border border-indigo-150 shadow-sm">
                  <Feather className="w-7 h-7 text-indigo-600" />
                </div>
                <span className="text-[10px] uppercase font-bold tracking-widest bg-indigo-400/10 text-indigo-800 px-3 py-1.5 rounded-full border border-indigo-200">
                  {currentPart.zone}
                </span>
              </div>

              <div className="space-y-2">
                <span className="text-[10px] uppercase tracking-widest text-[#8b5cf6]/90 font-extrabold block">
                  Focus attentionnel
                </span>
                <h4 className="text-lg font-bold text-indigo-950 tracking-tight">
                  {currentPart.part}
                </h4>
                <p className="text-xs text-stone-705 leading-relaxed font-semibold italic">
                  "{currentPart.instruction}"
                </p>
              </div>

              {/* Soothing static graphic marker */}
              <div className="flex items-center space-x-1 p-2 bg-white rounded-xl text-[9px] text-indigo-900 font-extrabold justify-center border border-indigo-150 shadow-xs">
                <Accessibility className="w-3.5 h-3.5 text-indigo-600" />
                <span>Respire lentement dans cette région</span>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Footer controls */}
      <div className="relative z-10 space-y-6">
        
        {/* Step count */}
        <div className="flex justify-between items-center text-xs text-indigo-800/80 font-semibold px-1">
          <span>Étape {scanStep + 1} de {scanParts.length}</span>
          <span className="text-indigo-800 font-extrabold">Relâchement progressif</span>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-indigo-100/70 h-1.5 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-indigo-500 to-indigo-600"
            style={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>

        {/* Custom Actions */}
        <div className="flex justify-between items-center pb-2">
          <button
            disabled={scanStep === 0}
            onClick={handlePrev}
            className="px-5 py-3 border border-indigo-200 rounded-full text-xs font-bold text-stone-700 hover:text-stone-900 bg-white hover:bg-indigo-50 transition"
          >
            Précédent
          </button>

          <button
            onClick={handleNext}
            className="px-7 py-3 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white rounded-full text-xs font-bold hover:brightness-105 transition flex items-center space-x-1.5 shadow-sm"
          >
            {scanStep < scanParts.length - 1 ? (
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
