const { Router } = require('express');
const { SuccessResponseObject } = require('../common/http');
const demo = require('./demo.route');
const verifySessionJson = '../datas/verifyssesion.json';
const verifyOperatorPlayerSessionJson = '../datas/verifyOperatorPlayerSession.json';
const GameName = '../datas/GameName.json';
const GameInfo = '../datas/GameInfo.json';
const GetByResourcesTypeIds = '../datas/GetByResourcesTypeIds.json';
const Spin = '../datas/Spin.json';
const { getRandomInt, generateWinningPositions, generateLineWins, calculateTotalWin } = require('../common/utils');

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
    const reels = [generateReel(), generateReel(), generateReel()];
    const { lineWins, totalWin } = calculateLineWins(reels);
    
    const result = {
        dt: {
            si: {
                wc: 0,
                ist: false,
                itw: totalWin > 0,
                fws: getRandomInt(10),
                wp: lineWins ? Object.keys(lineWins).map(key => reels.map(reel => reel[key - 1])) : null,
                orl: reels.flat(),
                lw: lineWins,
                irs: false,
                gwt: -1,
                fb: null,
                ctw: totalWin.toFixed(2),
                cwc: totalWin > 0 ? 1 : 0,
                fstc: null,
                pcwc: totalWin > 0 ? 1 : 0,
                rwsp: totalWin > 0 ? { [getRandomInt(3) + 1]: totalWin } : null,
                hashr: `0:${reels.flat().join(';')}#MV#3.0#MT#1#MG#${totalWin.toFixed(2)}#`,
                ml: 2,
                cs: 0.3,
                rl: reels.flat(),
                sid: "1814345283544219136",
                psid: "1814345283544219136",
                st: 1,
                nst: 1,
                pf: 1,
                aw: totalWin.toFixed(2),
                wid: 0,
                wt: "C",
                wk: "0_C",
                wbn: null,
                wfg: null,
                blb: 99997.00,
                blab: 99994.00,
                bl: (99994.00 + totalWin).toFixed(2),
                tb: 3.00,
                tbb: 3.00,
                tw: totalWin.toFixed(2),
                np: (totalWin - 3.00).toFixed(2),
                ocr: null,
                mr: null,
                ge: [
                    1,
                    11
                ]
            }
        },
        err: null
    };

    res.json(result);
});


r.get('/', (req, res) => res.json(new SuccessResponseObject('express vercel boiler plate')));

module.exports = r;
