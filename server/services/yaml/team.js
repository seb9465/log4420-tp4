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

const yaml = require('js-yaml')

/**
 * Fonction de rappel pour récupérer les membres du laboratoire.
 *
 * @callback teamCallback
 * @param {Error} err - Objet d'erreur
 * @param {Array} results - Tableau de membres
 */

const getTeamMembers = fs => callback => {
  fs.readFile('./data/team.yml', 'utf8', (err, content) => {
    if (err) {
      callback(err, null)
    } else {
      const yamlContentOpt = yaml.safeLoad(content)
      const team = ((yamlContentOpt === null) ? [] : yamlContentOpt)
        .sort((m1, m2) => {
          if (m1.lastname === m2.lastname) {
            return (m1.firstname < m2.firstname) ? -1 : (m1.firstname > m2.firstname) ? 1 : 0
          } else {
            return (m1.lastname < m2.lastname) ? -1 : 1
          }
        })
      callback(null, team)
    }
  })
}

module.exports = fs => {
  return {
    getTeamMembers: getTeamMembers(fs)
  }
}
