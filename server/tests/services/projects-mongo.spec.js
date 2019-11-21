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

const describe = mocha.describe
const it = mocha.it
const expect = chai.expect

const projectServiceFactory = require('../../services/mongo/projects.js')

const config = require('../../config.json')
const MongoClient = require('mongodb').MongoClient
MongoClient.connect(config.dbUrl, { useNewUrlParser: true }, (err, client) => {
  if (err) {
    throw err
  }
  db = client.db(config.dbName)
  executeTestsOnDb(db)
})

function executeTestsOnDb(db) {
  describe('Projects mongo service', () => {
    it('should load projects from mongo db in french', done => {
      const projectsService = projectServiceFactory(db)

      projectsService.getProjects('fr')((err, projects) => {
        expect(err).to.equal(null)

        projectTitles = projects.map(p => p.title)
        expect(projectTitles.length).to.eql(17)
        expect(projectTitles).to.contain('Apprentissage machine pour la classification de réponses à des questions ouvertes')
        expect(projectTitles).to.contain('Système de questions-réponses pour le Web Sémantique')
        expect(projectTitles).to.contain('Système d\'aide à la décision pour le réseau de distribution')

        done()
      })
    })

    it ('should load projects from mongo db in english', done => {
      const projectsService = projectServiceFactory(db)

      projectsService.getProjects('en')((err, projects) => {
        expect(err).to.equal(null)

        projectTitles = projects.map(p => p.title)
        expect(projectTitles.length).to.eql(17)
        expect(projectTitles).to.contain('Machine learning for the classification of short answers')
        expect(projectTitles).to.contain('Question answering system for the Semantic Web')
        expect(projectTitles).to.contain('Decision-support support for electrical distribution network')

        done()
      })
    })

    it('should get specific project from mongo db by id in french', done => {
      const projectsService = projectServiceFactory(db)

      projectsService.getProjects('fr')((err, projects) => {
        expect(err).to.equal(null)
        expect(projectTitles.length).to.eql(17)
        const project = projects[0]

        projectsService.getProjectById({})('fr')(project._id)((err, foundProject) => {
          expect(project).to.eql(foundProject)
          done()
        })
      })
    })

    it('should get specific project from mongo db by id in english', done => {
      const projectsService = projectServiceFactory(db)

      projectsService.getProjects('en')((err, projects) => {
        expect(err).to.equal(null)
        expect(projectTitles.length).to.eql(17)
        const project = projects[0]

        projectsService.getProjectById({})('en')(project._id)((err, foundProject) => {
          expect(project).to.eql(foundProject)
          done()
        })
      })
    })

    it('should return error if project is not found', done => {
      const projectsService = projectServiceFactory(db)

      const t = { 'ERRORS': { 'PROJECTS': { 'PROJECT_NOT_FOUND_MSG': 'Projet non trouvé' } } }
      projectsService.getProjectById(t)('en')(0)((err, foundProject) => {
        expect(foundProject).to.eql(null)
        expect(err.name).to.eql('NOT_FOUND')
        done()
      })
    })
  })
}

