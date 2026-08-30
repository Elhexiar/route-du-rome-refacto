## Architecture cible

### Point de départ

La version initiale était organisée autour de deux fichiers HTML autonomes : `index.html` et `jeu.html`. Chaque page contenait son propre HTML, son CSS et son JavaScript. La carte, les dialogues, les vidéos, l'audio et la progression étaient donc gérés directement dans des scripts de page.

Cette organisation était adaptée à un prototype, mais elle rendait difficile la séparation entre l'interface et la logique du jeu. Elle compliquait aussi les tests, puisque les fonctions dépendaient directement du DOM et de variables globales.

### Choix retenu

La version refactorisée repose sur une architecture en couches, inspirée de la Clean Architecture, mais adaptée à la taille du projet.

Il ne s'agit pas d'une Clean Architecture complète avec toutes ses frontières théoriques. L'application reste un front-end unique, sans backend ni base de données. L'objectif était surtout de séparer les responsabilités et de rendre les dépendances visibles, sans transformer un petit projet en architecture inutilement lourde.

---

### Les couches de l'application

#### Entités

Les entités représentent les objets du jeu et leurs comportements propres : héros, PNJ, dialogues, nœuds de dialogue, choix, quêtes et badges.

Elles portent l'état métier et ne dépendent pas directement du DOM. Les dialogues peuvent ainsi être parcourus dans les tests sans lancer toute l'interface.

#### Services

Les services regroupent les systèmes transversaux :

- `QuestService` gère les quêtes et les récompenses ;
- `BadgeService` gère les badges ;
- `VideoPreloadService` prépare les vidéos ;
- `NotificationService` réagit aux événements pour afficher les notifications.

La séparation est nettement meilleure qu'au départ, même si certaines responsabilités pourraient encore être divisées, notamment autour de `QuestService`.

#### Contrôleurs

Les contrôleurs coordonnent les entités, les services et les vues :

- `HeroController` charge et sélectionne les héros ;
- `NpcController` charge et gère les PNJ ;
- `MapController` coordonne la carte et ses marqueurs ;
- `DialogueController` coordonne les dialogues ;
- `ExperienceController` centralise l'expérience et les niveaux.

#### Vues

Les vues gèrent le DOM, l'affichage et les interactions : sélection du héros, carte, dialogues, vidéos, carnet de badges et notifications.

Elles reçoivent leurs dépendances au lieu de les rechercher dans un singleton. Le comportement attendu d'une vue est donc plus facile à comprendre à partir de son constructeur.

#### Composition

`ApplicationContainer` est le point de composition de l'application. Il crée les objets dans le bon ordre et transmet les références nécessaires.

`GameManager` a été retiré du chemin de construction principal. Il reste disponible comme façade dans la console du navigateur, mais il pointe vers les instances déjà créées par le conteneur et ne crée pas une seconde application.

---

### Communication par événements

Un `EventBus` permet de faire circuler les changements importants sans relier directement chaque service à chaque vue.

Par exemple, la complétion d'une quête suit ce principe :

```text
QuestService
	|
	|  événement de progression ou de notification
	v
EventBus
	|
	v
NotificationService
	|
	+--> toast de quête
	+--> écran de fin
	+--> carnet de badges
```

Les noms et les payloads des événements sont regroupés dans `AppEvents`. Le bus reste volontairement simple : il sert à découpler les parties de cette application, et non à mettre en place une architecture distribuée.

---

### Résultat attendu

Cette architecture répond aux problèmes de la version initiale :

- les responsabilités sont réparties dans plusieurs modules ;
- les dépendances sont visibles ;
- les systèmes métier peuvent être testés séparément ;
- la création de l'application est centralisée ;
- les notifications ne sont plus décidées directement par chaque composant métier ;
- Leaflet, YouTube et le DOM restent dans les parties qui en ont besoin.

### Diagrammes associés

Les différents niveaux de représentation sont disponibles dans le dossier de modélisation :

- [diagramme de contexte](05_Modelisation/C4/context.pu) ([SVG](05_Modelisation/C4/context.svg)) : acteurs et systèmes externes ;
- [diagramme de conteneurs](05_Modelisation/C4/container-application.pu) ([SVG](05_Modelisation/C4/container-application.svg)) : organisation générale de l'application ;
- [diagramme de composants](05_Modelisation/C4/component.pu) ([SVG](05_Modelisation/C4/projectOverview.svg)) : découpage interne des principaux systèmes ;
- [vue d'ensemble du projet](05_Modelisation/C4/component.pu) ([SVG](05_Modelisation/C4/projectOverview.svg)) : communication entre les grands blocs ;
- [diagramme des entités](05_Modelisation/entities/entitiesV1.0.pu) ([SVG](05_Modelisation/entities/entitiesV1.svg)) : objets métier, contrats et données ;
- [diagramme des contrôleurs](05_Modelisation/controllers/controllersV1.0.pu) ([SVG](05_Modelisation/controllers/controllersV1.svg)) : responsabilités et dépendances des contrôleurs ;
- [diagramme des services](05_Modelisation/service/servicesV1.0.pu) ([SVG](05_Modelisation/service/servicesV1.svg)) : services, événements et dépendances.

---

[← Page précédente : Exigences](04_Exigences.md) | [Page suivante : Choix techniques →](07_Choix-techniques.md)
