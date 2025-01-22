function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

function generateReel() {
    // Definir pesos para cada símbolo
    const symbols = [
        { id: 0, weight: 1 },  // Wild (mais raro)
        { id: 2, weight: 8 },  // Laranja (mais comum)
        { id: 3, weight: 6 },  // Enfeite Verde
        { id: 4, weight: 6 },  // Foguete
        { id: 5, weight: 5 },  // Envelope
        { id: 6, weight: 4 },  // Saco de Moedas
        { id: 7, weight: 2 }   // Lingote (mais raro)
    ];
    
    // Criar array com símbolos repetidos conforme seus pesos
    const weightedSymbols = symbols.flatMap(symbol => 
        Array(symbol.weight).fill(symbol.id)
    );
    
    return Array.from({ length: 3 }, () => 
        weightedSymbols[getRandomInt(weightedSymbols.length)]
    );
}

function generateWinningPositions(reels) {
    const positions = {};
    for (let i = 0; i < reels.length; i++) {
        const reel = reels[i];
        const position = getRandomInt(3);
        positions[i + 1] = reel[position];
    }
    return positions;
}

function calculateLineWins(reels) {
    const lineWins = {};
    let totalWin = 0;

    // Definir as linhas de pagamento
    const paylines = [
        [[0,0], [1,0], [2,0]], // Linha superior
        [[0,1], [1,1], [2,1]], // Linha do meio
        [[0,2], [1,2], [2,2]], // Linha inferior
        [[0,0], [1,1], [2,2]], // Diagonal 1
        [[0,2], [1,1], [2,0]]  // Diagonal 2
    ];

    paylines.forEach((line, index) => {
        const symbols = line.map(([x, y]) => reels[x][y]);
        const win = calculateWinForLine(symbols);
        if (win > 0) {
            lineWins[index + 1] = win;
            totalWin += win;
        }
    });

    return { lineWins, totalWin };
}

function calculateWinForLine(symbols) {
    // Verificar se há Wild na linha
    const hasWild = symbols.includes(0);
    
    // Se todos os símbolos são iguais ou há Wild
    if (hasWild || symbols.every(s => s === symbols[0])) {
        const baseSymbol = hasWild ? 
            symbols.find(s => s !== 0) || 0 : 
            symbols[0];
            
        return payTable[baseSymbol];
    }
    
    return 0;
}

const payTable = {
    0: 250,  // Wild
    2: 3,    // Laranja
    3: 8,    // Enfeite Verde
    4: 5,    // Foguete
    5: 8,    // Envelope
    6: 10,   // Saco de Moedas
    7: 100   // Lingote
};

module.exports = {
    getRandomInt,
    generateReel,
    generateWinningPositions,
    calculateLineWins
};

