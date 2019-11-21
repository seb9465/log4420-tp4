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
const { getTranslation } = require('../utils')

/**
 * Fonction de rappel pour récupérer les séminaires
 *
 * @callback seminarCallback
 * @param {Error} err - Objet d'erreur
 * @param {Array} result - Séminaires
 */

/**
 *  Obtenir l'ensemble des séminaires.
 *
 *  @param db - Base de données Mongo
 *  @param {Object} query - Requête particulière sous le format suivant:
 *    { from: <DATE>, sort: { field: <string>, order: <ASC|DESC> } }
 *  @param {string} language - Langue courante (p.ex. 'fr', 'en', etc.)
 *  @param {seminarCallback} callback - Fonction de rappel pour obtenir le résultat
 */
const getSeminars = db => query => language => callback => {
  const dbQuery = {}
  if (query !== undefined && query.from !== undefined) {
    dbQuery.date = { '$gte': query.from }
  }

  const canSortByField = query !== undefined &&
    query.sort !== undefined &&
    query.sort.field !== undefined &&
    (query.sort.order === 'ASC' || query.sort.order === 'DESC')
  const options = {}
  if (canSortByField) {
    options.sort = [[query.sort.field, query.sort.order]]
  }

  db.collection('seminars')
    .find(dbQuery, options)
    .map(s => {
      const translatedTitle = getTranslation(language, s.title)
      const translatedDescription = getTranslation(language, s.description)
      const newDate = moment(s.date, 'YYYY-MM-DD HH:mm:ss').toDate()
      const newCreatedAtDate = moment(s.createdAt, 'YYYY-MM-DD HH:mm:ss').toDate()
      return {
        ...s,
        title: translatedTitle,
        description: translatedDescription,
        type: 'seminar',
        date: newDate,
        createdAt: newCreatedAtDate
      }
    })
    .toArray(callback)
}

module.exports = db => {
  return {
    getSeminars: getSeminars(db)
  }
}
