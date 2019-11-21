# Site web LAMA-WeST

Ce projet contient l'ensemble du code source pour déployer le site web du laboratoire LAMA-WeST.

## Technologies utilisées

  - Node/Express
  - Pug
  - YAML

## Déploiement

Pour déployer le site web en mode développement, simplement lancez la commande:
```bash
npm start
```

Pour le déployer en mode production, lancez la commande:
```bash
npm run prod
```

Par défaut, le site sera déployé sur `http://localhost:3000`.

Pour changer le numéro de port, modifier la variable d'environnement `PORT`.
P.ex.

```bash
export PORT=3333 && npm start
```

## Corrections

  - Migrer les données dans une base de données. Penser à mettre en RDF.
  - Mettre en place un bibtext centralisé.
  - Mettre à jour les données (projets avec description, publications, nouvelles, séminaires, membres)
  - Obtenir et mettre la liste de collaborateurs dans la page d'équipe.
  - Valider si on met les fichiers PDF disponibles des publications.
  - Mettre en place les tests d'intégrations des routes de l'application
  - Migrer de Express vers Koa.
  - Séparer la dépendance entre les fichiers de données et l'application web.
  - Transférer le code qui formatte les dates des routers vers Pug.
  - Trier les publications en fonction des années ET mois
  - Trier les projets passés en fonction de leur année de completion
  - Cacher les adresses courrielles pour qu'un robot ne puisse pas le détecter
  - Mettre page de candidatures

## Schéma données

- Script JS. Lire fichiers YAML et mettre dans MongoDB.

News
- id: ID
- createdAt: Date
- text: string

Seminars
- id: ID
- title: string
- presentator: {firstname: string, lastname: string}|memberId
- participants: [{memberId: id|{firstname: string, lastname: string}}]
- date: Date
- createdAt: Date
- location: string
- description: string

Members
- id: ID
- lastname: string
- firstname: string
- email: string
- titles: [title: associateprofessor|researchassociate|phdstudent|masterstudent|undergradstudent, current: boolean]
- homepage: string
- image: bson

Publications
- id: ID
- year: string
- month: string
- authors: [{type: INTERNAL|EXTERNAL, info: id|{firstname: string, lastname: string}]
- title: string
- venue: string

Projects
- id: ID
- type: master|phd
- participants: [{memberId: id|{firstname: string, lastname: string}, role: STUDENT|SUPERVISOR|COSUPERVISOR}]
- current: boolean
- startYear: int
- title: string
- description: string
- publications: [publicationId]

## Informations des membres

Les membres qui ont envoyé leur fiche:

  - Jean-Philippe
  - Félix Martel
  - Hadi
  - Erwan Marchand
  - Arthur

## Copyright

Le project LAMA-WeST possède la license GNU General Public License, v3. Une copie de cette license est incluse dans le fichier LICENSE.

Copyright 2019, Konstantinos Lambrou-Latreille
