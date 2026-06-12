import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Compass, Heart, Wind, Feather, PenTool, BookOpen, 
  HelpCircle, Sparkles, Star, ChevronLeft, ChevronRight, Volume2, 
  Trash2, ShieldAlert, CheckCircle2, PhoneCall, Search, SlidersHorizontal,
  Brain, Hand, Cloud, User, Activity, Accessibility, X
} from "lucide-react";
import { Exercise, UserProfile } from "../types";

// Import standalone premium exercise components
import { CoherenceExercise } from "../components/exercises/CoherenceExercise";
import { RespirationCarreeExercise } from "../components/exercises/RespirationCarreeExercise";
import { AncrageExercise } from "../components/exercises/AncrageExercise";
import { ScanCorporelExercise } from "../components/exercises/ScanCorporelExercise";
import { StretchExercise } from "../components/exercises/StretchExercise";
import { AffirmationsExercise } from "../components/exercises/AffirmationsExercise";
import { MeditationNuagesExercise } from "../components/exercises/MeditationNuagesExercise";
import { GratitudeExercise } from "../components/exercises/GratitudeExercise";
import { JournalSosExercise } from "../components/exercises/JournalSosExercise";
import { JournalIaExercise } from "../components/exercises/JournalIaExercise";
import { StopSosExercise } from "../components/exercises/StopSosExercise";

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

  // Synchronize activeId directly with the currentPath route
  useEffect(() => {
    if (currentPath && currentPath.startsWith("exercices/")) {
      const slug = currentPath.substring("exercices/".length);
      if (slug && EXERCISES.some((e) => e.id === slug)) {
        setActiveId(slug);
      }
    } else {
      setActiveId(null);
    }
  }, [currentPath]);

  // Sound cue simulation toggle
  const [soundEnabled, setSoundEnabled] = useState(true);

  const startExercise = (slug: string) => {
    setPath(`exercices/${slug}`);
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
        <div className="absolute inset-0 z-50 overflow-hidden">
          {activeId === "coherence-cardiaque" && (
            <CoherenceExercise
              onComplete={() => setPath("exercices")}
              onCancel={() => setPath("exercices")}
              soundEnabled={soundEnabled}
              setSoundEnabled={setSoundEnabled}
            />
          )}
          {activeId === "respiration-carree" && (
            <RespirationCarreeExercise
              onComplete={() => setPath("exercices")}
              onCancel={() => setPath("exercices")}
              soundEnabled={soundEnabled}
              setSoundEnabled={setSoundEnabled}
            />
          )}
          {activeId === "ancrage-sensoriel" && (
            <AncrageExercise
              onComplete={() => setPath("exercices")}
              onCancel={() => setPath("exercices")}
              soundEnabled={soundEnabled}
              setSoundEnabled={setSoundEnabled}
            />
          )}
          {activeId === "scan-corporel" && (
            <ScanCorporelExercise
              onComplete={() => setPath("exercices")}
              onCancel={() => setPath("exercices")}
              soundEnabled={soundEnabled}
              setSoundEnabled={setSoundEnabled}
            />
          )}
          {activeId === "stretch" && (
            <StretchExercise
              onComplete={() => setPath("exercices")}
              onCancel={() => setPath("exercices")}
              soundEnabled={soundEnabled}
              setSoundEnabled={setSoundEnabled}
            />
          )}
          {activeId === "affirmations" && (
            <AffirmationsExercise
              onComplete={() => setPath("exercices")}
              onCancel={() => setPath("exercices")}
              soundEnabled={soundEnabled}
              setSoundEnabled={setSoundEnabled}
            />
          )}
          {activeId === "meditation-nuages" && (
            <MeditationNuagesExercise
              onComplete={() => setPath("exercices")}
              onCancel={() => setPath("exercices")}
              soundEnabled={soundEnabled}
              setSoundEnabled={setSoundEnabled}
            />
          )}
          {activeId === "gratitude" && (
            <GratitudeExercise
              onComplete={() => setPath("exercices")}
              onCancel={() => setPath("exercices")}
              soundEnabled={soundEnabled}
              setSoundEnabled={setSoundEnabled}
            />
          )}
          {activeId === "journal-sos" && (
            <JournalSosExercise
              onComplete={() => setPath("exercices")}
              onCancel={() => setPath("exercices")}
              soundEnabled={soundEnabled}
              setSoundEnabled={setSoundEnabled}
            />
          )}
          {activeId === "journal-ia" && (
            <JournalIaExercise
              onComplete={() => setPath("exercices")}
              onCancel={() => setPath("exercices")}
              soundEnabled={soundEnabled}
              setSoundEnabled={setSoundEnabled}
            />
          )}
          {activeId === "stop-sos" && (
            <StopSosExercise
              onComplete={() => setPath("exercices")}
              onCancel={() => setPath("exercices")}
              soundEnabled={soundEnabled}
              setSoundEnabled={setSoundEnabled}
            />
          )}
        </div>
      )}

    </div>
  );
}
