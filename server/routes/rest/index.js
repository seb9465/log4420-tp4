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

const express = require('express')
const router = express.Router()

module.exports = (req, res, next) => {
  console.log(`[APP] ${req.method} ${req.url}`);

  const factory = require('../../services/mongo/factory')(req.app.db)
  // const factory = require('../../services/yaml/factory')(require('fs'))

  router.use('/feed', require('./feed')(factory.feed))
  router.use('/members', require('./members')(factory.members))
  router.use('/projects', require('./projects')(factory.projects, factory.publications))
  router.use('/projects', require('./projects')(factory.projects, factory.publications))
  router.use('/publications', require('./publications')(factory.publications))

  return router(req, res, next)
}
