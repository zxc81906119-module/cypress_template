import { defineConfig } from 'cypress'
import * as mysql from 'mysql';

// the connection strings for different databases could
// come from the Cypress configuration or from environment variables
const connections = {
  stagingA: {
    host: 'localhost',
    user: 'newuser',
    password: 'newuser',
    database: 'db1',
  },
}

// querying the database from Node
function queryDB(connectionInfo, query) {

  const connection = mysql.createConnection(connectionInfo)

  connection.connect()

  return new Promise((resolve, reject) => {
    connection.query(query, (error, results) => {
      if (error) {
        return reject(error)
      }

      connection.end()

      return resolve(results)
    })
  })
}




//https://docs.cypress.io/guides/references/configuration
export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    setupNodeEvents(on, config) {
      on('task', {
        // destructure the argument into the individual fields
        queryDatabase({ dbName, query }) {
          const connectionInfo = connections[dbName]

          if (!connectionInfo) {
            throw new Error(`Do not have DB connection under name ${dbName}`)
          }

          return queryDB(connectionInfo, query)
        },
      })
    },
  },
})
