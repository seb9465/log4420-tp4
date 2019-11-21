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
 * Fonction de rappel pour récupérer les nouvelles
 *
 * @callback newsCallback
 * @param {Error} err - Objet d'erreur
 * @param {Array} results - Tableaux de nouvelles
 */

/**
 *  Obtenir les nouvelles.
 *
 *  @param db - Base de données Mongo
 *  @param {string} language - Langue courante (p.ex. 'fr', 'en', etc.)
 *  @param {newsCallback} callback - Fonction de rappel pour obtenir le résultat
 */
const getNews = db => language => callback => {
  db.collection('news')
    .find()
    .map(news => {
      const translatedText = getTranslation(language, news.text)
      const newCreatedAtDate = moment(news.createdAt, 'YYYY-MM-DD HH:mm:ss').toDate()
      return {
        ...news,
        text: translatedText,
        type: 'news',
        createdAt: newCreatedAtDate
      }
    })
    .toArray(callback)
}

module.exports = db => {
  return {
    getNews: getNews(db)
  }
}
