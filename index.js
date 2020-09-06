//libraries
let config = require('config');
let childProcess = require('child_process');
var express = require('express');
var bodyParser = require('body-parser');
var _ = require('lodash');

//custom code
let portService = require('./utilities/port-service');

//App
var app = express();
app.use(bodyParser.json());

//Variables
let minibotsProcesses = [];
let minibots = [];

//API
//READ
app.get('/', function (req, res) {
    res.send('Super Bot v1.0');
});
app.get('/minibots', function (req, res) {
    res.send(minibots);
});

//CREATE
app.post('/generate-minibot', function (req, res) {
    let serverURL = config.get('MiniBotConfig.URL');
    portService.getNextAvailablePort(serverURL).then(function (port) {
        console.log('generating minibot @' + port);
        let minibotProcess = childProcess.spawn(
            'node', ['MiniBot\\index', '--port', port],
            {
                //child process config goes here
            });
        let minibot = addMiniBot(minibotProcess, port);
        console.log('generated minibot @' + port);
        res.send(minibot);
    }).catch(function (err) {
        //console.log(err);//todo
    });
});

//UPDATE
//TODO

//Delete
app.delete('/kill-minibot/:id', function (req, res) {
    let pid = Number(req.params.id);
    let minibotProcess = _.find(minibotsProcesses, { pid: pid });
    if (minibotProcess) {
        //kill the minibot process
        minibotProcess.kill();

        //remove from both minibot list        
        _.remove(minibotsProcesses, { pid: pid });
        _.remove(minibots, { pid: pid });
        res.send('MiniBot Killed');
    } else {
        res.send('MiniBot Not Found');
    }
});



//Common Functions
function addMiniBot(process, port) {
    minibotsProcesses.push(process);

    let minibot = {
        pid: process.pid,
        port: port
    };
    minibots.push(minibot);
    return minibot;
}

//Server Listen
let servicePort = config.get('SuperBotConfig.Port');
let serviceURL = config.get('SuperBotConfig.URL');
app.listen(Number(servicePort), serviceURL, function () {
    console.log('SuperBot Activated @' + servicePort);
});