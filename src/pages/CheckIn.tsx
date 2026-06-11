import React, { useState, FormEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Smile, X, ChevronLeft, ArrowRight, Check, Plus, Sparkles } from "lucide-react";
import { CheckInRecord, UserProfile } from "../types";

interface CheckInProps {
  setPath: (path: string) => void;
  userProfile: UserProfile;
  addCheckIn: (record: CheckInRecord) => void;
}

const MOODS = [
  { val: 5, label: "Super", emoji: "😄" },
  { val: 4, label: "Bien", emoji: "🙂" },
  { val: 3, label: "Moyen", emoji: "😐" },
  { val: 2, label: "Pas top", emoji: "😔" },
  { val: 1, label: "Mal", emoji: "😞" },
];

const DEFAULT_TAGS = [
  "Serein",
  "Stressé",
  "Fatigué",
  "Motivé",
  "Anxieux",
  "Triste",
  "Bien dans ma peau",
  "Submergé"
];

export default function CheckIn({ setPath, userProfile, addCheckIn }: CheckInProps) {
  const [step, setStep] = useState(1);
  const [mood, setMood] = useState<number | null>(null);
  
  // Continuous sliders values mapped from 0 to 100
  const [pressureVal, setPressureVal] = useState(50);
  const [energyVal, setEnergyVal] = useState(50);

  // Tags for Question 4
  const [allTags, setAllTags] = useState([
    "Serein",
    "Stressé",
    "Fatigué",
    "Motivé",
    "Anxieux",
    "Triste",
    "Bien dans ma peau",
    "Submergé"
  ]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isCreatingTag, setIsCreatingTag] = useState(false);
  const [customTagVal, setCustomTagVal] = useState("");

  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Mapping continuous slider values to the required database string keys
  const getPressureLabel = (val: number) => {
    if (val <= 33) return "Faible";
    if (val <= 66) return "Modérée";
    return "Élevée";
  };

  const getPressureEmojiLabel = (val: number) => {
    if (val <= 33) return "😌 Faible";
    if (val <= 66) return "😐 Modérée";
    return "😤 Élevée / Intense";
  };

  const getEnergyLabel = (val: number) => {
    if (val <= 33) return "Vide";
    if (val <= 66) return "Modérée";
    return "Pleine";
  };

  const getEnergyEmojiLabel = (val: number) => {
    if (val <= 33) return "🥱 Épuisé";
    if (val <= 66) return "⚡️ Modéré";
    return "🚀 Plein d'énergie";
  };

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleCreateTagSubmit = (e: FormEvent) => {
    e.preventDefault();
    const clean = customTagVal.trim();
    if (clean) {
      if (!allTags.includes(clean)) {
        setAllTags([...allTags, clean]);
      }
      if (!selectedTags.includes(clean)) {
        setSelectedTags([...selectedTags, clean]);
      }
      setCustomTagVal("");
      setIsCreatingTag(false);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);

    const pressureString = getPressureLabel(pressureVal);
    const energyString = getEnergyLabel(energyVal);
    const finalNotes = selectedTags.length > 0 
      ? selectedTags.join(", ") 
      : "Sensation neutre";

    const record: CheckInRecord = {
      id: Math.random().toString(36).substring(7),
      date: new Date().toISOString().split("T")[0],
      mood: mood || 3,
      pressure: pressureString,
      energy: energyString,
      notes: finalNotes,
    };

    // Prompt for Gemini companion
    const promptText = `L'utilisateur a partagé son bilan émotionnel du jour :
- Humeur globale : ${MOODS.find((m) => m.val === mood)?.label} (${mood}/5)
- Niveau de pression / stress : ${pressureString} (Slider: ${pressureVal}/100)
- Niveau d'énergie : ${energyString} (Slider: ${energyVal}/100)
- Ressenti libre (étiquettes choisies) : "${finalNotes}"

Rédige un court message (maximum 3 phrases en français), extrêmement bienveillant, doux et apaisant. Ne pose AUCUN diagnostic, ne propose aucun traitement, et n'utilise pas de jargon clinique. Invite à souffler et propose un conseil simple ou une activité appropriée pour l'accompagner avec tact.`;

    const systemInstruction = 
      "Tu es Mindy, le compagnon IA de MindCare. Tu es une voix douce de soutien, calme et rassurante. Tu n'utilises aucun terme clinique lourd (pas de diagnostic, pas de trouble détecté). Tu t'adresses d'égal à égal avec l'utilisateur en le tutoyant sincèrement en français, dans un style zen, très concis.";

    try {
      const res = await fetch("/api/gemini/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: promptText, systemInstruction }),
      });
      const data = await res.json();
      const textResult = data?.text || "Prends une grande inspiration. Ce moment que tu t'accordes est déjà un acte magnifique d'auto-bienveillance. Écoute tes ressentis avec indulgence aujourd'hui.";
      record.aiSummary = textResult;
    } catch (e) {
      console.error(e);
      record.aiSummary = "Prends une grande inspiration. Ce moment que tu t'accordes est déjà un acte magnifique d'auto-bienveillance. Écoute tes ressentis avec indulgence aujourd'hui.";
    } finally {
      addCheckIn(record);
      setLoading(false);
      setShowSuccess(true);
      
      // Keep tick animation visual for 1.8 seconds, then trigger return to home (dashboard)
      setTimeout(() => {
        setPath("dashboard");
      }, 1900);
    }
  };

  return (
    <div className="absolute inset-0 bg-[#F7F6F3] text-zinc-800 flex flex-col p-4 select-none overflow-y-auto overflow-x-hidden font-sans" id="checkin-panel-root">
      
      {/* CSS overrides for the custom range sliders */}
      <style>{`
        input[type=range]::-webkit-slider-thumb {
          -webkit-appearance: none;
          height: 18px;
          width: 18px;
          border-radius: 50%;
          background: #7C6FF7;
          cursor: pointer;
          border: 3px solid #ffffff;
          box-shadow: 0 2px 6px rgba(124, 111, 247, 0.4);
          transition: transform 0.1s ease;
        }
        input[type=range]::-webkit-slider-thumb:active {
          transform: scale(1.2);
        }
        input[type=range]::-moz-range-thumb {
          height: 18px;
          width: 18px;
          border-radius: 50%;
          background: #7C6FF7;
          cursor: pointer;
          border: 3px solid #ffffff;
          box-shadow: 0 2px 6px rgba(124, 111, 247, 0.4);
          transition: transform 0.1s ease;
        }
        input[type=range]::-moz-range-thumb:active {
          transform: scale(1.2);
        }
      `}</style>

      {/* Top Header Row with dynamic steps count and escape button */}
      <div className="flex justify-between items-center py-2 px-1 relative shrink-0">
        <div className="w-8" /> {/* Balance layout spacing */}
        
        {/* Centers current question indication */}
        <span className="text-[10px] uppercase font-black tracking-widest text-zinc-400 select-none">
          Question {step} / 4
        </span>

        {/* Closing cross */}
        <button
          onClick={() => setPath("dashboard")}
          className="w-8 h-8 rounded-full hover:bg-zinc-200/50 flex items-center justify-center text-zinc-450 hover:text-zinc-700 transition cursor-pointer border-0 bg-transparent"
          id="exit-checkin-cross"
        >
          <X className="w-5 h-5 stroke-[2.5]" />
        </button>
      </div>

      {/* Progress Bar (25% -> 50% -> 75% -> 100%) */}
      <div className="w-full h-1.5 bg-zinc-200/60 rounded-full overflow-hidden mt-1 mb-5 shrink-0">
        <div
          className="h-full bg-[#7C6FF7] rounded-full transition-all duration-400 ease-in-out"
          style={{ width: `${step * 25}%` }}
        />
      </div>

      {/* Main Form container holding White visual Cards */}
      <div className="flex-1 flex flex-col justify-between max-w-sm mx-auto w-full pb-4">
        
        {/* Animated Question block transition wrapper */}
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.28, ease: "easeInOut" }}
            className="flex-1 flex flex-col justify-between min-h-[350px] relative overflow-hidden py-4 px-2"
          >
            {/* Slide Q1: Mood select */}
            {step === 1 && (
              <div className="flex flex-col flex-1 justify-between py-1" id="q1-mood-layout">
                <div className="space-y-1.5 text-center sm:text-left">
                  <h3 className="text-xl font-black text-zinc-900 tracking-tight leading-tight">
                    Comment est ton humeur aujourd'hui ?
                  </h3>
                  <p className="text-[11px] text-zinc-450 font-bold uppercase tracking-wider">
                    Choisis ce qui te correspond le mieux
                  </p>
                </div>

                {/* Horizontal grid with 5 columns for emojis */}
                <div className="grid grid-cols-5 gap-1.5 my-auto py-4">
                  {MOODS.map((m) => {
                    const isSelected = mood === m.val;
                    return (
                      <motion.button
                        key={m.val}
                        onClick={() => setMood(m.val)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 1.15 }}
                        className={`py-3 px-1 rounded-2xl border transition-all duration-200 cursor-pointer flex flex-col items-center justify-center relative ${
                          isSelected
                            ? "bg-[#EDE9FE] border-[#7C6FF7] text-[#5B4FD4] shadow-xs"
                            : "bg-zinc-50 border-transparent hover:bg-zinc-150/30 text-zinc-700 font-sans"
                        }`}
                      >
                        <span className="text-2.5xl select-none mb-1">{m.emoji}</span>
                        <span className="text-[10px] font-extrabold tracking-tight text-center leading-snug">
                          {m.label}
                        </span>
                      </motion.button>
                    );
                  })}
                </div>

                {/* Helper info text */}
                <div className="text-[10px] text-zinc-400 text-center leading-relaxed">
                  Ton choix influencera la météo de ton calendrier personnel.
                </div>
              </div>
            )}

            {/* Slide Q2: Pressure level */}
            {step === 2 && (
              <div className="flex flex-col flex-1 justify-between py-1" id="q2-pressure-layout">
                <div className="space-y-1.5 text-center sm:text-left">
                  <h3 className="text-xl font-black text-zinc-900 tracking-tight leading-tight">
                    Quel est ton niveau de pression aujourd'hui ?
                  </h3>
                  <p className="text-[11px] text-zinc-450 font-bold uppercase tracking-wider">
                    Glisse pour ajuster
                  </p>
                </div>

                {/* Customized slider interface with real-time numeric display */}
                <div className="my-auto py-6 space-y-6">
                  <div className="relative pt-6 pb-2 px-1">
                    {/* Floating premium bubble tracker above slider thumb */}
                    <div
                      className="absolute top-0 bg-[#7C6FF7] text-white text-[10px] px-2.5 py-1 rounded-full font-black shadow-sm whitespace-nowrap transition-all duration-75 -translate-x-1/2 flex items-center space-x-1"
                      style={{ left: `${pressureVal}%` }}
                    >
                      <span>{getPressureEmojiLabel(pressureVal)}</span>
                      <span className="text-[8.5px] opacity-75">({pressureVal}%)</span>
                      <div className="absolute top-full left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-[#7C6FF7] rotate-45 -mt-0.5" />
                    </div>

                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={pressureVal}
                      onChange={(e) => setPressureVal(Number(e.target.value))}
                      className="w-full h-2 rounded-full appearance-none cursor-pointer outline-none transition-all duration-150"
                      style={{
                        background: "linear-gradient(to right, #EDE9FE, #5B4FD4)",
                      }}
                    />
                  </div>

                  {/* Range Boundaries Labels */}
                  <div className="flex justify-between items-center text-[10px] font-black text-zinc-400 uppercase tracking-widest px-0.5 mt-1 select-none">
                    <span>😌 Aucune</span>
                    <span>Intense 😤</span>
                  </div>
                </div>

                <div className="text-[10px] text-zinc-400 text-center leading-relaxed">
                  Aide Mindy à déceler d'éventuels moments de tension d'un simple geste.
                </div>
              </div>
            )}

            {/* Slide Q3: Energy level */}
            {step === 3 && (
              <div className="flex flex-col flex-1 justify-between py-1" id="q3-energy-layout">
                <div className="space-y-1.5 text-center sm:text-left">
                  <h3 className="text-xl font-black text-zinc-900 tracking-tight leading-tight">
                    Quel est ton niveau d'énergie ?
                  </h3>
                  <p className="text-[11px] text-zinc-450 font-bold uppercase tracking-wider">
                    Glisse pour ajuster
                  </p>
                </div>

                {/* Customized slider interface with reversed linear gradient */}
                <div className="my-auto py-6 space-y-6">
                  <div className="relative pt-6 pb-2 px-1">
                    {/* Floating premium bubble tracker above slider thumb */}
                    <div
                      className="absolute top-0 bg-[#7C6FF7] text-white text-[10px] px-2.5 py-1 rounded-full font-black shadow-sm whitespace-nowrap transition-all duration-75 -translate-x-1/2 flex items-center space-x-1"
                      style={{ left: `${energyVal}%` }}
                    >
                      <span>{getEnergyEmojiLabel(energyVal)}</span>
                      <span className="text-[8.5px] opacity-75">({energyVal}%)</span>
                      <div className="absolute top-full left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-[#7C6FF7] rotate-45 -mt-0.5" />
                    </div>

                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={energyVal}
                      onChange={(e) => setEnergyVal(Number(e.target.value))}
                      className="w-full h-2 rounded-full appearance-none cursor-pointer outline-none transition-all duration-150"
                      style={{
                        background: "linear-gradient(to right, #5B4FD4, #EDE9FE)",
                      }}
                    />
                  </div>

                  {/* Range Boundaries Labels (Reversed colors meaning mapped logic) */}
                  <div className="flex justify-between items-center text-[10px] font-black text-zinc-400 uppercase tracking-widest px-0.5 mt-1 select-none">
                    <span>🥱 Épuisé</span>
                    <span>Plein d'énergie 🚀</span>
                  </div>
                </div>

                <div className="text-[10px] text-zinc-400 text-center leading-relaxed">
                  Suis la fatigue journalière pour équilibrer tes séances recommandées.
                </div>
              </div>
            )}

            {/* Slide Q4: Sensation text and Tags select */}
            {step === 4 && (
              <div className="flex flex-col flex-1 justify-between py-1" id="q4-ressenti-layout">
                <div className="space-y-1.5 text-center sm:text-left">
                  <h3 className="text-xl font-black text-zinc-900 tracking-tight leading-tight">
                    Comment tu te sens globalement ?
                  </h3>
                  <p className="text-[11px] text-zinc-450 font-bold uppercase tracking-wider">
                    Choisis un ou plusieurs mots
                  </p>
                </div>

                {/* Rich interactive tags grid */}
                <div className="my-auto py-3">
                  <div className="flex flex-wrap gap-2 justify-center py-2 max-h-[170px] overflow-y-auto overflow-x-hidden pr-1">
                    {allTags.map((t) => {
                      const isSelected = selectedTags.includes(t);
                      const isCustom = !DEFAULT_TAGS.includes(t);
                      return (
                        <motion.button
                          key={t}
                          onClick={() => toggleTag(t)}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className={`py-2 pl-3.5 pr-2.5 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer border-0 flex items-center space-x-1.5 shadow-3xs group ${
                            isSelected
                              ? "bg-[#7C6FF7] text-white"
                              : "bg-zinc-100/70 hover:bg-zinc-150/80 text-zinc-700"
                          }`}
                          style={{ paddingRight: isCustom ? "8px" : undefined }}
                        >
                          <div className="flex items-center space-x-1">
                            {isSelected && <span className="text-[10px]">✓</span>}
                            <span>{t}</span>
                          </div>
                          {isCustom && (
                            <span
                              onClick={(e) => {
                                e.stopPropagation();
                                setAllTags(allTags.filter((tag) => tag !== t));
                                setSelectedTags(selectedTags.filter((tag) => tag !== t));
                              }}
                              className={`p-0.5 rounded-full flex items-center justify-center transition-colors ${
                                isSelected
                                  ? "hover:bg-white/25 text-white/80 hover:text-white"
                                  : "hover:bg-zinc-200 text-zinc-400 hover:text-zinc-650"
                              }`}
                              title="Supprimer ce tag"
                            >
                              <X className="w-3 h-3 stroke-[2.5]" />
                            </span>
                          )}
                        </motion.button>
                      );
                    })}
                  </div>

                  {/* Custom tag addition form inside the card boundaries */}
                  <AnimatePresence mode="wait">
                    {isCreatingTag ? (
                      <motion.form
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        onSubmit={handleCreateTagSubmit}
                        className="flex items-center space-x-2 mt-3.5 p-1 bg-zinc-50 border border-zinc-200/40 rounded-xl"
                      >
                        <input
                          type="text"
                          placeholder="Ex: Passionné..."
                          value={customTagVal}
                          onChange={(e) => setCustomTagVal(e.target.value)}
                          maxLength={18}
                          className="flex-1 bg-white border-0 rounded-lg px-2.5 py-1.5 text-xs text-zinc-800 focus:outline-none"
                          autoFocus
                        />
                        <button
                          type="submit"
                          className="px-3.5 py-1.5 bg-[#7C6FF7] text-white text-xs font-mono font-black rounded-lg cursor-pointer hover:bg-[#6A5DE6] transition border-0"
                        >
                          OK
                        </button>
                        <button
                          type="button"
                          onClick={() => setIsCreatingTag(false)}
                          className="p-1.5 text-zinc-400 hover:text-zinc-600 cursor-pointer border-0 bg-transparent flex items-center"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </motion.form>
                    ) : (
                      <div className="flex justify-center mt-3">
                        <motion.button
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setIsCreatingTag(true)}
                          className="py-2 px-4.5 bg-black hover:bg-zinc-900 text-white rounded-full text-[10px] font-black uppercase tracking-wider flex items-center space-x-1.5 cursor-pointer shadow-2xs border-0 mt-1"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Créer un tag</span>
                        </motion.button>
                      </div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="text-[10px] text-zinc-400 text-center leading-relaxed">
                  Associe tes mots pour composer une formule vibratoire unique.
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Dynamic Navigation button controls block */}
        <div className="flex flex-col items-center mt-5 w-full space-y-3 shrink-0 px-1">
          <div className="flex items-center space-x-3 w-full">
            
            {/* Standard Back button */}
            {step > 1 && (
              <button
                onClick={() => setStep(step - 1)}
                className="w-12 h-12 bg-white hover:bg-zinc-50 border border-zinc-200/50 rounded-2xl flex items-center justify-center text-zinc-650 transition active:scale-95 cursor-pointer"
                title="Retour en arrière"
                id="checkin-back-arrow"
              >
                <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
              </button>
            )}

            {/* Principal validation/continuation button */}
            <button
              onClick={() => {
                if (step < 4) {
                  setStep(step + 1);
                } else {
                  handleSubmit();
                }
              }}
              disabled={loading || (step === 1 && mood === null)}
              className={`flex-1 py-3.5 font-bold text-xs rounded-2xl transition-all duration-300 shadow-sm flex items-center justify-center space-x-2 border-0 cursor-pointer ${
                step === 1 && mood === null
                  ? "bg-zinc-200 text-zinc-450 cursor-not-allowed"
                  : "bg-[#7C6FF7] hover:bg-[#6A5DE6] text-white active:scale-98"
              }`}
              id="checkin-btn-submit"
            >
              {loading ? (
                <div className="flex items-center space-x-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Traitement bienveillant...</span>
                </div>
              ) : (
                <>
                  <span>{step === 4 ? "Valider" : "Suivant"}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>

          {/* Skip layout link ("Passer") */}
          <button
            onClick={() => {
              if (step < 4) {
                setStep(step + 1);
              } else {
                handleSubmit();
              }
            }}
            className="text-[11px] font-black lowercase tracking-widest text-zinc-400 hover:text-[#7C6FF7] transition-all duration-200 underline cursor-pointer bg-transparent border-0 py-1"
          >
            Passer
          </button>
        </div>
      </div>

      {/* Floating full confirmation view on validation with animated checkmark */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 bg-[#F7F6F3] flex flex-col items-center justify-center z-50 text-center px-6"
            id="checkin-success-wrapper"
          >
            <div className="bg-white rounded-[36px] p-8 shadow-md border border-zinc-150/10 flex flex-col items-center max-w-sm w-full mx-auto space-y-5">
              
              {/* Green ticking circle anchor */}
              <motion.div
                initial={{ scale: 0.6, rotate: -20, opacity: 0 }}
                animate={{ scale: [0.6, 1.15, 1], rotate: 0, opacity: 1 }}
                transition={{ duration: 0.58, ease: "easeOut" }}
                className="w-20 h-20 rounded-full bg-emerald-500 flex items-center justify-center shadow-[0_8px_30px_rgba(16,185,129,0.35)] text-white"
              >
                <Check className="w-10 h-10 stroke-[4px]" />
              </motion.div>

              <div className="space-y-1.5">
                <h3 className="text-xl font-black text-zinc-900 tracking-tight leading-none">
                  Check-in enregistré !
                </h3>
                <p className="text-[10px] text-emerald-600 font-extrabold uppercase tracking-widest">
                  Parfaitement Synchronisé ✓
                </p>
              </div>

              <p className="text-xs text-zinc-500 leading-relaxed max-w-[250px] mx-auto select-none pt-1">
                La météo de Mindy a reçu tes impressions avec douceur. Prends soin de toi ! 💚
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
