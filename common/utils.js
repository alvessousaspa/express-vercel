function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

function generateWinningPositions() {
    const positions = {};
    for (let i = 1; i <= 5; i++) {
        positions[i] = [getRandomInt(9), getRandomInt(9), getRandomInt(9)];
    }
    return positions;
}

function generateLineWins(symbols) {
    const lineWins = {};
    const winValues = {
        '0': 250, // Wild
        '1': 100, // Gold Ingot
        '2': 25,  // Lucky Charm
        '3': 10,  // Purse
        '4': 8,   // Red Packet
        '5': 5,   // Firecrackers
        '6': 3    // Oranges
    };

    // Determinar as linhas vencedoras
    const lines = [
        [0, 0, 0], [1, 1, 1], [2, 2, 2], // linhas horizontais
        [0, 1, 2], [2, 1, 0]  // linhas diagonais
    ];

    for (let i = 1; i <= 5; i++) {
        const line = lines[i - 1];
        const symbol = symbols[line[0]];
        let winAmount = 0;

        // Se todos os símbolos na linha forem iguais, é uma linha vencedora
        if (symbols[line[0]] === symbols[line[1]] && symbols[line[1]] === symbols[line[2]]) {
            winAmount = winValues[symbol] || 0;
        }

        lineWins[i] = winAmount.toFixed(1);
    }

    return lineWins;
}

function calculateTotalWin(lineWins) {
    return Object.values(lineWins).reduce((acc, win) => acc + parseFloat(win), 0).toFixed(2);
}

module.exports = {
    getRandomInt,
    generateWinningPositions,
    generateLineWins,
    calculateTotalWin
};
