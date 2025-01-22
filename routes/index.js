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
    const cs = parseFloat(req.headers.cs);
    const ml = parseInt(req.headers.ml);
    const totalbet = cs * ml * 5;
    
    const reels = [generateReel(), generateReel(), generateReel()];
    const { lineWins, totalWin } = calculateLineWins(reels);
    
    // Calcular ganho real considerando aposta
    const realWin = totalWin * cs * ml;
    
    // Gerar hashr mais preciso
    const hashr = generateHashr(reels, lineWins, realWin);
    
    const result = {
        dt: {
            si: {
                wc: countWilds(reels),
                ist: false,
                itw: totalWin > 0,
                fws: 0,
                wp: lineWins ? generateWinningPositions(lineWins) : null,
                orl: reels.flat(),
                lw: Object.keys(lineWins).length > 0 ? lineWins : null,
                irs: false,
                gwt: -1,
                ctw: realWin,
                cwc: countWilds(reels),
                pcwc: countWilds(reels),
                rwsp: generateRwsp(lineWins, realWin),
                hashr: hashr,
                ml: ml,
                cs: cs,
                rl: reels.flat(),
                sid: "1814402670505630721",
                psid: "1814402670505630721",
                st: 1,
                nst: 1,
                pf: 1,
                aw: 0.00,
                wid: 0,
                wt: "C",
                wk: "0_C",
                wbn: null,
                wfg: null,
                blb: 100,
                blab: 100 - totalbet,
                bl: 100,
                tb: totalbet,
                tbb: totalbet,
                tw: realWin.toFixed(2),
                np: (realWin - totalbet).toFixed(2),
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

// Funções auxiliares
function countWilds(reels) {
    return reels.flat().filter(s => s === 0).length;
}

function generateRwsp(lineWins, totalWin) {
    if (Object.keys(lineWins).length === 0) return null;
    
    const rwsp = {};
    Object.keys(lineWins).forEach(line => {
        rwsp[line] = lineWins[line] * 1.666; // Multiplicador do Wild
    });
    return rwsp;
}

function generateHashr(reels, lineWins, totalWin) {
    // Implementar lógica do hashr conforme documentação
    return `0:${reels[0].join(';')}#${reels[1].join(';')}#${reels[2].join(';')}#MV#3.0#MT#1#MG#${totalWin}#`;
}

r.get('/get-game-page', async (req, res) => {
    const url = 'https://m.xn--sjffdsafdsfsadfasd-8sb.online/126/index.html?ot=B5DAD969-AC52-4FB8-839E-60CA46B19978&btt=1&ops=s3-pg-09470d18-5854-4225-8dbd-77f83d1ca624&l=pt&or=static.xn--sjffdsafdsfsadfasd-8sb.online';

    try {
        const response = await axios.get(url);
        res.send(response.data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch the game page' });
    }
});

r.get('/', (req, res) => res.json(new SuccessResponseObject('express vercel boiler plate')));

module.exports = r;
