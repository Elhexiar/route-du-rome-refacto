## Organisation

### Organisation prévue

Le projet devait être conduit selon une organisation Agile, avec des sprints de deux semaines et un suivi régulier de l'avancement.

Le rythme prévu était le suivant :

- **Daily** chaque matin ;
- **Sprint Planning** le lundi d'ouverture de chaque sprint ;
- **Vendredi** consacré à la documentation et à l'organisation.

### Planning initial

#### Sprint 1 — 22/06/2026 au 03/07/2026

Documentation et R&D.

#### Sprint 2 — 06/07/2026 au 17/07/2026

Refactorisation du menu initial, de la sélection du guide et de la carte.

#### Sprint 3 — 20/07/2026 au 31/07/2026

Refactorisation des dialogues, intégration des vidéos, système d'expérience, badges et quêtes.

#### Sprint 4 — 03/08/2026 au 14/08/2026

Passe front-end, style, UI/UX et adaptation aux écrans mobiles et aux tablettes.

#### Sprint 5 — 17/08/2026 au 28/08/2026

Intégration d'un menu administrateur, réflexion autour du pipeline CI/CD, peaufinage et déploiement final.

---

### Déroulement réel

Le planning initial n'a finalement pas pu être suivi comme prévu. Deux éléments ont principalement perturbé l'organisation : les périodes de vacances et de télétravail n'avaient pas été intégrées correctement, et la complexité réelle du système de dialogue avait été sous-estimée.

À partir du deuxième sprint, une grande partie du temps a été consacrée à la construction puis à la reprise des systèmes principaux. Le système de dialogue a notamment connu plus de cinq itérations, avec des approches parfois très différentes. Cette recherche a pris du temps, mais elle a permis d'aboutir à une structure plus stable et mieux testable.

La majorité de l'interface et des finitions front-end a donc été réalisée tardivement. Cela explique que certaines fonctionnalités prévues n'aient pas été intégrées, comme la gestion du son, la sauvegarde dans le `localStorage` ou une stratégie de déploiement complète.

---

### Réorientation du travail

Le projet a progressivement changé de priorité :

1. comprendre l'existant et identifier les systèmes prioritaires ;
2. stabiliser les dialogues, les quêtes, les badges et l'expérience ;
3. rendre les dépendances explicites et supprimer le `God Object` qu'était devenu `GameManager` ;
4. centraliser la composition dans `ApplicationContainer` ;
5. ajouter une communication par événements ;
6. remettre en ordre les tests et créer un outil de test accessible depuis la console ;
7. terminer par les corrections d'interface, de performance et de documentation.

Cette réorientation était nécessaire pour éviter de construire l'interface sur des systèmes encore instables. Elle a cependant réduit le temps disponible pour certaines fonctionnalités secondaires.

---

### Bilan

L'organisation n'a pas respecté le calendrier prévu, mais le travail a abouti à une base plus propre que celle identifiée au départ. La refactorisation a permis de clarifier les responsabilités, de rendre les dépendances injectables et de conserver `GameManager` uniquement comme outil de console.

---

[← Page précédente : Qualité](09_Qualite.md) | [Page suivante : Annexe →](11_Annexe.md)
