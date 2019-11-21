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

const teamServiceFactory = require('../../services/mongo/team.js')

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
  describe('Team mongo service', () => {
    it('should load members from mongo db', done => {

      const teamService = teamServiceFactory(db)

      teamService.getTeamMembers((err, members) => {
        expect(err).to.equal(null)

        firstnames = members.map(m => m.firstname)
        expectedFirst3Names = [ 'Patrick', 'Alphonsine', 'Rosamonde' ]
        expectedLast3Names = [ 'Fleurilius', 'Xavier', 'Hildège' ]
        expect(members.length).to.eql(21)
        expect(firstnames.slice(0, 3)).to.eql(expectedFirst3Names)
        expect(firstnames.slice(firstnames.length - 3)).to.eql(expectedLast3Names)
        done()
      })
    })
  })
}
