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

const moment = require('moment')

const changeLang = (req, res, next) => {
  const lang = req.query.clang
  if (lang !== undefined) {
    moment.locale(lang)
  }

  next()
}

const getFeedsMiddleware = (req, res, next) => {
  const t = req.app.locals.t
  const url = 'http://' + req.headers.host + '/api/feed'
  const jar = request.jar()
  jar.setCookie(request.cookie('ulang=' + req.app.locals.lang), url)
  request({ url, jar }, (err, httpResponse, body) => {
    if (err) {
      throw err
    } else if (httpResponse === 500) {
      throw new Error(t['ERRORS']['FEEDS_ERROR'])
    } else {
      req.feeds = JSON.parse(body)
      next()
    }
  })
}

router.get('/', changeLang, getFeedsMiddleware, (req, res, next) => {
  res.render('index', { feeds: req.feeds })
})

module.exports = router
