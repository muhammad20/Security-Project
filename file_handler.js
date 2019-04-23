const fs = require('fs');
const path = require('path');

// Declare the library contatiner to be exported
const lib = {};



// Read from a file 
// dir the directory you want to read from, its path is relative to the directory of calling file
// Takes a callback function with error and data arguments
lib.read = function (dir, file,extension,callback) {
    fs.readFile( dir+'/'+ file + '.'+extension, 'utf8', function (err, data) {
        if(!err && data){   
            callback(false,data);
        }else{
            callback(err, data);
        }
    });
};

// Update a file
lib.update = function(dir, filename, data, callback){
    fs.open(lib.baseDir + dir + '/' + filename + '.json', 'r+',function(err,fileDescriptor){
        if(!err && fileDescriptor){
            var dataString = JSON.stringify(data);
            // Truncate the file
            fs.truncate(fileDescriptor, function(err){
                if(!err){
                    // Write to the file
                    fs.write(fileDescriptor,dataString,function(err){
                        if(err){
                            callback('Error writing to the file');
                        }else{
                            // Close the file
                            fs.close(fileDescriptor,function(err){
                                if(!err){
                                    callback(false);
                                }else{
                                    callback("Error closing the file");
                                }
                            });
                        }
                    });
                    
                }else{
                    callback('Error truncating the file');
                }
            });
        }else{
            callback("Couldn't open the file for updateing, it may not exist yet");
        }
    });
}

module.exports = lib;