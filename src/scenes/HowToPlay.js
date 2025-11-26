export class HowToPlay extends Phaser.Scene {

    constructor() {
        super('HowToPlay');
    }

    create() {
        const { width, height } = this.cameras.main;

        // Background
        this.add.rectangle(width / 2, height / 2, width, height, 0x000000);

        // Title removed per user request

        // Create scrollable container
        const contentHeight = 2500; // Total height of all content
        const scrollArea = this.add.container(0, 0);
        scrollArea.setSize(width, height - 100);
        scrollArea.setPosition(0, 80);
        
        // Scrollable content container
        this.contentContainer = this.add.container(width / 2, 0);
        scrollArea.add(this.contentContainer);
        
        // Scroll position tracking
        this.scrollY = 0;
        this.maxScroll = contentHeight - (height - 100);
        this.scrollSpeed = 20;
        
        // Content text
        const contentText = this.createPlaytestContent();
        
        const textObject = this.add.text(0, 0, contentText, {
            fontSize: '14px',
            fill: '#ffffff',
            align: 'left',
            wordWrap: { width: width - 80 },
            lineSpacing: 6
        }).setOrigin(0.5, 0);
        
        this.contentContainer.add(textObject);
        
        // Scroll indicators
        this.scrollIndicator = this.add.text(width / 2, height - 40, '↑ Scroll ↑', {
            fontSize: '16px',
            fill: '#888888',
            fontStyle: 'italic'
        }).setOrigin(0.5);
        
        // Input handlers for scrolling
        // Mouse wheel
        this.input.on('wheel', (pointer, gameObjects, deltaX, deltaY, deltaZ) => {
            this.scrollY = Phaser.Math.Clamp(this.scrollY - deltaY, 0, this.maxScroll);
            this.updateScrollPosition();
        });
        
        // Keyboard (arrow keys, page up/down)
        this.cursors = this.input.keyboard.createCursorKeys();
        this.pageUpKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.PAGE_UP);
        this.pageDownKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.PAGE_DOWN);
        this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        
        // Touch scrolling for mobile
        this.isDragging = false;
        this.lastTouchY = 0;
        
        this.input.on('pointerdown', (pointer) => {
            if (pointer.y > 80 && pointer.y < height - 60) {
                this.isDragging = true;
                this.lastTouchY = pointer.y;
            }
        });
        
        this.input.on('pointermove', (pointer) => {
            if (this.isDragging) {
                const deltaY = this.lastTouchY - pointer.y;
                this.scrollY = Phaser.Math.Clamp(this.scrollY + deltaY * 2, 0, this.maxScroll);
                this.updateScrollPosition();
                this.lastTouchY = pointer.y;
            }
        });
        
        this.input.on('pointerup', () => {
            this.isDragging = false;
        });
        
        // Back button (always visible)
        const backButton = this.add.rectangle(width / 2, height - 20, 200, 40, 0x444444);
        backButton.setStrokeStyle(2, 0xffffff);
        const backText = this.add.text(width / 2, height - 20, 'BACK', {
            fontSize: '20px',
            fill: '#ffffff',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        backButton.setInteractive({ useHandCursor: true })
            .on('pointerover', () => backButton.setFillStyle(0x666666))
            .on('pointerout', () => backButton.setFillStyle(0x444444))
            .on('pointerup', () => {
                this.scene.start('Menu');
            });
    }
    
    update() {
        // Keyboard scrolling
        if (this.cursors.up.isDown || this.pageUpKey.isDown) {
            this.scrollY = Phaser.Math.Clamp(this.scrollY - this.scrollSpeed, 0, this.maxScroll);
            this.updateScrollPosition();
        }
        if (this.cursors.down.isDown || this.pageDownKey.isDown) {
            this.scrollY = Phaser.Math.Clamp(this.scrollY + this.scrollSpeed, 0, this.maxScroll);
            this.updateScrollPosition();
        }
        
        // Update scroll indicator
        if (this.scrollY <= 0) {
            this.scrollIndicator.setText('↓ Scroll Down ↓');
        } else if (this.scrollY >= this.maxScroll) {
            this.scrollIndicator.setText('↑ Scroll Up ↑');
        } else {
            this.scrollIndicator.setText('↑ Scroll ↑');
        }
    }
    
    updateScrollPosition() {
        this.contentContainer.y = -this.scrollY;
    }
    
    createPlaytestContent() {
        return `GAME OVERVIEW

This is a 2-player competitive puzzle platformer where two factions (Solari and Umbrae) compete to gain influence over a forest level. The first player to reach 500 influence wins the game.

═══════════════════════════════════════════════════════════════

CONTROLS

PLAYER 1 - SOLARI (Gold/Yellow):
• Movement: A (left) / D (right)
• Jump: W
• Climb Vines: W (up) / S (down) / SPACE (unlatch)
• Wind Totem: WASD (to match sequence)
• Lights Out Puzzle: Number keys 1-7

PLAYER 2 - UMBRAE (Purple):
• Movement: Left Arrow / Right Arrow
• Jump: Up Arrow
• Climb Vines: Up Arrow (up) / Down Arrow (down) / ENTER (unlatch)
• Wind Totem: Arrow Keys (to match sequence)
• Lights Out Puzzle: Number keys 4-0 (4=vine1, 5=vine2, 6=vine3, 7=vine4, 8=vine5, 9=vine6, 0=vine7)

═══════════════════════════════════════════════════════════════

MOVEMENT & PARKOUR MECHANICS

BASIC MOVEMENT:
• Use A/D or Arrow keys to move left and right
• Press W or Up Arrow to jump
• You can jump while moving for momentum

VINE CLIMBING:
• Green vines are climbable surfaces
• Approach a vine and press W/Up Arrow to latch onto it
• While latched: W/Up Arrow climbs up, S/Down Arrow climbs down
• Press SPACE (P1) or ENTER (P2) to unlatch from the vine
• You can jump off vines horizontally to reach platforms

PLATFORM PARKOUR:
• The level has multiple platforms at different heights
• Use jumps and vine climbing to navigate between platforms
• Some platforms require specific jump combinations:
  - Left vine top platform: Requires W+D (P1) or Up+Right (P2) jump from vine
  - Right vine top platform: Requires W+D (P1) or Up+Right (P2) jump from vine

═══════════════════════════════════════════════════════════════

INFLUENCE SYSTEM

HOW IT WORKS:
• Each player starts with 0 influence
• The goal is to reach 500 influence first
• Influence is gained passively over time by controlling puzzles
• Your influence bar is shown at the top of the screen
• The level visually changes color based on who has more influence

INFLUENCE SOURCES:
• Forest Runes: +2 influence/sec per rune placed (max +6/sec with 3 runes)
• Lights Out Puzzle: +2 influence/sec when controlled
• Wind Totem: +3 influence/sec when controlled

PENALTIES:
• Failing the Lights Out puzzle: -2 influence/sec + 50% slower climbing for 20 seconds

═══════════════════════════════════════════════════════════════

FOREST RUNES MECHANIC

OVERVIEW:
Collect runes scattered across the level and place them in pillars to gain influence.

RUNES:
• There are 3 runes total in the game
• Left Rune: Located on the left vine top platform (requires W+D or Up+Right to reach)
• Right Rune: Located on the right vine top platform (requires W+D or Up+Right to reach)
• Middle Rune: Spawns randomly on reachable platforms after 25 seconds (timer shown at top center)

COLLECTING RUNES:
• Walk into a rune to collect it
• You can only carry one rune at a time
• The rune you're carrying is shown visually

PILLARS:
• There are 3 pillars where you can place runes:
  - Left Pillar: On left vine platform (2/5 up the vine)
  - Middle Pillar: Center of the ground level
  - Right Pillar: On right vine platform (2/5 up the vine)

PLACING RUNES:
• Stand near a pillar while carrying the matching rune
• Press W (P1) or Up Arrow (P2) to place the rune
• Each rune placed gives +2 influence/sec
• You can contest opponent's runes by placing your own
• Left and right runes respawn after 5 seconds when placed
• Middle rune respawns randomly after 25 seconds when placed

STRATEGY:
• Control all 3 pillars for maximum influence (+6/sec)
• Steal opponent's runes by collecting and replacing them
• Watch the timer for the middle rune spawn location

═══════════════════════════════════════════════════════════════

LIGHTS OUT PUZZLE (VINE FLOW)

LOCATION:
• Green vine wall on the middle platform (center of level, Y=250)

HOW TO START:
• Stand near the vine wall indicator
• Press W (P1) or Up Arrow (P2) to activate
• The puzzle appears on your TV screen

HOW IT WORKS:
• There are 7 vines that can be ON or OFF
• Your goal: Turn ALL 7 vines ON to your faction's color
• Solari: Turn all vines GOLD/YELLOW (ON)
• Umbrae: Turn all vines PURPLE (ON)

CONTROLS:
• Player 1: Press number keys 1-7
• Player 2: Press number keys 4-0 (4=vine1, 5=vine2, 6=vine3, 7=vine4, 8=vine5, 9=vine6, 0=vine7)

TOGGLE MECHANICS:
Each key toggles that vine AND its neighbors:
• Key 1: Toggles vines 1 and 2
• Key 2: Toggles vines 1, 2, and 3
• Key 3: Toggles vines 2, 3, and 4
• Key 4: Toggles vines 3, 4, and 5
• Key 5: Toggles vines 4, 5, and 6
• Key 6: Toggles vines 5, 6, and 7
• Key 7: Toggles vines 6 and 7

TIME LIMIT:
• You have 15 seconds to complete the puzzle
• Timer is shown on screen and changes color as time runs out

REWARDS & PENALTIES:
• Success: +2 influence/sec while you control it
• Failure: -2 influence/sec + 50% slower climbing speed for 20 seconds

COOLDOWN:
• 20 second cooldown after failing OR after first claim
• No cooldown when stealing from opponent

OWNERSHIP:
• Only ONE player can control the puzzle at a time
• You can steal control from your opponent

STRATEGY:
• Plan your moves - each key affects multiple vines
• Watch the timer - you have limited time
• Steal control from opponent when they're on cooldown

═══════════════════════════════════════════════════════════════

WIND TOTEM (SIMON SAYS)

LOCATION:
• Top center platform (Y=70)
• Brown totem with a face

HOW TO START:
• Stand near the totem
• Press W (P1) or Up Arrow (P2) to activate
• The minigame appears on your TV screen

HOW IT WORKS:
• This is a Simon Says memory game
• Watch the totem rotate and show a sequence
• Copy the sequence using your controls
• 5 rounds total, each round gets longer

CONTROLS:
• Player 1: WASD keys (W=up, S=down, A=left, D=right)
• Player 2: Arrow keys (Up, Down, Left, Right)

GAMEPLAY:
• Round 1: 3 moves
• Round 2: 4 moves
• Round 3: 5 moves
• Round 4: 6 moves
• Round 5: 7 moves
• You must complete all 5 rounds to win

REWARDS:
• Success: +3 influence/sec while you control it
• Speed boost (movement speed increase)

COOLDOWN:
• 20 second cooldown after completing or failing

OWNERSHIP:
• Only ONE player can control the totem at a time
• You can steal control from your opponent

STRATEGY:
• Focus and memorize the sequence
• The sequences get progressively harder
• Steal control when opponent fails

═══════════════════════════════════════════════════════════════

WIN CONDITION

• First player to reach 500 influence wins
• The game ends immediately when someone reaches 500
• Your influence bar shows current/max (e.g., 250/500)
• Influence is gained passively over time from controlled puzzles

═══════════════════════════════════════════════════════════════

UI ELEMENTS

TOP OF SCREEN:
• Left side: Player 1 (Solari) influence bar and name
• Right side: Player 2 (Umbrae) influence bar and name
• Center: Level timer (5:00 countdown) and Middle Rune spawn timer

INFLUENCE BARS:
• Shows current influence out of 500
• Fills with your faction's color as you gain influence
• Character name is below the bar

TIMERS:
• Level Timer: Shows remaining time (5 minutes total)
• Rune Timer: Shows time until middle rune spawns (counts down from 25s)

TV SCREENS:
• Left TV: Player 1's minigame screen (Simon Says, Lights Out)
• Right TV: Player 2's minigame screen (Simon Says, Lights Out)

VISUAL FEEDBACK:
• Green glow when near interactable objects
• Yellow glow when you can interact with correct item
• Color changes on level based on influence dominance

═══════════════════════════════════════════════════════════════

PLAYTESTING FOCUS AREAS

Please pay attention to and provide feedback on:

1. CONTROLS & MOVEMENT:
   • Are the controls responsive and intuitive?
   • Is movement smooth and satisfying?
   • Is vine climbing easy to understand and use?
   • Are the jump mechanics fair and fun?

2. PUZZLE MECHANICS:
   • Is the Lights Out puzzle clear and solvable?
   • Is the Simon Says sequence appropriate difficulty?
   • Are the puzzle rewards balanced?
   • Are cooldowns fair?

3. RUNE SYSTEM:
   • Is the rune collection and placement system engaging?
   • Are the spawn locations fair and reachable?
   • Is the random middle rune spawn interesting?
   • Is the 25-second timer appropriate?

4. BALANCE:
   • Does one strategy dominate?
   • Are both players able to compete?
   • Is the influence gain rate balanced?
   • Is the 5-minute time limit appropriate?

5. CLARITY:
   • Are the game mechanics clear without this guide?
   • Is the UI informative?
   • Are visual feedback cues helpful?
   • Are win conditions obvious?

6. FUN FACTOR:
   • What parts are most enjoyable?
   • What parts feel frustrating?
   • Would you play this again?
   • What would make it more fun?

═══════════════════════════════════════════════════════════════

HOW TO PROVIDE FEEDBACK

After playing, please share:
• What you enjoyed most
• What felt confusing or frustrating
• Any bugs or technical issues
• Suggestions for improvements
• Overall impressions

Thank you for playtesting!`;
    }
}
