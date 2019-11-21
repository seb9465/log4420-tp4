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

module.exports = serviceFeed => {
  const router = express.Router()

  router.get('/', (req, res, next) => {
    const t = req.app.locals.t
    const now = new Date(2019, 09)
    serviceFeed.getFeeds(now)(req.app.locals.lang)((err, feeds) => {
      if (err) {
        const errorMsg = t === undefined || t['ERRORS'] === undefined || t['ERRORS']['FEEDS_ERROR'] === undefined ? err.message : t['ERRORS']['FEEDS_ERROR']
        res.status(500).json({ errors: [ errorMsg ] })
      } else {
        res.json(feeds.filter(f => f.text != ''))
      }
    })
  })

  return router
}
