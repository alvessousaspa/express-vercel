const express = require('express');
const helmet = require('helmet');
const { ErrorResponseObject } = require('./common/http');
const routes = require('./routes');
const app = express();

// Middleware para adicionar o cabeçalho Service-Worker-Allowed
app.use((req, res, next) => {
  res.setHeader('Service-Worker-Allowed', '/shared/service-worker/');
  next();
});

// Usar Helmet para segurança
app.use(helmet());

// Suas rotas
app.use('/', routes);

// Default catch-all handler
app.all('*', (req, res) => res.status(404).json(new ErrorResponseObject('route not defined')));

// Use a porta definida pela Vercel ou 3000 como padrão
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

module.exports = app;
