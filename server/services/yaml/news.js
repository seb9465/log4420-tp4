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

const yaml = require('js-yaml')
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
 *  @param fs - Système de fichier
 *  @param {string} language - Langue courante (p.ex. 'fr', 'en', etc.)
 *  @param {newsCallback} callback - Fonction de rappel pour obtenir le résultat
 */
const getNews = fs => language => callback => {
  fs.readFile('./data/news.yml', 'utf8', (err, content) => {
    if (err) {
      callback(err, null)
    } else {
      const yamlContentOpt = yaml.safeLoad(content)
      const news = ((yamlContentOpt === null) ? [] : yamlContentOpt)
        .map(s => {
          const translatedText = getTranslation(language, s.text)
          const newCreatedAtDate = moment(s.createdAt, 'YYYY-MM-DD HH:mm:ss').toDate()
          return {
            ...s,
            text: translatedText,
            type: 'news',
            createdAt: newCreatedAtDate
          }
        })
      callback(null, news)
    }
  })
}

module.exports = fs => {
  return {
    getNews: getNews(fs)
  }
}
