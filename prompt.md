# Mini Adventure RPG - Design Document 🎮

## Game Overview
A cozy, casual mobile-friendly RPG with a whimsical emoji-based art style. The game emphasizes relaxed gameplay with a single-button adventure mechanic and automatic resource regeneration.

## Visual Style 🎨
- Emoji-based graphics for a friendly, approachable feel
- Warm, inviting color palette
- Vertically oriented layout optimized for mobile
- Smooth animations for state changes
- Examples:
  - Player: 🧙‍♂️
  - Monsters: 👻 👾 🐉 🦇
  - Treasures: 💎 🗝️ 💰
  - Trader: 🏪
  - Inn: 🏠
  - Quest giver: ❗

## Core Game Loop 🔄
1. Player clicks "Adventure" button
2. Short countdown animation plays (3-2-1)
3. Random encounter occurs
4. Resources update
5. Stamina regenerates over time
6. Repeat

## Systems Design

### Player Stats 📊
- Health: 100 base (increases with level)
- Stamina: 10 base (1 per adventure)
- Gold: 0 base
- XP: 0 base
- Level: 1 base

### Stamina System ⚡
- Cost: 1 stamina per adventure
- Regeneration: 1 stamina every 3 minutes
- Max stamina: 10
- Visual indicator of next stamina point
- Cannot adventure without stamina

### Health System ❤️
- Base health: 100
- Health increase per level: +10
- Death prevention: Can't adventure at 1 HP
- Recovery: Full restore at inn

### Gold System 💰
- Earned through:
  - Treasure finds (10-50)
  - Quest completion (25-100)
- Spent on:
  - Inn stays (20 gold)
  - Trader items
  - No gold debt allowed

### XP & Leveling System 📈
- XP gained from all encounters:
  - Monsters: 5-15 XP
  - Treasures: 3-8 XP
  - Trading: 2-5 XP
  - Inn: 1-3 XP
  - Quests: 10-25 XP
- Level up formula: Current_Level * 100 XP needed
- Auto health increase on level up

## Encounter Types

### Monster Encounters 👾
- Frequency: 30%
- Health damage: 5-20
- XP reward: 5-15
- Possible monsters:
  - Slime 🟢 (low damage)
  - Ghost 👻 (medium damage)
  - Dragon 🐉 (high damage)

### Treasure Finds 💎
- Frequency: 20%
- Gold reward: 10-50
- XP reward: 3-8
- Types:
  - Small pouch 👝
  - Treasure chest 📦
  - Ancient artifact 🏺

### Trader Encounters 🏪
- Frequency: 15%
- Stock:
  - Health potions ❤️ (30 gold)
  - Stamina potions ⚡ (40 gold)
  - Equipment 🗡️ (100 gold)
- XP for successful trade: 2-5

### Inn Rests 🏠
- Frequency: 10%
- Cost: 20 gold
- Effect: Full health restore
- XP reward: 1-3

### Quest Encounters ❗
- Frequency: 25%
- Types:
  - Fetch quests
  - Defeat quests
  - Collection quests
- Rewards:
  - Gold: 25-100
  - XP: 10-25

## Technical Requirements 🔧

### Performance
- Smooth animations (60fps)
- Instant response to button press
- Efficient state management
- Offline functionality
- Auto-save

### Mobile Optimization
- Touch-friendly UI
- Large tap targets
- Portrait orientation
- Responsive layout
- Pull-to-refresh support

### State Management
- Persistent game state
- Real-time stamina updates
- Transaction safety
- Error recovery

## UI/UX Guidelines 📱

### Layout
```
+-----------------+
|    Stats Bar    |
|  HP/Gold/Level  |
+-----------------+
|                 |
|    Main Game    |
|      Area      |
|                 |
|   Encounters    |
|     Display    |
|                 |
+-----------------+
|    Stamina     |
|  Regeneration  |
|     Timer      |
+-----------------+
|   ADVENTURE!   |
|    Button      |
+-----------------+
```

### Interactive Elements
- Adventure button:
  - Large and prominent
  - Clear active/inactive states
  - Haptic feedback
- Countdown animation:
  - Center screen
  - Clear numbers
  - Smooth transitions
- Result display:
  - Emoji-based
  - Clear outcomes
  - Reward animations

### Accessibility
- High contrast text
- Large tap targets
- Clear feedback
- Sound optional
- Colorblind friendly

## Update Considerations 🔄
- Maintain game balance
- Preserve player progress
- Backward compatibility
- Clear update paths
- Data migration support

## Future Expansion Possibilities 🌟
- New encounter types
- Achievement system
- Daily quests
- Social features
- Seasonal events
- Collectible emojis
- Character classes
