const { readdir } = require('fs/promises');
const { stat } = require('fs');

const path = require('path');
async function getFiles() {
    try {
        const files = await readdir(path.join(__dirname, 'secret-folder'));
        for (const file of files) {
            stat(path.join(__dirname, 'secret-folder', file), (err, stats) => {
                if (!stats.isDirectory()) {
                    console.log(path.parse(file).name + ' - ' + path.extname(file).slice(1) + ' - ' + stats.size + ' byte');
                }
            });
        }
    } catch (err) {
        console.error(err);
    }
}
getFiles();
