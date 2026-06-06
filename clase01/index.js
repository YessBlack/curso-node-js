const os = require('node:os')

console.log('Información del sistema operativo:')
console.log('----------------------------------')

console.log(`Plataforma: ${os.platform()}`)
console.log(`Arquitectura: ${os.arch()}`)
console.log(`Número de CPU: ${os.cpus().map(cpu => cpu.model).length}`)
console.log(`Memoria total: ${(os.totalmem() / (1024 ** 3)).toFixed(2)} GB`)
console.log(`Memoria libre: ${(os.freemem() / (1024 ** 3)).toFixed(2)} GB`)
console.log(`Tiempo de actividad: ${(os.uptime() / 3600).toFixed(2)} horas`)

