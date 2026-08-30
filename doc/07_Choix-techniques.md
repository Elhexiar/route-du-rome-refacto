## Choix techniques

### Contexte du choix

La version initiale fonctionnait sans framework, directement dans deux fichiers HTML. Le choix n'a donc pas été de remplacer complètement la stack, mais de conserver une approche web native tout en donnant une vraie structure au code.

---

### TypeScript

Le code refactorisé est écrit en TypeScript puis compilé en JavaScript. Ce choix apporte des contrats plus clairs entre les entités, les contrôleurs, les services et les vues.

Le compilateur est configuré en mode strict. Les seules zones plus souples concernent principalement Leaflet, qui est chargé comme bibliothèque JavaScript externe.

### Vite

Vite sert à la fois pour le développement et la production. Il permet :

- de lancer rapidement l'application en développement ;
- de compiler le TypeScript ;
- de regrouper les fichiers ;
- de produire un dossier `dist` ;
- de prévisualiser le build de production.

Les commandes principales sont :

```bash
npm run dev
npm run build
npm run preview -- --host 127.0.0.1
```

La troisieme commande est notamment utile pour mesurer le livrable avec Lighthouse.

### HTML, CSS et JavaScript natifs

Aucun framework front-end n'a été ajouté. Ce choix permet de rester proche de l'application initiale et de garder la maîtrise du DOM, des événements et des styles.

La contrepartie est que les vues demandent davantage de code manuel. Cette difficulté est compensée par leur séparation en classes et par l'injection de leurs dépendances.

### Fichiers JSON

Les données des héros, des PNJ, des dialogues et des niveaux sont regroupées dans `public/config.json`. Cela permet de modifier le contenu sans base de données ni serveur applicatif.

Ce choix reste suffisant pour le périmètre actuel, mais ne fournit pas de validation côté serveur, de gestion avancée des versions ou de sauvegarde de progression.

### Leaflet

Leaflet est utilisé pour afficher la carte et gérer les marqueurs. Il est important de distinguer Leaflet d'OpenStreetMap : Leaflet est une bibliothèque JavaScript, tandis qu'OpenStreetMap fournit les données cartographiques et les tuiles affichées par la carte.

Dans la version initiale, Leaflet était chargé depuis un CDN et les tuiles étaient récupérées depuis les serveurs publics d'OpenStreetMap. Cette solution était rapide à mettre en place, mais elle créait une dépendance directe à plusieurs services externes.

Le choix de Leaflet reste pertinent, car le projet a besoin d'une bibliothèque légère et libre pour afficher les marqueurs et gérer les interactions. En revanche, le fournisseur des tuiles doit être considéré séparément. Le fait qu'un service soit libre ou ouvert ne signifie pas automatiquement que toute son infrastructure relève d'une souveraineté européenne.

Cette distinction était importante dans la réflexion initiale sur la souveraineté numérique. OpenStreetMap est un projet ouvert et sa fondation est basée au Royaume-Uni, qui ne fait plus partie de l'Union européenne. Cela ne remet pas en cause l'intérêt des données OpenStreetMap, mais cela peut poser une question de dépendance juridique, technique et d'hébergement selon les exigences du projet.

Dans la version refactorisée, la bibliothèque Leaflet ainsi qu'une partie des ressources cartographiques sont intégrées au projet. Cela réduit la dépendance à un CDN et limite les requêtes externes. Pour aller plus loin, il serait possible d'utiliser un fournisseur de tuiles européen, d'héberger les tuiles nécessaires sur une infrastructure maîtrisée ou d'étudier une solution comme MapLibre avec des données et un hébergement choisis selon les contraintes de France Travail.

Le nombre de tuiles et leur poids restent toutefois des points à surveiller pour améliorer la mémoire utilisée et le temps de chargement.

### Vidéos et YouTube

Les vidéos de présentation des métiers peuvent être affichées dans une iframe YouTube. Lorsqu'aucune vidéo n'est disponible, l'interface affiche un emplacement de remplacement.

Cette intégration entraîne des avertissements liés au contenu tiers : cookies, stockage partitionné, CSP et politiques du navigateur. Les permissions inutiles de l'iframe ont été réduites, mais les messages produits à l'intérieur de YouTube ne sont pas entièrement contrôlables.

### PWA

Le projet contient un manifeste et un service worker afin de préparer l'installation comme application web progressive. Le fonctionnement hors ligne complet reste une limite, en particulier pour les vidéos et les ressources qui dépendent de services externes.

---

### Bilan

La stack reste volontairement légère : TypeScript, Vite, Vitest, HTML, CSS, JavaScript natif, JSON et Leaflet.

Le changement principal vient moins des outils que de leur organisation. Le code est passé d'un prototype composé de deux pages autonomes à une application modulaire, assemblée explicitement et testée par parties.

Les choix d'organisation sont détaillés dans le [diagramme des contrôleurs](05_Modelisation/controllers/controllersV1.0.pu) ou sa [version SVG](05_Modelisation/controllers/controllersV1.svg), le [diagramme des services](05_Modelisation/service/servicesV1.0.pu) ou sa [version SVG](05_Modelisation/service/servicesV1.svg), et le [diagramme des entités](05_Modelisation/entities/entitiesV1.0.pu) ou sa [version SVG](05_Modelisation/entities/entitiesV1.svg). La communication par événements est également visible dans le [diagramme de vue d'ensemble](05_Modelisation/C4/component.pu) ou sa [version SVG](05_Modelisation/C4/projectOverview.svg).
