
## Architecture

### Choix architectural : Proposition 1



Le projet s'appuie sur une **Clean Architecture**, avec une séparation stricte entre chaque couche via des interfaces.

![Introduction à la Clean Architecture](https://cdn-media-1.freecodecamp.org/images/YsN6twE3-4Q4OYpgxoModmx29I8zthQ3f0OR)  

Le périmètre du projet est relativement restreint : peu de dépendances externes et un seul composant applicatif, *La Route du Rome*. Des architectures comme l'Hexagonale, l'Onion ou l'Event-Driven ne sont donc pas nécessaires,  le projet n'atteindra pas un niveau de complexité qui les justifierait.

**Pourquoi la Clean Architecture plutôt qu'une architecture en couches (Layered) ?**

Ce choix garantit que la logique métier reste strictement isolée des dépendances externes. Or, les deux dépendances actuelles, OpenStreetMap et YouTube, pourraient un jour devoir être remplacées, notamment pour des raisons de souveraineté numérique :

- **YouTube** est rattaché à Google, société américaine
- **OpenStreetMap**, bien qu'européen et open source, est principalement basé au Royaume-Uni, donc hors Union Européenne

La Clean Architecture simplifie ce type de substitution et encourage une meilleure discipline dans la gestion des dépendances.

### Choix architectural : Proposition 2

Le projet étnat relativement restraint dans son scope, avec une application realitvement simple, n'utilisant que peux de dépendance éxterne et composé d'un seul component.

La majorité des architectures habituel serait superflus et une complexification inutile du projet.

Ici l'objectif de l'architecture sera simple et clair.

Séparer la logique metier et les dépendance de la partie HTML.

Séparer la logique metier des dépendance externes (Youtube, OpenStreetMap) pour permettre de facilement changer de dépendance si nescessaire.

Permetre de faire des tests unitaire sur l'intégralité des logiques metier, et entitées.

Une gestion simple mais organisée et efficace de la data et des assets.

