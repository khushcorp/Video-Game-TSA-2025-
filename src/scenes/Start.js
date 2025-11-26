export class Start extends Phaser.Scene {

    constructor() {
        super('Start');
    }

    preload() {
        // No assets to load for now - using simple shapes
    }

    create() {
        // ===== LEVEL SETUP =====
        // Fixed screen - no camera movement
        this.cameras.main.setBounds(0, 0, 1280, 720);
        
        // ===== BACKGROUND =====
        // Compress game area - main game takes up top 500px, bottom 220px for TV screens
        // Jungle/forest background - dark green with some texture
        this.add.rectangle(640, 250, 1280, 500, 0x2d5016); // Dark green background (compressed)
        // Add some variation
        this.add.rectangle(640, 125, 1280, 100, 0x3d6b1f); // Lighter green for sky area
        this.add.rectangle(640, 400, 1280, 200, 0x1a3d0a); // Darker green for ground area
        
        // TV Screen area at bottom (bigger area)
        this.add.rectangle(640, 610, 1280, 220, 0x1a1a1a); // Dark background for TV area
        
        // ===== INFLUENCE BARS UI =====
        this.player1Influence = 0; // Solari influence (0 to 500)
        this.player2Influence = 0; // Umbrae influence (0 to 500)
        this.maxInfluence = 500;
        
        // Player 1 (Solari) influence bar
        this.player1BarBg = this.add.rectangle(320, 30, 400, 30, 0x333333);
        this.player1BarBg.setOrigin(0.5, 0.5);
        this.player1BarFill = this.add.rectangle(120, 30, 0, 25, 0xFFD700); // Gold
        this.player1BarFill.setOrigin(0, 0.5);
        this.player1InfluenceText = this.add.text(320, 55, '0/500', { fontSize: '14px', fill: '#ffffff' }).setOrigin(0.5, 0.5);
        this.player1NameText = this.add.text(320, 75, 'SOLARI', { fontSize: '18px', fill: '#FFD700', fontStyle: 'bold' }).setOrigin(0.5, 0.5);
        
        // Player 2 (Umbrae) influence bar
        this.player2BarBg = this.add.rectangle(960, 30, 400, 30, 0x333333);
        this.player2BarBg.setOrigin(0.5, 0.5);
        this.player2BarFill = this.add.rectangle(760, 30, 0, 25, 0x8B00FF); // Purple
        this.player2BarFill.setOrigin(0, 0.5);
        this.player2InfluenceText = this.add.text(960, 55, '0/500', { fontSize: '14px', fill: '#ffffff' }).setOrigin(0.5, 0.5);
        this.player2NameText = this.add.text(960, 75, 'UMBRAE', { fontSize: '18px', fill: '#8B00FF', fontStyle: 'bold' }).setOrigin(0.5, 0.5);
        
        // ===== INFLUENCE MAP BLOCKS =====
        // Visual "territory" blocks on the map that reflect how many points of influence
        // each faction currently has. One block == one influence point.
        this.createInfluenceBlocks();
        
        // ===== PLATFORMS =====
        this.platforms = [];
        
        // Ground level platform (main floor) - compressed to fit above TV area
        const ground = this.add.rectangle(640, 440, 1280, 80, 0x8B4513);
        ground.setOrigin(0.5, 0.5);
        this.physics.add.existing(ground, true);
        this.platforms.push(ground);
        
        // Middle platform (for Vine Pattern Wall) - moved down a bit but still above middle pillar
        const middlePlatform = this.add.rectangle(640, 250, 400, 30, 0x654321);
        middlePlatform.setOrigin(0.5, 0.5);
        this.physics.add.existing(middlePlatform, true);
        this.platforms.push(middlePlatform);
        
        // Top platform (for Wind Totem Dial) - moved down a bit but still above middle pillar
        const topPlatform = this.add.rectangle(640, 70, 300, 30, 0x654321);
        topPlatform.setOrigin(0.5, 0.5);
        this.physics.add.existing(topPlatform, true);
        this.platforms.push(topPlatform);
        
        // Additional platforms for parkour - creating a path to the top (original layout)
        // Step 1: Platforms from ground to middle level
        const leftPlatform1 = this.add.rectangle(300, 360, 150, 25, 0x654321);
        leftPlatform1.setOrigin(0.5, 0.5);
        this.physics.add.existing(leftPlatform1, true);
        this.platforms.push(leftPlatform1);
        
        const rightPlatform1 = this.add.rectangle(980, 360, 150, 25, 0x654321);
        rightPlatform1.setOrigin(0.5, 0.5);
        this.physics.add.existing(rightPlatform1, true);
        this.platforms.push(rightPlatform1);
        
        // Step 2: Platforms to reach middle platform - moved down a bit but still above middle pillar
        const leftPlatform2 = this.add.rectangle(400, 270, 120, 25, 0x654321);
        leftPlatform2.setOrigin(0.5, 0.5);
        this.physics.add.existing(leftPlatform2, true);
        this.platforms.push(leftPlatform2);
        
        const rightPlatform2 = this.add.rectangle(880, 270, 120, 25, 0x654321);
        rightPlatform2.setOrigin(0.5, 0.5);
        this.physics.add.existing(rightPlatform2, true);
        this.platforms.push(rightPlatform2);
        
        // Step 3: Platforms from middle to top level - moved down a bit but still above middle pillar
        const leftPlatform3 = this.add.rectangle(450, 130, 100, 25, 0x654321);
        leftPlatform3.setOrigin(0.5, 0.5);
        this.physics.add.existing(leftPlatform3, true);
        this.platforms.push(leftPlatform3);
        
        const rightPlatform3 = this.add.rectangle(830, 130, 100, 25, 0x654321);
        rightPlatform3.setOrigin(0.5, 0.5);
        this.physics.add.existing(rightPlatform3, true);
        this.platforms.push(rightPlatform3);
        
        // Step 4: Final platforms to reach top platform - moved down a bit but still above middle pillar
        const leftPlatform4 = this.add.rectangle(500, 70, 100, 25, 0x654321);
        leftPlatform4.setOrigin(0.5, 0.5);
        this.physics.add.existing(leftPlatform4, true);
        this.platforms.push(leftPlatform4);
        
        const rightPlatform4 = this.add.rectangle(780, 70, 100, 25, 0x654321);
        rightPlatform4.setOrigin(0.5, 0.5);
        this.physics.add.existing(rightPlatform4, true);
        this.platforms.push(rightPlatform4);
        
        // ===== VINES (Climbable) =====
        this.vines = [];
        // Left vine (goes from ground to top) - moved further away from center
        const leftVine = this.add.rectangle(50, 240, 20, 400, 0x228B22);
        leftVine.setOrigin(0.5, 0.5);
        this.physics.add.existing(leftVine, true);
        this.vines.push(leftVine);
        
        // Right vine (goes from ground to top) - moved further away from center
        const rightVine = this.add.rectangle(1230, 240, 20, 400, 0x228B22);
        rightVine.setOrigin(0.5, 0.5);
        this.physics.add.existing(rightVine, true);
        this.vines.push(rightVine);
        
        // Center-left vine (from middle platform to top) - decreased length
        const centerLeftVine = this.add.rectangle(350, 160, 20, 120, 0x228B22);
        centerLeftVine.setOrigin(0.5, 0.5);
        this.physics.add.existing(centerLeftVine, true);
        this.vines.push(centerLeftVine);
        
        // Center-right vine (from middle platform to top) - decreased length
        const centerRightVine = this.add.rectangle(930, 160, 20, 120, 0x228B22);
        centerRightVine.setOrigin(0.5, 0.5);
        this.physics.add.existing(centerRightVine, true);
        this.vines.push(centerRightVine);
        
        // Platforms at top of side vines for runes (require W+D or Up+Right to reach)
        // Left vine top platform (for Player 1 - requires W+D jump from vine)
        // Moved down and RIGHT (towards center) so player can reach it
        const leftVineTopPlatform = this.add.rectangle(130, 100, 100, 25, 0x654321);
        leftVineTopPlatform.setOrigin(0.5, 0.5);
        this.physics.add.existing(leftVineTopPlatform, true);
        this.platforms.push(leftVineTopPlatform);
        
        // Right vine top platform (for Player 2 - requires Up+Right jump from vine)
        // Moved down and LEFT (towards center) so player can reach it
        const rightVineTopPlatform = this.add.rectangle(1150, 100, 100, 25, 0x654321);
        rightVineTopPlatform.setOrigin(0.5, 0.5);
        this.physics.add.existing(rightVineTopPlatform, true);
        this.platforms.push(rightVineTopPlatform);
        
        // Platforms on side vines for pillars - positioned 2/5 up the vine
        // Vine goes from y: 40 (top) to y: 440 (ground), so 2/5 from ground = y: 280
        // Left vine platform (for left pillar)
        const leftVineGroundPlatform = this.add.rectangle(130, 280, 100, 25, 0x654321);
        leftVineGroundPlatform.setOrigin(0.5, 0.5);
        this.physics.add.existing(leftVineGroundPlatform, true);
        this.platforms.push(leftVineGroundPlatform);
        
        // Right vine platform (for right pillar)
        const rightVineGroundPlatform = this.add.rectangle(1150, 280, 100, 25, 0x654321);
        rightVineGroundPlatform.setOrigin(0.5, 0.5);
        this.physics.add.existing(rightVineGroundPlatform, true);
        this.platforms.push(rightVineGroundPlatform);
        
        // ===== TV SCREENS =====
        // Player 1 TV (left side) - resized so the Simon grid fits fully inside
        this.tvP1 = this.add.rectangle(320, 600, 500, 220, 0x000000);
        this.tvP1.setOrigin(0.5, 0.5);
        this.tvP1.setStrokeStyle(4, 0xFFD700);
        this.tvP1.setDepth(10);
        
        // TV frame for Player 1
        this.add.rectangle(320, 600, 480, 200, 0x1a1a1a).setDepth(11);
        this.add.text(320, 530, 'SOLARI TV', { fontSize: '16px', fill: '#FFD700', fontStyle: 'bold' }).setOrigin(0.5, 0.5).setDepth(12);
        
        // Player 2 TV (right side) - resized so the Simon grid fits fully inside
        this.tvP2 = this.add.rectangle(960, 600, 500, 220, 0x000000);
        this.tvP2.setOrigin(0.5, 0.5);
        this.tvP2.setStrokeStyle(4, 0x8B00FF);
        this.tvP2.setDepth(10);
        
        // TV frame for Player 2
        this.add.rectangle(960, 600, 480, 200, 0x1a1a1a).setDepth(11);
        this.add.text(960, 530, 'UMBRAE TV', { fontSize: '16px', fill: '#8B00FF', fontStyle: 'bold' }).setOrigin(0.5, 0.5).setDepth(12);
        
        
        // ===== PLAYERS =====
        // Ground top is at y=400, players are 50px tall, so spawn at y=375 (ground top - player height/2)
        // Player 1 (Solari - Light/Gold) - starts left (compressed position)
        this.player1 = this.add.rectangle(200, 375, 50, 50, 0xFFD700);
        this.player1.setOrigin(0.5, 0.5);
        this.physics.add.existing(this.player1);
        this.player1.body.setCollideWorldBounds(true);
        this.player1.body.setSize(50, 50);
        this.player1.faction = 'Solari';
        this.player1.climbing = false;
        this.player1.onVine = null;
        this.player1.latchedToVine = false;
        this.player1.wWasDown = false;
        this.player1.vineIndicator = null;
        this.player1.totemIndicator = null;
        this.player1.teleporting = false; // Track if player is being teleported
        this.player1.vineLatchCooldown = 0; // Cooldown after latching to prevent immediate jump-off
        
        // Player 2 (Umbrae - Shadow/Purple) - starts right (compressed position)
        this.player2 = this.add.rectangle(1080, 375, 50, 50, 0x8B00FF);
        this.player2.setOrigin(0.5, 0.5);
        this.physics.add.existing(this.player2);
        this.player2.body.setCollideWorldBounds(true);
        this.player2.body.setSize(50, 50);
        this.player2.faction = 'Umbrae';
        this.player2.climbing = false;
        this.player2.onVine = null;
        this.player2.latchedToVine = false;
        this.player2.upWasDown = false;
        this.player2.vineIndicator = null;
        this.player2.totemIndicator = null;
        this.player2.teleporting = false; // Track if player is being teleported
        this.player2.vineLatchCooldown = 0; // Cooldown after latching to prevent immediate jump-off
        
        // Collisions
        this.platforms.forEach(platform => {
            this.physics.add.collider(this.player1, platform);
            this.physics.add.collider(this.player2, platform);
        });
        
        // ===== PUZZLE NODES =====
        this.puzzleNodes = {};
        this.puzzleInfluence = {}; // Track influence per second from each puzzle
        this.puzzleInfluence.windTotemSolari = 0;
        this.puzzleInfluence.windTotemUmbrae = 0;
        this.puzzleInfluence.vineFlowSolari = 0;
        this.puzzleInfluence.vineFlowUmbrae = 0;
        
        // 1. Forest Runes System - collect runes via parkour, place in pillars
        this.createForestRunes();
        
        // 2. Vine Flow Puzzle (Middle Platform) - +2 influence/sec
        this.createVineFlowPuzzle();
        
        // 3. Wind Totem Dial (Top Platform) - +3 influence/sec
        this.createWindTotemDial();
        
        // ===== INPUT =====
        // Player 1 controls (WASD)
        this.cursorsWASD = this.input.keyboard.addKeys('W,S,A,D');
        this.wKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        this.sKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE); // Jump off vine
        
        // Player 2 controls (Arrow keys)
        this.cursorsArrows = this.input.keyboard.createCursorKeys();
        this.upKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
        this.downKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
        // Use ENTER / RETURN for Player 2 to jump off vine (near arrow keys)
        this.enterKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER); // Jump off vine
        
        // ===== MOVEMENT SETTINGS =====
        this.playerSpeed = 200;
        this.jumpVelocity = -550; // Slightly higher jump for harder parkour
        this.climbSpeed = 200; // Constant velocity for climbing
        // Initialize vine climb speed (can be modified by debuffs)
        this.player1.vineClimbSpeed = this.climbSpeed;
        this.player2.vineClimbSpeed = this.climbSpeed;
        
        // ===== LEVEL TIMER =====
        this.levelTime = 0;
        this.levelDuration = 300; // 5 minutes in seconds
        // Timer moved to center middle area
        this.timeText = this.add.text(640, 110, '5:00', { fontSize: '24px', fill: '#ffffff' }).setOrigin(0.5, 0.5);
        
        // ===== INFLUENCE SYSTEM =====
        this.influenceRate = 0; // Net influence per second
    }

    createForestRunes() {
        // Create 3 pillars
        // Left and right pillars on new platforms near ground on the side vines
        // Middle pillar stays in the center
        this.runesPillars = [];
        const pillarPositions = [
            { x: 130, y: 217 },   // Left pillar on left vine platform (platform top at y: 267.5, pillar bottom at y: 267 sits on it)
            { x: 640, y: 350 },   // Middle pillar (center of screen, on ground)
            { x: 1150, y: 217 }   // Right pillar on right vine platform (platform top at y: 267.5, pillar bottom at y: 267 sits on it)
        ];
        
        pillarPositions.forEach((pos, index) => {
            // Large, visible pillar
            const pillar = this.add.rectangle(pos.x, pos.y, 80, 100, 0x5a5a5a);
            pillar.setOrigin(0.5, 0.5);
            pillar.setStrokeStyle(4, 0xaaaaaa);
            pillar.setDepth(15); // Make sure it's visible
            pillar.pillarIndex = index;
            pillar.hasRune = false;
            pillar.owner = null;
            
            // Glow effect
            pillar.glow = this.add.circle(pos.x, pos.y, 45, 0xffffff, 0);
            pillar.glow.setAlpha(0);
            pillar.glow.setDepth(16);
            
            this.runesPillars.push(pillar);
        });
        
        // Create 3 rune spawn locations (left, middle, right)
        this.runes = [];
        
        // Left rune - on left vine top platform (requires W+D to reach)
        const leftRune = this.add.circle(130, 75, 20, 0x8B4513); // Brown/tan rune
        leftRune.setStrokeStyle(2, 0xFFD700); // Gold border
        leftRune.setOrigin(0.5, 0.5);
        leftRune.runeIndex = 0;
        leftRune.collected = false;
        leftRune.glow = this.add.circle(130, 75, 25, 0xFFD700, 0.3);
        leftRune.glow.setOrigin(0.5, 0.5);
        this.runes.push(leftRune);
        
        // Right rune - on right vine top platform (requires Up+Right to reach)
        const rightRune = this.add.circle(1150, 75, 20, 0x8B4513); // Brown/tan rune
        rightRune.setStrokeStyle(2, 0xFFD700); // Gold border
        rightRune.setOrigin(0.5, 0.5);
        rightRune.runeIndex = 2;
        rightRune.collected = false;
        rightRune.glow = this.add.circle(1150, 75, 25, 0xFFD700, 0.3);
        rightRune.glow.setOrigin(0.5, 0.5);
        this.runes.push(rightRune);
        
        // Middle rune - spawns randomly after 25 seconds
        const middleRune = this.add.circle(640, 75, 20, 0x8B4513); // Brown/tan rune
        middleRune.setStrokeStyle(2, 0xFFD700); // Gold border
        middleRune.setOrigin(0.5, 0.5);
        middleRune.runeIndex = 1;
        middleRune.collected = false;
        middleRune.glow = this.add.circle(640, 75, 25, 0xFFD700, 0.3);
        middleRune.glow.setOrigin(0.5, 0.5);
        middleRune.setVisible(false); // Start hidden
        middleRune.glow.setVisible(false);
        this.runes.push(middleRune);
        
        // Middle rune spawn system
        this.middleRuneSpawnTimer = 25; // 25 seconds until spawn
        this.middleRuneSpawned = false;
        // Timer positioned in center middle area, below level timer
        this.middleRuneTimerText = this.add.text(640, 140, 'Rune: 25s', {
            fontSize: '18px',
            fill: '#ffff00',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 3
        }).setOrigin(0.5, 0.5);
        this.middleRuneTimerText.setDepth(100); // Make sure it's visible
        
        // List of reachable platform positions for random middle rune spawn
        // Positions are on TOP of platforms (platform top surface - rune radius to sit on platform)
        // Platform top = center Y - (height/2), Rune sits at top - 15 (so it's visible on platform)
        this.reachablePlatformPositions = [
            { x: 300, y: 332 },   // leftPlatform1 (top: 360-12.5=347.5, rune: 347.5-15=332.5)
            { x: 980, y: 332 },   // rightPlatform1 (top: 360-12.5=347.5, rune: 347.5-15=332.5)
            { x: 400, y: 242 },   // leftPlatform2 (top: 270-12.5=257.5, rune: 257.5-15=242.5) - moved down
            { x: 880, y: 242 },   // rightPlatform2 (top: 270-12.5=257.5, rune: 257.5-15=242.5) - moved down
            { x: 450, y: 102 },   // leftPlatform3 (top: 130-12.5=117.5, rune: 117.5-15=102.5) - moved down
            { x: 830, y: 102 },   // rightPlatform3 (top: 130-12.5=117.5, rune: 117.5-15=102.5) - moved down
            { x: 500, y: 42 },    // leftPlatform4 (top: 70-12.5=57.5, rune: 57.5-15=42.5) - moved down
            { x: 780, y: 42 },    // rightPlatform4 (top: 70-12.5=57.5, rune: 57.5-15=42.5) - moved down
            { x: 640, y: 220 },   // middlePlatform (top: 250-15=235, rune: 235-15=220) - moved down, still above pillar top at y: 300
            { x: 640, y: 40 },    // topPlatform (top: 70-15=55, rune: 55-15=40) - moved down
            { x: 130, y: 72 },    // leftVineTopPlatform (top: 100-12.5=87.5, rune: 87.5-15=72.5) - adjusted for new position
            { x: 1150, y: 72 }    // rightVineTopPlatform (top: 100-12.5=87.5, rune: 87.5-15=72.5) - adjusted for new position
        ];
        
        // Track which player is carrying which rune
        this.player1.carriedRune = null;
        this.player2.carriedRune = null;
        
        this.puzzleNodes.forestRunes = this.runesPillars;
    }

    createVineFlowPuzzle() {
        // Create vine indicator on middle platform - a wall of vines
        const vineWallX = 640; // Center of middle platform
        const vineWallY = 250; // Middle platform Y position (moved down a bit but still above middle pillar)
        
        // Create a vine wall structure as the indicator
        this.vineFlowIndicator = this.add.container(vineWallX, vineWallY);
        
        // Main vine wall background
        const wallBg = this.add.rectangle(0, 0, 120, 60, 0x228B22);
        wallBg.setStrokeStyle(3, 0x1a5f1a);
        
        // Decorative vines on the wall
        for (let i = 0; i < 3; i++) {
            const vine = this.add.rectangle(-40 + i * 40, 0, 8, 40, 0x1a5f1a);
            vine.setOrigin(0.5, 0.5);
            this.vineFlowIndicator.add(vine);
        }
        
        // Add leaves/flowers as decoration
        for (let i = 0; i < 4; i++) {
            const leaf = this.add.circle(-50 + i * 33, -15 + (i % 2) * 30, 6, 0x32CD32);
            this.vineFlowIndicator.add(leaf);
        }
        
        this.vineFlowIndicator.add(wallBg);
        this.vineFlowIndicator.setDepth(5);
        
        // Vine Flow state
        this.vineFlowIndicator.active = false;
        this.vineFlowIndicator.owner = null;
        this.vineFlowIndicator.cooldownTimer = 0;
        this.vineFlowIndicator.cooldownActive = false;
        
        // Cooldown timer text
        this.vineFlowIndicator.cooldownText = this.add.text(
            vineWallX,
            vineWallY - 50,
            '',
            {
                fontSize: '20px',
                fill: '#ff0000',
                fontStyle: 'bold'
            }
        ).setOrigin(0.5, 1);
        this.vineFlowIndicator.cooldownText.setVisible(false);
        
        // Lights Out games for each player on TV screens
        this.lightsOutP1 = this.createLightsOutGame(320, 600, 'Solari');
        this.lightsOutP2 = this.createLightsOutGame(960, 600, 'Umbrae');
        
        this.puzzleNodes.vineFlow = this.vineFlowIndicator;
    }
    
    createLightsOutGame(centerX, centerY, playerFaction) {
        const game = {
            active: false,
            playerFaction: playerFaction,
            container: null,
            vines: [], // Array of 5 vine tiles
            vineState: [], // Array of 5 booleans (true = on/player's color, false = off/green or opponent's color)
            vineToggled: [], // Track which vines player has toggled (to show player color vs opponent color)
            targetState: null, // All true = all vines in player's color
            completed: false,
            phase: 'intro',
            introTimer: 0,
            timer: 15, // 15 second time limit
            timerText: null,
            baseColor: playerFaction === 'Solari' ? 0x1a1a2e : 0x2d1b4e,
            onColor: playerFaction === 'Solari' ? 0xFFD700 : 0x8B00FF, // Gold for Solari, Purple for Umbrae
            offColor: 0x228B22, // Dark green for off/unowned
            opponentColor: playerFaction === 'Solari' ? 0x8B00FF : 0xFFD700 // Purple for Solari's opponent, Gold for Umbrae's opponent
        };
        
        // Create container for the TV screen
        const container = this.add.container(centerX, centerY);
        container.setVisible(false);
        container.setDepth(20);
        container.setAlpha(0);
        game.container = container;
        
        const gameSize = 200; // Fits better in TV screen
        const numVines = 7;
        const vineSpacing = gameSize / (numVines + 1);
        const vineSize = 22; // Slightly smaller to fit better
        
        // Background - sized to fit in TV (TV is 500x220, so keep it compact)
        const bgHeight = 200; // Compact height to fit in TV
        const bg = this.add.rectangle(0, 0, gameSize + 20, bgHeight, game.baseColor);
        bg.setStrokeStyle(3, 0xffffff);
        container.add(bg);
        game.bg = bg;
        
        // Create 7 vines in a row (moved up to make room for text below)
        const vines = [];
        const vineState = [];
        for (let i = 0; i < numVines; i++) {
            const x = -gameSize/2 + (i + 1) * vineSpacing;
            const y = -40; // Move vines up to make room for text
            
            // Create vine tile (leaf)
            const vine = this.add.rectangle(x, y, vineSize, vineSize, game.offColor);
            vine.setStrokeStyle(2, 0xffffff); // White border always visible
            vine.setOrigin(0.5, 0.5);
            vine.index = i;
            vine.isOn = false;
            vine.glow = this.add.circle(x, y, vineSize/2, game.onColor, 0);
            vine.glow.setOrigin(0.5, 0.5);
            vine.glow.setAlpha(0);
            container.add(vine.glow);
            container.add(vine);
            vines.push(vine);
            vineState.push(false);
        }
        game.vines = vines;
        game.vineState = vineState;
        game.numVines = numVines;
        
        // Key hint (showing which keys to use) - above vines
        const keyHint = playerFaction === 'Solari' 
            ? this.add.text(0, -70, 'Keys: 1 2 3 4 5 6 7', {
                fontSize: '14px',
                fill: '#ffffff',
                align: 'center',
                fontStyle: 'bold'
            })
            : this.add.text(0, -70, 'Keys: 4 5 6 7 8 9 0', {
                fontSize: '14px',
                fill: '#ffffff',
                align: 'center',
                fontStyle: 'bold'
            });
        keyHint.setOrigin(0.5, 0.5);
        container.add(keyHint);
        game.keyHint = keyHint;

        // Timer text (below vines, before instructions)
        const timerText = this.add.text(0, 5, '15', {
            fontSize: '16px',
            fill: '#ffff00',
            fontStyle: 'bold'
        }).setOrigin(0.5, 0.5);
        timerText.setVisible(false); // Hide until minigame actually starts
        container.add(timerText);
        game.timerText = timerText;
        
        // Instruction text (positioned well below vines to ensure visibility)
        const goalText = playerFaction === 'Solari' 
            ? 'Light ALL vines ON (Sun rewards you!)' 
            : 'Light ALL vines ON (Darkness rewards you!)';
        const keyText = playerFaction === 'Solari' ? '1-7' : '4-0';
        const instructionText = this.add.text(0, 50, `HOW TO PLAY:\nPress keys ${keyText} to toggle vines.\nEach press affects that vine and its neighbors.\n${goalText}`, {
            fontSize: '10px',
            fill: '#ffffff',
            align: 'center',
            wordWrap: { width: gameSize - 10 }
        }).setOrigin(0.5, 0.5);
        container.add(instructionText);
        game.instructionText = instructionText;
        
        // Status text - add directly to scene, not container, so it's always visible
        // Position it at the bottom of the visible TV screen area (centerY is 600, TV goes to y=710)
        const statusText = this.add.text(centerX, centerY + 85, '', {
            fontSize: '12px',
            fill: '#ffff00',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 2
        }).setOrigin(0.5, 0.5);
        statusText.setVisible(false); // Start hidden, show when needed
        statusText.setDepth(200); // Make sure it's on top of everything
        game.statusText = statusText;
        
        return game;
    }

    createWindTotemDial() {
        // Create Wind Totem (Minecraft Totem of Undying style) - moved down a bit but still above middle pillar
        // Main totem body - rectangular with face
        this.windTotem = this.add.rectangle(640, 55, 40, 50, 0x8B7355); // Brown/tan color
        this.windTotem.setOrigin(0.5, 0.5);
        this.windTotem.setStrokeStyle(2, 0x654321);
        
        // Totem face details
        const faceY = 50;
        // Eyes
        this.add.circle(630, faceY, 3, 0x000000);
        this.add.circle(650, faceY, 3, 0x000000);
        // Mouth
        this.add.rectangle(640, faceY + 8, 10, 2, 0x000000);
        
        // Totem state
        this.windTotem.active = false;
        this.windTotem.owner = null; // 'Solari' or 'Umbrae' when claimed
        this.windTotem.cooldownTimer = 0;
        this.windTotem.cooldownActive = false;
        // Cooldown timer text (shown above the totem while on cooldown)
        this.windTotem.cooldownText = this.add.text(
            this.windTotem.x,
            this.windTotem.y - 45,
            '',
            {
                fontSize: '20px',
                fill: '#ff0000',
                fontStyle: 'bold'
            }
        ).setOrigin(0.5, 1);
        this.windTotem.cooldownText.setVisible(false);
        
        // Simon Says games for each player on TV screens (aligned with TV centers)
        this.simonSaysP1 = this.createSimonSaysGame(320, 600, 'Solari'); // On Player 1's TV
        this.simonSaysP2 = this.createSimonSaysGame(960, 600, 'Umbrae'); // On Player 2's TV
        
        this.puzzleNodes.windTotem = this.windTotem;
    }
    
    createInfluenceBlocks() {
        // Initialize storage for territory blocks that will appear only where
        // factions are actually gaining influence.
        this.solariTerritoryBlocks = [];
        this.umbraeTerritoryBlocks = [];
        this.lastSolariInfluenceInt = 0;
        this.lastUmbraeInfluenceInt = 0;
    }

    spawnInfluenceBlock(color, collection) {
        // Spawn a small "pixel" on top of an existing solid block (platform/ground/vine)
        // so the geometry gradually fills with colored pixels instead of instantly
        // recoloring the whole rectangle.
        const paintable = [];
        if (this.platforms && this.platforms.length) {
            paintable.push(...this.platforms);
        }
        if (this.vines && this.vines.length) {
            paintable.push(...this.vines);
        }
        if (paintable.length === 0) return;
        
        const index = Phaser.Math.Between(0, paintable.length - 1);
        const target = paintable[index];
        const size = 10;
        
        // Pick a random point inside the target block's bounds
        const halfW = target.width / 2;
        const halfH = target.height / 2;
        const x = Phaser.Math.Between(target.x - halfW + size / 2, target.x + halfW - size / 2);
        const y = Phaser.Math.Between(target.y - halfH + size / 2, target.y + halfH - size / 2);
        
        const pixel = this.add.rectangle(x, y, size, size, color);
        pixel.setOrigin(0.5, 0.5);
        pixel.setDepth(1); // above background, roughly on top of geometry
        collection.push(pixel);
    }
    
    createSimonSaysGame(centerX, centerY, playerFaction) {
        // Create Wind Totem rotation memory game on the TV screen
        const gameSize = 220; // fits fully inside the TV
        const playerColor = playerFaction === 'Solari' ? 0xFFD700 : 0x8B00FF;
        const baseColor = 0x000000; // TV background
        
        // Game elements container (for smooth animation)
        const container = this.add.container(centerX, centerY);
        container.setVisible(false);
        container.setDepth(20);
        container.setAlpha(0); // Start invisible for fade-in
        
        // Background (TV screen content)
        const bg = this.add.rectangle(0, 0, gameSize, gameSize, baseColor);
        bg.setOrigin(0.5, 0.5);
        container.add(bg);
        
        // Title (inside the TV container) – shows the player's entered rotation sequence
        const title = this.add.text(0, -gameSize/2 - 15, '', {
            fontSize: '18px',
            fill: '#ffffff',
            fontStyle: 'bold'
        }).setOrigin(0.5, 0.5);
        container.add(title);
        
        // Instruction text (outside the container, ABOVE the TV so it's never cut off or hidden)
        const instructionText = this.add.text(centerX, centerY - gameSize/2 - 35, '', {
            fontSize: '14px',
            fill: '#ffffff'
        }).setOrigin(0.5, 0.5);
        instructionText.setDepth(25); // above everything in the TV area
        
        // Round text ("Round X/N") just below the play area
        const timerText = this.add.text(0, gameSize/2 + 5, 'Round 1/5', {
            fontSize: '20px',
            fill: '#ffff00',
            fontStyle: 'bold'
        }).setOrigin(0.5, 0.5);
        container.add(timerText);
        
        // Plain-text key hints to show what inputs are used,
        // and to highlight (in green) which directions the player has pressed.
        // Place them in a single row just above the TV, but keep them hidden
        // until after the HOW TO PLAY text has disappeared.
        const isSolari = playerFaction === 'Solari';
        const upLabel = isSolari ? 'W' : '↑';
        const leftLabel = isSolari ? 'A' : '←';
        const downLabel = isSolari ? 'S' : '↓';
        const rightLabel = isSolari ? 'D' : '→';
        const keyStyle = { fontSize: '16px', fill: '#ffffff' };
        
        const keyRowY = centerY - gameSize/2 - 10;
        const keyUpText = this.add.text(centerX - 60, keyRowY, upLabel, keyStyle).setOrigin(0.5, 0.5);
        const keyLeftText = this.add.text(centerX - 20, keyRowY, leftLabel, keyStyle).setOrigin(0.5, 0.5);
        const keyDownText = this.add.text(centerX + 20, keyRowY, downLabel, keyStyle).setOrigin(0.5, 0.5);
        const keyRightText = this.add.text(centerX + 60, keyRowY, rightLabel, keyStyle).setOrigin(0.5, 0.5);
        keyUpText.setDepth(25);
        keyLeftText.setDepth(25);
        keyDownText.setDepth(25);
        keyRightText.setDepth(25);
        keyUpText.setVisible(false);
        keyLeftText.setVisible(false);
        keyDownText.setVisible(false);
        keyRightText.setVisible(false);
        
        // === Totem of Undying–style figure on the TV (centered) ===
        const totem = this.add.container(0, 0);
        
        // Main body
        const body = this.add.rectangle(0, 0, 60, 90, 0x8B7355);
        body.setStrokeStyle(2, 0x654321);
        
        // Arms
        const leftArm = this.add.rectangle(-45, 5, 25, 55, 0x8B7355);
        leftArm.setStrokeStyle(2, 0x654321);
        const rightArm = this.add.rectangle(45, 5, 25, 55, 0x8B7355);
        rightArm.setStrokeStyle(2, 0x654321);
        
        // Face (eyes + mouth)
        const eyeColor = playerColor;
        const eyeLeft = this.add.rectangle(-12, -15, 8, 8, eyeColor);
        const eyeRight = this.add.rectangle(12, -15, 8, 8, eyeColor);
        const mouth = this.add.rectangle(0, 10, 18, 4, 0x000000);
        
        totem.add([body, leftArm, rightArm, eyeLeft, eyeRight, mouth]);
        container.add(totem);
        
        return {
            container,
            bg,
            title,
            instructionText,
            timerText,
            totem,
            active: false,
            timer: 0,
            duration: 20, // visual only
            playerFaction,
            centerX,
            centerY,
            gameSize,
            baseColor,
            // Rotation sequence state
            sequence: [],          // array of 'up' | 'down' | 'left' | 'right'
            inputSequence: [],     // player's input directions
            currentRound: 0,
            maxRounds: 5,          // sequence up to length 5
            phase: 'idle',         // 'idle' | 'intro' | 'waitShow' | 'show' | 'readyInput' | 'input' | 'checking' | 'done'
            introTimer: 0,
            sequenceStepIndex: 0,
            sequenceStepTimer: 0,
            betweenRoundsTimer: 0,
            // For manual edge-detect on keys (so arrows/WASD always work)
            lastUp: false,
            lastDown: false,
            lastLeft: false,
            lastRight: false,
            // Target rotation (for smooth interpolation)
            currentAngleTarget: 0,
            // Key hint texts for visual feedback on which directions have been pressed
            keyHints: {
                up: keyUpText,
                left: keyLeftText,
                down: keyDownText,
                right: keyRightText
            },
            // Eyes so we can change color on success/fail
            eyes: {
                left: eyeLeft,
                right: eyeRight,
                baseColor: eyeColor
            },
            // Per-direction timers so key highlights only stay green briefly
            keyHighlightTimers: {
                up: 0,
                down: 0,
                left: 0,
                right: 0
            }
        };
    }

    update() {
        // Update timer
        this.levelTime += 1/60; // Assuming 60 FPS
        const remaining = Math.max(0, this.levelDuration - this.levelTime);
        const minutes = Math.floor(remaining / 60);
        const seconds = Math.floor(remaining % 60);
        this.timeText.setText(`${minutes}:${seconds.toString().padStart(2, '0')}`);
        
        // Check level end conditions
        if (remaining <= 0) {
            // Timer ran out - determine winner by who has most influence
            let winner = null;
            if (this.player1Influence > this.player2Influence) {
                winner = 'Solari';
            } else if (this.player2Influence > this.player1Influence) {
                winner = 'Umbrae';
            }
            // If tied, winner stays null (NO RESULT)
            this.endLevel(winner);
            return;
        }
        
        // Update puzzle nodes
        this.updateForestRunes();
        this.updateVineFlowPuzzle();
        this.updateWindTotem();
        
        // Update balance meter
        this.updateBalanceMeter();
        
        // Player movement
        this.updatePlayer1();
        this.updatePlayer2();
        
        // Check climbing
        this.checkClimbing(this.player1);
        this.checkClimbing(this.player2);
        
        // Visual feedback for carried runes
        this.updateRuneIndicators();
    }
    
    updateRuneIndicators() {
        // Player 1 rune indicator
        if (this.player1.carriedRune !== null) {
            if (!this.player1.runeIndicator) {
                this.player1.runeIndicator = this.add.circle(this.player1.x, this.player1.y - 40, 15, 0xFFD700, 0.8);
                this.player1.runeIndicator.setStrokeStyle(2, 0xFFFFFF);
            } else {
                this.player1.runeIndicator.setPosition(this.player1.x, this.player1.y - 40);
                this.player1.runeIndicator.setVisible(true);
            }
        } else if (this.player1.runeIndicator) {
            this.player1.runeIndicator.setVisible(false);
        }
        
        // Player 2 rune indicator
        if (this.player2.carriedRune !== null) {
            if (!this.player2.runeIndicator) {
                this.player2.runeIndicator = this.add.circle(this.player2.x, this.player2.y - 40, 15, 0x8B00FF, 0.8);
                this.player2.runeIndicator.setStrokeStyle(2, 0xFFFFFF);
            } else {
                this.player2.runeIndicator.setPosition(this.player2.x, this.player2.y - 40);
                this.player2.runeIndicator.setVisible(true);
            }
        } else if (this.player2.runeIndicator) {
            this.player2.runeIndicator.setVisible(false);
        }
    }

    updatePlayer1() {
        // If player is engaged in TV mini-game, completely skip normal movement logic
        if (this.player1.teleporting || this.simonSaysP1.active) {
            return;
        }
        
        // Ensure gravity is enabled during normal play
        this.player1.body.setAllowGravity(true);
        const wPressed = Phaser.Input.Keyboard.JustDown(this.wKey);
        const wHeld = this.cursorsWASD.W.isDown;
        const sPressed = Phaser.Input.Keyboard.JustDown(this.sKey);
        const spacePressed = Phaser.Input.Keyboard.JustDown(this.spaceKey);
        const aPressed = Phaser.Input.Keyboard.JustDown(this.cursorsWASD.A);
        const dPressed = Phaser.Input.Keyboard.JustDown(this.cursorsWASD.D);
        
        // Check if we should latch onto vine (W pressed when near vine but not latched)
        if (wPressed && !this.player1.latchedToVine && this.player1.climbing && this.player1.onVine) {
            this.player1.latchedToVine = true;
            this.player1.vineLatchCooldown = 0.15; // 0.15 second cooldown before can jump off
            // Don't set gravity here - let the update logic handle it based on input
            this.player1.body.setVelocityY(0);
            this.player1.body.setVelocityX(0);
        }
        
        // If latched to vine
        if (this.player1.latchedToVine && this.player1.onVine) {
            const vine = this.player1.onVine;
            const vineTop = vine.y - vine.height / 2;
            const vineBottom = vine.y + vine.height / 2;
            const playerHalfHeight = 25;
            
            // Keep player aligned to vine horizontally
            this.player1.x = vine.x;
            this.player1.body.setVelocityX(0);
            
            // Hide indicator when latched
            if (this.player1.vineIndicator) {
                this.player1.vineIndicator.setVisible(false);
            }
            
            // Update latch cooldown
            if (this.player1.vineLatchCooldown > 0) {
                this.player1.vineLatchCooldown -= 1/60; // Decrement by frame time (assuming 60 FPS)
                if (this.player1.vineLatchCooldown < 0) {
                    this.player1.vineLatchCooldown = 0;
                }
            }
            
            // Check for unlatch: S to drop down
            if (sPressed) {
                // Drop down from vine (no jump)
                this.player1.latchedToVine = false;
                this.player1.climbing = false;
                this.player1.onVine = null;
                this.player1.body.setAllowGravity(true);
                this.player1.body.setGravityY(600);
                this.player1.wWasDown = false;
                this.player1.vineLatchCooldown = 0;
            } 
            // Check for jump off: W + A or W + D (works if either key is just pressed while other is held, AND cooldown is over)
            const wAndA = (wPressed && this.cursorsWASD.A.isDown) || (wHeld && aPressed);
            const wAndD = (wPressed && this.cursorsWASD.D.isDown) || (wHeld && dPressed);
            
            if ((wAndA || wAndD) && this.player1.vineLatchCooldown <= 0) {
                // Jump off vine in direction (W + movement key)
                this.player1.latchedToVine = false;
                this.player1.climbing = false;
                this.player1.onVine = null;
                this.player1.body.setAllowGravity(true);
                this.player1.body.setGravityY(600);
                this.player1.body.setVelocityY(this.jumpVelocity);
                // Add horizontal velocity based on direction
                if (wAndA || this.cursorsWASD.A.isDown) {
                    this.player1.body.setVelocityX(-200); // Jump left
                } else if (wAndD || this.cursorsWASD.D.isDown) {
                    this.player1.body.setVelocityX(200); // Jump right
                }
                this.player1.wWasDown = false;
            }
            // Climb up with W held or pressed (smooth continuous climbing - W alone does NOT jump)
            else if (wHeld || wPressed) {
                this.player1.body.setGravityY(0);
                this.player1.body.setAllowGravity(false);
                this.player1.body.setVelocityY(-(this.player1.vineClimbSpeed || this.climbSpeed));
                // Stop at top
                if (this.player1.y <= vineTop + playerHalfHeight) {
                    this.player1.y = vineTop + playerHalfHeight;
                    this.player1.body.setVelocityY(0);
                }
                this.player1.wWasDown = true;
            } 
            // Not climbing, slow fall (remain latched)
            else {
                // Allow slow gravity fall when not holding anything
                this.player1.body.setVelocityY(0); // Reset any existing velocity first
                this.player1.body.setAllowGravity(true);
                this.player1.body.setGravityY(50); // Slow gravity (50 instead of 600)
                // Stop at bottom of vine
                if (this.player1.y >= vineBottom - playerHalfHeight) {
                    this.player1.y = vineBottom - playerHalfHeight;
                    this.player1.body.setVelocityY(0);
                    this.player1.body.setGravityY(0);
                    this.player1.body.setAllowGravity(false);
                }
            }
        } 
        // Not latched - normal movement
        else {
            this.player1.wWasDown = false;
            
            // Horizontal movement
            this.player1.body.setVelocityX(0);
            if (this.cursorsWASD.A.isDown) {
                this.player1.body.setVelocityX(-this.playerSpeed);
            } else if (this.cursorsWASD.D.isDown) {
                this.player1.body.setVelocityX(this.playerSpeed);
            }
            
            // Normal gravity
            this.player1.body.setGravityY(600);
            
            // Jump on ground
            if (wPressed && this.player1.body.touching.down) {
                this.player1.body.setVelocityY(this.jumpVelocity);
            }
        }
        
        // Soft horizontal limits
        if (this.player1.x < 25) this.player1.x = 25;
        if (this.player1.x > 1255) this.player1.x = 1255;
    }

    updatePlayer2() {
        // If player is engaged in TV mini-game, completely skip normal movement logic
        if (this.player2.teleporting || this.simonSaysP2.active) {
            return;
        }
        
        // Ensure gravity is enabled during normal play
        this.player2.body.setAllowGravity(true);
        const upPressed = Phaser.Input.Keyboard.JustDown(this.upKey);
        const upHeld = this.cursorsArrows.up.isDown;
        const downPressed = Phaser.Input.Keyboard.JustDown(this.downKey);
        const enterPressed = Phaser.Input.Keyboard.JustDown(this.enterKey);
        const leftPressed = Phaser.Input.Keyboard.JustDown(this.cursorsArrows.left);
        const rightPressed = Phaser.Input.Keyboard.JustDown(this.cursorsArrows.right);
        
        // Check if we should latch onto vine (Up Arrow pressed when near vine but not latched)
        if (upPressed && !this.player2.latchedToVine && this.player2.climbing && this.player2.onVine) {
            this.player2.latchedToVine = true;
            this.player2.vineLatchCooldown = 0.15; // 0.15 second cooldown before can jump off
            // Don't set gravity here - let the update logic handle it based on input
            this.player2.body.setVelocityY(0);
            this.player2.body.setVelocityX(0);
        }
        
        // If latched to vine
        if (this.player2.latchedToVine && this.player2.onVine) {
            const vine = this.player2.onVine;
            const vineTop = vine.y - vine.height / 2;
            const vineBottom = vine.y + vine.height / 2;
            const playerHalfHeight = 25;
            
            // Keep player aligned to vine horizontally
            this.player2.x = vine.x;
            this.player2.body.setVelocityX(0);
            
            // Hide indicator when latched
            if (this.player2.vineIndicator) {
                this.player2.vineIndicator.setVisible(false);
            }
            
            // Update latch cooldown
            if (this.player2.vineLatchCooldown > 0) {
                this.player2.vineLatchCooldown -= 1/60; // Decrement by frame time (assuming 60 FPS)
                if (this.player2.vineLatchCooldown < 0) {
                    this.player2.vineLatchCooldown = 0;
                }
            }
            
            // Check for unlatch: Down to drop down
            if (downPressed) {
                // Drop down from vine (no jump)
                this.player2.latchedToVine = false;
                this.player2.climbing = false;
                this.player2.onVine = null;
                this.player2.body.setAllowGravity(true);
                this.player2.body.setGravityY(600);
                this.player2.upWasDown = false;
                this.player2.vineLatchCooldown = 0;
            } 
            // Check for jump off: Up + Left or Up + Right (works if either key is just pressed while other is held, AND cooldown is over)
            const upAndLeft = (upPressed && this.cursorsArrows.left.isDown) || (upHeld && leftPressed);
            const upAndRight = (upPressed && this.cursorsArrows.right.isDown) || (upHeld && rightPressed);
            
            if ((upAndLeft || upAndRight) && this.player2.vineLatchCooldown <= 0) {
                // Jump off vine in direction (Up + movement key)
                this.player2.latchedToVine = false;
                this.player2.climbing = false;
                this.player2.onVine = null;
                this.player2.body.setAllowGravity(true);
                this.player2.body.setGravityY(600);
                this.player2.body.setVelocityY(this.jumpVelocity);
                // Add horizontal velocity based on direction
                if (upAndLeft || this.cursorsArrows.left.isDown) {
                    this.player2.body.setVelocityX(-200); // Jump left
                } else if (upAndRight || this.cursorsArrows.right.isDown) {
                    this.player2.body.setVelocityX(200); // Jump right
                }
                this.player2.upWasDown = false;
            }
            // Climb up with Up Arrow held or pressed (smooth continuous climbing - Up alone does NOT jump)
            else if (upHeld || upPressed) {
                this.player2.body.setGravityY(0);
                this.player2.body.setAllowGravity(false);
                this.player2.body.setVelocityY(-(this.player2.vineClimbSpeed || this.climbSpeed));
                // Stop at top
                if (this.player2.y <= vineTop + playerHalfHeight) {
                    this.player2.y = vineTop + playerHalfHeight;
                    this.player2.body.setVelocityY(0);
                }
                this.player2.upWasDown = true;
            } 
            // Not climbing, slow fall (remain latched)
            else {
                // Allow slow gravity fall when not holding anything
                this.player2.body.setVelocityY(0); // Reset any existing velocity first
                this.player2.body.setAllowGravity(true);
                this.player2.body.setGravityY(50); // Slow gravity (50 instead of 600)
                // Stop at bottom of vine
                if (this.player2.y >= vineBottom - playerHalfHeight) {
                    this.player2.y = vineBottom - playerHalfHeight;
                    this.player2.body.setVelocityY(0);
                    this.player2.body.setGravityY(0);
                    this.player2.body.setAllowGravity(false);
                }
            }
        } 
        // Not latched - normal movement
        else {
            this.player2.upWasDown = false;
            
            // Horizontal movement
            this.player2.body.setVelocityX(0);
            if (this.cursorsArrows.left.isDown) {
                this.player2.body.setVelocityX(-this.playerSpeed);
            } else if (this.cursorsArrows.right.isDown) {
                this.player2.body.setVelocityX(this.playerSpeed);
            }
            
            // Normal gravity
            this.player2.body.setGravityY(600);
            
            // Jump on ground
            if (upPressed && this.player2.body.touching.down) {
                this.player2.body.setVelocityY(this.jumpVelocity);
            }
        }
        
        // Soft horizontal limits
        if (this.player2.x < 25) this.player2.x = 25;
        if (this.player2.x > 1255) this.player2.x = 1255;
    }

    checkClimbing(player) {
        // If already latched, DON'T check bounds - let the update function handle it
        // This prevents auto-unlatching during slow fall
        if (player.latchedToVine && player.onVine) {
            return; // Already latched, don't interfere
        }
        
        // Check if player is near a vine
        let nearVine = false;
        let closestVine = null;
        let minDist = Infinity;
        
        this.vines.forEach(vine => {
            const dist = Math.abs(player.x - vine.x); // Horizontal distance only
            // Check if player is within vine's vertical bounds
            const vineTop = vine.y - vine.height / 2;
            const vineBottom = vine.y + vine.height / 2;
            const withinVineBounds = player.y >= vineTop - 30 && player.y <= vineBottom + 30;
            
            // Check if close enough horizontally (within 50 pixels)
            if (dist < 50 && dist < minDist && withinVineBounds) {
                minDist = dist;
                closestVine = vine;
                nearVine = true;
            }
        });
        
        if (nearVine && closestVine) {
            player.climbing = true;
            player.onVine = closestVine;
            
            // Create or show visual indicator
            if (!player.vineIndicator) {
                // Create indicator: circle with text
                const indicatorGroup = this.add.container(player.x, player.y - 50);
                
                // Circle background
                const circle = this.add.circle(0, 0, 25, 0xffffff, 0.9);
                circle.setStrokeStyle(3, 0x000000);
                
                // Key text (W for player1, Up Arrow symbol for player2)
                const keyText = player.faction === 'Solari' 
                    ? this.add.text(0, 0, 'W', { fontSize: '24px', fill: '#000000', fontStyle: 'bold' })
                    : this.add.text(0, -2, '↑', { fontSize: '24px', fill: '#000000', fontStyle: 'bold' });
                keyText.setOrigin(0.5, 0.5);
                
                indicatorGroup.add([circle, keyText]);
                player.vineIndicator = indicatorGroup;
            } else {
                // Update indicator position
                player.vineIndicator.setPosition(player.x, player.y - 50);
                player.vineIndicator.setVisible(true);
            }
        } else {
            player.climbing = false;
            player.onVine = null;
            // Hide indicator when not near vine
            if (player.vineIndicator) {
                player.vineIndicator.setVisible(false);
            }
        }
    }

    updateForestRunes() {
        if (!this.runes || !this.runesPillars) return;
        
        // Update middle rune spawn timer
        const middleRune = this.runes[1]; // Middle rune is index 1
        if (!this.middleRuneSpawned && middleRune) {
            this.middleRuneSpawnTimer -= 1/60; // Decrement by frame time (60 FPS)
            if (this.middleRuneSpawnTimer <= 0) {
                this.middleRuneSpawnTimer = 0;
                // Spawn middle rune at random reachable platform position
                const randomPos = Phaser.Utils.Array.GetRandom(this.reachablePlatformPositions);
                middleRune.x = randomPos.x;
                middleRune.y = randomPos.y;
                middleRune.glow.x = randomPos.x;
                middleRune.glow.y = randomPos.y;
                middleRune.setVisible(true);
                middleRune.glow.setVisible(true);
                middleRune.collected = false;
                this.middleRuneSpawned = true;
                this.middleRuneTimerText.setVisible(false);
            } else {
                // Update timer text
                const seconds = Math.ceil(this.middleRuneSpawnTimer);
                this.middleRuneTimerText.setText(`Rune: ${seconds}s`);
            }
        }
        
        // Update rune collection - players walk into runes to pick them up
        this.runes.forEach((rune, index) => {
            // Skip if rune is not visible (middle rune before spawn)
            if (!rune.visible) {
                return;
            }
            
            if (rune.collected) {
                rune.setVisible(false);
                rune.glow.setVisible(false);
                return;
            }
            
            // Check if players are near the rune
            const p1Near = Phaser.Math.Distance.Between(this.player1.x, this.player1.y, rune.x, rune.y) < 30;
            const p2Near = Phaser.Math.Distance.Between(this.player2.x, this.player2.y, rune.x, rune.y) < 30;
            
            // Player walks into rune to collect it
            if (p1Near && !this.player1.carriedRune) {
                rune.collected = true;
                this.player1.carriedRune = rune.runeIndex;
                rune.setVisible(false);
                rune.glow.setVisible(false);
            } else if (p2Near && !this.player2.carriedRune) {
                rune.collected = true;
                this.player2.carriedRune = rune.runeIndex;
                rune.setVisible(false);
                rune.glow.setVisible(false);
            }
        });
        
        // Update pillar placement - players press W/Up arrow near pillar to place rune
        this.runesPillars.forEach((pillar, index) => {
            const p1Near = Phaser.Math.Distance.Between(this.player1.x, this.player1.y, pillar.x, pillar.y) < 60;
            const p2Near = Phaser.Math.Distance.Between(this.player2.x, this.player2.y, pillar.x, pillar.y) < 60;
            
            // Player 1 places rune (can contest existing runes)
            if (p1Near && this.player1.carriedRune !== null && this.player1.carriedRune === index) {
                const wPressed = Phaser.Input.Keyboard.JustDown(this.wKey);
                if (wPressed) {
                    pillar.hasRune = true;
                    pillar.owner = this.player1.faction;
                    pillar.setFillStyle(0xFFD700); // Gold for Solari
                    pillar.glow.setFillStyle(0xFFD700);
                    pillar.glow.setAlpha(0.6);
                    this.player1.carriedRune = null;
                    // Only middle rune respawns (randomly after 25s)
                    if (index === 1) {
                        // Middle rune - respawn randomly after 25 seconds
                        this.middleRuneSpawned = false;
                        this.middleRuneSpawnTimer = 25;
                        this.middleRuneTimerText.setVisible(true);
                        const rune = this.runes[index];
                        rune.setVisible(false);
                        rune.glow.setVisible(false);
                    }
                    // Left/Right runes do NOT respawn - they are one-time collectibles
                }
            }
            
            // Player 2 places rune (can contest existing runes)
            if (p2Near && this.player2.carriedRune !== null && this.player2.carriedRune === index) {
                const upPressed = Phaser.Input.Keyboard.JustDown(this.upKey);
                if (upPressed) {
                    pillar.hasRune = true;
                    pillar.owner = this.player2.faction;
                    pillar.setFillStyle(0x8B00FF); // Purple for Umbrae
                    pillar.glow.setFillStyle(0x8B00FF);
                    pillar.glow.setAlpha(0.6);
                    this.player2.carriedRune = null;
                    // Only middle rune respawns (randomly after 25s)
                    if (index === 1) {
                        // Middle rune - respawn randomly after 25 seconds
                        this.middleRuneSpawned = false;
                        this.middleRuneSpawnTimer = 25;
                        this.middleRuneTimerText.setVisible(true);
                        const rune = this.runes[index];
                        rune.setVisible(false);
                        rune.glow.setVisible(false);
                    }
                    // Left/Right runes do NOT respawn - they are one-time collectibles
                }
            }
            
            // Visual feedback - show glow when player is near with correct rune
            if ((p1Near && this.player1.carriedRune === index) || (p2Near && this.player2.carriedRune === index)) {
                pillar.glow.setAlpha(0.4);
                pillar.glow.setFillStyle(0xffff00); // Yellow hint
            } else if (!pillar.hasRune) {
                pillar.glow.setAlpha(0);
            }
        });
        
        // Calculate influence based on pillars owned
        let solariPillars = 0;
        let umbraePillars = 0;
        
        this.runesPillars.forEach(pillar => {
            if (pillar.hasRune && pillar.owner === 'Solari') {
                solariPillars++;
            } else if (pillar.hasRune && pillar.owner === 'Umbrae') {
                umbraePillars++;
            }
        });
        
        // Set influence: 2/sec (1 pillar), 4/sec (2), 6/sec (3)
        if (solariPillars > 0) {
            this.puzzleInfluence.forestRunes = solariPillars * 2;
        } else if (umbraePillars > 0) {
            this.puzzleInfluence.forestRunes = -(umbraePillars * 2);
        } else {
            this.puzzleInfluence.forestRunes = 0;
        }
    }

    updateVineFlowPuzzle() {
        const indicator = this.vineFlowIndicator;
        
        // Check if players are near vine indicator (within 80 pixels)
        const p1Near = Phaser.Math.Distance.Between(this.player1.x, this.player1.y, indicator.x, indicator.y) < 80;
        const p2Near = Phaser.Math.Distance.Between(this.player2.x, this.player2.y, indicator.x, indicator.y) < 80;
        
        // Show interaction indicator
        // Only allow interaction if no one owns it OR if opponent owns it (can challenge)
        const updateVineIndicator = (player, near) => {
            const canInteract = !indicator.cooldownActive && 
                               (indicator.owner === null || indicator.owner !== player.faction);
            if (near && !player.teleporting && !this.lightsOutP1.active && !this.lightsOutP2.active && canInteract) {
                if (!player.vineFlowIndicator) {
                    const indicatorGroup = this.add.container(player.x, player.y - 50);
                    const circle = this.add.circle(0, 0, 25, 0xffffff, 0.9);
                    circle.setStrokeStyle(3, 0x000000);
                    const keyText = player.faction === 'Solari'
                        ? this.add.text(0, 0, 'W', { fontSize: '24px', fill: '#000000', fontStyle: 'bold' })
                        : this.add.text(0, -2, '↑', { fontSize: '24px', fill: '#000000', fontStyle: 'bold' });
                    keyText.setOrigin(0.5, 0.5);
                    indicatorGroup.add([circle, keyText]);
                    player.vineFlowIndicator = indicatorGroup;
                } else {
                    player.vineFlowIndicator.setPosition(player.x, player.y - 50);
                    player.vineFlowIndicator.setVisible(true);
                }
            } else {
                if (player.vineFlowIndicator) {
                    player.vineFlowIndicator.setVisible(false);
                }
            }
        };
        
        updateVineIndicator(this.player1, p1Near);
        updateVineIndicator(this.player2, p2Near);
        
        // Handle interaction
        // Only allow if no one owns it OR if opponent owns it (can challenge)
        const p1CanInteract = !indicator.cooldownActive && 
                              (indicator.owner === null || indicator.owner !== this.player1.faction);
        const p2CanInteract = !indicator.cooldownActive && 
                              (indicator.owner === null || indicator.owner !== this.player2.faction);
        
        if (p1Near && Phaser.Input.Keyboard.JustDown(this.wKey) && !this.lightsOutP1.active && !this.lightsOutP2.active && p1CanInteract && !this.player1.teleporting) {
            this.teleportToVineTV(this.player1, this.lightsOutP1);
        }
        
        if (p2Near && Phaser.Input.Keyboard.JustDown(this.upKey) && !this.lightsOutP1.active && !this.lightsOutP2.active && p2CanInteract && !this.player2.teleporting) {
            this.teleportToVineTV(this.player2, this.lightsOutP2);
        }
        
        // Update Lights Out games
        if (this.lightsOutP1.active) {
            this.updateLightsOut(this.lightsOutP1, this.player1);
        }
        if (this.lightsOutP2.active) {
            this.updateLightsOut(this.lightsOutP2, this.player2);
        }
        
        // Update cooldown
        if (indicator.cooldownActive) {
            indicator.cooldownTimer -= 1/60;
            if (indicator.cooldownText) {
                const remaining = Math.max(0, Math.ceil(indicator.cooldownTimer));
                indicator.cooldownText.setText(`Cooldown: ${remaining}`);
                indicator.cooldownText.setVisible(true);
                indicator.cooldownText.setPosition(indicator.x, indicator.y - 50);
            }
            if (indicator.cooldownTimer <= 0) {
                indicator.cooldownActive = false;
                indicator.cooldownTimer = 0;
                if (indicator.cooldownText) {
                    indicator.cooldownText.setVisible(false);
                }
            }
        } else if (indicator.cooldownText) {
            indicator.cooldownText.setVisible(false);
        }
        
        // Update influence
        if (indicator.owner === 'Solari') {
            this.puzzleInfluence.vineFlowSolari = 2;
            this.puzzleInfluence.vineFlowUmbrae = 0;
        } else if (indicator.owner === 'Umbrae') {
            this.puzzleInfluence.vineFlowSolari = 0;
            this.puzzleInfluence.vineFlowUmbrae = 2;
        } else {
            this.puzzleInfluence.vineFlowSolari = 0;
            this.puzzleInfluence.vineFlowUmbrae = 0;
        }
    }

    updateWindTotem() {
        const totem = this.windTotem;
        
        // Check if players are near totem (within 80 pixels)
        const p1Near = Phaser.Math.Distance.Between(this.player1.x, this.player1.y, totem.x, totem.y) < 80;
        const p2Near = Phaser.Math.Distance.Between(this.player2.x, this.player2.y, totem.x, totem.y) < 80;
        
        // Show a circular key indicator above each player when they walk up to the totem
        const updateTotemIndicator = (player, near) => {
            if (near && !player.teleporting && !this.simonSaysP1.active && !this.simonSaysP2.active) {
                if (!player.totemIndicator) {
                    const indicatorGroup = this.add.container(player.x, player.y - 50);
                    const circle = this.add.circle(0, 0, 25, 0xffffff, 0.9);
                    circle.setStrokeStyle(3, 0x000000);
                    const keyText = player.faction === 'Solari'
                        ? this.add.text(0, 0, 'W', { fontSize: '24px', fill: '#000000', fontStyle: 'bold' })
                        : this.add.text(0, -2, '↑', { fontSize: '24px', fill: '#000000', fontStyle: 'bold' });
                    keyText.setOrigin(0.5, 0.5);
                    indicatorGroup.add([circle, keyText]);
                    player.totemIndicator = indicatorGroup;
                } else {
                    player.totemIndicator.setPosition(player.x, player.y - 50);
                    player.totemIndicator.setVisible(true);
                }
            } else {
                if (player.totemIndicator) {
                    player.totemIndicator.setVisible(false);
                }
            }
        };
        
        updateTotemIndicator(this.player1, p1Near);
        updateTotemIndicator(this.player2, p2Near);
        
        // Handle interaction with totem (press W for Player 1, Up Arrow for Player 2)
        // Only allow if no game is currently active and player is not teleporting
        if (p1Near && Phaser.Input.Keyboard.JustDown(this.wKey) && !this.simonSaysP1.active && !this.simonSaysP2.active && !totem.cooldownActive && !this.player1.teleporting) {
            this.teleportToTV(this.player1, this.simonSaysP1);
        }
        
        if (p2Near && Phaser.Input.Keyboard.JustDown(this.upKey) && !this.simonSaysP1.active && !this.simonSaysP2.active && !totem.cooldownActive && !this.player2.teleporting) {
            this.teleportToTV(this.player2, this.simonSaysP2);
        }
        
        // Update Simon Says games (only update active ones)
        if (this.simonSaysP1.active) {
            this.updateSimonSays(this.simonSaysP1, this.player1);
        }
        if (this.simonSaysP2.active) {
            this.updateSimonSays(this.simonSaysP2, this.player2);
        }
        
        // Update cooldown if totem is on cooldown
        if (totem.cooldownActive) {
            totem.cooldownTimer -= 1/60;
            if (totem.cooldownText) {
                const remaining = Math.max(0, Math.ceil(totem.cooldownTimer));
                totem.cooldownText.setText(`Cooldown: ${remaining}`);
                totem.cooldownText.setVisible(true);
                // Keep text anchored above the totem in case it moves in future tweaks
                totem.cooldownText.setPosition(totem.x, totem.y - 45);
            }
            if (totem.cooldownTimer <= 0) {
                totem.cooldownActive = false;
                totem.cooldownTimer = 0;
                if (totem.cooldownText) {
                    totem.cooldownText.setVisible(false);
                    totem.cooldownText.setText('');
                }
                // Reset totem color if no longer owned
                if (!totem.owner) {
                    totem.setFillStyle(0x8B7355);
                }
            }
        } else if (totem.cooldownText) {
            // Ensure text is hidden when not on cooldown
            totem.cooldownText.setVisible(false);
        }
        
        // Update influence based on totem ownership
        if (totem.owner === 'Solari') {
            this.puzzleInfluence.windTotemSolari = 3;
            this.puzzleInfluence.windTotemUmbrae = 0;
        } else if (totem.owner === 'Umbrae') {
            this.puzzleInfluence.windTotemSolari = 0;
            this.puzzleInfluence.windTotemUmbrae = 3;
        } else {
            this.puzzleInfluence.windTotemSolari = 0;
            this.puzzleInfluence.windTotemUmbrae = 0;
        }
    }
    
    teleportToTV(player, game) {
        // Mark player as engaged in the TV mini-game
        player.teleporting = true;
        
        // Store original position for potential future use (if we want to animate back)
        player.originalX = player.x;
        player.originalY = player.y;
        
        // Visually hide the real player from the forest so it looks like they "teleported"
        player.setVisible(false);
        player.body.enable = false; // Freeze physics completely
        
        // Start the Simon Says game on this player's TV
        this.startSimonSays(game, player);
    }
    
    startSimonSays(game, player) {
        // Make sure other player's game is hidden
        if (player.faction === 'Solari') {
            this.hideSimonSays(this.simonSaysP2);
        } else {
            this.hideSimonSays(this.simonSaysP1);
        }
        
        // Reset game state for new session
        game.active = true;
        game.timer = 0;
        game.failed = false;
        game.completed = false;
        game.phase = 'intro';        // first show a one-time explanation
        game.introTimer = 0;
        game.betweenRoundsTimer = 0;
        game.sequenceStepIndex = 0;
        game.sequenceStepTimer = 0;
        game.currentRound = 1;
        game.sequence = [];
        game.inputSequence = [];
        if (game.keyHighlightTimers) {
            game.keyHighlightTimers.up = 0;
            game.keyHighlightTimers.down = 0;
            game.keyHighlightTimers.left = 0;
            game.keyHighlightTimers.right = 0;
        }
        game.currentAngleTarget = 0;
        
        // Reset visuals
        if (game.bg) {
            game.bg.setFillStyle(game.baseColor);
        }
        if (game.totem) {
            game.totem.rotation = 0;
        }
        if (game.keyHints) {
            Object.values(game.keyHints).forEach(text => {
                if (text && text.setColor) {
                    text.setColor('#ffffff');
                }
            });
        }
        if (game.eyes) {
            if (game.eyes.left && game.eyes.left.setFillStyle) {
                game.eyes.left.setFillStyle(game.eyes.baseColor);
            }
            if (game.eyes.right && game.eyes.right.setFillStyle) {
                game.eyes.right.setFillStyle(game.eyes.baseColor);
            }
        }
        if (game.title) {
            game.title.setText('');
        }
        if (game.timerText) {
            game.timerText.setText(`Round 1/${game.maxRounds}`);
        }
        
        // Show game with smooth fade-in animation
        if (game.container) {
            game.container.setVisible(true);
            game.container.setAlpha(0);
            this.tweens.add({
                targets: game.container,
                alpha: 1,
                duration: 400,
                ease: 'Power2'
            });
        }
        
        // Store player reference
        game.player = player;
    }
    
    hideSimonSays(game) {
        game.active = false;
        
        if (game && game.container && game.container.visible) {
            this.tweens.add({
                targets: game.container,
                alpha: 0,
                duration: 250,
                onComplete: () => {
                    game.container.setVisible(false);
                }
            });
        }
        
        // Clear any lingering instruction text once the mini-game is over
        if (game && game.instructionText) {
            game.instructionText.setText('');
        }
        // Hide key hints when the mini-game ends
        if (game && game.keyHints) {
            Object.values(game.keyHints).forEach(text => {
                if (text && text.setVisible) {
                    text.setVisible(false);
                }
            });
        }
    }
    
    updateSimonSays(game, player) {
        if (!game.active) return;

        // Smoothly rotate the totem toward the current target angle
        if (game.totem != null) {
            const lerpFactor = 0.2; // snappier so rotations feel complete and responsive
            game.totem.rotation += (game.currentAngleTarget - game.totem.rotation) * lerpFactor;
        }
        
        // Update key highlight timers so green flashes only last briefly
        if (game.keyHints && game.keyHighlightTimers) {
            const dt = 1 / 60;
            ['up', 'down', 'left', 'right'].forEach(dir => {
                if (game.keyHighlightTimers[dir] > 0) {
                    game.keyHighlightTimers[dir] -= dt;
                    if (game.keyHighlightTimers[dir] <= 0) {
                        const txt = game.keyHints[dir];
                        if (txt && txt.setColor) {
                            txt.setColor('#ffffff');
                        }
                        game.keyHighlightTimers[dir] = 0;
                    }
                }
            });
        }
        
        // Show current round (1–5) instead of a countdown timer
        game.timerText.setText(`Round ${Math.max(1, game.currentRound)}/${game.maxRounds}`);

        // === PHASE STATE MACHINE ===
        // 0) intro: one-time explanation text before ANY rotations happen
        if (game.phase === 'intro') {
            game.introTimer += 1/60;
            // Detailed explanation only at the very beginning, with clear steps
            const controlHint = game.playerFaction === 'Solari' ? 'WASD' : 'the arrow keys';
            game.instructionText.setText(
                'HOW TO PLAY:\n' +
                '1) Watch the totem rotate (↑ → ↓ ←) in order.\n' +
                '2) Remember the rotation sequence.\n' +
                `3) Copy it using ${controlHint}.`
            );
            // Give player more time (~5 seconds) to read before first pattern
            if (game.introTimer >= 5) {
                game.phase = 'waitShow';
                game.betweenRoundsTimer = 0;
                // Now that the HOW TO PLAY text is done, reveal the key hint row
                if (game.keyHints) {
                    Object.values(game.keyHints).forEach(text => {
                        if (text && text.setVisible) {
                            text.setVisible(true);
                        }
                    });
                }
            }
            return;
        }
        
        // 1) waitShow: delay before showing the rotation sequence for the next round
        if (game.phase === 'waitShow') {
            // Simple watch hint only between rounds
            game.instructionText.setText(`ROUND ${game.currentRound}: Watch the totem rotate. Remember the order.`);
            game.betweenRoundsTimer += 1/60;
            // Give a readable pause between rounds so the player can clearly see
            // the "CORRECT" feedback and green-eye flash.
            if (game.betweenRoundsTimer >= 2.5) { // 2.5 second delay
                game.betweenRoundsTimer = 0;
                
                // Generate a NEW random rotation sequence for this round (length = currentRound)
                // Ensure:
                //  - Each step is different from the previous step (no "no-move" frames)
                //  - The first step is never 'up' so we always see motion from upright
                const allDirs = ['up', 'right', 'down', 'left'];
                game.sequence = [];
                let lastDir = null;
                for (let i = 0; i < game.currentRound; i++) {
                    let pool = allDirs.filter(d => d !== lastDir);
                    if (i === 0) {
                        // Avoid 'up' on the very first step so the first move is always visible
                        pool = pool.filter(d => d !== 'up');
                    }
                    const pickIndex = Phaser.Math.Between(0, pool.length - 1);
                    const dir = pool[pickIndex];
                    game.sequence.push(dir);
                    lastDir = dir;
                }
                
                game.phase = 'show';
                game.sequenceStepIndex = 0;
                game.sequenceStepTimer = 0;
                // Reset target rotation and snap totem to neutral at the start of the show phase
                game.currentAngleTarget = 0;
                if (game.totem) {
                    game.totem.rotation = 0;
                }
            }
            return;
        }
        
        // 2) show: rotate the totem step by step to display the sequence
        if (game.phase === 'show') {
            // Slower so it's easier to read the pattern
            const stepDuration = 1.4; // seconds per step
            const currentDir = game.sequence[game.sequenceStepIndex];
            const dirToAngle = {
                up: 0,
                right: Math.PI / 2,
                down: Math.PI,
                left: -Math.PI / 2
            };
            const angle = dirToAngle[currentDir] ?? 0;

            game.sequenceStepTimer += 1/60;
            
            // For the whole step, smoothly rotate toward this step's angle
            game.currentAngleTarget = angle;

            if (game.sequenceStepTimer >= stepDuration) {
                // Move to next step
                game.sequenceStepTimer = 0;
                game.sequenceStepIndex++;
                
                if (game.sequenceStepIndex >= game.currentRound) {
                    // Done showing this round's sequence -> short "sequence over" pause
                    game.phase = 'readyInput';
                    game.inputSequence = [];
                    game.readyTimer = 0;
                    // Start easing back to neutral during the pause so the last step isn't a free hint
                    game.currentAngleTarget = 0;
                }
            }
            return;
        }

        // 2.5) readyInput: pause after the pattern ends so it's obvious the sequence is over
        if (game.phase === 'readyInput') {
            const dt = 1 / 60;
            game.readyTimer += dt;
            // Keep the totem returning to neutral during this pause
            game.currentAngleTarget = 0;
            if (game.instructionText) {
                const controlHint = game.playerFaction === 'Solari' ? 'WASD' : 'the arrow keys';
                game.instructionText.setText(`SEQUENCE OVER: Get ready to copy with ${controlHint}.`);
            }
            // Give the player a full 3 seconds to reset before input starts
            if (game.readyTimer >= 3.0) {
                // Now clearly switch into input phase
                game.phase = 'input';
                if (game.instructionText) {
                    const controlHint = game.playerFaction === 'Solari' ? 'WASD' : 'the arrow keys';
                    game.instructionText.setText(`YOUR TURN: Copy the rotation using ${controlHint}.`);
                }
            }
            return;
        }
        
        // 3) input: player must repeat the rotation sequence using WASD / Arrow keys
        if (game.phase === 'input') {
            // We'll compute "just pressed" manually using isDown + last flags,
            // to make sure arrow keys always work reliably.
            let upIsDown = false;
            let downIsDown = false;
            let leftIsDown = false;
            let rightIsDown = false;
            
            if (game.playerFaction === 'Solari') {
                // Player 1 uses WASD
                upIsDown = this.wKey.isDown;
                downIsDown = this.sKey.isDown;
                leftIsDown = this.cursorsWASD.A.isDown;
                rightIsDown = this.cursorsWASD.D.isDown;
            } else {
                // Player 2 uses ARROWS
                // Use BOTH dedicated keys and cursorKeys so Up Arrow always registers
                upIsDown = this.upKey.isDown || this.cursorsArrows.up.isDown;
                downIsDown = this.downKey.isDown || this.cursorsArrows.down.isDown;
                leftIsDown = this.cursorsArrows.left.isDown;
                rightIsDown = this.cursorsArrows.right.isDown;
            }
            
            // Edge-detect presses (so a key only counts once per tap)
            const upPressed = upIsDown && !game.lastUp;
            const downPressed = downIsDown && !game.lastDown;
            const leftPressed = leftIsDown && !game.lastLeft;
            const rightPressed = rightIsDown && !game.lastRight;
            
            // Update last states for next frame
            game.lastUp = upIsDown;
            game.lastDown = downIsDown;
            game.lastLeft = leftIsDown;
            game.lastRight = rightIsDown;
            
            // Decide if a direction was just pressed this frame
            let pressedDir = null;
            if (upPressed) pressedDir = 'up';
            else if (rightPressed) pressedDir = 'right';
            else if (downPressed) pressedDir = 'down';
            else if (leftPressed) pressedDir = 'left';
            
            // Handle new directional input (up to currentRound length)
            if (pressedDir) {
                if (!Array.isArray(game.inputSequence)) {
                    game.inputSequence = [];
                }
                if (game.inputSequence.length < game.currentRound) {
                    const inputIndex = game.inputSequence.length;
                    const expectedDir = game.sequence[inputIndex];
                    // Fail immediately if any input does not match the expected direction
                    if (pressedDir !== expectedDir) {
                        game.inputSequence.push(pressedDir);
                        game.phase = 'checking';
                        game.checkTimer = 0;
                        game.inputMismatch = true;
                    } else {
                        game.inputSequence.push(pressedDir);
                    }
                    
                    // Visual feedback – rotate the totem toward the input direction (animated via lerp)
                    const dirToAngle = {
                        up: 0,
                        right: Math.PI / 2,
                        down: Math.PI,
                        left: -Math.PI / 2
                    };
                    const angle = dirToAngle[pressedDir] ?? 0;
                    game.currentAngleTarget = angle;
                }
                
                // Highlight the corresponding key hint in green to show it was pressed
                if (game.keyHints && game.keyHints[pressedDir] && game.keyHints[pressedDir].setColor) {
                    game.keyHints[pressedDir].setColor('#00ff00');
                    if (game.keyHighlightTimers) {
                        game.keyHighlightTimers[pressedDir] = 1.0; // seconds
                    }
                }
            }
            
            // Once the player has entered a full (correct so far) sequence for this round, start a short "checking" delay
            if (!game.inputMismatch && game.inputSequence.length === game.currentRound) {
                game.phase = 'checking';
                game.checkTimer = 0;
            }
            return;
        }

        // 4) checking: brief pause after last key before showing result / next round
        if (game.phase === 'checking') {
            game.checkTimer += 1/60;
            if (game.checkTimer < 1) {
                // During this brief delay, freeze the totem on the last input direction and ignore input
                return;
            }

            // After delay, evaluate the player's input against the sequence
            let correct = true;
            // If we already detected a mismatch earlier, treat as incorrect immediately
            if (game.inputMismatch) {
                correct = false;
            } else {
                for (let i = 0; i < game.currentRound; i++) {
                    if (game.inputSequence[i] !== game.sequence[i]) {
                        correct = false;
                        break;
                    }
                }
            }

            if (!correct) {
                // Wrong sequence -> FAIL
                if (game.title) {
                    game.title.setText('');
                }
                // Reset key hints back to white for clarity
                if (game.keyHints) {
                    Object.values(game.keyHints).forEach(text => {
                        if (text && text.setColor) {
                            text.setColor('#ffffff');
                        }
                    });
                }
                // Make sure the totem returns to its neutral rotation
                game.currentAngleTarget = 0;
                // Change totem eyes to red instead of the TV background
                if (game.eyes) {
                    if (game.eyes.left && game.eyes.left.setFillStyle) {
                        game.eyes.left.setFillStyle(0xff0000);
                    }
                    if (game.eyes.right && game.eyes.right.setFillStyle) {
                        game.eyes.right.setFillStyle(0xff0000);
                    }
                }
                if (game.instructionText) {
                    game.instructionText.setText('WRONG! The totem resists your pattern.');
                }
                game.phase = 'done';
                game.active = false;
                // Give the player time to read the fail message
                this.time.delayedCall(2000, () => this.endSimonSays(game, false));
            } else {
                // Correct sequence for this round
                if (game.currentRound >= game.maxRounds) {
                    // All rounds completed -> WIN
                    if (game.title) {
                        game.title.setText('');
                    }
                    // Reset key hints back to white
                    if (game.keyHints) {
                        Object.values(game.keyHints).forEach(text => {
                            if (text && text.setColor) {
                                text.setColor('#ffffff');
                            }
                        });
                    }
                    // Make sure the totem returns to its neutral rotation
                    game.currentAngleTarget = 0;
                    // Change totem eyes to green for a win
                    if (game.eyes) {
                        if (game.eyes.left && game.eyes.left.setFillStyle) {
                            game.eyes.left.setFillStyle(0x00ff00);
                        }
                        if (game.eyes.right && game.eyes.right.setFillStyle) {
                            game.eyes.right.setFillStyle(0x00ff00);
                        }
                    }
                    if (game.instructionText) {
                        game.instructionText.setText('PERFECT! You mastered the winds.');
                    }
                    game.phase = 'done';
                    game.active = false;
                    // Give the player time to read the success message
                    this.time.delayedCall(2000, () => this.endSimonSays(game, true));
                } else {
                    // Advance to next round
                    game.currentRound++;
                    game.inputSequence = [];
                    game.sequence = [];
                    game.phase = 'waitShow';
                    game.betweenRoundsTimer = 0;
                    // Ensure the totem fully relaxes back to normal before the next round begins
                    game.currentAngleTarget = 0;
                    // Clear input display and give a clear "next round" hint
                    if (game.title) {
                        game.title.setText('');
                    }
                    if (game.instructionText) {
                        game.instructionText.setText(`CORRECT! Get ready for round ${game.currentRound}.`);
                    }
                    // Flash eyes green to reward a successful round
                    if (game.eyes) {
                        if (game.eyes.left && game.eyes.left.setFillStyle) {
                            game.eyes.left.setFillStyle(0x00ff00);
                        }
                        if (game.eyes.right && game.eyes.right.setFillStyle) {
                            game.eyes.right.setFillStyle(0x00ff00);
                        }
                        // After a delay matching the between-round pause, restore to
                        // base color so the next round starts from a neutral state.
                        // (2.5 seconds to line up with waitShow's delay.)
                        this.time.delayedCall(2500, () => {
                            if (game.eyes.left && game.eyes.left.setFillStyle) {
                                game.eyes.left.setFillStyle(game.eyes.baseColor);
                            }
                            if (game.eyes.right && game.eyes.right.setFillStyle) {
                                game.eyes.right.setFillStyle(game.eyes.baseColor);
                            }
                        });
                    }
                    // Reset key hints for the next round
                    if (game.keyHints) {
                        Object.values(game.keyHints).forEach(text => {
                            if (text && text.setColor) {
                                text.setColor('#ffffff');
                            }
                        });
                    }
                }
            }
            return;
        }
    }
    
    endSimonSays(game, success) {
        const player = game.player;
        
        // Restore real player visibility/physics
        if (player) {
            player.teleporting = false;
            player.setVisible(true);
            if (player.body) {
                player.body.enable = true;
                player.body.setAllowGravity(true);
                player.body.setVelocity(0, 0);
            }
        }
        
        // Hide game UI
        this.hideSimonSays(game);
        
        if (success) {
            // Player won - claim totem and give rewards
            this.windTotem.owner = game.playerFaction;
            this.windTotem.cooldownActive = true;
            this.windTotem.cooldownTimer = 20; // 20 second cooldown before next attempt
            
            // Give speed boost for 20 seconds
            if (game.playerFaction === 'Solari') {
                this.player1.body.setMaxVelocity(this.playerSpeed * 1.5, 1000);
                this.time.delayedCall(20000, () => {
                    this.player1.body.setMaxVelocity(this.playerSpeed, 1000);
                });
            } else {
                this.player2.body.setMaxVelocity(this.playerSpeed * 1.5, 1000);
                this.time.delayedCall(20000, () => {
                    this.player2.body.setMaxVelocity(this.playerSpeed, 1000);
                });
            }
            
            // Visual feedback - totem glows with player color
            const glowColor = game.playerFaction === 'Solari' ? 0xFFD700 : 0x8B00FF;
            this.windTotem.setFillStyle(glowColor);
        } else {
            // Player failed - no rewards, but can try again after short cooldown
            this.windTotem.cooldownActive = true;
            this.windTotem.cooldownTimer = 20; // 20 second cooldown on failure
        }
    }
    
    teleportToVineTV(player, game) {
        player.teleporting = true;
        player.originalX = player.x;
        player.originalY = player.y;
        player.setVisible(false);
        player.body.enable = false;
        this.startLightsOut(game, player);
    }
    
    startLightsOut(game, player) {
        // Make sure the other player's game is completely hidden first
        if (player.faction === 'Solari') {
            if (this.lightsOutP2 && this.lightsOutP2.container) {
                this.lightsOutP2.container.setVisible(false);
                this.lightsOutP2.container.setAlpha(0);
                this.lightsOutP2.active = false;
            }
        } else {
            if (this.lightsOutP1 && this.lightsOutP1.container) {
                this.lightsOutP1.container.setVisible(false);
                this.lightsOutP1.container.setAlpha(0);
                this.lightsOutP1.active = false;
            }
        }
        
        game.active = true;
        game.player = player;
        game.completed = false;
        game.phase = 'intro';
        game.introTimer = 0;
        game.timer = 15; // Reset timer to 15 seconds
        
        // Set target state - both want all vines in their color (ON)
        game.targetState = true;
        
        // Check if vines are owned by opponent
        const currentOwner = this.vineFlowIndicator.owner;
        game.currentOwner = currentOwner; // Store for visual purposes
        
        // Generate starting pattern based on ownership
        this.generateLightsOutPuzzle(game, currentOwner, player.faction);
        
        // Update visual state
        this.updateLightsOutVisuals(game);
        
        // Show container with fade-in
        game.container.setVisible(true);
        this.tweens.add({
            targets: game.container,
            alpha: 1,
            duration: 250
        });
    }
    
    generateLightsOutPuzzle(game, currentOwner, playerFaction) {
        // Generate starting pattern based on ownership
        const numVines = 7;
        const vineState = [];
        const vineToggled = [];
        
        if (currentOwner === null) {
            // First player: Start with all green (OFF)
            for (let i = 0; i < numVines; i++) {
                vineState.push(false); // All OFF (green)
                vineToggled.push(false); // None toggled yet
            }
        } else if (currentOwner !== playerFaction) {
            // Opponent owns it: Start with ALL vines ON in opponent's color
            // All must be ON (true) and NOT toggled (so they show opponent color)
            for (let i = 0; i < numVines; i++) {
                vineState.push(true); // All ON
                vineToggled.push(false); // Not toggled yet = opponent's color
            }
        } else {
            // Player already owns it: Shouldn't happen (can't challenge yourself)
            // But if it does, start with all player's color
            for (let i = 0; i < numVines; i++) {
                vineState.push(true); // All ON
                vineToggled.push(true); // Already toggled = player's color
            }
        }
        
        game.vineState = vineState;
        game.vineToggled = vineToggled;
        game.currentOwner = currentOwner; // Store for visual purposes
    }
    
    updateLightsOutVisuals(game) {
        const numVines = 7;
        const opponentOwns = game.currentOwner && game.currentOwner !== game.playerFaction;
        
        for (let i = 0; i < numVines; i++) {
            const vine = game.vines[i];
            const isOn = game.vineState[i];
            vine.isOn = isOn;
            
            if (isOn) {
                // If opponent owns it and player hasn't toggled this vine yet, show opponent's color
                // Once player toggles it, show player's color
                const color = (opponentOwns && !game.vineToggled[i]) 
                    ? game.opponentColor 
                    : game.onColor;
                vine.setFillStyle(color);
                vine.setStrokeStyle(2, 0xffffff); // White border always visible
                vine.glow.setAlpha(0.8);
            } else {
                // OFF = green (unowned or toggled off)
                vine.setFillStyle(game.offColor);
                vine.setStrokeStyle(2, 0xffffff); // White border always visible
                vine.glow.setAlpha(0);
            }
        }
    }
    
    toggleLightsOutVine(game, index) {
        const numVines = 7;
        
        // Toggle the pressed vine and its neighbors
        // Vine 0: toggles 0, 1
        // Vine 1: toggles 0, 1, 2
        // Vine 2: toggles 1, 2, 3
        // Vine 3: toggles 2, 3, 4
        // Vine 4: toggles 3, 4, 5
        // Vine 5: toggles 4, 5, 6
        // Vine 6: toggles 5, 6
        
        const toggles = [];
        if (index === 0) {
            toggles.push(0, 1);
        } else if (index === numVines - 1) {
            toggles.push(index - 1, index);
        } else {
            toggles.push(index - 1, index, index + 1);
        }
        
        const opponentOwns = game.currentOwner && game.currentOwner !== game.playerFaction;
        
        toggles.forEach(i => {
            if (i >= 0 && i < numVines) {
                const wasOn = game.vineState[i];
                const wasToggled = game.vineToggled[i];
                
                // Toggle the vine state
                game.vineState[i] = !game.vineState[i];
                
                // Update toggled state based on new state
                if (game.vineState[i]) {
                    // Vine is now ON
                    if (opponentOwns) {
                        // If opponent owns it and vine was OFF, toggling it ON means player color
                        // If vine was ON in opponent color and toggled OFF then ON, it's player color
                        // Once a vine is toggled by player, it should always be player color when ON
                        if (wasToggled || !wasOn) {
                            // Was previously toggled OR was OFF - becomes player color
                            game.vineToggled[i] = true;
                        } else {
                            // Was ON in opponent color and toggled to ON again without going OFF
                            // This shouldn't happen, but if it does, check if player has toggled others
                            const hasToggledOthers = game.vineToggled.some((t, idx) => idx !== i && t === true);
                            if (hasToggledOthers) {
                                // Player has toggled other vines - this one should be player color too
                                game.vineToggled[i] = true;
                            } else {
                                // Still in opponent color (starting state)
                                game.vineToggled[i] = false;
                            }
                        }
                    } else {
                        // No opponent - first player, always player color when ON
                        game.vineToggled[i] = true;
                    }
                } else {
                    // Vine is now OFF - keep toggled state (remembers if it was player color)
                    // Don't reset toggled flag
                }
                
                // Visual feedback - brief highlight
                const vine = game.vines[i];
                this.tweens.add({
                    targets: vine,
                    scaleX: 1.2,
                    scaleY: 1.2,
                    duration: 100,
                    yoyo: true,
                    ease: 'Power2'
                });
            }
        });
        
        // Update visuals after toggling
        this.updateLightsOutVisuals(game);
        
        // Check for punishment: if opponent owns and player has converted vines to their color,
        // but then all vines are back to opponent color (all ON but not toggled)
        if (opponentOwns && game.phase === 'playing') {
            const hasToggledAny = game.vineToggled.some(t => t === true);
            if (hasToggledAny) {
                // Player has toggled at least one vine to their color
                // Check if ALL vines are now back to opponent color (ON but not toggled)
                let allBackToOpponent = true;
                for (let j = 0; j < numVines; j++) {
                    if (!game.vineState[j] || game.vineToggled[j]) {
                        // Vine is OFF or in player color
                        allBackToOpponent = false;
                        break;
                    }
                }
                if (allBackToOpponent) {
                    // All vines are back to opponent color - punishment
                    game.phase = 'done';
                    game.completed = false;
                    if (game.statusText) {
                        game.statusText.setText('WRONG! The vines resist your touch.');
                        game.statusText.setFill('#ff0000');
                        game.statusText.setVisible(true);
                        game.statusText.setDepth(200);
                        game.statusText.setAlpha(1);
                    }
                    this.time.delayedCall(2000, () => this.endLightsOut(game, false));
                    return;
                }
            }
        }
    }
    
    checkLightsOutComplete(game) {
        const numVines = 7;
        
        // Check if all vines are ON and in player's color
        // All must be ON (true) AND toggled by player (showing player color, not opponent color)
        for (let i = 0; i < numVines; i++) {
            // Vine must be ON
            if (game.vineState[i] !== true) {
                return false;
            }
            // If opponent owns it, vine must have been toggled by player to show player color
            const opponentOwns = game.currentOwner && game.currentOwner !== game.playerFaction;
            if (opponentOwns && !game.vineToggled[i]) {
                return false; // Vine is still in opponent's color
            }
        }
        return true; // All vines are ON and in player's color
    }
    
    hideLightsOut(game) {
        if (!game) return;
        
        game.active = false;
        // Hide timer text when game ends
        if (game.timerText) {
            game.timerText.setVisible(false);
        }
        if (game.container) {
            if (game.container.visible) {
                this.tweens.add({
                    targets: game.container,
                    alpha: 0,
                    duration: 250,
                    onComplete: () => {
                        if (game.container) {
                            game.container.setVisible(false);
                        }
                    }
                });
            } else {
                // Already hidden, just make sure alpha is 0
                game.container.setAlpha(0);
            }
        }
        if (game.instructionText) {
            game.instructionText.setText('');
        }
        // Hide status text when game ends
        if (game.statusText) {
            game.statusText.setVisible(false);
        }
    }
    
    updateLightsOut(game, player) {
        if (!game.active) return;
        
        const dt = 1/60;
        
        // Intro phase
        if (game.phase === 'intro') {
            game.introTimer += dt;
            const goalText = game.playerFaction === 'Solari' 
                ? 'Light ALL vines ON (Sun rewards you!)' 
                : 'Light ALL vines ON (Darkness rewards you!)';
            const keyHint = game.playerFaction === 'Solari' ? '1-7' : '4-0';
            game.instructionText.setText(
                `HOW TO PLAY:\nPress keys ${keyHint} to toggle vines.\nEach press affects that vine and its neighbors.\n${goalText}`
            );
            if (game.introTimer >= 3) {
                game.phase = 'playing';
                const goalText = game.playerFaction === 'Solari' ? 'Turn ALL lights ON' : 'Turn ALL lights OFF';
                game.instructionText.setText(`Goal: ${goalText}`);
                // Show timer text when game actually starts
                if (game.timerText) {
                    game.timerText.setVisible(true);
                    game.timerText.setText('15');
                }
            }
            return;
        }
        
        if (game.phase === 'playing') {
            // Update timer
            game.timer -= dt;
            if (game.timerText) {
                const remaining = Math.max(0, Math.ceil(game.timer));
                game.timerText.setText(`${remaining}`);
                // Change color as time runs out
                if (remaining <= 5) {
                    game.timerText.setFill('#ff0000'); // Red when low
                } else if (remaining <= 10) {
                    game.timerText.setFill('#ffaa00'); // Orange
                } else {
                    game.timerText.setFill('#ffff00'); // Yellow
                }
            }
            
            // Check for timeout
            if (game.timer <= 0) {
                game.phase = 'done';
                game.completed = false;
                if (game.statusText) {
                    game.statusText.setText('TIME UP! The forest rejects your pattern.');
                    game.statusText.setFill('#ff0000');
                    game.statusText.setVisible(true);
                    game.statusText.setDepth(200);
                    game.statusText.setAlpha(1);
                }
                this.time.delayedCall(2000, () => this.endLightsOut(game, false));
                return;
            }
            
            // Initialize number keys if not already done
            if (!game.numKeys) {
                if (game.playerFaction === 'Solari') {
                    // Player 1: Keys 1-7
                    game.numKeys = {
                        '1': this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ONE),
                        '2': this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.TWO),
                        '3': this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.THREE),
                        '4': this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.FOUR),
                        '5': this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.FIVE),
                        '6': this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SIX),
                        '7': this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SEVEN)
                    };
                    game.keyMap = { '1': 0, '2': 1, '3': 2, '4': 3, '5': 4, '6': 5, '7': 6 };
                } else {
                    // Player 2: Keys 4-0 (4, 5, 6, 7, 8, 9, 0)
                    game.numKeys = {
                        '4': this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.FOUR),
                        '5': this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.FIVE),
                        '6': this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SIX),
                        '7': this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SEVEN),
                        '8': this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.EIGHT),
                        '9': this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.NINE),
                        '0': this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ZERO)
                    };
                    game.keyMap = { '4': 0, '5': 1, '6': 2, '7': 3, '8': 4, '9': 5, '0': 6 };
                }
            }
            
            // Check for number key presses
            for (const [key, vineIndex] of Object.entries(game.keyMap)) {
                if (Phaser.Input.Keyboard.JustDown(game.numKeys[key])) {
                    // Check if game is still active (might have been ended by punishment)
                    if (!game.active || game.phase !== 'playing') {
                        break;
                    }
                    
                    this.toggleLightsOutVine(game, vineIndex);
                    
                    // Check if punishment was triggered (game ended)
                    if (!game.active || game.phase !== 'playing') {
                        break;
                    }
                    
                    // Check for win condition (all vines in player's color)
                    if (this.checkLightsOutComplete(game)) {
                        game.phase = 'done';
                        game.completed = true;
                        const rewardText = game.playerFaction === 'Solari' 
                            ? 'PERFECT! The vines answer to the Sun.' 
                            : 'PERFECT! The vines answer to Darkness.';
                        if (game.statusText) {
                            game.statusText.setText(rewardText);
                            game.statusText.setFill('#00ff00');
                            game.statusText.setVisible(true);
                            game.statusText.setDepth(200);
                            game.statusText.setAlpha(1);
                        }
                        this.time.delayedCall(2000, () => this.endLightsOut(game, true));
                    }
                    break;
                }
            }
        }
    }
    
    endLightsOut(game, success) {
        const player = game.player;
        
        if (player) {
            player.teleporting = false;
            player.setVisible(true);
            if (player.body) {
                player.body.enable = true;
                player.body.setAllowGravity(true);
                player.body.setVelocity(0, 0);
            }
        }
        
        this.hideLightsOut(game);
        
        if (success) {
            // Win: Claim ownership and get +2 influence/sec
            // Only one player can control at a time - set owner
            this.vineFlowIndicator.owner = game.playerFaction;
            if (game.playerFaction === 'Solari') {
                this.puzzleInfluence.vineFlowSolari = 2;
                this.puzzleInfluence.vineFlowUmbrae = 0;
            } else {
                this.puzzleInfluence.vineFlowSolari = 0;
                this.puzzleInfluence.vineFlowUmbrae = 2;
            }
            // No cooldown when someone owns it - they can be challenged immediately
        } else {
            // Failure: -2 influence/sec and slower vine movement for 20 seconds
            if (game.playerFaction === 'Solari') {
                this.puzzleInfluence.vineFlowSolari = -2;
                // Apply slower vine movement
                if (player) {
                    player.vineClimbSpeed = this.climbSpeed * 0.5; // Half speed on vines
                    this.time.delayedCall(20000, () => {
                        if (player) {
                            player.vineClimbSpeed = this.climbSpeed;
                        }
                    });
                }
            } else {
                this.puzzleInfluence.vineFlowUmbrae = -2;
                // Apply slower vine movement
                if (player) {
                    player.vineClimbSpeed = this.climbSpeed * 0.5; // Half speed on vines
                    this.time.delayedCall(20000, () => {
                        if (player) {
                            player.vineClimbSpeed = this.climbSpeed;
                        }
                    });
                }
            }
            
            // Only apply cooldown if no one owns the vines (when owner is null)
            if (this.vineFlowIndicator.owner === null) {
                this.vineFlowIndicator.cooldownActive = true;
                this.vineFlowIndicator.cooldownTimer = 20;
            }
        }
    }

    updateBalanceMeter() {
        // Calculate influence per second from all puzzles
        let solariInfluencePerSec = 0;
        let umbraeInfluencePerSec = 0;
        
        // Vine Flow Puzzle influence
        solariInfluencePerSec += this.puzzleInfluence.vineFlowSolari || 0;
        umbraeInfluencePerSec += this.puzzleInfluence.vineFlowUmbrae || 0;
        
        // Wind Totem influence
        if (this.puzzleInfluence.windTotemSolari) {
            solariInfluencePerSec += this.puzzleInfluence.windTotemSolari;
        }
        if (this.puzzleInfluence.windTotemUmbrae) {
            umbraeInfluencePerSec += this.puzzleInfluence.windTotemUmbrae;
        }
        
        // Forest Runes influence (2/sec per pillar: 1=2, 2=4, 3=6)
        if (this.puzzleInfluence.forestRunes) {
            if (this.puzzleInfluence.forestRunes > 0) {
                solariInfluencePerSec += this.puzzleInfluence.forestRunes;
            } else {
                umbraeInfluencePerSec += Math.abs(this.puzzleInfluence.forestRunes);
            }
        }
        
        // Vine Pattern influence (if implemented)
        if (this.puzzleInfluence.vinePattern) {
            if (this.puzzleInfluence.vinePattern > 0) {
                solariInfluencePerSec += this.puzzleInfluence.vinePattern;
            } else {
                umbraeInfluencePerSec += Math.abs(this.puzzleInfluence.vinePattern);
            }
        }
        
        // Update influence values (per second, assuming 60 FPS)
        this.player1Influence += solariInfluencePerSec / 60;
        this.player2Influence += umbraeInfluencePerSec / 60;
        
        // Clamp to max
        this.player1Influence = Phaser.Math.Clamp(this.player1Influence, 0, this.maxInfluence);
        this.player2Influence = Phaser.Math.Clamp(this.player2Influence, 0, this.maxInfluence);
        
        // Update bar visuals
        const p1BarWidth = (this.player1Influence / this.maxInfluence) * 400;
        const p2BarWidth = (this.player2Influence / this.maxInfluence) * 400;
        
        this.player1BarFill.setSize(p1BarWidth, 25);
        this.player2BarFill.setSize(p2BarWidth, 25);
        
        // Update text
        this.player1InfluenceText.setText(`${Math.floor(this.player1Influence)}/500`);
        this.player2InfluenceText.setText(`${Math.floor(this.player2Influence)}/500`);
        
        // Spawn new territory blocks ONLY when integer influence increases,
        // and place them near the respective player so territory follows where
        // they have actually been walking.
        const solariInt = Math.floor(this.player1Influence);
        const umbraeInt = Math.floor(this.player2Influence);
        
        if (this.lastSolariInfluenceInt === undefined) this.lastSolariInfluenceInt = 0;
        if (this.lastUmbraeInfluenceInt === undefined) this.lastUmbraeInfluenceInt = 0;
        
        if (solariInt > this.lastSolariInfluenceInt) {
            for (let i = this.lastSolariInfluenceInt; i < solariInt; i++) {
                this.spawnInfluenceBlock(0xFFD700, this.solariTerritoryBlocks);
            }
            this.lastSolariInfluenceInt = solariInt;
        }
        
        if (umbraeInt > this.lastUmbraeInfluenceInt) {
            for (let i = this.lastUmbraeInfluenceInt; i < umbraeInt; i++) {
                this.spawnInfluenceBlock(0x8B00FF, this.umbraeTerritoryBlocks);
            }
            this.lastUmbraeInfluenceInt = umbraeInt;
        }
        
        // Check for game end (player reaches 500)
        if (this.player1Influence >= this.maxInfluence) {
            this.endLevel('Solari');
        } else if (this.player2Influence >= this.maxInfluence) {
            this.endLevel('Umbrae');
        }
    }

    endLevel(winner) {
        // Display outcome
        console.log('Level ended! Winner:', winner);
        console.log('Final influence - Solari:', Math.floor(this.player1Influence), 'Umbrae:', Math.floor(this.player2Influence));
        
        // Create end screen text
        let winnerText;
        if (winner) {
            winnerText = this.add.text(640, 300, `${winner} WINS!`, { 
                fontSize: '48px', 
                fill: winner === 'Solari' ? '#FFD700' : '#8B00FF',
                fontStyle: 'bold'
            }).setOrigin(0.5, 0.5);
        } else {
            winnerText = this.add.text(640, 300, 'NO RESULT', { 
                fontSize: '48px', 
                fill: '#888888',
                fontStyle: 'bold'
            }).setOrigin(0.5, 0.5);
        }
        
        const finalScoreText = this.add.text(640, 360, 
            `Solari: ${Math.floor(this.player1Influence)} | Umbrae: ${Math.floor(this.player2Influence)}`, 
            { fontSize: '24px', fill: '#ffffff' }
        ).setOrigin(0.5, 0.5);
        
        // Stop game updates
        this.scene.pause();
        
        // In future, transition to next level
        // this.scene.start('VolcanoLevel');
    }
}
