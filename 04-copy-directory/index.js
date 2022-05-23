const fs = require('fs');
const path = require('path');
const { readdir } = require('fs/promises');
const { unlink } = require('fs/promises');
const newPath = path.join(__dirname, 'files-copy');
const oldPath = path.join(__dirname, 'files');

async function readDir(path) {
    const files = await readdir(path);

    return files;
}
async function deleteFiles(files) {
    for (const file of files) {
        await unlink(path.join(newPath, file));
    }
}
function copyFiles() {
    readDir(oldPath).then((files) => {
        for (const file of files) {
            fs.copyFile(path.join(oldPath, file), path.join(newPath, file), errorCallback);
        }
    });
}

function errorCallback(error) {
    if (error) {
        throw error;
    }
}
const copyDir = () => {
    fs.stat(newPath, (error, stats) => {
        if (!error) {
            readDir(newPath)
                .then(deleteFiles)

                .then(copyFiles);
        } else if (error.code == 'ENOENT') {
            fs.mkdir(newPath, (error) => {
                if (error) throw error;
                else copyFiles();
            });
        } else throw error;
    });
};
copyDir();
