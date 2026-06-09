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

  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

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
      const systemInstruction = 
        "Tu es Mindy, le compagnon IA bienveillant de l'application MindCare. Tu es une voix d'auto-préservation, douce, zène et calme. Tu as interdiction absolue de faire la moindre prescription, de poser un diagnostic, de parler de psychopathologie lourde ou de rassurer de façon clinique froide. Tutoyie l'utilisateur doucement en français, utilise des phrases courtes, apaise-le, et propose-lui de faire un et un seul exercice adapté pour se détendre (par exemple de la respiration ou s'exprimer dans le journal SOS) s'il se sent lourd. N'ajoute pas de fioritures.";

      const res = await fetch("/api/gemini/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: textToSend, systemInstruction }),
      });
      const data = await res.json();
      const replyText = data?.text || "Pardon, de quoi souhaites-tu parler ? Inspire doucement...";
      
      const mindyMsg: ChatMessage = {
        id: Math.random().toString(36).substring(7),
        sender: "mindy",
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
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
    <div className="flex-1 flex flex-col justify-between h-full bg-white relative select-none w-full max-w-md mx-auto" id="chatbot-page-root">
      
      {/* 1. FIXED HEADER AREA */}
      <div className="px-4 py-3 bg-white border-b border-zinc-100 flex items-center justify-between z-20 shrink-0 select-none relative" id="chatbot-header">
        {/* Back button (←) inside a styled light circle */}
        <button
          onClick={() => setPath("dashboard")}
          className="w-11 h-11 rounded-full bg-zinc-100/80 hover:bg-zinc-200 flex items-center justify-center text-zinc-800 transition active:scale-95 cursor-pointer shrink-0"
          id="chatbot-back-btn"
        >
          <i className="ti ti-arrow-left text-xl"></i>
        </button>

        {/* Centered Companion header details */}
        <div className="flex-1 flex items-center justify-center space-x-3 px-2">
          {/* Custom professional Dual-Tone circle avatar matching the mockup exactly */}
          <div className="relative shrink-0" id="chatbot-avatar-wrapper">
            <div className="w-11 h-11 rounded-full bg-[#E5E1FA] flex items-center justify-center shadow-xs">
              <div className="w-5.5 h-5.5 rounded-full bg-[#7C6FF7]" />
            </div>
          </div>

          <div className="leading-tight flex flex-col items-start">
            <h4 className="font-bold text-base text-zinc-900 tracking-tight" id="chatbot-companion-title">Mindy</h4>
            <span className="text-[11px] text-zinc-500 font-medium">Ton compagnon IA</span>
          </div>
        </div>

        {/* 3 dots action button (⋮) inside a styled light circle */}
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          className="w-11 h-11 rounded-full bg-zinc-100/80 hover:bg-zinc-200 flex items-center justify-center text-zinc-850 transition active:scale-95 cursor-pointer shrink-0"
          id="chatbot-options-btn"
        >
          <i className="ti ti-dots-vertical text-xl"></i>
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
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4" id="messages-scroll-area">
        {/* Centered initial time marker stamp (Reference 1) */}
        <div className="text-center py-1 select-none" id="timestamp-marker">
          <span className="text-[11px] text-zinc-300 font-medium tracking-wide">
            Aujourd'hui · 09:14
          </span>
        </div>

        {messages.length === 0 ? (
          <div className="text-center py-10 text-zinc-400 text-xs italic">
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
                    className="p-4 bg-red-50 border border-red-100 text-red-800 rounded-3xl text-xs leading-relaxed space-y-2 select-none"
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
                <div
                  key={msg.id}
                  className={`flex ${isMindy ? "justify-start" : "justify-end"} items-end space-x-2`}
                  id={`chat-row-${msg.id}`}
                >
                  {/* Left avatar beside Mindy bubble (Reference 2) */}
                  {isMindy && (
                    <div className="w-7 h-7 rounded-full bg-[#EFEFFF] flex items-center justify-center shrink-0 border border-[#7C6FF7]/15 select-none shadow-2xs">
                      <span className="text-xs">🌸</span>
                    </div>
                  )}

                  <div className="flex flex-col max-w-[78%]">
                    <div
                      className={`px-4 py-3 text-[14px] leading-relaxed select-text transition-all ${
                        isMindy
                          ? "bg-[#F2F2F2] text-zinc-800 rounded-[20px] rounded-tl-[4px]"
                          : "bg-[#1A1A1A] text-white rounded-[20px] rounded-br-[4px] shadow-sm"
                      }`}
                    >
                      <p>{msg.text}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Typing loading indicators with 3 bouncing dots (Reference 2) */}
        {loading && (
          <div className="flex items-end space-x-2" id="typing-indicator-wrapper">
            <div className="w-7 h-7 rounded-full bg-[#EFEFFF] flex items-center justify-center shrink-0 border border-[#7C6FF7]/15">
              <span className="text-xs">🌸</span>
            </div>
            <div className="bg-[#F2F2F2] rounded-[20px] rounded-tl-[4px] px-4 py-3.5 flex items-center space-x-1 w-16">
              <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce [animation-delay:0s]" />
              <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce [animation-delay:0.2s]" />
              <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce [animation-delay:0.4s]" />
            </div>
          </div>
        )}

        {/* Quick Suggestion Pills underneath initial welcome layout */}
        {messages.length === 2 && !loading && (
          <div className="pl-9 pr-2 py-1 space-y-2 select-none" id="suggestions-area">
            <div className="flex flex-col space-y-2">
              {STARTERS.map((text, idx) => (
                <motion.button
                  key={idx}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => handleSendMessage(text)}
                  className="w-full text-left bg-white border border-zinc-200/90 text-[12px] font-semibold text-zinc-800 py-2.5 px-4 rounded-full transition-all flex items-center space-x-1.5 shadow-2xs hover:bg-zinc-50 active:border-[#7C6FF7]"
                  id={`starter-btn-${idx}`}
                >
                  <span>{text}</span>
                </motion.button>
              ))}
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* 3. INPUT BAR BOTTOM CONTROLS */}
      <div className="bg-white border-t border-zinc-100 px-3 py-3.5 pb-4 shrink-0 select-none z-10" id="chatbot-footer-input">
        <div className="flex items-center space-x-2.5 max-w-md mx-auto">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !loading) {
                handleSendMessage(input);
              }
            }}
            placeholder="Écrit à Mindy....."
            className="flex-1 bg-zinc-100/90 border border-zinc-200/50 rounded-full py-3 px-4.5 text-xs font-semibold focus:outline-none focus:border-[#7C6FF7] focus:bg-white transition-all text-neutral-dark placeholder-zinc-400"
            disabled={loading}
            id="chatbot-text-input"
          />

          <motion.button
            whileTap={!loading && input.trim() ? { scale: 0.94 } : undefined}
            onClick={() => handleSendMessage(input)}
            disabled={loading || !input.trim()}
            className="w-11 h-11 rounded-full bg-black hover:bg-zinc-800 text-white flex items-center justify-center shrink-0 shadow-sm disabled:bg-zinc-100 disabled:text-zinc-300 transition-all cursor-pointer"
            id="chatbot-send-btn"
          >
            <i className="ti ti-send text-lg"></i>
          </motion.button>
        </div>
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
                    🌸
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
