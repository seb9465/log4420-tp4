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
const router = express.Router()
const request = require('request')

router.get('/', (req, res, next) => {
  const url = 'http://' + req.headers.host + '/api/projects'
  const jar = request.jar()
  jar.setCookie(request.cookie('ulang=' + req.app.locals.lang), url)
  request({ url, jar }, (err, httpResponse, body) => {
    if (err) {
      throw err
    } else if (httpResponse === 404) {
      throw new Error(JSON.parse(body).errors)
    } else {
      res.render('projects', { projects: JSON.parse(body) })
    }
  })
})

router.get('/:id', (req, res, next) => {
  const url = 'http://' + req.headers.host + '/api/projects/' + req.params.id
  const jar = request.jar()
  jar.setCookie(request.cookie('ulang=' + req.app.locals.lang), url)
  request({ url, jar }, (err, httpResponse, body) => {
    if (err) {
      throw err
    } else if (httpResponse === 404) {
      throw new Error(JSON.parse(body).errors)
    } else {
      const reqBody = JSON.parse(body)
      res.render('project', { project: reqBody.project, publications: reqBody.publications })
    }
  })
})

module.exports = router
