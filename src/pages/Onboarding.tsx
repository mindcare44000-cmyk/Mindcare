import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowLeft, HardDrive, EyeOff, RefreshCw, Check, Sparkles, BookOpen, Compass, Shield, Smile } from "lucide-react";
import { UserProfile } from "../types";

interface OnboardingProps {
  currentPath: string;
  setPath: (path: string) => void;
  userProfile: UserProfile;
  updateProfile: (profile: Partial<UserProfile>) => void;
}

interface Option {
  label: string;
  value: string;
  sub?: string;
}

interface Question {
  id: keyof AnswersState;
  question: string;
  subtitle: string;
  type: "single" | "multiple";
  options: Option[];
  helper?: string;
}

interface AnswersState {
  feel: string;
  stressFactors: string[];
  goods: string[];
  tendency: string[];
  selfTalk: string;
  improvements: string[];
  expression: string;
  tonality: string;
  socialProfile: string;
}

const QUESTIONS: Question[] = [
  {
    id: "feel",
    question: "Comment tu te sens en ce moment ?",
    subtitle: "Quelques secondes pour commencer",
    type: "single",
    options: [
      { label: "😐 Plutôt bien", value: "Plutôt bien" },
      { label: "😊 Je me sens bien", value: "Je me sens bien" },
      { label: "😐 Ça va, sans plus", value: "Ça va, sans plus" },
      { label: "😔 Plutôt fatigué(e) / à plat", value: "Plutôt fatigué(e) / à plat" },
      { label: "😔 Pas bien du tout", value: "Pas bien du tout" },
    ],
  },
  {
    id: "stressFactors",
    question: "Tes facteurs de stress ?",
    subtitle: "Identifier, c'est déjà avancer.",
    type: "multiple",
    helper: "Plusieurs choix possibles",
    options: [
      { label: "Etudes / Examens", value: "Etudes / Examens" },
      { label: "Relations sociales", value: "Relations sociales" },
      { label: "Avenir / orientation", value: "Avenir / orientation" },
      { label: "Argent / autonomie", value: "Argent / autonomie" },
      { label: "Solitude", value: "Solitude" },
      { label: "Surcharge / Rythme de vie", value: "Surcharge / Rythme de vie" },
    ],
  },
  {
    id: "goods",
    question: "Qu’est ce qui te fait du bien ?",
    subtitle: "Identifier, c'est déjà avancer.",
    type: "multiple",
    helper: "Plusieurs choix possibles",
    options: [
      { label: "Musique", value: "Musique" },
      { label: "Nature", value: "Nature" },
      { label: "Sport", value: "Sport" },
      { label: "Lecture", value: "Lecture" },
      { label: "Créativité", value: "Créativité" },
      { label: "Etre avec les autres", value: "Etre avec les autres" },
      { label: "Gaming", value: "Gaming" },
      { label: "Cuisine", value: "Cuisine" },
    ],
  },
  {
    id: "tendency",
    question: "Quand ça va mal, tu as tendance à....?",
    subtitle: "Pas de bonne ou de mauvaise réponse.",
    type: "multiple",
    helper: "Plusieurs choix possibles",
    options: [
      { label: "Me replier sur moi-même", value: "Me replier sur moi-même" },
      { label: "Ruminer, tourner en boucle", value: "Ruminer, tourner en boucle" },
      { label: "Me distraire pour ne pas y penser", value: "Me distraire pour ne pas y penser" },
      { label: "Chercher quelqu'un à qui parler", value: "Chercher quelqu'un à qui parler" },
      { label: "Agir, faire quelque chose pour bouger", value: "Agir, faire quelque chose pour bouger" },
    ],
  },
  {
    id: "selfTalk",
    question: "Comment tu te parles quand tu fais une erreur ?",
    subtitle: "Le regard qu'on pose sur soi en dit beaucoup.",
    type: "single",
    options: [
      { label: "Avec bienveillance", sub: "Je me pardonne assez vite", value: "Avec bienveillance" },
      { label: "Ça dépend", sub: "Parfois je me juge trop sévèrement", value: "Ça dépend" },
      { label: "Assez sévèrement", sub: "J'ai du mal à me pardonner", value: "Assez sévèrement" },
      { label: "Je n'y avais pas réfléchi", sub: "Je réalise mon regard", value: "Je n'y avais pas réfléchi" },
    ],
  },
  {
    id: "improvements",
    question: "Qu’est ce que tu veux améliorer avec Mindy ?",
    subtitle: "On avance mieux quand on sait où on va.",
    type: "multiple",
    helper: "Plusieurs choix possibles",
    options: [
      { label: "Mieux gérer mon stress au quotidien", value: "Mieux gérer mon stress au quotidien" },
      { label: "Améliorer mon sommeil", value: "Améliorer mon sommeil" },
      { label: "Me sentir moins seul·e", value: "Me sentir moins seul·e" },
      { label: "Mieux me connaître", value: "Mieux me connaître" },
      { label: "Reprendre confiance en moi", value: "Reprendre confiance en moi" },
      { label: "Retrouver de l'énergie et de la motivation", value: "Retrouver de l'énergie et de la motivation" },
    ],
  },
  {
    id: "expression",
    question: "Comment tu préfères t’exprimer ?",
    subtitle: "Choisis ce qui te vient naturellement",
    type: "single",
    options: [
      { label: "Écriture", sub: "Poser mes pensées et récits à l'écrit", value: "Écriture" },
      { label: "Dialogue", sub: "Répondre à des questions interactives", value: "Dialogue" },
      { label: "Symboles", sub: "Sélecteur rapide et visuel d'humeurs", value: "Symboles" },
      { label: "Pas d'idée", sub: "Je souhaite tester et découvrir", value: "Pas d'idée" },
    ],
  },
  {
    id: "tonality",
    question: "Quelle tonalité pour Mindy ?",
    subtitle: "Mindy est ton compagnon virtuel. Comment veux-tu être accompagné ?",
    type: "single",
    options: [
      { label: "Réconfort", sub: "Doux, chaleureux et profondément enveloppant", value: "Réconfort" },
      { label: "Motivation", sub: "Dynamique, encourageant et tourné vers l'action", value: "Motivation" },
      { label: "Distraction", sub: "Léger, pétillant, parfait pour s'évader l'esprit", value: "Distraction" },
      { label: "Réflexion", sub: "Profond, posant des questions introspectives", value: "Réflexion" },
    ],
  },
  {
    id: "socialProfile",
    question: "Ton profil social ?",
    subtitle: "Comment tu vis tes interactions avec les autres ?",
    type: "single",
    options: [
      { label: "Plutôt solitaire", sub: "J'ai besoin de calme et de mon jardin secret", value: "Plutôt solitaire" },
      { label: "Profil mixte", sub: "J'aime socialiser puis me recharger dans mon calme", value: "Mixte" },
      { label: "Plutôt sociable", sub: "Les interactions m'apportent mon énergie principale", value: "Plutôt sociable" },
    ],
  },
];

export default function Onboarding({ currentPath, setPath, userProfile, updateProfile }: OnboardingProps) {
  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState<AnswersState>({
    feel: "",
    stressFactors: [],
    goods: [],
    tendency: [],
    selfTalk: "",
    improvements: [],
    expression: "",
    tonality: "",
    socialProfile: "",
  });

  const currentQ = QUESTIONS[stepIndex];

  const handleSelectOption = (questionId: keyof AnswersState, value: string) => {
    const isMultiple = QUESTIONS.find((q) => q.id === questionId)?.type === "multiple";

    if (isMultiple) {
      setAnswers((prev) => {
        const currentArr = prev[questionId] as string[];
        const nextArr = currentArr.includes(value)
          ? currentArr.filter((item) => item !== value)
          : [...currentArr, value];
        return { ...prev, [questionId]: nextArr };
      });
    } else {
      setAnswers((prev) => ({ ...prev, [questionId]: value }));
    }
  };

  const currentVal = answers[currentQ?.id];
  const isNextDisabled = currentQ 
    ? (Array.isArray(currentVal) ? currentVal.length === 0 : !currentVal)
    : false;

  const handleNext = () => {
    if (isNextDisabled) return;

    if (stepIndex < QUESTIONS.length - 1) {
      setStepIndex((i) => i + 1);
    } else {
      setPath("onboarding/spacesetup");
    }
  };

  const handleBack = () => {
    if (stepIndex > 0) {
      setStepIndex((i) => i - 1);
    } else {
      setPath("onboarding/stockage");
    }
  };

  const handleFinishOnboarding = () => {
    updateProfile({
      isOnboarded: true,
      streak: 1,
    });
    setPath("dashboard");
  };

  return (
    <div className="flex-1 flex flex-col justify-between px-5 pt-7 pb-4 select-none relative overflow-y-auto overflow-x-hidden min-h-0 w-full max-w-md mx-auto h-full max-h-full" id="onboarding-page-root">
      
      {/* Absolute ambient light spots */}
      <div className="absolute top-[-10%] left-[-10%] w-40 h-40 rounded-full bg-brand-lavender/30 blur-3xl pointer-events-none" />
      <div className="absolute bottom-5 right-[-10%] w-36 h-36 rounded-full bg-emerald-100/15 blur-3xl pointer-events-none" />

      {/* SCREEN A: Welcome Greeting ("Bienvenue, Léa" - Image 14) */}
      {currentPath === "onboarding" && (
        <motion.div
          id="onboarding-welcome-view"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex-1 flex flex-col justify-between py-2 text-center relative z-10"
        >
          <div className="px-1 flex flex-col items-center justify-center flex-1 space-y-9 mt-10">
            {/* Pulsating Abstract Mindy Visual Orb */}
            <div className="relative w-28 h-28 flex items-center justify-center">
              <motion.div
                animate={{ scale: [1, 1.35, 1], opacity: [0.25, 0.45, 0.25] }}
                transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-0 rounded-full bg-brand-lavender blur-xl"
              />
              <motion.div
                animate={{ scale: [1, 1.15, 1] }}
                transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
                className="w-18 h-18 rounded-[24px] bg-white border border-brand-lavender flex items-center justify-center shadow-xl shadow-brand-medium/10 relative z-10"
              >
                <motion.span 
                  animate={{ rotate: [0, 8, -8, 0] }}
                  transition={{ duration: 6, repeat: Infinity }}
                  className="text-3xl"
                >
                  🔮
                </motion.span>
              </motion.div>
              {/* Little glowing star */}
              <motion.div 
                animate={{ scale: [0.8, 1.2, 0.8], opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute top-2 right-2 text-sm"
              >
                ✨
              </motion.div>
            </div>

            <div className="space-y-3 px-1">
              <h1 className="font-display text-[30px] font-medium text-neutral-dark tracking-tight leading-tight select-none">
                Bienvenue, {userProfile.name || "Léa"}
              </h1>
              
              <p className="font-sans text-[13.5px] text-zinc-550 max-w-xs mx-auto leading-relaxed font-medium">
                Prenons juste 2 petites minutes pour répondre à 9 courtes questions et façonner l'espace idéal avec Mindy.
              </p>
            </div>

            {/* Pastel badges with clean premium borders */}
            <div className="flex items-center justify-center space-x-2 pt-1 select-none">
              <span className="bg-[#EFEFEF]/85 border border-zinc-200/40 text-zinc-500 font-bold text-[10px] px-3.5 py-1.5 rounded-full uppercase tracking-wider">
                🔒 confidentiel
              </span>
              <span className="bg-brand-lavender/35 border border-brand-lavender/40 text-brand-deep font-bold text-[10px] px-3.5 py-1.5 rounded-full uppercase tracking-wider">
                ⏱️ 2 min
              </span>
              <span className="bg-emerald-50 border border-emerald-100/60 text-emerald-800 font-bold text-[10px] px-3.5 py-1.5 rounded-full uppercase tracking-wider">
                🌱 Bienveillant
              </span>
            </div>
          </div>

          <div className="px-1 pb-4">
            <motion.button
              id="onboarding-start-btn"
              whileTap={{ scale: 0.985 }}
              onClick={() => setPath("onboarding/stockage")}
              className="w-full py-3.5 bg-neutral-900 border border-neutral-900 hover:bg-brand-medium hover:border-brand-medium text-white font-bold rounded-2xl transition duration-200 text-sm cursor-pointer shadow-md shadow-neutral-900/10 text-center"
            >
              C’est parti !
            </motion.button>
          </div>
        </motion.div>
      )}

      {/* SCREEN B: 1-9 Step Questionnaire ("Comment tu te sens..." etc.) */}
      {currentPath === "onboarding/questionnaire" && (
        <div id="onboarding-questionnaire-view" className="flex-1 flex flex-col justify-between h-full pt-1 relative z-10">
          
          {/* Header Progress and Top Header Title */}
          <div className="select-none">
            <div className="flex items-center justify-between font-bold text-[10px] text-zinc-500 tracking-widest uppercase">
              <span>MINDCARE ACCUEIL</span>
              <span className="text-brand-medium">ÉTAPE {stepIndex + 1} SUR 9</span>
            </div>

            {/* Flat high contrast visual progress bar */}
            <div className="h-1.5 bg-zinc-200/80 w-full mt-3 rounded-full relative overflow-hidden">
              <motion.div 
                className="bg-brand-medium h-full absolute left-0 top-0 rounded-full"
                layoutId="onboarding-progress-bar"
                animate={{ width: `${((stepIndex + 1) / 9) * 100}%` }}
                transition={{ type: "spring", stiffness: 120, damping: 18 }}
              />
            </div>
          </div>

          {/* Core Question and Choice Options Block */}
          <div className="flex-1 flex flex-col justify-center py-4">
            <AnimatePresence mode="wait">
              <motion.div
                key={stepIndex}
                initial={{ opacity: 0, x: 25 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -25 }}
                transition={{ duration: 0.22, ease: "easeOut" }}
                className="space-y-4"
              >
                <div>
                  <h3 className="font-display text-[26px] text-neutral-dark leading-tight tracking-tight select-none">
                    {currentQ.question}
                  </h3>
                  <p className="text-xs text-zinc-500 font-medium leading-normal mt-1.5 select-none">
                    {currentQ.subtitle}
                  </p>
                </div>

                {/* Multiple choices helper caption styled elegantly */}
                {currentQ.helper && (
                  <div className="flex justify-end select-none">
                    <span className="bg-brand-lavender/35 border border-brand-lavender/50 text-brand-deep text-[9.5px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-md">
                      💡 {currentQ.helper}
                    </span>
                  </div>
                )}

                {/* Dynamic Choice Buttons - Replaced styled inputs with organic tactile cards */}
                <div className="space-y-2.5 pr-0.5">
                  {currentQ.options.map((opt, oIdx) => {
                    const qId = currentQ.id;
                    const answersVal = answers[qId];
                    const isSelected = Array.isArray(answersVal)
                      ? answersVal.includes(opt.value)
                      : answersVal === opt.value;

                    const isDescriptionCard = !!opt.sub;

                    return (
                      <motion.button
                        key={oIdx}
                        id={`opt-${stepIndex}-${oIdx}`}
                        whileHover={{ scale: 1.008, y: -0.5 }}
                        whileTap={{ scale: 0.985 }}
                        onClick={() => handleSelectOption(qId, opt.value)}
                        className={`w-full transition-all duration-200 rounded-xl py-3 px-4.5 text-left cursor-pointer border flex items-center justify-between ${
                          isSelected
                            ? "bg-brand-lavender/35 border-brand-medium text-brand-deep shadow-sm shadow-brand-medium/5"
                            : "bg-zinc-100/70 border-zinc-200/30 text-neutral-dark hover:bg-zinc-150/70"
                        }`}
                      >
                        <div className="flex-1 pr-3">
                          {isDescriptionCard ? (
                            <>
                              <span className="text-neutral-dark text-[13.5px] font-bold block leading-snug">{opt.label}</span>
                              <span className={`text-[11px] font-medium mt-0.5 leading-snug block transition-all ${isSelected ? "text-brand-medium" : "text-zinc-500"}`}>
                                {opt.sub}
                              </span>
                            </>
                          ) : (
                            <span className="text-neutral-dark text-[13.5px] font-bold block py-1">{opt.label}</span>
                          )}
                        </div>

                        {/* Interactive custom radio/checkbox indicator */}
                        <div className="shrink-0 flex items-center justify-center">
                          {currentQ.type === "multiple" ? (
                            <div className={`w-4.5 h-4.5 rounded border transition-all flex items-center justify-center ${
                              isSelected ? "bg-brand-medium border-brand-medium" : "border-zinc-350 bg-white"
                            }`}>
                              {isSelected && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
                            </div>
                          ) : (
                            <div className={`w-4.5 h-4.5 rounded-full border transition-all flex items-center justify-center p-0.5 ${
                              isSelected ? "border-brand-medium" : "border-zinc-350 bg-white"
                            }`}>
                              {isSelected && <div className="w-full h-full rounded-full bg-brand-medium" />}
                            </div>
                          )}
                        </div>

                      </motion.button>
                    );
                  })}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* High contrast Bottom Action controls */}
          <div className="flex items-center space-x-3.5 pb-2 pt-2.5 bg-zinc-50/80 backdrop-blur-xs select-none">
            <motion.button
              id="onboarding-back-btn"
              whileTap={{ scale: 0.96 }}
              onClick={handleBack}
              className="w-12 h-12 border border-zinc-200 hover:border-neutral-dark rounded-xl flex items-center justify-center bg-white hover:bg-zinc-50 transition duration-200 cursor-pointer shadow-xs"
            >
              <ArrowLeft className="w-4.5 h-4.5 text-neutral-dark" />
            </motion.button>

            <motion.button
              id="onboarding-next-btn"
              whileTap={!isNextDisabled ? { scale: 0.985 } : undefined}
              onClick={handleNext}
              disabled={isNextDisabled}
              className={`flex-1 h-12 border rounded-xl font-bold transition duration-200 text-xs tracking-wider uppercase flex items-center justify-center cursor-pointer ${
                isNextDisabled
                  ? "border-zinc-200 bg-zinc-100 text-zinc-400 cursor-not-allowed"
                  : "border-neutral-900 bg-neutral-900 text-white hover:bg-brand-medium hover:border-brand-medium shadow-sm"
              }`}
            >
              Suivant
            </motion.button>
          </div>

        </div>
      )}

      {/* SCREEN C: Local storage disclosure ("Tes données restent sur ton téléphone" - Image 10) */}
      {currentPath === "onboarding/stockage" && (
        <motion.div
          id="onboarding-storage-view"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex-1 flex flex-col justify-between py-1 relative z-10"
        >
          <div className="px-1">
            <h2 className="font-display text-[29px] text-neutral-dark tracking-tight leading-tight mt-10 mb-2 select-none">
              Tes données restent sur ton téléphone
            </h2>
            <p className="text-xs text-zinc-500 mb-6 font-medium leading-relaxed select-none">
              Tout est stocké localement, uniquement sur cet appareil. Personne d'autre (pas même nous) n'y a accès.
            </p>

            {/* List with rich graphic icons instead of basic list boxes */}
            <div className="space-y-3">
              {/* Card 1 */}
              <div className="bg-white border border-zinc-150 p-4 rounded-xl text-left flex items-start space-x-3.5 shadow-xs select-none">
                <div className="w-9 h-9 rounded-lg bg-brand-lavender/40 text-brand-medium flex items-center justify-center shrink-0">
                  <HardDrive className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-neutral-dark mb-0.5">
                    Stocké sur cet appareil
                  </h4>
                  <p className="text-[10px] text-zinc-500 leading-snug font-medium">
                    Tes journaux personnels, tes vannesémotionnelles et tes dialogues avec Mindy sont conservés localement.
                  </p>
                </div>
              </div>

              {/* Card 2 */}
              <div className="bg-white border border-zinc-150 p-4 rounded-xl text-left flex items-start space-x-3.5 shadow-xs select-none">
                <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                  <EyeOff className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-neutral-dark mb-0.5">
                    Totalement invisible pour nous
                  </h4>
                  <p className="text-[10px] text-zinc-500 leading-snug font-medium">
                    MindCare ne synchronise ni ne possède aucun serveur de lecture. Ton jardin secret est 100% anonyme.
                  </p>
                </div>
              </div>

              {/* Card 3 */}
              <div className="bg-white border border-zinc-150 p-4 rounded-xl text-left flex items-start space-x-3.5 shadow-xs select-none">
                <div className="w-9 h-9 rounded-lg bg-brand-lavender/40 text-brand-medium flex items-center justify-center shrink-0">
                  <RefreshCw className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-neutral-dark mb-0.5">
                    Supprimable en un clic
                  </h4>
                  <p className="text-[10px] text-zinc-500 leading-snug font-medium">
                    Depuis tes options, tu gardes le contrôle absolu pour purger l’historique des check-in en une seconde.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="px-1 pb-4 mt-8 space-y-4">
            <p className="text-center text-[10px] text-zinc-500 font-medium italic leading-relaxed px-1 select-none">
              Tes données émotionnelles ne sont jamais partagées ni vendues. Conformément aux préceptes du RGPD, ton contrôle est absolu.
            </p>
            <div className="flex items-center space-x-3.5 pb-2 pt-2.5 bg-zinc-50/80 backdrop-blur-xs select-none">
              <motion.button
                id="storage-back-btn"
                whileTap={{ scale: 0.96 }}
                onClick={() => setPath("onboarding")}
                className="w-12 h-12 border border-zinc-200 hover:border-neutral-dark rounded-xl flex items-center justify-center bg-white hover:bg-zinc-50 transition duration-200 cursor-pointer shadow-xs shrink-0"
              >
                <ArrowLeft className="w-4.5 h-4.5 text-neutral-dark" />
              </motion.button>

              <motion.button
                id="storage-continue-btn"
                whileTap={{ scale: 0.985 }}
                onClick={() => setPath("onboarding/questionnaire")}
                className="flex-1 h-12 border border-neutral-900 bg-neutral-900 hover:bg-brand-medium hover:border-brand-medium text-white font-bold rounded-xl transition text-xs tracking-wider uppercase flex items-center justify-center cursor-pointer shadow-sm"
              >
                Continuer
              </motion.button>
            </div>
          </div>
        </motion.div>
      )}

      {/* SCREEN D: Space Ready summary info ("Ton espace est prêt" - Image 13) */}
      {currentPath === "onboarding/spacesetup" && (
        <motion.div
          id="onboarding-ready-view"
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex-1 flex flex-col justify-between py-1 text-center relative z-10"
        >
          <div className="px-1 flex flex-col items-center justify-center flex-1 space-y-6 mt-10">
            <div className="space-y-1.5 select-none">
              <span className="text-3xl animate-bounce inline-block">🎉</span>
              <h1 className="font-display text-[29px] text-neutral-dark tracking-tight leading-tight select-none">
                Ton espace est prêt
              </h1>
              <p className="font-sans text-xs text-zinc-500 font-medium">
                Mindy a ajusté ses circuits pour t'accompagner au mieux.
              </p>
            </div>

            {/* Custom styled ticket / Boarding Pass summary showing premium UI/UX design */}
            <div className="w-full bg-white border border-brand-lavender rounded-2xl p-5 text-left space-y-3.5 relative shadow-md shadow-brand-medium/5 select-none overflow-hidden">
              
              {/* Boarding pass circular indent decorations in corners */}
              <div className="absolute left-[-10px] top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-zinc-50 border-r border-brand-lavender/60" />
              <div className="absolute right-[-10px] top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-zinc-50 border-l border-brand-lavender/60" />
              
              <div className="border-b border-dashed border-zinc-200 pb-3 mb-2 flex justify-between items-center">
                <span className="text-[10px] font-bold tracking-widest text-zinc-400 uppercase">PROFIL EXPLORATION</span>
                <span className="text-xs">✨</span>
              </div>

              <div className="flex items-center space-x-3 text-neutral-dark transition">
                <div className="w-7 h-7 rounded-lg bg-brand-lavender/40 flex items-center justify-center text-brand-medium shrink-0">
                  <Smile className="w-4 h-4" />
                </div>
                <div className="text-xs">
                  <span className="text-zinc-500 block text-[9.5px] uppercase tracking-wider font-bold">COMPAGNON</span>
                  <span className="font-bold text-neutral-dark">{answers.tonality || "Réconfort"} (Doux & Serein)</span>
                </div>
              </div>

              <div className="flex items-center space-x-3 text-neutral-dark transition">
                <div className="w-7 h-7 rounded-lg bg-green-50 flex items-center justify-center text-brand-green shrink-0">
                  <BookOpen className="w-4 h-4" />
                </div>
                <div className="text-xs">
                  <span className="text-zinc-500 block text-[9.5px] uppercase tracking-wider font-bold">EXPRESSION</span>
                  <span className="font-bold text-neutral-dark">{answers.expression || "Écriture"}</span>
                </div>
              </div>

              <div className="flex items-center space-x-3 text-neutral-dark transition">
                <div className="w-7 h-7 rounded-lg bg-brand-lavender/40 flex items-center justify-center text-brand-medium shrink-0">
                  <Check className="w-4 h-4" />
                </div>
                <div className="text-xs">
                  <span className="text-zinc-500 block text-[9.5px] uppercase tracking-wider font-bold">BUT PRINCIPAL</span>
                  <span className="font-bold text-neutral-dark">
                    {answers.improvements && answers.improvements.length > 0 
                      ? answers.improvements[0] 
                      : "Gérer mon stress"}
                  </span>
                </div>
              </div>

              <div className="flex items-center space-x-3 text-neutral-dark transition">
                <div className="w-7 h-7 rounded-lg bg-rose-50 flex items-center justify-center text-rose-600 shrink-0">
                  <Compass className="w-4 h-4" />
                </div>
                <div className="text-xs">
                  <span className="text-zinc-500 block text-[9.5px] uppercase tracking-wider font-bold">STRESSEUR CIBLÉ</span>
                  <span className="font-bold text-neutral-dark truncate line-clamp-1 max-w-[210px]">
                    {answers.stressFactors && answers.stressFactors.length > 0 
                      ? answers.stressFactors.slice(0, 2).join(", ") + (answers.stressFactors.length > 2 ? "..." : "")
                      : "Études / Examens"}
                  </span>
                </div>
              </div>

            </div>
          </div>

          <div className="px-1 pb-4">
            <motion.button
              id="finish-onboarding-btn"
              whileTap={{ scale: 0.985 }}
              onClick={handleFinishOnboarding}
              className="w-full py-3.5 bg-brand-medium border border-brand-medium hover:bg-brand-deep hover:border-brand-deep text-white font-bold rounded-2xl transition text-sm cursor-pointer shadow-md shadow-brand-medium/15 text-center"
            >
              Découvrir Mindy 💜
            </motion.button>
          </div>
        </motion.div>
      )}

    </div>
  );
}
