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

const { getTranslation } = require('../utils')
const ObjectId = require('mongodb').ObjectId

/**
 * Fonction de rappel pour récupérer les projets
 *
 * @callback projectsCallback
 * @param {Error} err - Objet d'erreur
 * @param {Array} results - Tableaux de projets
 */

/**
 *  Obtenir les projets.
 *
 *  @param db - Base de données Mongo
 *  @param {string} language - Langue courante (p.ex. 'fr', 'en', etc.)
 *  @param {projectsCallback} callback - Fonction de rappel pour obtenir le résultat
 */
const getProjects = db => language => callback => {
  db.collection('projects')
    .find()
    .map(project => {
      const translatedTitle = getTranslation(language, project.title)
      const translatedDescription = getTranslation(language, project.description)
      return {
        ...project,
        title: translatedTitle,
        description: translatedDescription,
        publications: (project.publications === undefined) ? [] : project.publications
      }
    })
    .toArray(callback)
}

/**
 * Fonction de rappel pour récupérer un projet particulier
 *
 * @callback projectCallback
 * @param {Error} err - Objet d'erreur
 * @param {Object} result - Un projet particulier
 */

/**
 *  Obtenir un projet selon un identificatn.
 *
 *  @param db - Base de donnée Mongo
 *  @param {Object} translationObj - Objet qui contient l'ensemble des traductions définies
 *  @param {string} language - Langue courante (p.ex. 'fr', 'en', etc.)
 *  @param {int} id - Identificant unique du projet à trouer
 *  @param {projectCallback} callback - Fonction de rappel pour obtenir le résultat
 */
const getProjectById = db => translationObj => language => id => callback => {
  db.collection('projects').findOne({ _id: id }, (err, project) => {
    if (err) {
      const error = new Error('Erreur sur le serveur')
      error.name = 'INTERNAL_SERVER_ERROR'
      callback(error, null)
    } else if (project === null) {
      const error = new Error(`${translationObj['ERRORS']['PROJECTS']['PROJECT_NOT_FOUND_MSG']}: ${id}`)
      error.name = 'NOT_FOUND'
      callback(error, null)
    } else {
      const translatedTitle = getTranslation(language, project.title)
      const translatedDescription = getTranslation(language, project.description)
      const translatedProject = {
        ...project,
        title: translatedTitle,
        description: translatedDescription,
        publications: (project.publications === undefined) ? [] : project.publications
      }
      callback(null, translatedProject)
    }
  })
}

module.exports = db => {
  return {
    getProjects: getProjects(db),
    getProjectById: getProjectById(db)
  }
}
