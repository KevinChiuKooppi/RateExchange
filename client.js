var express = require('express');
var app = express();
var oxr = require('open-exchange-rates');
var fx = require('money');
var path = require('path');
var historicalResultObj = new Object();

const hostname = '127.0.0.1';
const port = 3000;

// API: Calculate currency by latest rate.
app.get('/exchange', function (req, res) {
    // Set App ID (required):
    oxr.set({
        app_id: '833e73e958b343c4a8e8968f6785acfa'
    });
    res.setHeader('Content-Type', 'application/json');

    let fromCurrency = req.query.fromCurrency;
    let toCurrency = req.query.toCurrency;
    let baseAmount = req.query.baseAmount;
    console.log( 'From currency: ' + fromCurrency);
    console.log( 'To currency: ' + toCurrency);
    console.log( 'Base Amount: ' + baseAmount);
    
    oxr.latest(function(error) {

        if ( error ) {
            // `error` will contain debug info if something went wrong:
            console.log( 'ERROR loading data from Open Exchange Rates API! Error was:' )
            console.log( error.toString() );
    
            // Fall back to hard-coded rates if there was an error (see readme)
            return false;
        }

        // The timestamp (published time) of the rates is in `oxr.timestamp`:
        console.log( 'Exchange rates published: ' + (new Date(oxr.timestamp)).toUTCString() );
    
        // To load rates into the money.js (fx) library for easier currency
        // conversion, simply apply the rates and base currency like so:
        fx.rates = oxr.rates;
        fx.base = oxr.base;
    
        // money.js is now initialised with the exchange rates, so this will work:
        var resultAmount = fx(baseAmount).from(fromCurrency).to(toCurrency).toFixed(6);
        console.log( baseAmount + " " + fromCurrency + " in " + toCurrency + ": " + resultAmount );
        res.end(JSON.stringify({convertedResult : resultAmount}));
    });
})

// API: Get historical rates between 2 currencies
app.get('/historical', function (req, res) {
    oxr.set({
        app_id: '833e73e958b343c4a8e8968f6785acfa'
    });
    res.setHeader('Content-Type', 'application/json');

    let period = req.query.period;
    let fromCurrency = req.query.fromCurrency;
    let toCurrency = req.query.toCurrency;

    historicalResultObj = new Object();
    var dateList = [];
    var date = new Date();
    console.log("today: " + date);
    var count = 0;
    if (period == "last3days") {
        count = 3;
    } else {
        count = 7;
    }

    // To get date array list for last3days or last7days.
    for (var i=0; i<=count; i++) {
        var tempDate = new Date();
        tempDate.setDate(date.getDate() - i);
        var dd = pad(tempDate.getDate());
        var mm = pad(tempDate.getMonth() + 1);
        var yy = tempDate.getFullYear();

        var dateStr = yy + '-' + mm + '-' + dd;
        dateList.push(dateStr);      
    }

    //Promise waits for all fullfillments done.
    if (period == "last3days") {
        Promise.all([requestGetHistoricalAsync(dateList[0], fromCurrency, toCurrency), requestGetHistoricalAsync(dateList[1], fromCurrency, toCurrency), 
            requestGetHistoricalAsync(dateList[2], fromCurrency, toCurrency), requestGetHistoricalAsync(dateList[3], fromCurrency, toCurrency)]);
    } else {
        Promise.all([requestGetHistoricalAsync(dateList[0], fromCurrency, toCurrency), requestGetHistoricalAsync(dateList[1], fromCurrency, toCurrency), 
            requestGetHistoricalAsync(dateList[2], fromCurrency, toCurrency), requestGetHistoricalAsync(dateList[3], fromCurrency, toCurrency),
            requestGetHistoricalAsync(dateList[4], fromCurrency, toCurrency), requestGetHistoricalAsync(dateList[5], fromCurrency, toCurrency),
            requestGetHistoricalAsync(dateList[6], fromCurrency, toCurrency), requestGetHistoricalAsync(dateList[7], fromCurrency, toCurrency)]);
    }

    //Write the result into response, data returned from the OpenExchangeRage.getHistorical through multiple HTTP requests.
    setTimeout(function(){
        console.log("Result Object: " + JSON.stringify(historicalResultObj)); 
        res.end(JSON.stringify(historicalResultObj))}, 
        5000);
})

// UI
app.get("/ui", function (req, res) {
    res.sendFile(path.join(__dirname + "/index.html"))
})

// Server up
var server = app.listen(port, hostname, function () {

    console.log(`Server running at http://${hostname}:${port}/`);

})

// Padding 'month' and 'day', for example: 2017-1-1 to 2017-01-01
function pad(num) {
    return (num < 10) ? '0' + num.toString() : num.toString();
}

// Calling open-exchange-rates --> get historical rates
function getHistorical(dateStr, fromCurrency, toCurrency) {
    oxr.historical(dateStr, function(error) {
        console.log("Date: " + dateStr);
        if ( error ) {
            // `error` will contain debug info if something went wrong:
            console.log( 'ERROR loading data from Open Exchange Rates API! Error was:' )
            console.log( error.toString() );
    
            // Fall back to hard-coded rates if there was an error (see readme)
            return false;
        }

        fx.rates = oxr.rates;
        fx.base = oxr.base;
        var resultAmount = fx(1).from(fromCurrency).to(toCurrency).toFixed(6);
        console.log( 1 + " " + fromCurrency + " in " + toCurrency + ": " + resultAmount );
        
        // dateStr is the key, resultAmount is the value in result object.
        historicalResultObj[dateStr] = resultAmount;
        return resultAmount;
    });
}

// Call get historical rates in asynchronization mode.
function requestGetHistoricalAsync(dateStr, fromCurrency, toCurrency, resultObj) {
    return new Promise(function(resolve, reject) {
        getHistorical(dateStr, fromCurrency, toCurrency);
    });
}