import { GoogleGenAI } from "@google/genai";

// Lazily initialize Gemini to prevent crash if key is missing on startup
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (key) {
      aiClient = new GoogleGenAI({
        apiKey: key,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });
    }
  }
  return aiClient;
}

// Rich fallback generator for Mindy when Gemini is experiencing high load / 503 errors
function generateLocalFallbackResponse(prompt: string, sInst?: string): string {
  const lowerPrompt = prompt.toLowerCase();
  
  // Daily check-in summary request
  if (lowerPrompt.includes("bilan") || lowerPrompt.includes("humeur") || sInst?.includes("résumé") || sInst?.includes("charter")) {
    let moodLabel = "allant de l'avant";
    if (lowerPrompt.includes("très difficile") || lowerPrompt.includes("1/5") || lowerPrompt.includes("2/5") || lowerPrompt.includes("fragile")) {
      moodLabel = "assez délicate";
    } else if (lowerPrompt.includes("excellent") || lowerPrompt.includes("5/5") || lowerPrompt.includes("4/5") || lowerPrompt.includes("serein")) {
      moodLabel = "sereine et stable";
    }

    let pressureLevel = "modéré";
    if (lowerPrompt.includes("élevée") || lowerPrompt.includes("stress : élevé") || lowerPrompt.includes("pression : élevée")) {
      pressureLevel = "un peu intense";
    } else if (lowerPrompt.includes("faible")) {
      pressureLevel = "paisible";
    }

    let comfortingCore = "";
    if (moodLabel.includes("délicate") || pressureLevel.includes("intense")) {
      comfortingCore = "Sache que tu as pleinement le droit de te reposer et de relâcher les épaules aujourd'hui. Ton bien-être hiberne et grandit à ton propre rythme.";
    } else {
      comfortingCore = "C'est une belle journée pour cultiver cet équilibre et continuer d'honorer tes ressentis intimes.";
    }

    return `Je lis dans ton bilan d'aujourd'hui une météo intérieure ${moodLabel} avec un niveau de pression ${pressureLevel}. ${comfortingCore} Je te suggère chaleureusement d'essayer l'exercice d'Ancrage ou notre Cohérence Cardiaque aujourd'hui. Prends bien soin de toi.`;
  }
  
  // Mental fatigue or sleep issues
  if (lowerPrompt.includes("sommeil") || lowerPrompt.includes("dormir") || lowerPrompt.includes("nuit") || lowerPrompt.includes("fatigu") || lowerPrompt.includes("épuis")) {
    return "La fatigue corporelle ou mentale peut alourdir chaque pensée. Ce soir, essaie de laisser de côté les écrans un peu plus tôt. Je t'invite à faire notre petit exercice de Respiration Ventrale pour inviter le calme à s'installer durablement avant la nuit.";
  }

  // Stress & Anxiety
  if (lowerPrompt.includes("stress") || lowerPrompt.includes("angoiss") || lowerPrompt.includes("panique") || lowerPrompt.includes("peur") || lowerPrompt.includes("anxi")) {
    return "C'est tout à fait normal de ressentir cette vague de tension. Inspire lentement... retiens un instant... et souffle comme si tu soufflais sur une bougie. Tu es en sécurité ici. Pourquoi ne pas essayer la Cohérence Cardiaque pendant 2 petites minutes pour apaiser ton cœur ?";
  }

  // Sadness / Low mood
  if (lowerPrompt.includes("triste") || lowerPrompt.includes("mal") || lowerPrompt.includes("pleurer") || lowerPrompt.includes("seul") || lowerPrompt.includes("solitude")) {
    return "Je suis là avec toi. Il y a des moments où tout semble gris et lourd, et c'est parfaitement correct de ne pas aller bien. Accueille ces émotions sans jugement. Essaie de poser ce qui pèse sur ton cœur en écrivant librement dans le journal Intime ou le journal SOS pour libérer un peu d'espace en toi.";
  }

  // Exercise requests
  if (lowerPrompt.includes("exercice") || lowerPrompt.includes("pratique") || lowerPrompt.includes("méditer") || lowerPrompt.includes("respirer")) {
    return "Je te suggère chaleureusement d'essayer notre exercice de Respiration Carrée pour réguloniser ton système nerveux, ou de te poser avec l'exercice de Gratitude pour lister trois petits bonheurs simples. Quel type de temps pour toi te ferait le plus de bien ?";
  }

  // Greetings
  if (lowerPrompt.includes("bonjour") || lowerPrompt.includes("salut") || lowerPrompt.includes("coucou") || lowerPrompt.includes("hello")) {
    return "Bonjour mon ami ! C'est un réel plaisir de t'accueillir ici. Comment te sens-tu en cet instant précis ? Raconte-moi ce qui t'occupe l'esprit, je t'écoute avec beaucoup de douceur.";
  }

  // Default warm companion message
  return "Je t'écoute avec toute mon attention et ma bienveillance. Chaque pensée que tu traverses mérite d'être accueillie avec respect. Veux-tu me partager ce que tu ressens, ou préfères-tu essayer un petit exercice guidé ?";
}

const MINDY_CHATBOT_INSTRUCTION = `IDENTITÉ :
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
- Tu ne peux propose un exercice qu'une seule fois par session.
MÉTHODE D'ACCOMPAGNEMENT :
Si tu orientes vers un professionnel (ex: Alcool Info Service), propose toujours de "préparer l'appel ensemble" ou de simuler le début de la conversation pour réduire l'appréhension de l'utilisateur.`;

const MINDY_CHECKIN_INSTRUCTION = "Tu es Mindy, le compagnon IA de MindCare. Tu émanes d'un soutien bienveillant, doux et apaisant. Tu n'utilises aucun terme clinique (pas de diagnostic, pas de trouble détecté). Tu t'adresses d'égal à égal avec l'utilisateur en le tutoyant sincèrement en français, dans un style zen, très concis.";

export default async function handler(req: any, res: any) {
  // CORS Headers support for Vercel
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS,PATCH,DELETE,POST,PUT");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
  );

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  if (req.method !== "POST") {
    res.status(405).json({ error: "Method Not Allowed" });
    return;
  }

  const { prompt, type, systemInstruction } = req.body || {};

  if (!prompt) {
    res.status(400).json({ error: "Missing prompt parameter." });
    return;
  }

  // Resolve system prompt securely on the server
  let resolvedInstruction = MINDY_CHATBOT_INSTRUCTION;
  if (type === "checkin") {
    resolvedInstruction = MINDY_CHECKIN_INSTRUCTION;
  } else if (type === "chatbot") {
    resolvedInstruction = MINDY_CHATBOT_INSTRUCTION;
  } else {
    // Graceful local fallbacks for potential custom frontends: check clues
    const promptText = String(prompt || "").toLowerCase();
    const instText = String(systemInstruction || "").toLowerCase();
    if (promptText.includes("bilan") || promptText.includes("humeur globale") || promptText.includes("niveau de pression") || instText.includes("bilan émo") || instText.includes("humeur")) {
      resolvedInstruction = MINDY_CHECKIN_INSTRUCTION;
    }
  }

  try {
    const client = getGeminiClient();
    if (!client) {
      // Return simulated local fallback response when key is missing to support graceful local/unconfigured environments
      const simulationResponse = generateLocalFallbackResponse(prompt, resolvedInstruction);
      res.status(200).json({ text: simulationResponse, simulated: true });
      return;
    }

    // Safe progressive retry block to counter transient high-load 503 limits dynamically
    let response = null;
    let lastError = null;
    let delay = 350;
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        response = await client.models.generateContent({
          model: "gemini-3.5-flash",
          contents: prompt,
          config: {
            systemInstruction: resolvedInstruction,
            temperature: 0.7,
          },
        });
        break; // successfully generated!
      } catch (err: any) {
        lastError = err;
        const errMsg = String(err?.message || "");
        const isTransient = errMsg.includes("503") || errMsg.includes("UNAVAILABLE") || errMsg.includes("demand") || err?.status === 503 || err?.status === 429;
        
        if (isTransient && attempt < 3) {
          console.log(`[Mindy API] Gemini Vercel high demand 503 (attempt ${attempt}/3). Retrying in ${delay}ms...`);
          await new Promise((resolve) => setTimeout(resolve, delay));
          delay *= 2;
          continue;
        }
        break;
      }
    }

    if (response && response.text) {
      res.status(200).json({ text: response.text });
    } else {
      throw lastError || new Error("Failed to get response text.");
    }
  } catch (error: any) {
    console.log(`[Mindy API] Vercel function switching to integrated backup core (recovering from status: ${error?.message || error})`);
    const fallbackResponse = generateLocalFallbackResponse(prompt, resolvedInstruction);
    res.status(200).json({
      text: fallbackResponse,
      simulated: true,
      fallbacked: true,
      error_details: error?.message || ""
    });
  }
}
