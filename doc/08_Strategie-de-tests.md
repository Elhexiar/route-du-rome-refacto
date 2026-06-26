
## Stratégie de test

L'objectif est d'atteindre une couverture de tests d'environ 80 %.

Le projet étant composé de peu de systèmes, majoritairement simples, la grande majorité des tests seront des **tests unitaires**. Quelques **tests d'intégration** viendront les compléter, mais ceux-ci ne devraient pas présenter de difficulté particulière. La Clean Architecture facilite par ailleurs la création de mocks, rendant l'ensemble de la stratégie de test accessible à mettre en œuvre.

La majorité du code liée au HTML ne sera surement pas tester car souvent compliqué a tester, sans que cela soit forcement nescessaire.
