const fs = require('fs');
const path = require('path');
const { readdir } = require('fs/promises');
const { readFile, appendFile, open, stat, mkdir, unlink } = require('fs/promises');
let template;
let newHtml;

async function readTemplate() {
    const template = await readFile(path.join(__dirname, 'template.html'));

    return template.toString();
}
function errorCallback(error) {
    if (error) {
        throw error;
    }
}
async function readDir(path) {
    const files = await readdir(path);

    return files;
}
async function changeTemplate(template) {
    const components = await readDir(path.join(__dirname, 'components'));
    for (const component of components) {
        currentHtml = await readFile(path.join(__dirname, 'components', component));
        let filename = path.parse(component).name;

        template = template.replaceAll(`{{${filename}}}`, currentHtml.toString());
    }
    newHtml = template;
}
async function deleteAssets(fullPath) {
    const files = await readDir(fullPath);

    for (const file of files) {
        const fileInfo = await stat(path.join(fullPath, file));
        if (fileInfo.isDirectory()) {
            await deleteAssets(path.join(fullPath, file));
        } else {
            await unlink(path.join(fullPath, file));
        }
    }
}
async function createFile(file, data) {
    let fileStream = await open(file, 'w+');
    await appendFile(file, data);
    fileStream.close();
}
async function addStyle(files) {
    for (const file of files) {
        if (path.extname(file) == '.css') {
            const data = await readFile(path.join(__dirname, 'styles', file));
            await appendFile(path.join(__dirname, 'project-dist', 'style.css'), data);
        }
    }
}
async function copyFiles(oldPath, newPath) {
    const files = await readDir(oldPath);
    for (const file of files) {
        const fileInfo = await stat(path.join(oldPath, file));
        if (fileInfo.isDirectory()) {
            copyFiles(path.join(oldPath, file), path.join(newPath, file));
        } else {
            fs.copyFile(path.join(oldPath, file), path.join(newPath, file), errorCallback);
        }
    }
}
function newAssets() {
    const oldPath = path.join(__dirname, 'assets');
    const newPath = path.join(__dirname, 'project-dist', 'assets');
    copyFiles(oldPath, newPath);
}
async function newDirs() {
    const oldPath = path.join(__dirname, 'assets');
    const newPath = path.join(__dirname, 'project-dist', 'assets');
    await mkdir(path.join(__dirname, 'project-dist'));
    await mkdir(newPath);

    await createDir(oldPath, newPath);
}
async function createDir(oldPath, newPath) {
    const files = await readDir(oldPath);
    for (const file of files) {
        const fileInfo = await stat(path.join(oldPath, file));
        if (fileInfo.isDirectory()) {
            await mkdir(path.join(newPath, file));
            createDir(path.join(oldPath, file), path.join(newPath, file));
        }
    }
}

async function checkOldFiles() {
    let isError;

    try {
        await stat(path.join(__dirname, 'project-dist'));
        isError = false;
    } catch (error) {
        if (error.code == 'ENOENT') {
            await newDirs();
        } else throw error;
    }
    if (isError === false) {
        await deleteAssets(path.join(__dirname, 'project-dist'));
    }
}
function createFiles() {
    createFile(path.join(__dirname, 'project-dist', 'index.html'), newHtml);
    createFile(path.join(__dirname, 'project-dist', 'style.css'), '');
    readDir(path.join(__dirname, 'styles')).then(addStyle).then(newAssets);
}

readTemplate().then(changeTemplate).then(checkOldFiles).then(createFiles);
