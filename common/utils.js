// utils.js
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

function generateLineWins() {
    const lineWins = {};
    for (let i = 1; i <= 5; i++) {
        lineWins[i] = (Math.random() * 10).toFixed(1); // Valores entre 0 e 10, com uma casa decimal
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
