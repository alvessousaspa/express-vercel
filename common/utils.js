function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

function generateReel() {
    const symbols = [0, 2, 3, 4, 5, 6, 7]; // Oranges, Firecrackers, Red Packets, Purse, Lucky Charm, Gold Ingot, Wild
    return Array.from({ length: 3 }, () => symbols[getRandomInt(symbols.length)]);
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
    const payTable = {
        0: 3,
        2: 5,
        3: 8,
        4: 10,
        5: 25,
        6: 100,
        7: 250
    };
    let totalWin = 0;

    // Checking horizontal lines
    for (let line = 0; line < 3; line++) {
        const symbol = reels[0][line];
        if (reels[1][line] === symbol && reels[2][line] === symbol) {
            const winAmount = payTable[symbol];
            lineWins[line + 1] = winAmount;
            totalWin += winAmount;
        }
    }

    return { lineWins, totalWin };
}

module.exports = {
    getRandomInt,
    generateReel,
    generateWinningPositions,
    calculateLineWins
};

