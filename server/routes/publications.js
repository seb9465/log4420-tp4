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
const moment = require('moment')
const request = require('request')

const publicationRouter = (req, res, next) => {
  const pubFormErrors = req.session === undefined || req.session.publicationErrors === undefined ? [] : req.session.publicationErrors

  const limit = req.query.limit === undefined || isNaN(req.query.limit) ? 10 : Number(req.query.limit)
  const pageNumber = req.query.page === undefined || isNaN(req.query.limit) ? 1 : Number(req.query.page)
  const sortBy = req.query.sort_by === undefined ? 'date' : req.query.sort_by
  const orderBy = req.query.order_by === undefined ? 'desc' : req.query.order_by

  const pagingOptions = { limit, pageNumber, sortBy, orderBy }

  const url = 'http://' + req.headers.host + '/api' + req.originalUrl
  const jar = request.jar()
  jar.setCookie(request.cookie('ulang=' + req.app.locals.lang), url)
  request({ url, jar }, (err, httpResponse, body) => {
    if (err) {
      throw err
    } else {
      const publicationsRes = JSON.parse(body)
      pagingOptions.sortBy = sortBy
      pagingOptions.orderBy = orderBy
      res.render('publication', {
        publications: publicationsRes.publications,
        pubFormErrors,
        pagingOptions,
        numberOfPages: getNumberOfPages(publicationsRes.count, pagingOptions.limit),
        monthNames: moment.months()
      })
    }
  })
}

const publicationCreationRouter = (req, res, next) => {
  const t = req.app.locals.t

  const url = 'http://' + req.headers.host + '/api' + req.originalUrl
  const jar = request.jar()
  jar.setCookie(request.cookie('ulang=' + req.app.locals.lang), url)
  request.post({
    url,
    'body': req.body,
    'json': true,
    jar
  }, (err, httpResponse, body) => {
    const errors = []

    if (err) {
      err.push(t['ERRORS']['SERVICE_CONNECTION'])
    } else if (httpResponse.statusCode === 400) {
      body.errors.forEach(e => errors.push(e))
    }

    req.session.publicationErrors = errors

    const fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
    const url = new URL(fullUrl)
    const search_params = new URLSearchParams(url.search)
    search_params.set('page', 1)
    url.search = search_params

    res.redirect(url)
  })
}

router.get('/', publicationRouter)
router.post('/', publicationCreationRouter, publicationRouter)

function getNumberOfPages (size, limit) {
  if (size && limit) {
    return Math.ceil(size / limit)
  } else {
    return 0
  }
}

module.exports = router
