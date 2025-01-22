const express = require('express');
const helmet = require('helmet');
const cors = require('cors'); // Importe a biblioteca cors
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

// Configurar o CORS para permitir solicitações do seu domínio
const allowedOrigins = ['https://m.bnbtiger.baby']; // Adicione outros domínios se necessário
app.use(cors({
  origin: function (origin, callback) {
    // Permite solicitações sem origem (como as do Postman)
    if (!origin) return callback(null, true);

    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'A política de CORS para este site não permite acesso a partir da origem especificada.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  }
}));

// Adicione o middleware para analisar corpos de solicitação codificados em URL
app.use(express.urlencoded({ extended: true }));

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
