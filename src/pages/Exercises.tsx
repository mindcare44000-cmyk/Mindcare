import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Compass, Heart, Wind, Feather, PenTool, BookOpen, 
  HelpCircle, Sparkles, Star, ChevronLeft, ChevronRight, Volume2, 
  Trash2, ShieldAlert, CheckCircle2, PhoneCall, Search, SlidersHorizontal,
  Brain, Hand, Cloud, User, Activity, Accessibility, X
} from "lucide-react";
import { Exercise, UserProfile } from "../types";

interface ExercisesProps {
  currentPath: string;
  setPath: (path: string) => void;
  userProfile: UserProfile;
}

interface ExtendedExercise extends Exercise {
  durationLabel: string;
  effect: string;
  effectColor: string;
  topColor: string;
  iconName: "heart-rate-monitor" | "wind" | "hand" | "body" | "stretching" | "sparkles" | "cloud" | "heart" | "notebook" | "brain";
  durationCategory: "<3" | "3-5" | "5+";
}

const TYPOLOGY_THEMES: Record<string, {
  colorName: string;
  dotClass: string;
  badgeClass: string;
  tagClass: string;
  iconColorClass: string;
  bgLightClass: string;
  bgMediumClass: string;
  borderMediumClass: string;
  primaryBg: string;
  primaryText: string;
  deepText: string;
  deepBg: string;
  topColor: string;
  gradientFromBorder: string;
}> = {
  "Apaisement": {
    colorName: "emerald",
    dotClass: "bg-emerald-500",
    badgeClass: "bg-emerald-50 text-emerald-700 border border-emerald-100",
    tagClass: "bg-emerald-50 text-emerald-700 border border-emerald-250/20",
    iconColorClass: "text-emerald-500",
    bgLightClass: "bg-emerald-50/60",
    bgMediumClass: "bg-emerald-100/85",
    borderMediumClass: "border-emerald-200/60",
    primaryBg: "bg-emerald-500",
    primaryText: "text-emerald-600",
    deepText: "text-emerald-800",
    deepBg: "bg-emerald-600",
    topColor: "#10B981",
    gradientFromBorder: "from-emerald-50/50 to-white border-emerald-105"
  },
  "Focus": {
    colorName: "sky",
    dotClass: "bg-sky-500",
    badgeClass: "bg-sky-50 text-sky-700 border border-sky-100",
    tagClass: "bg-sky-50 text-sky-700 border border-sky-200/50",
    iconColorClass: "text-sky-500",
    bgLightClass: "bg-sky-50/60",
    bgMediumClass: "bg-sky-100/85",
    borderMediumClass: "border-sky-200/60",
    primaryBg: "bg-sky-500",
    primaryText: "text-sky-600",
    deepText: "text-sky-800",
    deepBg: "bg-sky-600",
    topColor: "#0EA5E9",
    gradientFromBorder: "from-sky-50/50 to-white border-sky-105"
  },
  "Ruminations": {
    colorName: "amber",
    dotClass: "bg-amber-500",
    badgeClass: "bg-amber-50 text-amber-700 border border-amber-100",
    tagClass: "bg-amber-50 text-amber-700 border border-amber-200/30",
    iconColorClass: "text-amber-500",
    bgLightClass: "bg-amber-50/60",
    bgMediumClass: "bg-amber-100/85",
    borderMediumClass: "border-amber-200/60",
    primaryBg: "bg-amber-500",
    primaryText: "text-amber-600",
    deepText: "text-amber-808",
    deepBg: "bg-amber-600",
    topColor: "#F59E0B",
    gradientFromBorder: "from-amber-50/50 to-white border-amber-105"
  },
  "Relâchement": {
    colorName: "indigo",
    dotClass: "bg-indigo-500",
    badgeClass: "bg-indigo-50 text-indigo-700 border border-indigo-100",
    tagClass: "bg-indigo-50 text-indigo-700 border border-indigo-200/50",
    iconColorClass: "text-indigo-500",
    bgLightClass: "bg-indigo-50/60",
    bgMediumClass: "bg-indigo-100/85",
    borderMediumClass: "border-indigo-200/60",
    primaryBg: "bg-indigo-500",
    primaryText: "text-indigo-600",
    deepText: "text-indigo-850",
    deepBg: "bg-indigo-600",
    topColor: "#6366F1",
    gradientFromBorder: "from-indigo-50/50 to-white border-indigo-105"
  },
  "Énergie": {
    colorName: "orange",
    dotClass: "bg-orange-500",
    badgeClass: "bg-orange-50 text-orange-700 border border-orange-100",
    tagClass: "bg-orange-50 text-orange-700 border border-orange-200/50",
    iconColorClass: "text-orange-500",
    bgLightClass: "bg-orange-50/60",
    bgMediumClass: "bg-orange-100/85",
    borderMediumClass: "border-orange-200/60",
    primaryBg: "bg-orange-500",
    primaryText: "text-orange-600",
    deepText: "text-orange-850",
    deepBg: "bg-orange-600",
    topColor: "#F97316",
    gradientFromBorder: "from-orange-50/50 to-white border-orange-105"
  },
  "Estime de soi": {
    colorName: "pink",
    dotClass: "bg-pink-500",
    badgeClass: "bg-pink-50 text-pink-700 border border-pink-100",
    tagClass: "bg-pink-50 text-pink-700 border border-pink-200/50",
    iconColorClass: "text-pink-500",
    bgLightClass: "bg-pink-50/60",
    bgMediumClass: "bg-pink-100/85",
    borderMediumClass: "border-pink-200/60",
    primaryBg: "bg-pink-500",
    primaryText: "text-pink-600",
    deepText: "text-pink-850",
    deepBg: "bg-pink-600",
    topColor: "#EC4899",
    gradientFromBorder: "from-pink-50/50 to-white border-pink-105"
  },
  "Distance": {
    colorName: "teal",
    dotClass: "bg-teal-500",
    badgeClass: "bg-teal-50 text-teal-700 border border-teal-100",
    tagClass: "bg-teal-50 text-teal-700 border border-teal-200/50",
    iconColorClass: "text-teal-500",
    bgLightClass: "bg-teal-50/60",
    bgMediumClass: "bg-teal-100/85",
    borderMediumClass: "border-teal-200/60",
    primaryBg: "bg-teal-500",
    primaryText: "text-teal-600",
    deepText: "text-teal-800",
    deepBg: "bg-teal-600",
    topColor: "#14B8A6",
    gradientFromBorder: "from-teal-50/50 to-white border-teal-105"
  },
  "Attitude positive": {
    colorName: "yellow",
    dotClass: "bg-amber-400",
    badgeClass: "bg-yellow-50 text-yellow-800 border border-yellow-200/60",
    tagClass: "bg-yellow-50 text-yellow-800 border border-yellow-200/50",
    iconColorClass: "text-yellow-600",
    bgLightClass: "bg-yellow-50/40",
    bgMediumClass: "bg-yellow-105/70",
    borderMediumClass: "border-yellow-200/60",
    primaryBg: "bg-yellow-500",
    primaryText: "text-yellow-600",
    deepText: "text-yellow-800",
    deepBg: "bg-yellow-600",
    topColor: "#EAB308",
    gradientFromBorder: "from-yellow-50/50 to-white border-yellow-150"
  },
  "Charge mentale": {
    colorName: "violet",
    dotClass: "bg-violet-500",
    badgeClass: "bg-violet-50 text-violet-700 border border-violet-100",
    tagClass: "bg-violet-50 text-violet-700 border border-violet-200/50",
    iconColorClass: "text-violet-500",
    bgLightClass: "bg-violet-50/60",
    bgMediumClass: "bg-violet-100/85",
    borderMediumClass: "border-violet-200/60",
    primaryBg: "bg-violet-500",
    primaryText: "text-violet-600",
    deepText: "text-violet-800",
    deepBg: "bg-violet-600",
    topColor: "#8B5CF6",
    gradientFromBorder: "from-violet-50/50 to-white border-violet-105"
  },
  "Comprendre": {
    colorName: "purple",
    dotClass: "bg-purple-500",
    badgeClass: "bg-purple-50 text-purple-700 border border-purple-100",
    tagClass: "bg-purple-50 text-purple-700 border border-purple-200/50",
    iconColorClass: "text-purple-500",
    bgLightClass: "bg-purple-50/60",
    bgMediumClass: "bg-purple-100/85",
    borderMediumClass: "border-purple-200/60",
    primaryBg: "bg-purple-500",
    primaryText: "text-purple-600",
    deepText: "text-purple-800",
    deepBg: "bg-purple-600",
    topColor: "#A855F7",
    gradientFromBorder: "from-purple-50/50 to-white border-purple-105"
  },
  "Urgent": {
    colorName: "rose",
    dotClass: "bg-rose-500",
    badgeClass: "bg-rose-50 text-rose-700 border border-rose-100",
    tagClass: "bg-rose-50 text-rose-700 border border-rose-200/50",
    iconColorClass: "text-rose-500",
    bgLightClass: "bg-rose-50/60",
    bgMediumClass: "bg-rose-100/85",
    borderMediumClass: "border-rose-200/60",
    primaryBg: "bg-rose-500",
    primaryText: "text-rose-600",
    deepText: "text-rose-800",
    deepBg: "bg-rose-600",
    topColor: "#F43F5E",
    gradientFromBorder: "from-rose-50/50 to-white border-rose-105"
  }
};

const EXERCISES: ExtendedExercise[] = [
  {
    id: "coherence-cardiaque",
    title: "Cohérence cardiaque",
    duration: "2–5 min",
    description: "Basse de respiration 5s / 5s pour calmer le rythme cardiaque et chasser l'anxiété.",
    category: "Respiration" as any,
    difficulty: "Facile",
    path: "exercices/coherence-cardiaque",
    durationLabel: "2–5 min · Rythme 5/5",
    effect: "Apaisement",
    effectColor: "emerald",
    topColor: "#10B981",
    iconName: "heart-rate-monitor",
    durationCategory: "3-5"
  },
  {
    id: "respiration-carree",
    title: "Respiration carrée",
    duration: "3–5 min",
    description: "Cycle en 4 temps suspendus pour canaliser l'attention et libérer le flot de pensées.",
    category: "Respiration" as any,
    difficulty: "Facile",
    path: "exercices/respiration-carree",
    durationLabel: "3–5 min · Cycle 4 temps",
    effect: "Focus",
    effectColor: "sky",
    topColor: "#0EA5E9",
    iconName: "wind",
    durationCategory: "3-5"
  },
  {
    id: "ancrage-sensoriel",
    title: "Ancrage sensoriel",
    duration: "5 min",
    description: "Guide sensoriel 5-4-3-2-1 pour sortir rapidement d'une rumination mentale.",
    category: "Ancrage" as any,
    difficulty: "Facile",
    path: "exercices/ancrage-sensoriel",
    durationLabel: "5 min · Interaction sensorielle",
    effect: "Ruminations",
    effectColor: "amber",
    topColor: "#F59E0B",
    iconName: "hand",
    durationCategory: "3-5"
  },
  {
    id: "scan-corporel",
    title: "Scan corporel",
    duration: "5-10 min",
    description: "Parcours mental progressif des pieds à la tête pour relâcher les tensions physiques accumulées.",
    category: "Corps" as any,
    difficulty: "Intermédiaire",
    path: "exercices/scan-corporel",
    durationLabel: "5–10 min · Audio guidé",
    effect: "Relâchement",
    effectColor: "indigo",
    topColor: "#6366F1",
    iconName: "body",
    durationCategory: "5+"
  },
  {
    id: "stretch",
    title: "Stretch",
    duration: "1–3 min",
    description: "Mouvements physiques doux illustrés pour débloquer le diaphragme sous l'effet du stress.",
    category: "Corps" as any,
    difficulty: "Facile",
    path: "exercices/stretch",
    durationLabel: "1–3 min · Séquence guidée",
    effect: "Énergie",
    effectColor: "orange",
    topColor: "#F97316",
    iconName: "stretching",
    durationCategory: "<3"
  },
  {
    id: "affirmations",
    title: "Affirmations",
    duration: "Phrases positives",
    description: "Oracle de bienveillance et de renforcement de l'estime de soi.",
    category: "Méditation" as any,
    difficulty: "Facile",
    path: "exercices/affirmations",
    durationLabel: "Phrases positives · Audio optionnel",
    effect: "Estime de soi",
    effectColor: "pink",
    topColor: "#EC4899",
    iconName: "sparkles",
    durationCategory: "<3"
  },
  {
    id: "meditation-nuages",
    title: "Méditation des nuages",
    duration: "2-3 min",
    description: "Souffle tes pensées envahissantes et regarde-les s'éloigner au gré du vent.",
    category: "Méditation" as any,
    difficulty: "Facile",
    path: "exercices/meditation-nuages",
    durationLabel: "2–3 min · Visualisation guidée",
    effect: "Distance",
    effectColor: "teal",
    topColor: "#14B8A6",
    iconName: "cloud",
    durationCategory: "<3"
  },
  {
    id: "gratitude",
    title: "Gratitude",
    duration: "3 éléments",
    description: "Met en lumière trois éléments agréables de la journée pour orienter l'esprit vers le positif.",
    category: "Journal" as any,
    difficulty: "Facile",
    path: "exercices/gratitude",
    durationLabel: "3 éléments positifs · Historique",
    effect: "Attitude positive",
    effectColor: "yellow",
    topColor: "#EAB308",
    iconName: "heart",
    durationCategory: "3-5"
  },
  {
    id: "journal-sos",
    title: "Journal SOS",
    duration: "Zone de texte libre",
    description: "Une zone confidentielle sous clé sans contrainte ni format pour coucher ses mots sur écran.",
    category: "Journal" as any,
    difficulty: "Facile",
    path: "exercices/journal-sos",
    durationLabel: "Zone de texte libre · Confidentiel",
    effect: "Charge mentale",
    effectColor: "violet",
    topColor: "#8B5CF6",
    iconName: "notebook",
    durationCategory: "5+"
  },
  {
    id: "journal-ia",
    title: "Journal IA",
    duration: "Questions IA",
    description: "Réponds aux questions personnalisées formulées par Mindy pour clarifier tes émotions.",
    category: "Journal" as any,
    difficulty: "Intermédiaire",
    path: "exercices/journal-ia",
    durationLabel: "Questions IA · Reformulation",
    effect: "Comprendre",
    effectColor: "purple",
    topColor: "#A855F7",
    iconName: "brain",
    durationCategory: "3-5"
  },
  // Extra fallback definition for routing compatibility
  {
    id: "stop-sos",
    title: "STABILISATION STOP S.O.S",
    duration: "Urgent",
    description: "Zone de secours immédiat en cas de crise d'angoisse majeure.",
    category: "Ancrage" as any,
    difficulty: "Facile",
    path: "exercices/stop-sos",
    durationLabel: "Zone SOS active",
    effect: "Urgent",
    effectColor: "rose",
    topColor: "#F43F5E",
    iconName: "notebook",
    durationCategory: "5+"
  }
];

export default function Exercises({ currentPath, setPath, userProfile }: ExercisesProps) {
  const [activeId, setActiveId] = useState<string | null>(null);

  // Synchronize activeId & fresh state configuration directly with the currentPath route
  useEffect(() => {
    if (currentPath && currentPath.startsWith("exercices/")) {
      const slug = currentPath.substring("exercices/".length);
      if (slug && EXERCISES.some((e) => e.id === slug)) {
        setActiveId(slug);
        setTimer(180);
        setIsPlaying(true);
        setBreathPhase("inspire");
        setBreathCount(5);
        setCarreIndex(0);
        setSensorIdx(0);
        setGratSaved(false);
        setG1(""); setG2(""); setG3("");
      }
    } else {
      setActiveId(null);
      setIsPlaying(false);
    }
  }, [currentPath]);

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
    setPath(`exercices/${slug}`);
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

  // State managers for filters and search
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("Tous");
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);

  // Advanced active filters
  const [selectedDurations, setSelectedDurations] = useState<("<3" | "3-5" | "5+")[]>([]);
  const [selectedEffects, setSelectedEffects] = useState<string[]>([]);

  // Temporary filters in bottom sheet
  const [tempSelectedDurations, setTempSelectedDurations] = useState<("<3" | "3-5" | "5+")[]>([]);
  const [tempSelectedEffects, setTempSelectedEffects] = useState<string[]>([]);

  // Only consider the 10 catalog exercises ordered exactly
  const displayedExercises = EXERCISES.filter((ex) => ex.id !== "stop-sos");

  // Advanced Filter configs
  const durationsConfig: { id: "<3" | "3-5" | "5+"; label: string }[] = [
    { id: "<3", label: "- de 3 min" },
    { id: "3-5", label: "3–5 min" },
    { id: "5+", label: "+ de 5 min" }
  ];

  const effectsConfig = [
    { name: "Apaisement", colorDot: TYPOLOGY_THEMES["Apaisement"].dotClass },
    { name: "Focus", colorDot: TYPOLOGY_THEMES["Focus"].dotClass },
    { name: "Ruminations", colorDot: TYPOLOGY_THEMES["Ruminations"].dotClass },
    { name: "Relâchement", colorDot: TYPOLOGY_THEMES["Relâchement"].dotClass },
    { name: "Énergie", colorDot: TYPOLOGY_THEMES["Énergie"].dotClass },
    { name: "Estime de soi", colorDot: TYPOLOGY_THEMES["Estime de soi"].dotClass },
    { name: "Distance", colorDot: TYPOLOGY_THEMES["Distance"].dotClass },
    { name: "Attitude positive", colorDot: TYPOLOGY_THEMES["Attitude positive"].dotClass },
    { name: "Charge mentale", colorDot: TYPOLOGY_THEMES["Charge mentale"].dotClass },
    { name: "Comprendre", colorDot: TYPOLOGY_THEMES["Comprendre"].dotClass }
  ];

  // Helper matching individual items
  const matchesFilters = (
    ex: ExtendedExercise,
    query: string,
    category: string,
    durations: ("<3" | "3-5" | "5+")[],
    effects: string[]
  ) => {
    // 1. Search Query
    if (query.trim().length > 0) {
      const q = query.toLowerCase();
      if (!ex.title.toLowerCase().includes(q) && !ex.description.toLowerCase().includes(q)) {
        return false;
      }
    }

    // 2. Category Pill
    if (category !== "Tous") {
      if (ex.category !== category) return false;
    }

    // 3. Duration category select
    if (durations.length > 0) {
      if (!durations.includes(ex.durationCategory)) return false;
    }

    // 4. Effect select
    if (effects.length > 0) {
      if (!effects.includes(ex.effect)) return false;
    }

    return true;
  };

  // Filtered lists
  const filteredExercises = displayedExercises.filter((ex) =>
    matchesFilters(ex, searchQuery, selectedCategory, selectedDurations, selectedEffects)
  );

  const getTempFilteredCount = () => {
    return displayedExercises.filter((ex) =>
      matchesFilters(ex, searchQuery, selectedCategory, tempSelectedDurations, tempSelectedEffects)
    ).length;
  };

  const activeFiltersCount = selectedDurations.length + selectedEffects.length;

  // Icon switcher helper returning nice responsive Lucide vectors
  const getExerciseIcon = (name: string, effect: string) => {
    const theme = TYPOLOGY_THEMES[effect] || { iconColorClass: "text-brand-medium" };
    switch (name) {
      case "heart-rate-monitor":
        return <Activity className={`w-5 h-5 ${theme.iconColorClass}`} />;
      case "wind":
        return <Wind className={`w-5 h-5 ${theme.iconColorClass}`} />;
      case "hand":
        return <Hand className={`w-5 h-5 ${theme.iconColorClass}`} />;
      case "body":
        return <User className={`w-5 h-5 ${theme.iconColorClass}`} />;
      case "stretching":
        return <Accessibility className={`w-5 h-5 ${theme.iconColorClass}`} />;
      case "sparkles":
        return <Sparkles className={`w-5 h-5 ${theme.iconColorClass}`} />;
      case "cloud":
        return <Cloud className={`w-5 h-5 ${theme.iconColorClass}`} />;
      case "heart":
        return <Heart className={`w-5 h-5 ${theme.iconColorClass}`} fill="currentColor" />;
      case "notebook":
        return <BookOpen className={`w-5 h-5 ${theme.iconColorClass}`} />;
      case "brain":
        return <Brain className={`w-5 h-5 ${theme.iconColorClass}`} />;
      default:
        return <Compass className={`w-5 h-5 ${theme.iconColorClass}`} />;
    }
  };

  // Color mappings for custom pastelle badge styles
  const getEffectBadgeStyle = (effect: string) => {
    return TYPOLOGY_THEMES[effect]?.badgeClass || "bg-zinc-50 text-zinc-650";
  };

  return (
    <div className="flex-1 flex flex-col px-4 pt-6 pb-3 select-none overflow-y-auto overflow-x-hidden min-h-0 w-full max-w-md mx-auto h-full max-h-full" id="exercises-page-root" style={{ contentVisibility: "auto" }}>
      
      {/* 1. Main exercise Catalog Library */}
      {!activeId && (
        <div className="space-y-4 flex flex-col h-full">
          
          {/* Header area */}
          <div className="flex justify-between items-center shrink-0">
            <div>
              <h2 className="text-2xl font-bold text-zinc-800 tracking-tight">
                Exercices
              </h2>
              <p className="text-xs text-zinc-400 font-medium">
                {filteredExercises.length} {filteredExercises.length > 1 ? "exercices disponibles" : "exercice disponible"}
              </p>
            </div>

            <button
              id="filter-toggle-button"
              onClick={() => {
                setTempSelectedDurations(selectedDurations);
                setTempSelectedEffects(selectedEffects);
                setIsFilterPanelOpen(true);
              }}
              className="px-4 py-2 hover:bg-[#F2ECE4] text-zinc-700 text-xs font-semibold rounded-full bg-[#FAF8F5] transition duration-200 flex items-center gap-2 relative shadow-xs"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Filtrer</span>
              {activeFiltersCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-[#7C6FF7] text-white text-[10px] flex items-center justify-center font-bold">
                  {activeFiltersCount}
                </span>
              )}
            </button>
          </div>

          {/* Search bar */}
          <div className="relative shrink-0">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400">
              <Search className="w-4 h-4" />
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher un exercice..."
              className="w-full pl-11 pr-4 py-3 bg-[#FAF8F5] placeholder-zinc-400 text-xs text-zinc-700 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#7C6FF7]/30 border-0 border-none transition"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-650 p-1 rounded-full hover:bg-zinc-100"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Category Pilles (scroll horizontal layout) */}
          <div 
            className="flex overflow-x-auto gap-2 py-2 shrink-0 scrollbar-none select-none"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {["Tous", "Respiration", "Ancrage", "Méditation", "Corps", "Journal"].map((cat) => {
              const isActive = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition duration-200 ${
                    isActive
                      ? "bg-[#1A1A1A] text-white"
                      : "bg-[#FAF8F5] text-zinc-500 hover:bg-[#F2ECE4] hover:text-zinc-700"
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* Exercise card feeding renderer */}
          <div className="flex-1 space-y-3 mt-1 pb-4">
            {filteredExercises.length > 0 ? (
              filteredExercises.map((ex) => (
                <motion.div
                  key={ex.id}
                  onClick={() => startExercise(ex.id)}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 450, damping: 25 }}
                  className="relative overflow-hidden bg-white rounded-2xl p-4 flex items-center justify-between shadow-[0_2px_12px_rgba(0,0,0,0.06)] cursor-pointer border border-[#F4F1EA] hover:shadow-[0_4px_18px_rgba(0,0,0,0.09)] transition group"
                >
                  {/* Top 3px decorative color bar identifier */}
                  <div 
                    className="absolute top-0 left-0 right-0 h-[3px]" 
                    style={{ backgroundColor: ex.topColor }}
                  />

                  {/* Left layout with icon and textual descriptions */}
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-[#FAF8F5] flex items-center justify-center shrink-0">
                      {getExerciseIcon(ex.iconName, ex.effect)}
                    </div>
                    <div className="space-y-0.5">
                      <h4 className="text-[14px] font-bold text-zinc-800 leading-snug tracking-tight">
                        {ex.title}
                      </h4>
                      <p className="text-[11px] text-zinc-400 font-medium">
                        {ex.durationLabel}
                      </p>
                    </div>
                  </div>

                  {/* Right layout with custom pastelle Badge and Chevron */}
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] px-2.5 py-1 rounded-full font-semibold ${getEffectBadgeStyle(ex.effect)}`}>
                      {ex.effect}
                    </span>
                    <ChevronRight className="w-4 h-4 text-zinc-300 group-hover:text-zinc-502 transition-colors shrink-0" />
                  </div>
                </motion.div>
              ))
            ) : (
              // Empty search state
              <div className="flex flex-col items-center justify-center py-12 text-center space-y-3 px-6 h-full">
                <div className="w-14 h-14 rounded-full bg-[#FAF8F5] text-zinc-400 flex items-center justify-center">
                  <Search className="w-6 h-6 stroke-[1.5]" />
                </div>
                <div className="space-y-1">
                  <h5 className="text-[14px] font-bold text-zinc-700">Aucun exercice trouvé</h5>
                  <p className="text-xs text-zinc-450 max-w-xs leading-relaxed">
                    Ajustez vos mots-clés ou réinitialisez vos filtres pour trouver ce qui convient à votre instant présent.
                  </p>
                </div>
                {(searchQuery || selectedCategory !== "Tous" || activeFiltersCount > 0) && (
                  <button
                    onClick={() => {
                      setSearchQuery("");
                      setSelectedCategory("Tous");
                      setSelectedDurations([]);
                      setSelectedEffects([]);
                    }}
                    className="px-4 py-2 bg-[#7C6FF7]/10 hover:bg-[#7C6FF7]/15 text-[#7C6FF7] font-bold text-xs rounded-full transition duration-150"
                  >
                    Réinitialiser tout
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Advanced layout bottom sheet drawer */}
          <AnimatePresence>
            {isFilterPanelOpen && (
              <>
                {/* Frosted backing blur overlay */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setIsFilterPanelOpen(false)}
                  className="fixed inset-0 bg-neutral-900/40 backdrop-blur-xs z-50 flex items-end justify-center"
                >
                  {/* Rising panel container drawer sheet */}
                  <motion.div
                    initial={{ y: "100%" }}
                    animate={{ y: 0 }}
                    exit={{ y: "100%" }}
                    transition={{ type: "spring", damping: 30, stiffness: 350 }}
                    onClick={(e) => e.stopPropagation()}
                    className="w-full max-w-md bg-white rounded-t-[28px] p-6 pb-8 space-y-6 shadow-2xl relative select-none"
                  >
                    {/* Visual swipe pull bar */}
                    <div className="w-12 h-1 bg-zinc-200 rounded-full mx-auto" />

                    {/* Sheet title and reset action controls */}
                    <div className="flex justify-between items-center">
                      <h3 className="text-base font-bold text-zinc-800">
                        Filtres avancés
                      </h3>
                      <button
                        onClick={() => {
                          setTempSelectedDurations([]);
                          setTempSelectedEffects([]);
                        }}
                        className="text-xs text-[#7C6FF7] font-semibold hover:text-[#6455dd] cursor-pointer"
                      >
                        Réinitialiser
                      </button>
                    </div>

                    {/* Section 1: Durées checkpills */}
                    <div className="space-y-2.5">
                      <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-wider">
                        Durée
                      </h4>
                      <div className="flex gap-2 w-full">
                        {durationsConfig.map((d) => {
                          const isSelected = tempSelectedDurations.includes(d.id);
                          return (
                            <button
                              key={d.id}
                              onClick={() => {
                                if (isSelected) {
                                  setTempSelectedDurations(tempSelectedDurations.filter((val) => val !== d.id));
                                } else {
                                  setTempSelectedDurations([...tempSelectedDurations, d.id]);
                                }
                              }}
                              className={`flex-1 py-3 text-xs font-semibold rounded-xl text-center border transition-all duration-200 ${
                                isSelected
                                  ? "bg-[#1A1A1A] border-[#1A1A1A] text-white"
                                  : "bg-[#FAF8F5] border-[#F2ECE4] text-zinc-650 hover:bg-[#F2ECE4]"
                              }`}
                            >
                              {d.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Section 2: Effet recherché checks grids */}
                    <div className="space-y-2.5">
                      <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-wider">
                        Effet recherché
                      </h4>
                      <div className="grid grid-cols-2 gap-2">
                        {effectsConfig.map((eff) => {
                          const isSelected = tempSelectedEffects.includes(eff.name);
                          return (
                            <button
                              key={eff.name}
                              onClick={() => {
                                if (isSelected) {
                                  setTempSelectedEffects(tempSelectedEffects.filter((v) => v !== eff.name));
                                } else {
                                  setTempSelectedEffects([...tempSelectedEffects, eff.name]);
                                }
                              }}
                              className={`flex items-center gap-2 p-3 text-xs rounded-xl border text-left transition duration-200 ${
                                isSelected
                                  ? "bg-[#7C6FF7]/10 border-[#7C6FF7] text-[#7C6FF7] font-bold"
                                  : "bg-[#FAF8F5] border-[#F2ECE4] text-zinc-600 hover:bg-[#F2ECE4]"
                              }`}
                            >
                              <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${eff.colorDot}`} />
                              <span className="truncate">{eff.name}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Primary apply button showcasing computed exercise matching result counts */}
                    <div className="pt-2">
                      <button
                        onClick={() => {
                          setSelectedDurations(tempSelectedDurations);
                          setSelectedEffects(tempSelectedEffects);
                          setIsFilterPanelOpen(false);
                        }}
                        className="w-full py-4 text-xs font-bold text-white bg-[#7C6FF7] hover:bg-[#6455dd] rounded-xl text-center transition duration-250 shadow-md"
                      >
                        Voir les {getTempFilteredCount()} {getTempFilteredCount() > 1 ? "exercices" : "exercice"}
                      </button>
                    </div>

                  </motion.div>
                </motion.div>
              </>
            )}
          </AnimatePresence>

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
          <div className="flex justify-between items-center pb-2 mb-4">
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
                      className="px-6 py-2 bg-[#7C6FF7] text-white rounded-full text-xs font-semibold"
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
                      className="px-5 py-1.5 bg-[#7C6FF7] text-white rounded-full text-xs font-semibold"
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
                <div className="w-full h-44 bg-[#EDE9FE]/20 rounded-3xl border border-[#C4BAFA] overflow-hidden relative mt-2 flex flex-col justify-center items-center">
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
                          className="absolute bg-white border border-zinc-200/60 p-2.5 rounded-full shadow-sm flex items-center space-x-3 text-[10px] font-medium"
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
                    className="bg-[#EDE9FE]/40 text-[#5B4FD4] p-5 rounded-3xl border border-[#C4BAFA]/50 text-center space-y-3.5"
                  >
                    <CheckCircle2 className="w-8 h-8 text-[#7C6FF7] mx-auto" />
                    <div className="space-y-1">
                      <h4 className="text-xs font-bold leading-none">Ressenti sauvegardé !</h4>
                      <p className="text-[9px] text-zinc-555">Tu ancres en toi ces moments purs de sérénité.</p>
                    </div>
                    <button
                      onClick={() => setActiveId(null)}
                      className="px-6 py-2 bg-[#7C6FF7] text-white rounded-full text-xs font-semibold"
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
              <div className="space-y-5 px-1 py-1 text-center w-full">
                <div className="w-14 h-14 rounded-full bg-[#EDE9FE] text-[#5B4FD4] border border-[#C4BAFA] mx-auto flex items-center justify-center">
                  <ShieldAlert className="w-8 h-8" />
                </div>

                <div className="space-y-1.5">
                  <h3 className="font-display text-2.5.5xl text-[#5B4FD4] font-bold leading-tight">
                    Prends un instant. Tu es en sécurité.
                  </h3>
                  <p className="text-zinc-550 text-[11px] leading-relaxed max-w-xs mx-auto">
                    L'angoisse est une vague physique inconfortable, mais elle va finir par passer. Concentrons-nous uniquement sur le présent.
                  </p>
                </div>

                {/* 3s / 3s stabilization breathing looping circle */}
                <div className="bg-[#FAF8F5] border border-zinc-200 p-4 rounded-3xl flex flex-col items-center justify-center space-y-3 shadow-inner">
                  <span className="text-[10px] text-zinc-400 uppercase tracking-widest font-bold">Respiration d'ancrage rapide</span>
                  
                  <motion.div
                    animate={{ scale: [1, 1.25, 1] }}
                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                    className="w-20 h-20 rounded-full bg-[#EDE9FE]/60 border border-[#C4BAFA] flex items-center justify-center"
                  >
                    <span className="text-xs font-extrabold text-[#5B4FD4]">Inspire (3s)</span>
                  </motion.div>
                  <span className="text-[9px] text-zinc-410">Suis le cycle visuel avec douceur.</span>
                </div>

                {/* Emergency Resources Box per system mandates */}
                <div className="bg-[#EDE9FE]/30 border border-[#C4BAFA]/50 p-4 rounded-3xl text-left space-y-3">
                  <h4 className="text-[11px] font-bold text-[#5B4FD4] flex items-center space-x-1.5">
                    <PhoneCall className="w-4 h-4 text-[#7C6FF7]" />
                    <span>Ressources d'aide professionnelles gratuit et 24/7 :</span>
                  </h4>
                  <div className="space-y-2 text-[10.5px]">
                    <div className="flex justify-between items-center border-b border-[#C4BAFA]/30 pb-1.5">
                      <span className="font-semibold text-neutral-dark">Numéro National de Prévention du Suicide :</span>
                      <span className="font-bold text-[#5B4FD4] bg-[#EDE9FE] px-2.5 py-0.5 rounded-full">3114</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-[#C4BAFA]/30 pb-1.5">
                      <span className="font-semibold text-neutral-dark">Secours d'urgence (Samu) :</span>
                      <span className="font-bold text-[#5B4FD4] bg-[#EDE9FE] px-2.5 py-0.5 rounded-full">15</span>
                    </div>
                    <div className="flex justify-between items-center text-zinc-502">
                      <span className="font-semibold">SOS Amitié (Écoute anonyme) :</span>
                      <span className="font-bold text-[#5B4FD4]">09 72 39 40 50</span>
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
