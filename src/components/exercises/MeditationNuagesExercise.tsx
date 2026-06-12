import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronLeft, Wind, Sparkles, Cloud } from "lucide-react";
import { BaseExerciseProps } from "./BaseExerciseProps";

interface FlyingCloud {
  id: string;
  text: string;
  y: number; // Vertical offset
  scale: number;
}

export const MeditationNuagesExercise: React.FC<BaseExerciseProps> = ({
  onComplete,
  onCancel,
}) => {
  const [cloudThought, setCloudThought] = useState("");
  const [cloudsList, setCloudsList] = useState<FlyingCloud[]>([
    { id: "1", text: "Mes doutes sur l'avenir", y: -45, scale: 1 },
    { id: "2", text: "La peur d'échouer", y: 35, scale: 0.95 },
  ]);

  const handleCreateCloud = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cloudThought.trim()) return;

    const randomY = Math.floor(Math.random() * 110) - 55; // vertical range
    const randomScale = 0.85 + Math.random() * 0.3; // sizes

    const newCloud: FlyingCloud = {
      id: Date.now().toString(),
      text: cloudThought.trim(),
      y: randomY,
      scale: randomScale,
    };

    setCloudsList([...cloudsList, newCloud]);
    setCloudThought("");
  };

  const handleShootCloud = (id: string) => {
    setCloudsList(cloudsList.filter((c) => c.id !== id));
  };

  return (
    <div className="absolute inset-0 bg-[#F0FDFA] text-teal-950 flex flex-col justify-between p-6 select-none overflow-hidden font-sans">
      
      {/* Upper floating abstract shapes */}
      <div className="absolute top-[-30%] right-[-20%] w-[140%] h-[140%] pointer-events-none opacity-50">
        <div className="absolute top-[20%] right-[30%] w-96 h-96 rounded-full bg-white blur-[130px]" />
        <div className="absolute bottom-[30%] left-[20%] w-90 h-90 rounded-full bg-teal-100/40 blur-[110px]" />
      </div>

      {/* Header controls */}
      <div className="relative z-10 flex justify-between items-center">
        <button
          onClick={onCancel}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-white border border-teal-150 hover:bg-teal-50/50 transition text-xs font-semibold text-teal-800"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Quitter</span>
        </button>

        <span className="text-xs font-extrabold tracking-widest uppercase text-teal-800">
          Visualisation des Nuages
        </span>

        <div className="w-8" />
      </div>

      {/* Main Container */}
      <div className="relative z-10 flex-1 flex flex-col justify-center max-w-sm mx-auto w-full space-y-6">
        <div className="text-center space-y-2 mb-2 animate-fade-in">
          <h2 className="text-3xl font-extrabold text-teal-900">Prendre du Recul</h2>
          <p className="text-xs text-teal-700/80 leading-relaxed max-w-xs mx-auto font-medium">
            Écris une rumination envahissante, attache-la à un nuage céleste, puis souffle dessus pour la regarder s'éloigner
          </p>
        </div>

        {/* Form area to input thought */}
        <form onSubmit={handleCreateCloud} className="flex space-x-2 relative z-20">
          <input
            type="text"
            value={cloudThought}
            onChange={(e) => setCloudThought(e.target.value)}
            placeholder="Ex: cette réunion urgente, ma fatigue..."
            maxLength={60}
            className="flex-1 bg-white border border-teal-200 focus:border-teal-400 placeholder-teal-800/40 rounded-full py-3 px-4 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-teal-400/10 transition-all text-stone-800 shadow-sm"
          />
          <button
            type="submit"
            disabled={!cloudThought.trim()}
            className="bg-teal-600 hover:bg-teal-700 text-white px-5.5 py-3 rounded-full text-xs font-bold shadow-sm disabled:opacity-45 disabled:pointer-events-none transition flex items-center space-x-1"
          >
            <Cloud className="w-4 h-4 fill-current" />
            <span>Matérialiser</span>
          </button>
        </form>

        {/* Sky playground with absolute canvas bounds */}
        <div className="w-full h-56 bg-sky-50/50 border border-teal-150 rounded-[32px] overflow-hidden relative flex flex-col items-center justify-center shadow-sm backdrop-blur-xl">
          
          <div className="absolute top-3 left-4 flex items-center space-x-1.5 opacity-50 text-[9px] uppercase tracking-widest font-extrabold text-teal-800">
            <Wind className="w-3.5 h-3.5" />
            <span>Mon ciel de conscience actuel</span>
          </div>

          <AnimatePresence>
            {cloudsList.length === 0 ? (
              <motion.div
                key="empty-sky"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.8 }}
                exit={{ opacity: 0 }}
                className="text-center p-4 space-y-1.5"
              >
                <div className="text-2xl">✨</div>
                <p className="text-[10px] text-teal-800/80 italic font-bold">
                  Ton ciel intérieur est purifié et limpide.
                </p>
              </motion.div>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center p-4 w-full h-full">
                {cloudsList.map((cloud) => (
                  <motion.div
                    key={cloud.id}
                    initial={{ x: "-120%", opacity: 0, scale: 0.8 }}
                    animate={{ x: 0, opacity: 1, scale: cloud.scale }}
                    exit={{ x: "150%", opacity: 0, scale: 0.8 }}
                    transition={{ type: "spring", stiffness: 45, damping: 14 }}
                    className="absolute bg-white border border-teal-200 px-4 py-2.5 rounded-full shadow-sm backdrop-blur-md flex items-center space-x-3.5 text-xs text-stone-800 font-bold"
                    style={{ y: `${cloud.y}px` }}
                  >
                    <span className="max-w-[150px] truncate leading-tight">{cloud.text}</span>
                    <button
                      onClick={() => handleShootCloud(cloud.id)}
                      className="w-6 h-6 rounded-full bg-teal-50 border border-teal-200 text-teal-900 font-bold hover:bg-teal-105 text-[10px] flex items-center justify-center shadow-xs cursor-pointer hover:scale-105 active:scale-95 transition"
                      title="Souffler la pensée"
                    >
                      💨
                    </button>
                  </motion.div>
                ))}
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Footer validation */}
      <div className="relative z-10 space-y-6">
        
        {/* Helper bottom line */}
        <p className="text-[10px] text-stone-700/80 text-center italic max-w-xs mx-auto px-2 font-medium">
          "Observe comment tes soucis sont de simples formations météorologiques temporaires dans l'immensité de ton esprit."
        </p>

        {/* Buttons */}
        <div className="flex justify-between items-center pb-2">
          <div className="text-xs text-teal-800/80 font-bold">
            <span>Nuages restants : {cloudsList.length}</span>
          </div>

          <button
            onClick={onComplete}
            className="px-8 py-3.5 bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-full text-xs font-bold hover:brightness-105 transition flex items-center space-x-1.5 shadow-sm"
          >
            <Sparkles className="w-4 h-4" />
            <span>Prendre Recul</span>
          </button>
        </div>
      </div>
    </div>
  );
};
