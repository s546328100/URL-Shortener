const http = require('http');
const https = require('https');

function https_get(url) {
    return new Promise(function(resolve, reject) {
        https.get(url, res => {
            // if (res.statusCode !== 200)
            //     return reject({
            //         error: 'URL invalid'
            //     });

            res.on('error', () =>
                reject({
                    error: 'URL invalid'
                })
            );

            let str = '';
            res.on('data', chunk => {
                str += chunk;
            });

            res.on('end', () => resolve(str));
        });
    });
}

function http_get(url) {
    return new Promise(function(resolve, reject) {
        http.get(url, res => {
            // if (res.statusCode !== 200)
            //     return reject({
            //         error: 'URL invalid'
            //     });

            res.on('error', () =>
                reject({
                    error: 'URL invalid'
                })
            );

            let str = '';
            res.on('data', chunk => {
                str += chunk;
            });

            res.on('end', () => resolve(str));
        });
    });
}

module.exports = {http_get, https_get};
