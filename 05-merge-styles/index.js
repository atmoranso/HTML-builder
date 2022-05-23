const fs = require('fs');
const path = require('path');
const { readdir } = require('fs/promises');
const { readFile, appendFile } = require('fs/promises');

async function readDir(path) {
    const files = await readdir(path);

    return files;
}
async function addStyle(files) {
    for (const file of files) {
        if (path.extname(file) == '.css') {
            const data = await readFile(path.join(__dirname, 'styles', file));
            await appendFile(path.join(__dirname, 'project-dist', 'bundle.css'), data);
        }
    }
}
fs.open(path.join(__dirname, 'project-dist', 'bundle.css'), 'w+', (err) => {
    if (err) throw err;
});
readDir(path.join(__dirname, 'styles')).then(addStyle);
