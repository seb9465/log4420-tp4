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

/**
 *  Obtenir la traduction désirée d'un champ.
 *
 *  On suppose que le champ contient un ensemble de clés qui correspondent à
 *  la langue avec une valeur traduite.
 *
 *  P.ex. { fr: "Bonjour", en: "Hello" }
 *
 *  Si la langue choisit n'est pas disponible, on choisit par défaut la traduction francophone.
 *
 *  @param {string} language - Langue courante (p.ex. 'fr', 'en', etc.)
 *  @param {Object} field - Champ à récupérer la traduction
 *  @return Valeur traduite du champ
 */
exports.getTranslation = (language, field) => {
  if (field === undefined) {
    return ''
  } else if (language in field) {
    return field[language]
  } else {
    return field['fr']
  }
}
