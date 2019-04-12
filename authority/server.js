// Require http module to use as server
const http = require('http');
const url = require('url');
const path = require('path');
const _data = require('./../file_handler');

// Declare the server template
const server = {}

// Server startup logic
server.httpServer =http.createServer(function (req, res) {
        server.reqHandler(req,res);
    });


// Request handler logic 
server.reqHandler = function(req,res){
    // Get the URL and parse it 
    var parsedUrl = url.parse(req.url,true);   
    
    // Get the HTTP method
    var method = req.method.toLowerCase();

    // Get the query string parameters
    var queryStringOnject = parsedUrl.query;
    
    // Parse the id for the certificate reuired
    var id = queryStringOnject.id != null && queryStringOnject.id.trim().length !=0 && typeof(queryStringOnject.id) == "string" ? queryStringOnject.id.trim() : false;
    
    // If the request was sent sucessfully, Start the logic
    if(method=="get" && id ){
        console.log("reading");
        _data.read("certificates",id,"cert",function(err,data){
            if(!err && data){
                res.writeHead(200);
                res.end(data);
            }else{
                console.log(err);
                res.writeHead(404)
                res.end();
            }
        });
    }
};



server.init = function () {
    server.httpServer.listen(9000,function(){
        console.log('Authority server is running');
    });
};

server.init();