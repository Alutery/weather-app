const config = require('./config.json');

const express = require('express');
const nunjucks = require('nunjucks');
const bodyParser = require('body-parser');
const request = require('request');
const url = require('url');

const app = express();

const apiKey = config.apiKey;

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

nunjucks.configure('views', {
    autoescape: true,
    express: app
});
app.set('view engine', 'html');

app.get('/', function(req, res) {
    res.render('index.html');
});

function parseBody(response) {
    return {
        'description': response.weather[0].description,
        'humidity': response.main.humidity,
        'wind': response.wind.speed,
        'temperature': response.main.temp
    }
}

app.post('/', function (req, res) {
    const city = req.body.city;  
    const apiCall = url.format({
        protocol: 'https',
        hostname: 'api.openweathermap.org',
        pathname: '/data/2.5/weather',
        query: {
            appid: apiKey,
            units: 'metric',
            q: city,
        }
    });

    request(apiCall, function (err, response, body) {
        if(err){
            res.status(500).send({weather: null, error: 'Error, please try again'});
        } else {
            let weather = JSON.parse(body)
            if(weather.main == undefined) {
                if(weather.cod === '404') {
                    res.status(404).send({weather: null, error: weather.message});
                } else {
                    res.status(500).send({weather: null, error: 'Error, please try again'});
                }
            } else {
                res.send({ weather: parseBody(weather), error: null})
            }
        }
    }); 
});

app.use("*",function(req,res){
    res.statusCode = 404;
    res.send("Page not Found");
});

app.listen(8080, function () {
    console.log('Listening on port 8080');
    console.log('Go to: http://localhost:8080/');
});