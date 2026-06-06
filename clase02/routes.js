const http = require('http')
const dittoData = require('./ditto.json')

const processRequest = (req, res) => {
  const { method, url } = req

  switch (method) {
    case 'GET':
      switch (url) {
        case '/pokemon/ditto':
          res.setHeader('Content-Type', 'application/json')
          return res.end(JSON.stringify(dittoData))
      }
      break
    case 'POST':
      switch (url) {
        case '/pokemon': {
          let body = ''

          req.on('data', (chunk) => {
            body += chunk.toString()
          })

          req.on('end', () => {
            const data = JSON.parse(body)
            console.log('Received data:', data)
            res.writeHead(201, { 'Content-Type': 'application/json' })
            data.timestamp = Date.now()
            res.end(JSON.stringify({ message: 'Pokemon received', pokemon: data }))
          })
        }
      }
      break
    default:
      res.statusCode = 404
      res.end('<h1>Not Found</h1>')
  }
}

const server = http.createServer(processRequest)

server.listen(1234, () => {
  console.log(`Server is listening on port http://localhost:${1234}`)
})
