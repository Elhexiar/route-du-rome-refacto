
## Analyse de l'existant

### Ce qui fonctionne

Les grandes fonctionnalités de l'application sont opérationnelles ; c'est dans les détails que des problèmes apparaissent. L'utilisateur peut sélectionner un guide, lui poser des questions, explorer la carte, découvrir les différents métiers et interroger des professionnels. Le style CSS est globalement satisfaisant.

### Ce qui ne fonctionne pas

De nombreuses fonctionnalités semblent correctes au premier abord, mais se dégradent à l'usage.

**Système de quêtes et d'expérience**
- Le déclencheur de complétion de quête ne s'active pas lorsque l'utilisateur avance dans les dialogues normalement. Pour qu'il fonctionne, l'utilisateur doit déclencher le dernier dialogue puis attendre quelques secondes sans interagir.
- Ce dysfonctionnement bloque également l'obtention des badges et le déverrouillage des vidéos de présentation des métiers.
- La barre d'expérience ne se met pas à jour visuellement.

**Interface et navigation**
- Le compteur affiche « x/10 métiers » alors qu'il n'en existe que 9.
- Toute actualisation de la page efface l'ensemble de la progression.
- La fenêtre « Quête en cours » masque les contrôles de la carte.
- La fonctionnalité de déplacement sur la carte ne semble pas avoir d'utilité apparente.

**Dialogues et vidéos**
- Les vidéos de présentation générées par IA tournent en boucle infinie, rendant le bouton « Passer » inopérant.
- La progression dans les dialogues n'est possible qu'en appuyant sur Espace ou en cliquant sur la fenêtre de dialogue. Un clic sur le personnage devrait également permettre de passer au dialogue suivant.
