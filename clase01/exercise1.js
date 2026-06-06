// ls
const fs = require('node:fs')

fs.readdir('.', (err, files) => {
  if (err) {
    console.error('Error al leer el directorio:', err)
    return
  }

  console.log('Archivos en el directorio actual:')
  files.forEach(file => {
    console.log(file)
  })
})