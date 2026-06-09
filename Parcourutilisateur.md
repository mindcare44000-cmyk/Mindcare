# Parcours Utilisateur - MindCare

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

Ce fichier définit les parcours utilisateur principaux de l'application MindCare.

L'IA doit utiliser ce fichier pour comprendre :

* les étapes de navigation prévues ;
* les transitions entre les écrans ;
* les chemins obligatoires ;
* les chemins alternatifs autorisés ;
* les comportements attendus dans les situations sensibles.

L'IA ne doit pas créer de nouveau parcours sans demande explicite de l'utilisateur.

---

# 2. Principes généraux des parcours

L'IA doit respecter les règles suivantes :

* chaque parcours doit rester simple ;
* chaque écran doit avoir une action principale claire ;
* l'utilisateur ne doit jamais être bloqué sans explication ;
* les transitions doivent être progressives ;
* l'application doit toujours conserver un ton calme et rassurant ;
* les parcours ne doivent jamais donner une impression de diagnostic médical ;
* les informations sensibles doivent être traitées avec prudence ;
* les étapes liées à la confidentialité doivent être explicites ;
* les parcours doivent être pensés en priorité pour mobile.

L'IA ne doit pas :

* ajouter des étapes inutiles ;
* complexifier les parcours ;
* créer une navigation trop longue ;
* forcer l'utilisateur à répondre à trop d'informations d'un coup ;
* utiliser un ton culpabilisant ;
* présenter MindCare comme une solution médicale ;
* remplacer les aides externes en cas de situation sensible.

---

# 3. Types d'étapes

Les parcours utilisent plusieurs types d'étapes.

## 3.1 Authentification

Étapes liées à l'accès au compte :

* écran d'accueil ;
* connexion ;
* inscription ;
* mot de passe oublié ;
* confirmation e-mail.

## 3.2 Onboarding

Étapes liées à la personnalisation initiale :

* transition onboarding ;
* questionnaire onboarding ;
* information sur le stockage ;
* transition bienvenue.

## 3.3 Destination

Étapes qui donnent accès à l'application principale :

* dashboard MindCare ;
* dashboard principal ;
* check-in quotidien ;
* chat de Mindy ;
* exercices ;
* stop SOS.

## 3.4 Questions

Étapes où l'utilisateur renseigne son ressenti :

* humeur du jour ;
* niveau de pression ;
* niveau d'énergie ;
* ressenti global.

## 3.5 Résultats IA

Étapes où l'IA produit une réponse ou une synthèse :

* génération émotionnelle IA ;
* reformulation de l'émotion ;
* réponse de Mindy ;
* résumé de conversation ;
* mise à jour du dashboard.

---

# 4. Parcours 1 — Inscription et onboarding

## 4.1 Objectif du parcours

Ce parcours permet à un nouvel utilisateur de créer son compte, confirmer son e-mail, compléter l'onboarding, comprendre la logique de stockage, puis accéder au dashboard MindCare.

Ce parcours doit être utilisé uniquement pour un utilisateur qui découvre l'application ou qui n'a pas encore terminé son onboarding.

---

## 4.2 Chemin principal

Ordre obligatoire :

1. Écran d'accueil
2. Connexion
3. Formulaire d'inscription
4. Acceptation CGU / RGPD
5. E-mail de confirmation envoyé
6. E-mail en attente de confirmation
7. Transition onboarding
8. 9 questions onboarding
9. Information stockage
10. Transition bienvenue
11. Dashboard MindCare

---

## 4.3 Règles du parcours

L'IA doit :

* commencer par un écran d'accueil simple ;
* proposer un accès à la connexion ;
* permettre l'inscription depuis le parcours de connexion ;
* demander l'acceptation des CGU et du RGPD avant la création complète du compte ;
* afficher un écran indiquant que l'e-mail de confirmation a été envoyé ;
* afficher un état d'attente tant que l'e-mail n'est pas confirmé ;
* lancer l'onboarding uniquement après confirmation du compte ;
* poser les 9 questions onboarding de manière progressive ;
* afficher une étape claire sur le stockage des données ;
* terminer par une transition de bienvenue ;
* rediriger ensuite vers le dashboard MindCare.

L'IA ne doit pas :

* envoyer l'utilisateur au dashboard avant la fin de l'onboarding ;
* masquer l'étape CGU / RGPD ;
* rendre l'information sur le stockage optionnelle ;
* créer un onboarding trop long ;
* utiliser un ton administratif trop froid ;
* présenter les questions onboarding comme une évaluation médicale.

---

## 4.4 Chemins alternatifs autorisés

Depuis l'écran de connexion :

* l'utilisateur peut accéder au parcours mot de passe oublié ;
* l'utilisateur peut accéder au formulaire d'inscription.

Depuis le formulaire d'inscription :

* l'utilisateur peut revenir à la connexion ;
* l'utilisateur peut continuer vers l'acceptation CGU / RGPD.

Depuis l'attente de confirmation e-mail :

* l'utilisateur peut attendre la validation ;
* l'utilisateur peut demander un renvoi de l'e-mail si cette fonctionnalité est prévue.

---

# 5. Parcours 2 — Check-in quotidien

## 5.1 Objectif du parcours

Ce parcours permet à l'utilisateur de renseigner son état émotionnel du jour, puis de mettre à jour son dashboard avec une génération émotionnelle produite par l'IA.

Le check-in doit rester court, simple et non médical.

---

## 5.2 Déclencheurs possibles

Le parcours peut commencer par :

1. une notification de rappel ;
2. une ouverture manuelle de l'application.

Dans les deux cas, l'utilisateur arrive sur le dashboard principal.

---

## 5.3 Chemin principal

Ordre obligatoire :

1. Notification de rappel ou ouverture manuelle
2. Dashboard principal
3. Clic sur le bouton check-in
4. Question 1 — humeur du jour
5. Question 2 — niveau de pression
6. Question 3 — niveau d'énergie
7. Question 4 — ressenti global
8. Génération émotionnelle IA
9. Dashboard mis à jour

---

## 5.4 Règles du parcours

L'IA doit :

* permettre à l'utilisateur de lancer le check-in depuis le dashboard ;
* limiter le check-in à 4 questions quotidiennes ;
* afficher les questions une par une ;
* conserver des formulations simples ;
* ne pas faire durer le check-in inutilement ;
* générer une synthèse émotionnelle après les réponses ;
* mettre à jour le dashboard après la génération IA ;
* présenter les résultats comme des ressentis et non comme des diagnostics.

L'IA ne doit pas :

* ajouter plus de 4 questions quotidiennes sans demande explicite ;
* afficher toutes les questions de manière confuse ;
* utiliser des termes médicaux ;
* donner un score de santé mentale ;
* afficher un diagnostic ;
* comparer négativement l'utilisateur à d'autres personnes ;
* culpabiliser l'utilisateur s'il ne fait pas son check-in.

---

## 5.5 Résultat attendu

À la fin du parcours, le dashboard doit être mis à jour avec :

* le mood du jour ;
* une synthèse émotionnelle courte ;
* les données du check-in quotidien ;
* éventuellement une recommandation douce vers Mindy ou un exercice adapté.

---

# 6. Parcours 3 — Conversation avec Mindy

## 6.1 Objectif du parcours

Ce parcours permet à l'utilisateur d'échanger avec Mindy, le compagnon IA de MindCare.

Mindy doit écouter, reformuler, répondre avec bienveillance et proposer un exercice uniquement si cela est pertinent.

---

## 6.2 Chemin principal

Ordre obligatoire :

1. Dashboard principal
2. Clic sur le chat de Mindy
3. Ouverture du chat
4. Message d'accueil de Mindy
5. L'utilisateur envoie un message
6. Mindy analyse le message
7. Mindy reformule l'émotion
8. Mindy répond
9. L'utilisateur lit la réponse
10. L'utilisateur continue la conversation ou quitte la conversation
11. Dashboard mis à jour avec un résumé de conversation

---

## 6.3 Règles de conversation

L'IA doit :

* afficher un message d'accueil doux au début de la conversation ;
* laisser l'utilisateur écrire librement ;
* analyser le message sans poser de diagnostic ;
* reformuler l'émotion avec prudence ;
* répondre de manière courte, claire et rassurante ;
* éviter les réponses trop longues ;
* proposer un exercice seulement si cela est utile ;
* proposer un seul exercice à la fois ;
* permettre à l'utilisateur d'accepter ou refuser l'exercice ;
* laisser l'utilisateur continuer la conversation ;
* permettre à l'utilisateur de quitter la conversation ;
* générer un résumé court après la conversation ;
* mettre à jour le dashboard avec ce résumé.

L'IA ne doit pas :

* se présenter comme un psychologue ;
* poser un diagnostic ;
* donner un traitement ;
* promettre une amélioration ;
* insister si l'utilisateur refuse un exercice ;
* proposer plusieurs exercices en même temps ;
* faire culpabiliser l'utilisateur ;
* remplacer une aide professionnelle ;
* donner une réponse anxiogène.

---

## 6.4 Proposition d'exercice

Mindy peut proposer un exercice après avoir répondu à l'utilisateur.

Chemin autorisé :

1. Mindy propose un exercice
2. L'utilisateur accepte ou refuse

Si l'utilisateur accepte :

1. Redirection vers l'exercice recommandé
2. L'utilisateur réalise l'exercice
3. Retour possible vers le chat ou le dashboard

Si l'utilisateur refuse :

1. La conversation continue
2. Mindy ne doit pas insister
3. Mindy peut proposer une autre forme d'écoute uniquement si l'utilisateur relance

---

## 6.5 Fin de conversation

L'utilisateur peut quitter la conversation.

Après la sortie :

* un résumé de conversation peut être généré ;
* le dashboard peut être mis à jour ;
* la conversation doit rester confidentielle selon les règles de stockage définies dans le projet.

---

# 7. Parcours 4 — Stop SOS

## 7.1 Objectif du parcours

Ce parcours est prévu pour les situations sensibles ou les moments d'anxiété forte.

Il doit aider l'utilisateur à se stabiliser rapidement, rappeler les limites de MindCare et orienter vers une aide externe adaptée si nécessaire.

MindCare ne doit jamais être présenté comme un service d'urgence médicale.

---

## 7.2 Déclencheurs possibles

Le parcours Stop SOS peut être déclenché de deux manières :

1. détection automatique d'un signal sensible dans le check-in ou le chat Mindy ;
2. clic manuel sur le bouton Stop SOS.

---

## 7.3 Chemin principal

Ordre obligatoire :

1. Check-in ou chat Mindy
2. Détection d'un signal sensible
3. Respiration guidée rapide
4. Rappel des limites de MindCare
5. Affichage du numéro 3114
6. Ressources d'aide adaptées
7. Proposition du mode SOS
8. L'utilisateur appelle une aide externe ou refuse
9. Redirection aide externe ou retour dashboard

---

## 7.4 Chemin manuel

Ordre obligatoire :

1. Bouton Stop SOS
2. Respiration guidée rapide
3. Rappel des limites de MindCare
4. Affichage du numéro 3114
5. Ressources d'aide adaptées
6. Proposition du mode SOS
7. L'utilisateur appelle une aide externe ou refuse
8. Redirection aide externe ou retour dashboard

---

## 7.5 Règles du parcours Stop SOS

L'IA doit :

* déclencher ce parcours en cas de signal sensible ;
* permettre aussi un accès manuel par bouton Stop SOS ;
* commencer par une respiration guidée rapide ;
* afficher un message calme et rassurant ;
* rappeler clairement que MindCare ne remplace pas une aide professionnelle ;
* afficher le numéro 3114 lorsque le contexte le nécessite ;
* proposer des ressources d'aide adaptées ;
* laisser l'utilisateur choisir d'appeler ou non ;
* permettre un retour au dashboard si l'utilisateur refuse ;
* garder un ton sobre, direct et rassurant.

L'IA ne doit pas :

* ignorer un signal sensible ;
* minimiser une situation de crise ;
* dramatiser inutilement ;
* donner un diagnostic ;
* promettre de résoudre la situation ;
* bloquer l'utilisateur dans le parcours ;
* forcer l'utilisateur à appeler ;
* masquer les ressources d'aide ;
* présenter MindCare comme une solution d'urgence.

---

## 7.6 Issue du parcours

Si l'utilisateur choisit d'appeler :

* l'application redirige vers une aide externe ;
* MindCare rappelle que l'utilisateur n'est pas seul ;
* l'application ne remplace pas l'échange avec un service compétent.

Si l'utilisateur refuse :

* l'application permet un retour au dashboard ;
* l'application peut proposer de rester dans un mode calme ;
* l'application ne culpabilise pas l'utilisateur.

---

# 8. Règles communes aux 4 parcours

L'IA doit toujours :

* préserver une navigation simple ;
* limiter les étapes inutiles ;
* guider l'utilisateur avec des textes courts ;
* utiliser un ton doux et humain ;
* garder une logique mobile-first ;
* respecter la confidentialité ;
* éviter toute formulation médicale ;
* proposer une sortie claire à chaque parcours ;
* respecter les règles de la charte graphique ;
* respecter l'arborescence fonctionnelle du projet.

L'IA ne doit jamais :

* transformer MindCare en outil de diagnostic ;
* ajouter une prise en charge médicale ;
* créer une page non prévue sans validation ;
* surcharger l'utilisateur d'informations ;
* utiliser un ton froid ou anxiogène ;
* confondre résumé émotionnel et diagnostic ;
* rendre obligatoire une interaction avec Mindy ;
* forcer l'utilisateur à suivre un exercice ;
* bloquer l'accès au dashboard sans raison claire.

---

# 9. Résumé opérationnel des parcours

## Parcours inscription et onboarding

```txt
Écran d'accueil
→ Connexion
→ Formulaire inscription
→ Acceptation CGU / RGPD
→ E-mail de confirmation envoyé
→ E-mail en attente de confirmation
→ Transition onboarding
→ 9 questions onboarding
→ Information stockage
→ Transition bienvenue
→ Dashboard MindCare
```

## Parcours check-in quotidien

```txt
Notification de rappel ou ouverture manuelle
→ Dashboard principal
→ Clic bouton check-in
→ Q1 humeur du jour
→ Q2 niveau de pression
→ Q3 niveau d'énergie
→ Q4 ressenti global
→ Génération émotionnelle IA
→ Dashboard mis à jour
```

## Parcours conversation avec Mindy

```txt
Dashboard principal
→ Clic sur le chat de Mindy
→ Ouverture du chat
→ Message d'accueil de Mindy
→ Utilisateur envoie un message
→ Mindy analyse le message
→ Mindy reformule l'émotion
→ Mindy répond
→ Utilisateur lit la réponse
→ Continuer ou quitter la conversation
→ Dashboard mis à jour avec résumé
```

## Parcours Stop SOS

```txt
Check-in ou chat Mindy
→ Détection signal sensible
→ Respiration guidée rapide
→ Rappel limites de MindCare
→ Affichage numéro 3114
→ Ressources d'aide adaptées
→ Proposition mode SOS
→ Appel aide externe ou refus
→ Redirection aide externe ou retour dashboard
```
