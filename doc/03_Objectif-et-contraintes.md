## Objectifs et contraintes

### Objectifs

#### Reprendre l'existant sans perdre le jeu

Le premier objectif était de conserver le contenu et le parcours de la version initiale tout en sortant de l'organisation en deux fichiers HTML autonomes.

#### Améliorer la maintenabilité

Les systèmes devaient être séparés en modules et en classes compréhensibles. Une modification du dialogue ne devait plus nécessiter de parcourir un script global contenant également la carte, l'audio et les quêtes.

#### Améliorer la testabilité

Les entités et la logique métier devaient pouvoir être testées sans démarrer toute l'interface. L'objectif de 80 % de couverture a servi de repère, mais n'a pas été atteint dans le temps disponible.

#### Stabiliser les systèmes principaux

La refactorisation devait fiabiliser les dialogues, la sélection du héros, la carte, les quêtes, les badges et le calcul de l'expérience.
Tout en rendant l'addition de nouvelle donnée plus facile.

---

### Contraintes

#### Contraintes techniques

- partir d'une application existante en HTML, CSS et JavaScript ;
- utiliser Vite et TypeScript pour la nouvelle structure ;
- ne pas ajouter de framework front-end ;
- conserver les données dans des fichiers JSON ;
- continuer à intégrer Leaflet et YouTube dans un environnement navigateur.

#### Contraintes fonctionnelles

- conserver les fonctionnalités du prototype initial ;
- ne pas modifier le contenu des métiers et des dialogues sans nécessité ;
- maintenir la compatibilité avec les assets fournis.

#### Contraintes de périmètre

- pas de backend ;
- pas de base de données ;
- pas de comptes utilisateurs ;
- pas de gestion complète de la persistance ;
- interface d'administration seulement envisagée si le temps le permet.

#### Contraintes de temps

Le travail devait être réalisé sur une période limitée. La conception du système de dialogue a pris plus de temps que prévu, avec plusieurs itérations, ce qui a obligé à prioriser la stabilité et la structure au détriment de certaines fonctionnalités secondaires.

---

[← Page précédente : Analyse de l'existant](02_Analyse-de-lexistant.md) | [Page suivante : Exigences →](04_Exigences.md)
