const express = require('express');
const debug = require('debug')('server');
const chalk = require('chalk');
const bodyParser = require('body-parser');
const app = express();
const routes = require('./routes');

const port = process.env.PORT || 3000;

//middleware
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use('/', routes);

app.get('/', (req, res) => {
    //debug(req);
    res.send('Blog Backend! - GET');
});

app.post('/', (req, res) => {
    debug(req);
    console.log(req);
    res.send('Blog Backend! - POST');
});

app.listen(port, function () {
    debug(`Listening on port ${chalk.green(process.env.PORT)}`);
}); 