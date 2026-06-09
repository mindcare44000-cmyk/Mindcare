# Arborescence Fonctionnelle - MindCare

> [!IMPORTANT]
> Ce fichier n'est pas modifiable par l'IA et ne doit jamais être modifié. Seul l'utilisateur peut le modifier manuellement s'il le souhaite. L'IA ne peut que :
>
> 1. lire.
> 2. réfléchir à partir du fichier.
> 3. poser des questions par rapport au fichier.
>
> Dans le cas où l'utilisateur demande à l'IA de modifier le fichier, l'IA doit arrêter sa réflexion et prévenir que l'utilisateur doit le faire manuellement.

---

# 1. Rôle du fichier

Ce fichier définit l'arborescence fonctionnelle de l'application MindCare.

L'IA doit utiliser ce fichier pour comprendre :

* les pages principales de l'application ;
* les liens possibles entre les pages ;
* les parcours autorisés ;
* les sections à ne pas créer sans demande explicite ;
* la logique générale de navigation.

L'IA ne doit pas ajouter de nouvelles pages sans demande explicite de l'utilisateur.

---

# 2. Structure initiale de l'application

## Structure racine

* **`/`** : racine du projet

  * `index.html` : point d'entrée HTML
  * `metadata.json` : métadonnées du projet
  * `package.json` : dépendances et scripts de démarrage
  * `tsconfig.json` : configuration TypeScript
  * `vite.config.ts` : configuration Vite

## Structure source

* **`/src`**

  * `main.tsx` : point d'ancrage React
  * `index.css` : styles globaux, Tailwind CSS et polices Google Fonts
  * `App.tsx` : composant racine de l'application MindCare

---

# 3. Règles globales de navigation

L'application MindCare doit suivre une navigation simple, mobile-first et limitée.

L'IA doit respecter les règles suivantes :

* l'utilisateur arrive d'abord sur l'authentification ou l'écran d'entrée ;
* un nouvel utilisateur passe par l'onboarding avant d'accéder à l'application ;
* un utilisateur déjà connecté accède directement à l'application ;
* la navigation principale doit contenir uniquement les grandes sections prévues ;
* chaque page doit avoir une action principale claire ;
* les liens entre pages doivent rester logiques et limités ;
* les exercices doivent être accessibles depuis la bibliothèque d'exercices ;
* le bouton ou parcours SOS doit rester accessible rapidement depuis les zones sensibles.

---

# 4. Pages d'entrée

## 4.1 Authentification

Route recommandée :

```txt
/auth
```

Rôle :

* gérer l'accès sécurisé à l'application.

Liens disponibles :

* vers `/auth/creation-compte`
* vers `/auth/connexion`

L'IA ne doit pas afficher directement les pages internes avant authentification.

---

## 4.2 Création de compte

Route recommandée :

```txt
/auth/creation-compte
```

Rôle :

* permettre à un nouvel utilisateur de créer son compte.

Liens disponibles :

* retour vers `/auth`
* vers `/onboarding`

Après création du compte, l'utilisateur doit être envoyé vers l'onboarding.

---

## 4.3 Connexion

Route recommandée :

```txt
/auth/connexion
```

Rôle :

* permettre à un utilisateur existant de se connecter.

Liens disponibles :

* retour vers `/auth`
* vers `/dashboard`
* vers `/check-in`

Après connexion, l'utilisateur doit arriver dans l'application principale.

Si le check-in du jour n'est pas complété, l'IA peut privilégier une redirection vers `/check-in`.

---

# 5. Onboarding

## 5.1 Onboarding

Route recommandée :

```txt
/onboarding
```

Rôle :

* personnaliser l'expérience initiale de l'utilisateur.

Liens disponibles :

* vers `/onboarding/questionnaire`
* retour vers `/auth/creation-compte`

---

## 5.2 Questionnaire initial

Route recommandée :

```txt
/onboarding/questionnaire
```

Rôle :

* poser les 9 questions initiales de personnalisation.

Liens disponibles :

* retour vers `/onboarding`
* vers `/onboarding/stockage`

L'IA doit conserver un questionnaire court, progressif et rassurant.

---

## 5.3 Information sur le stockage

Route recommandée :

```txt
/onboarding/stockage
```

Rôle :

* informer l'utilisateur sur la logique de stockage et de confidentialité.

Liens disponibles :

* retour vers `/onboarding/questionnaire`
* vers `/dashboard`
* vers `/check-in`

Après cette étape, l'utilisateur peut accéder à l'application principale.

---

# 6. Navigation principale

La navigation principale de MindCare doit contenir les sections suivantes :

* Check-in quotidien
* Dashboard
* Chatbot IA
* Exercices
* Paramètres

Routes principales :

```txt
/check-in
/dashboard
/chatbot
/exercices
/parametres
```

L'IA ne doit pas ajouter d'autres entrées principales dans la navigation sans demande explicite.

---

# 7. Check-in quotidien

Route recommandée :

```txt
/check-in
```

Rôle :

* permettre à l'utilisateur de faire son suivi émotionnel quotidien.

Sous-sections prévues :

* 4 questions quotidiennes
* résumé IA automatique
* météo du jour

Liens disponibles :

* vers `/dashboard`
* vers `/chatbot`
* vers `/exercices`
* vers `/exercices/journal-sos`
* vers `/exercices/stop-sos`

Règles :

* le check-in doit rester court ;
* il ne doit pas donner de diagnostic ;
* il doit permettre une transition vers un exercice adapté ;
* il peut proposer une recommandation vers le chatbot IA ou la bibliothèque d'exercices.

---

# 8. Dashboard

Route recommandée :

```txt
/dashboard
```

Rôle :

* afficher une vue personnalisée de l'état émotionnel et du suivi de l'utilisateur.

Sous-sections prévues :

* mood du jour
* évolution hebdomadaire et mensuelle
* graphiques de tendances
* streak et badges
* calendrier historique

Liens disponibles :

* vers `/check-in`
* vers `/chatbot`
* vers `/exercices`
* vers `/parametres`

Règles :

* le dashboard doit rester synthétique ;
* les données doivent être présentées comme des ressentis, pas comme des résultats médicaux ;
* les graphiques doivent rester simples et lisibles sur mobile.

---

# 9. Chatbot IA

Route recommandée :

```txt
/chatbot
```

Rôle :

* permettre à l'utilisateur d'échanger avec Mindy, le compagnon IA de MindCare.

Sous-sections prévues :

* chat libre et coaching
* recommandations d'exercices
* détection des cas sensibles

Liens disponibles :

* vers `/exercices`
* vers `/exercices/coherence-cardiaque`
* vers `/exercices/respiration-carree`
* vers `/exercices/ancrage-sensoriel`
* vers `/exercices/journal-sos`
* vers `/exercices/stop-sos`
* vers `/dashboard`

Règles :

* Mindy ne doit pas poser de diagnostic ;
* Mindy peut recommander un exercice ;
* Mindy ne doit recommander qu'un exercice à la fois ;
* en cas de situation sensible, Mindy doit orienter vers le parcours SOS ou une aide externe adaptée.

---

# 10. Exercices

Route recommandée :

```txt
/exercices
```

Rôle :

* afficher la bibliothèque complète des exercices de bien-être.

Liens disponibles :

* vers `/exercices/coherence-cardiaque`
* vers `/exercices/respiration-carree`
* vers `/exercices/ancrage-sensoriel`
* vers `/exercices/scan-corporel`
* vers `/exercices/stretch`
* vers `/exercices/affirmations`
* vers `/exercices/meditation-nuages`
* vers `/exercices/gratitude`
* vers `/exercices/journal-sos`
* vers `/exercices/journal-ia`
* vers `/exercices/stop-sos`
* vers `/dashboard`
* vers `/chatbot`

Règles :

* les exercices doivent être affichés sous forme de cartes ;
* chaque carte doit mener vers une page d'exercice dédiée ;
* les exercices doivent rester courts, simples et non médicaux.

---

# 11. Pages d'exercices

## 11.1 Cohérence cardiaque

Route recommandée :

```txt
/exercices/coherence-cardiaque
```

Contenu prévu :

* animation inspiration / expiration ;
* rythme 5s / 5s ;
* durée de 2 à 5 minutes ;
* indications visuelles et sonores.

Objectif :

* apaisement immédiat.

Liens disponibles :

* retour vers `/exercices`
* vers `/dashboard`
* vers `/chatbot`

---

## 11.2 Respiration carrée

Route recommandée :

```txt
/exercices/respiration-carree
```

Contenu prévu :

* cycle en 4 temps ;
* inspiration ;
* pause ;
* expiration ;
* pause ;
* animation carrée ;
* texte et visuel.

Objectif :

* ralentir le flux de pensées.

Liens disponibles :

* retour vers `/exercices`
* vers `/dashboard`
* vers `/chatbot`

---

## 11.3 Ancrage sensoriel

Route recommandée :

```txt
/exercices/ancrage-sensoriel
```

Contenu prévu :

* guide voir, entendre, toucher ;
* instructions simples ;
* interaction sensorielle.

Objectif :

* sortir des ruminations.

Liens disponibles :

* retour vers `/exercices`
* vers `/dashboard`
* vers `/chatbot`

---

## 11.4 Scan corporel

Route recommandée :

```txt
/exercices/scan-corporel
```

Contenu prévu :

* parcours de la tête vers les pieds ;
* instructions progressives ;
* option audio guidé ;
* durée modulable.

Objectif :

* relâchement physique.

Liens disponibles :

* retour vers `/exercices`
* vers `/dashboard`
* vers `/chatbot`

---

## 11.5 Stretch

Route recommandée :

```txt
/exercices/stretch
```

Contenu prévu :

* étirements simples illustrés ;
* séquence guidée de 1 à 3 minutes ;
* animations ou illustrations.

Objectif :

* relancer l'énergie.

Liens disponibles :

* retour vers `/exercices`
* vers `/dashboard`
* vers `/chatbot`

---

## 11.6 Affirmations

Route recommandée :

```txt
/exercices/affirmations
```

Contenu prévu :

* phrases positives personnalisées ;
* possibilité de sauvegarder ;
* lecture audio optionnelle.

Objectif :

* renforcer l'estime de soi.

Liens disponibles :

* retour vers `/exercices`
* vers `/dashboard`
* vers `/chatbot`

---

## 11.7 Méditation des nuages

Route recommandée :

```txt
/exercices/meditation-nuages
```

Contenu prévu :

* visualisation guidée de 2 à 3 minutes ;
* texte ou audio ;
* animation douce ;
* observation des pensées sans s'y accrocher.

Objectif :

* créer une distance émotionnelle.

Liens disponibles :

* retour vers `/exercices`
* vers `/dashboard`
* vers `/chatbot`

---

## 11.8 Gratitude

Route recommandée :

```txt
/exercices/gratitude
```

Contenu prévu :

* 3 éléments positifs à noter ;
* suggestions possibles ;
* historique consultable.

Objectif :

* développer une attitude positive.

Liens disponibles :

* retour vers `/exercices`
* vers `/dashboard`
* vers `/chatbot`

---

## 11.9 Journal SOS

Route recommandée :

```txt
/exercices/journal-sos
```

Contenu prévu :

* zone de texte libre ;
* aucune contrainte de format ;
* sauvegarde confidentielle ;
* rédaction libre.

Objectif :

* libérer la charge mentale.

Liens disponibles :

* retour vers `/exercices`
* vers `/chatbot`
* vers `/exercices/stop-sos`

---

## 11.10 Journal IA

Route recommandée :

```txt
/exercices/journal-ia
```

Contenu prévu :

* questions générées par l'IA ;
* reformulation des émotions ;
* suggestions de réflexion.

Objectif :

* aider l'utilisateur à comprendre ses émotions.

Liens disponibles :

* retour vers `/exercices`
* vers `/chatbot`
* vers `/dashboard`

---

## 11.11 Stop SOS

Route recommandée :

```txt
/exercices/stop-sos
```

Contenu prévu :

* bouton d'accès rapide ;
* respiration guidée ;
* message rassurant ;
* redirection vers une aide externe.

Objectif :

* stabiliser une crise d'anxiété.

Liens disponibles :

* retour vers `/exercices`
* vers `/chatbot`
* vers `/parametres`

Règles :

* cette page doit rester accessible rapidement ;
* elle ne doit pas remplacer une aide professionnelle ;
* elle doit afficher un message clair, calme et rassurant ;
* elle peut orienter vers des ressources externes adaptées.

---

# 12. Paramètres

Route recommandée :

```txt
/parametres
```

Rôle :

* gérer le compte, les préférences et les informations utilisateur.

Sous-sections prévues :

* compte et profil ;
* notifications et RGPD ;
* premium.

Liens disponibles :

* vers `/parametres/compte`
* vers `/parametres/notifications-rgpd`
* vers `/parametres/premium`
* vers `/dashboard`

---

## 12.1 Compte et profil

Route recommandée :

```txt
/parametres/compte
```

Rôle :

* gérer les informations de compte et de profil.

Liens disponibles :

* retour vers `/parametres`
* vers `/auth/connexion`

---

## 12.2 Notifications et RGPD

Route recommandée :

```txt
/parametres/notifications-rgpd
```

Rôle :

* gérer les notifications, consentements et préférences de confidentialité.

Liens disponibles :

* retour vers `/parametres`

Règles :

* l'utilisateur doit comprendre comment ses données sont utilisées ;
* les informations doivent rester simples et transparentes ;
* les choix liés aux notifications et à la confidentialité doivent être explicites.

---

## 12.3 Premium

Route recommandée :

```txt
/parametres/premium
```

Rôle :

* présenter l'offre premium.

Information prévue :

```txt
2,99€ / mois
```

Liens disponibles :

* retour vers `/parametres`

Règles :

* le premium ne doit pas bloquer les fonctions essentielles de prévention ;
* l'offre doit être présentée de manière non intrusive ;
* l'application ne doit pas culpabiliser l'utilisateur s'il reste sur une version gratuite.

---

# 13. Résumé des routes principales

```txt
/auth
/auth/creation-compte
/auth/connexion

/onboarding
/onboarding/questionnaire
/onboarding/stockage

/check-in
/dashboard
/chatbot
/exercices
/parametres

/exercices/coherence-cardiaque
/exercices/respiration-carree
/exercices/ancrage-sensoriel
/exercices/scan-corporel
/exercices/stretch
/exercices/affirmations
/exercices/meditation-nuages
/exercices/gratitude
/exercices/journal-sos
/exercices/journal-ia
/exercices/stop-sos

/parametres/compte
/parametres/notifications-rgpd
/parametres/premium
```

---

# 14. Pages à ne pas créer sans demande

L'IA ne doit pas créer automatiquement :

* une page diagnostic ;
* une page consultation médicale ;
* une page traitement ;
* une page ordonnance ;
* une page communauté ;
* une page réseau social ;
* une messagerie entre utilisateurs ;
* une page de suivi médical ;
* une page de notation de santé mentale ;
* une page d'urgence médicale présentée comme une solution de prise en charge.

---

# 15. Checklist avant création d'une page

Avant de créer une page, l'IA doit vérifier :

* la page existe-t-elle dans cette arborescence ?
* la page respecte-t-elle le parcours prévu ?
* les liens sortants sont-ils cohérents ?
* la page reste-t-elle simple et mobile-first ?
* la page évite-t-elle tout diagnostic ?
* la page respecte-t-elle la logique de prévention de MindCare ?
* la page ne crée-t-elle pas une fonctionnalité non demandée ?

Si la page n'est pas prévue dans cette arborescence, l'IA doit demander confirmation à l'utilisateur avant de la créer.
