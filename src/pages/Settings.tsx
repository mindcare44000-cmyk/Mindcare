import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  User, Shield, CreditCard, LogOut, Check, 
  ChevronRight, ArrowLeft, Bell, Key, Trash2,
  AlertTriangle, Phone, HelpCircle, Mail, Globe, Sparkles, CheckCircle2
} from "lucide-react";
import { UserProfile } from "../types";

interface SettingsProps {
  currentPath: string;
  setPath: (path: string) => void;
  userProfile: UserProfile;
  updateProfile: (profile: Partial<UserProfile>) => void;
}

export default function Settings({ currentPath, setPath, userProfile, updateProfile }: SettingsProps) {
  // In Settings.tsx, we handle the sub-menus locally to ensure high performance transitions.
  // Options for local sub-pages: null, "premium", "compte-profil", "compte-pwd", "compte-langue", "donnees", "aide"
  const [activeSub, setActiveSub] = useState<string | null>(null);

  // Split name for wireframe alignment
  const [firstName, setFirstName] = useState(() => {
    if (userProfile.name) {
      return userProfile.name.split(" ")[0] || "Léa";
    }
    return "Léa";
  });
  const [lastName, setLastName] = useState(() => {
    if (userProfile.name) {
      return userProfile.name.split(" ").slice(1).join(" ") || "Martin";
    }
    return "Martin";
  });
  const [emailField, setEmailField] = useState(() => userProfile.email || "lea@email.fr");

  // Inline edit state in the header
  const [isEditingHeader, setIsEditingHeader] = useState(false);

  // Password fields state
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Lang selection
  const [selectedLang, setSelectedLang] = useState("Français");

  // Notification time selectors
  const [reminderHour, setReminderHour] = useState("20");
  const [reminderMinute, setReminderMinute] = useState("00");

  // Toggles
  const [rappelEnabled, setRappelEnabled] = useState(true);
  const [mindySuggestionsEnabled, setMindySuggestionsEnabled] = useState(true);

  // Modals state
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Success message toasts
  const [toastMessage, setToastMessage] = useState("");
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3000);
  };

  // Exporting state simulation
  const [isExporting, setIsExporting] = useState(false);

  // Premium management state
  const [isPremium, setIsPremium] = useState(true); // Default to true corresponding to wireframe card badge "Actif"
  const [premiumType, setPremiumType] = useState<"demo" | "paid" | "school">("demo");
  const [schoolName, setSchoolName] = useState<string>("");

  // School Code flow steps: "idle", "code-input", "verifying-code", "email-input", "sending-email", "verify-input", "activating" | "success"
  const [schoolCodeStep, setSchoolCodeStep] = useState<"idle" | "code-input" | "verifying-code" | "email-input" | "sending-email" | "verify-input" | "activating" | "success">("idle");
  const [schoolCode, setSchoolCode] = useState<string>("");
  const [academicEmail, setAcademicEmail] = useState<string>("");
  const [emailVerifyCode, setEmailVerifyCode] = useState<string>("");
  const [verificationError, setVerificationError] = useState<string>("");
  const [isOption1Processing, setIsOption1Processing] = useState<boolean>(false);

  // Synchronization with path
  useEffect(() => {
    if (currentPath === "parametres") {
      setActiveSub(null);
    }
  }, [currentPath]);

  // Form Validation helper - real-time validation (champ rouge si vide, vert si valide)
  const isEmailValid = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  // Profile data validation
  const isProfileValid = firstName.trim().length > 0 && lastName.trim().length > 0 && isEmailValid(emailField);

  // Password validation
  const isPasswordValid = oldPassword.length > 0 && newPassword.length >= 8 && confirmPassword === newPassword;

  // Save modified main profile
  const handleSaveProfile = () => {
    if (!isProfileValid) return;
    updateProfile({
      name: `${firstName.trim()} ${lastName.trim()}`,
      email: emailField.trim()
    });
    setIsEditingHeader(false);
    setActiveSub(null);
    showToast("Profil mis à jour avec succès ✨");
  };

  // Save modified passwords
  const handleSavePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isPasswordValid) return;
    
    // Simulate updating password
    setOldPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setActiveSub(null);
    showToast("Mot de passe mis à jour avec succès 🔒");
  };

  const handleLogout = () => {
    setShowLogoutModal(false);
    updateProfile({
      name: "",
      email: "",
      isRegistered: false,
      isOnboarded: false,
      premium: false,
    });
    setPath("auth");
  };

  const handleDeleteDataAndAccount = () => {
    setShowDeleteModal(false);
    updateProfile({
      name: "",
      email: "",
      isRegistered: false,
      isOnboarded: false,
      premium: false,
      streak: 0,
    });
    setPath("auth");
  };

  // Option 1 handler - Simulate payment and subscription activation
  const handleSubscribePaid = () => {
    setIsOption1Processing(true);
    setTimeout(() => {
      setIsOption1Processing(false);
      setPremiumType("paid");
      setIsPremium(true);
      updateProfile({ premium: true });
      showToast("Abonnement Premium activé avec succès ! 🌟💳");
    }, 1200);
  };

  // Option 2 handler - Step 1: Verify School Code
  const handleVerifyCode = () => {
    if (!schoolCode.trim()) {
      setVerificationError("Veuillez saisir un code.");
      return;
    }
    setSchoolCodeStep("verifying-code");
    setTimeout(() => {
      const codeUpper = schoolCode.trim().toUpperCase();
      let detectedExtName = "";
      
      if (codeUpper === "SORBONNE" || codeUpper === "SORBONNE2026") {
        detectedExtName = "Sorbonne Université 🎓";
      } else if (codeUpper === "HEC" || codeUpper === "HEC-PARIS") {
        detectedExtName = "HEC Paris 💼";
      } else if (codeUpper === "MIND2026") {
        detectedExtName = "Université de Nantes 🌿";
      } else if (codeUpper === "LYCEE44") {
        detectedExtName = "Lycée Saint-Stanislas 🎒";
      } else {
        detectedExtName = `Établissement #${schoolCode.toUpperCase()}`;
      }
      
      setSchoolName(detectedExtName);
      setSchoolCodeStep("email-input");
    }, 1000);
  };

  // Option 2 handler - Step 2: Send confirmation email
  const handleSendEmail = () => {
    if (!academicEmail.trim() || !isEmailValid(academicEmail)) {
      setVerificationError("Veuillez saisir un e-mail académique valide.");
      return;
    }
    setSchoolCodeStep("sending-email");
    setTimeout(() => {
      setSchoolCodeStep("verify-input");
      showToast("Un code de confirmation a été envoyé ! 📥");
    }, 1000);
  };

  // Option 2 handler - Step 3: Validate code and activate Premium
  const handleConfirmEmailCode = () => {
    if (!emailVerifyCode.trim()) {
      setVerificationError("Veuillez saisir le code reçu.");
      return;
    }
    setSchoolCodeStep("activating");
    setTimeout(() => {
      setPremiumType("school");
      setIsPremium(true);
      updateProfile({ premium: true });
      setSchoolCodeStep("success");
      showToast("Premium activé via ton école ! 🎓✨");
    }, 1100);
  };

  const handleSimulateExport = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      
      // Create and download file
      const dataToExport = {
        app: "MindCare",
        exportDate: new Date().toISOString(),
        user: { name: `${firstName} ${lastName}`, email: emailField },
        checkInsSimulated: [
          { date: "2026-06-07", mood: 3, pressure: "Modéré", energy: "Correcte" },
          { date: "2026-06-06", mood: 4, pressure: "Modérée", energy: "Modérée" }
        ],
        chatbotJournals: ["Tu as évoqué une pression au travail liée à un projet urgent."]
      };
      
      const blob = new Blob([JSON.stringify(dataToExport, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "mindcare_dossier_personnel.json";
      link.click();
      URL.revokeObjectURL(url);
      
      showToast("Données exportées au format JSON avec succès. 📥");
    }, 1500);
  };

  return (
    <div className="flex-1 flex flex-col bg-zinc-50 select-none pt-2 pb-0 overflow-hidden min-h-0 w-full max-w-md mx-auto h-full max-h-full font-sans relative" id="profile-pane-root">
      
      {/* Toast Banner Alert block */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="absolute top-4 left-4 right-4 z-50 bg-[#7C6FF7] text-white py-3 px-5 rounded-2xl shadow-xl flex items-center space-x-2.5 text-xs font-semibold"
          >
            <Sparkles className="w-4.5 h-4.5 shrink-0" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {activeSub === null ? (
          /* ========================================================================= */
          /* MAIN PROFILE PAGE                                                         */
          /* ========================================================================= */
          <motion.div
            key="main-profile"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.25 }}
            className="flex-1 overflow-y-auto overflow-x-hidden px-5 pt-3 pb-24 space-y-5"
            id="profile-dashboard-view"
          >
            {/* Header: Avatar, Name, Email, Button Modifier */}
            <div className="bg-white border border-zinc-200/50 rounded-3xl p-5 shadow-sm text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-[#7C6FF7]/8 to-transparent rounded-full blur-xl pointer-events-none" />
              
              <div className="flex justify-between items-start mb-4">
                <div className="w-10 h-10 invisible" /> {/* Spacer */}
                
                {/* Grand avatar initiales en grand cercle centré */}
                <div className="relative inline-block mx-auto">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-[#7C6FF7] to-[#9D91FF] text-white flex items-center justify-center font-black text-2xl shadow-md border border-white select-none">
                    {firstName.substring(0, 1).toUpperCase()}{lastName.substring(0, 1).toUpperCase()}
                  </div>
                  <div className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-emerald-500 border border-white flex items-center justify-center text-[10px] text-white font-bold shadow-xs animate-pulse" title="En veille bienveillante">
                    ✓
                  </div>
                </div>

                <button
                  onClick={() => setIsEditingHeader(!isEditingHeader)}
                  className="bg-zinc-100 hover:bg-zinc-200 text-zinc-700 text-xs font-bold px-3 py-1.5 rounded-full transition cursor-pointer select-none active:scale-95"
                  id="btn-modify-header-profile"
                >
                  {isEditingHeader ? "Fermer" : "Modifier"}
                </button>
              </div>

              {/* Display or edit profile info inline in header */}
              {!isEditingHeader ? (
                <div className="space-y-1 select-text">
                  <h3 className="text-xl font-bold text-zinc-900 tracking-tight">
                    {firstName} {lastName}
                  </h3>
                  <p className="text-xs text-zinc-400 font-medium tracking-wide">
                    {emailField}
                  </p>
                </div>
              ) : (
                <div className="mt-3 text-left space-y-3 bg-zinc-50 p-4 rounded-2xl border border-[#F0F0F0]">
                  <h4 className="text-[10px] font-bold text-[#7C6FF7] uppercase tracking-wider mb-1">
                    Modification Rapide
                  </h4>
                  
                  {/* Prénom */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-zinc-400">Prénom</label>
                    <input
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className={`w-full py-2 px-3.5 text-xs bg-white border rounded-2xl focus:outline-none focus:border-[#7C6FF7] transition-all ${
                        firstName.trim() ? "border-zinc-200/60 bg-white" : "border-rose-300 bg-rose-50/10"
                      }`}
                    />
                  </div>

                  {/* Nom */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-zinc-400">Nom de famille</label>
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className={`w-full py-2 px-3.5 text-xs bg-white border rounded-2xl focus:outline-none focus:border-[#7C6FF7] transition-all ${
                        lastName.trim() ? "border-zinc-200/60 bg-white" : "border-rose-300 bg-rose-50/10"
                      }`}
                    />
                  </div>

                  {/* Email */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-zinc-400">Email</label>
                    <input
                      type="email"
                      value={emailField}
                      onChange={(e) => setEmailField(e.target.value)}
                      className={`w-full py-2 px-3.5 text-xs bg-white border rounded-2xl focus:outline-none focus:border-[#7C6FF7] transition-all ${
                        isEmailValid(emailField) ? "border-zinc-200/60 bg-white" : "border-rose-300 bg-rose-50/10"
                      }`}
                    />
                  </div>

                  <button
                    disabled={!isProfileValid}
                    onClick={handleSaveProfile}
                    className="w-full py-2.5 bg-[#7C6FF7] disabled:opacity-40 text-white rounded-full text-xs font-bold hover:bg-[#6A5DE6] transition active:scale-98 select-none cursor-pointer mt-1"
                  >
                    Enregistrer les changements
                  </button>
                </div>
              )}
            </div>

            {/* Section PREMIUM Card Row */}
            <div className="space-y-2">
              <h4 className="text-[11px] font-bold text-zinc-800 select-none tracking-tight flex items-center space-x-1.5 px-1">
                <i className="ti ti-star text-base text-[#7C6FF7]"></i>
                <span>Abonnement</span>
              </h4>
              
              <div 
                onClick={() => setActiveSub("premium")}
                className="bg-[#FAF9FF] border border-[#7C6FF7]/20 hover:bg-[#EFEFFF]/50 p-4 rounded-3xl flex items-center justify-between cursor-pointer transition shadow-xs group"
                id="row-premium-access"
              >
                <div className="flex items-center space-x-3 text-left">
                  <div className="w-10 h-10 rounded-2xl bg-white text-[#7C6FF7] flex items-center justify-center border border-[#7C6FF7]/10 shadow-3xs text-lg shrink-0">
                    ★
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h4 className="font-bold text-xs text-zinc-900">PREMIUM</h4>
                      <span className="text-[8px] uppercase tracking-widest font-bold bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full select-none">
                        Actif
                      </span>
                    </div>
                    <p className="text-[11px] font-bold text-[#7C6FF7] mt-0.5">Plan complet actif</p>
                    <p className="text-[9.5px] text-zinc-450 mt-0.5 font-medium">2,99 € / mois · Renouvellement le 8 juil.</p>
                  </div>
                </div>
                <div className="text-[#7C6FF7] group-hover:translate-x-0.5 transition-transform">
                  <ChevronRight className="w-5 h-5 stroke-[2.5]" />
                </div>
              </div>
            </div>

            {/* Section COMPTE list cards */}
            <div className="space-y-2">
              <h4 className="text-[11px] font-bold text-zinc-800 select-none tracking-tight flex items-center space-x-1.5 px-1">
                <i className="ti ti-user text-base text-[#7C6FF7]"></i>
                <span className="text-[11px]">Compte</span>
              </h4>

              <div className="bg-white border border-zinc-200/50 rounded-3xl p-4 shadow-sm space-y-2.5">
                {/* Row Modifier mon profil */}
                <div 
                  onClick={() => setActiveSub("compte-profil")}
                  className="p-3 flex items-center justify-between cursor-pointer rounded-2xl bg-zinc-100/50 border border-[#F0F0F0] hover:bg-zinc-100 transition-all text-left"
                >
                  <div className="flex items-center space-x-3 text-left">
                    <div className="w-9 h-9 rounded-2xl bg-white text-[#7C6FF7] border border-[#F0F0F0] flex items-center justify-center shrink-0 shadow-2xs">
                      <User className="w-4 h-4" />
                    </div>
                    <div>
                      <h5 className="font-bold text-[11px] text-zinc-900 leading-tight">Modifier mon profil</h5>
                      <p className="text-[9.5px] text-zinc-400 mt-0.5 leading-none">Changer tes coordonnées d'ici</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-zinc-400" />
                </div>

                {/* Row Mot de passe */}
                <div 
                  onClick={() => setActiveSub("compte-pwd")}
                  className="p-3 flex items-center justify-between cursor-pointer rounded-2xl bg-zinc-100/50 border border-[#F0F0F0] hover:bg-zinc-100 transition-all text-left"
                >
                  <div className="flex items-center space-x-3 text-left">
                    <div className="w-9 h-9 rounded-2xl bg-white text-[#7C6FF7] border border-[#F0F0F0] flex items-center justify-center shrink-0 shadow-2xs">
                      <Key className="w-4 h-4" />
                    </div>
                    <div>
                      <h5 className="font-bold text-[11px] text-zinc-900 leading-tight">Mot de passe</h5>
                      <p className="text-[9.5px] text-zinc-400 mt-0.5 leading-none">Mettre à jour ton code d'accès</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-zinc-400" />
                </div>

                {/* Row Langue */}
                <div 
                  onClick={() => setActiveSub("compte-langue")}
                  className="p-3 flex items-center justify-between cursor-pointer rounded-2xl bg-zinc-100/50 border border-[#F0F0F0] hover:bg-zinc-100 transition-all text-left"
                >
                  <div className="flex items-center space-x-3 text-left">
                    <div className="w-9 h-9 rounded-2xl bg-white text-[#7C6FF7] border border-[#F0F0F0] flex items-center justify-center shrink-0 shadow-2xs">
                      <Globe className="w-4 h-4" />
                    </div>
                    <div>
                      <h5 className="font-bold text-[11px] text-zinc-900 leading-tight">Langue</h5>
                      <p className="text-[9.5px] text-zinc-400 mt-0.5 leading-none">Français, English, Español...</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1.5 select-none">
                    <span className="text-[10px] font-bold text-zinc-500 bg-white border border-[#F0F0F0] rounded-lg px-2 py-0.5">
                      {selectedLang}
                    </span>
                    <ChevronRight className="w-4 h-4 text-zinc-400" />
                  </div>
                </div>
              </div>
            </div>

            {/* Section NOTIFICATIONS preference toggles */}
            <div className="space-y-2">
              <h4 className="text-[11px] font-bold text-zinc-800 select-none tracking-tight flex items-center space-x-1.5 px-1">
                <i className="ti ti-bell text-base text-[#7C6FF7]"></i>
                <span className="text-[11px]">Notifications</span>
              </h4>

              <div className="bg-white border border-zinc-200/50 rounded-3xl p-4 shadow-sm space-y-2.5">
                {/* Rappel check-in Toggle */}
                <div className="space-y-2">
                  <div className="p-3 flex items-center justify-between rounded-2xl bg-zinc-100/50 border border-[#F0F0F0] text-left select-none">
                    <div className="flex items-center space-x-3 text-left">
                      <div className="w-9 h-9 rounded-2xl bg-white text-amber-500 border border-[#F0F0F0] flex items-center justify-center shrink-0 shadow-2xs">
                        <Bell className="w-4 h-4" />
                      </div>
                      <div>
                        <h5 className="font-bold text-[11px] text-zinc-900 leading-tight">Rappel check-in</h5>
                        <p className="text-[9.5px] text-zinc-400 mt-0.5 leading-none">Rappel quotidien de météo</p>
                      </div>
                    </div>

                    {/* Animated custom toggle */}
                    <div 
                      onClick={() => setRappelEnabled(!rappelEnabled)}
                      className={`w-12 h-6.5 rounded-full p-0.5 transition-colors duration-200 cursor-pointer flex items-center ${
                        rappelEnabled ? "bg-[#7C6FF7]" : "bg-zinc-200"
                      }`}
                    >
                      <motion.div 
                        layout
                        className="w-5.5 h-5.5 rounded-full bg-white shadow-2xs"
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        style={{ marginLeft: rappelEnabled ? "calc(100% - 22px)" : "2px" }}
                      />
                    </div>
                  </div>

                  {/* Timepicker Selector open when Rappel check-in is enabled */}
                  <AnimatePresence>
                    {rappelEnabled && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden bg-zinc-50 rounded-xl border border-[#F0F0F0] p-3 flex justify-between items-center space-y-0"
                      >
                        <span className="text-[10px] font-bold text-zinc-500">Heure de rappel :</span>
                        <div className="flex items-center space-x-1 font-mono">
                          {/* Hour select */}
                          <select 
                            value={reminderHour}
                            onChange={(e) => {
                              setReminderHour(e.target.value);
                              showToast(`Rappel programmé à ${e.target.value}h${reminderMinute} ⏰`);
                            }}
                            className="bg-white border border-zinc-200/50 rounded-full py-1 px-2.5 text-xs font-bold focus:outline-none focus:border-[#7C6FF7]"
                          >
                            {Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, "0")).map(h => (
                              <option key={h} value={h}>{h}</option>
                            ))}
                          </select>
                          <span className="text-zinc-400 font-bold">:</span>
                          {/* Minute select */}
                          <select 
                            value={reminderMinute}
                            onChange={(e) => {
                              setReminderMinute(e.target.value);
                              showToast(`Rappel programmé à ${reminderHour}h${e.target.value} ⏰`);
                            }}
                            className="bg-white border border-zinc-200/50 rounded-full py-1 px-2.5 text-xs font-bold focus:outline-none focus:border-[#7C6FF7]"
                          >
                            {["00", "15", "30", "45"].map(m => (
                              <option key={m} value={m}>{m}</option>
                            ))}
                          </select>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Message Mindy Toggle */}
                <div className="p-3 flex items-center justify-between rounded-2xl bg-zinc-100/50 border border-[#F0F0F0] text-left select-none">
                  <div className="flex items-center space-x-3 text-left">
                    <div className="w-9 h-9 rounded-2xl bg-white text-[#7C6FF7] border border-[#F0F0F0] flex items-center justify-center shrink-0 shadow-2xs">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div>
                      <h5 className="font-bold text-[11px] text-zinc-900 leading-tight">Message Mindy</h5>
                      <p className="text-[9.5px] text-zinc-400 mt-0.5 leading-none">Suggestions d'auto-bienveillance</p>
                    </div>
                  </div>

                  {/* Animated simple toggle */}
                  <div 
                    onClick={() => {
                      setMindySuggestionsEnabled(!mindySuggestionsEnabled);
                      showToast(mindySuggestionsEnabled ? "Suggestions de Mindy désactivées" : "Suggestions de Mindy réactivées ✨");
                    }}
                    className="w-12 h-6.5 rounded-full p-0.5 transition-colors duration-200 cursor-pointer flex items-center"
                    style={{ backgroundColor: mindySuggestionsEnabled ? "#7C6FF7" : "#E4E4E7" }}
                  >
                    <motion.div 
                      layout
                      className="w-5.5 h-5.5 rounded-full bg-white shadow-2xs"
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      style={{ marginLeft: mindySuggestionsEnabled ? "calc(100% - 22px)" : "2px" }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Section COMPAGNON MINDY */}
            <div className="space-y-2">
              <h4 className="text-[11px] font-bold text-zinc-800 select-none tracking-tight flex items-center space-x-1.5 px-1 animate-fadeIn">
                <i className="ti ti-sparkles text-base text-[#7C6FF7]"></i>
                <span className="text-[11px]">Compagnon Mindy</span>
              </h4>

              <div className="bg-white border border-zinc-200/50 rounded-3xl p-4 shadow-sm space-y-3.5">
                <div className="text-left">
                  <h5 className="font-bold text-[11px] text-zinc-900 leading-tight">Émoji de Mindy</h5>
                  <p className="text-[9.5px] text-zinc-400 mt-0.5 leading-snug">
                    Personnalise l'avatar émotionnel de ton compagnon IA, ou enlève-le pour un style ultra-épuré.
                  </p>
                </div>

                {/* Grid of emojis */}
                <div className="grid grid-cols-5 gap-2">
                  {[
                    { char: "🌸", label: "Fleur" },
                    { char: "💜", label: "Cœur" },
                    { char: "🌟", label: "Étoile" },
                    { char: "🐱", label: "Chat" },
                    { char: "🍀", label: "Trèfle" },
                    { char: "🕊️", label: "Colombe" },
                    { char: "🤖", label: "Robot" },
                    { char: "🦊", label: "Renard" },
                    { char: "💡", label: "Lumière" },
                    { char: "🧸", label: "Ours" },
                  ].map((emojiItem) => {
                    const isSelected = userProfile.mindyEmoji === emojiItem.char;
                    return (
                      <button
                        key={emojiItem.char}
                        onClick={() => {
                          updateProfile({ mindyEmoji: emojiItem.char });
                          showToast(`Mindy a adopté l'émoji ${emojiItem.char} ! ✨`);
                        }}
                        className={`py-2 text-xl rounded-2xl border transition-all active:scale-95 cursor-pointer flex items-center justify-center ${
                          isSelected
                            ? "border-[#7C6FF7] bg-[#7C6FF7]/10 text-white shadow-2xs"
                            : "border-zinc-200 bg-zinc-50 hover:bg-zinc-100 text-zinc-700 font-sans"
                        }`}
                        title={emojiItem.label}
                      >
                        {emojiItem.char}
                      </button>
                    );
                  })}
                </div>

                {/* Option to remove emoji */}
                <div className="pt-1.5">
                  <button
                    onClick={() => {
                      updateProfile({ mindyEmoji: "" });
                      showToast("Émoji de Mindy retiré 🍃 (style épuré activé)");
                    }}
                    className={`w-full py-2 rounded-2xl border text-[10px] font-extrabold uppercase tracking-wider transition active:scale-95 cursor-pointer text-center ${
                      userProfile.mindyEmoji === ""
                        ? "border-[#7C6FF7] bg-[#7C6FF7]/5 text-[#7C6FF7]"
                        : "border-zinc-200 text-zinc-500 hover:text-zinc-700 bg-white hover:bg-zinc-50"
                    }`}
                  >
                    {userProfile.mindyEmoji === "" ? "✨ Aucun émoji (Actif)" : "❌ Enlever l'émoji"}
                  </button>
                </div>
              </div>
            </div>

            {/* Section CONFIDENTIALITÉ & RGPD */}
            <div className="space-y-2">
              <h4 className="text-[11px] font-bold text-zinc-800 select-none tracking-tight flex items-center space-x-1.5 px-1">
                <i className="ti ti-shield text-base text-[#7C6FF7]"></i>
                <span className="text-[11px]">Confidentialité & RGPD</span>
              </h4>

              <div className="bg-white border border-zinc-200/50 rounded-3xl p-4 shadow-sm space-y-2.5">
                {/* Row Mes données */}
                <div 
                  onClick={() => setActiveSub("donnees")}
                  className="p-3 flex items-center justify-between cursor-pointer rounded-2xl bg-zinc-100/50 border border-[#F0F0F0] hover:bg-zinc-100 transition-all text-left"
                >
                  <div className="flex items-center space-x-3 text-left">
                    <div className="w-9 h-9 rounded-2xl bg-white text-emerald-600 border border-[#F0F0F0] flex items-center justify-center shrink-0 shadow-2xs">
                      <Shield className="w-4 h-4" />
                    </div>
                    <div>
                      <h5 className="font-bold text-[11px] text-zinc-900 leading-tight">Mes données</h5>
                      <p className="text-[9.5px] text-zinc-400 mt-0.5 leading-none">Ce qui est stocké sur mon appareil</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-zinc-400" />
                </div>

                {/* Exporter mes données */}
                <div 
                  onClick={handleSimulateExport}
                  className="p-3 flex items-center justify-between cursor-pointer rounded-2xl bg-zinc-100/50 border border-[#F0F0F0] hover:bg-zinc-100 transition-all text-left"
                >
                  <div className="flex items-center space-x-3 text-left">
                    <div className="w-9 h-9 rounded-2xl bg-white text-emerald-600 border border-[#F0F0F0] flex items-center justify-center shrink-0 shadow-2xs">
                      {isExporting ? (
                        <div className="w-4 h-4 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <i className="ti ti-download text-base font-bold" />
                      )}
                    </div>
                    <div>
                      <h5 className="font-bold text-[11px] text-zinc-900 leading-tight">Exporter mes données</h5>
                      <p className="text-[9.5px] text-zinc-404 mt-0.5 leading-none">Télécharger météo & journal (JSON)</p>
                    </div>
                  </div>
                  <div>
                    {isExporting ? (
                      <span className="text-[9px] text-zinc-400 italic">Génération...</span>
                    ) : (
                      <ChevronRight className="w-4 h-4 text-zinc-400" />
                    )}
                  </div>
                </div>

                {/* Supprimer mes données */}
                <div 
                  onClick={() => setShowDeleteModal(true)}
                  className="p-3 flex items-center justify-between cursor-pointer rounded-2xl bg-rose-50/55 border border-rose-100/50 hover:bg-rose-100/40 transition-all text-left"
                >
                  <div className="flex items-center space-x-3 text-left">
                    <div className="w-9 h-9 rounded-2xl bg-white text-rose-500 border border-rose-100/50 flex items-center justify-center shrink-0 shadow-2xs">
                      <Trash2 className="w-4 h-4" />
                    </div>
                    <div>
                      <h5 className="font-bold text-[11px] text-rose-700 leading-tight">Supprimer mes données</h5>
                      <p className="text-[9.5px] text-rose-500 mt-0.5 leading-none">Purger les stockages de l'appareil</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-rose-400" />
                </div>
              </div>
            </div>

            {/* Section AIDE & URGENCE */}
            <div className="space-y-2">
              <h4 className="text-[11px] font-bold text-zinc-800 select-none tracking-tight flex items-center space-x-1.5 px-1">
                <i className="ti ti-help text-base text-[#7C6FF7]"></i>
                <span className="text-[11px]">Aide & Urgence</span>
              </h4>

              <div className="bg-white border border-zinc-200/50 rounded-3xl p-4 shadow-sm space-y-2.5">
                {/* Stop SOS */}
                <div 
                  onClick={() => setPath("exercices/stop-sos")}
                  className="p-3.5 flex items-center justify-between cursor-pointer rounded-2xl bg-rose-50/70 border border-rose-100/60 hover:bg-rose-100/40 transition-all text-left group"
                  id="btn-stop-sos"
                >
                  <div className="flex items-center space-x-3 text-left">
                    <div className="w-9 h-9 rounded-2xl bg-white text-rose-600 border border-rose-200/55 flex items-center justify-center shrink-0 shadow-2xs animate-pulse">
                      <AlertTriangle className="w-4.5 h-4.5" />
                    </div>
                    <div>
                      <h5 className="font-bold text-[11px] text-rose-700 leading-tight">Stop SOS</h5>
                      <p className="text-[9.5px] text-zinc-500 mt-0.5 leading-none font-medium">Secours immédiats (15 · 3114)</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-rose-400 group-hover:translate-x-0.5 transition-transform" />
                </div>

                {/* Aide & support */}
                <div 
                  onClick={() => setActiveSub("aide")}
                  className="p-3 flex items-center justify-between cursor-pointer rounded-2xl bg-zinc-100/50 border border-[#F0F0F0] hover:bg-zinc-100 transition-all text-left"
                >
                  <div className="flex items-center space-x-3 text-left">
                    <div className="w-9 h-9 rounded-2xl bg-white text-orange-500 border border-[#F0F0F0] flex items-center justify-center shrink-0 shadow-2xs">
                      <HelpCircle className="w-4 h-4" />
                    </div>
                    <div>
                      <h5 className="font-bold text-[11px] text-zinc-900 leading-tight">Aide & support</h5>
                      <p className="text-[9.5px] text-zinc-400 mt-0.5 leading-none">Foire aux questions & e-mail</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-zinc-400" />
                </div>
              </div>
            </div>

            {/* Logout button row */}
            <div className="pt-2 select-none">
              <button
                onClick={() => setShowLogoutModal(true)}
                className="w-full py-3.5 bg-rose-50/40 hover:bg-rose-50 border border-rose-100/40 text-rose-600 font-bold rounded-full text-xs flex items-center justify-center space-x-2 transition cursor-pointer shadow-xs active:scale-98"
              >
                <LogOut className="w-4 h-4" />
                <span>Se déconnecter</span>
              </button>
            </div>

            {/* Disclaimer footer */}
            <div className="text-center text-[9.5px] text-zinc-400 font-medium italic pt-2 pb-6 px-4 leading-relaxed">
              MindCare version 3.2.0 • Havres & auto-bienveillance.<br />Données strictement protégées localement.
            </div>
          </motion.div>
        ) : (
          /* ========================================================================= */
          /* SUB-PAGES RENDERING                                                       */
          /* ========================================================================= */
          <motion.div
            key={activeSub}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="flex-1 overflow-y-auto overflow-x-hidden px-5 pt-3 pb-24 space-y-5 text-left"
          >
            {/* Sub-page back navigation header block */}
            <div className="flex items-center space-x-3 mb-5 select-none pt-2">
              <button
                onClick={() => setActiveSub(null)}
                className="w-10 h-10 rounded-full bg-zinc-100 hover:bg-zinc-200 flex items-center justify-center text-zinc-700 transition cursor-pointer border border-zinc-200/50 hover:border-zinc-300"
              >
                <ArrowLeft className="w-5 h-5 stroke-[2.5]" />
              </button>
              <div>
                <h3 className="text-lg font-bold text-zinc-9 tracking-tight leading-none text-zinc-900">
                  {activeSub === "premium" && "Premium MindCare"}
                  {activeSub === "compte-profil" && "Modifier mon profil"}
                  {activeSub === "compte-pwd" && "Sécurité & mot de passe"}
                  {activeSub === "compte-langue" && "Sélection de la langue"}
                  {activeSub === "donnees" && "Mes données confidentielles"}
                  {activeSub === "aide" && "Aide & Support"}
                </h3>
                <p className="text-[9.5px] text-[#7C6FF7] font-bold uppercase tracking-wider mt-1.5 leading-none">
                  {activeSub === "premium" && "Gérer l'accès complet"}
                  {activeSub === "compte-profil" && "Coordonnées de l'utilisateur"}
                  {activeSub === "compte-pwd" && "Changer de code secret"}
                  {activeSub === "compte-langue" && "Langue de l'interface"}
                  {activeSub === "donnees" && "Souveraineté des données"}
                  {activeSub === "aide" && "Foire aux questions & support"}
                </p>
              </div>
            </div>

            {/* A. PREMIUM SECTION DETAILS SUB-PAGE */}
            {activeSub === "premium" && (
              <div className="space-y-4">
                <div className="p-5 border border-zinc-200/50 rounded-3xl bg-white space-y-4 shadow-sm text-center">
                  <span className="text-4xl block">🌟</span>
                  <div className="space-y-1">
                    <h3 className="text-sm font-extrabold text-[#7C6FF7] uppercase tracking-wide">MindCare Premium</h3>
                    <p className="text-2xl font-black text-zinc-900">2,99 € <span className="text-xs font-normal text-zinc-400">/ mois</span></p>
                  </div>

                  {premiumType === "demo" && (
                    <div className="text-[10px] uppercase font-bold tracking-wider text-[#7C6FF7] bg-[#7C6FF7]/8 py-1.5 px-3 rounded-xl inline-block">
                      Abonnement Actif • Renouvellement le 8 juillet
                    </div>
                  )}
                  {premiumType === "paid" && (
                    <div className="text-[10px] uppercase font-bold tracking-wider text-emerald-600 bg-emerald-50 py-1.5 px-3 rounded-xl inline-block border border-emerald-150/40 animate-pulse">
                      Abonnement Mensuel Actif (2,99 €/mois) 🌟
                    </div>
                  )}
                  {premiumType === "school" && (
                    <div className="text-[10px] uppercase font-bold tracking-wider text-[#7C6FF7] bg-[#7C6FF7]/10 py-1.5 px-3 rounded-xl inline-block border border-[#7C6FF7]/20 animate-pulse">
                      Accès Gratuit Étudiant Activé : {schoolName || "Mon École"} 🎓
                    </div>
                  )}

                  <div className="space-y-3 text-left text-[11px] text-zinc-600 border-t border-zinc-100 pt-4">
                    <h4 className="font-bold text-zinc-800 text-xs mb-1.5 px-1">Atouts de ton forfait :</h4>
                    
                    <div className="flex items-start space-x-2.5">
                      <div className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 text-[10px] font-bold mt-0.5 border border-emerald-100">✓</div>
                      <div>
                        <span className="font-bold text-zinc-800 block">Accès illimité à Mindy</span>
                        <p className="text-[10px] text-zinc-400 leading-tight">Ton compagnon IA est disponible en continu pour t'écouter et t'apaiser.</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-2.5">
                      <div className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 text-[10px] font-bold mt-0.5 border border-emerald-100">✓</div>
                      <div>
                        <span className="font-bold text-zinc-800 block">Tous les exercices de relaxation</span>
                        <p className="text-[10px] text-zinc-400 leading-tight">Scan corporel, respiration carrée, cohérence cardiaque, oracles illimités.</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-2.5">
                      <div className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 text-[10px] font-bold mt-0.5 border border-emerald-100">✓</div>
                      <div>
                        <span className="font-bold text-zinc-800 block">Historique complet du calendrier</span>
                        <p className="text-[10px] text-zinc-400 leading-tight">Recherche et parcours intégral de tout ton passé d'accompagnement.</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-2.5">
                      <div className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 text-[10px] font-bold mt-0.5 border border-emerald-100">✓</div>
                      <div>
                        <span className="font-bold text-zinc-800 block">Aucune publicité</span>
                        <p className="text-[10px] text-zinc-400 leading-tight">Ton espace de méditation préservé de toute distraction.</p>
                      </div>
                    </div>
                  </div>

                  {/* Actions buttons */}
                  <div className="space-y-2 pt-2">
                    <button
                      onClick={() => showToast("Portail de facturation ouvert (simulation) 💳")}
                      className="w-full py-3 bg-[#7C6FF7] text-white font-bold rounded-full text-xs hover:bg-[#6A5DE6] transition active:scale-98 select-none cursor-pointer"
                    >
                      Gérer mon abonnement
                    </button>
                    
                    <button
                      onClick={() => {
                        window.confirm("As-tu vraiment l'intention d'annuler les privilèges MindCare Premium et de repasser à la version standard ?") &&
                        showToast("Demande reçue. Privilèges actifs jusqu'au 8 juillet. 🌿");
                      }}
                      className="w-full py-3 border border-rose-100/50 text-rose-600 font-bold hover:bg-rose-50 px-4 rounded-full text-xs transition active:scale-98 select-none cursor-pointer"
                    >
                      Annuler l'abonnement
                    </button>
                  </div>
                </div>

                {/* Activation Options with 2 pathways */}
                <div className="p-5 border border-zinc-200/50 rounded-3xl bg-white space-y-4 shadow-sm">
                  <div>
                    <h4 className="text-xs font-extrabold text-zinc-800 uppercase tracking-wide flex items-center gap-1.5 pb-2 border-b border-zinc-100">
                      <Sparkles className="w-4 h-4 text-[#7C6FF7]" />
                      Options d'activation Premium
                    </h4>
                    <p className="text-[10px] text-zinc-400 mt-1 uppercase font-bold tracking-wider">
                      S'abonner ou associer un code établissement
                    </p>
                  </div>
                  
                  <div className="space-y-3.5 pt-1">
                    {/* OPTION 1: Paid Plan */}
                    <div className="p-4 rounded-2xl bg-zinc-50 border border-[#F0F0F0]/70 hover:border-[#7C6FF7]/20 transition-all text-left relative overflow-hidden">
                      {premiumType === "paid" && (
                        <div className="absolute right-3 top-3 bg-emerald-500 text-white text-[9px] font-extrabold py-0.5 px-1.5 rounded-full uppercase tracking-wider">
                          Actif
                        </div>
                      )}
                      
                      <div className="space-y-1 pr-12">
                        <span className="text-[9px] uppercase font-extrabold text-[#7C6FF7] tracking-wider block">Option 1</span>
                        <h5 className="font-extrabold text-zinc-800 text-xs">S'abonner au plan payant</h5>
                        <p className="text-[10px] text-zinc-500 leading-normal">
                          Bénéficie d'un accès premium immédiat et indépendant pour 2,99 €/mo. Sans engagement.
                        </p>
                      </div>
                      
                      <div className="mt-3">
                        {isOption1Processing ? (
                          <button
                            disabled
                            className="w-full py-2 bg-[#7C6FF7]/10 text-[#7C6FF7] font-bold rounded-full text-[10.5px] flex items-center justify-center space-x-2 border border-dashed border-[#7C6FF7]/20"
                          >
                            <span className="w-3 h-3 border-2 border-[#7C6FF7] border-t-transparent rounded-full animate-spin" />
                            <span>Paiement sécurisé en cours...</span>
                          </button>
                        ) : (
                          <button
                            onClick={handleSubscribePaid}
                            className={`w-full py-2 text-[10.5px] font-extrabold rounded-full transition active:scale-98 cursor-pointer text-center ${
                              premiumType === "paid"
                                ? "bg-emerald-50/60 text-emerald-600 border border-emerald-200/50"
                                : "bg-[#7C6FF7] text-white hover:bg-[#6A5DE6] shadow-2xs"
                            }`}
                          >
                            {premiumType === "paid" ? "Abonnement Mensuel Actif ✓" : "S'abonner (2,99 € / mois)"}
                          </button>
                        )}
                      </div>
                    </div>

                    {/* OPTION 2: School Partner */}
                    <div className="p-4 rounded-2xl bg-zinc-50 border border-[#F0F0F0]/70 hover:border-[#7C6FF7]/20 transition-all text-left relative overflow-hidden">
                      {premiumType === "school" && (
                        <div className="absolute right-3 top-3 bg-[#7C6FF7] text-white text-[9px] font-extrabold py-0.5 px-1.5 rounded-full uppercase tracking-wider">
                          Étudiant
                        </div>
                      )}

                      <div className="space-y-1">
                        <span className="text-[9px] uppercase font-extrabold text-[#7C6FF7] tracking-wider block">Option 2</span>
                        <h5 className="font-extrabold text-zinc-800 text-xs font-sans">Code Établissement</h5>
                        <p className="text-[10px] text-zinc-500 leading-normal">
                          Accède gratuitement grâce au partenariat de ton école ou université.
                        </p>
                      </div>

                      {/* Interactive block for Option 2 steps */}
                      <div className="mt-3 pt-3 border-t border-zinc-200/40">
                        {schoolCodeStep === "idle" && (
                          <button
                            onClick={() => {
                              setSchoolCodeStep("code-input");
                              setVerificationError("");
                              setSchoolCode("");
                              setAcademicEmail("");
                              setEmailVerifyCode("");
                            }}
                            className="w-full py-2 bg-white text-[#7C6FF7] hover:bg-[#7C6FF7]/5 border border-[#7C6FF7]/25 font-extrabold rounded-full text-[10.5px] transition active:scale-98 cursor-pointer text-center"
                          >
                            {premiumType === "school" ? "Changer de code / d'école" : "Entrer un code établissement"}
                          </button>
                        )}

                        {schoolCodeStep === "code-input" && (
                          <div className="space-y-2">
                            <label className="text-[9px] font-extrabold text-zinc-400 uppercase tracking-tight block">
                              Code d'accès de l'établissement :
                            </label>
                            <div className="relative">
                              <input
                                type="text"
                                value={schoolCode}
                                onChange={(e) => {
                                  setSchoolCode(e.target.value);
                                  setVerificationError("");
                                }}
                                placeholder="Codes d'essais: SORBONNE, HEC, MIND2026..."
                                className="w-full py-2 px-3.5 text-xs bg-white border border-zinc-200/60 rounded-2xl focus:outline-none focus:border-[#7C6FF7]"
                              />
                            </div>
                            {verificationError && (
                              <p className="text-[9.5px] text-rose-500 font-bold">{verificationError}</p>
                            )}
                            <div className="text-[9px] text-zinc-400 leading-tight">
                              Exemples : tape <span className="underline cursor-pointer font-semibold text-zinc-500" onClick={() => { setSchoolCode("SORBONNE"); setVerificationError(""); }}>SORBONNE</span> ou <span className="underline cursor-pointer font-semibold text-zinc-500" onClick={() => { setSchoolCode("HEC"); setVerificationError(""); }}>HEC</span>.
                            </div>
                            <div className="flex space-x-2 pt-1">
                              <button
                                onClick={() => setSchoolCodeStep("idle")}
                                className="flex-1 py-1.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-650 rounded-full text-[10px] font-bold cursor-pointer transition text-center border-0"
                              >
                                Annuler
                              </button>
                              <button
                                onClick={handleVerifyCode}
                                disabled={!schoolCode.trim()}
                                className="flex-1 py-1.5 bg-[#7C6FF7] disabled:opacity-40 text-white rounded-full text-[10px] font-bold cursor-pointer hover:bg-[#6A5DE6] transition text-center"
                              >
                                Vérifier le code
                              </button>
                            </div>
                          </div>
                        )}

                        {schoolCodeStep === "verifying-code" && (
                          <div className="py-3 flex flex-col items-center justify-center text-center space-y-2">
                            <span className="w-4 h-4 border-2 border-[#7C6FF7] border-t-transparent rounded-full animate-spin" />
                            <p className="text-[10px] text-zinc-500 font-bold">Vérification du code en cours...</p>
                          </div>
                        )}

                        {schoolCodeStep === "email-input" && (
                          <div className="space-y-2.5">
                            <div className="bg-emerald-50 text-emerald-800 text-[10px] p-2.5 rounded-xl border border-emerald-100 font-bold leading-tight">
                              ✓ Établissement reconnu : {schoolName}
                            </div>
                            <div className="space-y-1">
                              <label className="text-[9px] font-extrabold text-zinc-400 uppercase block">
                                E-mail étudiant (scolaire/académique) :
                              </label>
                              <input
                                type="email"
                                value={academicEmail}
                                onChange={(e) => {
                                  setAcademicEmail(e.target.value);
                                  setVerificationError("");
                                }}
                                placeholder="Ex: marie.curie@etu.sorbonne.fr"
                                className="w-full py-2 px-3.5 text-xs bg-white border border-zinc-200/60 rounded-2xl focus:outline-none focus:border-[#7C6FF7]"
                              />
                              {verificationError && (
                                <p className="text-[9.5px] text-rose-500 font-bold">{verificationError}</p>
                              )}
                            </div>
                            <div className="flex space-x-2 pt-1">
                              <button
                                onClick={() => {
                                  setSchoolCodeStep("code-input");
                                  setVerificationError("");
                                }}
                                className="flex-1 py-1.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-650 rounded-full text-[10px] font-bold cursor-pointer transition text-center border-0"
                              >
                                Retour
                              </button>
                              <button
                                onClick={handleSendEmail}
                                disabled={!academicEmail.trim() || !isEmailValid(academicEmail)}
                                className="flex-1 py-1.5 bg-[#7C6FF7] disabled:opacity-40 text-white rounded-full text-[10px] font-bold cursor-pointer hover:bg-[#6A5DE6] transition text-center"
                              >
                                M'envoyer le code
                              </button>
                            </div>
                          </div>
                        )}

                        {schoolCodeStep === "sending-email" && (
                          <div className="py-3 flex flex-col items-center justify-center text-center space-y-2">
                            <span className="w-4 h-4 border-2 border-[#7C6FF7] border-t-transparent rounded-full animate-spin" />
                            <p className="text-[10px] text-zinc-500 font-bold">Génération du courriel temporaire...</p>
                          </div>
                        )}

                        {schoolCodeStep === "verify-input" && (
                          <div className="space-y-2.5">
                            <div className="bg-[#7C6FF7]/5 text-[10px] p-2.5 rounded-xl border border-[#7C6FF7]/15 leading-tight">
                              📧 Code de confirmation envoyé à <strong className="font-bold text-zinc-700">{academicEmail}</strong>.
                            </div>
                            
                            <div className="space-y-1">
                              <label className="text-[9px] font-extrabold text-zinc-400 uppercase block">
                                Saisis le code de validation reçu (4 chiffres) :
                              </label>
                              <input
                                type="text"
                                maxLength={4}
                                value={emailVerifyCode}
                                onChange={(e) => {
                                  setEmailVerifyCode(e.target.value.replace(/\D/g, ''));
                                  setVerificationError("");
                                }}
                                placeholder="Code (Ex: 1234)"
                                className="w-full py-2 text-center text-sm font-black bg-white border border-zinc-200/60 rounded-2xl focus:outline-none focus:border-[#7C6FF7] tracking-widest text-[#7C6FF7]"
                              />
                              <p className="text-[9px] text-[#7C6FF7] font-bold text-center mt-1">
                                (Saisis n'importe quel code pour continuer, ex: "1234")
                              </p>
                              {verificationError && (
                                <p className="text-[9.5px] text-rose-500 font-bold text-center">{verificationError}</p>
                              )}
                            </div>

                            <div className="flex space-x-2 pt-1">
                              <button
                                onClick={() => {
                                  setSchoolCodeStep("email-input");
                                  setVerificationError("");
                                }}
                                className="flex-1 py-1.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-650 rounded-full text-[10px] font-bold cursor-pointer transition text-center border-0"
                              >
                                Retour
                              </button>
                              <button
                                onClick={handleConfirmEmailCode}
                                disabled={emailVerifyCode.trim().length === 0}
                                className="flex-1 py-1.5 bg-[#7C6FF7] disabled:opacity-40 text-white rounded-full text-[10px] font-bold cursor-pointer hover:bg-[#6A5DE6] transition text-center"
                              >
                                Valider & Activer
                              </button>
                            </div>
                          </div>
                        )}

                        {schoolCodeStep === "activating" && (
                          <div className="py-3 flex flex-col items-center justify-center text-center space-y-2">
                            <span className="w-4 h-4 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                            <p className="text-[10px] text-zinc-550 font-bold">Finalisation de la liaison gratuite...</p>
                          </div>
                        )}

                        {schoolCodeStep === "success" && (
                          <div className="bg-emerald-50 text-emerald-800 text-[10.5px] p-3.5 rounded-2xl border border-emerald-100/60 text-center space-y-2">
                            <span className="text-2xl block">🎓🎖️</span>
                            <p className="font-extrabold text-emerald-900">Premium Étudiant Validé !</p>
                            <p className="text-[10px] text-emerald-700 leading-normal">
                              Tout est parfait. Tu profites désormais d'un accès Premium illimité et totalement gratuit financé par <strong className="font-extrabold">{schoolName}</strong>.
                            </p>
                            <button
                              onClick={() => setSchoolCodeStep("idle")}
                              className="w-full py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full text-[10px] font-bold transition cursor-pointer"
                            >
                              Génial, merci !
                            </button>
                          </div>
                        )}

                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* B. COMPTE — MODIFIER MON PROFIL SUB-PAGE */}
            {activeSub === "compte-profil" && (
              <div className="bg-white border border-zinc-200/50 p-5 rounded-3xl space-y-4 shadow-sm">
                <h4 className="text-[11px] font-bold text-[#7C6FF7] uppercase tracking-wider mb-2">Modifier mon profil</h4>
                
                {/* Form fields with real-time validation */}
                <div className="space-y-4">
                  {/* Prénom */}
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-zinc-400 px-1">Prénom</label>
                    <div className="relative">
                      <input
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className={`w-full py-2.5 px-4 text-xs bg-zinc-50 border rounded-2xl focus:outline-none focus:bg-white transition-all ${
                          firstName.trim() ? "border-zinc-200/50 focus:border-[#7C6FF7]" : "border-rose-300 focus:border-rose-500 bg-rose-50/5"
                        }`}
                        placeholder="Ex: Léa"
                      />
                      <div className="absolute right-3.5 top-2.5 select-none font-bold text-xs">
                        {firstName.trim() ? (
                          <span className="text-emerald-500">✓</span>
                        ) : (
                          <span className="text-rose-500">!</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Nom */}
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-zinc-400 px-1">Nom</label>
                    <div className="relative">
                      <input
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className={`w-full py-2.5 px-4 text-xs bg-zinc-50 border rounded-2xl focus:outline-none focus:bg-white transition-all ${
                          lastName.trim() ? "border-zinc-200/50 focus:border-[#7C6FF7]" : "border-rose-300 focus:border-rose-500 bg-rose-50/5"
                        }`}
                        placeholder="Ex: Martin"
                      />
                      <div className="absolute right-3.5 top-2.5 select-none font-bold text-xs">
                        {lastName.trim() ? (
                          <span className="text-emerald-500">✓</span>
                        ) : (
                          <span className="text-rose-500">!</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-zinc-400 px-1">Adresse E-mail</label>
                    <div className="relative">
                      <input
                        type="email"
                        value={emailField}
                        onChange={(e) => setEmailField(e.target.value)}
                        className={`w-full py-2.5 px-4 text-xs bg-zinc-50 border rounded-2xl focus:outline-none focus:bg-white transition-all ${
                          isEmailValid(emailField) ? "border-zinc-200/50 focus:border-[#7C6FF7]" : "border-rose-300 focus:border-rose-500 bg-rose-50/5"
                        }`}
                        placeholder="Ex: lea@email.fr"
                      />
                      <div className="absolute right-3.5 top-2.5 select-none font-bold text-xs">
                        {isEmailValid(emailField) ? (
                          <span className="text-emerald-500">✓</span>
                        ) : (
                          <span className="text-rose-500">!</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Real-time Validation Label Feedback */}
                  {!isProfileValid && (
                    <p className="text-[10px] text-rose-500 font-semibold px-1">
                      ⚠️ Les champs ne doivent pas être vides, et l'e-mail doit avoir un format correct.
                    </p>
                  )}

                  <button
                    disabled={!isProfileValid}
                    onClick={handleSaveProfile}
                    className="w-full py-3 bg-[#7C6FF7] disabled:opacity-35 text-white font-bold rounded-full text-xs hover:bg-[#6A5DE6] transition shadow-sm cursor-pointer select-none mt-2"
                  >
                    Enregistrer les modifications
                  </button>
                </div>
              </div>
            )}

            {/* C. COMPTE — MOT DE PASSE SUB-PAGE */}
            {activeSub === "compte-pwd" && (
              <form onSubmit={handleSavePassword} className="bg-white border border-zinc-200/50 p-5 rounded-3xl space-y-4 shadow-sm">
                <h4 className="text-[11px] font-bold text-[#7C6FF7] uppercase tracking-wider mb-2">Modifier mon mot de passe</h4>

                <div className="space-y-4">
                  {/* Ancien */}
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-zinc-400 px-1">Ancien mot de passe</label>
                    <input
                      type="password"
                      value={oldPassword}
                      onChange={(e) => setOldPassword(e.target.value)}
                      className="w-full py-2.5 px-4 text-xs bg-zinc-50 border border-zinc-200/50 rounded-2xl focus:outline-none focus:border-[#7C6FF7] transition-all bg-white"
                      placeholder="Ancien code secret"
                    />
                  </div>

                  {/* Nouveau */}
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-zinc-400 px-1">Nouveau mot de passe (min 8 car.)</label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full py-2.5 px-4 text-xs bg-zinc-50 border border-zinc-200/50 rounded-2xl focus:outline-none focus:border-[#7C6FF7] transition-all bg-white"
                      placeholder="Choisissez un code sécurisé"
                    />
                    {newPassword.length > 0 && (
                      <div className="flex justify-between items-center px-1 mt-0.5">
                        <span className={`text-[10px] font-medium transition-colors ${newPassword.length >= 8 ? "text-emerald-600" : "text-zinc-400"}`}>
                          {newPassword.length} / 8 caractères {newPassword.length >= 8 ? "✓" : ""}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Confirmation */}
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-zinc-400 px-1">Confirmer le nouveau mot de passe</label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full py-2.5 px-4 text-xs bg-zinc-50 border border-zinc-200/50 rounded-2xl focus:outline-none focus:border-[#7C6FF7] transition-all bg-white"
                      placeholder="Retapez le nouveau mot de passe"
                    />
                  </div>

                  {newPassword && newPassword.length < 8 && (
                    <p className="text-[10px] text-rose-500 font-semibold px-1">
                      ⚠️ Le mot de passe doit comporter au moins 8 caractères.
                    </p>
                  )}

                  {confirmPassword && confirmPassword !== newPassword && (
                    <p className="text-[10px] text-rose-500 font-semibold px-1">
                      ⚠️ Les mots de passe ne correspondent pas.
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={!isPasswordValid}
                    className="w-full py-3 bg-[#7C6FF7] disabled:opacity-40 text-white font-bold rounded-full text-xs hover:bg-[#6A5DE6] transition shadow-sm cursor-pointer select-none mt-2"
                  >
                    Mettre à jour
                  </button>
                </div>
              </form>
            )}

            {/* D. COMPTE — LANGUE SUB-PAGE */}
            {activeSub === "compte-langue" && (
              <div className="bg-white border border-zinc-200/50 rounded-3xl p-4 shadow-sm space-y-2">
                {["Français", "English", "Español", "Deutsch"].map((lang) => (
                  <div
                    key={lang}
                    onClick={() => {
                      setSelectedLang(lang);
                      showToast(`Langue configurée : ${lang} 🌐`);
                      setActiveSub(null);
                    }}
                    className="p-3.5 flex items-center justify-between cursor-pointer rounded-2xl bg-zinc-100/50 border border-[#F0F0F0] hover:bg-zinc-100 transition-all"
                  >
                    <span className={`text-xs font-bold ${selectedLang === lang ? "text-[#7C6FF7]" : "text-zinc-700"}`}>
                      {lang}
                    </span>
                    {selectedLang === lang && (
                      <Check className="w-4 h-4 text-[#7C6FF7] stroke-[3]" />
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* E. CONFIDENTIALITÉ — MES DONNÉES SUB-PAGE */}
            {activeSub === "donnees" && (
              <div className="space-y-4">
                <div className="bg-white border border-zinc-200/50 p-5 rounded-3xl space-y-4 shadow-sm text-xs text-zinc-600 leading-relaxed text-left">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-100/50 flex items-center justify-center shrink-0 text-lg">
                    🛡️
                  </div>

                  <h4 className="font-bold text-zinc-805 text-xs">Outils de Souveraineté RGPD</h4>
                  
                  <p>
                    MindCare a été développé selon un principe de <span className="font-bold text-zinc-800">Cocon de Confidentialité</span>. Aucune de tes pensées d'intimité, dialogues ou humeurs n'est envoyée sur un serveur cloud externe.
                  </p>

                  <div className="bg-zinc-50 p-4 rounded-2xl border border-[#F0F0F0] space-y-2">
                    <span className="text-[10px] font-bold text-[#7C6FF7] uppercase tracking-wider block">Ce qui est stocké sous clé locale :</span>
                    <ul className="list-disc pl-4 space-y-1.5 text-[11px] font-medium text-zinc-650">
                      <li><span className="font-bold">Journaux :</span> Tes bilans d'humeur quotidiens.</li>
                      <li><span className="font-bold">Check-ins :</span> Les réponses aux rituels d'humeur.</li>
                      <li><span className="font-bold">Conversations :</span> Tes échanges intimes avec Mindy.</li>
                    </ul>
                  </div>

                  <p className="text-[11px] italic text-[#7C6FF7] font-semibold text-center mt-2 block">
                    "Ces trésors restent exclusivement les tiens, scellés sur ton appareil."
                  </p>
                </div>
              </div>
            )}

            {/* F. AIDE & SUPPORT SUB-PAGE */}
            {activeSub === "aide" && (
              <div className="space-y-5">
                {/* Support courriel CTA */}
                <div className="bg-gradient-to-tr from-[#7C6FF7]/10 to-white border border-[#7C6FF7]/15 p-5 rounded-3xl space-y-3 shadow-xs text-center">
                  <span className="text-3xl block">👋</span>
                  <h4 className="font-bold text-zinc-900 text-xs">Tu as une question ou besoin d'aide ?</h4>
                  <p className="text-[10.5px] text-zinc-500 leading-relaxed font-medium">
                    Notre équipe d'auto-préservation est accessible par mail pour t'aider à utiliser MindCare en toute sérénité.
                  </p>
                  
                  <a
                    href="mailto:support@mindcare.fr?subject=Aide%20MindCare"
                    className="w-full inline-flex items-center justify-center space-x-2 py-3 bg-[#7C6FF7] text-white font-bold rounded-full text-xs hover:bg-[#6A5DE6] transition shadow-xs cursor-pointer"
                    onClick={() => showToast("Ouverture de ton client e-mail ✉️")}
                  >
                    <Mail className="w-4 h-4" />
                    <span>Contacter le support</span>
                  </a>
                </div>

                {/* FAQ simple */}
                <div className="space-y-3">
                  <h4 className="text-[11px] font-bold tracking-widest text-zinc-400 uppercase select-none px-1">
                    Foire aux Questions
                  </h4>

                  <div className="space-y-2.5">
                    {/* Q1 */}
                    <div className="bg-white border border-zinc-200/50 rounded-2xl p-4 space-y-1 shadow-2xs">
                      <h5 className="font-bold text-xs text-zinc-900 leading-snug">
                        Comment mes données sont-elles protégées ?
                      </h5>
                      <p className="text-[10.5px] text-zinc-500 leading-relaxed font-medium">
                        Chaque fragment d'historique ou de note est chiffré et stocké localement et uniquement sur ton appareil. Personne d'autre n'y a accès.
                      </p>
                    </div>

                    {/* Q2 */}
                    <div className="bg-white border border-zinc-200/50 rounded-2xl p-4 space-y-1 shadow-2xs">
                      <h5 className="font-bold text-xs text-zinc-900 leading-snug">
                        MindCare remplace-t-il un suivi de psychologue ?
                      </h5>
                      <p className="text-[10.5px] text-zinc-500 leading-relaxed font-medium">
                        Non, MindCare est un havre d'auto-préservation et de soulagement ponctuel. En cas de détresse psychologique, consulte des spécialistes médicaux.
                      </p>
                    </div>

                    {/* Q3 */}
                    <div className="bg-white border border-zinc-200/50 rounded-2xl p-4 space-y-1 shadow-2xs">
                      <h5 className="font-bold text-xs text-zinc-900 leading-snug">
                        Comment fonctionne le suivi d'humeur ?
                      </h5>
                      <p className="text-[10.5px] text-zinc-500 leading-relaxed font-medium">
                        Réponds chaque jour au rituel de check-in rapide. Vos humeurs s'enregistrent dans le Calendrier pour déceler d'éventuels cycles de bien-être.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Quick footer back button in sub-page */}
            <div className="pt-2 select-none">
              <button
                onClick={() => setActiveSub(null)}
                className="w-full py-3 border border-zinc-200/50 hover:bg-zinc-150 text-zinc-500 font-bold rounded-full text-xs transition active:scale-98 cursor-pointer text-center"
              >
                Retour aux options
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */
      /* FLOATING OVERLAY MODALS                                                    */
      /* ========================================================================= */}

      {/* 1. SE DECONNECTER CONFIRMATION MODAL */}
      <AnimatePresence>
        {showLogoutModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-neutral-900/60 z-50 flex items-center justify-center p-5 backdrop-blur-xs"
            id="modal-logout-backdrop"
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="bg-white rounded-3xl p-5.5 w-full max-w-[310px] space-y-4 shadow-xl text-center border border-[#F0F0F0]"
              id="modal-logout-body"
            >
              <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-100 text-rose-500 flex items-center justify-center mx-auto shadow-2xs">
                <LogOut className="w-5 h-5" />
              </div>
              
              <div className="space-y-1.5">
                <h3 className="text-sm font-bold text-zinc-900">Se déconnecter de MindCare ?</h3>
                <p className="text-[11px] text-zinc-500 leading-relaxed font-medium px-1">
                  Tu vas être déconnecté. Tes données restent sur cet appareil. Tu pourras de nouveau te reconnecter en un instant.
                </p>
              </div>

              <div className="flex flex-col space-y-2 pt-2 select-none">
                <button
                  onClick={handleLogout}
                  className="w-full py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-full text-xs uppercase tracking-wider cursor-pointer"
                  id="btn-confirm-logout"
                >
                  Confirmer la déconnexion
                </button>
                <button
                  onClick={() => setShowLogoutModal(false)}
                  className="w-full py-2.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-650 font-bold rounded-full text-xs uppercase tracking-wider cursor-pointer"
                  id="btn-cancel-logout"
                >
                  Annuler
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. PURGER LES DONNES CONFIRMATION MODAL */}
      <AnimatePresence>
        {showDeleteModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-neutral-900/60 z-50 flex items-center justify-center p-5 backdrop-blur-xs"
            id="modal-delete-backdrop"
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="bg-white rounded-3xl p-5.5 w-full max-w-[310px] space-y-4 shadow-xl text-center border border-rose-100"
              id="modal-delete-body"
            >
              <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center mx-auto shadow-2xs">
                <AlertTriangle className="w-5 h-5" />
              </div>
              
              <div className="space-y-1.5">
                <h3 className="text-sm font-bold text-rose-700">Supprimer définitivement ?</h3>
                <p className="text-[11px] text-zinc-500 leading-relaxed font-medium px-1">
                  Cette opération supprimera définitivement tous vos check-ins, journal, et dialogues de cet appareil. Cette action est irréversible.
                </p>
                <div className="bg-rose-50 rounded-xl p-2.5 text-[10px] text-rose-700 font-bold border border-rose-100 select-none">
                  ⚠️ NOTATION : Rien ne pourra être restauré !
                </div>
              </div>

              <div className="flex flex-col space-y-2 pt-2 select-none">
                <button
                  onClick={handleDeleteDataAndAccount}
                  className="w-full py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-full text-xs uppercase tracking-wider cursor-pointer"
                  id="btn-confirm-delete"
                >
                  Supprimer définitivement
                </button>
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="w-full py-2.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-650 font-bold rounded-full text-xs uppercase tracking-wider cursor-pointer"
                  id="btn-cancel-delete"
                >
                  Annuler
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
