let config = require('config');
let portscanner = require('portscanner')

module.exports.getNextAvailablePort = function (serverURL) {
    let promise = new Promise(function (resolve, reject) {
        // Find the first port in use or blocked. Asynchronously checks, so first port
        // to respond is returned.
        let portStartRange = config.get('MiniBotConfig.PortConfig.StartRange');
        let portEndRange = config.get('MiniBotConfig.PortConfig.EndRange');        
        portscanner.findAPortNotInUse(portStartRange, portEndRange, serverURL, function (error, port) {
            if (error) {
                reject(error.message);
            } else if (!port) {
                reject("Port already in use");
            } else {
                resolve(port);
            }
        });
    });
    return promise;
};