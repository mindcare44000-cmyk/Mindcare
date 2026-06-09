import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

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
    } else {
      console.warn("WARNING: GEMINI_API_KEY is not defined. Falling back to serene companion simulation mode.");
    }
  }
  return aiClient;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Health check endpoint
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

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

  // Secure Server-side Gemini endpoint
  app.post("/api/gemini/generate", async (req, res) => {
    const { prompt, systemInstruction } = req.body;
    
    if (!prompt) {
      res.status(400).json({ error: "Missing prompt parameter." });
      return;
    }

    try {
      const client = getGeminiClient();
      if (!client) {
        const simulationResponse = generateLocalFallbackResponse(prompt, systemInstruction);
        res.json({ text: simulationResponse, simulated: true });
        return;
      }

      const response = await client.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          systemInstruction: systemInstruction || "Tu es Mindy, le compagnon IA de MindCare. Tu es douce, calme, bienveillante et rassurante. Tu ne poses aucun diagnostic médical, ne donnes pas de traitement et n'utilises aucun terme clinique lourd. Tu t'exprimes avec simplicité et empathie, en tutoyant doucement l'utilisateur.",
          temperature: 0.7,
        },
      });

      res.json({ text: response.text });
    } catch (error: any) {
      console.warn("Gemini API Error (Triggering Local Companion Fallback):", error);
      
      // Fall back seamlessly to our locally simulated responsive engine
      const fallbackResponse = generateLocalFallbackResponse(prompt, systemInstruction);
      res.json({ 
        text: fallbackResponse, 
        simulated: true,
        fallbacked: true,
        error_details: error?.message || "" 
      });
    }
  });

  // Vite middle-ware setup for development / Production static serving
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[MindCare Server] running on http://localhost:${PORT}`);
  });
}

startServer();
