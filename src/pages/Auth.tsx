import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, AlertCircle, Eye, EyeOff, ArrowLeft, Check, Compass, Shield, ShieldAlert, Mail } from "lucide-react";
import { UserProfile } from "../types";

interface AuthProps {
  currentPath: string;
  setPath: (path: string) => void;
  userProfile: UserProfile;
  updateProfile: (profile: Partial<UserProfile>) => void;
}

// Reusable elegant custom checkbox for premium look and feel
interface CustomCheckboxProps {
  id: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: React.ReactNode;
}

function CustomCheckbox({ id, checked, onChange, label }: CustomCheckboxProps) {
  return (
    <div 
      className="flex items-start space-x-3.5 group cursor-pointer py-1 select-none"
      onClick={() => onChange(!checked)}
    >
      <div className="relative mt-0.5">
        <input
          id={id}
          type="checkbox"
          checked={checked}
          onChange={() => {}} // handled by parent div click
          className="sr-only"
        />
        <motion.div
          animate={{
            backgroundColor: checked ? "#7C3AED" : "rgb(244 244 245)",
            borderColor: checked ? "#7C3AED" : "rgb(212 212 216)",
            scale: checked ? [1, 1.1, 1] : 1,
          }}
          transition={{ duration: 0.2 }}
          className="w-5 h-5 rounded-md border flex items-center justify-center transition-colors group-hover:border-brand-medium"
        >
          {checked && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
            >
              <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />
            </motion.div>
          )}
        </motion.div>
      </div>
      <label htmlFor={id} className="text-xs text-zinc-600 group-hover:text-neutral-dark leading-snug cursor-pointer font-medium transition-colors">
        {label}
      </label>
    </div>
  );
}

export default function Auth({ currentPath, setPath, userProfile, updateProfile }: AuthProps) {
  const [viewState, setViewState] = useState<"splash" | "signup" | "login" | "verify">("splash");
  
  const [name, setName] = useState(userProfile.name || "");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  
  // Registration Checkboxes
  const [cguChecked, setCguChecked] = useState(false);
  const [rgpdChecked, setRgpdChecked] = useState(false);
  const [medicalChecked, setMedicalChecked] = useState(false);
  
  // Verification Checkboxes
  const [openEmailChecked, setOpenEmailChecked] = useState(false);
  const [clickLinkChecked, setClickLinkChecked] = useState(false);
  const [comeBackChecked, setComeBackChecked] = useState(false);
  
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Merci de nous indiquer ton joli prénom.");
      return;
    }
    if (!email.trim() || !email.includes("@")) {
      setError("Merci d'indiquer un e-mail valide pour recevoir ton lien.");
      return;
    }
    if (password.length < 5) {
      setError("Ton mot de passe doit mesurer au moins 5 caractères.");
      return;
    }
    if (!cguChecked || !rgpdChecked || !medicalChecked) {
      setError("Merci de lire et d'accepter l'ensemble des chartes et déclarations.");
      return;
    }

    setError("");
    setIsSubmitting(true);
    
    // Simulate brief delightful validation loader
    setTimeout(() => {
      setIsSubmitting(false);
      setViewState("verify");
    }, 600);
  };

  const handleConfirmEmailCode = () => {
    if (!openEmailChecked || !clickLinkChecked || !comeBackChecked) {
      setError("Merci d'accomplir et de cocher toutes les étapes de confirmation pour continuer.");
      return;
    }
    
    setError("");
    updateProfile({
      name: name.trim(),
      email: email.trim(),
      isRegistered: true,
      gdprAccepted: true,
    });
    setPath("onboarding");
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes("@")) {
      setError("Merci d'indiquer un email valide.");
      return;
    }
    if (!password) {
      setError("Le mot de passe est obligatoire pour se connecter.");
      return;
    }

    setError("");
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      updateProfile({
        isRegistered: true,
        isOnboarded: true, 
        name: name || "Ami",
        email: email,
      });
      setPath("dashboard");
    }, 600);
  };

  return (
    <div className="flex-1 flex flex-col justify-between px-5 py-4 select-none relative overflow-x-hidden overflow-y-auto min-h-0 w-full max-w-md mx-auto">
      
      {/* Absolute background visual touch */}
      <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-brand-lavender/20 blur-3xl pointer-events-none" />
      <div className="absolute bottom-12 left-0 w-32 h-24 rounded-full bg-emerald-100/10 blur-2xl pointer-events-none" />

      <AnimatePresence mode="wait">
        
        {/* 1. Splash choice state */}
        {viewState === "splash" && (
          <motion.div 
            key="splash"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="flex-1 flex flex-col justify-between py-6"
          >
            <div className="flex-1 flex flex-col items-center justify-center text-center px-2 space-y-10">
              <div className="relative">
                {/* Expanding organic rings behind the logo */}
                <motion.div 
                  animate={{ scale: [1, 1.25, 1], opacity: [0.15, 0.4, 0.15] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute inset-0 bg-brand-lavender rounded-full blur-xl scale-125"
                />
                
                <motion.div
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                  className="w-22 h-22 rounded-[28px] bg-white border border-brand-lavender flex items-center justify-center shadow-xl shadow-brand-medium/5 relative z-10"
                >
                  <Sparkles className="w-10 h-10 text-brand-medium" />
                </motion.div>
                
                {/* Floating micro accent shapes or specs */}
                <span className="absolute -top-1 -right-1 text-xs">✨</span>
              </div>

              <div className="space-y-4">
                <h1 className="font-display text-[29px] text-neutral-dark text-center leading-tight tracking-tight select-none">
                  Installe-toi durablement <br />dans la douceur.
                </h1>
                <p className="font-sans text-[13.5px] text-zinc-500 max-w-xs mx-auto leading-relaxed select-none">
                  MindCare t'offre un espace d'auto-préservation de confiance, anonyme et profondément rassurant.
                </p>
              </div>
            </div>

            <div className="space-y-3.5 px-1 relative z-20">
              <motion.button
                id="btn-goto-signup"
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setError("");
                  setViewState("signup");
                }}
                className="w-full py-3.5 bg-brand-medium text-white font-bold rounded-2xl shadow-md shadow-brand-medium/15 hover:bg-brand-deep active:bg-brand-deep transition-all text-sm cursor-pointer border border-transparent"
              >
                Créer mon espace
              </motion.button>
              <motion.button
                id="btn-goto-login"
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setError("");
                  setViewState("login");
                }}
                className="w-full py-3.5 bg-white border border-zinc-200 text-brand-medium font-bold rounded-2xl hover:bg-zinc-50/80 transition-all text-sm cursor-pointer shadow-sm"
              >
                Me connecter
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* 2. Signup Page - "Crée ton espace" */}
        {viewState === "signup" && (
          <motion.div
            key="signup"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="flex-1 flex flex-col justify-between py-1"
          >
            <div className="px-1">
              <div className="flex items-center justify-between mb-5">
                <button
                  id="btn-signup-back"
                  onClick={() => setViewState("splash")}
                  className="w-9 h-9 border border-zinc-200 hover:border-neutral-dark rounded-xl flex items-center justify-center hover:bg-zinc-50 transition cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4 text-neutral-dark" />
                </button>
                <div className="bg-brand-lavender/30 text-brand-medium font-bold text-[10px] px-3 py-1 rounded-full uppercase tracking-wider">
                  Sécurisé 🔒
                </div>
              </div>

              <h2 className="font-display text-[29px] text-neutral-dark tracking-tight leading-tight mb-2">
                Crée ton espace
              </h2>
              <p className="text-xs text-zinc-500 font-medium mb-5">
                Quelques secondes suffisent pour commencer ton voyage.
              </p>

              {error && (
                <motion.div 
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-rose-50 text-rose-800 text-xs px-3.5 py-3 rounded-xl mb-4 flex items-start space-x-2 border border-rose-100 shadow-sm"
                >
                  <AlertCircle className="w-4 h-4 mt-0.5 shrink-0 text-rose-550" />
                  <span className="font-medium">{error}</span>
                </motion.div>
              )}

              <form onSubmit={handleSignupSubmit} className="space-y-4">
                {/* Beautiful Custom Fields */}
                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <label htmlFor="signup-name-input" className="text-[10px] font-bold tracking-widest text-[#2C2929] block uppercase">
                      PRÉNOM OU PSEUDO
                    </label>
                  </div>
                  <input
                    id="signup-name-input"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Prénom ou pseudo"
                    className="w-full bg-zinc-100/80 border border-zinc-200/50 rounded-xl py-3 px-4 text-xs focus:outline-none focus:border-brand-medium focus:bg-white focus:ring-4 focus:ring-brand-lavender/30 transition-all font-medium text-neutral-dark placeholder-zinc-400"
                  />
                </div>

                <div className="space-y-1">
                  <label htmlFor="signup-email-input" className="text-[10px] font-bold tracking-widest text-[#2C2929] block uppercase">
                    ADRESSE E-MAIL
                  </label>
                  <input
                    id="signup-email-input"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ton.nom@email.com"
                    className="w-full bg-zinc-100/80 border border-zinc-200/50 rounded-xl py-3 px-4 text-xs focus:outline-none focus:border-brand-medium focus:bg-white focus:ring-4 focus:ring-brand-lavender/30 transition-all font-medium text-neutral-dark placeholder-zinc-400"
                  />
                </div>

                <div className="space-y-1">
                  <label htmlFor="signup-password-input" className="text-[10px] font-bold tracking-widest text-[#2C2929] block uppercase">
                    MOT DE PASSE
                  </label>
                  <div className="relative">
                    <input
                      id="signup-password-input"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Minimum 5 caractères"
                      className="w-full bg-zinc-100/80 border border-zinc-200/50 rounded-xl py-3 pl-4 pr-11 text-xs focus:outline-none focus:border-brand-medium focus:bg-white focus:ring-4 focus:ring-brand-lavender/30 transition-all font-medium text-neutral-dark placeholder-zinc-400"
                    />
                    <button
                      id="signup-toggle-pwd"
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-md hover:bg-zinc-200/50 transition text-zinc-450 cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4 text-zinc-500" /> : <Eye className="w-4 h-4 text-zinc-500" />}
                    </button>
                  </div>
                </div>

                {/* Customized check sliders/boxes */}
                <div className="space-y-3 pt-3.5 border-t border-zinc-100">
                  <CustomCheckbox
                    id="chk-cgu"
                    checked={cguChecked}
                    onChange={setCguChecked}
                    label="J'accepte les CGU et la politique de confidentialité solide"
                  />

                  <CustomCheckbox
                    id="chk-rgpd"
                    checked={rgpdChecked}
                    onChange={setRgpdChecked}
                    label="Je consens au traitement sécurisé de mes données (RGPD)"
                  />

                  <CustomCheckbox
                    id="chk-medical"
                    checked={medicalChecked}
                    onChange={setMedicalChecked}
                    label="Je comprends que MindCare n'est pas un substitut médical"
                  />
                </div>

                <div className="space-y-2 pt-3">
                  <motion.button
                    id="signup-submit-btn"
                    whileTap={{ scale: 0.98 }}
                    disabled={isSubmitting}
                    type="submit"
                    className="w-full h-12 bg-neutral-900 border border-neutral-900 text-white hover:bg-brand-medium hover:border-brand-medium font-bold rounded-2xl transition-all duration-200 text-sm cursor-pointer shadow-sm flex items-center justify-center space-x-2"
                  >
                    {isSubmitting ? (
                      <div className="w-5 h-5 border-2 border-white/35 border-t-white rounded-full animate-spin" />
                    ) : (
                      <span>Créer mon espace</span>
                    )}
                  </motion.button>
                  
                  <button
                    id="signup-switch-login-btn"
                    type="button"
                    onClick={() => {
                      setError("");
                      setViewState("login");
                    }}
                    className="w-full py-2.5 text-zinc-500 hover:text-brand-medium font-bold text-xs text-center transition cursor-pointer"
                  >
                    J’ai déjà un compte • Me connecter
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        )}

        {/* 3. Link Verification Page: "Vérifie ta boîte mail" */}
        {viewState === "verify" && (
          <motion.div
            key="verify"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="flex-1 flex flex-col justify-between py-1"
          >
            <div className="px-1">
              <button
                id="btn-verify-back"
                onClick={() => setViewState("signup")}
                className="w-9 h-9 border border-zinc-200 hover:border-neutral-dark rounded-xl flex items-center justify-center hover:bg-zinc-50 transition mb-5 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4 text-neutral-dark" />
              </button>

              <div className="w-12 h-12 rounded-xl bg-brand-lavender/50 flex items-center justify-center mb-4">
                <Mail className="w-6 h-6 text-brand-medium animate-pulse" />
              </div>

              <h2 className="font-display text-[29px] text-neutral-dark tracking-tight leading-tight mb-2">
                Vérifie ta boîte mail
              </h2>
              <p className="text-xs text-zinc-500 mb-4 font-medium leading-snug">
                On a envoyé un lien de confirmation sécurisé à :
              </p>

              {/* Sophisticated organic design representation for email badge */}
              <div className="bg-brand-lavender/25 text-brand-deep rounded-xl py-2.5 px-4 w-max text-xs font-bold font-mono tracking-wide mb-6 select-all border border-brand-lavender/50 flex items-center space-x-1.5 shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-medium animate-ping mr-1" />
                {email || "lea@email.fr"}
              </div>

              {error && (
                <div className="bg-rose-50 text-rose-800 text-xs px-3.5 py-3 rounded-xl mb-4 flex items-start space-x-2 border border-rose-100">
                  <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Progress-oriented Checklist representing professional UI/UX */}
              <div className="space-y-3.5 pt-2 border-t border-zinc-100">
                <div 
                  className={`flex items-center space-x-3.5 p-3.5 rounded-xl border transition-all cursor-pointer ${
                    openEmailChecked ? "bg-emerald-50/45 border-emerald-250 text-emerald-900" : "bg-zinc-100/60 border-transparent hover:bg-zinc-100"
                  }`}
                  onClick={() => setOpenEmailChecked(!openEmailChecked)}
                >
                  <CustomCheckbox
                    id="chk-verify-open"
                    checked={openEmailChecked}
                    onChange={setOpenEmailChecked}
                    label={<span className={`text-[12.5px] font-medium leading-relaxed ${openEmailChecked ? "text-emerald-950 font-semibold" : "text-zinc-700"}`}>Ouvre l’email que MindCare t'a envoyé</span>}
                  />
                </div>

                <div 
                  className={`flex items-center space-x-3.5 p-3.5 rounded-xl border transition-all cursor-pointer ${
                    clickLinkChecked ? "bg-emerald-50/45 border-emerald-250 text-emerald-900" : "bg-zinc-100/60 border-transparent hover:bg-zinc-100"
                  }`}
                  onClick={() => setClickLinkChecked(!clickLinkChecked)}
                >
                  <CustomCheckbox
                    id="chk-verify-click"
                    checked={clickLinkChecked}
                    onChange={setClickLinkChecked}
                    label={<span className={`text-[12.5px] font-medium leading-relaxed ${clickLinkChecked ? "text-emerald-950 font-semibold" : "text-zinc-700"}`}>Clique sur le lien de confirmation unique</span>}
                  />
                </div>

                <div 
                  className={`flex items-center space-x-3.5 p-3.5 rounded-xl border transition-all cursor-pointer ${
                    comeBackChecked ? "bg-emerald-50/45 border-emerald-250 text-emerald-900" : "bg-zinc-100/60 border-transparent hover:bg-zinc-100"
                  }`}
                  onClick={() => setComeBackChecked(!comeBackChecked)}
                >
                  <CustomCheckbox
                    id="chk-verify-return"
                    checked={comeBackChecked}
                    onChange={setComeBackChecked}
                    label={<span className={`text-[12.5px] font-medium leading-relaxed ${comeBackChecked ? "text-emerald-950 font-semibold" : "text-zinc-700"}`}>Reviens sur cette fenêtre pour continuer</span>}
                  />
                </div>
              </div>
            </div>

            <div className="px-1 mt-7 space-y-4">
              <motion.button
                id="verify-confirm-btn"
                whileTap={{ scale: 0.98 }}
                onClick={handleConfirmEmailCode}
                className="w-full py-3.5 border border-neutral-900 bg-white hover:bg-neutral-900 hover:text-white text-neutral-900 font-bold rounded-2xl transition duration-200 text-sm cursor-pointer shadow-sm block text-center"
              >
                J’ai validé mon e-mail 💜
              </motion.button>
              
              <div className="text-center pt-1.5 space-y-1">
                <span className="text-xs text-zinc-500 font-medium block">
                  Rien reçu dans tes spams ?
                </span>
                <button
                  id="verify-resend-btn"
                  type="button"
                  onClick={() => {
                    setError("");
                    alert("Un nouvel e-mail de confirmation très frais vous a été envoyé.");
                  }}
                  className="text-xs text-neutral-dark font-bold underline cursor-pointer hover:text-brand-medium"
                >
                  Renvoyer l’e-mail
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* 4. Login Page: "Me connecter" */}
        {viewState === "login" && (
          <motion.div
            key="login"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
            className="flex-1 flex flex-col justify-between py-1"
          >
            <div className="px-1">
              <button
                id="btn-login-back"
                onClick={() => setViewState("splash")}
                className="w-9 h-9 border border-zinc-200 hover:border-neutral-dark rounded-xl flex items-center justify-center hover:bg-zinc-50 transition mb-5 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4 text-neutral-dark" />
              </button>

              <h2 className="font-display text-[29px] text-neutral-dark tracking-tight leading-tight mb-2">
                Bon retour
              </h2>
              <p className="text-xs text-zinc-500 mb-5 font-medium">
                Retrouve ton espace personnalisé et poursuis sereinement.
              </p>

              {error && (
                <div className="bg-rose-50 text-rose-800 text-xs px-3.5 py-3 rounded-xl mb-4 flex items-start space-x-2 border border-rose-100">
                  <AlertCircle className="w-4 h-4 mt-0.5 shrink-0 text-rose-600" />
                  <span className="font-medium">{error}</span>
                </div>
              )}

              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div className="space-y-1">
                  <label htmlFor="login-email-input" className="text-[10px] font-bold tracking-widest text-[#2C2929] block uppercase">ADRESSE E-MAIL</label>
                  <input
                    id="login-email-input"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="nom@exemple.com"
                    className="w-full bg-zinc-100/80 border border-zinc-200/50 rounded-xl py-3 px-4 text-xs focus:outline-none focus:border-brand-medium focus:bg-white focus:ring-4 focus:ring-brand-lavender/30 transition font-medium text-neutral-dark placeholder-zinc-400"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between items-center px-1">
                    <label htmlFor="login-password-input" className="text-[10px] font-bold tracking-widest text-[#2C2929] block uppercase">MOT DE PASSE</label>
                    <span className="text-[11px] text-brand-medium hover:text-brand-deep cursor-pointer font-bold decoration-dotted underline">Oublié ?</span>
                  </div>
                  <div className="relative">
                    <input
                      id="login-password-input"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Entre ton mot de passe"
                      className="w-full bg-zinc-100/80 border border-zinc-200/50 rounded-xl py-3 pl-4 pr-11 text-xs focus:outline-none focus:border-brand-medium focus:bg-white focus:ring-4 focus:ring-brand-lavender/30 transition font-medium text-neutral-dark placeholder-zinc-400"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-md hover:bg-zinc-200/50 transition text-zinc-455 cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4 text-zinc-500" /> : <Eye className="w-4 h-4 text-zinc-500" />}
                    </button>
                  </div>
                </div>

                <motion.button
                  id="login-submit-btn"
                  whileTap={{ scale: 0.98 }}
                  disabled={isSubmitting}
                  type="submit"
                  className="w-full h-12 bg-neutral-900 border border-neutral-900 text-white hover:bg-brand-medium hover:border-brand-medium font-bold rounded-2xl mt-5 transition text-sm cursor-pointer shadow-sm flex items-center justify-center space-x-2"
                >
                  {isSubmitting ? (
                    <div className="w-5 h-5 border-2 border-white/35 border-t-white rounded-full animate-spin" />
                  ) : (
                    <span>Se connecter</span>
                  )}
                </motion.button>
              </form>
            </div>
            
            <button
              id="login-switch-signup-btn"
              type="button"
              onClick={() => {
                setError("");
                setViewState("signup");
              }}
              className="w-full py-3.5 text-zinc-500 hover:text-brand-medium font-bold text-xs text-center transition cursor-pointer"
            >
              Créer un nouvel espace personnel
            </button>
          </motion.div>
        )}

      </AnimatePresence>

    </div>
  );
}
