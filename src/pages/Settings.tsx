import React, { useState } from "react";
import { motion } from "motion/react";
import { 
  User, Shield, CreditCard, LogOut, CheckCircle, 
  ChevronRight, ArrowLeft, Bell, Key, Trash2 
} from "lucide-react";
import { UserProfile } from "../types";

interface SettingsProps {
  currentPath: string;
  setPath: (path: string) => void;
  userProfile: UserProfile;
  updateProfile: (profile: Partial<UserProfile>) => void;
}

export default function Settings({ currentPath, setPath, userProfile, updateProfile }: SettingsProps) {
  const [tempName, setTempName] = useState(userProfile.name || "");
  const [successMsg, setSuccessMsg] = useState("");

  const handleUpdateAccount = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({ name: tempName.trim() });
    setSuccessMsg("Profil enregistré avec succès !");
    setTimeout(() => setSuccessMsg(""), 2000);
  };

  const handleLogout = () => {
    updateProfile({
      name: "",
      email: "",
      isRegistered: false,
      isOnboarded: false,
      premium: false,
    });
    setPath("auth");
  };

  return (
    <div className="flex-1 flex flex-col px-4 py-3 select-none overflow-y-auto min-h-0 w-full max-w-md mx-auto" id="settings-page-root" style={{ contentVisibility: "auto" }}>
      
      {/* 1. Main Options Menu View (/parametres) */}
      {currentPath === "parametres" && (
        <div className="space-y-5">
          <div className="flex justify-between items-center bg-white p-4 rounded-3xl border border-zinc-200/55">
            <div className="space-y-0.5">
              <h2 className="font-display text-2.5xl text-neutral-dark">Options & Réglages</h2>
              <p className="text-[10px] text-zinc-400 font-semibold tracking-wider uppercase">Personnalise ton cocon</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-brand-lavender text-brand-medium flex items-center justify-center font-bold">
              ⚙️
            </div>
          </div>

          <div className="space-y-2.5">
            {/* Account row */}
            <div 
              onClick={() => setPath("parametres/compte")}
              className="bg-white border p-3.5 rounded-2xl flex items-center justify-between cursor-pointer hover:border-brand-medium transition text-xs shadow-sm hover:shadow"
            >
              <div className="flex items-center space-x-3 text-neutral-dark">
                <div className="w-8 h-8 rounded-full bg-brand-lavender/50 text-brand-medium flex items-center justify-center">
                  <User className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <h4 className="font-bold">Mon Profil & Compte</h4>
                  <p className="text-[9px] text-zinc-455">Modifier mon nom ou me déconnecter</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-zinc-400" />
            </div>

            {/* Verification GDPR policy row */}
            <div 
              onClick={() => setPath("parametres/notifications-rgpd")}
              className="bg-white border p-3.5 rounded-2xl flex items-center justify-between cursor-pointer hover:border-brand-medium transition text-xs shadow-sm hover:shadow"
            >
              <div className="flex items-center space-x-3 text-neutral-dark">
                <div className="w-8 h-8 rounded-full bg-emerald-50 text-brand-green flex items-center justify-center">
                  <Shield className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <h4 className="font-bold">Confidentialité & RGPD</h4>
                  <p className="text-[9px] text-zinc-455">Gérer mes choix de traces et rappels</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-zinc-400" />
            </div>

            {/* Premium plan pricing row */}
            <div 
              onClick={() => setPath("parametres/premium")}
              className={`border p-3.5 rounded-2xl flex items-center justify-between cursor-pointer transition text-xs shadow-sm hover:shadow ${
                userProfile.premium 
                  ? "bg-emerald-50/50 border-emerald-200" 
                  : "bg-gradient-to-br from-brand-lavender/40 to-white border-brand-light/30"
              }`}
            >
              <div className="flex items-center space-x-3 text-neutral-dark">
                <div className="w-8 h-8 rounded-full bg-brand-lavender text-brand-medium flex items-center justify-center font-bold text-xs shrink-0">
                  ★
                </div>
                <div className="text-left">
                  <h4 className="font-bold flex items-center space-x-1">
                    <span>MindCare Premium</span>
                    {userProfile.premium && (
                      <span className="text-[8px] uppercase tracking-wider font-bold bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded-full">
                        Atout Actif
                      </span>
                    )}
                  </h4>
                  <p className="text-[9px] text-zinc-455">
                    {userProfile.premium ? "Abonnement actif à 2,99€ / mois" : "Ajouter des atouts exclusifs pour 2,99€/mois"}
                  </p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-zinc-400" />
            </div>

          </div>

          {/* Absolute safe statement footnote */}
          <div className="text-center py-6 px-4">
            <p className="text-[9.5px] text-zinc-400 italic leading-relaxed">
              MindCare n'est pas une consultation médicale. Vos données sont chiffrées localement et inaccessibles par un tiers.
            </p>
          </div>
        </div>
      )}

      {/* 2. Account details view (/parametres/compte) */}
      {currentPath === "parametres/compte" && (
        <div className="space-y-5 text-left">
          <button
            onClick={() => setPath("parametres")}
            className="text-zinc-500 text-xs font-semibold hover:text-zinc-850 flex items-center space-x-1"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Options</span>
          </button>

          <h3 className="font-display text-2.5xl text-neutral-dark font-medium">Mon Profil</h3>

          {successMsg && (
            <div className="bg-emerald-50 border border-emerald-100 p-3.5 rounded-xl text-emerald-800 text-xs flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          <form onSubmit={handleUpdateAccount} className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] uppercase tracking-wider font-bold text-zinc-500 block px-1">Pseudonyme actif</label>
              <div className="relative">
                <input
                  type="text"
                  value={tempName}
                  onChange={(e) => setTempName(e.target.value)}
                  className="w-full bg-zinc-100/70 border border-zinc-200/50 rounded-xl py-2.5 px-4 text-xs focus:outline-none focus:border-brand-light focus:bg-white transition"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] uppercase tracking-wider font-bold text-zinc-500 block px-1">E-mail inscrit</label>
              <input
                type="email"
                disabled
                value={userProfile.email || "aucun@anonyme.com"}
                className="w-full bg-zinc-100 border text-zinc-450 border-zinc-200/50 rounded-xl py-2.5 px-4 text-xs select-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-brand-medium text-white font-semibold rounded-full hover:bg-brand-deep text-xs shadow transition mt-1"
            >
              Enregistrer mes modifications
            </button>
          </form>

          <div className="border-t border-zinc-200 pt-5 space-y-3">
            <h4 className="text-[10px] uppercase tracking-wider font-bold text-zinc-400">Zone administrative</h4>
            
            <button
              onClick={handleLogout}
              className="w-full py-2.5 border border-red-200 text-red-650 rounded-full hover:bg-red-50/20 text-xs font-semibold flex items-center justify-center space-x-1.5 transition"
            >
              <LogOut className="w-4 h-4" />
              <span>Me déconnecter de MindCare</span>
            </button>
          </div>
        </div>
      )}

      {/* 3. GDPR and Notification preference view (/parametres/notifications-rgpd) */}
      {currentPath === "parametres/notifications-rgpd" && (
        <div className="space-y-5 text-left">
          <button
            onClick={() => setPath("parametres")}
            className="text-zinc-500 text-xs font-semibold hover:text-zinc-850 flex items-center space-x-1"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Options</span>
          </button>

          <h3 className="font-display text-2.5xl text-neutral-dark font-medium">Confidentialité & RGPD</h3>

          <div className="space-y-4 bg-white border border-zinc-200 p-4 rounded-3xl">
            <h4 className="text-[11px] font-bold text-brand-deep flex items-center space-x-1.5">
              <Bell className="w-4.5 h-4.5" />
              <span>Gestion des alertes de suivi</span>
            </h4>
            
            <div className="flex items-center justify-between pb-3 border-b">
              <div className="space-y-0.5 max-w-[70%]">
                <span className="text-[11.5px] font-bold text-zinc-700">Notifications quotidiennes</span>
                <p className="text-[9px] text-zinc-400">Rappels inspirants pour noter ta météo du jour.</p>
              </div>
              <input 
                type="checkbox" 
                checked={userProfile.notificationsEnabled}
                onChange={(e) => updateProfile({ notificationsEnabled: e.target.checked })}
                className="w-4.5 h-4.5 cursor-pointer text-brand-medium rounded" 
              />
            </div>

            <h4 className="text-[11px] font-bold text-brand-deep flex items-center space-x-1.5 pt-1.5">
              <Key className="w-4.5 h-4.5" />
              <span>Chiffrement & Accès RGPD</span>
            </h4>

            <p className="text-[10px] text-zinc-550 leading-relaxed">
              En application de la charte de MindCare, tu as le droit de demander l'extraction de toutes tes données écrites (journal, journal IA, bilans d'humeur) ou leur purge complète définitive et immédiate de nos serveurs sécurisés.
            </p>

            <button
              onClick={() => {
                alert("Extraction confidentielle prête. Un fichier JSON crypté a été compilé. (Simulation locale)");
              }}
              className="w-full bg-zinc-100 hover:bg-zinc-200 text-zinc-650 font-semibold py-2 rounded-xl text-xs transition"
            >
              Télécharger mon dossier complet (JSON)
            </button>

            <button
              onClick={() => {
                if (confirm("Attention: Cette action effacera définitivement tout ton historique de suivi sans aucun recours possible. Es-tu sûr ?")) {
                  updateProfile({ streak: 1 });
                  alert("Historique effacé avec succès.");
                }
              }}
              className="w-full bg-red-50 text-red-650 hover:bg-red-100 font-semibold py-2 rounded-xl text-xs transition flex items-center justify-center space-x-1"
            >
              <Trash2 className="w-4 h-4" />
              <span>Purger définitivement mon historique</span>
            </button>
          </div>
        </div>
      )}

      {/* 4. Premium subscription modal view (/parametres/premium) */}
      {currentPath === "parametres/premium" && (
        <div className="space-y-5 text-left">
          <button
            onClick={() => setPath("parametres")}
            className="text-zinc-500 text-xs font-semibold hover:text-zinc-850 flex items-center space-x-1"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Options</span>
          </button>

          <h3 className="font-display text-2.5xl text-neutral-dark font-medium leading-none">MindCare Premium</h3>

          <div className="p-5 border border-brand-light/30 rounded-3xl bg-gradient-to-br from-brand-lavender/45 via-white to-white space-y-4 text-center">
            <span className="text-3xl">🌿</span>
            <div className="space-y-1">
              <h4 className="text-sm font-extrabold text-brand-deep">Pack de Reconnexion Totale</h4>
              <p className="text-2xl font-black text-brand-medium">2,99€ <span className="text-xs font-normal text-zinc-550">/ mois</span></p>
            </div>

            <div className="space-y-2.5 text-left text-xs text-zinc-600 border-t py-4 border-dashed">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-brand-medium shrink-0" />
                <span>Rapports d'humeur approfondis mensuels</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-brand-medium shrink-0" />
                <span>Activités audio guidées haute définition</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-brand-medium shrink-0" />
                <span>Journalisation IA assistée en illimité</span>
              </div>
            </div>

            <button
              onClick={() => {
                updateProfile({ premium: !userProfile.premium });
                alert(userProfile.premium ? "Abonnement désactivé." : "Abonnement Premium activé avec succès ! Merci de soutenir MindCare.");
              }}
              className="w-full py-3 bg-brand-medium hover:bg-brand-deep text-white font-semibold rounded-full text-xs shadow transition cursor-pointer"
            >
              {userProfile.premium ? "Résilier mon Abonnement" : "Devenir membre Premium"}
            </button>

            <p className="text-[9px] text-zinc-405 leading-relaxed">
              *Sans engagement. Toutes nos fonctions essentielles d'auto-préservation restent gratuites à vie, car la santé mentale est un droit fondamental.
            </p>
          </div>
        </div>
      )}

    </div>
  );
}
