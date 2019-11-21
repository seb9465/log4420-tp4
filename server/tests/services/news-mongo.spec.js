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
// const assert = chai.assert
const expect = chai.expect

const newsServiceFactory = require('../../services/mongo/news.js')

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
  describe('News mongo service', () => {
    it('should load news from mongo db in french', done => {

      const newsService = newsServiceFactory(db)

      newsService.getNews('fr')((err, news) => {
        expect(err).to.equal(null)

        expect(news.length).to.eql(5)
        const aNews = news[0]
        expect(Object.keys(aNews)).to.contain('_id')
        expect(Object.keys(aNews)).to.contain('text')
        expect(Object.keys(aNews)).to.contain('type')
        expect(Object.keys(aNews)).to.contain('createdAt')
        expect(Object.keys(aNews).length).to.eql(4)

        expect(aNews.text).to.contain('Le travail de <a href="">Marc Jacques</a> est disponible')

        done()
      })
    })

    it('should load news from mongo db in english', done => {

      const newsService = newsServiceFactory(db)

      newsService.getNews('en')((err, news) => {
        expect(err).to.equal(null)

        expect(news.length).to.eql(5)
        const aNews = news[0]
        expect(Object.keys(aNews)).to.contain('_id')
        expect(Object.keys(aNews)).to.contain('text')
        expect(Object.keys(aNews)).to.contain('type')
        expect(Object.keys(aNews)).to.contain('createdAt')
        expect(Object.keys(aNews).length).to.eql(4)

        expect(aNews.text).to.contain('<a href="">Marc\'s</a> paper is available')

        done()
      })
    })
  })
}
