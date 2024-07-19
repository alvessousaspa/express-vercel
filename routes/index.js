const { Router } = require('express');
const axios = require('axios');
const { SuccessResponseObject } = require('../common/http');
const demo = require('./demo.route');

const r = Router();

r.use('/demo', demo);

const proxyRequest = async (req, res, next) => {
  const apiUrl = 'https://api.pgf-nmu2nd.com';
  const path = req.originalUrl.replace('/web-api', '');
  const url = `${apiUrl}${path}`;

  try {
    const response = await axios({
      method: req.method,
      url,
      params: req.query,
      headers: req.headers,
      data: req.body,
    });

    res.status(response.status).json(response.data);
  } catch (error) {
    console.error(error);
    if (error.response) {
      res.status(error.response.status).json(error.response.data);
    } else {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
};

r.use('/web-api/auth/session/v2/verifySession', proxyRequest);
r.use('/web-api/auth/session/v2/verifyOperatorPlayerSession', proxyRequest);
r.use('/web-api/game-proxy/v2/GameName/Get', proxyRequest);
r.use('/game-api/fortune-tiger/v2/GameInfo/Get', proxyRequest);
r.use('/web-api/game-proxy/v2/Resources/GetByResourcesTypeIds', proxyRequest);

r.get('/', (req, res) => res.json(new SuccessResponseObject('express vercel boiler plate')));

module.exports = r;
