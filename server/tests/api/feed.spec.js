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

const mocha = require('mocha')
const chai = require('chai')
const sinon = require('sinon')
const request = require('supertest')
const express = require('express')

const describe = mocha.describe
const it = mocha.it
const expect = chai.expect

describe('GET /api/feed', () => {

  it('should get feeds', done => {

    const serviceFeeds = {
      'getFeeds': date => lang => callback => {
        callback(null, [])
      }
    }

    const feedRouter = require('../../routes/rest/feed')(serviceFeeds)

    const app = express()
    app.use('/api/feed', feedRouter)

    request(app)
        .get('/api/feed')
        .expect('Content-Type', /json/)
        .expect(200, [], done)
  })

  it('should handle errors in fetching data', done => {
    const serviceFeeds = {
      'getFeeds': date => lang => callback => {
        callback(new Error('Erreur...'))
      }
    }

    const feedRouter = require('../../routes/rest/feed')(serviceFeeds)

    const app = express()
    app.use((req, res, next) => {
      req.app = { locals: { t: { 'ERRORS': { 'FEEDS_ERROR': 'Aie... Erreur...' } } } }
      next()
    })
    app.use('/api/feed', feedRouter)

    request(app)
      .get('/api/feed')
      .expect('Content-Type', /json/)
      .expect(500, { errors: [ 'Aie... Erreur...' ] }, done)
  })

  it('should send default error message if not defined', done => {
    const serviceFeeds = {
      'getFeeds': date => lang => callback => {
        callback(new Error('Erreur...'))
      }
    }
    const feedRouter = require('../../routes/rest/feed')(serviceFeeds)

    const app = express()
    app.use((req, res, next) => {
      req = { app: { locals: { t: {} } } }
      next()
    })
    app.use('/api/feed', feedRouter)

    request(app)
      .get('/api/feed')
      .expect('Content-Type', /json/)
      .expect(500, { errors: [ 'Erreur...' ] }, done)
  })
})
