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
const userService = require('../services/userService');

const r = Router();

r.use('/demo', demo);

r.post('/web-api/auth/session/v2/verifySession', async (req, res) => {
    try {
        const { traceId } = req.query;
        const userId = req.headers['user-id'];
        const user = await userService.getUser(userId);
        
        const baseData = require('../datas/verifyssesion.json');
        
        // Atualizar dados dinâmicos mantendo a estrutura original
        if (user) {
            baseData.dt.pid = user.id;
            baseData.dt.nkn = user.nickname;
            baseData.dt.tk = user.session.token;
            baseData.dt.cc = user.currency;
        }

        res.header('Access-Control-Allow-Credentials', 'true');
        res.header('Access-Control-Allow-Methods', 'PUT, GET, HEAD, POST, DELETE, OPTIONS');
        res.header('Access-Control-Allow-Origin', '*');
        res.json(baseData);
    } catch (error) {
        console.error('Error in verifySession:', error);
        res.json(require('../datas/verifyssesion.json')); // Fallback para dados estáticos
    }
});

r.post('/web-api/auth/session/v2/verifyOperatorPlayerSession', async (req, res) => {
    try {
        const { traceId } = req.query;
        const userId = req.headers['user-id'];
        const user = await userService.getUser(userId);
        
        const baseData = require('../datas/verifyOperatorPlayerSession.json');
        
        // Atualizar dados dinâmicos mantendo a estrutura original
        if (user) {
            baseData.dt.pid = user.id;
            baseData.dt.nkn = user.nickname;
            baseData.dt.tk = user.session.token;
            baseData.dt.cc = user.currency;
        }

        res.header('Access-Control-Allow-Credentials', 'true');
        res.header('Access-Control-Allow-Methods', 'PUT, GET, HEAD, POST, DELETE, OPTIONS');
        res.header('Access-Control-Allow-Origin', '*');
        res.json(baseData);
    } catch (error) {
        console.error('Error in verifyOperatorPlayerSession:', error);
        res.json(require('../datas/verifyOperatorPlayerSession.json')); // Fallback para dados estáticos
    }
});

r.post('/web-api/game-proxy/v2/GameName/Get', (req, res) => {
    const { traceId } = req.query;
    const data = require('../datas/GameName.json');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'PUT, GET, HEAD, POST, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Origin', '*');
    res.send(data);
});

r.post('/game-api/fortune-tiger/v2/GameInfo/Get', async (req, res) => {
    try {
        const { traceId } = req.query;
        const userId = req.headers['user-id'];
        const user = await userService.getUser(userId);
        
        const baseData = require('../datas/GameInfo.json');
        
        // Atualizar dados dinâmicos mantendo a estrutura original
        if (user) {
            baseData.dt.ls.si.bl = user.balance;
            baseData.dt.ls.si.blb = user.balance;
            baseData.dt.ls.si.blab = user.balance;
            baseData.dt.cc = user.currency;
        }

        res.header('Access-Control-Allow-Credentials', 'true');
        res.header('Access-Control-Allow-Methods', 'PUT, GET, HEAD, POST, DELETE, OPTIONS');
        res.header('Access-Control-Allow-Origin', '*');
        res.json(baseData);
    } catch (error) {
        console.error('Error in GameInfo:', error);
        res.json(require('../datas/GameInfo.json')); // Fallback para dados estáticos
    }
});

r.post('/web-api/game-proxy/v2/Resources/GetByResourcesTypeIds', (req, res) => {
    const { traceId } = req.query;
    const data = require('../datas/GetByResourcesTypeIds.json');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'PUT, GET, HEAD, POST, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Origin', '*');
    res.send(data);
});

r.post('/game-api/fortune-tiger/v2/Spin', async (req, res) => {
    try {
        const userId = req.headers['user-id']; // Você precisa enviar o ID do usuário no header
        if (!userId) {
            return res.status(401).json({
                err: {
                    code: 401,
                    message: "User not authenticated"
                }
            });
        }

        const user = await userService.getUser(userId);
        if (!user) {
            return res.status(404).json({
                err: {
                    code: 404,
                    message: "User not found"
                }
            });
        }

        const cs = parseFloat(req.body.cs);
        const ml = parseInt(req.body.ml);
        
        if (isNaN(cs) || isNaN(ml) || cs <= 0 || ml <= 0) {
            return res.status(400).json({
                err: {
                    code: 400,
                    message: "Invalid bet parameters"
                }
            });
        }
        
        const totalbet = cs * ml * 5;
        
        // Verificar se o usuário tem saldo suficiente
        if (user.balance < totalbet) {
            return res.status(400).json({
                err: {
                    code: 400,
                    message: "Insufficient balance"
                }
            });
        }

        const reels = [generateReel(), generateReel(), generateReel()];
        const { lineWins, totalWin } = calculateLineWins(reels);
        const realWin = totalWin * cs * ml;
        
        // Atualizar saldo do usuário
        await userService.updateBalance(userId, realWin - totalbet);
        
        // Registrar histórico do jogo
        await userService.addGameHistory(userId, {
            gameId: "fortune-tiger",
            bet: totalbet,
            win: realWin,
            balanceAfter: user.balance + realWin - totalbet
        });

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
                    blb: user.balance,
                    blab: user.balance - totalbet,
                    bl: user.balance + realWin - totalbet,
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
    } catch (error) {
        console.error('Error in spin:', error);
        res.status(500).json({
            err: {
                code: 500,
                message: "Internal server error"
            }
        });
    }
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
