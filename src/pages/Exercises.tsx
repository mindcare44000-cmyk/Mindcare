import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Compass, Heart, Wind, Feather, PenTool, BookOpen, 
  HelpCircle, Sparkles, Star, ChevronLeft, Volume2, 
  Trash2, ShieldAlert, CheckCircle2, PhoneCall 
} from "lucide-react";
import { Exercise, UserProfile } from "../types";

interface ExercisesProps {
  currentPath: string;
  setPath: (path: string) => void;
  userProfile: UserProfile;
}

const EXERCISES: Exercise[] = [
  { id: "coherence-cardiaque", title: "Cohérence Cardiaque", duration: "3 min", description: "Basse de respiration 5s / 5s pour calmer le rythme cardiaque et chasser l'anxiété.", category: "Respiration", difficulty: "Facile", path: "exercices/coherence-cardiaque" },
  { id: "respiration-carree", title: "Respiration Carrée", duration: "4 min", description: "Cycle en 4 temps suspendus pour canaliser l'attention et libérer le flot de pensées.", category: "Respiration", difficulty: "Facile", path: "exercices/respiration-carree" },
  { id: "ancrage-sensoriel", title: "Ancrage Sensoriel", duration: "5 min", description: "Guide sensoriel 5-4-3-2-1 pour sortir rapidement d'une rumination mentale.", category: "Ancrage", difficulty: "Facile", path: "exercices/ancrage-sensoriel" },
  { id: "scan-corporel", title: "Scan Corporel", duration: "5 min", description: "Parcours mental progressif des pieds à la tête pour relâcher les tensions physiques accumulées.", category: "Corps", difficulty: "Intermédiaire", path: "exercices/scan-corporel" },
  { id: "stretch", title: "Stretch & Soupir", duration: "2 min", description: "Mouvements physiques doux illustrés pour débloquer le diaphragme sous l'effet du stress.", category: "Corps", difficulty: "Facile", path: "exercices/stretch" },
  { id: "affirmations", title: "Affirmations Positives", duration: "2 min", description: "Oracle de bienveillance et de renforcement de l'estime de soi.", category: "Visualisation", difficulty: "Facile", path: "exercices/affirmations" },
  { id: "meditation-nuages", title: "Méditation des Nuages", duration: "3 min", description: "Souffle tes pensées envahissantes et regarde-les s'éloigner au gré du vent.", category: "Visualisation", difficulty: "Facile", path: "exercices/meditation-nuages" },
  { id: "gratitude", title: "3 Gratitudes du Jour", duration: "3 min", description: "Met en lumière trois éléments agréables de la journée pour orienter l'esprit vers le positif.", category: "Écriture", difficulty: "Facile", path: "exercices/gratitude" },
  { id: "journal-sos", title: "Journal Intime SOS", duration: "Libre", description: "Une zone confidentielle sans contrainte ni format pour coucher ses mots sur écran.", category: "Écriture", difficulty: "Facile", path: "exercices/journal-sos" },
  { id: "journal-ia", title: "Journal IA Guidé", duration: "5 min", description: "Réponds aux questions personnalisées formulées par Mindy pour clarifier tes émotions.", category: "Écriture", difficulty: "Intermédiaire", path: "exercices/journal-ia" },
  { id: "stop-sos", title: "STABILISATION STOP S.O.S", duration: "Urgent", description: "Zone de secours immédiat en cas de crise d'angoisse majeure. Calme, sécurité et numéros utilitaires.", category: "Ancrage", difficulty: "Facile", path: "exercices/stop-sos" },
];

export default function Exercises({ currentPath, setPath, userProfile }: ExercisesProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  
  // States for player components
  const [timer, setTimer] = useState(180); // 3 minutes
  const [isPlaying, setIsPlaying] = useState(false);
  const [breathPhase, setBreathPhase] = useState<"inspire" | "expire" | "retention">("inspire");
  const [breathCount, setBreathCount] = useState(5);

  // States for Carré respiration
  const [carreIndex, setCarreIndex] = useState(0); // 0:Inhale, 1:Hold, 2:Exhale, 3:Hold
  
  // Gratitude
  const [g1, setG1] = useState("");
  const [g2, setG2] = useState("");
  const [g3, setG3] = useState("");
  const [gratSaved, setGratSaved] = useState(false);

  // Sensory lock step index
  const [sensorIdx, setSensorIdx] = useState(0);
  const [sensorNotes, setSensorNotes] = useState(["", "", "", "", ""]);

  // Thoughts Clouds
  const [cloudThought, setCloudThought] = useState("");
  const [cloudsList, setCloudsList] = useState<{ id: string; text: string; x: number; y: number }[]>([]);

  // Affirmations
  const [affirmIndex, setAffirmIndex] = useState(0);
  const affirmationsList = [
    "Je fais de mon mieux, et cela est amplement suffisant aujourd'hui.",
    "Je m'accorde le droit de ralentir et de prendre soin de mon esprit.",
    "Mes émotions sont bienvenues, elles traversent juste mon ciel intérieur.",
    "Chaque respiration douce ramène un peu de calme et de sécurité en moi.",
    "Je suis digne de douceur, de confiance et de bienveillance.",
    "Je libère les attentes des autres pour retrouver mon propre rythme.",
  ];

  // Cloud scan list step
  const [scanStep, setScanStep] = useState(0);
  const scanParts = [
    { part: "Le sommet du crâne & le front", instruction: "Relâche les sourcils, laisse tes yeux flotter librement en fermant les paupières si tu es à l'aise." },
    { part: "La mâchoire", instruction: "Desserre les dents, laisse la langue se reposer loin du palais. Expire longuement par les lèvres." },
    { part: "Les épaules & le cou", instruction: "Laisse tes épaules s'abaisser. Imagine qu'elles fondent vers le sol lors de l'expiration." },
    { part: "La poitrine", instruction: "Sens l'ouverture douce lors de l'inspiration, et l'apaisement intérieur lors de l'expiration." },
    { part: "L'abdomen", instruction: "Laisse ton ventre se gonfler sans contrainte à l'inspiration. Souffle avec lenteur." },
    { part: "Les pieds", instruction: "Sens le contact solide avec le sol. Tu es fermement ancré et en parfaite sécurité." },
  ];

  // Sound cue simulation toggle
  const [soundEnabled, setSoundEnabled] = useState(true);

  // 1. Hook for Cohérence Cardiaque
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && activeId === "coherence-cardiaque") {
      interval = setInterval(() => {
        setBreathCount((prev) => {
          if (prev <= 1) {
            setBreathPhase((p) => (p === "inspire" ? "expire" : "inspire"));
            return 5;
          }
          return prev - 1;
        });
        setTimer((t) => (t > 0 ? t - 1 : 0));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, activeId, breathPhase]);

  // 2. Hook for Respiration Carrée 4s/4s/4s/4s
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && activeId === "respiration-carree") {
      interval = setInterval(() => {
        setBreathCount((prev) => {
          if (prev <= 1) {
            setCarreIndex((i) => {
              const next = (i + 1) % 4;
              if (next === 0 || next === 2) setBreathPhase(next === 0 ? "inspire" : "expire");
              else setBreathPhase("retention");
              return next;
            });
            return 4;
          }
          return prev - 1;
        });
        setTimer((t) => (t > 0 ? t - 1 : 0));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, activeId, carreIndex]);

  const startExercise = (slug: string) => {
    setActiveId(slug);
    setTimer(180);
    setIsPlaying(true);
    setBreathPhase("inspire");
    setBreathCount(5);
    setCarreIndex(0);
    setSensorIdx(0);
    setGratSaved(false);
    setG1(""); setG2(""); setG3("");
  };

  const handleCreateCloud = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cloudThought.trim()) return;
    const newCloud = {
      id: Math.random().toString(36).substring(7),
      text: cloudThought.trim(),
      x: Math.random() * 60 + 10,
      y: Math.random() * 40 + 20,
    };
    setCloudsList((prev) => [...prev, newCloud]);
    setCloudThought("");
  };

  const handleShootCloud = (id: string) => {
    setCloudsList((prev) => prev.filter((c) => c.id !== id));
  };

  return (
    <div className="flex-1 flex flex-col px-4 py-3 select-none overflow-y-auto min-h-0 w-full max-w-md mx-auto" id="exercises-page-root" style={{ contentVisibility: "auto" }}>
      
      {/* 1. Main exercise Catalog Library */}
      {!activeId && (
        <div className="space-y-5">
          <div className="flex justify-between items-center bg-white p-4 rounded-3xl border border-zinc-205">
            <div className="space-y-0.5">
              <h2 className="font-display text-2.5xl text-neutral-dark">
                Bibliothèque d'Activités
              </h2>
              <p className="text-[10px] text-zinc-400 font-semibold tracking-wider uppercase">
                Pour faire respirer ton esprit
              </p>
            </div>
            
            <div className="w-10 h-10 rounded-full bg-brand-lavender text-brand-medium flex items-center justify-center font-bold">
              📚
            </div>
          </div>

          <div className="space-y-3 max-h-[580px] overflow-y-auto">
            {EXERCISES.map((ex) => (
              <div
                key={ex.id}
                onClick={() => startExercise(ex.id)}
                className={`p-4 rounded-3xl text-left bg-white border cursor-pointer hover:shadow-md transition-all duration-300 flex flex-col justify-between space-y-3 ${
                  ex.id === "stop-sos" 
                    ? "border-red-200 bg-red-50/20 hover:bg-red-50/45" 
                    : "border-zinc-200/60 hover:border-brand-medium"
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-1.5">
                      <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase ${
                        ex.id === "stop-sos" 
                          ? "bg-red-100 text-red-700" 
                          : "bg-brand-lavender/50 text-brand-medium"
                      }`}>
                        {ex.category}
                      </span>
                      <span className="text-[10px] text-zinc-400 font-medium">
                        ⏱ {ex.duration} · {ex.difficulty}
                      </span>
                    </div>
                    <h3 className={`text-base font-semibold ${ex.id === "stop-sos" ? "text-red-700 font-bold" : "text-neutral-dark"}`}>
                      {ex.title}
                    </h3>
                  </div>

                  <span className="text-xl">
                    {ex.id === "coherence-cardiaque" && "🧘"}
                    {ex.id === "respiration-carree" && "🟩"}
                    {ex.id === "ancrage-sensoriel" && "👁"}
                    {ex.id === "scan-corporel" && "💫"}
                    {ex.id === "stretch" && "🧍"}
                    {ex.id === "affirmations" && "⭐"}
                    {ex.id === "meditation-nuages" && "☁"}
                    {ex.id === "gratitude" && "🙏"}
                    {ex.id === "journal-sos" && "✏"}
                    {ex.id === "journal-ia" && "🧠"}
                    {ex.id === "stop-sos" && "🚨"}
                  </span>
                </div>

                <p className="text-[11px] text-zinc-500 leading-relaxed">
                  {ex.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. Active exercise interface */}
      {activeId && (
        <motion.div 
          initial={{ opacity: 0, y: 15 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="flex-1 flex flex-col justify-between"
        >
          {/* Header back button */}
          <div className="flex justify-between items-center border-b border-zinc-150 pb-2 mb-4">
            <button
              onClick={() => {
                setActiveId(null);
                setIsPlaying(false);
              }}
              className="text-zinc-550 text-xs font-semibold hover:text-zinc-800 flex items-center space-x-1"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Retour</span>
            </button>

            <span className="text-xs font-bold text-neutral-dark">
              {EXERCISES.find((e) => e.id === activeId)?.title}
            </span>

            {/* Simulated sound button */}
            <button 
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`p-1.5 rounded-full ${soundEnabled ? 'text-brand-medium bg-brand-lavender/30' : 'text-zinc-400 bg-zinc-100'}`}
            >
              <Volume2 className="w-4 h-4" />
            </button>
          </div>

          {/* Active interactive players */}
          <div className="flex-1 flex flex-col justify-center py-4">
            
            {/* 2.1 COHERENCE CARDIAQUE */}
            {activeId === "coherence-cardiaque" && (
              <div className="text-center space-y-8 flex flex-col items-center">
                <div className="space-y-1">
                  <span className="text-xs uppercase tracking-wider text-zinc-400 font-bold">
                    Temps restant : {Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, "0")}
                  </span>
                  <h3 className="font-display text-3xl text-zinc-700 capitalize font-medium">
                    {breathPhase === "inspire" ? "Inspirez doucement" : "Expirez lentement"}
                  </h3>
                  <p className="text-[10px] text-zinc-400">Harmonise ton coeur et tes pensées</p>
                </div>

                {/* Animated expand/contract breathing circle */}
                <div className="relative flex items-center justify-center w-56 h-56">
                  <motion.div
                    animate={{
                      scale: breathPhase === "inspire" ? 1.45 : 1.0,
                    }}
                    transition={{
                      duration: 5,
                      ease: "easeInOut",
                    }}
                    className="absolute w-28 h-28 rounded-full bg-brand-lavender border-2 border-brand-light flex items-center justify-center"
                  >
                    <span className="text-2xl font-bold text-brand-deep">{breathCount}</span>
                  </motion.div>
                  
                  {/* Outer waves */}
                  <motion.div
                    animate={{ scale: [1, 1.8, 1], opacity: [0.3, 0.0, 0.3] }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                    className="w-32 h-32 rounded-full border border-brand-light/30 bg-transparent absolute pointer-events-none"
                  />
                </div>

                <div className="space-x-3 pt-4">
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="px-6 py-2 pb-2.5 bg-brand-medium text-white rounded-full font-semibold text-xs hover:bg-brand-deep transition"
                  >
                    {isPlaying ? "Suspendre" : "Reprendre"}
                  </button>
                </div>
              </div>
            )}

            {/* 2.2 RESPIRATION CARREE */}
            {activeId === "respiration-carree" && (
              <div className="text-center space-y-8 flex flex-col items-center">
                <div className="space-y-1">
                  <span className="text-xs uppercase tracking-wider text-zinc-400 font-bold">
                    Temps restant : {Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, "0")}
                  </span>
                  <h3 className="font-display text-3xl text-zinc-700 capitalize font-medium">
                    {carreIndex === 0 && "Inspirez par le nez"}
                    {carreIndex === 1 && "Retenez l'air"}
                    {carreIndex === 2 && "Expirez par la bouche"}
                    {carreIndex === 3 && "Restez à vide"}
                  </h3>
                  <p className="text-[10px] text-zinc-400">Le calme par l'équilibre des poumons</p>
                </div>

                {/* Box Breathing Graphic */}
                <div className="relative w-44 h-44 border-4 border-zinc-200 rounded-3xl flex items-center justify-center">
                  
                  {/* Dynamic side indicators */}
                  <div className={`absolute top-0 left-0 right-0 h-1 rounded-t-2xl transition ${carreIndex === 0 ? 'bg-brand-medium scale-100' : 'bg-transparent'}`} />
                  <div className={`absolute top-0 bottom-0 right-0 w-1 rounded-r-2xl transition ${carreIndex === 1 ? 'bg-brand-medium scale-100' : 'bg-transparent'}`} />
                  <div className={`absolute bottom-0 left-0 right-0 h-1 rounded-b-2xl transition ${carreIndex === 2 ? 'bg-brand-medium scale-100' : 'bg-transparent'}`} />
                  <div className={`absolute top-0 bottom-0 left-0 w-1 rounded-l-2xl transition ${carreIndex === 3 ? 'bg-brand-medium scale-100' : 'bg-transparent'}`} />

                  <div className="text-center">
                    <span className="text-3xl font-extrabold text-brand-medium block">{breathCount}</span>
                    <span className="text-[9px] uppercase tracking-wider font-semibold text-zinc-450">
                      {carreIndex === 1 || carreIndex === 3 ? "Pause" : "Respire"}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="px-6 py-2.5 bg-brand-medium text-white rounded-full font-semibold text-xs"
                >
                  {isPlaying ? "Pause" : "Relancer"}
                </button>
              </div>
            )}

            {/* 2.3 ANCRAGE SENSORIEL */}
            {activeId === "ancrage-sensoriel" && (
              <div className="space-y-4 px-1">
                <div className="text-center pb-2">
                  <h3 className="font-display text-2.5xl text-neutral-dark">Guide Sensoriel 5-4-3-2-1</h3>
                  <p className="text-[10px] text-zinc-500 leading-relaxed max-w-xs mx-auto">
                    Note des éléments concrets autour de toi pour calmer les pensées d'anxiété.
                  </p>
                </div>

                {/* Steps */}
                <div className="bg-white p-4 border border-zinc-200 rounded-2xl space-y-4 shadow-sm">
                  <div className="flex justify-between items-center border-b pb-2">
                    <span className="text-xs font-bold text-brand-medium">Étape {sensorIdx + 1} sur 5</span>
                    <span className="text-[9px] uppercase tracking-wider text-zinc-400">Ancrage actif</span>
                  </div>

                  {sensorIdx === 0 && (
                    <div className="space-y-3">
                      <h4 className="text-xs font-bold">👀 Note 5 choses visibles autour de toi :</h4>
                      <input
                        type="text"
                        placeholder="Ex: la lumière, un stylo rouge, le bois du bureau..."
                        value={sensorNotes[0]}
                        onChange={(e) => {
                          const n = [...sensorNotes]; n[0] = e.target.value; setSensorNotes(n);
                        }}
                        className="w-full bg-zinc-50 border p-2.5 text-xs rounded-xl focus:outline-none"
                      />
                    </div>
                  )}

                  {sensorIdx === 1 && (
                    <div className="space-y-3">
                      <h4 className="text-xs font-bold">✋ Note 4 éléments que tu peux toucher ou ressentir :</h4>
                      <input
                        type="text"
                        placeholder="Ex: la chemise sur mon dos, le pied sur le tapis..."
                        value={sensorNotes[1]}
                        onChange={(e) => {
                          const n = [...sensorNotes]; n[1] = e.target.value; setSensorNotes(n);
                        }}
                        className="w-full bg-zinc-50 border p-2.5 text-xs rounded-xl focus:outline-none"
                      />
                    </div>
                  )}

                  {sensorIdx === 2 && (
                    <div className="space-y-3">
                      <h4 className="text-xs font-bold">👂 Note 3 sons qui parviennent à ton oreille :</h4>
                      <input
                        type="text"
                        placeholder="Ex: le bruit du ventilateur, un oiseau dehors..."
                        value={sensorNotes[2]}
                        onChange={(e) => {
                          const n = [...sensorNotes]; n[2] = e.target.value; setSensorNotes(n);
                        }}
                        className="w-full bg-zinc-50 border p-2.5 text-xs rounded-xl focus:outline-none"
                      />
                    </div>
                  )}

                  {sensorIdx === 3 && (
                    <div className="space-y-3">
                      <h4 className="text-xs font-bold">👃 Note 2 odeurs distinctes autour de toi :</h4>
                      <input
                        type="text"
                        placeholder="Ex: l'odeur du café, le papier d'un carnet..."
                        value={sensorNotes[3]}
                        onChange={(e) => {
                          const n = [...sensorNotes]; n[3] = e.target.value; setSensorNotes(n);
                        }}
                        className="w-full bg-zinc-50 border p-2.5 text-xs rounded-xl focus:outline-none"
                      />
                    </div>
                  )}

                  {sensorIdx === 4 && (
                    <div className="space-y-3">
                      <h4 className="text-xs font-bold">👅 Note 1 goût ou chose positive en toi :</h4>
                      <input
                        type="text"
                        placeholder="Ex: un arrière-goût mentholé, une sensation de chaleur..."
                        value={sensorNotes[4]}
                        onChange={(e) => {
                          const n = [...sensorNotes]; n[4] = e.target.value; setSensorNotes(n);
                        }}
                        className="w-full bg-zinc-50 border p-2.5 text-xs rounded-xl focus:outline-none"
                      />
                    </div>
                  )}
                </div>

                <div className="flex justify-between">
                  <button
                    disabled={sensorIdx === 0}
                    onClick={() => setSensorIdx((i) => i - 1)}
                    className="px-4 py-2 border rounded-full text-xs disabled:opacity-40"
                  >
                    Précédent
                  </button>
                  {sensorIdx < 4 ? (
                    <button
                      className="px-6 py-2 bg-brand-medium text-white rounded-full text-xs font-semibold"
                      onClick={() => setSensorIdx((i) => i + 1)}
                    >
                      Suivant
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setActiveId(null);
                      }}
                      className="px-6 py-2 bg-brand-green text-white rounded-full text-xs font-semibold"
                    >
                      Terminer
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* 2.4 SCAN CORPOREL */}
            {activeId === "scan-corporel" && (
              <div className="space-y-6 text-center px-1 flex flex-col items-center">
                <div className="space-y-1">
                  <span className="text-[10px] text-zinc-400 uppercase tracking-widest font-bold">Scan guidé progressif</span>
                  <h3 className="font-display text-2.5xl text-neutral-dark">Focus corporel actuel</h3>
                </div>

                <div className="w-full bg-white p-5 border border-zinc-200 rounded-3xl text-left space-y-4">
                  <div className="flex items-center space-x-2 text-brand-medium">
                    <Feather className="w-5 h-5" />
                    <span className="text-xs font-bold">{scanParts[scanStep].part}</span>
                  </div>
                  <p className="text-xs text-zinc-650 leading-relaxed italic">
                    "{scanParts[scanStep].instruction}"
                  </p>
                </div>

                <div className="flex justify-between w-full pt-4">
                  <button
                    disabled={scanStep === 0}
                    onClick={() => setScanStep((s) => s - 1)}
                    className="px-4 py-1.5 border rounded-full text-xs disabled:opacity-40"
                  >
                    Étape Précédente
                  </button>
                  {scanStep < scanParts.length - 1 ? (
                    <button
                      onClick={() => setScanStep((s) => s + 1)}
                      className="px-5 py-1.5 bg-brand-medium text-white rounded-full text-xs font-semibold"
                    >
                      Suivant
                    </button>
                  ) : (
                    <button
                      onClick={() => setActiveId(null)}
                      className="px-5 py-1.5 bg-brand-green text-white rounded-full text-xs font-semibold"
                    >
                      Finir le scan
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* 2.5 STRETCH */}
            {activeId === "stretch" && (
              <div className="space-y-5 text-center px-2 flex flex-col items-center">
                <div className="space-y-1">
                  <span className="text-[10px] text-zinc-400 font-bold uppercase">Mouvements de soulagement</span>
                  <h3 className="font-display text-2.5xl text-neutral-dark">Libération physique simple</h3>
                </div>

                <div className="bg-white border rounded-3xl p-5 space-y-4 w-full text-left">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 rounded-full bg-brand-lavender text-brand-medium flex items-center justify-center font-bold text-xs shrink-0">1</div>
                    <p className="text-xs text-zinc-650 leading-relaxed">
                      Lève lentement les deux bras vers le ciel en inspirant profondément. Grandis-toi au maximum en douceur.
                    </p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 rounded-full bg-brand-lavender text-brand-medium flex items-center justify-center font-bold text-xs shrink-0">2</div>
                    <p className="text-xs text-zinc-650 leading-relaxed">
                      Bloque ta respiration pendant 2 secondes en étirant tes doigts, puis laisse tomber tes bras d'un coup sec en poussant un long soupir sonore de soulagement.
                    </p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 rounded-full bg-brand-lavender text-brand-medium flex items-center justify-center font-bold text-xs shrink-0">3</div>
                    <p className="text-xs text-zinc-650 leading-relaxed">
                      Roule tes épaules vers l'arrière trois fois à ton propre rythme pour libérer le haut des trapèzes.
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setActiveId(null)}
                  className="w-full py-3 bg-brand-medium text-white rounded-full hover:bg-brand-deep text-xs font-semibold transition"
                >
                  C'est fait, merci !
                </button>
              </div>
            )}

            {/* 2.6 AFFIRMATIONS */}
            {activeId === "affirmations" && (
              <div className="space-y-6 text-center px-1 flex flex-col items-center">
                <div className="space-y-1">
                  <span className="text-[10px] text-zinc-400 uppercase tracking-widest font-bold">Espace de pensées douces</span>
                  <h3 className="font-display text-2.5xl text-neutral-dark">Oracle de bienveillance</h3>
                </div>

                <motion.div
                  key={affirmIndex}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-gradient-to-br from-brand-lavender/50 to-white border border-brand-light/20 p-6 rounded-3xl w-full text-center min-h-[140px] flex items-center justify-center relative shadow-sm"
                >
                  <p className="text-xs font-medium text-brand-deep leading-relaxed italic">
                    "{affirmationsList[affirmIndex]}"
                  </p>
                  <span className="absolute bottom-3 right-4 text-xs">✨</span>
                </motion.div>

                <div className="flex space-x-2 w-full">
                  <button
                    onClick={() => setAffirmIndex((idx) => (idx + 1) % affirmationsList.length)}
                    className="flex-1 py-3 bg-brand-medium text-white rounded-full text-xs font-semibold hover:bg-brand-deep transition"
                  >
                    Suivante
                  </button>
                  <button
                    onClick={() => setActiveId(null)}
                    className="px-6 py-3 border border-zinc-200 text-zinc-500 rounded-full text-xs font-semibold hover:bg-zinc-50 transition"
                  >
                    Finir
                  </button>
                </div>
              </div>
            )}

            {/* 2.7 MEDITATION DES NUAGES */}
            {activeId === "meditation-nuages" && (
              <div className="space-y-4 px-1 flex flex-col items-center select-none w-full">
                <div className="text-center">
                  <h3 className="font-display text-2.5xl text-neutral-dark">Visualisation des Nuages</h3>
                  <p className="text-[10px] text-zinc-400 leading-relaxed max-w-xs mx-auto">
                    Écris une pensée encombrante, attache-la à un nuage, puis souffle pour la laisser s'éloigner paisiblement.
                  </p>
                </div>

                <form onSubmit={handleCreateCloud} className="flex space-x-2 w-full pt-1.5">
                  <input
                    type="text"
                    value={cloudThought}
                    onChange={(e) => setCloudThought(e.target.value)}
                    placeholder="Écris ta rumination ici..."
                    className="flex-1 bg-white border border-zinc-200 px-3.5 py-2 rounded-full text-xs focus:outline-none"
                  />
                  <button type="submit" className="bg-brand-medium text-white px-4 py-2 rounded-full text-xs font-semibold">
                    Attacher
                  </button>
                </form>

                {/* Sky Playground canvas with moving clouds list */}
                <div className="w-full h-44 bg-blue-50/40 rounded-3xl border border-blue-100 overflow-hidden relative mt-2 flex flex-col justify-center items-center">
                  {cloudsList.length === 0 ? (
                    <span className="text-[10px] text-zinc-400 italic">Le ciel est limpide actuellement.</span>
                  ) : (
                    <AnimatePresence>
                      {cloudsList.map((cloud) => (
                        <motion.div
                          key={cloud.id}
                          initial={{ x: "-100%", opacity: 0 }}
                          animate={{ x: `${cloud.x - 10}%`, opacity: 1 }}
                          exit={{ x: "200%", opacity: 0 }}
                          transition={{ duration: 0.6 }}
                          className="absolute bg-white border border-zinc-150 p-2.5 rounded-full shadow-sm flex items-center space-x-3 text-[10px] font-medium"
                          style={{ y: `${cloud.y - 10}px` }}
                        >
                          <span className="text-zinc-500">{cloud.text}</span>
                          <button
                            onClick={() => handleShootCloud(cloud.id)}
                            className="w-4 h-4 rounded-full bg-zinc-100 test-zinc-500 font-bold hover:bg-brand-lavender hover:text-brand-medium text-[8px] flex items-center justify-center"
                          >
                            💨
                          </button>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  )}
                </div>
              </div>
            )}

            {/* 2.8 GRATITUDE */}
            {activeId === "gratitude" && (
              <div className="space-y-4 px-1">
                <div className="text-center">
                  <h3 className="font-display text-2.5xl text-neutral-dark">Les 3 Gratitudes</h3>
                  <p className="text-[10px] text-zinc-500 leading-relaxed max-w-xs mx-auto mb-3">
                    Oriente ton regard sur les moments chaleureux de ta journée.
                  </p>
                </div>

                {gratSaved ? (
                  <motion.div 
                    initial={{ scale: 0.95 }} 
                    animate={{ scale: 1 }} 
                    className="bg-emerald-50 text-emerald-800 p-5 rounded-3xl border border-emerald-100 text-center space-y-3.5"
                  >
                    <CheckCircle2 className="w-8 h-8 text-brand-green mx-auto" />
                    <div className="space-y-1">
                      <h4 className="text-xs font-bold leading-none">Ressenti sauvegardé !</h4>
                      <p className="text-[9px] text-zinc-505">Tu ancres en toi ces moments purs de sérénité.</p>
                    </div>
                    <button
                      onClick={() => setActiveId(null)}
                      className="px-6 py-2 bg-brand-green text-white rounded-full text-xs font-semibold"
                    >
                      D'accord, de retour
                    </button>
                  </motion.div>
                ) : (
                  <div className="space-y-3 bg-white p-4 border rounded-2xl shadow-inner">
                    <input
                      type="text"
                      value={g1}
                      onChange={(e) => setG1(e.target.value)}
                      placeholder="1. Un sourire d'un collègue, un bon café chaud..."
                      className="w-full bg-zinc-50 border p-2.5 text-xs rounded-xl focus:outline-none"
                    />
                    <input
                      type="text"
                      value={g2}
                      onChange={(e) => setG2(e.target.value)}
                      placeholder="2. Une musique agréable entendue en route..."
                      className="w-full bg-zinc-50 border p-2.5 text-xs rounded-xl focus:outline-none"
                    />
                    <input
                      type="text"
                      value={g3}
                      onChange={(e) => setG3(e.target.value)}
                      placeholder="3. Avoir pris 5 minutes de paix pour mon esprit..."
                      className="w-full bg-zinc-50 border p-2.5 text-xs rounded-xl focus:outline-none"
                    />

                    <button
                      onClick={() => setGratSaved(true)}
                      disabled={!g1.trim()}
                      className="w-full py-2.5 bg-brand-medium hover:bg-brand-deep text-white font-semibold rounded-full text-xs shadow disabled:bg-zinc-150"
                    >
                      Enregistrer mes 3 moments
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* 2.9 JOURNAL INTIME SOS */}
            {activeId === "journal-sos" && (
              <div className="space-y-4 px-1 flex-1 flex flex-col justify-start">
                <div className="text-center">
                  <h3 className="font-display text-2.5xl text-neutral-dark">Journal Libre Confidentiel</h3>
                  <p className="text-[10px] text-zinc-400 leading-relaxed max-w-xs mx-auto">
                    Mots vrac, peines passagères ou éclats de joie : libère tout ce qui t'encombre.
                  </p>
                </div>

                <div className="flex-1 min-h-[160px] relative mt-2">
                  <textarea
                    placeholder="Écris librement sans aucune restriction de format ou de longueur..."
                    className="w-full h-full bg-white border border-zinc-200 rounded-2.5xl p-4 text-xs focus:outline-none focus:border-brand-light font-sans leading-relaxed"
                  />
                </div>

                <button
                  onClick={() => setActiveId(null)}
                  className="w-full py-3 bg-brand-medium text-white font-semibold rounded-full hover:bg-brand-deep text-xs transition mt-2"
                >
                  Fermer et crypter mes écrits
                </button>
              </div>
            )}

            {/* 2.10 JOURNAL IA GUIDÉ */}
            {activeId === "journal-ia" && (
              <div className="space-y-4 px-1">
                <div className="text-center">
                  <h3 className="font-display text-2.5xl text-neutral-dark">Journal IA Guidé</h3>
                  <p className="text-[10px] text-zinc-400 mb-3 leading-relaxed max-w-xs mx-auto">
                    Mindy te suggère des pistes douces de questionnement.
                  </p>
                </div>

                <div className="bg-gradient-to-br from-brand-lavender/40 to-white border border-brand-light/15 rounded-3xl p-4 space-y-4 shadow-sm text-left">
                  <div className="flex items-center space-x-1 text-brand-medium">
                    <Sparkles className="w-4.5 h-4.5" />
                    <span className="text-[10.5px] font-bold">La question du jour</span>
                  </div>
                  <p className="text-xs text-zinc-700 leading-relaxed italic">
                    "Si tu devais comparer ta fatigue actuelle à un élément de la nature (un océan agité, un arbre sans feuilles, un désert aride), que choisirais-tu et pourquoi ?"
                  </p>

                  <textarea
                    rows={4}
                    placeholder="Ma réponse guidée..."
                    className="w-full bg-white border border-zinc-200 rounded-2xl p-3 text-xs focus:outline-none"
                  />
                </div>

                <button
                  onClick={() => setActiveId(null)}
                  className="w-full py-3 bg-brand-medium text-white rounded-full hover:bg-brand-deep text-xs font-semibold"
                >
                  Enregistrer ma réflexion
                </button>
              </div>
            )}

            {/* 2.11 STOP S.O.S EMERGENCY PLAYER */}
            {activeId === "stop-sos" && (
              <div className="space-y-5 px-1 py-1 text-center w-full max-h-[500px] overflow-y-auto">
                <div className="w-14 h-14 rounded-full bg-red-100 text-red-600 border border-red-200 mx-auto flex items-center justify-center">
                  <ShieldAlert className="w-8 h-8" />
                </div>

                <div className="space-y-1.5">
                  <h3 className="font-display text-2.5.5xl text-red-700 font-bold leading-tight">
                    Prends un instant. Tu es en sécurité.
                  </h3>
                  <p className="text-zinc-550 text-[11px] leading-relaxed max-w-xs mx-auto">
                    L'angoisse est une vague physique inconfortable, mais elle va finir par passer. Concentrons-nous uniquement sur le présent.
                  </p>
                </div>

                {/* 3s / 3s stabilization breathing looping circle */}
                <div className="bg-stone-50 border border-zinc-200 p-4 rounded-3xl flex flex-col items-center justify-center space-y-3 shadow-inner">
                  <span className="text-[10px] text-zinc-400 uppercase tracking-widest font-bold">Respiration d'ancrage rapide</span>
                  
                  <motion.div
                    animate={{ scale: [1, 1.25, 1] }}
                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                    className="w-20 h-20 rounded-full bg-red-100/60 border border-red-200 flex items-center justify-center"
                  >
                    <span className="text-xs font-extrabold text-red-650">Inspire (3s)</span>
                  </motion.div>
                  <span className="text-[9px] text-zinc-410">Suis le cycle visuel avec douceur.</span>
                </div>

                {/* Emergency Resources Box per system mandates */}
                <div className="bg-red-50/50 border border-red-100 p-4 rounded-3xl text-left space-y-3">
                  <h4 className="text-[11px] font-bold text-red-750 flex items-center space-x-1.5">
                    <PhoneCall className="w-4 h-4 text-red-610" />
                    <span>Ressources d'aide professionnelles gratuit et 24/7 :</span>
                  </h4>
                  <div className="space-y-2 text-[10.5px]">
                    <div className="flex justify-between items-center border-b border-red-100/40 pb-1.5">
                      <span className="font-semibold text-neutral-dark">Numéro National de Prévention du Suicide :</span>
                      <span className="font-bold text-red-600 bg-red-100/50 px-2.5 py-0.5 rounded-full">3114</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-red-100/40 pb-1.5">
                      <span className="font-semibold text-neutral-dark">Secours d'urgence (Samu) :</span>
                      <span className="font-bold text-red-600 bg-red-100/50 px-2.5 py-0.5 rounded-full">15</span>
                    </div>
                    <div className="flex justify-between items-center text-zinc-502">
                      <span className="font-semibold">SOS Amitié (Écoute anonyme) :</span>
                      <span className="font-bold text-red-600">09 72 39 40 50</span>
                    </div>
                  </div>
                </div>

                <p className="text-[9.5px] text-zinc-450 italic leading-snug">
                  "Tu as de l'importance pour nous. Prends le temps de respirer, un instant après l'autre."
                </p>
              </div>
            )}

          </div>

          <div className="h-4" />
        </motion.div>
      )}

    </div>
  );
}
