# RateExchange
## Introduction
This is a service that calculates currency by the latest exchange rate and shows historical(last 3 days/last 7 days) exchange rate for the currency. </br> 

This application is a full-stack one, which include back-end APIs (calculate currency/get historical rates) and a simple front-end UI allows us input original value and choose from what currency to what currency, in addition we can trace a historical rate graph from the UI.</br>

It retrieves latest and historical data by [openexchangerates.org](openexchangerates.org). So no data base here, I use three tier network architecture for data retrieving and processing. </br>

## Architecture
1. Front-end UI</br>
   - Technique:</br>
     HTML, JavaScript, CSS, JQuery</br>
   - Library:</br>
     flot</br>
2. Back-end API</br>
   - Technique:</br>
     Node.js</br>
   - Framework:</br>
     express</br>
   - Module:</br>
     open-exchange-rates</br>
   - Library:</br>
     money.js
3. OpenExchangeRate API</br>
</br>
Interaction between these 3 blocks:</br>
Front-end makes an HTTP RESTful API call to back-end webservice to ask for data, when back-end receives the request, it will process the query parameters and make an HTTP RESTfull API call to OpenExchangeRate, OpenExchangeRate will return JSON type response to back-end webservice, through calculation, the back-end webservice will send response to front-end UI in JSON format.</br>
</br>

## Library & Framwork & Module
#### 1. express: </br>
Express is a minimal and flexible Node.js web application framework that provides a robust set of features to develop web and mobile applications. It facilitates the rapid development of Node based Web applications.</br>
I use express in my application on purpose of starting a server and listening/responsing to HTTP requests.</br>
#### 2. open-exchange-rates:</br>
It is a nodeJS/npm wrapper for the Open Exchange Rates API service. Loads up-to-date or historical currency/exchange rate data from the API, for seamless server-side integration.</br>
#### 3. money: </br>
It is lightweight, has no dependencies, and works great client-side or server-side. Use standalone or as a nodeJS/npm and AMD/requireJS module.
Designed for seamless integration with the Open Exchange Rates API.</br>
In my application, I use this JavaScript library for realtime currency conversion and exchange rate calculation, from any currency, to any currency.
#### 4. flot:</br>
Flot is a Javascript charting library for jQuery, it can be used by including the script like this:</br>
```
<script src="//cdn.jsdelivr.net/jquery.flot/0.8.3/jquery.flot.min.js"></script>
```
We can plot a gragh by running the plot function in Javascript.</br>
```
$.plot($("#placeholder"), data, options);
```
All we need to do is to customize the 'data' and 'options'.</br>
Below is an example for 'data' in my application:</br>
```
[[1516579200000, 7.81845], [1516838400000, 7.81705], [1516665600000, 7.81885], [1516752000000, 7.81795]]
```
The key represents the timestamp in milliseconds of date, and the value is the actual exchange rate of that day. There are plenty to be played to fine tune and cometic the graph by customize the 'options'.</br>

## Back-end API signature
Specification:</br>
- hostname: 127.0.0.1</br>
- port: 3000</br>
</br>

1. Conversion between currencies using latest exchange rate:</br>
   - URL: http://{hostname}:{port}/exchange?fromCurrency=XXX&toCurrency=XXX&baseAmount=XXX</br>
   - Query parameters:</br>
     - fromCurrency (String): mandatory field, specifies from which currency for exchanging</br>
	 - toCurrency (String): mandatory field, specifies to which currency for exchanging</br>
	 - baseAmount (Integer): mandatory field, spcifies the original currency value for exchanging</br>
   - Response body:</br>
     ```
	 {
	 	"convertedResult": XXX
	  }
	  ```
2. Get historical exchange rate list:</br>
   - URL: http://{hostname}:{port}/historical?fromCurrency=XXX&toCurrency=XXX&period=XXX</br>
   - Query parameters:</br>
     - fromCurrency (String): mandatory field, specifies from which currency for exchanging</br>
	 - toCurrency (String): mandatory field, specifies to which currency for exchanging</br>
	 - period (String): madatory field, options are last3days & last7days, specifies how much data we wanna see in the result</br>
   - Response body (example):</br>
     ```
	 {
		"2018-01-23": "7.818850",
		"2018-01-25": "7.817750",
		"2018-01-22": "7.818450",
		"2018-01-24": "7.817950",
		"2018-01-19": "7.816680",
		"2018-01-20": "7.816680",
		"2018-01-21": "7.816550",
		"2018-01-18": "7.817750"
	 }
	 ```
</br>

## Front-end UI
![alt text](https://github.com/KevinChiuKooppi/RateExchange/blob/master/rate-exchanger-ui.jpeg?raw=true)
Here is a screenshot of the front-end UI, it can be accessd through: [http://127.0.0.1:3000/ui#](http://127.0.0.1:3000/ui#) after server is up.

## Barrier
Since the get historical exchange rates API from OpenExchangeRate only allows input a valid date rather than a date range, so in my "Get historical exchange rate list" API, I need to send multiple requests to OpenExchangeRate to 
retrieve rates from different date. During my development, since I am a kind of beginner of Node.js, I am not very familiar with how the asynchronization mode is working in Node.js. So I use a combination of TimeOut & Promise.all
to achieve at least data correction. Of course, this will affect the speed of webservice in the mean while. Maybe there is a better solution? This is where I will continue learning and trying after this challenge. </br>
</br>

## To be continued
The commitment is not the end of this application, it's a simple application with only 2 functions so far. There are many needed to do in the future, include: </br>
Exception handling, Asynchronization mechanism, UI cosmetic, Security integration, New functions like historical rates statistics/interactive plot graph/show longer historical rates. 
