import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronLeft, Lock, Sparkles, Feather, ShieldCheck } from "lucide-react";
import { BaseExerciseProps } from "./BaseExerciseProps";

export const JournalSosExercise: React.FC<BaseExerciseProps> = ({
  onComplete,
  onCancel,
}) => {
  const [text, setText] = useState("");
  const [isEncrypted, setIsEncrypted] = useState(false);

  const handleEncryptFinish = () => {
    if (!text.trim()) return;
    setIsEncrypted(true);
  };

  return (
    <div className="absolute inset-0 bg-[#F5F3FF] text-violet-950 flex flex-col justify-between p-6 select-none overflow-hidden font-sans">
      
      {/* Background glow flares */}
      <div className="absolute top-[-25%] right-[-15%] w-[130%] h-[130%] pointer-events-none opacity-50">
        <div className="absolute top-[20%] right-[25%] w-96 h-96 rounded-full bg-white blur-[130px]" />
        <div className="absolute bottom-[20%] left-[30%] w-80 h-80 rounded-full bg-violet-100/40 blur-[100px]" />
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
          <Lock className="w-3.5 h-3.5" />
          <span>Journal SOS</span>
        </span>

        <span className="text-[10px] text-emerald-700 font-extrabold bg-emerald-50 border border-emerald-155 px-2.5 py-1 rounded-full uppercase tracking-widest flex items-center space-x-1 shadow-xs">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Privé</span>
        </span>
      </div>

      {/* Writing board */}
      <div className="relative z-10 flex-1 flex flex-col justify-center max-w-sm mx-auto w-full">
        
        <AnimatePresence mode="wait">
          {isEncrypted ? (
            <motion.div
              key="encrypted-state"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="bg-white border border-violet-200 p-8 rounded-[40px] text-center space-y-6 shadow-sm flex flex-col items-center"
            >
              <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-250 flex items-center justify-center text-emerald-600 shadow-xs">
                <Lock className="w-8 h-8" />
              </div>

              <div className="space-y-2">
                <h3 className="text-2xl font-extrabold text-violet-900">Écrits encryptés en local</h3>
                <p className="text-xs text-violet-750 font-semibold leading-relaxed px-1">
                  Tes mots ont été déposés en toute sécurité. Ils quittent maintenant ta charge mentale active. Rien de ce que tu écris n'est envoyé ou stocké sur un serveur.
                </p>
              </div>

              {/* Encrypted abstract hashes effect to represent safety */}
              <div className="w-full bg-stone-50/75 p-4 rounded-2xl border border-violet-150 font-mono text-[9px] text-stone-500 break-words leading-tight tracking-wider opacity-80">
                AES_256_LOCAL_SALT::{(Date.now() * 77).toString(16)}::F119C::CYPHER_LOCKED
              </div>

              <button
                onClick={onComplete}
                className="w-full py-3.5 bg-gradient-to-r from-violet-500 to-violet-600 text-white rounded-full text-xs font-bold shadow-sm hover:brightness-105 transition"
              >
                D'accord, fermer l'espace
              </button>
            </motion.div>
          ) : (
            <div className="space-y-6 flex-1 flex flex-col justify-center py-2">
              <div className="text-center space-y-2 animate-fade-in">
                <h2 className="text-3xl font-extrabold text-violet-900">Journal d'expression libre</h2>
                <p className="text-xs text-violet-700/80 max-w-xs mx-auto font-medium">
                  Mots en vrac, douleurs, colères secrètes : ici, pas de règles. Écris simplement pour libérer la charge sans être jugé.
                </p>
              </div>

              {/* Paper Slate */}
              <div className="flex-1 min-h-[220px] bg-white border border-violet-150 p-4 rounded-[32px] shadow-sm backdrop-blur-xl flex flex-col justify-between">
                
                <div className="flex justify-between items-center text-[10px] uppercase font-extrabold text-violet-800 tracking-wider pb-2 border-b border-violet-100">
                  <span className="flex items-center space-x-1.5 font-black">
                    <Feather className="w-4 h-4 text-violet-600" />
                    <span>Page blanche secrète</span>
                  </span>
                  <span className="text-stone-500 font-bold">{text.length} caractères</span>
                </div>

                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Écris librement tout ce qui t'encombre l'esprit en ce moment même..."
                  className="flex-1 bg-transparent text-stone-850 placeholder-violet-900/30 py-3.5 resize-none text-xs focus:outline-none focus:ring-0 leading-relaxed font-semibold font-sans focus:border-transparent"
                />

                <p className="text-[9px] text-stone-500 leading-snug italic pt-2 border-t border-violet-100 font-medium">
                  "Tes écrits restent stockés de manière cryptée et confidentielle uniquement sur ton appareil."
                </p>
              </div>
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer operations */}
      <div className="relative z-10 space-y-6">
        {!isEncrypted && (
          <div className="flex justify-between items-center pb-2 font-semibold">
            <span className="text-[10px] text-stone-500 italic max-w-2xs leading-snug">
              Écris au moins un mot pour pouvoir chiffrer la page.
            </span>

            <button
              onClick={handleEncryptFinish}
              disabled={!text.trim()}
              className="px-8 py-3.5 bg-gradient-to-r from-violet-500 to-violet-600 text-white rounded-full text-xs font-bold hover:brightness-105 disabled:opacity-40 disabled:pointer-events-none transition flex items-center space-x-2 shadow-sm"
            >
              <span>Chiffrer et vider la charge</span>
              <Sparkles className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
