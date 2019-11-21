// This file is part of LOG4420
// Copyright (C) 2019  Konstantinos Lambrou-Latreille

// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// any later version.

// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.

// You should have received a copy of the GNU General Public License
// along with this program.  If not, see <https://www.gnu.org/licenses/>.

const moment = require('moment')
const mongodb = require('mongodb')

/**
 * Fonction de rappel pour récupérer le nombre total de publications
 *
 * @callback numPublicationsCallback
 * @param {Error} err - Objet d'erreur
 * @param {Number} size - Nombre total de publications
 */

/**
 *  Obtenir le nombre total de publications
 *
 *  @param db - Base de données Mongo
 *  @param {numPublicationsCallback} callback - Fonction de rappel pour obtenir le résultat
 */
const getNumberOfPublications = db => callback => {
  db.collection('publications').countDocuments(callback)
}

/**
 * Fonction de rappel pour récupérer les publications.
 *
 * @callback publicationsCallback
 * @param {Error} err - Objet d'erreur
 * @param {Array} results - Tableau de publications
 */

/**
 *  Obtenir toutes les publications.
 *
 *  @param db - Base de données Mongo
 *  @param pagingOpts - Base de données Mongo
 *  @param {Object} pagingOpts - Options de pagination au format suivant:
 *    {
 *      pageNumber: <Number>,
 *      limit: <Number>,
 *      sort: [ [ <FIELDNAME>, <asc|desc> ], [ <FIELDNAME>, <asc|desc> ], ...]
 *    }
 *  @param {publicationsCallback} callback - Fonction de rappel pour obtenir le résultat
 */
const getPublications = db => pagingOpts => callback => {
  db.collection('publications')
    .find()
    .map(publication => {
      return {
        ...publication,
        month: (publication.month === undefined) ? undefined : moment().month(publication.month - 1).format('MMMM')
      }
    })
    .sort(pagingOpts.sorting)
    .skip((pagingOpts.pageNumber - 1) * pagingOpts.limit)
    .limit(pagingOpts.limit)
    .toArray(callback)
}

/**
 * Fonction de rappel pour obtenir la publication créée.
 *
 * @callback createdPublicationCallback
 * @param {Error} err - Objet d'erreur
 * @param {Object} result - Publication créée
 */

/**
 *  Création d'une publication dans la BD.
 *
 *  @param db - Base de données Mongo
 *  @param publication - Publication à ajouter dans la BD
 *  @param {createdPublicationCallback} callback - Fonction de rappel pour obtenir la publication créée
 */
const createPublication = db => publication => callback => {
  db.collection('publications').insertOne(publication, callback)
}

/**
 *  Supprimer une publication avec un ID spécifique
 *
 *  @param db - Base de données Mongo
 *  @param id - Identificant à supprimer de la BD
 *  @param callback - Fonction de rappel qui valide la suppression
 */
const removePublication = db => id => callback => {
  db.collection('publications').deleteOne({ _id: mongodb.ObjectId(id) }, callback)
}

/**
 * Fonction de rappel pour récupérer les publications d'un projet.
 *
 * @callback projectPublicationsCallback
 * @param {Error} err - Objet d'erreur
 * @param {Array} result - Publications d'un projet
 */

/**
 *  Obtenir l'ensemble des publications d'un projet
 *
 *  @param db - Base de données Mongo
 *  @param {Array} pubIds - Publication ids
 *  @param {projectPublicationsCallback} callback - Fonction de rappel pour obtenir le résultat
 */
const getPublicationsByIds = db => pubIds => callback => {
  db.collection('publications')
    .find({ '_id': { '$in': pubIds } })
    .sort([ [ 'year', 'desc' ], [ 'month', 'desc' ]] )
    .map(publication => {
      return {
        ...publication,
        month: (publication.month === undefined) ? undefined : moment().month(publication.month - 1).format('MMMM')
      }
    })
    .toArray(callback)
}

module.exports = db => {
  return {
    getPublications: getPublications(db),
    createPublication: createPublication(db),
    removePublication: removePublication(db),
    getPublicationsByIds: getPublicationsByIds(db),
    getNumberOfPublications: getNumberOfPublications(db)
  }
}
