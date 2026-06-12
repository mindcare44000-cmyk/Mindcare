import React, { useState } from "react";
import { motion } from "motion/react";
import { ChevronLeft, Sparkles, CheckCircle, Heart, Star } from "lucide-react";
import { BaseExerciseProps } from "./BaseExerciseProps";

export const GratitudeExercise: React.FC<BaseExerciseProps> = ({
  onComplete,
  onCancel,
}) => {
  const [inputs, setInputs] = useState(["", "", ""]);
  const [gratSaved, setGratSaved] = useState(false);

  const handleInputChange = (idx: number, val: string) => {
    const list = [...inputs];
    list[idx] = val;
    setInputs(list);
  };

  const isFormValid = inputs[0].trim() !== "";

  const handleSave = () => {
    if (!isFormValid) return;
    setGratSaved(true);
  };

  return (
    <div className="absolute inset-0 bg-[#FFFBEB] text-amber-950 flex flex-col justify-between p-6 select-none overflow-hidden font-sans">
      
      {/* Background soft ambient halos */}
      <div className="absolute top-[-30%] left-[-20%] w-[140%] h-[140%] pointer-events-none opacity-50">
        <div className="absolute top-[20%] left-[30%] w-96 h-96 rounded-full bg-white blur-[130px]" />
        <div className="absolute bottom-[20%] right-[20%] w-80 h-80 rounded-full bg-amber-100/40 blur-[110px]" />
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

        <span className="text-xs font-extrabold tracking-widest uppercase text-amber-805">
          Les 3 Gratitudes
        </span>

        <div className="w-8" />
      </div>

      {/* Main space */}
      <div className="relative z-10 flex-1 flex flex-col justify-center max-w-sm mx-auto w-full">
        
        {gratSaved ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="bg-white border border-amber-200 p-8 rounded-[40px] text-center space-y-6 shadow-sm flex flex-col items-center"
          >
            <div className="w-16 h-16 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
              <CheckCircle className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl font-extrabold text-amber-900 animate-fade-in">Ressenti Sauvegardé !</h3>
              <p className="text-xs text-amber-700/80 leading-relaxed px-2 font-semibold">
                Prendre conscience des instants chaleureux entraine la chimie de ton cerveau vers le bonheur durable.
              </p>
            </div>

            {/* Structured review of entered moments */}
            <div className="w-full space-y-2 text-left bg-stone-50/80 p-4 rounded-2xl border border-amber-100 shadow-xs">
              <span className="text-[9px] uppercase tracking-widest font-extrabold text-amber-800">Vos précieux rayons de soleil :</span>
              {inputs.map((m, idx) => (
                m.trim() && (
                  <div key={idx} className="flex items-start space-x-1.5 text-xs text-stone-700 font-semibold">
                    <span className="text-amber-555 mt-0.5">⭐</span>
                    <p className="leading-tight">{m}</p>
                  </div>
                )
              ))}
            </div>

            <button
              onClick={onComplete}
              className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-full text-xs font-bold shadow-sm hover:brightness-105 transition cursor-pointer"
            >
              D'accord, retour au catalogue
            </button>
          </motion.div>
        ) : (
          <div className="space-y-6">
            <div className="text-center space-y-2 animate-fade-in">
              <h2 className="text-3xl font-extrabold text-amber-900">Foyer de Gratitude</h2>
              <p className="text-xs text-amber-700/80 leading-relaxed max-w-xs mx-auto font-semibold">
                Oriente intentionnellement ton regard sur trois moments positifs récents de ton quotidien pour réchauffer ton humeur
              </p>
            </div>

            {/* Inputs Group */}
            <div className="space-y-3.5 bg-white border border-amber-150 p-5 rounded-[32px] shadow-sm backdrop-blur-xl">
              
              <div className="flex items-center space-x-2 text-[10px] text-amber-800 uppercase font-black tracking-widest pb-1 border-b border-amber-100 mb-2">
                <Star className="w-4 h-4 text-amber-500" />
                <span>Mes trois bonheurs du jour</span>
              </div>

              {/* Input 1 */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-[9px] text-stone-500 font-bold px-1">
                  <span>Moment 1 (Essentiel)</span>
                  <span className="text-amber-600 font-extrabold">Requis</span>
                </div>
                <input
                  type="text"
                  value={inputs[0]}
                  onChange={(e) => handleInputChange(0, e.target.value)}
                  placeholder="Ex: Le sourire réconfortant partagé, un café bien chaud..."
                  className="w-full bg-stone-50/50 hover:bg-stone-50/80 border border-amber-200 focus:border-amber-400 placeholder-amber-900/40 rounded-2xl py-3 px-4 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-amber-400/10 transition text-stone-850"
                />
              </div>

              {/* Input 2 */}
              <div className="space-y-1.5">
                <span className="text-[9px] text-stone-500 font-bold px-1">Moment 2 (Optionnel)</span>
                <input
                  type="text"
                  value={inputs[1]}
                  onChange={(e) => handleInputChange(1, e.target.value)}
                  placeholder="Ex: Une mélodie agréable entendue à la radio..."
                  className="w-full bg-stone-50/50 hover:bg-stone-50/80 border border-amber-200 focus:border-amber-400 placeholder-amber-900/40 rounded-2xl py-3 px-4 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-amber-400/10 transition text-stone-850"
                />
              </div>

              {/* Input 3 */}
              <div className="space-y-1.5">
                <span className="text-[9px] text-stone-500 font-bold px-1">Moment 3 (Optionnel)</span>
                <input
                  type="text"
                  value={inputs[2]}
                  onChange={(e) => handleInputChange(2, e.target.value)}
                  placeholder="Ex: Avoir pris 5 minutes de paix pour mon esprit..."
                  className="w-full bg-stone-50/50 hover:bg-stone-50/80 border border-amber-200 focus:border-amber-400 placeholder-amber-900/40 rounded-2xl py-3 px-4 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-amber-400/10 transition text-stone-850"
                />
              </div>

            </div>
          </div>
        )}
      </div>

      {/* Footer operations */}
      <div className="relative z-10 space-y-6">
        {!gratSaved && (
          <div className="flex justify-between items-center pb-2">
            <span className="text-[10px] text-stone-600 font-semibold italic flex items-center space-x-1">
              <Heart className="w-3.5 h-3.5 text-amber-500" />
              <span>Chaque détail compte</span>
            </span>

            <button
              onClick={handleSave}
              disabled={!isFormValid}
              className="px-7 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-full text-xs font-bold hover:brightness-105 disabled:opacity-40 disabled:pointer-events-none transition flex items-center space-x-1.5 shadow-sm"
            >
              <Sparkles className="w-4 h-4" />
              <span>Garder en mémoire</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
