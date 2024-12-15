import { GameState } from './gameState.js';
import { EncounterManager } from './encounters.js';
import { UIManager } from './uiManager.js';

class Game {
    constructor() {
        this.gameState = new GameState();
        this.encounterManager = new EncounterManager(this.gameState);
        this.uiManager = new UIManager(this.gameState);

        this.initializeGame();
    }

    initializeGame() {
        // Set up stamina regeneration timer
        setInterval(() => {
            this.gameState.rechargeStamina();
            this.uiManager.updateUI();
        }, 1000);

        // Set up adventure button handler
        this.uiManager.setAdventureButtonHandler(async () => {
            if (this.gameState.useStamina()) {
                const encounter = this.encounterManager.generateEncounter();
                await this.uiManager.showEncounter(encounter);
            }
        });
    }
}

// Initialize game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new Game();
});
