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
const app = express()

const path = require('path')
const createError = require('http-errors')
const bodyParser = require('body-parser')
const session = require('express-session')
const cookieParser = require('cookie-parser')
const moment = require('moment')
const i18n = require('i18n-express')
const directory = require('serve-index')

const formatter = require('./helpers/formatter')

// const config = require('./config.json')
const MongoClient = require('mongodb').MongoClient
const dotenv = require('dotenv')

dotenv.config({ path: './../.env' })

// Possibilité de spécifier le numéro de port par ligne de commande.
const port = process.env.PORT || 3000

app.set('views', path.join(__dirname, '/views'))
app.engine('pug', require('pug').__express)
app.set('view engine', 'pug')

app.use(express.static(path.join(__dirname, '/public')))

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(session({
  secret: 'log4420',
  resave: true,
  saveUninitialized: true,
  cookie: { maxAge: 60000 }
}))

app.use(i18n({
  translationsPath: path.join(__dirname, 'locales'),
  browserEnable: false,
  defaultLang: 'fr',
  siteLangs: ['fr', 'en'],
  cookieLangName: 'ulang',
  textsVarName: 't'
}))

moment.locale(['fr', 'en'])
app.locals.formatter = formatter

app.use((req, res, next) => {
  moment.locale(req.app.locals.lang)
  next()
})

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE')
  next()
})

// Fichier de définitions des routes de l'applications
app.use(require('./routes'))
app.use('/api', require('./routes/rest'))

app.use((req, res, next) => {
  next(createError(404))
})

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})
console.log(process.env.DB_URL)
MongoClient.connect(process.env.DB_URL, { useNewUrlParser: true }, (err, client) => {
  if (err) {
    throw err
  }
  app.db = client.db(process.env.DB_NAME)
  app.listen(port, function () {
    console.log('Listening on port ' + port)
  })
})

module.exports = app
