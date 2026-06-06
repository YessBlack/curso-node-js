const http = require('node:http');
const findAvailablePort = require('./free-port');

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.write('¡Hola, mundo! Este es un servidor HTTP básico.');
  res.end();
});

findAvailablePort(3000).then(port => {
  server.listen(port, () => {
    console.log(`Servidor HTTP escuchando en el puerto ${port}`);
  });
})