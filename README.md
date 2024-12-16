# Mini Adventure

A simple yet engaging browser-based adventure game where players can embark on random encounters, gain experience, collect gold, and level up.

## Features

- Character Classes System
  - Choose from Warrior, Wizard, Rogue, Cleric, or Ranger
  - Each class has unique emojis and titles
  - Procedurally generated character names
- Real-time stamina system with automatic regeneration
- Rich encounter system:
  - Monster battles with varying difficulty
  - Treasure discoveries
  - Trading posts with various items (Health Potions, Stamina Potions, Equipment)
  - Inns for rest and healing
  - Quest opportunities
  - Mystical shrines
  - Hidden traps
- Stats tracking
  - Health and Max Health
  - Gold collection
  - Level progression
  - Experience (XP) gains
  - Achievements (Highest Level, Longest Run)
- Death and Rebirth system
  - Reincarnate as a new character class
  - Retain achievement progress
- Stats sharing feature for comparing with friends
- Simple and intuitive user interface
- Browser-based gameplay, no installation required
- Automatic game state saving

## How to Play

1. Open `index.html` in a web browser
2. Click the "Adventure!" button to start encountering random events
3. Manage your stamina and health as you progress
4. Collect gold and gain experience to level up
5. Visit traders to buy helpful items
6. Rest at inns to restore health
7. Try to achieve the highest level and longest survival run!

## Game Mechanics

- **Character Class**: Determines your character's theme and appearance
- **Stamina**: Regenerates over time, required for adventures
- **Health**: Manage your health points to stay alive
- **Gold**: Collect gold through various encounters and spend at traders
- **Experience**: Gain XP to level up and become stronger
- **Level**: Increase your level to unlock better stats
- **Achievements**: Track your highest level and longest survival run

## Technical Details

The game is built using vanilla JavaScript with a modular architecture:

- `main.js`: Main game initialization and setup
- `gameState.js`: Manages game state and progression
- `encounters.js`: Contains all possible random encounters
- `uiManager.js`: Handles UI updates and interactions

## Running Locally

Simply clone the repository and open `index.html` in a web browser. No build process or server required!

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Repository

[GitHub Repository](https://github.com/triptych/mini-adventure)
