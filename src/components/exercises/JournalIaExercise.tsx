import React, { useState } from "react";
import { motion } from "motion/react";
import { ChevronLeft, Sparkles, MessageCircle, HelpCircle, Check } from "lucide-react";
import { BaseExerciseProps } from "./BaseExerciseProps";

export const JournalIaExercise: React.FC<BaseExerciseProps> = ({
  onComplete,
  onCancel,
}) => {
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    if (!response.trim()) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSaved(true);
    }, 1100);
  };

  return (
    <div className="absolute inset-0 bg-[#F5F3FF] text-violet-950 flex flex-col justify-between p-6 select-none overflow-hidden font-sans">
      
      {/* Background soft glowing spheres */}
      <div className="absolute top-[-30%] right-[-15%] w-[130%] h-[130%] pointer-events-none opacity-50">
        <div className="absolute top-[20%] right-[30%] w-96 h-96 rounded-full bg-white blur-[120px]" />
        <div className="absolute bottom-[20%] left-[20%] w-80 h-80 rounded-full bg-violet-100/40 blur-[100px]" />
      </div>

      {/* Header controls */}
      <div className="relative z-10 flex justify-between items-center">
        <button
          onClick={onCancel}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-white border border-violet-150 hover:bg-violet-50 transition text-xs font-semibold text-violet-800"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Quitter</span>
        </button>

        <span className="text-xs font-extrabold tracking-widest uppercase text-violet-800 flex items-center space-x-1">
          <MessageCircle className="w-3.5 h-3.5 animate-pulse" />
          <span>Journal IA Guidé</span>
        </span>

        <div className="w-8" />
      </div>

      {/* Slide body */}
      <div className="relative z-10 flex-1 flex flex-col justify-center max-w-sm mx-auto w-full">
        
        {saved ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white border border-violet-200 p-8 rounded-[40px] text-center space-y-6 shadow-sm flex flex-col items-center"
          >
            <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-150 flex items-center justify-center text-emerald-600 shadow-xs">
              <Check className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl font-extrabold text-[#3B0764]">Pensée consignée</h3>
              <p className="text-xs text-violet-700/80 leading-relaxed px-1 font-semibold">
                Ta réflexion a été enregistrée avec succès dans ton historique d'auto-compassion. Mindy gardera une trace de ton évolution pour tes prochains bilans.
              </p>
            </div>

            <button
              onClick={onComplete}
              className="w-full py-3.5 bg-gradient-to-r from-violet-500 to-indigo-500 text-white rounded-full text-xs font-bold shadow-sm hover:brightness-105 transition cursor-pointer"
            >
              Fermer et revenir
            </button>
          </motion.div>
        ) : (
          <div className="space-y-6">
            <div className="text-center space-y-2 animate-fade-in">
              <h2 className="text-3xl font-extrabold text-purple-900 animate-fade-in">Miroir Guidé</h2>
              <p className="text-xs text-violet-750 font-bold leading-relaxed max-w-xs mx-auto">
                Des questions d'introspection rédigées par Mindy pour t'aider à clarifier tes ressentis internes
              </p>
            </div>

            {/* Mindy reflection card */}
            <div className="space-y-4 bg-white border border-violet-150 p-5 rounded-[32px] shadow-sm backdrop-blur-xl">
              
              <div className="flex items-center space-x-2 text-[10px] text-violet-800 uppercase font-black tracking-widest pb-1 border-b border-violet-100">
                <HelpCircle className="w-4 h-4 text-violet-600" />
                <span>La question introspective du jour</span>
              </div>

              <div className="py-1">
                <p className="text-xs text-purple-900 leading-relaxed font-bold italic">
                  "Si tu devais comparer ta fatigue actuelle à un élément de la nature (un océan agité, un arbre sans feuilles, un désert aride), que choisirais-tu et pourquoi ?"
                </p>
              </div>

              <div className="space-y-1">
                <textarea
                  value={response}
                  onChange={(e) => setResponse(e.target.value)}
                  rows={4}
                  placeholder="Écris librement ta réponse guidée..."
                  className="w-full bg-stone-50/50 hover:bg-stone-50/80 border border-violet-250 placeholder-violet-900/30 rounded-2xl py-3 px-4 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-violet-400/10 transition text-stone-900 focus:border-violet-300"
                />
              </div>

            </div>
          </div>
        )}
      </div>

      {/* Footer bar */}
      <div className="relative z-10 space-y-6">
        {!saved && (
          <div className="flex justify-between items-center pb-2 font-bold">
            <span className="text-[10px] text-stone-500 italic">
              Prends ton temps pour réfléchir.
            </span>

            <button
              onClick={handleSave}
              disabled={!response.trim() || loading}
              className="px-8 py-3.5 bg-gradient-to-r from-violet-505 to-violet-600 text-white rounded-full text-xs font-bold hover:brightness-105 disabled:opacity-40 disabled:pointer-events-none transition flex items-center space-x-2 shadow-sm"
            >
              <span>{loading ? "Calcul en cours..." : "Enregistrer ma réflexion"}</span>
              <Sparkles className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
