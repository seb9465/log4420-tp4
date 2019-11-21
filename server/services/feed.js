// This file is part of LAMAWeST
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

const async = require('async')

/**
 * Fonction de rappel pour récupérer le flux de nouvelles
 *
 * @callback feedCallback
 * @param {Error} err - Objet d'erreur
 * @param {Array} results - Tableaux de flux de nouvelles
 */

/**
 *  Obtenir un flux de nouvelles qui sont une combinaison des nouvelles
 *  courantes et des nouveaux séminaires.
 *
 *  @param serviceNews - Service pour manipuler les nouvelles
 *  @param serviceSeminar - Service pour maniupler les séminaires
 *  @param {string} language - Langue courante (p.ex. 'fr', 'en', etc.)
 *  @param {feedCallback} callback - Fonction de rappel pour obtenir le résultat
 */
const getFeeds = serviceNews => serviceSeminar => fromDate => language => callback => {
  const seminarQuery = { from: fromDate, sort: { 'field': 'createdAt', 'order': 'DESC' } }

  async.parallel([serviceNews.getNews(language), serviceSeminar.getSeminars(seminarQuery)(language)], (err, results) => {
    if (err) {
      callback(err, null)
    } else {
      getFeedsSortedAtCreationDate(results, callback)
    }
  })
}

/**
 *  Combine le tableau de nouvelles et le tableau de séminaires et trie le
 *  flux de nouvelles par date de création.
 *
 *  @param {Array} results - Tableau qui contient le tableau de nouvelles et
 *  le tableau de séminaires
 *  @param {feedCallback} callback - Fonction de rappel pour obtenir le résultat
 */
const getFeedsSortedAtCreationDate = (results, callback) => {
  const feeds = results
    .reduce((collection1, collection2) => collection1.concat(collection2), [])
    .sort((f1, f2) => f2.createdAt - f1.createdAt)
  callback(null, feeds)
}

module.exports = (serviceNews, serviceSeminar) => {
  return {
    getFeeds: getFeeds(serviceNews)(serviceSeminar)
  }
}
