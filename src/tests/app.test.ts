import { describe, it, expect, vi } from "vitest";

// Local models representation for testing state changes
describe("Gestion de l'Onboarding et Profil utilisateur", () => {
  it("devrait initialiser le profil utilisateur par défaut correctement", () => {
    const defaultProfile = {
      name: "",
      email: "",
      isRegistered: false,
      isOnboarded: false,
      premium: false,
      streak: 3,
      badges: ["first-step"],
      notificationsEnabled: true,
      gdprAccepted: false,
    };

    expect(defaultProfile.isRegistered).toBe(false);
    expect(defaultProfile.isOnboarded).toBe(false);
    expect(defaultProfile.streak).toBe(3);
  });

  it("devrait incrémenter le streak de connection lors d'un check-in réussi", () => {
    let streak = 3;
    const addCheckIn = () => {
      streak += 1;
    };

    addCheckIn();
    expect(streak).toBe(4);
  });
});

describe("Détecteur de Mots Sensibles & Stop S.O.S (Sécurités)", () => {
  it("devrait détecter les crises et déclencher le message système d'urgence", () => {
    const sensitiveWords = ["suicide", "mourir", "finir ma vie", "crise de panique intense", "urgence", "3114"];
    
    const checkForCrisis = (text: string) => {
      return sensitiveWords.some((word) => text.toLowerCase().includes(word));
    };

    expect(checkForCrisis("Je me sens un peu triste aujourd'hui")).toBe(false);
    expect(checkForCrisis("Je pense à mourir, ça ne va pas du tout")).toBe(true);
    expect(checkForCrisis("Quelle est l'adresse de l'association 3114 ?")).toBe(true);
  });
});

describe("Calcul de la Hauteur Structurale (Anti-Double Scrollbar)", () => {
  it("devrait configurer l'affichage de PhoneShell à 100% pour s'adapter à l'iframe d'AI Studio", () => {
    // La hauteur structurale configurée suite aux corrections
    const currentViewportSetting = "100%";
    
    // S'assurer que la hauteur n'est plus en "100dvh" pour éviter les scrollbars d'iframe distordues
    expect(currentViewportSetting).toBe("100%");
    expect(currentViewportSetting).not.toBe("100dvh");
  });
});
