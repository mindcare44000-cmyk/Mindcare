import { useState } from "react";
import { motion } from "motion/react";
import { Sparkles, Calendar, BookOpen, ChevronRight, Activity, Smile, ArrowRight } from "lucide-react";
import { CheckInRecord, UserProfile } from "../types";

interface CheckInProps {
  setPath: (path: string) => void;
  userProfile: UserProfile;
  addCheckIn: (record: CheckInRecord) => void;
}

const MOODS = [
  { val: 1, label: "Très difficile", emoji: "😞" },
  { val: 2, label: "Fragile", emoji: "🥺" },
  { val: 3, label: "Plutôt correct", emoji: "😐" },
  { val: 4, label: "Serein", emoji: "🙂" },
  { val: 5, label: "Excellent", emoji: "✨" },
];

export default function CheckIn({ setPath, userProfile, addCheckIn }: CheckInProps) {
  const [step, setStep] = useState(1);
  const [mood, setMood] = useState<number>(3);
  const [pressure, setPressure] = useState<string>("Modérée");
  const [energy, setEnergy] = useState<string>("Modérée");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [aiResult, setAiResult] = useState("");

  const handleSubmit = async () => {
    setLoading(true);
    
    const record: CheckInRecord = {
      id: Math.random().toString(36).substring(7),
      date: new Date().toISOString().split("T")[0],
      mood,
      pressure,
      energy,
      notes: notes.trim(),
    };

    const promptText = `L'utilisateur a partagé son bilan émotionnel du jour :
- Humeur globale : ${MOODS.find((m) => m.val === mood)?.label} (${mood}/5)
- Niveau de pression / stress : ${pressure}
- Niveau d'énergie : ${energy}
- Ressenti libre : "${notes || "Aucun mot écrit"}"

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
      setAiResult(textResult);
    } catch (e) {
      console.error(e);
      record.aiSummary = "Prends une grande inspiration. Ce moment que tu t'accordes est déjà un acte magnifique d'auto-bienveillance. Écoute tes ressentis avec indulgence aujourd'hui.";
      setAiResult(record.aiSummary);
    } finally {
      addCheckIn(record);
      setLoading(false);
      setStep(5); // Switch to AI result screen
    }
  };

  return (
    <div className="flex-1 flex flex-col justify-between px-4 py-4 select-none overflow-y-auto min-h-0 w-full max-w-md mx-auto">
      
      {/* Step 1: Mood */}
      {step === 1 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1 flex flex-col justify-between">
          <div className="space-y-6 pt-4">
            <div className="flex items-center space-x-2 text-brand-medium text-xs font-semibold uppercase tracking-wider">
              <Smile className="w-4 h-4" />
              <span>Étape 1 sur 4</span>
            </div>
            
            <h2 className="font-display text-3.5xl text-neutral-dark leading-tight">
              Comment te sens-tu globalement aujourd'hui ?
            </h2>

            <div className="grid grid-cols-5 gap-2 pt-6">
              {MOODS.map((m) => (
                <button
                  key={m.val}
                  onClick={() => setMood(m.val)}
                  className={`flex flex-col items-center p-3 rounded-2xl border transition-all cursor-pointer ${
                    mood === m.val
                      ? "bg-brand-lavender/60 border-brand-light shadow-md"
                      : "bg-white border-zinc-200/50 hover:bg-zinc-50"
                  }`}
                >
                  <span className="text-3xl mb-2">{m.emoji}</span>
                  <span className="text-[9px] text-center text-zinc-500 font-medium leading-none">
                    {m.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={() => setStep(2)}
            className="w-full py-3.5 bg-brand-medium text-white font-semibold rounded-full flex items-center justify-center space-x-1 hover:bg-brand-deep transition shadow-md"
          >
            <span>Suivant</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </motion.div>
      )}

      {/* Step 2: Pressure */}
      {step === 2 && (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex-1 flex flex-col justify-between">
          <div className="space-y-6 pt-4">
            <div className="flex items-center space-x-2 text-brand-medium text-xs font-semibold uppercase tracking-wider">
              <Smile className="w-4 h-4" />
              <span>Étape 2 sur 4</span>
            </div>
            
            <h2 className="font-display text-3.5xl text-neutral-dark leading-tight">
              Quel est ton niveau de pression ressenti ?
            </h2>

            <div className="space-y-3 pt-4">
              {["Faible", "Modérée", "Élevée"].map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => setPressure(lvl)}
                  className={`w-full text-left p-4 rounded-2xl border flex justify-between items-center transition cursor-pointer font-medium ${
                    pressure === lvl
                      ? "bg-brand-lavender/65 border-brand-light text-brand-deep"
                      : "bg-white border-zinc-200 hover:bg-zinc-50"
                  }`}
                >
                  <span className="text-xs">{lvl}</span>
                  <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${pressure === lvl ? 'border-brand-medium' : 'border-zinc-350'}`}>
                    {pressure === lvl && <div className="w-2 h-2 rounded-full bg-brand-medium" />}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="flex space-x-2">
            <button
              onClick={() => setStep(1)}
              className="py-3 px-6 border border-zinc-200 rounded-full text-zinc-500 hover:bg-zinc-50 font-semibold text-xs"
            >
              Retour
            </button>
            <button
              onClick={() => setStep(3)}
              className="flex-1 py-3.5 bg-brand-medium text-white font-semibold rounded-full flex items-center justify-center space-x-1 hover:bg-brand-deep transition shadow-md"
            >
              <span>Suivant</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}

      {/* Step 3: Energy */}
      {step === 3 && (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex-1 flex flex-col justify-between">
          <div className="space-y-6 pt-4">
            <div className="flex items-center space-x-2 text-brand-medium text-xs font-semibold uppercase tracking-wider">
              <Smile className="w-4 h-4" />
              <span>Étape 3 sur 4</span>
            </div>
            
            <h2 className="font-display text-3.5xl text-neutral-dark leading-tight">
              Comment évalues-tu tes batteries physiques ?
            </h2>

            <div className="space-y-3 pt-4">
              {["Vide", "Modérée", "Pleine d'énergie"].map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => setEnergy(lvl)}
                  className={`w-full text-left p-4 rounded-2xl border flex justify-between items-center transition cursor-pointer font-medium ${
                    energy === lvl
                      ? "bg-brand-lavender/65 border-brand-light text-brand-deep"
                      : "bg-white border-zinc-200 hover:bg-zinc-50"
                  }`}
                >
                  <span className="text-xs">{lvl}</span>
                  <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${energy === lvl ? 'border-brand-medium' : 'border-zinc-350'}`}>
                    {energy === lvl && <div className="w-2 h-2 rounded-full bg-brand-medium" />}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="flex space-x-2">
            <button
              onClick={() => setStep(2)}
              className="py-3 px-6 border border-zinc-200 rounded-full text-zinc-500 hover:bg-zinc-50 font-semibold text-xs"
            >
              Retour
            </button>
            <button
              onClick={() => setStep(4)}
              className="flex-1 py-3.5 bg-brand-medium text-white font-semibold rounded-full flex items-center justify-center space-x-1 hover:bg-brand-deep transition shadow-md"
            >
              <span>Suivant</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}

      {/* Step 4: Notes and Submit */}
      {step === 4 && (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex-1 flex flex-col justify-between">
          <div className="space-y-5 pt-4">
            <div className="flex items-center space-x-2 text-brand-medium text-xs font-semibold uppercase tracking-wider">
              <Smile className="w-4 h-4" />
              <span>Étape 4 sur 4</span>
            </div>
            
            <h2 className="font-display text-3.5xl text-neutral-dark leading-tight">
              Veux-tu déposer tes ressentis par écrit ?
            </h2>
            <p className="text-zinc-500 text-xs leading-relaxed">
              Exprime librement ce que tu as sur le cœur. Ces lignes te libèrent de ta charge mentale.
            </p>

            <div className="pt-2">
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Ressentis, pensées, émotions du jour..."
                rows={5}
                className="w-full bg-zinc-100/70 border border-zinc-200/50 rounded-2xl p-4 text-xs focus:outline-none focus:border-brand-light focus:bg-white transition"
              />
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex space-x-2">
              <button
                onClick={() => setStep(3)}
                className="py-3 px-6 border border-zinc-200 rounded-full text-zinc-500 hover:bg-zinc-50 font-semibold text-xs"
              >
                Retour
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="flex-1 py-3.5 bg-brand-medium text-white font-semibold rounded-full flex items-center justify-center space-x-1 hover:bg-brand-deep transition shadow-md disabled:bg-zinc-200"
              >
                {loading ? (
                  <span className="text-xs">Chiffrement et liaison IA...</span>
                ) : (
                  <>
                    <span>Valider ma saisie</span>
                    <Sparkles className="w-4 h-4 text-brand-lavender" />
                  </>
                )}
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Step 5: Real AI Summary & Metéo du jour Screen */}
      {step === 5 && (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex-1 flex flex-col justify-between py-2">
          <div className="space-y-6 pt-4 px-1 text-center">
            
            <div className="w-16 h-16 rounded-[22px] bg-emerald-50 text-brand-green border border-emerald-100/80 mx-auto flex items-center justify-center shadow-sm">
              <Activity className="w-7 h-7" />
            </div>

            <div className="space-y-2">
              <h3 className="font-display text-3xl text-neutral-dark">
                Bilan complété !
              </h3>
              <p className="text-zinc-400 text-[10px] tracking-wider uppercase font-semibold flex items-center justify-center space-x-1">
                <Calendar className="w-3.5 h-3.5 mr-1" />
                Aujourd'hui
              </p>
            </div>

            {/* AI synthesis card */}
            <div className="bg-gradient-to-br from-brand-lavender/55 to-emerald-50/40 rounded-3xl p-5 border border-brand-light/15 text-left space-y-4">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-brand-medium" />
                <span className="text-xs font-bold text-brand-deep">La météo de Mindy</span>
              </div>
              <p className="text-xs leading-relaxed text-zinc-700 italic">
                "{aiResult}"
              </p>
            </div>

            {/* Direct Recommendation Quick Launcher */}
            <div 
              onClick={() => setPath("exercices")}
              className="bg-zinc-50 border border-zinc-200 p-4 rounded-2xl flex items-center justify-between text-left cursor-pointer hover:shadow-md transition"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-violet-100 flex items-center justify-center text-brand-medium shrink-0">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div className="space-y-0.5">
                  <h4 className="text-[11px] font-bold text-neutral-dark">Prêt pour une activité ?</h4>
                  <p className="text-[9px] text-zinc-400">Découvre ta recommandation sur-mesure.</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-zinc-400" />
            </div>

          </div>

          <div className="px-1">
            <button
              onClick={() => setPath("dashboard")}
              className="w-full py-3.5 bg-brand-medium text-white font-semibold rounded-full hover:bg-brand-deep transition text-xs shadow-md"
            >
              Accéder à l'Accueil
            </button>
          </div>
        </motion.div>
      )}

    </div>
  );
}
