const fs = require('fs');

// directory path
const dir = './node_modules/puppeteer';

module.exports = async (req, res) => {
    // list all files in the directory
    fs.readdir(dir, (err, files) => {
        if (err) {
            throw err;
        }
        res.send(JSON.stringify(files))
    });
}