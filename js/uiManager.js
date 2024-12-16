export class UIManager {
    constructor(gameState) {
        this.gameState = gameState;
        this.initializeElements();
        this.updateUI();
        this.setupStatsPanel();
    }

    initializeElements() {
        // Stats elements
        this.healthEl = document.getElementById('health');
        this.maxHealthEl = document.getElementById('max-health');
        this.goldEl = document.getElementById('gold');
        this.levelEl = document.getElementById('level');
        this.xpEl = document.getElementById('xp');
        this.xpNeededEl = document.getElementById('xp-needed');
        this.staminaEl = document.getElementById('stamina');
        this.maxStaminaEl = document.getElementById('max-stamina');
        this.nextStaminaEl = document.getElementById('next-stamina');

        // Achievement stats
        this.highestLevelEl = document.getElementById('highest-level');
        this.longestRunEl = document.getElementById('longest-run');

        // Player info elements
        this.playerEmojiEl = document.getElementById('player-emoji');
        this.playerNameEl = document.getElementById('player-name');
        this.playerClassEl = document.getElementById('player-class');
        this.playerEmojiStatsEl = document.getElementById('player-emoji-stats');
        this.playerNameStatsEl = document.getElementById('player-name-stats');
        this.playerClassStatsEl = document.getElementById('player-class-stats');

        // Game area elements
        this.encounterEmojiEl = document.getElementById('encounter-emoji');
        this.encounterTextEl = document.getElementById('encounter-text');
        this.countdownEl = document.getElementById('countdown');
        this.countdownNumberEl = document.getElementById('countdown-number');

        // Button
        this.adventureButton = document.getElementById('adventure-button');

        // Stats panel elements
        this.statsButton = document.getElementById('stats-button');
        this.gamePanel = document.getElementById('game-panel');
        this.saveButton = document.getElementById('save-button');
        this.loadButton = document.getElementById('load-button');
        this.newGameButton = document.getElementById('new-game-button');
        this.shareButton = document.getElementById('share-button');
    }

    setupStatsPanel() {
        this.statsButton.addEventListener('click', () => {
            this.gamePanel.classList.toggle('flipped');
        });

        this.saveButton.addEventListener('click', () => {
            this.gameState.saveState();
            this.encounterEmojiEl.textContent = '💾';
            this.encounterTextEl.textContent = 'Game saved successfully!';
            this.gamePanel.classList.remove('flipped');
        });

        this.loadButton.addEventListener('click', () => {
            this.gameState.loadState();
            this.updateUI();
            this.encounterEmojiEl.textContent = '📂';
            this.encounterTextEl.textContent = 'Game loaded successfully!';
            this.gamePanel.classList.remove('flipped');
        });

        this.newGameButton.addEventListener('click', () => {
            if (confirm('Start a new game? This will reset all progress!')) {
                this.gameState.resetGame();
                this.updateUI();
                this.encounterEmojiEl.textContent = '🎲';
                this.encounterTextEl.textContent = `A new adventure begins! Welcome, ${this.gameState.playerName}!`;
                this.gamePanel.classList.remove('flipped');
            }
        });

        this.shareButton.addEventListener('click', async () => {
            const shareText = this.gameState.getShareText();

            try {
                if (navigator.share) {
                    await navigator.share({
                        title: 'Mini Adventure Stats',
                        text: shareText
                    });
                } else {
                    await navigator.clipboard.writeText(shareText);
                    this.encounterEmojiEl.textContent = '📋';
                    this.encounterTextEl.textContent = 'Stats copied to clipboard!';
                }
            } catch (err) {
                console.error('Share failed:', err);
                // Fallback to clipboard
                try {
                    await navigator.clipboard.writeText(shareText);
                    this.encounterEmojiEl.textContent = '📋';
                    this.encounterTextEl.textContent = 'Stats copied to clipboard!';
                } catch (clipErr) {
                    console.error('Clipboard failed:', clipErr);
                    this.encounterEmojiEl.textContent = '❌';
                    this.encounterTextEl.textContent = 'Failed to share stats';
                }
            }

            this.gamePanel.classList.remove('flipped');
        });
    }

    updateUI() {
        // Update stats
        this.healthEl.textContent = Math.ceil(this.gameState.health);
        this.maxHealthEl.textContent = this.gameState.maxHealth;
        this.goldEl.textContent = this.gameState.gold;
        this.levelEl.textContent = this.gameState.level;
        this.xpEl.textContent = this.gameState.xp;
        this.xpNeededEl.textContent = this.gameState.xpNeeded;
        this.staminaEl.textContent = this.gameState.stamina;
        this.maxStaminaEl.textContent = this.gameState.maxStamina;

        // Update achievement stats
        this.highestLevelEl.textContent = this.gameState.highestLevel;
        this.longestRunEl.textContent = this.gameState.longestRun;

        // Update player info
        if (this.playerEmojiEl) {
            this.playerEmojiEl.textContent = this.gameState.playerEmoji;
            this.playerNameEl.textContent = this.gameState.playerName;
            this.playerClassEl.textContent = this.gameState.playerClass;
        }

        // Update player stats panel
        if (this.playerEmojiStatsEl) {
            this.playerEmojiStatsEl.textContent = this.gameState.playerEmoji;
            this.playerNameStatsEl.textContent = this.gameState.playerName;
            this.playerClassStatsEl.textContent = this.gameState.playerClass;
        }

        // Update button state
        this.adventureButton.disabled = !this.gameState.canAdventure();

        // Update next stamina timer
        this.updateStaminaTimer();
    }

    updateStaminaTimer() {
        const nextStamina = this.gameState.getNextStaminaTime();
        if (nextStamina === null) {
            this.nextStaminaEl.textContent = 'Full';
            return;
        }

        const minutes = Math.floor(nextStamina / 60);
        const seconds = nextStamina % 60;
        this.nextStaminaEl.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }

    async showEncounter(encounter) {
        // Show countdown
        this.countdownEl.classList.remove('hidden');
        this.encounterEmojiEl.textContent = '🎲';
        this.encounterTextEl.textContent = 'Rolling the dice...';

        // Countdown animation
        for (let i = 3; i > 0; i--) {
            this.countdownNumberEl.textContent = i;
            await new Promise(resolve => setTimeout(resolve, 600));
        }

        // Hide countdown and show encounter
        this.countdownEl.classList.add('hidden');
        this.encounterEmojiEl.textContent = encounter.emoji;
        this.encounterTextEl.textContent = encounter.text;

        // Update UI with new game state
        this.updateUI();
    }

    setAdventureButtonHandler(handler) {
        this.adventureButton.addEventListener('click', async () => {
            if (this.gameState.canAdventure()) {
                this.adventureButton.disabled = true;
                await handler();
                this.adventureButton.disabled = !this.gameState.canAdventure();
            }
        });
    }
}
