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

const express = require('express')
const async = require('async')

module.exports = (serviceProjects, servicePublication) => {
  const router = express.Router()

  router.get('/', (req, res, next) => {
    const t = req.app.locals.t
    serviceProjects.getProjects(req.app.locals.lang)((err, projects) => {
      if (err) {
        const errorMsg = t === undefined || t['ERRORS'] === undefined || t['ERRORS']['PROJECTS_ERROR'] === undefined ? err.message : t['ERRORS']['PROJECTS_ERROR']
        res.status(500).json({ errors: [errorMsg] })
      } else {
        res.json(projects)
      }
    })
  })

  router.get('/:id', (req, res, next) => {
    const lang = req.app.locals.lang
    const t = req.app.locals.t
    const id = req.params.id
    async.autoInject({
      getProject: serviceProjects.getProjectById(t)(lang)(id),
      getProjectPublications: ['getProject', (project, callback) => servicePublication.getPublicationsByIds(project.publications)(callback)]
    }, (err, results) => {
      if (err) {
        if (err.name === 'NOT_FOUND') {
          const errorMsg = t === undefined || t['ERRORS'] === undefined || t['ERRORS']['PROJECT_NOT_FOUND'] === undefined ? err.message : t['ERRORS']['PROJECT_NOT_FOUND']
          res.status(404).json({ errors: [errorMsg + id] })
        } else {
          const errorMsg = t === undefined || t['ERRORS'] === undefined || t['ERRORS']['PROJECT_ERROR'] === undefined ? err.message : t['ERRORS']['PROJECT_ERROR']
          res.status(500).json({ errors: [errorMsg] })
        }
      } else {
        res.json({
          'project': results.getProject,
          'publications': results.getProjectPublications
        })
      }
    })
  })

  return router
}
