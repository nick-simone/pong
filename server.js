const app = require('http').createServer(handler)
const io = require('socket.io')(app) //wrap server app in socket io capability
const fs = require("fs"); //need to read static files
const url = require("url"); //to parse url strings

const PORT = process.env.PORT || 3000
app.listen(PORT) //start server listening on PORT

//...

function handler(request, response) {
  let urlObj = url.parse(request.url, true, false)
    console.log("\n============================")
    console.log("PATHNAME: " + urlObj.pathname)
    console.log("REQUEST: " + ROOT_DIR + urlObj.pathname)
    console.log("METHOD: " + request.method)

    let receivedData = ""

    //attached event handlers to collect the message data
    request.on("data", function(chunk) {
      receivedData += chunk
    })

    //event handler for the end of the message
    request.on("end", function() {
      console.log("REQUEST END: ")
      console.log("received data: ", receivedData)
      console.log("type: ", typeof receivedData)

      //if it is a POST request then echo back the data.
      if (request.method == "POST") {
        var dataObj = JSON.parse(receivedData);
        if (dataObj.x >= 0 && dataObj.y >= 0) {
          //Here a client is providing a new location for the moving box
          //capture location of moving box from client
          movingBoxLocation = JSON.parse(receivedData);
          console.log("received data object: ", movingBoxLocation);
          console.log("type: ", typeof movingBoxLocation);
        }
        //echo back the location of the moving box to who ever
        //sent the POST message
        response.writeHead(200, { "Content-Type": MIME_TYPES["json"] });
        response.end(JSON.stringify(movingBoxLocation)); //send just the JSON object
      }

      if (request.method == "GET") {
        //handle GET requests as static file requests
        fs.readFile(ROOT_DIR + urlObj.pathname, function(err, data) {
          if (err) {
            //report error to console
            console.log("ERROR: " + JSON.stringify(err))
            //respond with not found 404 to client
            response.writeHead(404)
            response.end(JSON.stringify(err))
            return
          }
          response.writeHead(200, {
            "Content-Type": get_mime(urlObj.pathname)
          })
          response.end(data)
        })
      }
    })
}

const http = require("http"); //need to http

const counter = 1000; //to count invocations of function(req,res)

//server maintained location of moving box
let movingBoxLocation = { x: 100, y: 100 }; //will be over-written by clients

const ROOT_DIR = "html"; //dir to serve static files from

const MIME_TYPES = {
  css: "text/css",
  gif: "image/gif",
  htm: "text/html",
  html: "text/html",
  ico: "image/x-icon",
  jpeg: "image/jpeg",
  jpg: "image/jpeg",
  js: "application/javascript",
  json: "application/json",
  png: "image/png",
  txt: "text/plain"
};



function get_mime(filename) {
  let ext, type
  for (let ext in MIME_TYPES) {
    type = MIME_TYPES[ext]
    if (filename.indexOf(ext, filename.length - ext.length) !== -1) {
      return type
    }
  }
  return MIME_TYPES["txt"]
}

io.on('connection', function(socket){
  socket.on('player1Data', function(data){
    console.log('RECEIVED BOX DATA: ' + data)
    //to broadcast message to everyone including sender:
    io.emit('player1Data', data) //broadcast to everyone including sender
  })
  socket.on('player2Data', function(data){
    console.log('RECEIVED BOX DATA: ' + data)
    //to broadcast message to everyone including sender:
    io.emit('player2Data', data) //broadcast to everyone including sender
  })
  socket.on('score', function(data){
    console.log('RECEIVED BOX DATA: ' + data)
    //to broadcast message to everyone including sender:
    io.emit('score', data) //broadcast to everyone including sender
  })
  socket.on('ball', function(data){
    console.log('RECEIVED BOX DATA: ' + data)
    //to broadcast message to everyone including sender:
    io.emit('ball', data) //broadcast to everyone including sender
  })
})



console.log("Server Running at PORT: 3000  CNTL-C to quit");
console.log("To Test: open several browsers at: http://localhost:3000/assignment3.html")

