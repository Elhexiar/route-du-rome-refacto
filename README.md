# La Route du Rome

Refactorisation d'un serious game réalisé pour France Travail.

L'application permet de découvrir les métiers de l'Ille-et-Vilaine à travers une carte interactive, des dialogues, des vidéos, des quêtes, des badges et un système de progression.

Cette version est la refactorisation du prototype initial, qui était composé de deux fichiers HTML autonomes. Le projet a été restructuré en TypeScript avec une séparation entre entités, contrôleurs, services et vues.

## Structure du projet

```text
route-du-rome-refacto/
├── README.md
├── doc/                              Documentation et modélisation
│   ├── 01 à 04_*.md                  Cadrage et exigences
│   ├── 05_Modelisation/              Diagrammes PlantUML et exports SVG
│   │   ├── C4/                        Diagrammes de contexte et architecture
│   │   ├── controllers/               Diagramme des contrôleurs
│   │   ├── entities/                  Diagrammes des entités et séquences
│   │   └── service/                   Diagramme des services
│   ├── 06 à 11_*.md                  Architecture, qualité et organisation
│   └── 12. Refactoring.md             Compte rendu de la refactorisation
└── route-du-rome/                     Application TypeScript
	├── index.html                    Point d'entrée HTML
	├── package.json                  Scripts et dépendances
	├── tsconfig.json                 Configuration TypeScript
	├── public/                       Configuration et ressources statiques
	│   ├── config.json               Données des héros, PNJ et niveaux
	│   ├── manifest.webmanifest       Manifest PWA
	│   ├── sw.js                     Service worker
	│   ├── icons/                     Icônes de l'application
	│   ├── portraits/                 Portraits des personnages
	│   ├── tiles/                     Tuiles cartographiques
	│   └── videos/                    Vidéos locales
	└── src/
		├── main.ts                   Démarrage de l'application
		├── style.css                 Styles globaux
		├── bootstrap/                 Composition des dépendances
		│   └── ApplicationContainer.ts
		├── controllers/               Coordination des systèmes
		│   ├── HeroController.ts
		│   ├── NpcController.ts
		│   ├── MapController.ts
		│   ├── DialogueController.ts
		│   ├── ExperienceController.ts
		│   ├── ConsoleTestController.ts
		│   └── GameManager.ts         Façade console de compatibilité
		├── entities/                  Entités métier
		│   ├── Hero.ts
		│   ├── Npc.ts
		│   ├── Quest.ts
		│   ├── NPCBadge.ts
		│   └── dialogue/              Dialogue, nœuds et choix
		├── events/                    Communication par événements
		│   ├── EventBus.ts
		│   └── AppEvents.ts
		├── interfaces/                Contrats des couches applicatives
		├── repositories/              Accès aux ressources externes
		├── services/                  Logique applicative transversale
		│   ├── QuestService.ts
		│   ├── BadgeService.ts
		│   ├── NotificationService.ts
		│   └── VideoPreloadService.ts
		├── ui/                        Vues et interactions DOM
		│   ├── dialogue/              Vues de dialogue et vidéos
		│   ├── experience/            XP, badges et notifications
		│   ├── map/                   Carte et marqueurs
		│   └── styles/                Styles spécifiques aux vues
		├── utils/                     Fonctions utilitaires
		└── tests/                     Tests des contrôleurs, entités et services
```

Les dossiers contenant de nombreux fichiers générés ou statiques, comme `public/tiles`, sont représentés sans détailler chaque ressource.

## Lancer l'application

Les commandes doivent être exécutées depuis le dossier `route-du-rome` :

```bash
cd route-du-rome
npm install
npm run dev
```

L'application sera ensuite disponible à l'adresse indiquée par Vite, généralement :

```text
http://localhost:5173/
```

## Build de production

```bash
cd route-du-rome
npm run build
npm run preview -- --host 127.0.0.1
```

Le serveur de prévisualisation permet notamment de mesurer la version de production avec Lighthouse.

## Tests

```bash
cd route-du-rome
npm run test:run
```

La suite teste principalement les entités, les contrôleurs, les services, l'EventBus et le contrôleur de tests accessible depuis la console.

## Console de test

En mode navigateur, le projet expose `GameManager` pour faciliter les tests manuels. Les commandes sont regroupées dans `consoleTestController` :

```javascript
GameManager.consoleTestController.state()
GameManager.consoleTestController.showHeroPresentation("hero-1")
GameManager.consoleTestController.completeQuest()
GameManager.consoleTestController.completeAllQuests()
GameManager.consoleTestController.collectAllBadges()
GameManager.consoleTestController.resetProgress()
GameManager.consoleTestController.resetDialogues()
```

`GameManager` est conservé comme façade de diagnostic. Il ne compose pas une seconde application : les instances observées sont celles créées par `ApplicationContainer`.

## Documentation

### Présentation et cadrage

- [Introduction et contexte](doc/01_Introduction-et-Contexte.md)
- [Analyse de l'existant](doc/02_Analyse-de-lexistant.md)
- [Objectifs et contraintes](doc/03_Objectif-et-contraintes.md)
- [Exigences](doc/04_Exigences.md)

### Modélisation

- [Diagramme de cas d'utilisation](doc/05_Modelisation/user-case.pu) · [SVG](doc/05_Modelisation/user-case.svg)
- [Vue C4 : contexte](doc/05_Modelisation/C4/context.pu) · [SVG](doc/05_Modelisation/C4/context.svg)
- [Vue C4 : conteneur](doc/05_Modelisation/C4/container-application.pu) · [SVG](doc/05_Modelisation/C4/container-application.svg)
- [Vue C4 : composants](doc/05_Modelisation/C4/component.pu) · [SVG](doc/05_Modelisation/C4/projectOverview.svg)
- [Diagramme des entités](doc/05_Modelisation/entities/entitiesV1.0.pu) · [SVG](doc/05_Modelisation/entities/entitiesV1.svg)
- [Diagramme des contrôleurs](doc/05_Modelisation/controllers/controllersV1.0.pu) · [SVG](doc/05_Modelisation/controllers/controllersV1.svg)
- [Diagramme des services](doc/05_Modelisation/service/servicesV1.0.pu) · [SVG](doc/05_Modelisation/service/servicesV1.svg)
- [Séquence : continuation d'un dialogue](doc/05_Modelisation/entities/dialogue-sequence.pu) · [SVG](doc/05_Modelisation/entities/dialogueSequence.svg)

Les fichiers `V0.1` et les copies de travail correspondent à des versions anciennes et ne sont pas référencés ici.

### Architecture et livraison

- [Architecture cible](doc/06_Architecture-cible.md)
- [Choix techniques](doc/07_Choix-techniques.md)
- [Stratégie de tests](doc/08_Strategie-de-tests.md)
- [Qualité](doc/09_Qualite.md)
- [Organisation](doc/10_Organisation.md)
- [Annexe](doc/11_Annexe.md)
- [Compte rendu de refactorisation](doc/12.%20Refactoring.md)

## Technologies

- TypeScript
- Vite
- Vitest
- HTML, CSS et JavaScript natifs
- Leaflet
- YouTube pour certaines vidéos de présentation

## État du projet

La refactorisation et les principaux systèmes sont en place. Le build et les tests automatisés fonctionnent. La persistance complète de la progression, le fonctionnement hors ligne total, la conformité RGAA complète et le déploiement CI/CD restent des pistes d'amélioration.
