import fs from 'fs';
import http from 'http'; // Import pre-bundled module(s)
import mime from 'mime-types'; // 3rd party module
let lookup = mime.lookup; // Alias for mime.lookup

// const hostname = '127.0.0.1'; // localhost
const port = process.env.PORT || 3000;

// Create an Instance of a Server (Immutable)
const server = http.createServer(function(req, res) {

    let path = req.url as string;

    if(path == "/" || path == "/home")
    {
        path = "/index.html";
    }

    let mime_type = lookup(path.substring(1)) as string;

    // console.log(path);

    fs.readFile(__dirname + path, function(err, data)
    {
        if (err)
        {
            res.writeHead(404);
            res.end("ERROR: 404 - File Not Found! " + err.message);
            return;
        }
        res.setHeader("X-Content-Type-Options", "nosniff"); // Security guard
        res.writeHead(200, {'Content-Type': mime_type});
        res.end(data);
    });
});

server.listen(port, function() {
  console.log(`Server running at Port:${port}/`);
});