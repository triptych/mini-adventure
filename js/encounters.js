export class EncounterManager {
    constructor(gameState) {
        this.gameState = gameState;
    }

    encounters = {
        monster: {
            chance: 0.3,
            emoji: ['👻', '🐉', '👾', '🦇', '🧟'],
            handler: () => {
                const damage = Math.floor(Math.random() * 16) + 5; // 5-20 damage
                const xp = Math.floor(Math.random() * 11) + 5; // 5-15 XP
                this.gameState.modifyHealth(-damage);
                this.gameState.gainXP(xp);
                return {
                    emoji: this.encounters.monster.emoji[Math.floor(Math.random() * this.encounters.monster.emoji.length)],
                    text: `You encountered a monster! Took ${damage} damage and gained ${xp} XP!`
                };
            }
        },
        treasure: {
            chance: 0.2,
            emoji: ['💎', '💰', '🗝️', '📦'],
            handler: () => {
                const gold = Math.floor(Math.random() * 41) + 10; // 10-50 gold
                const xp = Math.floor(Math.random() * 6) + 3; // 3-8 XP
                this.gameState.modifyGold(gold);
                this.gameState.gainXP(xp);
                return {
                    emoji: this.encounters.treasure.emoji[Math.floor(Math.random() * this.encounters.treasure.emoji.length)],
                    text: `You found treasure! Gained ${gold} gold and ${xp} XP!`
                };
            }
        },
        trader: {
            chance: 0.15,
            emoji: ['🏪'],
            handler: () => {
                const items = [
                    { name: 'Health Potion ❤️', cost: 30, effect: () => this.gameState.modifyHealth(50) },
                    { name: 'Stamina Potion ⚡', cost: 40, effect: () => this.gameState.useStamina(-3) },
                    { name: 'Equipment 🗡️', cost: 100, effect: () => this.gameState.gainXP(25) }
                ];
                const item = items[Math.floor(Math.random() * items.length)];
                const xp = Math.floor(Math.random() * 4) + 2; // 2-5 XP

                if (this.gameState.gold >= item.cost) {
                    this.gameState.modifyGold(-item.cost);
                    item.effect();
                    this.gameState.gainXP(xp);
                    return {
                        emoji: '🏪',
                        text: `Trader offered ${item.name}! Spent ${item.cost} gold and gained ${xp} XP!`
                    };
                } else {
                    return {
                        emoji: '🏪',
                        text: `Trader offered ${item.name} for ${item.cost} gold, but you couldn't afford it!`
                    };
                }
            }
        },
        inn: {
            chance: 0.1,
            emoji: ['🏠'],
            handler: () => {
                const cost = 20;
                const xp = Math.floor(Math.random() * 3) + 1; // 1-3 XP

                if (this.gameState.gold >= cost) {
                    this.gameState.modifyGold(-cost);
                    this.gameState.modifyHealth(this.gameState.maxHealth);
                    this.gameState.gainXP(xp);
                    return {
                        emoji: '🏠',
                        text: `Rested at the inn! Spent ${cost} gold, restored full health, and gained ${xp} XP!`
                    };
                } else {
                    return {
                        emoji: '🏠',
                        text: `Found an inn but couldn't afford the ${cost} gold stay...`
                    };
                }
            }
        },
        quest: {
            chance: 0.25,
            emoji: ['❗', '📜', '⚔️'],
            handler: () => {
                const gold = Math.floor(Math.random() * 76) + 25; // 25-100 gold
                const xp = Math.floor(Math.random() * 16) + 10; // 10-25 XP
                this.gameState.modifyGold(gold);
                this.gameState.gainXP(xp);
                return {
                    emoji: this.encounters.quest.emoji[Math.floor(Math.random() * this.encounters.quest.emoji.length)],
                    text: `Completed a quest! Earned ${gold} gold and ${xp} XP!`
                };
            }
        }
    };

    generateEncounter() {
        let random = Math.random();
        let cumulativeChance = 0;

        for (const [type, encounter] of Object.entries(this.encounters)) {
            cumulativeChance += encounter.chance;
            if (random <= cumulativeChance) {
                return encounter.handler();
            }
        }

        // Fallback to quest if somehow nothing was selected
        return this.encounters.quest.handler();
    }
}
