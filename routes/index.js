const { Router } = require('express');
const { SuccessResponseObject } = require('../common/http');
const demo = require('./demo.route');
const verifySessionJson = '../datas/verifyssesion.json';
const verifyOperatorPlayerSessionJson = '../datas/verifyOperatorPlayerSession.json';
const GameName = '../datas/GameName.json';
const GameInfo = '../datas/GameInfo.json';
const GetByResourcesTypeIds = '../datas/GetByResourcesTypeIds.json';
const Spin = '../datas/Spin.json';
const { generateReel, calculateLineWins, getRandomInt, generateWinningPositions } = require('../common/utils');

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
    const cs = req.headers.cs;
    const ml = req.headers.ml;
    const totalbet = cs * ml * 5;
    const reels = [generateReel(), generateReel(), generateReel()];
    console.log(reels);
    const { lineWins, totalWin } = calculateLineWins(reels);
    console.log("lineWins", lineWins, "totalWin", totalWin);
    const result = {
        dt: {
            si: {
                wc: 5,
                ist: false,
                itw: true,
                fws: 0,
                wp: lineWins ? Object.keys(lineWins).map(key => reels.map(reel => reel[key - 1])) : null,
                orl: reels.flat(),
                lw: null,
                irs: false,
                gwt: -1,
                fb: null,
                ctw: 0.0,
                pmt: null,
                cwc: 0,
                fstc: null,
                pcwc: 0,
                rwsp: totalWin > 0 ? { [getRandomInt(3) + 1]: totalWin } : null,
                hashr: "0:5;6;7#7;5;7#6;7;5#R#5#001122#MV#3.0#MT#1#MG#4.8#",
                ml: 2,
                cs: 0.3,
                rl: reels.flat(),
                sid: "1814402670505630721",
                psid: "1814402670505630721",
                st: 1,
                nst: 1,
                pf: 1,
                aw: 1,
                wid: 0,
                wt: "C",
                wk: "0_C",
                wbn: null,
                wfg: null,
                blb: 100,
                blab: 100 - totalbet,
                bl: 100 + totalWin.toFixed(2),
                tb: totalbet,
                tbb: totalbet,
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
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'PUT, GET, HEAD, POST, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Origin', '*');
    res.json(result);
});

r.get('/', (req, res) => res.json(new SuccessResponseObject('express vercel boiler plate')));

module.exports = r;
