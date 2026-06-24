
## Introduction et contexte

### Introduction

La Route du Rome est une application serious game développée pour France Travail. Elle permet de découvrir de manière interactive et guidée différents métiers du département d'Ille-et-Vilaine (35).

L'utilisateur choisit un guide et explore une carte de l'Ille-et-Vilaine, où il rencontre des professionnels de divers secteurs (maritime, restauration, agriculture, etc.). Il peut dialoguer avec ces personnages, approfondir sa connaissance des métiers via des vidéos, et suivre sa progression grâce à une barre d'expérience et des badges.

### Contexte

L'application actuelle fonctionne dans ses grandes lignes, mais souffre de nombreux bugs et de fonctionnalités défaillantes. Le client est satisfait du contenu, mais il a besoin d'une application maintenable et capable d'évoluer dans le temps.

L'objectif est de livrer la même application, mais dans une version professionnelle : maintenable, évolutive, sécurisée, testable, déployable sur navigateur, mobile et tablette, et installable en tant que PWA.

### Périmètre

**Inclus**
- Refactorisation complète de l'application, actuellement contenue dans deux fichiers `.html`
- Qualité du code, structure, tests et sécurité
- Compatibilité mobile, tablette et PWA
- Amélioration de l'expérience utilisateur, en particulier sur l'accessibilité et la lisibilité
- Documentation pour faciliter les futures évolutions

**Exclus**
- Aucune nouvelle fonctionnalité
- Aucun nouveau composant externe (backend, serveur, base de données, API, etc.)
- Aucune gestion des données utilisateur
- Aucun framework
- Aucun travail sur les assets ou le design : la majorité des assets ont été générés par IA et présentent des artefacts visuels gênant la lisibilité ainsi que des problèmes évidents de synchronisation labiale (*lip sync*). Ces problèmes dépassent le périmètre attendu d'un stagiaire en CDA et devront, si possible, être traités ultérieurement par des artistes et/ou des designers.
