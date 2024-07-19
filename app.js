const express = require('express');
const helmet = require('helmet');
const { ErrorResponseObject } = require('./common/http');
const routes = require('./routes');
var csrf = express.csrf();
const app = express();



app.use('/', routes, express.csrf());
// default catch all handler

module.exports = app;
