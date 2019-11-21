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

// const getProjectsFactory = require('../../routes/rest/projects')

describe('GET /api/projects', () => {

  it('should get projects', done => {

    const serviceProjects = {
      'getProjects': lang => callback => {
        callback(null, [])
      }
    }
    const servicePublications = {
      'getProjectPublications': lang => callback => {
        callback(null, [])
      }
    }

    const projectsRouter = require('../../routes/rest/projects')(serviceProjects, servicePublications)

    const app = express()
    app.use('/api/projects', projectsRouter)

    request(app)
        .get('/api/projects')
        .expect('Content-Type', /json/)
        .expect(200, [])
        .end(function(err, res){
          if (err) throw err;
          done()
        })
  })

  it('should handle errors in fetching data', done => {
    const serviceProjects = {
      'getProjects': lang => callback => {
        callback(new Error('Erreur...'))
      }
    }
    const servicePublications = {
      'getProjectPublications': lang => callback => {
        callback(null, [])
      }
    }
    const projectsRouter = require('../../routes/rest/projects')(serviceProjects, servicePublications)

    const app = express()
    app.use((req, res, next) => {
      req.app = { locals: { t: { 'ERRORS': { 'PROJECTS_ERROR': 'Aie... Erreur...' } } } }
      next()
    })
    app.use('/api/projects', projectsRouter)

    request(app)
      .get('/api/projects')
      .expect('Content-Type', /json/)
      .expect(500, { errors: [ 'Aie... Erreur...' ] }, done)
  })

  it('should send default error message if not defined', done => {
    const serviceProjects = {
      'getProjects': lang => callback => {
        callback(new Error('Erreur...'))
      }
    }
    const projectsRouter = require('../../routes/rest/projects')(serviceProjects)

    const app = express()
    app.use((req, res, next) => {
      req = { app: { locals: { t: {} } } }
      next()
    })
    app.use('/api/projects', projectsRouter)

    request(app)
      .get('/api/projects')
      .expect('Content-Type', /json/)
      .expect(500, { errors: [ 'Erreur...' ] }, done)
  })

  it('should get specific project', done => {

    const serviceProjects = {
      'getProjectById': t => lang => id => callback => {
        callback(null, { 'publications': [] })
      }
    }
    const servicePublications = {
      'getPublicationsByIds': project => callback => {
        callback(null, [])
      }
    }

    const projectsRouter = require('../../routes/rest/projects')(serviceProjects, servicePublications)

    const app = express()
    app.use('/api/projects', projectsRouter)

    request(app)
        .get('/api/projects/10')
        .expect('Content-Type', /json/)
        .expect(200, { 'project': { 'publications': [] }, 'publications': [] }, done)
  })

  it('should send 404 if project not found', done => {
    const serviceProjects = {
      'getProjectById': t => lang => id => callback => {
        const error = new Error('Not found')
        error.name = "NOT_FOUND"
        callback(error)
      }
    }
    const servicePublications = {
      'getProjectPublications': project => callback => {
        callback(null, [])
      }
    }

    const projectsRouter = require('../../routes/rest/projects')(serviceProjects, servicePublications)

    const app = express()
    app.use((req, res, next) => {
      req.app = { locals: { t: { 'ERRORS': { 'PROJECT_NOT_FOUND': 'Projet non trouvé: ' } } } }
      next()
    })
    app.use('/api/projects', projectsRouter)

    request(app)
      .get('/api/projects/10')
      .expect('Content-Type', /json/)
      .expect(404, { errors: ['Projet non trouvé: 10'] }, done)
  })

  it('should handle errors in fetching specific project', done => {

    const serviceProjects = {
      'getProjectById': t => lang => id => callback => {
        callback(new Error('Erreur'))
      }
    }
    const servicePublications = {
      'getProjectPublications': project => callback => {
        callback(null, [])
      }
    }

    const projectsRouter = require('../../routes/rest/projects')(serviceProjects, servicePublications)

    const app = express()
    app.use((req, res, next) => {
      req.app = { locals: { t: { 'ERRORS': { 'PROJECT_ERROR': 'Erreur récupération' } } } }
      next()
    })
    app.use('/api/projects', projectsRouter)

    request(app)
      .get('/api/projects/10')
      .expect('Content-Type', /json/)
      .expect(500, { errors: ['Erreur récupération'] }, done)
  })

  it('should send default error in fetching specific project', done => {

    const serviceProjects = {
      'getProjectById': t => lang => id => callback => {
        callback(new Error('Erreur'))
      }
    }
    const servicePublications = {
      'getProjectPublications': project => callback => {
        callback(null, [])
      }
    }

    const projectsRouter = require('../../routes/rest/projects')(serviceProjects, servicePublications)

    const app = express()
    app.use((req, res, next) => {
      req.app = { locals: { t: {} } }
      next()
    })
    app.use('/api/projects', projectsRouter)

    request(app)
        .get('/api/projects/10')
        .expect('Content-Type', /json/)
        .expect(500, { errors: ['Erreur'] }, done)
  })
})

