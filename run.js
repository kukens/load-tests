var Promise = require("bluebird");
var loadtest = require("loadtest");
var fs = require('fs');
var config = require('./config')
var handlebarsReport = require('./handlebarsReport');

if (!fs.existsSync("artifacts")) fs.mkdirSync("artifacts");

var allResults = [];

Promise.resolve(config.pages).each((url) => {

    return new Promise((resolve, reject) => {
        var options = {
            url: config.protocol + '://' + config.trafficManagerHostName + url,
            maxSeconds: config.testDuration,
            requestsPerSecond: config.requestsPerSecond,
            concurrency: config.concurrency,
            insecure: true,
            agentKeepAlive: true,
            headers: {
                host: config.siteHostName
            }
        }


        console.log('Started testing: ' + url);
        var startDate = new Date(Date.now()).toISOString();

        loadtest.loadTest(options, (error, result) => {
            if (error) {
                reject(error);
            }

            result.url = 'https://' + config.siteHostName + url;

            console.log('Finished testing: ' + url);
            result.testStart = startDate;
            result.testFinished = new Date(Date.now()).toISOString();
            console.log(JSON.stringify(result));

            allResults.push(result);
            resolve();
        });
    });
}).then(() => {

    var data = {
        results: allResults,
        config: config
    }

    handlebarsReport.generate(data);
}).then(() => {

    /*************************** test to ensure that host name resolves correctly and we get expected page *************** */

    var testOptions = {
        url: config.protocol + '://' + config.trafficManagerHostName + config.pages[0],
        maxRequests: 1,
        requestsPerSecond: 1,
        concurrency: 1,
        insecure: true,
        headers: {
            host: config.siteHostName
        },
        requestGenerator: (params, options, client, callback) => {
            var body = '';
            var request = client(options, callback);

            request.on('response', (res) => {
                res.on('data', (chunk) => {
                    body += chunk;
                });
                res.on('end', () => {
                    fs.writeFileSync("artifacts/testHtml.txt", body, [{ encoding: 'utf-8' }]);
                });

            });

            return request;
        }
    }

    loadtest.loadTest(testOptions, function (error, result) {
        if (error) {
            console.error(error);
        }
    });

});



