const fs = require('fs');

// directory path
const dir = './node_modules/puppeteer/.local-chromium/linux-884014';

module.exports = async (req, res) => {
    // list all files in the directory
    fs.readdir(dir, (err, files) => {
        if (err) {
            throw err;
        }

        // files object contains all files names
        // log them on console
        files.forEach(file => {
            console.log(file);
        });
    });
}