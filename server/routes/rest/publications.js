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

const publicationCreationValidation = t => possiblePublication => {
  const err = []

  if (possiblePublication === undefined || possiblePublication === {}) {
    err.push(t['ERRORS']['EMPTY_PUBLICATION_FORM'])
  } else {
    if (possiblePublication.authors === undefined ||
        possiblePublication.authors.length === 0 ||
        possiblePublication.authors.every(a => a.length === 0)) {
      err.push(t['ERRORS']['AUTHOR_EMPTY_FORM'])
    }

    if (possiblePublication.year === undefined || isNaN(parseInt(possiblePublication.year))) {
      err.push(t['ERRORS']['YEAR_NOT_INT_FORM'])
    } else {
      possiblePublication.year = parseInt(possiblePublication.year)
    }

    const possibleMonths = [...Array(12).keys()]
    if (possiblePublication.month === undefined ||
        isNaN(parseInt(possiblePublication.month)) ||
        !possibleMonths.includes(parseInt(possiblePublication.month))) {
      err.push(t['ERRORS']['MONTH_ERROR_FORM'])
    } else {
      possiblePublication.month = parseInt(possiblePublication.month) + 1
    }

    if (possiblePublication.title === undefined || possiblePublication.title.trim().length < 5) {
      err.push(t['ERRORS']['PUB_AT_LEAST_5_CHAR_FORM'])
    }

    if (possiblePublication.venue === undefined || possiblePublication.venue.trim().length < 5) {
      err.push(t['ERRORS']['VENUE_AT_LEAST_5_CHAR_FORM'])
    }
  }

  return err
}

module.exports = servicePublication => {
  const router = express.Router()

  router.get('/', (req, res, next) => {
    const t = req.app.locals.t

    const limit = req.query.limit === undefined || isNaN(req.query.limit) ? 10 : Number(req.query.limit)
    const pageNumber = req.query.page === undefined || isNaN(req.query.limit) ? 1 : Number(req.query.page)
    const sortBy = req.query.sort_by === undefined ? 'date' : req.query.sort_by
    const orderBy = req.query.order_by === undefined ? 'desc' : req.query.order_by

    const sorting = []
    if (sortBy === 'date') {
      sorting.push(['year', orderBy])
      sorting.push(['month', orderBy])
    } else {
      sorting.push([sortBy, orderBy])
    }

    const pagingOptions = { limit, pageNumber, sorting }

    async.parallel([
      servicePublication.getPublications(pagingOptions),
      servicePublication.getNumberOfPublications
    ], (err, [publications, numOfPublications]) => {
      if (err) {
        const errorMsg = t === undefined || t['ERRORS'] === undefined || t['ERRORS']['PUBS_ERROR'] === undefined ? err.message : t['ERRORS']['PUBS_ERROR']
        res.status(500).json({ errors: [ errorMsg ] })
      } else {
        res.json({ count: numOfPublications, publications })
      }
    })
  })

  router.post('/', (req, res, next) => {
    const t = req.app.locals.t

    const errors = publicationCreationValidation(t)(req.body)

    if (errors.length === 0) {
      servicePublication.createPublication(req.body)((err, response) => {
        if (err) {
          const errorMsg = t === undefined || t['ERRORS'] === undefined || t['ERRORS']['PUB_CREATE_ERROR'] === undefined ? err.message : t['ERRORS']['PUB_CREATE_ERROR']
          res.status(500).json({ errors: [ errorMsg ] })
        } else {
          const createdObj = {}
          if (response != undefined && response.insertedId != undefined) {
            createdObj.insertedId = response.insertedId
          }
          res.status(201).json(createdObj)
        }
      })
    } else {
      res.status(400).json({ errors })
    }
  })

  router.delete('/:id', (req, res, next) => {
    const t = req.app.locals.t
    const id = req.params.id
    servicePublication.removePublication(id)((err, publications) => {
      if (err) {
        const errorMsg = t === undefined || t['ERRORS'] === undefined || t['ERRORS']['PUB_DELETE_ERROR'] === undefined ? err.message : t['ERRORS']['PUB_DELETE_ERROR']
        if (err.name === 'NOT_FOUND') {
          res.status(404).json({ errors: [ errorMsg ] })
        } else {
          res.status(500).json({ errors: [ errorMsg ] })
        }
      } else {
        res.send('done')
      }
    })
  })

  return router
}
