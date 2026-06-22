import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  ChevronLeft, ChevronRight, ArrowLeft,
  Activity, Heart, Sparkles, Zap, Brain, MessageSquare, 
  CheckCircle2, Star, Eye, Hand, User, Accessibility, Cloud, BookOpen, ClipboardCheck, Wind
} from "lucide-react";
import { CheckInRecord, UserProfile } from "../types";

interface HistoryProps {
  currentPath: string;
  setPath: (path: string) => void;
  userProfile: UserProfile;
  checkIns: CheckInRecord[];
}

interface CalendarDayItem {
  isPlaceholder: boolean;
  key: string;
  day?: number;
  dateStr?: string;
}

interface HistoricDay {
  id: string;
  dateStr: string; // YYYY-MM-DD
  dayNum: number;
  weekdayLabel: string; // "Lun", "Mar", etc.
  weekdayFull: string; // "Lundi", "Mardi", etc.
  frenchDisplayDate: string; // "Jeudi 7 juin"
  mood: number; // 1-5
  moodLabel: string; // "Humeur correcte", "Bonne journée", etc.
  moodEmoji: string;
  pressure: string; // "Faible" | "Modérée" | "Élevée"
  pressureLevel: number; // 0-100 for progress bar
  energy: string; // "Vide" | "Modérée" | "Pleine"
  energyLevel: number; // 0-100
  notes: string; // text from Mindy chat
  themes: string[]; // theme tags
  exercises: {
    name: string;
    duration: string;
    subtitle: string;
    icon: string;
  }[];
}

const getParisCurrentYearMonth = () => {
  try {
    const d = new Date();
    const tzString = d.toLocaleString("sv-SE", { timeZone: "Europe/Paris" });
    const parts = tzString.split(" ")[0].split("-");
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10); // 1-indexed
    return { year, month };
  } catch (e) {
    const d = new Date();
    return { year: d.getFullYear(), month: d.getMonth() + 1 };
  }
};

const createDynamicHistoricalDatabase = (): HistoricDay[] => {
  const getParisDateString = (offsetDays: number): string => {
    try {
      const d = new Date();
      const tzString = d.toLocaleString("sv-SE", { timeZone: "Europe/Paris" });
      const parisParts = tzString.split(" ")[0].split("-");
      const year = parseInt(parisParts[0], 10);
      const month = parseInt(parisParts[1], 10) - 1;
      const day = parseInt(parisParts[2], 10);
      
      const targetDate = new Date(year, month, day);
      targetDate.setDate(targetDate.getDate() - offsetDays);
      
      const yStr = targetDate.getFullYear();
      const mStr = String(targetDate.getMonth() + 1).padStart(2, "0");
      const dStr = String(targetDate.getDate()).padStart(2, "0");
      return `${yStr}-${mStr}-${dStr}`;
    } catch (e) {
      const targetDate = new Date();
      targetDate.setDate(targetDate.getDate() - offsetDays);
      const yStr = targetDate.getFullYear();
      const mStr = String(targetDate.getMonth() + 1).padStart(2, "0");
      const dStr = String(targetDate.getDate()).padStart(2, "0");
      return `${yStr}-${mStr}-${dStr}`;
    }
  };

  const getParisDateObj = (offsetDays: number): Date => {
    try {
      const d = new Date();
      const tzString = d.toLocaleString("sv-SE", { timeZone: "Europe/Paris" });
      const parisParts = tzString.split(" ")[0].split("-");
      const year = parseInt(parisParts[0], 10);
      const month = parseInt(parisParts[1], 10) - 1;
      const day = parseInt(parisParts[2], 10);
      
      const targetDate = new Date(year, month, day);
      targetDate.setDate(targetDate.getDate() - offsetDays);
      return targetDate;
    } catch (e) {
      const targetDate = new Date();
      targetDate.setDate(targetDate.getDate() - offsetDays);
      return targetDate;
    }
  };

  const getWeekdayFull = (d: Date): string => {
    const days = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];
    return days[d.getDay()];
  };

  const getWeekdayLabel = (d: Date): string => {
    const labels = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];
    return labels[d.getDay()];
  };

  const getFrenchDisplayDate = (d: Date): string => {
    const weekdays = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];
    const months = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"];
    return `${weekdays[d.getDay()]} ${d.getDate()} ${months[d.getMonth()]}`;
  };

  const templates = [
    {
      mood: 3,
      moodLabel: "Nuageux",
      moodEmoji: "☁️",
      pressure: "Modéré",
      pressureLevel: 42,
      energy: "Correcte",
      energyLevel: 65,
      notes: "Tu as évoqué une pression au travail liée à un projet urgent. La conversation t'a aidé à mettre des mots dessus et à te sentir un peu plus léger.",
      themes: ["Travail", "Stress", "Gestion des émotions"],
      exercises: [
        { name: "Cohérence cardiaque", duration: "5 min", subtitle: "Rythme 5/5", icon: "ti ti-screen-share" },
        { name: "Respiration carrée", duration: "3 min", subtitle: "Cycle 4 temps", icon: "ti ti-wind" }
      ]
    },
    {
      mood: 4,
      moodLabel: "Éclaircie",
      moodEmoji: "⛅",
      pressure: "Modérée",
      pressureLevel: 35,
      energy: "Modérée",
      energyLevel: 55,
      notes: "Aujourd'hui, tu as partagé un moment rassurant avec tes proches. Discuter t'a libéré l'esprit et renforcé ton sentiment d'ancrage.",
      themes: ["Famille", "Détente", "Soutien"],
      exercises: [
        { name: "Ancrage sensoriel", duration: "5 min", subtitle: "Méthode 5-4-3-2-1", icon: "ti ti-eye" }
      ]
    },
    {
      mood: 4,
      moodLabel: "Éclaircie",
      moodEmoji: "⛅",
      pressure: "Faible",
      pressureLevel: 20,
      energy: "Modérée",
      energyLevel: 60,
      notes: "Tu as décrit une journée sereine avec une marche apaisante. Mindy t'a encouragé à continuer à te reconnecter à ton rythme naturel.",
      themes: ["Marche active", "Nature", "Sérénité"],
      exercises: [
        { name: "Stretch & Soupir", duration: "2 min", subtitle: "Étirement libre", icon: "ti ti-stretching" }
      ]
    },
    {
      mood: 4,
      moodLabel: "Éclaircie",
      moodEmoji: "⛅",
      pressure: "Modérée",
      pressureLevel: 45,
      energy: "Modérée",
      energyLevel: 50,
      notes: "Un début de semaine équilibré. Des respirations amples pendant les réunions t'ont permis de garder les pieds sur terre et de filtrer le bruit.",
      themes: ["Calme", "Professionnel", "Respiration"],
      exercises: [
        { name: "Cohérence cardiaque", duration: "3 min", subtitle: "Harmonisation rapide", icon: "ti ti-activity" }
      ]
    },
    {
      mood: 2,
      moodLabel: "Pluie",
      moodEmoji: "🌧️",
      pressure: "Élevée",
      pressureLevel: 80,
      energy: "Basse",
      energyLevel: 25,
      notes: "Un coucher agité avec quelques ruminations. Mindy a proposé d'imaginer des nuages emportant tes pensées restrictives pour t'apaiser.",
      themes: ["Anxiété", "Sommeil", "Ruminations"],
      exercises: [
        { name: "Méditation des Nuages", duration: "3 min", subtitle: "Sommeil paisible", icon: "ti ti-cloud" }
      ]
    },
    {
      mood: 3,
      moodLabel: "Nuageux",
      moodEmoji: "☁️",
      pressure: "Faible",
      pressureLevel: 15,
      energy: "Correcte",
      energyLevel: 70,
      notes: "Repos mérité sous la couette. Tu as déconnecté ton téléphone pendant trois heures pour te donner de l'espace mental.",
      themes: ["Repos", "Mieux-être", "Déconnexion"],
      exercises: [
        { name: "3 Gratitudes du Jour", duration: "3 min", subtitle: "Écriture douce", icon: "ti ti-feather" }
      ]
    },
    {
      mood: 5,
      moodLabel: "Soleil",
      moodEmoji: "☀️",
      pressure: "Faible",
      pressureLevel: 10,
      energy: "Excellente",
      energyLevel: 90,
      notes: "Nouveau départ réussi ! MindCare accueille ton élan avec joie. Tu t'es senti libre de créer et de respirer à pleins poumons.",
      themes: ["Confiance", "Vision", "Optimisme"],
      exercises: [
        { name: "Affirmations Positives", duration: "2 min", subtitle: "Estime de soi", icon: "ti ti-star" }
      ]
    }
  ];

  return templates.map((tpl, index) => {
    const offset = index + 1; // index 0 is J-1, index 6 is J-7
    const dateStr = getParisDateString(offset);
    const dateObj = getParisDateObj(offset);
    return {
      id: dateStr,
      dateStr: dateStr,
      dayNum: dateObj.getDate(),
      weekdayLabel: getWeekdayLabel(dateObj),
      weekdayFull: getWeekdayFull(dateObj),
      frenchDisplayDate: getFrenchDisplayDate(dateObj),
      ...tpl
    };
  });
};

const HISTORICAL_DATABASE = createDynamicHistoricalDatabase();

export default function History({ currentPath, setPath, userProfile, checkIns }: HistoryProps) {
  // Navigation inside history page
  // Path can look like: "historique" (List view) or "historique/detail/2026-06-07" (Day Detail view)
  const [selectedDayId, setSelectedDayId] = useState<string | null>(null);

  // Parse path to see if we should open a day detail directly
  useEffect(() => {
    if (currentPath === "historique") {
      setSelectedDayId(null);
    } else if (currentPath.startsWith("historique/detail/")) {
      const dayId = currentPath.substring("historique/detail/".length);
      setSelectedDayId(dayId);
    }
  }, [currentPath]);

  // Combine static DB with user's live checkins
  const getCombinedDays = (): HistoricDay[] => {
    // Start with default DB
    const list = [...HISTORICAL_DATABASE];

    // Merge in any dynamic check-in
    checkIns.forEach((c) => {
      // Find out if we already have this dynamic checkIn day in Juin 2026
      // Convert standard date "2026-06-10" -> dayNum "10"
      const dateParts = c.date.split("-");
      const dayNum = parseInt(dateParts[2] || "10", 10);
      const moodValue = c.mood;

      // Map checkIn properties to our rich HistoricDay structure
      let moodLabel = "Nuageux";
      let moodEmoji = "☁️";
      if (moodValue >= 5) {
        moodLabel = "Soleil";
        moodEmoji = "☀️";
      } else if (moodValue === 4) {
        moodLabel = "Éclaircie";
        moodEmoji = "⛅";
      } else if (moodValue === 3) {
        moodLabel = "Nuageux";
        moodEmoji = "☁️";
      } else if (moodValue === 2) {
        moodLabel = "Pluie";
        moodEmoji = "🌧️";
      } else {
        moodLabel = "Orage";
        moodEmoji = "⛈️";
      }

      // Check if duplicate entry exists (e.g. today refreshed) and update or add
      const existingIdx = list.findIndex((x) => x.dateStr === c.date);
      const newDay: HistoricDay = {
        id: c.date,
        dateStr: c.date,
        dayNum: dayNum,
        weekdayLabel: "Auj",
        weekdayFull: "Aujourd'hui",
        frenchDisplayDate: "Aujourd'hui",
        mood: moodValue,
        moodLabel,
        moodEmoji,
        pressure: c.pressure,
        pressureLevel: c.pressure === "Faible" ? 15 : c.pressure === "Modérée" || c.pressure === "Modéré" ? 50 : 85,
        energy: c.energy,
        energyLevel: c.energy === "Vide" ? 10 : c.energy === "Modérée" || c.energy === "Correcte" ? 55 : 90,
        notes: c.notes || c.aiSummary || "Bilan de fin de journée complété avec soin.",
        themes: ["Auto-bilan", "Météo brute"],
        exercises: [
          { name: "Cohérence cardiaque", duration: "3 min", subtitle: "Pratique reflexe", icon: "ti ti-heart" }
        ]
      };

      if (existingIdx !== -1) {
        list[existingIdx] = { ...list[existingIdx], ...newDay };
      } else {
        list.unshift(newDay);
      }
    });

    // Make sure list is unique by dateStr and sort chronologically/newest first
    const seen = new Set<string>();
    const uniqueList = list.filter((item) => {
      const duplicate = seen.has(item.dateStr);
      seen.add(item.dateStr);
      return !duplicate;
    });

    return uniqueList.sort((a, b) => b.dateStr.localeCompare(a.dateStr));
  };

  const combinedDays = getCombinedDays();

  // Pick active day for detail screen
  const getSelectedDayData = (): HistoricDay => {
    const picked = combinedDays.find((d) => d.dateStr === selectedDayId);
    if (picked) return picked;
    
    // Fallback default
    return combinedDays[0] || HISTORICAL_DATABASE[0];
  };

  const activeDay = getSelectedDayData();

  // Calendar render constants
  const { year: currentYear, month: currentMonth } = getParisCurrentYearMonth();
  const [calendarYear, setCalendarYear] = useState(currentYear);
  const [calendarMonth, setCalendarMonth] = useState(currentMonth);

  const handlePrevMonth = () => {
    setCalendarMonth((prev) => {
      if (prev === 1) {
        setCalendarYear((y) => y - 1);
        return 12;
      }
      return prev - 1;
    });
  };

  const handleNextMonth = () => {
    setCalendarMonth((prev) => {
      if (prev === 12) {
        setCalendarYear((y) => y + 1);
        return 1;
      }
      return prev + 1;
    });
  };

  const getMonthGridDays = (year: number, month: number): CalendarDayItem[] => {
    // First day of interest
    const firstDay = new Date(year, month - 1, 1);
    const startDayOfWeek = firstDay.getDay(); // 0 is Sunday, 1 is Monday ... 6 is Saturday
    
    // We want Monday (1) to Sunday (0) indexing: L M M J V S D
    // Monday is column 0, Sunday is column 6
    const emptySpaces = startDayOfWeek === 0 ? 6 : startDayOfWeek - 1;
    
    const placeholders: CalendarDayItem[] = Array.from({ length: emptySpaces }, (_, i) => ({
      isPlaceholder: true,
      key: `p-${i}`,
      day: undefined,
      dateStr: undefined,
    }));
    
    const totalDays = new Date(year, month, 0).getDate();
    
    const monthDays: CalendarDayItem[] = Array.from({ length: totalDays }, (_, i) => {
      const day = i + 1;
      const mStr = String(month).padStart(2, "0");
      const dStr = String(day).padStart(2, "0");
      const dateStr = `${year}-${mStr}-${dStr}`;
      return {
        isPlaceholder: false,
        day,
        dateStr,
        key: dateStr,
      };
    });
    
    return [...placeholders, ...monthDays];
  };

  const JuneGridDays = getMonthGridDays(calendarYear, calendarMonth);

  const FRENCH_MONTH_NAMES = [
    "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
    "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
  ];

  // Pastelle color cells for visual heatmap rendering
  const getMoodCellColorStyle = (mood: number) => {
    if (mood >= 5) {
      return "bg-[#EDE9FE]/55 text-[#5B4FD4] border border-[#C4BAFA]/20 hover:bg-[#EDE9FE]/80";
    } else if (mood === 4) {
      return "bg-[#C4BAFA]/30 text-[#4C3EB0] border border-[#C4BAFA]/40 hover:bg-[#C4BAFA]/50";
    } else if (mood === 3) {
      return "bg-[#9D94F5]/22 text-[#3C2FB3] border border-[#9D94F5]/30 hover:bg-[#9D94F5]/35";
    } else if (mood === 2) {
      return "bg-[#7C6FF7]/15 text-[#2F21A3] border border-[#7C6FF7]/20 hover:bg-[#7C6FF7]/25";
    } else {
      return "bg-[#5B4FD4]/12 text-[#1F119E] border border-[#5B4FD4]/20 hover:bg-[#5B4FD4]/20";
    }
  };

  const getMoodColorClass = (mood: number) => {
    if (mood >= 5) return "bg-[#EDE9FE]";
    if (mood === 4) return "bg-[#C4BAFA]";
    if (mood === 3) return "bg-[#9D94F5]";
    if (mood === 2) return "bg-[#7C6FF7]";
    return "bg-[#5B4FD4]";
  };

  const getMoodTopBarColor = (mood: number) => {
    if (mood >= 5) return "#EDE9FE";
    if (mood === 4) return "#C4BAFA";
    if (mood === 3) return "#9D94F5";
    if (mood === 2) return "#7C6FF7";
    return "#5B4FD4";
  };

  // Helper colors for mood soft background representation in detail panel
  const getMoodBgClass = (mood: number) => {
    if (mood >= 5) {
      return "bg-gradient-to-tr from-[#EDE9FE]/50 to-[#EDE9FE]/15 border border-[#C4BAFA]/30 shadow-[0_4px_24px_rgba(124,111,247,0.06)]";
    }
    if (mood === 4) {
      return "bg-gradient-to-tr from-[#C4BAFA]/30 to-[#C4BAFA]/10 border border-[#9D94F5]/30 shadow-[0_4px_24px_rgba(124,111,247,0.06)]";
    }
    if (mood === 3) {
      return "bg-gradient-to-tr from-[#9D94F5]/25 to-[#9D94F5]/5 border border-[#7C6FF7]/20 shadow-[0_4px_24px_rgba(124,111,247,0.06)]";
    }
    if (mood === 2) {
      return "bg-gradient-to-tr from-[#7C6FF7]/20 to-[#7C6FF7]/5 border border-[#5B4FD4]/20 shadow-[0_4px_24px_rgba(124,111,247,0.06)]";
    }
    return "bg-gradient-to-tr from-[#5B4FD4]/25 to-[#5B4FD4]/5 border border-[#5B4FD4]/30 shadow-[0_4px_24px_rgba(91,79,212,0.06)]";
  };

  const getMoodEmojiLabel = (mood: number) => {
    if (mood >= 5) return "Soleil";
    if (mood === 4) return "Éclaircie";
    if (mood === 3) return "Nuageux";
    if (mood === 2) return "Pluie";
    return "Orage";
  };

  // Navigate back to Calendar
  const handleBackToCalendar = () => {
    setPath("historique");
  };

  // Navigate to previous/next day in the detail view
  const handleNavigateDay = (direction: "prev" | "next") => {
    // Sort chronologically (oldest first) to find index for smooth carousel feeling
    const chronList = [...combinedDays].reverse();
    const currentIdx = chronList.findIndex((d) => d.dateStr === selectedDayId);
    if (currentIdx !== -1) {
      if (direction === "prev" && currentIdx > 0) {
        setPath(`historique/detail/${chronList[currentIdx - 1].dateStr}`);
      } else if (direction === "next" && currentIdx < chronList.length - 1) {
        setPath(`historique/detail/${chronList[currentIdx + 1].dateStr}`);
      }
    }
  };

  const hasPrevDay = () => {
    const chronList = [...combinedDays].reverse();
    const idx = chronList.findIndex((d) => d.dateStr === selectedDayId);
    return idx > 0;
  };

  const hasNextDay = () => {
    const chronList = [...combinedDays].reverse();
    const idx = chronList.findIndex((d) => d.dateStr === selectedDayId);
    return idx !== -1 && idx < chronList.length - 1;
  };

  // Helpers for mapping exercise values
  const getHistoryExerciseIcon = (name: string) => {
    const n = name.toLowerCase();
    if (n.includes("cardiaque") || n.includes("cohérence")) {
      return <Activity className="w-5 h-5 text-[#7C6FF7]" />;
    } else if (n.includes("carrée") || n.includes("respiration")) {
      return <Wind className="w-5 h-5 text-blue-500" />;
    } else if (n.includes("ancrage") || n.includes("sensoriel")) {
      return <Hand className="w-5 h-5 text-[#F59E0B]" />;
    } else if (n.includes("scan") || n.includes("corporel")) {
      return <User className="w-5 h-5 text-violet-500" />;
    } else if (n.includes("stretch") || n.includes("soupir")) {
      return <Accessibility className="w-5 h-5 text-emerald-500" />;
    } else if (n.includes("affirmation") || n.includes("positive")) {
      return <Sparkles className="w-5 h-5 text-pink-500" />;
    } else if (n.includes("nuage") || n.includes("méditation")) {
      return <Cloud className="w-5 h-5 text-blue-400" />;
    } else if (n.includes("gratitude") || n.includes("journal")) {
      return <Heart className="w-5 h-5 text-[#F59E0B]" fill="currentColor" />;
    }
    return <Heart className="w-5 h-5 text-[#7C6FF7]" />;
  };

  const getHistoryExerciseTopColor = (name: string) => {
    const n = name.toLowerCase();
    if (n.includes("cardiaque") || n.includes("cohérence")) return "#34D399";
    if (n.includes("carrée") || n.includes("respiration")) return "#3B82F6";
    if (n.includes("ancrage") || n.includes("sensoriel")) return "#F59E0B";
    if (n.includes("scan") || n.includes("corporel")) return "#8B5CF6";
    if (n.includes("stretch")) return "#10B981";
    if (n.includes("affirmation")) return "#EC4899";
    if (n.includes("nuage") || n.includes("méditation")) return "#60A5FA";
    if (n.includes("gratitude")) return "#F59E0B";
    return "#7C6FF7";
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-white" id="history-container">
      <AnimatePresence mode="wait">
        {!selectedDayId ? (
          /* ========================================================================= */
          /* PAGE 1 — MON CALENDRIER                                                   */
          /* ========================================================================= */
          <motion.div
            key="calendar-screen"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="flex-1 flex flex-col min-h-0 overflow-y-auto overflow-x-hidden px-5 pt-6 pb-8"
            id="calendar-screen-root"
          >
            {/* Header with Title and Month Navigation */}
            <div className="flex justify-between items-center select-none mb-6">
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-neutral-dark">
                  Mon calendrier
                </h2>
                <p className="text-xs text-zinc-400 font-medium">
                  Votre météo interne au fil des jours
                </p>
              </div>
              
              <div className="flex items-center space-x-1.5 bg-[#FAF8F5] border border-[#F4F1EA] py-1.5 px-3 rounded-full shadow-xs">
                <button
                  onClick={handlePrevMonth}
                  className="p-1 hover:text-zinc-800 text-zinc-400 active:scale-90 transition cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-xs font-semibold text-zinc-700 px-1 min-w-[100px] text-center">
                  {FRENCH_MONTH_NAMES[calendarMonth - 1]} {calendarYear}
                </span>
                <button
                  onClick={handleNextMonth}
                  className="p-1 hover:text-zinc-800 text-zinc-400 active:scale-90 transition cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Grid Calendar Mensuelle */}
            <div className="bg-white border border-[#F4F1EA] rounded-2xl p-5 shadow-[0_2px_12px_rgba(0,0,0,0.05)] mb-6 select-none" id="calendar-card-board">
              {/* Weekday alphabetic row */}
              <div className="grid grid-cols-7 gap-y-2 text-center text-[11px] font-bold text-zinc-400 select-none pb-3 border-b border-[#F4F1EA]/80">
                <span>L</span>
                <span>M</span>
                <span>M</span>
                <span>J</span>
                <span>V</span>
                <span>S</span>
                <span>D</span>
              </div>

              {/* Grid Days */}
              <div className="grid grid-cols-7 gap-y-3 gap-x-1 text-center pt-3.5">
                {JuneGridDays.map((item) => {
                  if (item.isPlaceholder || !item.dateStr || item.day === undefined) {
                    return <div key={item.key} className="h-10 invisible" />;
                  }

                  const dayStr = item.dateStr;
                  const dayVal = item.day;

                  // Check if a registered check-in exists for this day
                  const dObj = combinedDays.find((x) => x.dateStr === dayStr);
                  
                  return (
                    <div
                      key={item.key}
                      onClick={() => {
                        if (dObj) {
                          setPath(`historique/detail/${dayStr}`);
                        }
                      }}
                      className={`flex flex-col items-center justify-between h-11 py-1 rounded-xl transition-all select-none relative ${
                        dObj 
                          ? `${getMoodCellColorStyle(dObj.mood)} cursor-pointer active:scale-95 shadow-2xs` 
                          : "opacity-45 text-zinc-350 cursor-not-allowed"
                      }`}
                    >
                      <span className={`text-[12px] font-bold ${
                        dObj ? "text-zinc-800" : "text-zinc-400"
                      }`}>
                        {dayVal}
                      </span>
                      
                      {/* Color indicator bar thereunder */}
                      {dObj ? (
                        <div 
                          className={`h-1.5 w-6 rounded-full ${getMoodColorClass(dObj.mood)} shadow-xs`}
                        />
                      ) : (
                        <div className="h-1 w-5 rounded-full bg-zinc-100" />
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Légende en bas du calendrier avec dégradé de violet */}
              <div className="mt-5 pt-4 border-t border-[#F4F1EA]/85 flex justify-between items-center text-[10px] uppercase font-extrabold tracking-wider text-zinc-450 select-none px-1" id="calendar-legend">
                <span>Jours légers</span>
                <div className="flex items-center gap-1.5 px-2">
                  <div className="w-5.5 h-2 rounded-full bg-[#EDE9FE] shadow-2xs" title="Très bien" />
                  <div className="w-5.5 h-2 rounded-full bg-[#C4BAFA] shadow-2xs" title="Bien" />
                  <div className="w-5.5 h-2 rounded-full bg-[#9D94F5] shadow-2xs" title="Moyen" />
                  <div className="w-5.5 h-2 rounded-full bg-[#7C6FF7] shadow-2xs" title="Pas top" />
                  <div className="w-5.5 h-2 rounded-full bg-[#5B4FD4] shadow-2xs" title="Mal" />
                </div>
                <span>Jours chargés</span>
              </div>
            </div>

            {/* Section 5 DERNIERS JOURS */}
            <div className="space-y-3">
              <h3 className="text-[11px] font-bold tracking-wider text-zinc-400 uppercase select-none flex items-center justify-between">
                <span>5 derniers jours</span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#7C6FF7]" />
              </h3>

              <div className="space-y-3" id="history-scroller-list">
                {combinedDays.slice(0, 5).map((day) => (
                  <motion.div
                    key={day.id}
                    layoutId={`day-card-${day.id}`}
                    whileHover={{ y: -1 }}
                    whileTap={{ scale: 0.985 }}
                    onClick={() => setPath(`historique/detail/${day.dateStr}`)}
                    className="relative overflow-hidden bg-white rounded-2xl p-4 flex items-center justify-between shadow-[0_2px_12px_rgba(0,0,0,0.05)] border border-[#F4F1EA] hover:shadow-[0_4px_18px_rgba(0,0,0,0.08)] transition group cursor-pointer"
                  >
                    {/* Top mood color accent line */}
                    <div 
                      className="absolute top-0 left-0 right-0 h-[3px]" 
                      style={{ backgroundColor: getMoodTopBarColor(day.mood) }}
                    />

                    {/* Left block: Column Date & Weekday */}
                    <div className="flex items-center gap-4">
                      <div className="text-center shrink-0 pr-4 border-r border-[#F4F1EA] py-0.5 select-none">
                        <div className="text-2xl font-extrabold text-zinc-800 font-sans leading-none">
                          {day.dayNum}
                        </div>
                        <div className="text-[9px] text-[#7C6FF7] font-bold uppercase tracking-wider mt-1.5">
                          {day.weekdayLabel}
                        </div>
                      </div>

                      {/* Middle block: Mood details and tags */}
                      <div className="text-left space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xl select-none" role="img">{day.moodEmoji}</span>
                          <span className="font-bold text-[13px] text-zinc-805">
                            {day.moodLabel}
                          </span>
                        </div>
                        
                        {/* Custom visual capsule tags */}
                        <div className="flex flex-wrap gap-1">
                          <span className="text-[9px] font-bold text-zinc-450 bg-[#FAF8F5] border border-zinc-100 rounded-md px-2 py-0.5 leading-tight">
                            Pression {day.pressure.toLowerCase()}
                          </span>
                          <span className="text-[9px] font-bold text-[#7C6FF7] bg-[#7C6FF7]/5 border border-[#7C6FF7]/10 rounded-md px-2 py-0.5 leading-tight">
                            Énergie {day.energy.toLowerCase()}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Right block: Chevron icon */}
                    <div className="text-zinc-300 group-hover:text-zinc-400 transition-colors shrink-0 select-none pl-2">
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        ) : (
          /* ========================================================================= */
          /* PAGE 2 — DÉTAIL D'UNE JOURNÉE                                             */
          /* ========================================================================= */
          <motion.div
            key="detail-screen"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="flex-1 flex flex-col min-h-0 overflow-y-auto overflow-x-hidden px-5 pt-6 pb-8"
            id="detail-screen-root"
          >
            {/* Header : flèche retour + date en titre + chevrons navigation */}
            <div className="flex items-center justify-between mb-6 select-none" id="detail-header-id">
              <div className="flex items-center gap-3.5">
                <button
                  onClick={handleBackToCalendar}
                  className="w-10 h-10 rounded-full bg-[#FAF8F5] hover:bg-[#F2ECE4] flex items-center justify-center text-zinc-700 border border-[#F4F1EA] transition active:scale-90 cursor-pointer shadow-xs"
                  id="btn-back-history"
                >
                  <ArrowLeft className="w-5 h-5 stroke-[2.5]" id="back-arrow-svg" />
                </button>
                <div className="text-left">
                  <h3 className="text-2xl font-bold text-zinc-805 tracking-tight leading-none">
                    {activeDay.frenchDisplayDate === "Aujourd'hui" ? "Aujourd'hui" : activeDay.frenchDisplayDate}
                  </h3>
                  <p className="text-[10px] text-[#7C6FF7] font-bold uppercase tracking-wider mt-1.5">
                    Bilan journalier
                  </p>
                </div>
              </div>

              {/* Day to day quick carousel arrows */}
              <div className="flex items-center space-x-0.5 bg-[#FAF8F5] border border-[#F4F1EA] p-1 rounded-full shadow-xs">
                <button
                  onClick={() => handleNavigateDay("prev")}
                  disabled={!hasPrevDay()}
                  className="p-1.5 rounded-full hover:bg-[#F2ECE4] text-zinc-650 disabled:opacity-20 transition cursor-pointer"
                  title="Jour précédent"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <div className="w-px h-4 bg-[#F2ECE4]" />
                <button
                  onClick={() => handleNavigateDay("next")}
                  disabled={!hasNextDay()}
                  className="p-1.5 rounded-full hover:bg-[#F2ECE4] text-zinc-650 disabled:opacity-20 transition cursor-pointer"
                  title="Jour suivant"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Carte humeur : grand smiley + titre humeur + tags ressenti */}
            <motion.div
              layoutId={`day-card-${activeDay.id}`}
              className={`rounded-2xl p-5 mb-5 shadow-3xs flex flex-col items-center justify-center text-center transition-all ${getMoodBgClass(
                activeDay.mood
              )}`}
              id="detail-mood-panel"
            >
              <div className="text-6xl select-none mb-3 drop-shadow-[0_4px_10px_rgba(0,0,0,0.06)]">
                {activeDay.moodEmoji}
              </div>
              <h4 className="text-lg font-bold text-zinc-800 mb-2 leading-tight">
                {activeDay.moodLabel}
              </h4>
              
              {/* Soft status labels */}
              <div className="flex flex-wrap gap-1.5 justify-center mt-1">
                {activeDay.themes.map((t, index) => (
                  <span
                    key={index}
                    className="text-[10px] font-bold text-zinc-600 bg-white/80 border border-zinc-100 rounded-full px-3.5 py-1 shadow-xs"
                  >
                    {t}
                  </span>
                ))}
                <span className="text-[10px] font-bold text-[#7C6FF7] bg-[#7C6FF7]/10 border border-[#7C6FF7]/20 rounded-full px-3.5 py-1 shadow-xs">
                  {getMoodEmojiLabel(activeDay.mood)}
                </span>
              </div>
            </motion.div>

            {/* Deux petites cartes côte à côte : Pression · Énergie */}
            <div className="grid grid-cols-2 gap-3.5 mb-6" id="metrics-horizontal-strip">
              {/* Card Pression */}
              <div className="bg-white border border-[#F4F1EA] p-4 rounded-2xl space-y-2.5 shadow-[0_2px_12px_rgba(0,0,0,0.05)]" id="pression-detail-strip">
                <div className="flex items-center gap-1.5">
                  <Activity className="w-4 h-4 text-rose-500 fill-rose-50" />
                  <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest leading-none">
                    Pression
                  </span>
                </div>
                
                {/* Visual tracker progress bar */}
                <div className="space-y-1.5 pt-1">
                  <div className="h-2 w-full bg-zinc-100 rounded-full overflow-hidden relative">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${activeDay.pressureLevel}%` }}
                      transition={{ duration: 0.6, ease: "easeOut" }}
                      className="h-full bg-gradient-to-r from-red-400 to-rose-400 rounded-full"
                    />
                  </div>
                  <div className="text-xs font-bold text-zinc-700">
                    {activeDay.pressure}
                  </div>
                </div>
              </div>

              {/* Card Energie */}
              <div className="bg-white border border-[#F4F1EA] p-4 rounded-2xl space-y-2.5 shadow-[0_2px_12px_rgba(0,0,0,0.05)]" id="energie-detail-strip">
                <div className="flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-amber-500 fill-amber-50" />
                  <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest leading-none">
                    Énergie
                  </span>
                </div>

                {/* Visual energy progress bar */}
                <div className="space-y-1.5 pt-1">
                  <div className="h-2 w-full bg-zinc-100 rounded-full overflow-hidden relative">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${activeDay.energyLevel}%` }}
                      transition={{ duration: 0.6, ease: "easeOut" }}
                      className="h-full bg-gradient-to-r from-amber-400 to-emerald-400 rounded-full"
                    />
                  </div>
                  <div className="text-xs font-bold text-zinc-700">
                    {activeDay.energy}
                  </div>
                </div>
              </div>
            </div>

            {/* Section "Ce que tu as partagé avec Mindy" */}
            <div className="bg-white border border-[#F4F1EA] p-5 rounded-2xl space-y-4 shadow-[0_2px_12px_rgba(0,0,0,0.05)] mb-6 text-left">
              <div className="flex items-center gap-3 select-none">
                <div className="w-10 h-10 rounded-xl bg-[#7C6FF7]/8 border border-[#7C6FF7]/15 text-[#7C6FF7] flex items-center justify-center shrink-0 shadow-2xs">
                  <Sparkles className="w-5 h-5 fill-[#7C6FF7]/10" />
                </div>
                <div>
                  <h4 className="text-[14px] font-bold text-zinc-805 leading-snug">
                    Ce que vous avez partagé avec Mindy
                  </h4>
                  <p className="text-[10px] text-zinc-400 font-medium leading-none mt-0.5">
                    Rétrospective et conseils personnalisés
                  </p>
                </div>
              </div>

              {/* Dialogue notes with cozy Speech bubble styling */}
              <div className="bg-[#FAF9FF] border border-[#7C6FF7]/8 p-4 rounded-xl relative">
                <div className="absolute top-4 -left-1.5 w-3 h-3 bg-[#FAF9FF] border-l border-b border-[#7C6FF7]/8 rotate-45" />
                <p className="text-[12px] italic text-zinc-705 leading-relaxed font-semibold relative z-10">
                  "{activeDay.notes}"
                </p>
              </div>

              {/* Custom discussion labels */}
              <div className="flex flex-wrap gap-1.5 pt-0.5 select-none">
                {activeDay.themes.map((theme, i) => (
                  <span
                    key={i}
                    className="text-[10px] font-semibold text-[#7C6FF7] bg-[#7C6FF7]/5 hover:bg-[#7C6FF7]/10 px-3 py-1 rounded-full transition-colors border border-transparent hover:border-[#7C6FF7]/10 cursor-default"
                  >
                    #{theme}
                  </span>
                ))}
              </div>
            </div>

            {/* Section "Exercices faits ce jour" */}
            <div className="space-y-3.5">
              <h3 className="text-[11px] font-bold tracking-wider text-zinc-400 uppercase select-none flex items-center gap-1.5">
                <ClipboardCheck className="w-4 h-4 text-[#7C6FF7]" />
                <span>EXERCICES FAITS CE JOUR</span>
              </h3>

              <div className="space-y-3">
                {activeDay.exercises.length > 0 ? (
                  activeDay.exercises.map((ex, i) => (
                    <div
                      key={i}
                      className="relative overflow-hidden bg-white rounded-2xl p-4 flex items-center justify-between shadow-[0_2px_12px_rgba(0,0,0,0.05)] border border-[#F4F1EA] group"
                    >
                      {/* Top color bar identifier match */}
                      <div 
                        className="absolute top-0 left-0 right-0 h-[3px]" 
                        style={{ backgroundColor: getHistoryExerciseTopColor(ex.name) }}
                      />

                      <div className="flex items-center gap-3 text-left">
                        {/* Elegant icon rounded background */}
                        <div className="w-11 h-11 rounded-full bg-[#FAF8F5] flex items-center justify-center shrink-0">
                          {getHistoryExerciseIcon(ex.name)}
                        </div>
                        <div className="space-y-0.5">
                          <h5 className="font-bold text-[13px] text-zinc-800 leading-tight">
                            {ex.name}
                          </h5>
                          <p className="text-[11px] text-zinc-450">
                            ⏱ {ex.duration} • {ex.subtitle}
                          </p>
                        </div>
                      </div>

                      {/* Right feedback tag */}
                      <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-full px-3 py-1 select-none">
                        Terminé
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-zinc-450 border border-dashed border-[#F4F1EA] rounded-2xl bg-[#FAF8F5]">
                    <p className="text-xs">Aucun exercice de respiration aujourd'hui.</p>
                  </div>
                )}
              </div>
            </div>
            
            {/* Call to actions to return home / seek further relief */}
            <div className="pt-6 select-none animate-fade-in" id="history-detail-ctas">
              <button
                onClick={handleBackToCalendar}
                className="w-full py-3.5 border border-[#F4F1EA] hover:bg-[#FAF8F5] hover:text-zinc-750 text-zinc-500 font-semibold rounded-2xl text-xs transition duration-200 active:scale-98 cursor-pointer"
              >
                Retour au calendrier
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
