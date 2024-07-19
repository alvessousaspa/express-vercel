const { Router } = require('express');
const { SuccessResponseObject } = require('../common/http');
const demo = require('./demo.route');
const verifySessionJson = '../datas/verifyssesion.json';
const verifyOperatorPlayerSessionJson = '../datas/verifyOperatorPlayerSession.json';
const GameName = '../datas/GameName.json';
const GameInfo = '../datas/GameInfo.json';
const GetByResourcesTypeIds = '../datas/GetByResourcesTypeIds.json';
const Spin = '../datas/Spin.json';
const { getRandomInt, generateWinningPositions, generateLineWins, calculateTotalWin } = require('./utils');

const r = Router();

r.use('/demo', demo);

r.post('/web-api/auth/session/v2/verifySession', (req, res) => {
    const { traceId } = req.query;
    const data = require('../datas/verifyssesion.json');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'PUT, GET, HEAD, POST, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Origin', '*');
    res.json(data);
});

r.post('/web-api/auth/session/v2/verifyOperatorPlayerSession', (req, res) => {
    const { traceId } = req.query;
    const data = require('../datas/verifyOperatorPlayerSession.json');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'PUT, GET, HEAD, POST, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Origin', '*');
    res.json(data);
});

r.post('/web-api/game-proxy/v2/GameName/Get', (req, res) => {
    const { traceId } = req.query;
    const data = require('../datas/GameName.json');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'PUT, GET, HEAD, POST, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Origin', '*');
    res.send(data);
});

r.post('/game-api/fortune-tiger/v2/GameInfo/Get', (req, res) => {
    const { traceId } = req.query;
    const data = require('../datas/GameInfo.json');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'PUT, GET, HEAD, POST, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Origin', '*');
    res.send(data);
});

r.post('/web-api/game-proxy/v2/Resources/GetByResourcesTypeIds', (req, res) => {
    const { traceId } = req.query;
    const data = require('../datas/GetByResourcesTypeIds.json');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'PUT, GET, HEAD, POST, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Origin', '*');
    res.send(data);
});

r.post('/game-api/fortune-tiger/v2/Spin', (req, res) => {
    const winningPositions = generateWinningPositions();
    const lineWins = generateLineWins();
    const totalWin = calculateTotalWin(lineWins);

    const result = {
        dt: {
            si: {
                wc: 0,
                ist: false,
                itw: false,
                fws: getRandomInt(10),  // Número de vitórias em rodadas grátis
                wp: winningPositions,
                orl: null,
                lw: lineWins,
                irs: false,
                gwt: getRandomInt(5),  // Tipo de vitória no jogo
                fb: null,
                ctw: totalWin,
                cwc: getRandomInt(5),
                fstc: { [getRandomInt(5)]: 1 },
                pcwc: 0,
                rwsp: {
                    1: (Math.random() * 10).toFixed(1),
                    2: (Math.random() * 10).toFixed(1),
                    3: (Math.random() * 10).toFixed(1),
                    4: (Math.random() * 10).toFixed(1),
                    5: (Math.random() * 10).toFixed(1)
                },
                hashr: "1:5;5;5#5;0;5#5;0;5#R#5#011121#MV#0#MT#1#R#5#001020#MV#0#MT#1#R#5#021222#MV#0#MT#1#R#5#001122#MV#0#MT#1#R#5#021120#MV#0#MT#1#MG#240.0#",
                ml: 2,
                cs: 0.3,
                rl: [getRandomInt(7), getRandomInt(7), getRandomInt(7), getRandomInt(7), 0, 0, getRandomInt(7), getRandomInt(7), getRandomInt(7)],
                sid: "1813948759773478400",
                psid: "1813948732749577728",
                st: 4,
                nst: 1,
                pf: 1,
                aw: parseFloat(totalWin),
                wid: 0,
                wt: "C",
                wk: "0_C",
                wbn: null,
                wfg: null,
                blb: 100728.40,
                blab: 100728.40,
                bl: 100728.40 + parseFloat(totalWin),
                tb: 0.00,
                tbb: 3.00,
                tw: parseFloat(totalWin),
                np: parseFloat(totalWin),
                ocr: null,
                mr: null,
                ge: [1, 11]
            }
        },
        err: null
    };

    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'PUT, GET, HEAD, POST, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Origin', '*');
    res.json(result);
});

r.get('/', (req, res) => res.json(new SuccessResponseObject('express vercel boiler plate')));

module.exports = r;
