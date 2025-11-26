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
        this.add.text(320, 30, 'SOLARI', { fontSize: '18px', fill: '#FFD700', fontStyle: 'bold' }).setOrigin(0.5, 0.5);
        this.player1InfluenceText = this.add.text(320, 55, '0/500', { fontSize: '14px', fill: '#ffffff' }).setOrigin(0.5, 0.5);
        
        // Player 2 (Umbrae) influence bar
        this.player2BarBg = this.add.rectangle(960, 30, 400, 30, 0x333333);
        this.player2BarBg.setOrigin(0.5, 0.5);
        this.player2BarFill = this.add.rectangle(760, 30, 0, 25, 0x8B00FF); // Purple
        this.player2BarFill.setOrigin(0, 0.5);
        this.add.text(960, 30, 'UMBRAE', { fontSize: '18px', fill: '#8B00FF', fontStyle: 'bold' }).setOrigin(0.5, 0.5);
        this.player2InfluenceText = this.add.text(960, 55, '0/500', { fontSize: '14px', fill: '#ffffff' }).setOrigin(0.5, 0.5);
        
        // ===== INFLUENCE MAP BLOCKS =====
        // Visual "territory" blocks on the map that reflect how many points of influence
        // each faction currently has. One block == one influence point.
        this.createInfluenceBlocks();
        
        // ===== PLATFORMS =====
        this.platforms = [];
        
        // Ground level platform (main floor) - compressed to fit above TV area
        const ground = this.add.rectangle(640, 480, 1280, 80, 0x8B4513);
        ground.setOrigin(0.5, 0.5);
        this.physics.add.existing(ground, true);
        this.platforms.push(ground);
        
        // Middle platform (for Vine Pattern Wall) - adjusted for compressed view
        const middlePlatform = this.add.rectangle(640, 280, 400, 30, 0x654321);
        middlePlatform.setOrigin(0.5, 0.5);
        this.physics.add.existing(middlePlatform, true);
        this.platforms.push(middlePlatform);
        
        // Top platform (for Wind Totem Dial) - adjusted for compressed view
        const topPlatform = this.add.rectangle(640, 100, 300, 30, 0x654321);
        topPlatform.setOrigin(0.5, 0.5);
        this.physics.add.existing(topPlatform, true);
        this.platforms.push(topPlatform);
        
        // Additional platforms for parkour - creating a path to the top (compressed)
        // Step 1: Platforms from ground to middle level
        const leftPlatform1 = this.add.rectangle(300, 400, 150, 25, 0x654321);
        leftPlatform1.setOrigin(0.5, 0.5);
        this.physics.add.existing(leftPlatform1, true);
        this.platforms.push(leftPlatform1);
        
        const rightPlatform1 = this.add.rectangle(980, 400, 150, 25, 0x654321);
        rightPlatform1.setOrigin(0.5, 0.5);
        this.physics.add.existing(rightPlatform1, true);
        this.platforms.push(rightPlatform1);
        
        // Step 2: Platforms to reach middle platform
        const leftPlatform2 = this.add.rectangle(400, 340, 120, 25, 0x654321);
        leftPlatform2.setOrigin(0.5, 0.5);
        this.physics.add.existing(leftPlatform2, true);
        this.platforms.push(leftPlatform2);
        
        const rightPlatform2 = this.add.rectangle(880, 340, 120, 25, 0x654321);
        rightPlatform2.setOrigin(0.5, 0.5);
        this.physics.add.existing(rightPlatform2, true);
        this.platforms.push(rightPlatform2);
        
        // Step 3: Platforms from middle to top level
        const leftPlatform3 = this.add.rectangle(450, 200, 100, 25, 0x654321);
        leftPlatform3.setOrigin(0.5, 0.5);
        this.physics.add.existing(leftPlatform3, true);
        this.platforms.push(leftPlatform3);
        
        const rightPlatform3 = this.add.rectangle(830, 200, 100, 25, 0x654321);
        rightPlatform3.setOrigin(0.5, 0.5);
        this.physics.add.existing(rightPlatform3, true);
        this.platforms.push(rightPlatform3);
        
        // Step 4: Final platforms to reach top platform
        const leftPlatform4 = this.add.rectangle(500, 140, 100, 25, 0x654321);
        leftPlatform4.setOrigin(0.5, 0.5);
        this.physics.add.existing(leftPlatform4, true);
        this.platforms.push(leftPlatform4);
        
        const rightPlatform4 = this.add.rectangle(780, 140, 100, 25, 0x654321);
        rightPlatform4.setOrigin(0.5, 0.5);
        this.physics.add.existing(rightPlatform4, true);
        this.platforms.push(rightPlatform4);
        
        // ===== VINES (Climbable) =====
        this.vines = [];
        // Left vine (goes from ground to top) - compressed
        const leftVine = this.add.rectangle(100, 240, 20, 400, 0x228B22);
        leftVine.setOrigin(0.5, 0.5);
        this.physics.add.existing(leftVine, true);
        this.vines.push(leftVine);
        
        // Right vine (goes from ground to top) - compressed
        const rightVine = this.add.rectangle(1180, 240, 20, 400, 0x228B22);
        rightVine.setOrigin(0.5, 0.5);
        this.physics.add.existing(rightVine, true);
        this.vines.push(rightVine);
        
        // Center-left vine (from middle platform to top) - compressed
        const centerLeftVine = this.add.rectangle(350, 190, 20, 180, 0x228B22);
        centerLeftVine.setOrigin(0.5, 0.5);
        this.physics.add.existing(centerLeftVine, true);
        this.vines.push(centerLeftVine);
        
        // Center-right vine (from middle platform to top) - compressed
        const centerRightVine = this.add.rectangle(930, 190, 20, 180, 0x228B22);
        centerRightVine.setOrigin(0.5, 0.5);
        this.physics.add.existing(centerRightVine, true);
        this.vines.push(centerRightVine);
        
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
        // Player 1 (Solari - Light/Gold) - starts left (compressed position)
        this.player1 = this.add.rectangle(200, 400, 50, 50, 0xFFD700);
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
        
        // Player 2 (Umbrae - Shadow/Purple) - starts right (compressed position)
        this.player2 = this.add.rectangle(1080, 400, 50, 50, 0x8B00FF);
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
        
        // 1. Drum Rhythm Pads (Ground Level) - +1 influence/sec
        this.createDrumPads();
        
        // 2. Vine Pattern Wall (Middle Platform) - +2 influence/sec
        this.createVinePatternWall();
        
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
        this.jumpVelocity = -500;
        this.climbSpeed = 200; // Constant velocity for climbing
        
        // ===== LEVEL TIMER =====
        this.levelTime = 0;
        this.levelDuration = 300; // 5 minutes in seconds
        this.timeText = this.add.text(640, 70, '5:00', { fontSize: '24px', fill: '#ffffff' }).setOrigin(0.5, 0.5);
        
        // ===== INFLUENCE SYSTEM =====
        this.influenceRate = 0; // Net influence per second
    }

    createDrumPads() {
        // Create 4 rhythm pads at ground level
        const padPositions = [400, 500, 600, 700];
        this.drumPads = [];
        this.drumPadsSequence = [0, 1, 2, 3]; // Shared sequence for all pads
        this.drumPadsCurrentStep = 0; // Shared step counter
        
        padPositions.forEach((x, index) => {
            const pad = this.add.rectangle(x, 640, 60, 30, 0x666666);
            pad.setOrigin(0.5, 0.5);
            pad.padIndex = index;
            pad.activated = false;
            pad.owner = null;
            pad.glow = this.add.circle(x, 640, 30, 0xffffff, 0);
            this.drumPads.push(pad);
        });
        
        this.puzzleNodes.drumPads = this.drumPads;
    }

    createVinePatternWall() {
        // Create pattern wall on middle platform (compressed)
        const patternPositions = [
            {x: 540, y: 265}, {x: 600, y: 265}, {x: 660, y: 265}, {x: 720, y: 265},
            {x: 540, y: 295}, {x: 600, y: 295}, {x: 660, y: 295}, {x: 720, y: 295}
        ];
        
        this.vinePattern = [];
        this.vinePattern.correctOrder = [0, 1, 4, 5, 2, 3, 6, 7]; // Pattern to activate (vine indices)
        this.vinePattern.currentStep = 0;
        this.vinePattern.completed = false;
        this.vinePattern.lastActivationTime = 0; // Prevent rapid re-activation
        
        patternPositions.forEach((pos, index) => {
            const vine = this.add.circle(pos.x, pos.y, 20, 0x228B22);
            vine.setOrigin(0.5, 0.5);
            vine.patternIndex = index;
            vine.activated = false;
            vine.owner = null;
            this.vinePattern.push(vine);
        });
        
        this.puzzleNodes.vinePattern = this.vinePattern;
    }

    createWindTotemDial() {
        // Create Wind Totem (Minecraft Totem of Undying style) - compressed position
        // Main totem body - rectangular with face
        this.windTotem = this.add.rectangle(640, 85, 40, 50, 0x8B7355); // Brown/tan color
        this.windTotem.setOrigin(0.5, 0.5);
        this.windTotem.setStrokeStyle(2, 0x654321);
        
        // Totem face details
        const faceY = 80;
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
            this.endLevel();
            return;
        }
        
        // Update puzzle nodes
        this.updateDrumPads();
        this.updateVinePattern();
        this.updateWindTotem();
        
        // Update balance meter
        this.updateBalanceMeter();
        
        // Player movement
        this.updatePlayer1();
        this.updatePlayer2();
        
        // Check climbing
        this.checkClimbing(this.player1);
        this.checkClimbing(this.player2);
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
        
        // Check if we should latch onto vine (W pressed when near vine but not latched)
        if (wPressed && !this.player1.latchedToVine && this.player1.climbing && this.player1.onVine) {
            this.player1.latchedToVine = true;
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
            
            // Check for unlatch: Space to jump off, or S to drop down
            if (spacePressed) {
                // Jump off vine
                this.player1.latchedToVine = false;
                this.player1.climbing = false;
                this.player1.onVine = null;
                this.player1.body.setAllowGravity(true);
                this.player1.body.setGravityY(600);
                this.player1.body.setVelocityY(this.jumpVelocity);
                this.player1.wWasDown = false;
            } else if (sPressed) {
                // Drop down from vine (no jump)
                this.player1.latchedToVine = false;
                this.player1.climbing = false;
                this.player1.onVine = null;
                this.player1.body.setAllowGravity(true);
                this.player1.body.setGravityY(600);
                this.player1.wWasDown = false;
            } 
            // Climb up with W held (or pressed - allows continuous climbing)
            else if (wHeld || wPressed) {
                this.player1.body.setGravityY(0);
                this.player1.body.setAllowGravity(false);
                this.player1.body.setVelocityY(-this.climbSpeed);
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
        
        // Check if we should latch onto vine (Up Arrow pressed when near vine but not latched)
        if (upPressed && !this.player2.latchedToVine && this.player2.climbing && this.player2.onVine) {
            this.player2.latchedToVine = true;
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
            
            // Check for unlatch: ENTER to jump off, or Down Arrow to drop down
            if (enterPressed) {
                // Jump off vine
                this.player2.latchedToVine = false;
                this.player2.climbing = false;
                this.player2.onVine = null;
                this.player2.body.setAllowGravity(true);
                this.player2.body.setGravityY(600);
                this.player2.body.setVelocityY(this.jumpVelocity);
                this.player2.upWasDown = false;
            } else if (downPressed) {
                // Drop down from vine (no jump)
                this.player2.latchedToVine = false;
                this.player2.climbing = false;
                this.player2.onVine = null;
                this.player2.body.setAllowGravity(true);
                this.player2.body.setGravityY(600);
                this.player2.upWasDown = false;
            } 
            // Climb up with Up Arrow held (or pressed - allows continuous climbing)
            else if (upHeld || upPressed) {
                this.player2.body.setGravityY(0);
                this.player2.body.setAllowGravity(false);
                this.player2.body.setVelocityY(-this.climbSpeed);
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

    updateDrumPads() {
        // Shared rhythm pattern for all pads
        if (!this.drumPadsSharedTimer) this.drumPadsSharedTimer = 0;
        this.drumPadsSharedTimer += 1/60;
        
        // Check if all pads are activated
        let activePads = 0;
        let ownerFaction = null;
        
        this.drumPads.forEach((pad, index) => {
            // Check if player is on pad
            const p1OnPad = Phaser.Math.Distance.Between(this.player1.x, this.player1.y, pad.x, pad.y) < 50;
            const p2OnPad = Phaser.Math.Distance.Between(this.player2.x, this.player2.y, pad.x, pad.y) < 50;
            
            // Glow effect for rhythm (all pads sync)
            const beatPhase = Math.sin(this.drumPadsSharedTimer * 4);
            const expectedPadIndex = this.drumPadsSequence[this.drumPadsCurrentStep];
            
            // Highlight the expected pad
            if (pad.padIndex === expectedPadIndex) {
                if (beatPhase > 0.7) {
                    pad.glow.setAlpha(0.8);
                    pad.glow.setFillStyle(0xffff00);
                } else {
                    pad.glow.setAlpha(0.3);
                    pad.glow.setFillStyle(0xffffff);
                }
            } else {
                pad.glow.setAlpha(0.1);
            }
            
            // Check activation - step on pad when it glows and it's the correct one
            if ((p1OnPad || p2OnPad) && beatPhase > 0.7 && pad.padIndex === expectedPadIndex) {
                const player = p1OnPad ? this.player1 : this.player2;
                
                // Correct pad in sequence!
                pad.activated = true;
                pad.owner = player.faction;
                pad.setFillStyle(player.faction === 'Solari' ? 0xFFD700 : 0x8B00FF);
                pad.glow.setFillStyle(player.faction === 'Solari' ? 0xFFD700 : 0x8B00FF);
                pad.glow.setAlpha(0.9);
                
                this.drumPadsCurrentStep++;
                
                if (this.drumPadsCurrentStep >= this.drumPadsSequence.length) {
                    // All pads completed in sequence!
                    ownerFaction = player.faction;
                    // Reset sequence after completion
                    this.time.delayedCall(3000, () => {
                        this.drumPads.forEach(p => {
                            p.activated = false;
                            p.setFillStyle(0x666666);
                        });
                        this.drumPadsCurrentStep = 0;
                    });
                }
            } else if ((p1OnPad || p2OnPad) && pad.padIndex !== expectedPadIndex) {
                // Wrong pad - reset sequence
                this.drumPads.forEach(p => {
                    p.activated = false;
                    p.setFillStyle(0x666666);
                });
                this.drumPadsCurrentStep = 0;
            }
            
            // Count activated pads
            if (pad.activated) {
                activePads++;
                if (!ownerFaction) ownerFaction = pad.owner;
            }
        });
        
        // Set influence if all pads are activated by same faction
        if (activePads === this.drumPads.length && ownerFaction) {
            this.puzzleInfluence.drumPads = ownerFaction === 'Solari' ? 1 : -1;
        } else {
            // Reset if not all pads are activated
            this.puzzleInfluence.drumPads = 0;
        }
    }

    updateVinePattern() {
        const pattern = this.vinePattern;
        
        // Prevent rapid re-activation (cooldown)
        const currentTime = this.time.now;
        const cooldown = 200; // 200ms cooldown between activations
        
        // Check if player is stepping on vines
        pattern.forEach(vine => {
            const p1Near = Phaser.Math.Distance.Between(this.player1.x, this.player1.y, vine.x, vine.y) < 35;
            const p2Near = Phaser.Math.Distance.Between(this.player2.x, this.player2.y, vine.x, vine.y) < 35;
            
            if ((p1Near || p2Near) && currentTime - pattern.lastActivationTime > cooldown) {
                const player = p1Near ? this.player1 : this.player2;
                const expectedIndex = pattern.correctOrder[pattern.currentStep];
                
                // Check if this is the correct vine in sequence and not already activated
                if (vine.patternIndex === expectedIndex && !vine.activated) {
                    vine.activated = true;
                    vine.owner = player.faction;
                    vine.setFillStyle(player.faction === 'Solari' ? 0xFFD700 : 0x8B00FF);
                    pattern.currentStep++;
                    pattern.lastActivationTime = currentTime;
                    
                    // Visual feedback - create sparkle effect
                    const sparkle = this.add.circle(vine.x, vine.y, 5, player.faction === 'Solari' ? 0xFFD700 : 0x8B00FF);
                    sparkle.setAlpha(0.8);
                    this.tweens.add({
                        targets: sparkle,
                        scaleX: 2,
                        scaleY: 2,
                        alpha: 0,
                        duration: 300,
                        onComplete: () => sparkle.destroy()
                    });
                    
                    if (pattern.currentStep >= pattern.correctOrder.length) {
                        // Pattern completed!
                        pattern.completed = true;
                        pattern.owner = player.faction;
                        this.puzzleInfluence.vinePattern = player.faction === 'Solari' ? 2 : -2;
                        // Reset after a delay
                        if (this.vinePatternResetTimer) {
                            this.vinePatternResetTimer.destroy();
                        }
                        this.vinePatternResetTimer = this.time.delayedCall(5000, () => {
                            pattern.forEach(v => {
                                v.activated = false;
                                v.setFillStyle(0x228B22);
                            });
                            pattern.currentStep = 0;
                            pattern.completed = false;
                            this.puzzleInfluence.vinePattern = 0;
                        });
                    }
                } else if (vine.patternIndex !== expectedIndex && !vine.activated && pattern.currentStep > 0) {
                    // Wrong vine in sequence - reset only if we've started the pattern
                    // But don't reset if player is just standing on a vine
                    // Only reset if they step on a wrong vine while pattern is in progress
                    const timeSinceLastActivation = currentTime - pattern.lastActivationTime;
                    if (timeSinceLastActivation < 1000) { // Only reset if recent activation
                        pattern.forEach(v => {
                            v.activated = false;
                            v.setFillStyle(0x228B22);
                        });
                        pattern.currentStep = 0;
                        pattern.completed = false;
                        this.puzzleInfluence.vinePattern = 0;
                        pattern.lastActivationTime = currentTime;
                    }
                }
            }
        });
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

    updateBalanceMeter() {
        // Calculate influence per second from all puzzles
        let solariInfluencePerSec = 0;
        let umbraeInfluencePerSec = 0;
        
        // Wind Totem influence
        if (this.puzzleInfluence.windTotemSolari) {
            solariInfluencePerSec += this.puzzleInfluence.windTotemSolari;
        }
        if (this.puzzleInfluence.windTotemUmbrae) {
            umbraeInfluencePerSec += this.puzzleInfluence.windTotemUmbrae;
        }
        
        // Drum Pads influence (if implemented)
        if (this.puzzleInfluence.drumPads) {
            if (this.puzzleInfluence.drumPads > 0) {
                solariInfluencePerSec += this.puzzleInfluence.drumPads;
            } else {
                umbraeInfluencePerSec += Math.abs(this.puzzleInfluence.drumPads);
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
