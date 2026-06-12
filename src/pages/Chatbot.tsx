import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChatMessage, UserProfile } from "../types";

interface ChatbotProps {
  setPath: (path: string) => void;
  userProfile: UserProfile;
}

const STARTERS = [
  "😊 Je me sens bien aujourd'hui",
  "🥺 Je me sens un peu stressé",
  "🌙 J'ai du mal à dormir",
  "🧘 Propose-moi un exercice",
];

const EXERCISE_CATALOG_CARDS = [
  {
    id: "coherence-cardiaque",
    title: "Cohérence Cardiaque",
    duration: "3 min",
    description: "Prends un temps pour équilibrer ton rythme cardiaque et apaiser tes tensions physiques.",
    category: "Respiration",
    color: "bg-teal-500",
    badgeEffect: "Apaisement",
    icon: "🧘",
    keywords: ["stress", "anxieu", "anxiété", "coeur", "respir", "cardiaque", "souffler", "battement", "angoisse", "panique"]
  },
  {
    id: "respiration-carree",
    title: "Respiration Carrée",
    duration: "4 min",
    description: "Une respiration structurée pour chasser les pensées de fond et canaliser ton focus.",
    category: "Respiration",
    color: "bg-blue-500",
    badgeEffect: "Focus",
    icon: "🟩",
    keywords: ["concentr", "attention", "pensée", "mental", "focus", "rumination", "bloqué", "idées noire", "carre"]
  },
  {
    id: "ancrage-sensoriel",
    title: "Ancrage Sensoriel",
    duration: "5 min",
    description: "La méthode d'ancrage 5-4-3-2-1 pour te reconnecter à l'instant présent en toute douceur.",
    category: "Ancrage",
    color: "bg-amber-500",
    badgeEffect: "Clarté/Calme",
    icon: "👁",
    keywords: ["perdu", "réalité", "panique", "peur", "ancrage", "capteur", "cinq", "sensoriel", "crise d'angoisse", "angoisse intense"]
  },
  {
    id: "scan-corporel",
    title: "Scan Corporel",
    duration: "5 min",
    description: "Un voyage attentif à travers ton corps entier pour dénouer les crispations accumulées.",
    category: "Corps",
    color: "bg-purple-500",
    badgeEffect: "Détente",
    icon: "💫",
    keywords: ["corps", "tendu", "muscle", "dos", "physique", "fatigue", "douleur", "somat", "crisp"]
  },
  {
    id: "stretch",
    title: "Stretch & Soupir",
    duration: "2 min",
    description: "Deux minutes d'étirement simples pour libérer le diaphragme de l'étau du stress.",
    category: "Corps",
    color: "bg-indigo-500",
    badgeEffect: "Déblocage",
    icon: "🧍",
    keywords: ["etir", "stretch", "diaphragme", "thorax", "soupir", "mouvement", "bloquer", "poitrine serrée"]
  },
  {
    id: "affirmations",
    title: "Affirmations Positives",
    duration: "2 min",
    description: "Une douce sélection de paroles compatissantes pour nourrir l'estime de soi.",
    category: "Visualisation",
    color: "bg-rose-500",
    badgeEffect: "Estime",
    icon: "⭐",
    keywords: ["triste", "nul", "confiance", "culpabilité", "peine", "deprim", "cafard", "doute", "affirmation", "motiver"]
  },
  {
    id: "meditation-nuages",
    title: "Méditation des Nuages",
    duration: "3 min",
    description: "Une visualisation aérienne pour souffler doucement tes pensées agitées vers l'horizon.",
    category: "Visualisation",
    color: "bg-sky-500",
    badgeEffect: "Légèreté",
    icon: "☁",
    keywords: ["sommeil", "nuage", "insomnie", "ciel", "imaginer", "dort", "dormir", "nuit", "flotter"]
  },
  {
    id: "gratitude",
    title: "3 Gratitudes du Jour",
    duration: "3 min",
    description: "Met en lumière trois souvenirs doux de ta journée pour rééduquer ton précieux regard.",
    category: "Écriture",
    color: "bg-emerald-500",
    badgeEffect: "Positivité",
    icon: "🙏",
    keywords: ["merci", "positif", "reconnaissant", "gratitude", "bonheur", "plaisir", "journée"]
  },
  {
    id: "journal-sos",
    title: "Journal de décharge (SOS)",
    duration: "Libre",
    description: "Un espace d'expression libre et confidentiel pour vider tout ton sac sans filtre.",
    category: "Écriture",
    color: "bg-red-500",
    badgeEffect: "Libération",
    icon: "✍️",
    keywords: ["vider", "écrire", "sac", "pleurer", "colère", "haine", "journal"]
  }
];

export default function Chatbot({ setPath, userProfile }: ChatbotProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome-1",
      sender: "mindy",
      text: `Bonjour ${userProfile.name || "Ami"} 🌤 Content de te retrouver. Comment tu vas aujourd'hui ?`,
      timestamp: "09:14",
    },
    {
      id: "welcome-2",
      sender: "mindy",
      text: "Tu peux me répondre librement ou choisir une option ci-dessous 👇",
      timestamp: "09:14",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  
  // Custom interactive modals for options
  const [activeModal, setActiveModal] = useState<string | null>(null);

  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
    if (!window.visualViewport) return;

    const handleResize = () => {
      const vv = window.visualViewport;
      if (!vv) return;
      const diff = window.innerHeight - vv.height;
      if (diff > 80) {
        setKeyboardHeight(diff);
      } else {
        setKeyboardHeight(0);
      }
    };

    window.visualViewport.addEventListener("resize", handleResize);
    window.visualViewport.addEventListener("scroll", handleResize);
    handleResize();

    return () => {
      window.visualViewport?.removeEventListener("resize", handleResize);
      window.visualViewport?.removeEventListener("scroll", handleResize);
    };
  }, []);

  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (scrollAreaRef.current) {
        scrollAreaRef.current.scrollTo({
          top: scrollAreaRef.current.scrollHeight,
          behavior: "smooth",
        });
      }
    }, 100);
    return () => clearTimeout(timer);
  }, [messages, loading, keyboardHeight]);

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim()) return;

    // Append user message
    const userMsg: ChatMessage = {
      id: Math.random().toString(36).substring(7),
      sender: "user",
      text: textToSend.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    // Safety checks / Trigger SOS redirect warning if trigger words are detected
    const sensitiveWords = ["suicide", "mourir", "finir ma vie", "crise de panique intense", "urgence", "3114"];
    const hasSensitive = sensitiveWords.some((word) => textToSend.toLowerCase().includes(word));

    if (hasSensitive) {
      setTimeout(() => {
        const sosMsg: ChatMessage = {
          id: Math.random().toString(36).substring(7),
          sender: "system",
          text: "Je ressens une très vive détresse dans tes mots. Nous prenons cela très au sérieux. Sache que Mindy ne remplace pas une aide professionnelle. Je t'invite à contacter immédiatement les secours (15) ou le numéro national de prévention du suicide (3114, gratuit et anonyme 24/7).",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        };
        setMessages((prev) => [...prev, sosMsg]);
        setLoading(false);
      }, 1200);
      return;
    }

    try {
      // Setup payload instruction matching the prompt charter
      const systemInstruction = `IDENTITÉ :
Tu es Mindy, un compagnon de bien-être mental chaleureux, doux et profondément empathique.
Ton objectif est d'offrir un espace de parole sécurisant et non-jugeant.
DIRECTIVES DE COMMUNICATION :
1. TUTOIEMENT : Utilise TOUJOURS le "tu". C'est essentiel pour la proximité.
2. TON : Chaleureux, validant, apaisant. Ne sois pas trop formel ni trop clinique.
3. STRUCTURE : Fais des réponses relativement courtes pour favoriser l'échange.
4. MISE EN FORME : Uniquement du texte brut. INTERDICTION d'utiliser du gras (**), de l'italique (*) ou des listes à puces complexes.
CADRE ÉTHIQUE ET SÉCURITÉ :
- PAS DE DIAGNOSTIC : Tu ne peux pas dire "Tu es dépressif" ou "C'est de l'anxiété généralisée". Préfère : "Ce que tu décris ressemble à un moment de grand stress".
- PAS DE MÉDICAMENTS : Ne conseille jamais de traitement. Renvoie vers un médecin.
- SITUATIONS SENSIBLES ET RÉPÉTITION DES RESSOURCES :
 * PREMIÈRE FOIS dans la session : Message complet (empathie, proposition claire d'appeler, numéro concerné, proposition d'aide pour préparer l'appel).
 * DEUXIÈME FOIS dans la session : Version abrégée (rappel court du numéro, mention rapide de l'aide à la préparation, ton plus synthétique).
 * À PARTIR DE LA TROISIÈME FOIS : Si le risque critique est toujours détecté, rappeler les ressources d’aide de manière courte, sans insister inutilement, et maintenir l’orientation vers une aide humaine.
ACTIONS SPÉCIALES (BALISES D'EXERCICES) :
Si tu juges qu'un exercice peut aider l'utilisateur, insère UNE SEULE des balises suivantes à la toute fin de ton message :

1. CRISE D'ANGOISSE / PANIQUE / STRESS AIGU (Choisir l'un des trois) :
 - [ACTION:EXERCISE:COHERENCE] (Respiration rythmée)
 - [ACTION:EXERCISE:ANCRAGE] (Focus sur les sens)
 - [ACTION:EXERCISE:RESPIRATION_CARREE] (Stabilisation)
2. BESOIN DE DÉTENTE / RELÂCHEMENT PHYSIQUE :
 - [ACTION:EXERCISE:SCAN_CORPOREL]
3. MORAL BAS / BESOIN DE POSITIVITÉ (Choisir l'un des trois) :
 - [ACTION:EXERCISE:AFFIRMATIONS]
 - [ACTION:EXERCISE:GRATITUDE]
 - [ACTION:EXERCISE:MEDITATION_NUAGE]
4. BESOIN DE DÉCHARGE ÉMOTIONNELLE / VIDER SON SAC :
 - [ACTION:EXERCISE:VIDER_SAC]
RÈGLES CRUCIALES POUR LES BALISES :
- INTERDICTION ABSOLUE de décrire l'exercice ou de donner des instructions techniques dans ton texte.
- Mentionne juste très brièvement qu'un exercice spécifique peut aider.
- Une seule balise par réponse, placée tout à la fin.
- Tu ne peux proposer un exercice qu'une seule fois par session.
MÉTHODE D'ACCOMPAGNEMENT :
Si tu orientes vers un professionnel (ex: Alcool Info Service), propose toujours de "préparer l'appel ensemble" ou de simuler le début de la conversation pour réduire l'appréhension de l'utilisateur.`;

      const res = await fetch("/api/gemini/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: textToSend, systemInstruction }),
      });
      const data = await res.json();
      let replyText = data?.text || "Pardon, de quoi souhaites-tu parler ? Inspire doucement...";
      
      // Try to find if there is an Action tag in the replyText
      let matchedExercise = null;
      const tagRegex = /\[ACTION:EXERCISE:([A-Z_]+)\]/;
      const match = replyText.match(tagRegex);
      
      // Clean up tag from text displayed to the user
      if (match) {
        replyText = replyText.replace(tagRegex, "").trim();
      }

      // Respect session constraint: only one exercise recommendation per session
      const alreadyProposed = messages.some((m) => m.exerciseSuggested);

      if (!alreadyProposed) {
        if (match) {
          const actionType = match[1];
          let targetId = "";
          if (actionType === "COHERENCE") targetId = "coherence-cardiaque";
          else if (actionType === "RESPIRATION_CARREE") targetId = "respiration-carree";
          else if (actionType === "ANCRAGE") targetId = "ancrage-sensoriel";
          else if (actionType === "SCAN_CORPOREL") targetId = "scan-corporel";
          else if (actionType === "AFFIRMATIONS") targetId = "affirmations";
          else if (actionType === "GRATITUDE") targetId = "gratitude";
          else if (actionType === "MEDITATION_NUAGE") targetId = "meditation-nuages";
          else if (actionType === "VIDER_SAC") targetId = "journal-sos";

          if (targetId) {
            const found = EXERCISE_CATALOG_CARDS.find((ex) => ex.id === targetId);
            if (found) {
              matchedExercise = found;
            }
          }
        } else {
          // Fallback keyword search for general questions
          const combinedTextForMatching = (textToSend + " " + replyText).toLowerCase();
          const explicitAsk = ["exercice", "activité", "proposer", "conseille", "faire", "pratique", "aide-moi"].some(kw => textToSend.toLowerCase().includes(kw));
          const found = EXERCISE_CATALOG_CARDS.find(ex => ex.id !== "journal-sos" && ex.keywords.some(kw => combinedTextForMatching.includes(kw)));
          
          if (found) {
            matchedExercise = found;
          } else if (explicitAsk) {
            matchedExercise = EXERCISE_CATALOG_CARDS[0]; // Cohérence Cardiaque
          }
        }
      }

      const mindyMsg: ChatMessage = {
        id: Math.random().toString(36).substring(7),
        sender: "mindy",
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        ...(matchedExercise && {
          exerciseSuggested: {
            id: matchedExercise.id,
            title: matchedExercise.title,
            duration: matchedExercise.duration,
            description: matchedExercise.description,
            category: matchedExercise.category,
            color: matchedExercise.color,
            badgeEffect: matchedExercise.badgeEffect,
            icon: matchedExercise.icon,
          },
          exerciseActionState: "pending" as const
        })
      };
      
      // Deliberate 1.2s typing transition simulator to enhance reality & feel (Reference 2)
      setTimeout(() => {
        setMessages((prev) => [...prev, mindyMsg]);
        setLoading(false);
      }, 1200);

    } catch (e) {
      console.error(e);
      const errMsg: ChatMessage = {
        id: Math.random().toString(36).substring(7),
        sender: "mindy",
        text: "Pardon, ma connexion s'est un peu voilée. Prenons simplement une grande inspiration ensemble... Inspire, retiens, et souffle lentement.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      
      setTimeout(() => {
        setMessages((prev) => [...prev, errMsg]);
        setLoading(false);
      }, 1200);
    }
  };

  const handleAcceptExercise = (msgId: string, exId: string) => {
    // 1. Mark as started
    setMessages((prev) =>
      prev.map((m) =>
        m.id === msgId ? { ...m, exerciseActionState: "started" } : m
      )
    );
    // 2. Redirect to specific exercise screen
    setTimeout(() => {
      setPath(`exercices/${exId}`);
    }, 450);
  };

  const handlePostponeExercise = (msgId: string) => {
    // 1. Mark as postponed
    setMessages((prev) =>
      prev.map((m) =>
        m.id === msgId ? { ...m, exerciseActionState: "postponed" } : m
      )
    );
    // 2. Add gentle delay, then Mindy responds to postponement
    setLoading(true);
    setTimeout(() => {
      const followUpMsg: ChatMessage = {
        id: Math.random().toString(36).substring(7),
        sender: "mindy",
        text: "Pas de soucis, prends tout ton temps 🌱 Nous ferons cela quand tu te sentiras disponible et prêt. Dis-moi si tu as besoin d'autre chose en attendant.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, followUpMsg]);
      setLoading(false);
    }, 1200);
  };

  // Specific Actions from action dots
  const handleResetConversation = () => {
    setMessages([
      {
        id: "welcome-1",
        sender: "mindy",
        text: `Bonjour ${userProfile.name || "Ami"} 🌤 Content de te retrouver. Comment tu vas aujourd'hui ?`,
        timestamp: "09:14",
      },
      {
        id: "welcome-2",
        sender: "mindy",
        text: "Tu peux me répondre librement ou choisir une option ci-dessous 👇",
        timestamp: "09:14",
      },
    ]);
    setShowDropdown(false);
  };

  const handleExportConversation = () => {
    setShowDropdown(false);
    setActiveModal("export");
  };

  const handleShowAbout = () => {
    setShowDropdown(false);
    setActiveModal("about");
  };

  const handleDeleteConversation = () => {
    setMessages([]);
    setShowDropdown(false);
    setActiveModal("delete");
  };

  const handleShowHistory = () => {
    setShowDropdown(false);
    setActiveModal("history");
  };

  return (
    <div 
      className="flex-1 flex flex-col justify-between min-h-0 h-full bg-[#FAF8FD] relative select-none w-full max-w-md mx-auto max-h-full" 
      id="chatbot-page-root"
    >
      
      {/* 1. FIXED HEADER AREA */}
      <div className="px-5 py-4 bg-white border-b border-zinc-100 flex items-center justify-between z-20 shrink-0 select-none relative shadow-xs" id="chatbot-header">
        {/* Back button (←) inside a styled light circle */}
        <button
          onClick={() => setPath("dashboard")}
          className="w-10 h-10 rounded-full bg-zinc-50 hover:bg-zinc-100 flex items-center justify-center text-zinc-800 border border-zinc-100 transition active:scale-95 cursor-pointer shrink-0"
          id="chatbot-back-btn"
        >
          <i className="ti ti-arrow-left text-lg"></i>
        </button>

        {/* Centered Companion header details */}
        <div className="flex-1 flex items-center justify-center space-x-3 px-2">
          {/* Custom professional Dual-Tone circle avatar with pulsing status dot */}
          <div className="relative shrink-0" id="chatbot-avatar-wrapper">
            <div className="w-10 h-10 rounded-full bg-brand-lavender/60 flex items-center justify-center shadow-xs relative">
              <span className="text-sm select-none">{userProfile.mindyEmoji || ""}</span>
              {/* Pulsing online status circle badge */}
              <div className="absolute right-[-1px] bottom-[-1px] w-3 h-3 rounded-full bg-[#4ade80] ring-2 ring-white flex items-center justify-center">
                <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-[#22c55e] opacity-75"></span>
              </div>
            </div>
          </div>

          <div className="leading-tight flex flex-col items-start">
            <h4 className="font-bold text-base text-zinc-900 tracking-tight" id="chatbot-companion-title">Mindy</h4>
            <span className="text-[11px] text-zinc-500 font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block"></span>
              En ligne • Compagnon IA
            </span>
          </div>
        </div>

        {/* 3 dots action button (⋮) inside a styled light circle */}
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          className="w-10 h-10 rounded-full bg-zinc-50 hover:bg-zinc-100 flex items-center justify-center text-zinc-700 border border-zinc-100 transition active:scale-95 cursor-pointer shrink-0"
          id="chatbot-options-btn"
        >
          <i className="ti ti-dots-vertical text-lg"></i>
        </button>

        {/* Drodown dropdown dialog container */}
        <AnimatePresence>
          {showDropdown && (
            <>
              {/* Soft overlay backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowDropdown(false)}
                className="fixed inset-0 bg-neutral-900/10 backdrop-blur-3xs z-30"
                id="dropdown-backdrop"
              />

              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                transition={{ duration: 0.15 }}
                className="absolute right-4 top-14 w-52 bg-white border border-zinc-150 rounded-2xl shadow-xl z-40 overflow-hidden py-1"
                id="chatbot-dropdown-menu"
              >
                <button
                  onClick={handleShowHistory}
                  className="w-full text-left px-4 py-3 text-xs font-semibold text-zinc-700 hover:bg-zinc-50 transition flex items-center space-x-2.5 cursor-pointer"
                >
                  <i className="ti ti-history text-sm text-zinc-400"></i>
                  <span>Historique de navigation</span>
                </button>
                <button
                  onClick={handleResetConversation}
                  className="w-full text-left px-4 py-3 text-xs font-semibold text-zinc-700 hover:bg-zinc-50 transition flex items-center space-x-2.5 cursor-pointer"
                >
                  <i className="ti ti-refresh text-sm text-zinc-400"></i>
                  <span>Nouvelle conversation</span>
                </button>
                <button
                  onClick={handleExportConversation}
                  className="w-full text-left px-4 py-3 text-xs font-semibold text-zinc-700 hover:bg-zinc-50 transition flex items-center space-x-2.5 cursor-pointer"
                >
                  <i className="ti ti-download text-sm text-zinc-400"></i>
                  <span>Exporter la conv.</span>
                </button>
                <button
                  onClick={handleShowAbout}
                  className="w-full text-left px-4 py-3 text-xs font-semibold text-zinc-700 hover:bg-zinc-50 transition flex items-center space-x-2.5 cursor-pointer"
                >
                  <i className="ti ti-info-circle text-sm text-zinc-400"></i>
                  <span>À propos de Mindy</span>
                </button>
                <div className="border-t border-zinc-100 my-0.5" />
                <button
                  onClick={handleDeleteConversation}
                  className="w-full text-left px-4 py-3 text-xs font-bold text-red-600 hover:bg-red-50 transition flex items-center space-x-2.5 cursor-pointer"
                >
                  <i className="ti ti-trash text-sm text-red-400"></i>
                  <span>Supprimer la conv.</span>
                </button>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>

      {/* 2. MESSAGES LIST HOUSING */}
      <div 
        ref={scrollAreaRef}
        className="flex-1 overflow-y-auto overflow-x-hidden px-4 py-4 space-y-4"  
        id="messages-scroll-area"
      >
        {/* Centered initial time marker stamp (Reference 1) */}
        <div className="text-center py-1 select-none" id="timestamp-marker">
          <span className="text-[11px] text-zinc-450 font-bold tracking-wide bg-zinc-200/50 px-2.5 py-1 rounded-full">
            Aujourd'hui · 09:14
          </span>
        </div>

        {messages.length === 0 ? (
          <div className="text-center py-12 text-zinc-400 text-xs italic">
            La conversation a été effacée. Écris un mot pour murmurer à Mindy.
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((msg, index) => {
              const isMindy = msg.sender === "mindy";
              const isSys = msg.sender === "system";

              if (isSys) {
                return (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-red-50 border border-red-100 text-red-800 rounded-2xl text-xs leading-relaxed space-y-2 select-none"
                    id={`sys-msg-${msg.id}`}
                  >
                    <div className="font-bold flex items-center space-x-1.5 text-red-700">
                      <i className="ti ti-shield-alert text-base"></i>
                      <span>Prudence immédiate</span>
                    </div>
                    <p>{msg.text}</p>
                    <div className="flex space-x-2 pt-1">
                      <button
                        onClick={() => setPath("exercices/stop-sos")}
                        className="bg-red-650 hover:bg-red-700 text-white font-bold text-[10px] px-3 py-1.5 rounded-full uppercase tracking-wider transition"
                      >
                        Accéder au Stop S.O.S 🚨
                      </button>
                    </div>
                  </motion.div>
                );
              }

              return (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${isMindy ? "justify-start" : "justify-end"} items-end space-x-2`}
                  id={`chat-row-${msg.id}`}
                >
                  {/* Left avatar beside Mindy bubble (Reference 2) */}
                  {isMindy && (
                    <div className="w-8 h-8 rounded-full bg-brand-lavender/50 flex items-center justify-center shrink-0 border border-brand-lavender/30 select-none shadow-3xs">
                      <span className="text-xs">{userProfile.mindyEmoji || ""}</span>
                    </div>
                  )}

                  <div className="flex flex-col max-w-[78%]">
                    <div
                      className={`px-4.5 py-3 text-[14.5px] leading-relaxed select-text transition-all ${
                        isMindy
                          ? "bg-white text-zinc-800 rounded-2xl rounded-tl-xs border border-brand-lavender/50 shadow-3xs font-medium"
                          : "bg-gradient-to-br from-brand-medium to-[#9D76F5] text-white rounded-2xl rounded-br-xs shadow-xs font-semibold"
                      }`}
                    >
                      <p>{msg.text}</p>
                    </div>

                    {/* SUGGESTED EXERCISE ATTACHED CARD */}
                    {isMindy && msg.exerciseSuggested && (
                      <div 
                        className={`mt-2 border rounded-2xl overflow-hidden bg-white text-zinc-800 shadow-3xs transition-all ${
                          msg.exerciseActionState === "started" || msg.exerciseActionState === "postponed" 
                            ? "opacity-60 grayscale-[15%]" 
                            : ""
                        }`}
                        style={{ borderColor: "#EBE6F8" }}
                        id={`exercise-card-${msg.id}`}
                      >
                        {/* Interactive Colored Top Bar Indicator */}
                        <div className={`h-1.5 w-full ${msg.exerciseSuggested.color}`} />
                        
                        <div className="p-3.5 space-y-3">
                          {/* Top row: Icon + Title + Category & Duration + Badge */}
                          <div className="flex items-start justify-between space-x-2">
                            <div className="flex items-center space-x-2.5">
                              <div className="w-9 h-9 rounded-xl bg-zinc-50 flex items-center justify-center text-lg shadow-4xs shrink-0 select-none">
                                {msg.exerciseSuggested.icon}
                              </div>
                              <div className="text-left">
                                <h5 className="font-bold text-[13px] text-zinc-900 leading-snug">
                                  {msg.exerciseSuggested.title}
                                </h5>
                                <div className="flex items-center space-x-1.5 mt-0.5 text-[9.5px] text-zinc-400 font-semibold uppercase tracking-wider">
                                  <span>{msg.exerciseSuggested.category}</span>
                                  <span>•</span>
                                  <span>⏱ {msg.exerciseSuggested.duration}</span>
                                </div>
                              </div>
                            </div>

                            <span className="text-[9px] font-bold text-brand-medium bg-brand-lavender/54 px-2.5 py-0.5 rounded-full shrink-0 select-none">
                              {msg.exerciseSuggested.badgeEffect}
                            </span>
                          </div>

                          {/* Short description text */}
                          <p className="text-[11px] text-zinc-550 leading-relaxed text-left">
                            {msg.exerciseSuggested.description}
                          </p>

                          {/* CTA Interactive buttons */}
                          {msg.exerciseActionState === "pending" && (
                            <div className="flex items-center space-x-2 pt-1 select-none">
                              <button
                                onClick={() => handleAcceptExercise(msg.id, msg.exerciseSuggested!.id)}
                                className="flex-1 py-1.5 bg-zinc-950 hover:bg-zinc-805 text-white font-bold rounded-xl text-[11px] transition active:scale-97 cursor-pointer"
                              >
                                Commencer
                              </button>
                              <button
                                onClick={() => handlePostponeExercise(msg.id)}
                                className="px-3.5 py-1.5 border border-zinc-250 hover:bg-zinc-55 text-zinc-550 font-bold rounded-xl text-[11px] transition active:scale-97 cursor-pointer"
                              >
                                Plus tard
                              </button>
                            </div>
                          )}

                          {msg.exerciseActionState === "started" && (
                            <div className="flex items-center justify-center space-x-1.5 py-1.5 text-emerald-600 bg-emerald-50/70 border border-emerald-100 rounded-xl text-[10px] font-bold">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                              <span>En cours d'activité</span>
                            </div>
                          )}

                          {msg.exerciseActionState === "postponed" && (
                            <div className="flex items-center justify-center space-x-1.5 py-1.5 text-zinc-400 bg-zinc-100 rounded-xl text-[10px] font-bold">
                              <span>Remis à plus tard</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Typing loading indicators with 3 bouncing dots (Reference 2) */}
        {loading && (
          <div className="flex items-end space-x-2" id="typing-indicator-wrapper">
            <div className="w-8 h-8 rounded-full bg-brand-lavender/50 flex items-center justify-center shrink-0 border border-brand-lavender/30 shadow-3xs">
              <span className="text-xs">{userProfile.mindyEmoji || ""}</span>
            </div>
            <div className="bg-white border border-brand-lavender/40 shadow-3xs rounded-2xl rounded-tl-xs px-4 py-3 flex items-center space-x-1.5 w-16">
              <span className="w-1.5 h-1.5 bg-brand-medium rounded-full animate-bounce [animation-delay:0s]" />
              <span className="w-1.5 h-1.5 bg-brand-medium rounded-full animate-bounce [animation-delay:0.2s]" />
              <span className="w-1.5 h-1.5 bg-brand-medium rounded-full animate-bounce [animation-delay:0.4s]" />
            </div>
          </div>
        )}

        {/* Quick Suggestion Pills underneath initial welcome layout */}
        {messages.length === 2 && !loading && (
          <div className="pl-10 pr-2 py-1 space-y-2 select-none" id="suggestions-area">
            <div className="flex flex-col space-y-2 max-w-[85%]">
              {STARTERS.map((text, idx) => (
                <motion.button
                  key={idx}
                  whileHover={{ scale: 1.01, y: -0.5 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleSendMessage(text)}
                  className="w-full text-left bg-white border border-brand-lavender/70 text-[12px] font-bold text-zinc-700 py-2.5 px-4 rounded-xl transition-all flex items-center space-x-2.5 shadow-3xs hover:bg-[#FAF5FF] hover:text-brand-medium hover:border-brand-medium/30"
                  id={`starter-btn-${idx}`}
                >
                  <span>{text}</span>
                </motion.button>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* 3. INPUT BAR BOTTOM CONTROLS */}
      <div className="bg-transparent px-4 py-3 pb-6 shrink-0 select-none z-10" id="chatbot-footer-input">
        <div className="flex items-center space-x-2.5 max-w-md mx-auto bg-white border border-brand-lavender/80 shadow-xs rounded-full pl-5 pr-1.5 py-1.5 focus-within:ring-2 focus-within:ring-brand-medium/15 focus-within:border-brand-medium transition-all">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !loading) {
                handleSendMessage(input);
              }
            }}
            placeholder="Écris un message à Mindy..."
            className="flex-1 bg-transparent border-none text-[13px] font-bold focus:outline-none text-zinc-800 placeholder-zinc-400"
            disabled={loading}
            id="chatbot-text-input"
          />

          <motion.button
            whileTap={!loading && input.trim() ? { scale: 0.94 } : undefined}
            onClick={() => handleSendMessage(input)}
            disabled={loading || !input.trim()}
            className="w-9 h-9 rounded-full bg-brand-medium hover:bg-brand-deep text-white flex items-center justify-center shrink-0 shadow-xs disabled:bg-zinc-100 disabled:text-zinc-300 transition-all cursor-pointer"
            id="chatbot-send-btn"
          >
            <i className="ti ti-arrow-up text-base font-bold"></i>
          </motion.button>
        </div>

        {/* Medical / Urgency warning label under message input */}
        <p className="text-center text-[10px] text-zinc-400 font-semibold mt-3 px-4 select-none leading-normal">
          Mindy est une IA, pas un professionnel de santé. En cas d'urgence, contacte le 15 ou le 3114.
        </p>
      </div>

      {/* --- FLOATING INTERACTIVE ACTION FEEDBACK MODALS --- */}
      <AnimatePresence>
        {activeModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-neutral-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-5 select-none"
            id="companion-popup-backdrop"
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="bg-white rounded-3xl p-5 w-full max-w-[310px] space-y-4 shadow-xl border border-zinc-100 text-center"
              id="companion-popup-body"
            >
              {activeModal === "about" && (
                <>
                  <div className="w-12 h-12 rounded-full bg-brand-lavender/30 text-[#7C6FF7] flex items-center justify-center mx-auto text-xl">
                    {userProfile.mindyEmoji || ""}
                  </div>
                  <div className="space-y-1.5">
                    <h3 className="text-sm font-bold text-zinc-900">À propos de Mindy</h3>
                    <p className="text-[11px] text-zinc-500 leading-relaxed">
                      Mindy est ton compagnon de poche d'auto-préservation. Guidée par une douce dynamique de compassion, elle t'aide à souffler, à ancrer tes émotions, et à libérer ton esprit à ton propre rythme.
                    </p>
                  </div>
                </>
              )}

              {activeModal === "export" && (
                <>
                  <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
                    <i className="ti ti-download text-xl"></i>
                  </div>
                  <div className="space-y-1.5">
                    <h3 className="text-sm font-bold text-zinc-900">Exportation réussie</h3>
                    <p className="text-[11px] text-zinc-500 leading-relaxed">
                      Ton dialogue bienveillant a été sécurisé et exporté au format texte local avec succès dans ton dossier de téléchargement.
                    </p>
                  </div>
                </>
              )}

              {activeModal === "delete" && (
                <>
                  <div className="w-12 h-12 rounded-full bg-red-50 text-red-500 flex items-center justify-center mx-auto">
                    <i className="ti ti-trash text-xl"></i>
                  </div>
                  <div className="space-y-1.5">
                    <h3 className="text-sm font-bold text-zinc-900">Conversation supprimée</h3>
                    <p className="text-[11px] text-zinc-500 leading-relaxed">
                      L’intégralité de la conversation locale a été purgée. Ton jardin secret est à nouveau vierge et prêt à accueillir tes pensées.
                    </p>
                  </div>
                </>
              )}

              {activeModal === "history" && (
                <>
                  <div className="w-12 h-12 rounded-full bg-[#EFEFFF] text-[#7C6FF7] flex items-center justify-center mx-auto">
                    <i className="ti ti-history text-xl"></i>
                  </div>
                  <div className="space-y-1.5">
                    <h3 className="text-sm font-bold text-zinc-900">Historique local de navigation</h3>
                    <p className="text-[11px] text-zinc-500 leading-relaxed">
                      Cette session n'est partagée avec aucun serveur externe. Toutes tes pensées précédentes restent chiffrées uniquement sur ce téléphone.
                    </p>
                  </div>
                </>
              )}

              <button
                onClick={() => setActiveModal(null)}
                className="w-full py-2.5 bg-neutral-900 hover:bg-zinc-800 text-white font-bold rounded-xl text-xs uppercase tracking-wider cursor-pointer transition-all"
                id="close-popup-btn"
              >
                Continuer
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
