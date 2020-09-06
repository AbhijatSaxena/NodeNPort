const { argv } = require('yargs')

let port = argv.port;

//if port not provided - exit
if (!port) { process.exit(); }

let http = require('http');
let config = require('config');
let websocket = require('ws');

let serverURL = config.get('MiniBotConfig.URL') || "0.0.0.0";

const server = http.createServer((req, res) => {
    res.end('server connected at ' + port);
});

const wss = new websocket.Server({ server });
wss.on('headers', (headers, req) => {
    console.log(headers);
});

wss.on('connection', (ws, req) => {
    ws.send('welcome !');
    ws.on('message', (msg) => {
        console.log(msg);
    })
})

server.listen(Number(port), serverURL);
console.log('server created at ' + port);
