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

const utils = require('../../services/utils.js')

describe('utils.getTranslation', () => {
  it('should provide translation for field in given language', () => {
    const field = { 'fr': 'Bonjour', 'en': 'Hello' }
    expect(utils.getTranslation('fr', field)).to.equal('Bonjour')
    expect(utils.getTranslation('en', field)).to.equal('Hello')
  })

  it('should return empty string for undefined field', () => {
    expect(utils.getTranslation('fr', undefined)).to.equal('')
  })

  it('should default in fr language if not existing', () => {
    const field = { 'fr': 'Bonjour', 'en': 'Hello' }
    expect(utils.getTranslation('es', field)).to.equal('Bonjour')
    expect(utils.getTranslation(undefined, field)).to.equal('Bonjour')
  })
})
