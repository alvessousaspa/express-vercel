const { Router } = require('express');
const { SuccessResponseObject } = require('../common/http');
const demo = require('./demo.route');
const verifySessionJson = '../datas/verifyssesion.json';
const verifyOperatorPlayerSessionJson = '../datas/verifyOperatorPlayerSession.json';
const GameName = '../datas/GameName.json';
const GameInfo = '../datas/GameInfo.json';
const GetByResourcesTypeIds = '../datas/GetByResourcesTypeIds.json';
const Spin = '../datas/Spin.json';
const { generateReel, calculateLineWins, getRandomInt, generateWinningPositions, paylines } = require('../common/utils');

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
    
    // Validar parâmetros de entrada
    if (isNaN(cs) || isNaN(ml) || cs <= 0 || ml <= 0) {
        return res.status(400).json({
            err: {
                code: 400,
                message: "Invalid bet parameters"
            }
        });
    }
    
    const totalbet = cs * ml * 5;
    
    const reels = [generateReel(), generateReel(), generateReel()];
    const { lineWins, totalWin } = calculateLineWins(reels);
    
    // Calcular ganho real considerando aposta
    const realWin = totalWin * cs * ml;
    
    // Gerar hashr mais preciso
    const hashr = generateHashr(reels, lineWins, realWin);
    
    const wildCount = countWilds(reels);
    const winningPositions = generateWinningPositions(reels, paylines);
    
    const sessionId = generateSessionId();
    
    const result = {
        dt: {
            si: {
                wc: wildCount,
                ist: false,
                itw: realWin > 0,
                fws: 0,
                wp: winningPositions,
                orl: reels.flat(),
                lw: Object.keys(lineWins).length > 0 ? lineWins : null,
                irs: false,
                gwt: -1,
                ctw: realWin,
                cwc: wildCount,
                pcwc: wildCount,
                rwsp: generateRwsp(lineWins, realWin),
                hashr: hashr,
                ml: ml,
                cs: cs,
                rl: reels.flat(),
                sid: sessionId,
                psid: sessionId,
                st: 1,
                nst: 1,
                pf: 1,
                aw: realWin,
                wid: 0,
                wt: "C",
                wk: "0_C",
                wbn: null,
                wfg: null,
                blb: 100,
                blab: 100 - totalbet,
                bl: 100 + realWin - totalbet,
                tb: totalbet,
                tbb: totalbet,
                tw: realWin,
                np: (realWin - totalbet),
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

// Funções auxiliares
function countWilds(reels) {
    return reels.flat().filter(s => s === 0).length;
}

function generateRwsp(lineWins, realWin) {
    if (Object.keys(lineWins).length === 0) return null;
    
    const rwsp = {};
    Object.entries(lineWins).forEach(([line, win]) => {
        // Se o ganho for maior que o normal, aplicar multiplicador do Wild
        rwsp[line] = win * 1.666666667; // Usar valor mais preciso do multiplicador
    });
    return rwsp;
}

function generateHashr(reels, lineWins, totalWin) {
    let hashr = `0:${reels[0].join(';')}#${reels[1].join(';')}#${reels[2].join(';')}`;
    
    // Adicionar informações de Wild se houver ganhos
    if (Object.keys(lineWins).length > 0) {
        Object.entries(lineWins).forEach(([line, win]) => {
            const lineSymbols = paylines[parseInt(line) - 1].map(([x, y]) => reels[x][y]);
            if (lineSymbols.includes(0)) { // Se tem Wild na linha
                hashr += `#R#7#${line}${line}${line}`;
            }
            hashr += `#R#${line}#${win.toFixed(2)}`;
        });
    }
    
    hashr += `#MV#3.0#MT#1#MG#${totalWin.toFixed(2)}#`;
    return hashr;
}

function generateSessionId() {
    return Date.now().toString() + Math.random().toString(36).substring(2, 15);
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
