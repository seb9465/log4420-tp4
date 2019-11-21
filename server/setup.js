const MongoClient = require('mongodb').MongoClient
const yaml = require('js-yaml')
const fs = require('fs')
const config = require('./config.json')

const readYamlData = path => callback => {
  fs.readFile(path, 'utf8', (err, content) => {
    if (err) {
      callback(err, [])
    } else {
      const yamlContentOpt = yaml.safeLoad(content)
      const news = ((yamlContentOpt === null) ? [] : yamlContentOpt)
      callback(null, news)
    }
  })
}

const readYamlDataPromise = path => {
  return new Promise((resolve, reject) => {
    fs.readFile(path, 'utf8', (err, content) => {
      if (err) {
        reject(err)
      } else {
        const yamlContentOpt = yaml.safeLoad(content)
        const news = ((yamlContentOpt === null) ? [] : yamlContentOpt)
        resolve(news)
      }
    })
  })
}

(async () => {
  const client = await MongoClient.connect(config.dbUrl, { useNewUrlParser: true })
  console.log('Connected successfully to server')
  const db = client.db(config.dbName)

  await db.dropDatabase()

  const news = await readYamlDataPromise('./data/news.yml')
    .then(news => {
      return news.map(n => {
        return {
          ...n,
          createdAt: new Date(n.createdAt)
        }
      })
    })
  const newsCollection = await db.createCollection('news')
  await newsCollection.insertMany(news)

  const seminars = await readYamlDataPromise('./data/seminars.yml')
    .then(seminars => {
      return seminars.map(seminar => {
        return {
          ...seminar,
          createdAt: new Date(seminar.createdAt),
          date: new Date(seminar.date)
        }
      })
    })
  const seminarsCollection = await db.createCollection('seminars')
  await seminarsCollection.insertMany(seminars)

  const members = await readYamlDataPromise('./data/team.yml')
  const membersCollection = await db.createCollection('members')
  await membersCollection.insertMany(members)

  const publications = await readYamlDataPromise('./data/publications.yml')
  const pubCollection = await db.createCollection('publications')
  const insertedPublications = await pubCollection.insertMany(publications)

  const projects = await readYamlDataPromise('./data/projects.yml')
  const projectsToInsert = projects
    .map(project => {
      delete project.id

      if (project.publications === undefined) {
        return project
      }
      const projectPublications = insertedPublications.ops
        .filter(pub => project.publications.includes(pub.key))
        .map(pub => pub._id)
      return {
        ...project,
        publications: projectPublications
      }
    })

  const projectCollection = await db.createCollection('projects')
  await pubCollection.updateMany({}, { $unset: { key: '' } })
  await projectCollection.insertMany(projectsToInsert)

  client.close()
})()

// const initDbCallback = function () {
//   MongoClient.connect(config.dbUrl, { useNewUrlParser: true }, (err, client) => {
//     if (err) throw err

//     console.log('Connected successfully to server')

//     const db = client.db(config.dbName)

//     db.dropDatabase((err) => {
//       if (err) throw err

//       readYamlData('./data/news.yml')((err, news) => {
//         if (err) throw err

//         news.forEach(n => {
//           n.createdAt = new Date(n.createdAt)
//         })

//         db.createCollection('news', (err, newsCollection) => {
//           if (err) throw err

//           newsCollection.insertMany(news)
//         })
//       })

//       readYamlData('./data/seminars.yml')((err, seminars) => {
//         if (err) throw err
//         seminars.forEach(s => {
//           s.createdAt = new Date(s.createdAt)
//           s.date = new Date(s.date)
//         })

//         db.createCollection('seminars', (err, seminarsCollection) => {
//           if (err) throw err

//           seminarsCollection.insertMany(seminars)
//         })
//       })

//       readYamlData('./data/team.yml')((err, members) => {
//         if (err) throw err

//         db.createCollection('members', (err, membersCollection) => {
//           if (err) throw err

//           membersCollection.insertMany(members, (err, insertedMembers) => {
//             if (err) throw err
//           })
//         })
//       })

//       readYamlData('./data/publications.yml')((err, publications) => {
//         if (err) throw err

//         readYamlData('./data/projects.yml')((err, projects) => {
//           if (err) throw err

//           db.createCollection('publications', (err, pubCollection) => {
//             if (err) throw err

//             pubCollection.insertMany(publications, (err, insertedPublications) => {
//               if (err) throw err

//               db.createCollection('projects', (err, projectCollection) => {
//                 if (err) throw err

//                 const projectsToInsert = projects
//                   .map(project => {
//                     delete project.id

//                     if (project.publications === undefined) {
//                       return project
//                     }
//                     const projectPublications = insertedPublications.ops
//                       .filter(pub => project.publications.includes(pub.key))
//                       .map(pub => pub._id)
//                     return {
//                       ...project,
//                       publications: projectPublications
//                     }
//                   })

//                 pubCollection.updateMany({}, { $unset: { key: '' } })

//                 projectCollection.insertMany(projectsToInsert, (err, res) => {
//                   if (err) throw err
//                   client.close()
//                 })
//               })
//             })
//           })
//         })
//       })
//     })
//   })
// }
