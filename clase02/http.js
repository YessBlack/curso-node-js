const http = require('node:http')
const fs = require('node:fs')

const desiredPort = process.env.PORT ?? 1234

const processRequest = (req, res) => {
  res.setHeader('Content-Type', 'text/html; charset=utf-8')

  if (req.url === '/') {
    res.statusCode = 200
    res.end('Bienvenido a mi página de inicio')
    return
  }

  if (req.url === '/contact') {
    res.statusCode = 200
    res.end('Contáctame en mi correo: angelica@gmail.com')
    return
  }

  if (req.url === '/image.jpeg') {
    fs.readFile('./image.jpeg', (err, data) => {
      if (err) {
        res.end('<h1>Ocurrió un error al cargar la imagen</h1>')
        return
      }

      res.setHeader('Content-Type', 'image/jpeg')
      res.end(data)
    })

    return
  }

  res.statusCode = 404
  res.end('Página no encontrada')
}

const server = http.createServer(processRequest)

server.listen(desiredPort, () => {
  console.log(`Server is listening on port http://localhost:${desiredPort}`)
})
