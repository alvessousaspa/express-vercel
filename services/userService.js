const fs = require('fs').promises;
const path = require('path');

const USERS_FILE = path.join(__dirname, '../datas/users.json');

class UserService {
    constructor() {
        this.users = null;
        this.loadUsers();
    }

    async loadUsers() {
        try {
            const data = await fs.readFile(USERS_FILE, 'utf8');
            this.users = JSON.parse(data);
        } catch (error) {
            console.error('Error loading users:', error);
            this.users = { users: {} };
        }
    }

    async saveUsers() {
        try {
            await fs.writeFile(USERS_FILE, JSON.stringify(this.users, null, 2));
        } catch (error) {
            console.error('Error saving users:', error);
        }
    }

    async getUser(userId) {
        if (!this.users) await this.loadUsers();
        return this.users.users[userId];
    }

    async updateBalance(userId, amount) {
        if (!this.users) await this.loadUsers();
        
        const user = this.users.users[userId];
        if (!user) throw new Error('User not found');

        user.balance += amount;
        await this.saveUsers();
        return user.balance;
    }

    async addGameHistory(userId, gameData) {
        if (!this.users) await this.loadUsers();
        
        const user = this.users.users[userId];
        if (!user) throw new Error('User not found');

        user.gameHistory.push({
            timestamp: new Date().toISOString(),
            ...gameData
        });
        
        await this.saveUsers();
    }
}

module.exports = new UserService(); 