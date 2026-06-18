# 🌸 MindCare — Havre d'Auto-Préservation et Sagesse Mentale

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black&style=flat-sharing)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-6-646CFF?logo=vite&style=flat-sharing)](https://vite.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white&style=flat-sharing)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind--CSS-v4-06B6D4?logo=tailwindcss&style=flat-sharing)](https://tailwindcss.com/)

**MindCare** est un compagnon bienveillant conçu pour vous offrir un espace sûr d'auto-préservation au quotidien. Alliant esthétique épurée, micro-exercices adaptatifs et outils d'introspection protégés, MindCare vous accompagne pas à pas pour libérer le stress, observer vos cycles émotionnels et fortifier votre paix intérieure.

---

## 🎯 Raison d'être & But du Projet

Le rythme moderne sature notre attention de notifications, de tâches et de bruits permanents. **MindCare** a été développé avec une conviction simple : *prendre soin de son esprit doit être un rituel simple, accessible et exempt de toute pression.*

L'application a été structurée pour agir comme un **sanctuaire personnel** :
- **Observation métaphorique** : Remplacer l'auto-évaluation clinique par une météo poétique et naturelle (soleil, éclaircies, nuages, pluie, tempêtes).
- **Exercices dynamiques et uniques** : Fini la répétitivité lassante. Les exercices de relaxation piochent au hasard des rituels inédits à chaque lancement.
- **Intimité absolue** : Des espaces de décharge mentale sécurisés conçus pour s'exprimer librement.

---

## ✨ Fonctionnalités Majeures

### 🌦️ 1. Météo Quotidienne (Bilan de Soi)
Plutôt que des questionnaires complexes, évaluez votre état d'esprit quotidien par une métaphore climatique :
- **Économie de friction** : Évaluez votre climat d'un glissement de doigt (`☀️ Soleil`, `⛅ Éclaircie`, `☁️ Nuageux`, `🌧️ Pluie`, `⛈️ Orage`).
- **Analyse du stress et d'énergie** : Suivi intuitif des niveaux de pression et d'énergie mentale avec des sliders complémentaires unifiés.
- **Micro-journalisation** : Posez des mots clés pour connecter vos émotions à des activités.

### 🧘 2. Exercices d'Auto-Préservation Aléatoires & Adaptatifs
Le point fort de MindCare réside dans la variabilité de ses exercices. Fini les routines répétitives !
- **Scan Corporel** : Sélectionne dynamiquement 6 zones cibles parmi une bibliothèque exhaustive de 18 régions du corps à chaque session.
- **Étirements & Mouvements doux (Stretch)** : Apprend 3 micro-mouvements précis aléatoires parmi un catalogue complet de rituels physiques (éveil, respiration costale, torsion douce, massages crâniens, etc.).
- **Affirmations Positives** : Propose 6 mantras réconfortants choisis aléatoirement parmi plus de 50 pensées restructurantes.
- **Séance Nuages, Cohérence Cardiaque et Respiration Carrée** : Travaillez votre rythme cardiaque au métronome visuel de relaxation.

### 🛡️ 3. Journal d'Intimité & Mode SOS
- **Journal SOS** : Un espace sécurisé, minimaliste et apaisant pour confier ses pensées dans les moments de submersion ou de stress aigu.
- **Assistant d'auto-compassion IA** : Une aide à la formulation de pensées douces pour transformer le dialogue intérieur négatif en un accompagnement constructif.

### 📊 4. Historique Climatique & Progrès
Consultez la trajectoire de votre ciel mental à travers une vue calendaire épurée, un graphique d'évolution et un résumé d'accomplissement de vos exercices et de vos rituels d'hygiène mentale.

---

## 🎨 Conception Visuelle & Expérience

L'identité visuelle de **MindCare** repose sur une interface d'une grande sobriété :
- **Palette Pastel Calme** : Des tons ardoise, lilas et grège pour reposer le regard.
- **Micro-animations (Motion)** : Des transitions fluides et organiques sous `motion` pour un effet enveloppant lors du chargement des rituels.
- **Icônes Précises** : Sélection issues exclusivement du set unifié **Lucide React**.

---

## 🚀 Installation & Lancement Local

Vous souhaitez faire tourner MindCare sur votre machine ? Suivez ces étapes simples :

### Prérequis
- **Node.js** (version 18 ou ultérieure requise)
- **NPM** (vient de pair avec Node.js)

### 1. Cloner le Projet
```bash
git clone <url-de-votre-depot>
cd mindcare
```

### 2. Installer les Dépendances
Lancez l'installation des dépendances nécessaires au fonctionnement du serveur Express et de la partie cliente :
```bash
npm install
```

### 3. Configurer les Variables d'Environnement
Dupliquez le fichier d'exemple disponible à la racine du projet :
```bash
cp .env.example .env
```
Ouvrez le fichier `.env` puis configurez, si vous le souhaitez, votre clé API de services compagnons :
```env
# Clé d'API optionnelle pour les interactions IA en local
GEMINI_API_KEY=votre_cle_ici
```

### 4. Lancer le Serveur de Développement
Démarrez l'environnement local full-stack (Vite + Express servant l'application) :
```bash
npm run dev
```
L'application est instantanément disponible sous l'adresse suivante :
👉 [**http://localhost:3000**](http://localhost:3000)

### 5. Compiler pour la Production (Build)
Pour générer les fichiers optimisés pour la mise en production :
```bash
npm run build
```
Les fichiers sont construits dans le dossier `/dist`. Le serveur de production est compilé dans un fichier bundle autonome `dist/server.cjs` à l'aide d'esbuild pour une exécution ultra-rapide.

### 6. Lancer le Produit Compilé
```bash
npm run start
```

---

## 🛠️ Stack Technique

- **Frontend** : React 19 (Hooks, Contexts), Tailwind CSS Module (Vite plugin v4), Motion (ex-framer-motion) pour les animations cinétiques de respiration et de navigation.
- **Backend / Proxy** : Node.js avec Express servant d'API et gérant l'intégration sécurisée de la clé Gemini sur une route proxy hermétique.
- **Bundler / Compilateur** : Vite 6 (client side), esbuild (compilation et bundle serveur en format CommonJS autonome).

---

Conçu avec soin pour votre bien-être. 🌱  
*Prenez une profonde inspiration, expirez lentement... la paix commence ici.*
