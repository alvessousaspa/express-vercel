const { Router } = require('express');
const { SuccessResponseObject } = require('../common/http');
const demo = require('./demo.route');
const verifySessionJson = '../datas/verifyssesion.json';
const verifyOperatorPlayerSessionJson = '../datas/verifyOperatorPlayerSession.json';
const GameName = '../datas/GameName.json';
const GameInfo = '../datas/GameInfo.json';
const GetByResourcesTypeIds = '../datas/GetByResourcesTypeIds.json';

const r = Router();

r.use('/demo', demo);

r.post('/web-api/auth/session/v2/verifySession', (req, res) => {
    const { traceId } = req.query;
    const data = require(verifySessionJson);
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'PUT, GET, HEAD, POST, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Origin', '*');
    res.json(data);
});

r.post('/web-api/auth/session/v2/verifyOperatorPlayerSession', (req, res) => {
    const { traceId } = req.query;
    const data = require(verifyOperatorPlayerSessionJson);
    // add Access-Control-Allow-Credentials: true Access-Control-Allow-Methods: PUT, GET, HEAD, POST, DELETE, OPTIONS Access-Control-Allow-Origin: * Content-Encoding: gzip Content-Type: application/json
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'PUT, GET, HEAD, POST, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Origin', '*');
    res.json(data);
});

r.post('/web-api/game-proxy/v2/GameName/Get', (req, res) => {
    const { traceId } = req.query;
    const data = require(GameName);
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'PUT, GET, HEAD, POST, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Origin', '*');
    res.send(data);
});

r.post('/game-api/fortune-tiger/v2/GameInfo/Get', (req, res) => {
    const { traceId } = req.query;
    const data = require(GameInfo);
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'PUT, GET, HEAD, POST, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Origin', '*');
    res.send(data);
});

r.post('/web-api/game-proxy/v2/Resources/GetByResourcesTypeIds', (req, res) => {
    const { traceId } = req.query;
    const data = require(GetByResourcesTypeIds);
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'PUT, GET, HEAD, POST, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Origin', '*');
    res.send(data);
});


r.get('/', (req, res) => res.json(new SuccessResponseObject('express vercel boiler plate')));

module.exports = r;

