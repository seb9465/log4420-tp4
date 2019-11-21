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
// const assert = chai.assert
const expect = chai.expect

const teamServiceFactory = require('../../services/yaml/team.js')

const teamFilepath = './data/team.yml'

const fsFactory = filepath => yamlContent => {
  return {
    readFile: (path, enc, callback) => {
      if (path === filepath && enc === 'utf8') {
        callback(null, yamlContent)
      } else {
        callback(new Error('File not found'), null)
      }
    }
  }
}

describe('Team service', () => {
  it('should load members from yaml file', done => {
    const yamlContent = `---
- lastname: Lambrou-Latreille
  firstname: Konstantinos
`
    const fs = fsFactory(teamFilepath)(yamlContent)

    const teamService = teamServiceFactory(fs)

    teamService.getTeamMembers((err, members) => {
      expect(err).to.equal(null)

      const expectedMembers = [{ lastname: 'Lambrou-Latreille', firstname: 'Konstantinos' }]
      expect(members).to.eql(expectedMembers)
      done()
    })
  })

  it('should send error if file does not exist', done => {
    const yamlContent = `---
- lastname: Lambrou-Latreille
  firstname: Konstantinos
`
    const fs = fsFactory('unknown path')(yamlContent)

    const teamService = teamServiceFactory(fs)

    teamService.getTeamMembers((err, members) => {
      expect(err).to.not.equal(null)
      expect(members).to.equal(null)
      done()
    })
  })

  it('should send empty array if file is empty', done => {
    const yamlContent = `---
`
    const fs = fsFactory('./data/team.yml')(yamlContent)

    const teamService = teamServiceFactory(fs)

    teamService.getTeamMembers((err, members) => {
      expect(err).to.equal(null)
      expect(members).to.eql([])
      done()
    })
  })

  it('should sort members by lastname if they are not equal', done => {
    const yamlContent = `---
- lastname: Gagnon
  firstname: Michel
- lastname: Leblanc
  firstname: Marc
- lastname: Leblanc
  firstname: Marc
- lastname: Jacques
  firstname: Alex
`
    const fs = fsFactory(teamFilepath)(yamlContent)
    const teamService = teamServiceFactory(fs)

    teamService.getTeamMembers((err, members) => {
      expect(err).to.equal(null)

      const expectedMembers = [
        { lastname: 'Gagnon', firstname: 'Michel' },
        { lastname: 'Jacques', firstname: 'Alex' },
        { lastname: 'Leblanc', firstname: 'Marc' },
        { lastname: 'Leblanc', firstname: 'Marc' }
      ]
      expect(members).to.eql(expectedMembers)
      done()
    })
  })

  it('should sort members by firstname if lastname is equal', done => {
    const yamlContent = `---
- lastname: Gagnon
  firstname: Paul
- lastname: Gagnon
  firstname: Marc
- lastname: Gagnon
  firstname: Marc
- lastname: Gagnon
  firstname: Michel
`
    const fs = fsFactory(teamFilepath)(yamlContent)
    const teamService = teamServiceFactory(fs)

    teamService.getTeamMembers((err, members) => {
      expect(err).to.equal(null)

      const expectedMembers = [
        { lastname: 'Gagnon', firstname: 'Marc' },
        { lastname: 'Gagnon', firstname: 'Marc' },
        { lastname: 'Gagnon', firstname: 'Michel' },
        { lastname: 'Gagnon', firstname: 'Paul' }
      ]
      expect(members).to.eql(expectedMembers)
      done()
    })
  })
})
