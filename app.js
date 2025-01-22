const express = require('express');
const helmet = require('helmet');
const { ErrorResponseObject } = require('./common/http');
const routes = require('./routes');
const app = express();

// Configurar CORS corretamente
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, cs, ml');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Service-Worker-Allowed', '/shared/service-worker/');

    // Handle preflight requests
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    next();
});

// Configurar Helmet com opções mais permissivas para desenvolvimento
app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    contentSecurityPolicy: false
}));

// Parser para JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Suas rotas
app.use('/', routes);

// Default catch-all handler
app.all('*', (req, res) => res.status(404).json(new ErrorResponseObject('route not defined')));

// Tratamento de erros
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json(new ErrorResponseObject('Internal server error'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
