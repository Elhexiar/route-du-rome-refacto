
## Objectifs et contraintes

### Objectifs

**Maintenabilité et modularité**
L'objectif principal est de rendre l'application maintenable et évolutive. Concrètement, cela signifie décomposer l'application, actuellement concentrée dans deux fichiers `.html`,  en modules et fichiers distincts, chacun responsable d'un système bien défini.

**Architecture et testabilité**
La majorité des classes devront être issues d'interfaces abstraites, afin de faciliter l'injection de nouvelles fonctionnalités et de permettre des tests unitaires fiables. L'objectif est d'atteindre une couverture de tests d'au moins 80 %.

**Interface d'administration** *(optionnel, si le temps le permet)*
Une interface admin permettant d'ajouter ou de retirer des métiers et des dialogues (via modification des fichiers JSON de données). Ce point nécessite une réflexion préalable sur la stratégie CI/CD.

---

### Contraintes

**Stack technique**
- Application Vite, écrite en TypeScript et compilée en JavaScript
- Aucun framework — approche web native uniquement
- Les dépendances externes (OpenStreetMap, API YouTube) doivent être intégrées proprement

**Fonctionnel**
- Toutes les fonctionnalités actuellement opérationnelles doivent être préservées dans le livrable

**Qualité du code**
- Code lisible, modulaire, testé et documenté en français

**Compatibilité et déploiement**
- Interface responsive, confortable sur mobile et tablette
- Installable et utilisable hors connexion (PWA)

**Performance**
- Application performante et optimisée
- La documentation doit inclure des exemples concrets d'amélioration des métriques de performance

**Éco-conception**
- Prise en compte des principes d'éco-conception dans l'esprit du RGESN

**SEO**
- Stratégie de référencement claire et cohérente, notamment dans la structure et la sémantique HTML

**Accessibilité**
- Conformité au RGAA

**Sécurité et légal**
- Respect des bonnes pratiques de sécurité
- Présence de mentions légales
