const fs = require('node:fs/promises');
const path = require('node:path');

const ls = async (folder) => {
  let files;

  try {
    files = await fs.readdir(folder);
  } catch (err) {
    console.error('Error al leer el directorio:', err);
    process.exit(1);
  }

  const filesPromises = files.map(async (file) => {
    const filePath = path.join(folder, file);
    let stats;

    try {
      stats = await fs.stat(filePath);
    } catch {
      console.error('No se pudo leer el archivo:', filePath);
      process.exit(1);
    }

    const isDirectory = stats.isDirectory();
    const fileType = isDirectory ? 'd' : '-';
    const fileSize = stats.size.toString();
    const fileModified = stats.mtime.toLocaleString();
    
    return `${fileType} ${file.padEnd(20)} ${fileSize.padStart(10)} ${fileModified}`;
  });

  const filesInfo = await Promise.all(filesPromises);
  
  filesInfo.forEach(info => console.log(info));
}

const folder = process.argv[2] || '.'
ls(folder)