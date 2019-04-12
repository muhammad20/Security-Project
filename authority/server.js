// Require http module to use as server
const http = require('http');
const url = require('url');
const path = require('path');
const _data = require('./../file_handler');

// Declare the server template
const server = {}

// Create the server, and define its entry point
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
        
        // Try to read the certificate of the user with this id
        _data.read(__dirname+"/certificates",id,"cert",function(err,data){
            // If there is a certificate for this id 
            if(!err && data){
                res.writeHead(200);
                res.end(data);
            }else{ // No certificate
                console.log(err);
                res.writeHead(404)
                res.end();
            }
        });
    }
};


// The port at which the server is running
server.port = 9000;

// Server startup logic (Which port and callback after successful startup)
server.init = function () {
    server.httpServer.listen(server.port,function(){
        console.log('Authority server is running');
    });
};  

// runs the server
server.init();