# Tests - MindCare

> [!IMPORTANT]
> Ce fichier est une exception parmi les fichiers de consignes du projet.
>
> L'IA est autorisée à modifier ce fichier uniquement pour ajouter de nouveaux tests liés aux fonctionnalités qu'elle crée ou modifie.
>
> L'IA ne doit jamais :
>
> 1. supprimer un test existant ;
> 2. remplacer un test existant ;
> 3. modifier les critères de réussite d'un test existant ;
> 4. réorganiser toute la structure du fichier sans demande explicite de l'utilisateur.
>
> À chaque ajout ou modification de fonctionnalité, l'IA doit ajouter plusieurs tests permettant de vérifier que la fonctionnalité fonctionne correctement.

---

# 1. Rôle du fichier

Ce fichier définit les règles d'organisation des tests de l'application MindCare.

L'IA doit utiliser ce fichier pour :

* ajouter des tests après chaque nouvelle fonctionnalité ;
* vérifier les comportements attendus ;
* éviter les régressions ;
* organiser les tests par page ;
* préciser les critères de réussite de chaque test.
 
L'IA ne doit pas considérer une fonctionnalité comme terminée si aucun test n'a été ajouté pour celle-ci.

---

# 2. Règles générales

L'IA doit :

* ajouter des tests à chaque nouvelle fonctionnalité ;
* ajouter des tests à chaque modification d'une fonctionnalité existante ;
* organiser les tests par page ;
* organiser les tests par fonctionnalité ;
* écrire plusieurs tests par fonctionnalité ;
* préciser un critère de réussite clair pour chaque test ;
* couvrir les cas normaux ;
* couvrir les erreurs possibles ;
* couvrir les cas limites lorsque c'est pertinent ;
* vérifier l'affichage mobile ;
* vérifier le respect de la charte graphique ;
* vérifier que les textes restent cohérents avec MindCare.

L'IA ne doit pas :

* écrire un test vague ;
* écrire un critère de réussite imprécis ;
* ajouter une fonctionnalité sans test associé ;
* supprimer des tests existants ;
* modifier des tests déjà validés sans demande explicite ;
* regrouper trop de comportements différents dans un seul test ;
* considérer qu'un simple affichage visuel suffit à valider une fonctionnalité.

---

# 3. Format obligatoire

L'IA doit organiser les tests selon ce format :

```md
## [Nom de la page]

### 1. [Nom de la fonctionnalité testée]

1. [Nom du test] : [critère(s) de réussite]
2. [Nom du test] : [critère(s) de réussite]
3. [Nom du test] : [critère(s) de réussite]

### 2. [Nom de la fonctionnalité testée]

1. [Nom du test] : [critère(s) de réussite]
2. [Nom du test] : [critère(s) de réussite]
3. [Nom du test] : [critère(s) de réussite]
```

---

# 4. Types de tests à prévoir

Pour chaque fonctionnalité, l'IA doit ajouter les types de tests pertinents parmi les catégories suivantes.

## 4.1 Tests fonctionnels

Ces tests vérifient que la fonctionnalité fait bien ce qui est attendu.

L'IA doit tester :

* les actions principales ;
* les boutons ;
* les formulaires ;
* les validations ;
* les redirections ;
* les sauvegardes ;
* les mises à jour d'écran ;
* les interactions utilisateur.

---

## 4.2 Tests visuels

Ces tests vérifient que l'interface respecte la direction graphique de MindCare.

L'IA doit tester :

* les couleurs ;
* les typographies ;
* les espacements ;
* les arrondis ;
* les cartes ;
* les boutons ;
* la lisibilité ;
* l'affichage mobile.

---

## 4.3 Tests de navigation

Ces tests vérifient que l'utilisateur peut se déplacer correctement dans l'application.

L'IA doit tester :

* les liens entre pages ;
* les boutons de retour ;
* les redirections après validation ;
* les parcours principaux ;
* les sorties de parcours ;
* l'absence de blocage utilisateur.

---

## 4.4 Tests de contenu

Ces tests vérifient que les textes affichés respectent l'esprit de MindCare.

L'IA doit tester :

* la clarté des textes ;
* le ton rassurant ;
* l'absence de diagnostic ;
* l'absence de culpabilisation ;
* la simplicité des phrases ;
* la cohérence avec le parcours utilisateur.

---

## 4.5 Tests d'erreur

Ces tests vérifient les comportements en cas de problème.

L'IA doit tester :

* les champs obligatoires vides ;
* les formats invalides ;
* les erreurs de connexion ;
* les erreurs de chargement ;
* les erreurs liées à l'IA ;
* les interruptions de parcours ;
* les données manquantes.

---

## 4.6 Tests de cas sensibles

Ces tests vérifient les situations liées au bien-être émotionnel et aux signaux sensibles.

L'IA doit tester :

* la détection d'un signal sensible ;
* la redirection vers Stop SOS si nécessaire ;
* l'affichage des limites de MindCare ;
* l'affichage des ressources d'aide ;
* l'absence de diagnostic ;
* l'absence de promesse médicale ;
* la possibilité de refuser une aide externe sans culpabilisation.

---

# 5. Règles spécifiques à MindCare

Pour toute fonctionnalité liée à l'IA, au check-in, au chatbot, aux exercices ou au parcours Stop SOS, l'IA doit ajouter des tests vérifiant que :

* MindCare ne pose aucun diagnostic ;
* MindCare ne remplace pas un professionnel de santé ;
* les résultats sont présentés comme des ressentis ;
* les réponses restent courtes et rassurantes ;
* l'utilisateur peut toujours quitter un parcours ;
* les informations sensibles sont traitées avec prudence ;
* les recommandations d'exercices restent adaptées ;
* un seul exercice est proposé à la fois par Mindy ;
* le parcours Stop SOS reste accessible rapidement.

---

# 6. Checklist avant validation d'une fonctionnalité

Avant de considérer une fonctionnalité comme terminée, l'IA doit vérifier :

* la fonctionnalité possède plusieurs tests associés ;
* les tests sont ajoutés dans la bonne page ;
* les tests sont liés à la bonne fonctionnalité ;
* chaque test possède un critère de réussite ;
* les tests couvrent le fonctionnement principal ;
* les tests couvrent au moins un cas d'erreur si pertinent ;
* les tests couvrent l'affichage mobile si pertinent ;
* les tests respectent la charte graphique ;
* les tests vérifient l'absence de diagnostic médical ;
* les tests vérifient que l'utilisateur n'est pas bloqué.

Si une fonctionnalité n'a pas de tests, elle ne doit pas être considérée comme terminée.

---

# 7. Zone des tests ajoutés par l'IA

## Authentification & Création de Compte (`/auth`, `/auth/creation-compte`, `/auth/connexion`)

### 1. Inscription et Acceptation RGPD
1. Validation d'inscription vide : Le système bloque la soumission et affiche une alerte claire invitant à remplir le prénom.
2. Email invalide : Le système rejette la saisie d'un email sans symbole "@" et renvoie une alerte.
3. Blocage RGPD : Le bouton de validation reste verrouillé ou l'alerte affiche que l'acceptation de la protection des données est obligatoire pour continuer.
4. Redirection Onboarding : Après validation conforme, l'utilisateur est instantanément redirigé vers l'écran d'introduction d'Onboarding.

### 2. Formulaire de Connexion
1. Connexion standard : Saisir un email conforme et un mot de passe valide connecte l'utilisateur et le redirige directement vers l'Accueil.
2. Formulaire partiel : Un mot de passe vide ou une adresse email incomplète génère une bannière d'alerte rouge douce.

---

## Onboarding & Questionnaire Initial (`/onboarding`, `/onboarding/questionnaire`, `/onboarding/stockage`)

### 1. Questionnaire Progressif (9 Questions)
1. Affichage de la progression : Chaque question affiche un indicateur de type "Étape X sur 9" et met à jour des lignes de progression.
2. Bouton Retour : Cliquer sur "Retour" renvoie bien l'utilisateur à la question précédente sans altérer les réponses intermédiaires déjà mémorisées.
3. Validation du prénom : Le champ du prénom accepte des pseudonymes et refuse les validations de texte entièrement vides.

### 2. Charte de Confidentialité & Stockage
1. Explication claire : La page de stockage résume les principes du RGPD ainsi que le chiffrement fort sous forme de cartes d'information vertes rassurantes.
2. Entrée finale : Le clic sur "J'ai compris, j'entre !" active définitivement le profil comme "onboardé" et oriente vers le premier check-in quotidien.

---

## Check-in Quotidien (`/check-in`)

### 1. Auto-évaluation en 4 étapes
1. Sélection d'Humeur : Cliquer sur un emoji doux change la couleur de fond pour illustrer la sélection conforme à la charte.
2. Pression & Énergie : L'utilisateur effectue un choix exclusif parmi les niveaux Faible, Modéré et Élevé représentés par des puces interactives.
3. Champ libre : L'espace d'écriture peut être laissé vide ou complété librement pour décharger la charge mentale.

### 2. Résumé Automatique par l'IA
1. Appel API Chiffré : La soumission interroge la route serveur `/api/gemini/generate` de façon confidentielle sans exposer de clé.
2. Rendu de la météo : Le message d'analyse douce rédigé par Mindy s'affiche dans un cadre aux teintes lavande dégradées.
3. Absence de diagnostic : Le texte généré par l'IA ou sa simulation ne mentionne aucun terme clinique ou diagnostic médical de dépression ou d'anxiété.
4. Isolation du prompt système : L'appel d'API n'accepte plus d'instruction système personnalisée venant du client, le serveur applique de manière étanche sa propre constante "checkin".

---

## Tableau de Bord (`/dashboard`)

### 1. Visualisations et Tendances
1. Courbe SVG de Météo émotionnelle : Un graphique vectoriel responsive s'affiche et réagit à l'écran, affichant les points de moral récent.
2. Compteur de jours de sérénité (Streak) : Un badge flamme orange met en valeur le nombre de jours consécutifs de suivi avec fierté.
3. Liste d'insignes (Badges) : Des récompenses sous forme d'étoiles dorées célèbrent de façon rassurante la régularité de l'accompagnement.

---

## Compagnon Virtuel Mindy (`/chatbot`)

### 1. Discussion sécurisée et Interactive
1. Initier un échange : Cliquer sur un déclencheur rapide comme "Je me sens stressé aujourd'hui" envoie le message et génère une bulle utilisateur.
2. Écoute bienveillante de Mindy : Mindy répond sous 2 secondes avec un ton doux et chaleureux, sans jargon médical.
3. Recommandation unique d'exercice : Mindy ne propose qu'un seul exercice d'apaisement à la fois pour éviter de submerger l'utilisateur.

### 3. Isolation du prompt d'identité (Sécurité)
1. Résilience de l'identité : L'appel d'API n'accepte plus d'instruction système venant de requêtes clientes mais force l'usage de la constante hermétique serveur, empêchant tout détournement de l'identité de Mindy.

### 2. Détection d'Expressions Sensibles
1. Alerte de détresse : La présence de mots-clés de crise majeurs déclenche l'affichage immédiat d'une bulle système rouge vif.
2. Redirection Stop S.O.S : Le message d'alerte incite l'utilisateur à cliquer sur le bouton de secours ou à contacter le numéro national 3114.

---

## Activités & Exercices (`/exercices`)

### 1. Cohérence Cardiaque (5s / 5s)
1. Animation de respiration : Le cercle d'entraînement gonfle régulièrement pendant 5 secondes durant la phase d'inspiration, puis dégonfle pendant 5 secondes durant l'expiration.
2. Compte-secondes : Un chrono numérique décompte les secondes de chaque cycle au centre de la bulle.

### 2. Respiration Carrée (4x4s)
1. Indicateur visuel : Le carré de guidage s'illumine côté par côté d'une couleur violette selon les 4 phases distinctes (Inspiration, Rétention, Expiration, Rétention).

### 3. Visualisation des Nuages
1. Écriture de rumination : L'utilisateur écrit sa pensée encombrante et l'attache à un nuage qui flotte doucement d'un côté à l'autre de l'écran.2. Relâchement : Cliquer sur le bouton souffle dissipe instantanément le nuage vers l'infini, symbolisant la prise de distance.

### 4. Parcours de Stabilisation Stop S.O.S
1. Accès d'urgence : Le bouton mauve "STOP S.O.S" reste visible en haut de l'écran tout au long du parcours interne de l'application.
2. Affichage d'aide : L'écran indique le numéro national d'aide (3114) et le 15 dans un format d'appel d'urgence réconfortant.

---

## Paramètres & Privacy (`/parametres`)

### 1. Gestion des traces & RGPD
1. Extraction confidentielle : Cliquer sur le bouton de téléchargement du dossier compile les données de suivi sous forme de rapport d'historique.
2. Purge définitive : Le bouton de purge supprime ou réinitialise les bilans d'humeur après double validation pour respecter le droit à l'oubli.

### 2. Pack Premium
1. Présentation respectueuse : L'offre Premium est affichée à 2,99€ / mois sans intrusion et sans dévaloriser l'utilisation de la version gratuite de secours.
2. Activation mockée : Cliquer sur l'activation débloque le badge premium sur le profil utilisateur de façon instantanée.

