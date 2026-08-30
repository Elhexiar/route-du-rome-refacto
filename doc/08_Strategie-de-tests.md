## Stratégie de tests

### Objectif

L'objectif initial était d'atteindre une couverture de tests d'environ 80 %. Dans la pratique, le temps disponible a été consacré en priorité à la refactorisation de l'architecture et à la remise en état des fonctionnalités principales.

La couverture complète n'a donc pas été atteinte. En revanche, les parties les plus sensibles de la logique métier disposent maintenant de tests automatisés. La suite permet également de vérifier rapidement qu'une modification de l'architecture ne casse pas le fonctionnement existant.

---

### Types de tests

#### Tests unitaires

Les tests unitaires constituent la majorité de la suite. Ils portent principalement sur les éléments qui peuvent être exécutés sans navigateur complet :

- les entités de dialogue et leur parcours ;
- les contrôleurs de héros et de PNJ ;
- le contrôleur de carte ;
- le calcul de l'expérience et des niveaux ;
- les services de quêtes et de badges ;
- la gestion des événements ;
- les fonctions de test accessibles depuis la console.

Les dépendances sont remplacées par des objets de test ou des fonctions simulées. L'injection de dépendances rend cette approche beaucoup plus simple qu'auparavant : une classe peut être instanciée avec uniquement les éléments dont le test a besoin.

#### Tests d'intégration

Quelques tests vérifient le fonctionnement d'un ensemble de classes, par exemple le chargement de données depuis `config.json`, la création des quêtes liées aux PNJ ou la propagation d'un événement vers le service de notifications.

Cette partie pourrait être développée davantage. Le projet ne possède pas de backend ni de base de données, ce qui limite toutefois le périmètre des tests d'intégration nécessaires.

#### Tests de l'interface

La majorité du HTML et des interactions visuelles n'est pas testée automatiquement. Ces éléments dépendent du DOM, de Leaflet, des vidéos et parfois de services externes comme YouTube.

Ce choix est un compromis lié au temps disponible. Les comportements importants restent vérifiables manuellement dans le navigateur, et les méthodes qui portent la logique métier sont testées séparément de l'affichage.

---

### Évolution de la stratégie pendant le refactoring

Au début du projet, plusieurs tests devaient préparer l'état global du `GameManager` avant de pouvoir créer un service. Cette organisation rendait les tests fragiles et masquait les dépendances réelles.

La stratégie a évolué avec l'architecture :

1. les dépendances nécessaires ont été identifiées ;
2. elles ont été transmises directement aux constructeurs ;
3. les tests ont été adaptés pour utiliser ces dépendances explicites ;
4. des tests ont été ajoutés pour le `ConsoleTestController` et l'`EventBus`.

La suite finale comprend 16 fichiers et 56 tests réussis. Elle ne garantit pas l'absence de tout problème visuel, mais elle couvre les principales règles métier et les contrats entre contrôleurs et services.

---

### Limites et améliorations possibles

Il reste plusieurs pistes pour renforcer la stratégie de tests :

- mesurer précisément la couverture avec un outil dédié ;
- ajouter des tests d'intégration autour de l'initialisation complète ;
- tester les vues avec un environnement DOM plus complet ;
- vérifier les scénarios de lecture vidéo et de perte de connexion ;
- remplacer les messages de test restants par des assertions sur les événements émis.

La priorité a été de disposer d'une base fiable et exécutable. Le seuil de 80 % reste un objectif d'amélioration, et non un résultat revendiqué pour cette version.

### Scénario de dialogue

Le déroulement d'une continuation de dialogue est représenté dans le [diagramme de séquence du dialogue](05_Modelisation/entities/dialogue-sequence.pu) ou sa [version SVG](05_Modelisation/entities/dialogueSequence.svg). Il complète les tests unitaires en décrivant le passage entre l'utilisateur, la vue, l'entité `Dialogue` et le nœud courant.

---

[← Page précédente : Choix techniques](07_Choix-techniques.md) | [Page suivante : Qualité →](09_Qualite.md)
