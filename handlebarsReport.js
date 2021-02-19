var config = require('./config');

exports.generate = (data) => {

    var finalResults = [];

    //prepare model for hendlabars template
    data.results.forEach((item) => {
        var result = {}

        console.log(JSON.stringify(item));

        result.url = item.url;

        result.totalErrors = item.totalErrors;

        if (item.totalErrors > 0) {

            result.errorCodes = getEntriesFromObject(item.errorCodes);
        }

        // yeah :) do not repeat yourself and here we go:)

        result.meanLatencyMs = {
            mark: assessPerformance(item.meanLatencyMs, config.tresholds.meanLatencyMs),
            value: item.meanLatencyMs
        }

        result.percentiles50 = {
            mark: assessPerformance(item.percentiles['50'], config.tresholds.percentiles50),
            value: item.percentiles['50']
        }

        result.percentiles90 = {
            mark: assessPerformance(item.percentiles['90'], config.tresholds.percentiles90),
            value: item.percentiles['90']
        }

        result.percentiles95 = {
            mark: assessPerformance(item.percentiles['95'], config.tresholds.percentiles95),
            value: item.percentiles['95']
        }

        result.percentiles99 = {
            mark: assessPerformance(item.percentiles['99'], config.tresholds.percentiles99),
            value: item.percentiles['99']
        }

        result.testStart = item.testStart;

        finalResults.push(result);
    });


    // generate HTML from handlebars template
    var fs = require("fs");
    var template = fs.readFileSync('results.hbs', { encoding: 'utf-8' });

    var Handlebars = require("handlebars");
    var compiled = Handlebars.compile(template);

    var data = {
        results: finalResults,
        config: config
    };

    fs.writeFileSync('artifacts/results.html', compiled(data));

};


//assess performance basing on defined perf tresholds per each metric
function assessPerformance(value, tresholds) {
    if (value < tresholds[0]) return 'good';
    if (value >= tresholds[0] && value < tresholds[1]) return 'fair';
    return 'poor';
}

// ES2017 polyfill https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/entries
function getEntriesFromObject(obj) {
    var ownProps = Object.keys(obj),
        i = ownProps.length,
        resArray = new Array(i); // preallocate the Array
    while (i--)
        resArray[i] = [ownProps[i], obj[ownProps[i]]];

    return resArray;
};
