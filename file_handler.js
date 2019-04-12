const fs = require('fs');
const path = require('path');

// Declare the library contatiner to be exported
const lib = {};



// Read from a file 
// dir the directory you want to read from, its path is relative to the directory of calling file
// Takes a callback function with error and data arguments
lib.read = function (dir, file,extension,callback) {
    fs.readFile( dir + '/' + file + '.'+extension, 'utf8', function (err, data) {
        if(!err && data){   
            callback(false,data);
        }else{
            callback(err, data);
        }
    });
};

module.exports = lib;