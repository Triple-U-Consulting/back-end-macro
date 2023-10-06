const http = require('http');
const app = require('./app');
require('dotenv').config();

// Assign port
const port = process.env.PORT || 3000;

// Create a server
const server = http.createServer(app);

// Start a server
server.listen(port, () => {
    console.log(`app listening on port ${port}`)
});