## Introduction et contexte

### Le projet

La Route du Rome est un serious game développé pour France Travail. Il propose de découvrir différents métiers de l'Ille-et-Vilaine à travers une exploration interactive de la carte du département.

Le joueur choisit un héros, rencontre des professionnels, avance dans des dialogues et consulte des vidéos de présentation. Les quêtes, l'expérience, les niveaux et les badges servent à suivre sa progression.

### La version initiale

Le projet de départ était une application fonctionnelle répartie dans deux fichiers HTML : `index.html` et `jeu.html`. Chaque fichier contenait à la fois :

- la structure HTML ;
- les styles CSS ;
- les données du jeu ;
- les fonctions JavaScript ;
- les interactions avec la carte et les vidéos ;
- une partie de la progression du joueur.

La version initiale avait été produite rapidement, avec beaucoup de logique directement écrite dans les pages. Elle permettait de montrer le concept et le contenu, mais elle n'offrait pas une base confortable pour poursuivre le développement.

### Le travail réalisé

Le travail présenté dans ce dossier correspond à la version refactorisée développée ensuite pendant environ un 2 mois. L'objectif était de reprendre l'application existante sans perdre son contenu, puis de la transformer en projet TypeScript Vite structuré, testable et plus facile à maintenir.

Il ne s'agissait donc pas de créer un nouveau jeu. Il fallait conserver le parcours prévu tout en corrigeant les systèmes qui fonctionnaient mal et en séparant les responsabilités.

### Périmètre

#### Inclus

- découpage de l'application en modules ;
- séparation des entités, contrôleurs, services et vues ;
- refactorisation des dialogues, de la carte, des quêtes, des badges et de l'expérience ;
- injection explicite des dépendances ;
- communication par événements ;
- tests automatisés des principaux systèmes ;
- documentation des choix et du retour d'expérience.

#### Hors périmètre

- création d'un backend ou d'une base de données ;
- gestion de comptes ou de données personnelles ;
- ajout d'un framework front-end ;
- remplacement complet des assets existants ;
- correction artistique des vidéos générées, notamment les problèmes de synchronisation labiale ;
- réalisation complète de l'interface d'administration et du pipeline CI/CD.
- Strategie de déploiement.
