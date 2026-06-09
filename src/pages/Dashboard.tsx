import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { UserProfile, CheckInRecord } from "../types";

interface DashboardProps {
  setPath: (path: string) => void;
  userProfile: UserProfile;
  checkIns: CheckInRecord[];
}

const BADGES = [
  { id: "step", label: "Premier pas", desc: "Premier check-in enregistré.", color: "text-emerald-500 bg-emerald-50 border-emerald-100", icon: "ti-award" },
  { id: "reg", label: "Régularité", desc: "3 jours de suivi consécutifs.", color: "text-orange-500 bg-orange-50 border-orange-100", icon: "ti-flame" },
  { id: "zen", label: "Havre Zen", desc: "A exploré la cohérence cardiaque.", color: "text-[#7C6FF7] bg-purple-50 border-purple-100", icon: "ti-sparkles" },
];

export default function Dashboard({ setPath, userProfile, checkIns }: DashboardProps) {
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [showStreakModal, setShowStreakModal] = useState(false);

  // Dynamic french date layout: e.g., "Mardi 9 juin"
  const getFrenchDate = () => {
    try {
      const options: Intl.DateTimeFormatOptions = { weekday: "long", day: "numeric", month: "long" };
      const raw = new Date().toLocaleDateString("fr-FR", options);
      return raw.charAt(0).toUpperCase() + raw.slice(1);
    } catch {
      return "Aujourd'hui";
    }
  };

  // Setup default historical logs if none exist to draw an beautiful charts trendline (Reference 2)
  const defaultLogs: CheckInRecord[] = [
    { id: "log-1", date: "05-06", mood: 3, pressure: "Modérée", energy: "Modérée", notes: "" },
    { id: "log-2", date: "06-06", mood: 4, pressure: "Faible", energy: "Pleine", notes: "" },
    { id: "log-3", date: "07-06", mood: 2, pressure: "Élevée", energy: "Vide", notes: "" },
    { id: "log-4", date: "08-06", mood: 4, pressure: "Modérée", energy: "Modérée", notes: "" },
  ];

  const combinedRecords = [...defaultLogs, ...checkIns];
  // Keep only the last 5 records
  const trendHistory = combinedRecords.slice(-5);

  const getMoodEmoji = (moodValue: number) => {
    if (moodValue <= 1) return "😞";
    if (moodValue === 2) return "🥺";
    if (moodValue === 3) return "😐";
    if (moodValue === 4) return "🙂";
    return "💡";
  };

  // Active user mood representation
  const activeMoodValue = checkIns[checkIns.length - 1]?.mood || 4;
  const activeMoodLabel = checkIns.length > 0 ? "Bilan Actif" : "En attente";

  // Build points path for SVG line graph (height 100, width 320)
  const buildSvgPath = () => {
    if (trendHistory.length < 2) return "";
    return trendHistory
      .map((rec, idx) => {
        const x = (idx / (trendHistory.length - 1)) * 280 + 20;
        // Mood 1 to 5 mapped to coordinate space (heights: 5: 20px, 1: 80px)
        const y = 80 - (rec.mood - 1) * 15;
        return `${x},${y}`;
      })
      .join(" ");
  };

  return (
    <div className="flex-1 flex flex-col bg-zinc-50 select-none pb-8 overflow-y-auto min-h-0 w-full max-w-md mx-auto" id="dashboard-container">
      
      {/* 1. HEADER AREA: Date, Name, Cloche, Profil */}
      <div className="px-5 pt-5 pb-3 flex justify-between items-start" id="dashboard-header">
        <div>
          <span className="text-zinc-400 text-xs font-medium tracking-wide block relative" id="header-date">
            {getFrenchDate()}
          </span>
          <h2 className="text-2xl font-bold tracking-tight text-zinc-900 mt-0.5" id="header-greeting">
            Bonjour {userProfile.name || "Ami"},
          </h2>
        </div>

        {/* Action icons */}
        <div className="flex items-center space-x-2.5" id="header-actions">
          <button
            onClick={() => setShowNotificationModal(true)}
            className="w-10 h-10 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-700 hover:bg-zinc-200 transition-all active:scale-95 cursor-pointer border border-transparent hover:border-zinc-200"
            title="Notifications"
            id="btn-notif"
          >
            <i className="ti ti-bell text-lg"></i>
          </button>
          <button
            onClick={() => setPath("parametres")}
            className="w-10 h-10 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-700 hover:bg-zinc-200 transition-all active:scale-95 cursor-pointer border border-transparent hover:border-zinc-200"
            title="Mon Profil"
            id="btn-profil"
          >
            <i className="ti ti-user text-lg"></i>
          </button>
        </div>
      </div>

      {/* 2. DUAL METRICS ROW: Streak & Today's Weather Status */}
      <div className="px-5 grid grid-cols-2 gap-3" id="dual-metrics-row">
        {/* Streak Block */}
        <div
          onClick={() => setShowStreakModal(true)}
          className="bg-zinc-100/70 border border-zinc-200/50 hover:bg-zinc-100 rounded-2xl p-3.5 flex items-center space-x-2.5 transition active:scale-98 cursor-pointer"
          id="metric-streak-card"
        >
          <span className="text-xl select-none">🔥</span>
          <div className="leading-tight">
            <h4 className="font-bold text-sm text-zinc-900">{userProfile.streak || 5}</h4>
            <p className="text-[10px] text-zinc-500 font-medium whitespace-nowrap">jours de suite</p>
          </div>
        </div>

        {/* Daily Weather Status block */}
        <div
          onClick={() => setPath("check-in")}
          className="bg-zinc-100/70 border border-zinc-200/50 hover:bg-zinc-100 rounded-2xl p-3.5 flex items-center space-x-2.5 transition active:scale-98 cursor-pointer"
          id="metric-weather-card"
        >
          <span className="text-xl select-none">⛅</span>
          <div className="leading-tight">
            <h4 className="font-bold text-sm text-zinc-900">Météo</h4>
            <p className="text-[10px] text-zinc-500 font-medium whitespace-nowrap">
              {checkIns.length > 0 ? "Complétée" : "à compléter"}
            </p>
          </div>
        </div>
      </div>

      {/* 3. CENTER MINDY AVATAR COMPANION SECTION (Reference 1) */}
      <div className="px-5 py-7 flex flex-col items-center justify-center text-center space-y-4" id="mindy-companion-section">
        {/* Concentric Lavender rings with custom automatic breathing flow */}
        <div className="relative w-36 h-36 flex items-center justify-center select-none" id="avatar-concentric-container">
          {/* Inner pulsating loop rings */}
          <motion.div
            animate={{ scale: [1, 1.15, 1], opacity: [0.15, 0.3, 0.15] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-0 rounded-full bg-[#7C6FF7]/10"
          />
          <motion.div
            animate={{ scale: [1, 1.08, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute inset-4 rounded-full bg-[#7C6FF7]/20"
          />
          {/* Main Solid Core Avatar */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="relative w-20 h-20 rounded-full bg-gradient-to-tr from-[#7C6FF7] to-[#9D91FF] flex items-center justify-center shadow-md shadow-brand-lavender/40 z-10"
            id="avatar-core"
          >
            <div className="absolute inset-1 rounded-full border border-white/20" />
            <span className="text-3xl text-white">🌸</span>
          </motion.div>
        </div>

        {/* Greeting block and action button */}
        <div className="space-y-4 w-full" id="mindy-prompt-box">
          <p className="text-zinc-600 text-sm font-medium italic select-none" id="mindy-greeting-text">
            " Salut ! Comment vas-tu aujourd'hui ? "
          </p>

          <div className="flex justify-center">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setPath("chatbot")}
              className="px-5 py-2 hover:bg-zinc-900 hover:text-white transition duration-200 border border-neutral-850/80 rounded-full text-xs font-bold text-zinc-800 bg-white flex items-center space-x-2 cursor-pointer shadow-xs"
              id="talk-with-mindy-btn"
            >
              <i className="ti ti-message-2 text-sm"></i>
              <span>Parler avec Mindy</span>
            </motion.button>
          </div>
        </div>
      </div>

      {/* 4. CHECK-IN DU JOUR CALENDAR BANNER */}
      <div className="px-5 mb-5" id="checkin-banner-wrapper">
        <div className="bg-[#FAF9FF] border border-[#7C6FF7]/20 rounded-3xl p-4 flex justify-between items-center" id="checkin-today-card">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-[#EFEFFF] flex items-center justify-center text-[#7C6FF7] shrink-0">
              <i className="ti ti-clipboard-check text-lg"></i>
            </div>
            <div>
              <h4 className="text-xs font-bold text-zinc-900" id="checkin-title">Check-in du jour</h4>
              <p className="text-[10px] text-zinc-400 font-medium">4 questions · 1 min</p>
            </div>
          </div>

          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={() => setPath("check-in")}
            className="bg-[#7C6FF7] text-white text-[10px] tracking-wider uppercase font-bold px-4 py-2 rounded-xl hover:bg-[#6A5DE6] transition cursor-pointer"
            id="start-checkin-btn"
          >
            {checkIns.length > 0 ? "Refaire" : "Commencer"}
          </motion.button>
        </div>
      </div>

      {/* 5. CO-Metrics: MOOD ESTIMATION & AWARD STATE (Reference 2) */}
      <div className="px-5 grid grid-cols-2 gap-3 mb-5" id="estimations-grid">
        {/* Moral Estimé */}
        <div className="bg-white border border-zinc-200/50 rounded-3xl p-4 text-center flex flex-col justify-center items-center shadow-xs" id="moral-estim-card">
          <div className="w-12 h-12 rounded-full bg-zinc-50 border border-zinc-100 flex items-center justify-center text-3xl select-none mb-1.5 shadow-2xs">
            {getMoodEmoji(activeMoodValue)}
          </div>
          <h4 className="text-[9px] uppercase font-bold tracking-widest text-[#2C2929]/50">
            Moral Estimé
          </h4>
          <p className="text-xs font-bold text-zinc-700 mt-0.5">
            {activeMoodLabel}
          </p>
        </div>

        {/* Récompense */}
        <div className="bg-white border border-zinc-200/50 rounded-3xl p-4 text-center flex flex-col justify-center items-center shadow-xs" id="rewards-card">
          <div className="w-12 h-12 rounded-full bg-[#EFEFFF] border border-purple-100/30 flex items-center justify-center text-[#7C6FF7] mb-1.5 shadow-2xs">
            <i className="ti ti-award text-xl"></i>
          </div>
          <h4 className="text-[9px] uppercase font-bold tracking-widest text-[#2C2929]/50">
            Récompense
          </h4>
          <p className="text-xs font-bold text-zinc-700 mt-0.5">
            3 insignes acquis
          </p>
        </div>
      </div>

      {/* 6. EMOTIONAL WEATHER LINE CHART WITH SMILEYS (Reference 2) */}
      <div className="px-5 mb-5" id="trends-chart-wrapper">
        <div className="bg-white border border-zinc-200/50 rounded-3xl p-4 shadow-sm" id="linear-chart-card">
          <h4 className="text-[11px] font-bold text-zinc-800 tracking-tight flex items-center justify-between" id="chart-header">
            <span>Courbe de météo émotionnelle</span>
            <span className="text-[9px] text-zinc-400 font-normal">Sondage récent</span>
          </h4>

          <div className="relative h-28 w-full mt-4 select-none" id="svg-trend-wrapper">
            <svg className="w-full h-full overflow-visible" viewBox="0 0 320 100">
              {/* Reference Grid lines */}
              <line x1="10" y1="20" x2="310" y2="20" stroke="#f4f4f5" strokeWidth="1" />
              <line x1="10" y1="50" x2="310" y2="50" stroke="#f4f4f5" strokeWidth="1" />
              <line x1="10" y1="80" x2="310" y2="80" stroke="#f4f4f5" strokeWidth="1" />

              {/* Seamless connecting line */}
              <polyline
                fill="none"
                stroke="#9D91FF"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={buildSvgPath()}
              />

              {/* Data points with Emoji Overlays */}
              {trendHistory.map((rec, idx) => {
                const x = (idx / (trendHistory.length - 1)) * 280 + 20;
                const y = 80 - (rec.mood - 1) * 15;
                return (
                  <g key={rec.id} className="cursor-pointer">
                    <circle
                      cx={x}
                      cy={y}
                      r="10"
                      className="fill-white stroke-[#7C6FF7] stroke-2 shadow-2xs"
                    />
                    <text
                      x={x}
                      y={y + 3.5}
                      textAnchor="middle"
                      className="text-[9px]"
                    >
                      {getMoodEmoji(rec.mood)}
                    </text>
                    <text
                      x={x}
                      y="98"
                      textAnchor="middle"
                      className="text-[8px] font-semibold fill-zinc-450"
                    >
                      {rec.date}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>
      </div>

      {/* 7. RECOMPENSES / BADGES SECTION (Reference 2) */}
      <div className="px-5 mb-5" id="badges-block-wrapper">
        <div className="bg-white border border-zinc-200/50 rounded-3xl p-4 shadow-sm" id="badges-card">
          <h4 className="text-[11px] font-bold text-zinc-800 select-none tracking-tight flex items-center space-x-1.5" id="badges-header">
            <i className="ti ti-crown text-base text-[#7C6FF7]"></i>
            <span>Insignes d'accompagnement</span>
          </h4>

          <div className="space-y-2.5 mt-3.5" id="badges-rows">
            {BADGES.map((b) => (
              <div
                key={b.id}
                className="flex items-center space-x-3 p-3 rounded-2xl bg-zinc-100/50 border border-zinc-150/50 hover:bg-zinc-100 transition-all cursor-pointer"
                id={`badge-row-${b.id}`}
              >
                <div className={`w-9 h-9 rounded-2xl flex items-center justify-center shrink-0 border font-bold text-sm ${b.color}`}>
                  <i className={`ti ${b.icon}`}></i>
                </div>
                <div>
                  <h5 className="text-[11px] font-bold text-zinc-900 leading-tight">{b.label}</h5>
                  <p className="text-[9.5px] text-zinc-450 mt-0.5 leading-none">{b.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 8. WELLNESS CONTEXT ADVICE (Reference 2) */}
      <div className="px-5" id="wellness-advice-wrapper">
        <div className="bg-emerald-50/40 border border-emerald-100/60 hover:bg-emerald-50/60 transition p-4 rounded-3xl flex items-start space-x-3.5 shadow-sm" id="wellness-tip-card">
          <div className="w-9 h-9 rounded-2xl bg-emerald-100/50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100">
            <i className="ti ti-shield-alert text-base"></i>
          </div>
          <div className="space-y-0.5">
            <h4 className="text-[11px] font-bold text-emerald-900">Conseil d'auto-bienveillance</h4>
            <p className="text-[9.5px] text-emerald-850 leading-relaxed font-medium">
              N'hésite pas à faire un arrêt Stop S.O.S si tu ressens que l'ambiance devient trop agitée. Notre havre est là pour ça.
            </p>
          </div>
        </div>
      </div>

      {/* --- FLOATING MODALS & OVERLAYS INTERACTIVITY --- */}
      
      {/* A. Notifications View Modal */}
      <AnimatePresence>
        {showNotificationModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-neutral-900/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs"
            id="notif-modal-backdrop"
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="bg-white rounded-3xl p-5 w-full max-w-[325px] space-y-4 shadow-xl text-center border border-zinc-100"
              id="notif-modal-body"
            >
              <div className="w-12 h-12 rounded-2xl bg-brand-lavender/40 text-[#7C6FF7] flex items-center justify-center mx-auto shadow-2xs">
                <i className="ti ti-bell-ringing text-xl animate-bounce"></i>
              </div>
              
              <div className="space-y-1.5">
                <h3 className="text-sm font-bold text-zinc-900">Météo Intérieure</h3>
                <p className="text-[11px] text-zinc-500 leading-relaxed px-1">
                  C'est l'heure de ton moment d'auto-bienveillance. Prends une minute pour respirer profondément et écouter tes émotions d'aujourd'hui.
                </p>
              </div>

              <button
                onClick={() => setShowNotificationModal(false)}
                className="w-full py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white font-bold rounded-xl text-xs uppercase tracking-wider cursor-pointer"
                id="close-notif-btn"
              >
                Tout est en paix
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* B. Streak Celebration Modal */}
      <AnimatePresence>
        {showStreakModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-neutral-900/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs"
            id="streak-modal-backdrop"
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="bg-white rounded-3xl p-5 w-full max-w-[325px] space-y-4 shadow-xl text-center border border-zinc-100"
              id="streak-modal-body"
            >
              <span className="text-4xl block animate-pulse select-none">🔥</span>
              
              <div className="space-y-1.5">
                <h3 className="text-sm font-bold text-zinc-900">Série active : {userProfile.streak || 5} jours</h3>
                <p className="text-[11px] text-zinc-500 leading-relaxed px-1">
                  Garde le rythme ! Chaque session t'ancre un peu plus profond dans ton bien-être. Ton assiduité est source d'inspiration.
                </p>
              </div>

              <button
                onClick={() => setShowStreakModal(false)}
                className="w-full py-2.5 bg-[#7C6FF7] hover:bg-[#6A5DE6] text-white font-bold rounded-xl text-xs uppercase tracking-wider cursor-pointer"
                id="close-streak-btn"
              >
                Génial, je continue !
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
