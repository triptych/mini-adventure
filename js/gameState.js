export class GameState {
    constructor() {
        this.loadState();
    }

    playerClasses = {
        warrior: {
            emoji: ['⚔️', '🛡️', '🗡️', '🪓', '🔨'],
            titles: ['the Brave', 'the Strong', 'the Mighty', 'the Valiant', 'the Bold']
        },
        wizard: {
            emoji: ['🧙', '🪄', '🔮', '📚', '🎭'],
            titles: ['the Wise', 'the Mystical', 'the Arcane', 'the Learned', 'the Sage']
        },
        rogue: {
            emoji: ['🗡️', '🏹', '🎭', '🕶️', '🌑'],
            titles: ['the Swift', 'the Silent', 'the Cunning', 'the Shadow', 'the Agile']
        },
        cleric: {
            emoji: ['✨', '🕊️', '📿', '🌟', '🙏'],
            titles: ['the Holy', 'the Divine', 'the Blessed', 'the Faithful', 'the Pure']
        },
        ranger: {
            emoji: ['🏹', '🦅', '🌲', '🗺️', '🐺'],
            titles: ['the Wild', 'the Hunter', 'the Tracker', 'the Scout', 'the Wanderer']
        }
    };

    nameFirstParts = ['Storm', 'Dawn', 'Dusk', 'Sky', 'Star', 'Moon', 'Sun', 'Wind', 'Fire', 'Ice', 'Thunder', 'Shadow', 'Light', 'Dark', 'Silver'];
    nameSecondParts = ['blade', 'heart', 'soul', 'spirit', 'walker', 'weaver', 'bringer', 'seeker', 'hunter', 'keeper'];

    defaults = {
        health: 100,
        maxHealth: 100,
        stamina: 10,
        maxStamina: 10,
        gold: 0,
        level: 1,
        xp: 0,
        lastStaminaRecharge: Date.now(),
        highestLevel: 1,
        longestRun: 0,
        currentRun: 0,
        playerClass: null,
        playerEmoji: null,
        playerName: null
    };

    generateRandomName() {
        const first = this.nameFirstParts[Math.floor(Math.random() * this.nameFirstParts.length)];
        const second = this.nameSecondParts[Math.floor(Math.random() * this.nameSecondParts.length)];
        const classInfo = this.playerClasses[this.playerClass];
        const title = classInfo.titles[Math.floor(Math.random() * classInfo.titles.length)];
        return `${first}${second} ${title}`;
    }

    assignRandomClass() {
        const classes = Object.keys(this.playerClasses);
        this.playerClass = classes[Math.floor(Math.random() * classes.length)];
        const classInfo = this.playerClasses[this.playerClass];
        this.playerEmoji = classInfo.emoji[Math.floor(Math.random() * classInfo.emoji.length)];
        this.playerName = this.generateRandomName();
    }

    resetGame() {
        Object.assign(this, this.defaults);
        this.assignRandomClass();
        this.calculateDerivedStats();
        this.saveState();
    }

    loadState() {
        const savedState = localStorage.getItem('gameState');
        if (savedState) {
            const loadedState = JSON.parse(savedState);
            // Check if saved state has player info, if not treat as new game
            if (!loadedState.playerClass || !loadedState.playerEmoji || !loadedState.playerName) {
                this.resetGame();
            } else {
                Object.assign(this, { ...this.defaults, ...loadedState });
            }
        } else {
            this.resetGame();
        }
        this.calculateDerivedStats();
    }

    saveState() {
        const stateToSave = {
            health: this.health,
            maxHealth: this.maxHealth,
            stamina: this.stamina,
            maxStamina: this.maxStamina,
            gold: this.gold,
            level: this.level,
            xp: this.xp,
            lastStaminaRecharge: this.lastStaminaRecharge,
            highestLevel: this.highestLevel,
            longestRun: this.longestRun,
            currentRun: this.currentRun,
            playerClass: this.playerClass,
            playerEmoji: this.playerEmoji,
            playerName: this.playerName
        };
        localStorage.setItem('gameState', JSON.stringify(stateToSave));
    }

    calculateDerivedStats() {
        this.maxHealth = 100 + (this.level - 1) * 10;
        this.xpNeeded = this.level * 100;
    }

    gainXP(amount) {
        this.xp += amount;
        while (this.xp >= this.xpNeeded) {
            this.levelUp();
        }
        this.saveState();
    }

    levelUp() {
        this.level += 1;
        if (this.level > this.highestLevel) {
            this.highestLevel = this.level;
        }
        this.xp -= this.xpNeeded;
        this.calculateDerivedStats();
        this.health = this.maxHealth; // Full heal on level up
    }

    modifyHealth(amount) {
        this.health = Math.max(0, Math.min(this.maxHealth, this.health + amount));
        if (amount < 0) {
            this.currentRun = 0; // Reset run on damage
            if (this.health === 0) {
                this.handleDeath();
            }
        } else {
            this.currentRun++;
            if (this.currentRun > this.longestRun) {
                this.longestRun = this.currentRun;
            }
        }
        this.saveState();
    }

    handleDeath() {
        // Keep achievement stats
        const highestLevel = this.highestLevel;
        const longestRun = this.longestRun;

        // Reset everything else
        Object.assign(this, this.defaults);

        // Restore achievement stats
        this.highestLevel = highestLevel;
        this.longestRun = longestRun;

        // Assign new random class and name
        this.assignRandomClass();
        this.calculateDerivedStats();
    }

    modifyGold(amount) {
        this.gold = Math.max(0, this.gold + amount);
        this.saveState();
    }

    useStamina(amount = 1) {
        if (this.stamina >= amount) {
            this.stamina -= amount;
            this.saveState();
            return true;
        }
        return false;
    }

    rechargeStamina() {
        const now = Date.now();
        const timePassed = now - this.lastStaminaRecharge;
        const staminaToAdd = Math.floor(timePassed / (3 * 60 * 1000)); // 3 minutes per stamina

        if (staminaToAdd > 0) {
            this.stamina = Math.min(this.maxStamina, this.stamina + staminaToAdd);
            this.lastStaminaRecharge = now - (timePassed % (3 * 60 * 1000));
            this.saveState();
        }

        return this.getNextStaminaTime();
    }

    getNextStaminaTime() {
        if (this.stamina >= this.maxStamina) return null;
        const now = Date.now();
        const timeSinceLastRecharge = now - this.lastStaminaRecharge;
        const timeToNextStamina = (3 * 60 * 1000) - (timeSinceLastRecharge % (3 * 60 * 1000));
        return Math.ceil(timeToNextStamina / 1000);
    }

    canAdventure() {
        return this.stamina > 0 && this.health > 0;
    }

    getShareText() {
        return `🎮 Mini Adventure Stats:\n${this.playerEmoji} ${this.playerName}\nLevel ${this.level} ${this.playerClass}\n❤️ ${this.health}/${this.maxHealth} | 💰 ${this.gold} gold\n🏃‍♂️ Longest Run: ${this.longestRun} | 👑 Highest Level: ${this.highestLevel}`;
    }
}
