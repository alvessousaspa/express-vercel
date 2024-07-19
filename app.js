const express = require('express');
const helmet = require('helmet');
const { ErrorResponseObject } = require('./common/http');
const routes = require('./routes');
var csrf = express.csrf();
const app = express();

var conditionalCSRF = function (req, res, next) {
    //compute needCSRF here as appropriate based on req.path or whatever
    if (needCSRF) {
      csrf(req, res, next);
    } else {
      next();
    }
  }
  
app.use(conditionalCSRF);

app.use('/', routes);

// default catch all handler
app.all('*', (req, res) => res.status(404).json(new ErrorResponseObject('route not defined')));

module.exports = app;
