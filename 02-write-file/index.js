const fs = require('fs');
const path = require('path');
const { stdin, stdout } = process;
function createFile() {
    fs.open(path.join(__dirname, 'text.txt'), 'w+', (err) => {
        if (err) throw err;
    });
}
function writeToFile(string) {
    if (string.toString().trim() == 'exit') {
        exit();
    }
    fs.appendFile(path.join(__dirname, 'text.txt'), string, (err) => {
        if (err) throw err;
    });
}
const exit = () => {
    stdout.write('Уже уходите? Нормально же же общались... До свидания!');
    process.exit();
};
stdout.write('Приветствую о проверяющий! Соизволь пожалуйста написать пару букв! Лучше десять.\n');
createFile();
stdin.on('data', writeToFile);
process.on('SIGINT', exit);
