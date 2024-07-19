const express = require('express');
const helmet = require('helmet');
const { ErrorResponseObject } = require('./common/http');
const routes = require('./routes');
const app = express();

// Middleware para adicionar o cabeçalho Service-Worker-Allowed
app.use((req, res, next) => {
  res.setHeader('Service-Worker-Allowed', '/');
  next();
});

// Usar Helmet para segurança
app.use(helmet());

// Suas rotas
app.use('/', routes);

// Default catch-all handler
app.all('*', (req, res) => res.status(404).json(new ErrorResponseObject('route not defined')));

module.exports = app;
