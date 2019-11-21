// This file is part of LAMAWeST
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

const feedsServiceFactory = require('../../services/feed.js')

describe('Feeds service', () => {
  describe('getFeeds', () => {
    it('should send error if one of services send error', done => {
      const serviceNews = {
        getNews: language => callback => callback(new Error(), null)
      }
      const serviceSeminars = {
        getSeminars: query => language => callback => callback(null, [])
      }

      const feedsService = feedsServiceFactory(serviceNews, serviceSeminars)

      const fromDate = new Date()
      feedsService.getFeeds(fromDate)('fr')((err, feeds) => {
        expect(err).to.not.equal(null)
        expect(feeds).to.equal(null)
        done()
      })
    })

    it('should combination of news and seminars services sorted by creation date', done => {
      const news = [
        { id: 1, createdAt: new Date(2012, 1, 1) }
      ]
      const serviceNews = {
        getNews: language => callback => callback(null, news)
      }

      const seminars = [
        { id: 2, createdAt: new Date(2013, 1, 1) }
      ]
      const serviceSeminars = {
        getSeminars: query => language => callback => callback(null, seminars)
      }

      const feedsService = feedsServiceFactory(serviceNews, serviceSeminars)

      const fromDate = new Date(2011, 11, 1)
      feedsService.getFeeds(fromDate)('fr')((err, feeds) => {
        const expectedFeeds = [
          { id: 2, createdAt: new Date(2013, 1, 1) },
          { id: 1, createdAt: new Date(2012, 1, 1) }
        ]
        expect(err).to.equal(null)
        expect(feeds).to.eql(expectedFeeds)
        done()
      })
    })
  })
})
