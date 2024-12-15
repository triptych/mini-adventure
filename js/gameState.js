export class GameState {
    constructor() {
        this.loadState();
    }

    defaults = {
        health: 100,
        maxHealth: 100,
        stamina: 10,
        maxStamina: 10,
        gold: 0,
        level: 1,
        xp: 0,
        lastStaminaRecharge: Date.now()
    };

    loadState() {
        const savedState = localStorage.getItem('gameState');
        if (savedState) {
            const loadedState = JSON.parse(savedState);
            Object.assign(this, { ...this.defaults, ...loadedState });
        } else {
            Object.assign(this, this.defaults);
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
            lastStaminaRecharge: this.lastStaminaRecharge
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
        this.xp -= this.xpNeeded;
        this.calculateDerivedStats();
        this.health = this.maxHealth; // Full heal on level up
    }

    modifyHealth(amount) {
        this.health = Math.max(1, Math.min(this.maxHealth, this.health + amount));
        this.saveState();
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
        return this.stamina > 0 && this.health > 1;
    }
}
