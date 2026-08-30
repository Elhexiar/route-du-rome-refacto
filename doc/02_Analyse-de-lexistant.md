## Analyse de l'existant

### Structure de départ

La version initiale reposait sur deux pages autonomes. Le premier fichier gérait l'accueil, la sélection du héros, une introduction vidéo et un premier dialogue. Le second regroupait le jeu principal : carte, marqueurs, dialogues, vidéos de métiers, quêtes, badges, expérience et audio.

Dans `jeu.html`, les données des héros et des métiers étaient déclarées directement dans le script de la page. Les fonctions globales comme `switchHero`, `openJob`, `advDlg`, `validateQuest`, `updateXP` ou `showEndScreen` manipulaient directement le DOM et un état global du jeu.

Cette organisation était pratique pour produire rapidement un prototype, mais elle devenait difficile à suivre dès qu'il fallait corriger un comportement ou faire évoluer un système.

### Ce qui fonctionnait

Les fonctionnalités principales étaient déjà visibles et jouables :

- sélection d'un héros ;
- affichage d'une carte Leaflet ;
- déplacement du joueur et affichage de marqueurs ;
- ouverture de dialogues ;
- choix liés aux métiers ;
- vidéos YouTube ou vidéos locales ;
- attribution d'expérience ;
- badges et écran de fin ;
- musique et effets sonores.

Le contenu et l'intention du jeu étaient donc présents. Le problème concernait surtout la fiabilité et l'organisation du code.

### Problèmes rencontrés

#### Logique mélangée

Le HTML, le CSS, les données et la logique métier étaient réunis dans les mêmes fichiers. Les fonctions modifiaient directement des éléments identifiés par leur `id`, et l'état du jeu était partagé entre plusieurs fonctions globales.

#### Dépendances cachées

Dans la version refactorisée en cours de développement, `GameManager` avait progressivement pris le rôle d'un objet central contenant presque tous les contrôleurs. Plusieurs classes pouvaient donc fonctionner uniquement parce qu'elles retrouvaient leurs dépendances dans cet objet global.
