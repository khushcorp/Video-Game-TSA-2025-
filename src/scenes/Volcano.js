// Volcano Level - Redesigned with calculated platform spacing
export class Volcano extends Phaser.Scene {
    constructor() { super('Volcano'); }
    preload() {
        // Load volcano background image
        this.load.image('volcano', 'assets/volcano.webp');
    }

    create() {
        // ===== LEVEL SETUP =====
        this.cameras.main.setZoom(0.7);
        this.cameras.main.setBounds(0, 0, 1828, 1028);
        
        // Set physics world bounds
        this.physics.world.setBounds(0, 0, 1828, 1028);
        
        // ===== BACKGROUND =====
        // Fill the full canvas with the volcano image (no bars), adapting on resize
        const layoutBackground = () => {
            const width = this.scale.width;
            const height = this.scale.height;

            if (!this.volcanoBg) {
                this.volcanoBg = this.add.image(0, 0, 'volcano').setOrigin(0, 0);
                this.volcanoBg.setDepth(-1000);
                this.volcanoBg.setScrollFactor(0);
            }

            const bgWidth = this.volcanoBg.width;
            const bgHeight = this.volcanoBg.height;
            const scale = Math.max(width / bgWidth, height / bgHeight);

            this.volcanoBg.setScale(scale);
            this.volcanoBg.setPosition(0, 0);
        };

        layoutBackground();

        // Relayout on resize so it always covers the screen
        this.scale.on('resize', () => layoutBackground());

        // Keep background pixels crisp
        if (this.volcanoBg && this.volcanoBg.texture) {
            this.volcanoBg.texture.setFilter(Phaser.Textures.FilterMode.NEAREST);
            const src = this.volcanoBg.texture.source?.[0]?.image;
            if (src) {
                src.style.imageRendering = 'pixelated';
            }
        }
        
        // Lava glow effects
        for (let i = 0; i < 5; i++) {
            const glow = this.add.circle(200 + i * 350, 950, 50 + Math.random() * 30, 0xFF4500, 0.3);
            this.tweens.add({
                targets: glow,
                alpha: { from: 0.3, to: 0.6 },
                duration: 1000 + Math.random() * 1000,
                yoyo: true,
                repeat: -1
            });
        }
        
        // ===== INFLUENCE BARS UI =====
        this.player1Influence = 0;
        this.player2Influence = 0;
        
        // HARDCODED: Timers to track when players used orb (for soft landing)
        this.player1OrbBoostTimer = 0;
        this.player2OrbBoostTimer = 0;
        this.ORB_BOOST_PROTECTION_TIME = 2.0; // 2 seconds of protection after orb boost
        this.maxInfluence = 500;
        
        // Player 1 (Solari) influence bar - match Level 1 layout
        this.player1BarBg = this.add.rectangle(320, 30, 400, 30, 0x333333);
        this.player1BarBg.setOrigin(0.5, 0.5);
        this.player1BarFill = this.add.rectangle(120, 30, 0, 25, 0xFFD700); // Gold
        this.player1BarFill.setOrigin(0, 0.5);
        this.player1InfluenceText = this.add.text(320, 55, '0/500', { fontSize: '14px', fill: '#ffffff' }).setOrigin(0.5, 0.5);
        this.player1NameText = this.add.text(320, 75, 'SOLARI', { fontSize: '18px', fill: '#FFD700', fontStyle: 'bold' }).setOrigin(0.5, 0.5);
        
        // Player 2 (Umbrae) influence bar - centered between timer and right edge
        // Timer is at x=914, right edge is at x=1828
        // Center point = timerX + (edgeX - timerX) / 2 = 914 + (1828 - 914) / 2 = 914 + 457 = 1371
        const timerX = 914;
        const rightEdgeX = 1828;
        const umbraeBarX = timerX + (rightEdgeX - timerX) / 2; // 1371
        const umbraeBarWidth = 400;
        const umbraeBarLeftX = umbraeBarX - (umbraeBarWidth / 2); // 1371 - 200 = 1171
        
        this.player2BarBg = this.add.rectangle(umbraeBarX, 30, umbraeBarWidth, 30, 0x333333);
        this.player2BarBg.setOrigin(0.5, 0.5);
        this.player2BarFill = this.add.rectangle(umbraeBarLeftX, 30, 0, 25, 0x8B00FF); // Purple
        this.player2BarFill.setOrigin(0, 0.5);
        this.player2InfluenceText = this.add.text(umbraeBarX, 55, '0/500', { fontSize: '14px', fill: '#ffffff' }).setOrigin(0.5, 0.5);
        this.player2NameText = this.add.text(umbraeBarX, 75, 'UMBRAE', { fontSize: '18px', fill: '#8B00FF', fontStyle: 'bold' }).setOrigin(0.5, 0.5);
        
        // ===== MOVEMENT SETTINGS =====
        this.playerSpeed = 286;
        this.jumpVelocity = -550; // Match Level 1 jump power
        
        // HARDCODED: Store original values for debuff system
        this.basePlayerSpeed = 286;
        this.baseJumpVelocity = -550;
        
        // ===== RISING LAVA MECHANIC =====
        // First event: Warning at 4:40 (20s), Lava at 4:30 (30s)
        // Second event: Warning at 1:40 (160s), Lava at 1:30 (170s)
        this.lavaRiseStartTime1 = 20; // First warning at 4:40 (20 seconds in)
        this.lavaRiseActualStart1 = 30; // First lava at 4:30 (30 seconds in)
        this.lavaRiseStartTime2 = 160; // Second warning at 1:40 (160 seconds in)
        this.lavaRiseActualStart2 = 170; // Second lava at 1:30 (170 seconds in)
        this.lavaRiseWarningDuration = 10; // 10 second warning countdown
        this.lavaRiseDuration = 80; // HARDCODED: Lava rises for 80 seconds (4x slower - 75% reduction in speed)
        this.lavaRiseTimer = 0;
        this.lavaRising = false;
        this.lavaWarningActive = false;
        this.lavaMessageText = null; // Message text for lava events
        this.lavaSurvivalChecked = false; // Track if survival check has been done
        this.lavaEndTime = 0; // Track when lava ended (for ground correction skip)
        this.lavaEventNumber = 0; // Track which lava event (1 or 2)
        
        // HARDCODED: Lava will be created at the END of create() function to ensure it's on top
        // Initialize lava variables here but create the visual at the end
        this.lavaStartY = 914; // Ground top
        this.lavaTopY = 0; // Lava reaches top of screen
        this.lavaCurrentY = 914;
        this.lava = null;
        this.lavaGlow = null;
        this.lavaParticles = [];
        
        // Lava warning timer text
        this.lavaWarningText = this.add.text(914, 100, '', {
            fontSize: '48px',
            fill: '#FF4500',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 4
        }).setOrigin(0.5, 0.5).setDepth(100).setVisible(false);
        
        // Player debuff flags (for lava damage)
        this.player1LavaDebuff = false;
        this.player2LavaDebuff = false;
        this.gravity = 600;
        
        // Set physics world gravity
        this.physics.world.gravity.y = this.gravity;
        
        // Recalculate jump physics with new jump velocity
        // Max jump height: v^2 = u^2 + 2as => s = u^2 / (2a) = 550^2 / (2*600) = 252 pixels
        // Time to peak: t = u/a = 550/600 = 0.92 seconds
        // Total jump time: 1.84 seconds
        // Max horizontal distance: speed * time = 286 * 1.84 = 526 pixels
        this.maxJumpHeight = 252;
        this.maxJumpDistance = 526;
        
        // ===== LAVA JUMP ORBS =====
        this.lavaOrbs = [];
        // Orb positions - strategically placed for parkour (floating in air, not on ground)
        const orbPositions = [
            { x: 500, y: 800 },   // Near left start platform
            { x: 1328, y: 800 },  // Near right start platform
            { x: 750, y: 650 },   // Mid-level left
            { x: 1078, y: 650 },  // Mid-level right
            { x: 650, y: 490 },   // Upper left
            { x: 1178, y: 490 },  // Upper right
            { x: 850, y: 350 },   // High left
            { x: 978, y: 350 },   // High right
        ];
        
        orbPositions.forEach((pos, index) => {
            // Outer glow ring - larger, softer
            const orbGlow = this.add.circle(pos.x, pos.y, 30, 0xFF6347, 0.3);
            orbGlow.setDepth(5);
            
            // Main orb body - glowing lava sphere
            const orbBody = this.add.circle(pos.x, pos.y, 20, 0xFF4500, 0.9);
            orbBody.setDepth(6);
            
            // Inner hot core - bright center
            const orbCore = this.add.circle(pos.x, pos.y, 10, 0xFFD700, 1.0);
            orbCore.setDepth(7);
            
            // Floating animation - gentle up and down movement
            const floatTween = this.tweens.add({
                targets: [orbGlow, orbBody, orbCore],
                y: { from: pos.y - 5, to: pos.y + 5 },
                duration: 1500 + Math.random() * 500,
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut'
            });
            
            // Subtle rotation/pulse effect
            const pulseTween = this.tweens.add({
                targets: [orbGlow, orbBody],
                scale: { from: 0.95, to: 1.05 },
                alpha: { from: 0.7, to: 1.0 },
                duration: 1000 + Math.random() * 300,
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut'
            });
            
            // Charge timer text - shows remaining charge time
            const chargeTimerText = this.add.text(pos.x, pos.y - 40, '', {
                fontSize: '16px',
                fill: '#ffffff',
                fontStyle: 'bold',
                stroke: '#000000',
                strokeThickness: 3
            }).setOrigin(0.5, 0.5).setDepth(11).setVisible(false);
            
            // Orb state
            const orb = {
                x: pos.x,
                y: pos.y,
                glow: orbGlow,
                body: orbBody,
                core: orbCore,
                chargeTimerText: chargeTimerText, // Store timer text reference
                floatTween: floatTween, // Store tween reference for editor
                pulseTween: pulseTween, // Store tween reference
                isCharged: true, // Start charged
                isOnCooldown: false,
                chargeTimer: 0,
                chargeTime: 5.0, // Takes 5 seconds to charge
                cooldownTimer: 0,
                cooldownTime: 0.5, // 0.5 second cooldown after use
                boostPower: -750, // Strong upward boost
                radius: 25,
                originalColors: {
                    glow: 0xFF6347,
                    body: 0xFF4500,
                    core: 0xFFD700
                }
            };
            
            this.lavaOrbs.push(orb);
        });
        
        // ===== PLATFORMS =====
        this.platforms = [];
        this.fallingPlatforms = [];
        
        // Ground platform at bottom of screen - HARDCODED VALUES
        // World height: 1028, ground height: 114
        // HARDCODED: Ground center Y = 971, Ground top Y = 914
        const HARDCODED_GROUND_CENTER_X = 914;
        const HARDCODED_GROUND_CENTER_Y = 971;
        const HARDCODED_GROUND_TOP = 914;
        const HARDCODED_GROUND_HEIGHT = 114;
        const HARDCODED_GROUND_WIDTH = 1828;
        
        const ground = this.add.rectangle(HARDCODED_GROUND_CENTER_X, HARDCODED_GROUND_CENTER_Y, HARDCODED_GROUND_WIDTH, HARDCODED_GROUND_HEIGHT, 0x4a1a0a);
        ground.setOrigin(0.5, 0.5);
        ground.setDepth(1);
        ground.setStrokeStyle(2, 0x8B4513);
        // The 'true' parameter makes it static - static bodies are automatically immovable
        this.physics.add.existing(ground, true);
        this.platforms.push(ground);
        
        // Store hardcoded ground top for player positioning
        this.groundTop = HARDCODED_GROUND_TOP;
        this.HARDCODED_GROUND_TOP = HARDCODED_GROUND_TOP;
        this.HARDCODED_PLAYER_HALF_HEIGHT = 35.5;
        
        // HARDCODED: Create lava at the END after everything else, but HIDE it initially
        // Lava should only be visible when it starts rising (after 30 seconds)
        this.time.delayedCall(100, () => {
            // HARDCODED: Create lava with ABSOLUTE MAXIMUM visibility settings
            const lavaStartY = 914; // Ground top - HARDCODED
            this.lavaStartY = lavaStartY;
            this.lavaCurrentY = lavaStartY;
            
            // Main lava body - HARDCODED: Fill from bottom like water
            // Start with 0 height, grow upward from ground level
            this.lava = this.add.rectangle(914, lavaStartY, 1828, 0, 0xFF4500); // Start with 0 height
            this.lava.setOrigin(0.5, 1.0); // HARDCODED: Origin at bottom center so it grows upward
            this.lava.setDepth(999); // HARDCODED: MAXIMUM DEPTH - above everything
            this.lava.setAlpha(1.0); // Full opacity
            this.lava.setVisible(false); // HARDCODED: HIDE initially - only show when rising starts
            this.lava.y = lavaStartY; // Keep at ground level, will grow upward
            
            // Lava glow - positioned at top of lava (will update as lava rises)
            this.lavaGlow = this.add.rectangle(914, lavaStartY, 1828, 50, 0xFF6347);
            this.lavaGlow.setOrigin(0.5, 0.5);
            this.lavaGlow.setDepth(1000); // Even higher
            this.lavaGlow.setAlpha(1.0); // Full opacity
            this.lavaGlow.setVisible(false); // HARDCODED: HIDE initially
            
            // Lava particles
            this.lavaParticles = [];
            for (let i = 0; i < 20; i++) {
                const particle = this.add.circle(
                    100 + (i * 80), 
                    lavaStartY - 100, 
                    10, // HARDCODED: Big particles
                    0xFFD700, 
                    1.0
                );
                particle.setDepth(1001);
                particle.setVisible(false); // HARDCODED: HIDE initially
                this.lavaParticles.push(particle);
            }
            
            console.log('=== HARDCODED LAVA CREATED (HIDDEN) ===');
            console.log('Lava Y:', this.lava.y, 'Visible:', this.lava.visible, 'Depth:', this.lava.depth);
            console.log('Lava exists:', !!this.lava);
        });
        
        // Platform layout - all moved down by 341 pixels (old ground top 573, new ground top 914)
        // Added more platforms for grander parkour
        const platformData = [
            // Starting platforms near ground (easy access)
            { x: 400, y: 820, w: 200, h: 30, falling: false },      // Left start
            { x: 1428, y: 820, w: 200, h: 30, falling: false },     // Right start
            
            // First tier (easy-medium jumps from ground)
            { x: 600, y: 790, w: 180, h: 30, falling: false },      // Left tier 1
            { x: 1228, y: 790, w: 180, h: 30, falling: false },     // Right tier 1
            { x: 914, y: 750, w: 220, h: 30, falling: false },      // Center tier 1
            
            // Second tier (medium difficulty)
            { x: 500, y: 690, w: 160, h: 30, falling: false },      // Left tier 2
            { x: 1328, y: 690, w: 160, h: 30, falling: false },      // Right tier 2
            { x: 800, y: 650, w: 140, h: 30, falling: true },        // Left center tier 2 - FALLING
            { x: 1028, y: 650, w: 140, h: 30, falling: true },      // Right center tier 2 - FALLING
            
            // Third tier (harder jumps)
            { x: 700, y: 590, w: 150, h: 30, falling: false },      // Left tier 3
            { x: 1128, y: 590, w: 150, h: 30, falling: false },     // Right tier 3
            { x: 914, y: 550, w: 180, h: 30, falling: false },      // Center tier 3
            
            // Fourth tier (very challenging)
            { x: 450, y: 490, w: 130, h: 30, falling: true },       // Left tier 4 - FALLING
            { x: 1378, y: 490, w: 130, h: 30, falling: true },       // Right tier 4 - FALLING
            { x: 750, y: 450, w: 120, h: 30, falling: false },      // Left center tier 4
            { x: 1078, y: 450, w: 120, h: 30, falling: false },     // Right center tier 4
            
            // Fifth tier (expert level)
            { x: 600, y: 390, w: 110, h: 30, falling: false },       // Left tier 5
            { x: 1228, y: 390, w: 110, h: 30, falling: false },     // Right tier 5
            { x: 914, y: 350, w: 160, h: 30, falling: true },        // Center tier 5 - FALLING
            
            // Sixth tier (master level)
            { x: 500, y: 290, w: 100, h: 30, falling: false },       // Left tier 6
            { x: 1328, y: 290, w: 100, h: 30, falling: false },     // Right tier 6
            { x: 850, y: 250, w: 90, h: 30, falling: true },        // Left center tier 6 - FALLING
            { x: 978, y: 250, w: 90, h: 30, falling: true },         // Right center tier 6 - FALLING
            
            // Top tier (legendary)
            { x: 914, y: 150, w: 200, h: 30, falling: false },       // Top center - ultimate challenge
        ];
        
        platformData.forEach((data) => {
            const platform = this.add.rectangle(data.x, data.y, data.w, data.h, data.falling ? 0xFF6347 : 0x8B4513);
            platform.setOrigin(0.5, 0.5);
            if (data.falling) {
                platform.setStrokeStyle(2, 0xFF4500);
            }
            this.physics.add.existing(platform, true);
            this.platforms.push(platform);
            
            if (data.falling) {
                platform.isFalling = false;
                platform.fallTimer = 0;
                platform.originalY = data.y;
                platform.playersOnPlatform = new Set();
                platform.colliders = [];
                this.fallingPlatforms.push(platform);
            }
        });
        
        // ===== PLAYERS =====
        // HARDCODED VALUES - Ground top is 914, player half height is 35.5
        // Player spawn Y = 914 - 35.5 = 878.5 (HARDCODED)
        const HARDCODED_PLAYER_SPAWN_Y = this.HARDCODED_GROUND_TOP - this.HARDCODED_PLAYER_HALF_HEIGHT; // 878.5
        
        // Create players at exact ground position
        this.player1 = this.add.rectangle(400, HARDCODED_PLAYER_SPAWN_Y, 71, 71, 0xFFD700);
        this.player1.setOrigin(0.5, 0.5);
        this.physics.add.existing(this.player1);
        this.player1.body.setCollideWorldBounds(true);
        this.player1.body.setSize(71, 71);
        this.player1.body.setGravityY(this.gravity);
        this.player1.setDepth(20);
        this.player1.faction = 'Solari';
        // Force position immediately
        this.player1.y = HARDCODED_PLAYER_SPAWN_Y;
        
        this.player2 = this.add.rectangle(1428, HARDCODED_PLAYER_SPAWN_Y, 71, 71, 0x8B00FF);
        this.player2.setOrigin(0.5, 0.5);
        this.physics.add.existing(this.player2);
        this.player2.body.setCollideWorldBounds(true);
        this.player2.body.setSize(71, 71);
        this.player2.body.setGravityY(this.gravity);
        this.player2.setDepth(20);
        this.player2.faction = 'Umbrae';
        // Force position immediately
        this.player2.y = HARDCODED_PLAYER_SPAWN_Y;
        
        // Store hardcoded spawn Y for update loop
        this.HARDCODED_PLAYER_SPAWN_Y = HARDCODED_PLAYER_SPAWN_Y;
        
        // Collisions - store colliders for falling platforms so we can remove them
        this.platforms.forEach(platform => {
            const collider1 = this.physics.add.collider(this.player1, platform);
            const collider2 = this.physics.add.collider(this.player2, platform);
            if (platform.colliders) {
                platform.colliders.push(collider1, collider2);
            }
        });
        
        // HARDCODE: Force players to be exactly on ground immediately and repeatedly
        this.time.delayedCall(0, () => {
            this.player1.y = this.HARDCODED_PLAYER_SPAWN_Y;
            this.player2.y = this.HARDCODED_PLAYER_SPAWN_Y;
        });
        this.time.delayedCall(10, () => {
            this.player1.y = this.HARDCODED_PLAYER_SPAWN_Y;
            this.player2.y = this.HARDCODED_PLAYER_SPAWN_Y;
        });
        this.time.delayedCall(50, () => {
            this.player1.y = this.HARDCODED_PLAYER_SPAWN_Y;
            this.player2.y = this.HARDCODED_PLAYER_SPAWN_Y;
            this.player1.body.setVelocityY(0);
            this.player2.body.setVelocityY(0);
        });
        this.time.delayedCall(100, () => {
            this.player1.y = this.HARDCODED_PLAYER_SPAWN_Y;
            this.player2.y = this.HARDCODED_PLAYER_SPAWN_Y;
            this.player1.body.setVelocityY(0);
            this.player2.body.setVelocityY(0);
        });
        
        // ===== INPUT =====
        this.cursorsWASD = this.input.keyboard.addKeys('W,S,A,D');
        this.wKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        this.cursorsArrows = this.input.keyboard.createCursorKeys();
        this.upKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
        
        // ===== LEVEL EDITOR =====
        this.editorMode = false;
        this.selectedObject = null;
        this.dragging = false;
        this.editorKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);
        this.deleteKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.X); // Changed to X key
        this.saveKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        this.loadKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.L);
        this.addPlatformKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.P);
        this.addOrbKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.O);
        this.toggleFallingKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F); // F key to toggle falling
        this.deleteAllKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.C); // C key to clear all
        
        // Platform resize keys
        this.increaseWidthKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.PLUS);
        this.decreaseWidthKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.MINUS);
        this.increaseHeightKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.EQUALS);
        this.decreaseHeightKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UNDERSCORE);
        
        // Alternative resize keys (number pad and regular keys)
        this.input.keyboard.on('keydown', (event) => {
            if (this.editorMode && this.selectedObject && this.selectedObject.type === 'platform') {
                // Width controls: Q/E or Left/Right arrows
                if (event.key === 'q' || event.key === 'Q') {
                    this.resizePlatform('width', -10);
                } else if (event.key === 'e' || event.key === 'E') {
                    if (!this.editorKey.isDown) { // Only if not toggling editor
                        this.resizePlatform('width', 10);
                    }
                }
                // Height controls: W/S or Up/Down arrows
                else if (event.key === 'w' || event.key === 'W') {
                    if (!this.wKey.isDown) { // Only if not jumping
                        this.resizePlatform('height', 10);
                    }
                } else if (event.key === 's' || event.key === 'S') {
                    if (!this.saveKey.isDown) { // Only if not saving
                        this.resizePlatform('height', -10);
                    }
                }
            }
        });
        
        // Editor UI elements
        this.editorUI = null;
        this.selectedIndicator = null;
        
        // Pointer for dragging
        this.input.on('pointerdown', (pointer) => {
            if (this.editorMode) {
                this.handleEditorClick(pointer);
            }
        });
        
        this.input.on('pointermove', (pointer) => {
            if (this.editorMode && this.dragging && this.selectedObject) {
                const worldX = pointer.worldX;
                const worldY = pointer.worldY;
                
                if (this.selectedObject.type === 'platform') {
                    this.selectedObject.obj.x = worldX;
                    this.selectedObject.obj.y = worldY;
                    if (this.selectedIndicator) {
                        this.selectedIndicator.x = worldX;
                        this.selectedIndicator.y = worldY;
                    }
                } else if (this.selectedObject.type === 'orb') {
                    const orb = this.selectedObject.orb;
                    
                    // Stop the floating animation while dragging - destroy and recreate later
                    if (orb.floatTween) {
                        orb.floatTween.stop();
                        orb.floatTween.destroy();
                        orb.floatTween = null;
                    }
                    
                    // Update orb position
                    orb.x = worldX;
                    orb.y = worldY;
                    orb.glow.x = worldX;
                    orb.glow.y = worldY;
                    orb.body.x = worldX;
                    orb.body.y = worldY;
                    orb.core.x = worldX;
                    orb.core.y = worldY;
                    
                    // Update disabled indicator and timer text position if they exist
                    if (orb.disabledIndicator) {
                        orb.disabledIndicator.x = worldX;
                        orb.disabledIndicator.y = worldY;
                    }
                    if (orb.chargeTimerText) {
                        orb.chargeTimerText.x = worldX;
                        orb.chargeTimerText.y = worldY - 40;
                    }
                    
                    if (this.selectedIndicator) {
                        this.selectedIndicator.x = worldX;
                        this.selectedIndicator.y = worldY;
                    }
                }
            }
        });
        
        this.input.on('pointerup', () => {
            // Resume floating animation for orbs when dragging stops
            if (this.dragging && this.selectedObject && this.selectedObject.type === 'orb') {
                const orb = this.selectedObject.orb;
                // Recreate the floating tween from the new position
                if (!orb.floatTween) {
                    orb.floatTween = this.tweens.add({
                        targets: [orb.glow, orb.body, orb.core],
                        y: { from: orb.y - 5, to: orb.y + 5 },
                        duration: 1500 + Math.random() * 500,
                        yoyo: true,
                        repeat: -1,
                        ease: 'Sine.easeInOut'
                    });
                }
            }
            this.dragging = false;
        });
        
        // ===== LEVEL TIMER =====
        this.levelTime = 0;
        this.levelDuration = 300;
        // Timer positioned at center x (914) and very high y value
        this.timeText = this.add.text(914, 50, '5:00', { fontSize: '24px', fill: '#ffffff' }).setOrigin(0.5, 0.5);
        
        // ===== INFLUENCE SYSTEM =====
        this.influenceRate = 0;
    }

    update(time, delta) {
        const dt = delta / 1000;
        
        // HARDCODED: Ensure editor-created platforms always have collisions working
        // This runs every frame to guarantee collisions never break
        if (this.platforms && this.platforms.length > 0) {
            this.platforms.forEach(platform => {
                if (platform && platform.isEditorCreated && platform.body) {
                    // Force body to be enabled (NEVER canCollide=false)
                    if (!platform.body.enable) {
                        platform.body.enable = true;
                        platform.body.setActive(true);
                    }
                    
                    // Ensure colliders exist and are active
                    if (!platform.colliders || platform.colliders.length === 0) {
                        const c1 = this.physics.add.collider(this.player1, platform);
                        const c2 = this.physics.add.collider(this.player2, platform);
                        if (c1) c1.active = true;
                        if (c2) c2.active = true;
                        platform.colliders = [c1, c2];
                    } else {
                        // Force all colliders to be active
                        platform.colliders.forEach(c => {
                            if (c) {
                                c.active = true;
                                if (c.enabled !== undefined) c.enabled = true;
                            }
                        });
                    }
                }
            });
        }
        
        // Handle editor mode toggle
        if (Phaser.Input.Keyboard.JustDown(this.editorKey)) {
            this.toggleEditorMode();
        }
        
        // Editor mode controls
        if (this.editorMode) {
            if (Phaser.Input.Keyboard.JustDown(this.deleteKey) && this.selectedObject) {
                this.deleteSelectedObject();
            }
            if (Phaser.Input.Keyboard.JustDown(this.saveKey)) {
                this.saveLevelLayout();
            }
            if (Phaser.Input.Keyboard.JustDown(this.loadKey)) {
                this.loadLevelLayout();
            }
            if (Phaser.Input.Keyboard.JustDown(this.addPlatformKey)) {
                this.addNewPlatform();
            }
            if (Phaser.Input.Keyboard.JustDown(this.addOrbKey)) {
                this.addNewOrb();
            }
            
            // Platform resize controls (using arrow keys for better compatibility)
            if (this.selectedObject && this.selectedObject.type === 'platform') {
                if (this.cursorsArrows.left.isDown) {
                    this.resizePlatform('width', -5);
                }
                if (this.cursorsArrows.right.isDown) {
                    this.resizePlatform('width', 5);
                }
                if (this.cursorsArrows.up.isDown) {
                    this.resizePlatform('height', -5);
                }
                if (this.cursorsArrows.down.isDown) {
                    this.resizePlatform('height', 5);
                }
            }
            
            // Toggle falling platform
            if (Phaser.Input.Keyboard.JustDown(this.toggleFallingKey) && this.selectedObject && this.selectedObject.type === 'platform') {
                this.toggleFallingPlatform();
            }
            
            // Delete all objects
            if (Phaser.Input.Keyboard.JustDown(this.deleteAllKey)) {
                this.deleteAllObjects();
            }
            
            // In editor mode, allow basic player movement for testing collisions
            // But skip game logic like influence, timers, etc.
            this.updatePlayer(this.player1, { up: this.wKey, left: this.cursorsWASD.A, right: this.cursorsWASD.D });
            this.updatePlayer(this.player2, { up: this.upKey, left: this.cursorsArrows.left, right: this.cursorsArrows.right });
            
            // Update orbs in editor mode so they work for testing
            this.updateLavaOrbs(dt);
            
            return; // Skip rest of game logic in editor mode
        }
        
        // HARDCODED: Update orb boost timers
        if (this.player1OrbBoostTimer > 0) {
            this.player1OrbBoostTimer -= dt;
            if (this.player1OrbBoostTimer < 0) this.player1OrbBoostTimer = 0;
        }
        if (this.player2OrbBoostTimer > 0) {
            this.player2OrbBoostTimer -= dt;
            if (this.player2OrbBoostTimer < 0) this.player2OrbBoostTimer = 0;
        }
        
        // HARDCODED: Skip ground correction for 0.5 seconds after lava ends to prevent teleporting into ground
        const timeSinceLavaEnd = this.lavaEndTime > 0 ? this.levelTime - this.lavaEndTime : 999;
        const skipGroundCorrection = this.lavaSurvivalChecked && timeSinceLavaEnd < 0.5;
        
        // Only force players to ground position if they're actually on the ground platform
        // Check if player is near ground level (within 50 pixels of ground top)
        if (!skipGroundCorrection) {
            const groundTop = this.HARDCODED_GROUND_TOP;
            const playerBottom1 = this.player1.y + this.HARDCODED_PLAYER_HALF_HEIGHT;
            const playerBottom2 = this.player2.y + this.HARDCODED_PLAYER_HALF_HEIGHT;
            const isOnGround1 = this.player1.body.touching.down && Math.abs(playerBottom1 - groundTop) < 50;
            const isOnGround2 = this.player2.body.touching.down && Math.abs(playerBottom2 - groundTop) < 50;
            
            // HARDCODED: Only correct position if player is actually on the ground AND not falling
            // This prevents forcing player into ground when falling from high heights
            if (isOnGround1 && Math.abs(this.player1.body.velocity.y) < 10 && this.player1OrbBoostTimer === 0) {
                const expectedY = groundTop - this.HARDCODED_PLAYER_HALF_HEIGHT;
                // Only correct if player is very close to expected position (within 2 pixels)
                if (Math.abs(this.player1.y - expectedY) <= 2) {
                    this.player1.y = expectedY;
                }
            }
            if (isOnGround2 && Math.abs(this.player2.body.velocity.y) < 10 && this.player2OrbBoostTimer === 0) {
                const expectedY = groundTop - this.HARDCODED_PLAYER_HALF_HEIGHT;
                // Only correct if player is very close to expected position (within 2 pixels)
                if (Math.abs(this.player2.y - expectedY) <= 2) {
                    this.player2.y = expectedY;
                }
            }
        }
        
        this.levelTime += dt;
        const minutes = Math.floor((this.levelDuration - this.levelTime) / 60);
        const seconds = Math.floor((this.levelDuration - this.levelTime) % 60);
        this.timeText.setText(`${minutes}:${seconds.toString().padStart(2, '0')}`);
        
        // Update rising lava mechanic
        this.updateRisingLava(dt);
        
        if (this.levelTime >= this.levelDuration) {
            let winner = null;
            if (this.player1Influence > this.player2Influence) winner = 'Solari';
            else if (this.player2Influence > this.player1Influence) winner = 'Umbrae';
            this.endLevel(winner);
            return;
        }
        
        this.updateFallingPlatforms(dt);
        this.updateLavaOrbs(dt);
        
        // Only update players if not in editor mode
        if (!this.editorMode) {
            this.updatePlayer(this.player1, { up: this.wKey, left: this.cursorsWASD.A, right: this.cursorsWASD.D });
            this.updatePlayer(this.player2, { up: this.upKey, left: this.cursorsArrows.left, right: this.cursorsArrows.right });
        }
        
        this.updateInfluence(dt);
    }
    
    updateLavaOrbs(dt) {
        this.lavaOrbs.forEach(orb => {
            // Handle cooldown state
            if (orb.isOnCooldown) {
                orb.cooldownTimer += dt;
                
                // Visual: dim and gray during cooldown - VERY OBVIOUS
                orb.body.setFillStyle(0x333333, 0.3);
                orb.core.setFillStyle(0x222222, 0.2);
                orb.glow.setFillStyle(0x111111, 0.1);
                
                // Hide charge timer text during cooldown
                if (orb.chargeTimerText) {
                    orb.chargeTimerText.setVisible(false);
                }
                
                // Add X symbol to show disabled
                if (!orb.disabledIndicator) {
                    orb.disabledIndicator = this.add.text(orb.x, orb.y, '✕', {
                        fontSize: '30px',
                        fill: '#666666',
                        fontStyle: 'bold'
                    }).setOrigin(0.5, 0.5).setDepth(10);
                }
                
                if (orb.cooldownTimer >= orb.cooldownTime) {
                    orb.isOnCooldown = false;
                    orb.cooldownTimer = 0;
                    orb.isCharged = false; // Start charging after cooldown
                    orb.chargeTimer = 0;
                    // Remove disabled indicator
                    if (orb.disabledIndicator) {
                        orb.disabledIndicator.destroy();
                        orb.disabledIndicator = null;
                    }
                }
                return; // Skip charging/boost logic during cooldown
            }
            
            // Handle charging state
            if (!orb.isCharged) {
                orb.chargeTimer += dt;
                
                // Calculate remaining charge time
                const remainingTime = Math.max(0, orb.chargeTime - orb.chargeTimer);
                
                // Update charge timer text with 2 decimal places
                if (orb.chargeTimerText) {
                    orb.chargeTimerText.setText(remainingTime.toFixed(2));
                    orb.chargeTimerText.setVisible(true);
                    orb.chargeTimerText.setPosition(orb.x, orb.y - 40);
                }
                
                // Visual: gradually brighten as it charges
                const chargeProgress = Math.min(orb.chargeTimer / orb.chargeTime, 1.0);
                const glowAlpha = 0.2 + (chargeProgress * 0.3);
                const bodyAlpha = 0.4 + (chargeProgress * 0.5);
                const coreAlpha = 0.3 + (chargeProgress * 0.7);
                
                orb.glow.setFillStyle(orb.originalColors.glow, glowAlpha);
                orb.body.setFillStyle(orb.originalColors.body, bodyAlpha);
                orb.core.setFillStyle(orb.originalColors.core, coreAlpha);
                
                // Scale up slightly as it charges
                const scale = 0.8 + (chargeProgress * 0.2);
                orb.glow.setScale(scale);
                orb.body.setScale(scale);
                orb.core.setScale(scale);
                
                // Show charging indicator (X symbol)
                if (!orb.disabledIndicator) {
                    orb.disabledIndicator = this.add.text(orb.x, orb.y, '✕', {
                        fontSize: '30px',
                        fill: '#666666',
                        fontStyle: 'bold',
                        alpha: 1.0 - chargeProgress // Fade out as it charges
                    }).setOrigin(0.5, 0.5).setDepth(10);
                } else {
                    orb.disabledIndicator.setAlpha(1.0 - chargeProgress);
                }
                
                if (orb.chargeTimer >= orb.chargeTime) {
                    orb.isCharged = true;
                    orb.chargeTimer = 0;
                    
                    // Hide charge timer text
                    if (orb.chargeTimerText) {
                        orb.chargeTimerText.setVisible(false);
                    }
                    
                    // Remove charging indicator
                    if (orb.disabledIndicator) {
                        orb.disabledIndicator.destroy();
                        orb.disabledIndicator = null;
                    }
                    
                    // Visual: bright flash when fully charged
                    orb.glow.setFillStyle(orb.originalColors.glow, 0.6);
                    orb.body.setFillStyle(orb.originalColors.body, 1.0);
                    orb.core.setFillStyle(0xFFFFFF, 1.0); // White hot when ready
                    
                    // Quick pulse to indicate ready
                    this.tweens.add({
                        targets: [orb.core],
                        scale: { from: 1.0, to: 1.3 },
                        duration: 200,
                        yoyo: true,
                        ease: 'Power2'
                    });
                }
            } else {
                // Fully charged - bright and pulsing
                orb.glow.setFillStyle(orb.originalColors.glow, 0.5);
                orb.body.setFillStyle(orb.originalColors.body, 1.0);
                orb.core.setFillStyle(orb.originalColors.core, 1.0);
                
                // Hide charge timer text when charged
                if (orb.chargeTimerText) {
                    orb.chargeTimerText.setVisible(false);
                }
                
                // Remove any indicator if it exists
                if (orb.disabledIndicator) {
                    orb.disabledIndicator.destroy();
                    orb.disabledIndicator = null;
                }
            }
            
            // SIMPLE FIX: Check if players touch the orb and boost them
            if (orb.isCharged) {
                const p1Distance = Phaser.Math.Distance.Between(this.player1.x, this.player1.y, orb.x, orb.y);
                const p2Distance = Phaser.Math.Distance.Between(this.player2.x, this.player2.y, orb.x, orb.y);
                
                // Boost player 1 if they touch the orb
                if (p1Distance < orb.radius) {
                    if (this.player1 && this.player1.body) {
                        // Simple check: only boost if player is in the air (not touching ground)
                        if (!this.player1.body.touching.down) {
                            // Reset vertical velocity first
                            this.player1.body.setVelocityY(0);
                            // Apply boost
                            this.player1.body.setVelocityY(orb.boostPower);
                            
                            // HARDCODED: Set timer so ground becomes "soft" when player lands
                            this.player1OrbBoostTimer = this.ORB_BOOST_PROTECTION_TIME;
                            
                            // Use the orb - trigger cooldown
                            orb.isCharged = false;
                            orb.isOnCooldown = true;
                            orb.cooldownTimer = 0;
                            
                            // Visual feedback
                            orb.core.setFillStyle(0xFFFFFF, 1.0);
                            orb.body.setFillStyle(0xFFFFFF, 1.0);
                            this.tweens.add({
                                targets: [orb.glow],
                                scale: { from: 1.0, to: 1.5 },
                                alpha: { from: 0.5, to: 0 },
                                duration: 300,
                                ease: 'Power2'
                            });
                        }
                    }
                }
                
                // Boost player 2 if they touch the orb
                if (p2Distance < orb.radius) {
                    if (this.player2 && this.player2.body) {
                        // Simple check: only boost if player is in the air (not touching ground)
                        if (!this.player2.body.touching.down) {
                            // Reset vertical velocity first
                            this.player2.body.setVelocityY(0);
                            // Apply boost
                            this.player2.body.setVelocityY(orb.boostPower);
                            
                            // HARDCODED: Set timer so ground becomes "soft" when player lands
                            this.player2OrbBoostTimer = this.ORB_BOOST_PROTECTION_TIME;
                            
                            // Use the orb - trigger cooldown
                            orb.isCharged = false;
                            orb.isOnCooldown = true;
                            orb.cooldownTimer = 0;
                            
                            // Visual feedback
                            orb.core.setFillStyle(0xFFFFFF, 1.0);
                            orb.body.setFillStyle(0xFFFFFF, 1.0);
                            this.tweens.add({
                                targets: [orb.glow],
                                scale: { from: 1.0, to: 1.5 },
                                alpha: { from: 0.5, to: 0 },
                                duration: 300,
                                ease: 'Power2'
                            });
                        }
                    }
                }
            }
        });
    }
    
    updateFallingPlatforms(dt) {
        this.fallingPlatforms.forEach(platform => {
            if (platform.isFalling) {
                // Manually animate the fall
                if (platform.fallVelocity !== undefined) {
                    platform.fallVelocity += this.gravity * dt;
                    platform.y += platform.fallVelocity * dt;
                }
                
                if (platform.y > 1200) {
                    platform.setVisible(false);
                    // Static bodies don't have setEnable, just hide it
                }
                return;
            }
            
            const platformTop = platform.y - platform.height / 2;
            const p1Bottom = this.player1.y + this.player1.height / 2;
            const p2Bottom = this.player2.y + this.player2.height / 2;
            const p1HorizontalOverlap = Math.abs(this.player1.x - platform.x) < (platform.width / 2 + this.player1.width / 2);
            const p2HorizontalOverlap = Math.abs(this.player2.x - platform.x) < (platform.width / 2 + this.player2.width / 2);
            const p1On = p1HorizontalOverlap && p1Bottom >= platformTop - 5 && p1Bottom <= platformTop + 15 && this.player1.body.velocity.y >= 0;
            const p2On = p2HorizontalOverlap && p2Bottom >= platformTop - 5 && p2Bottom <= platformTop + 15 && this.player2.body.velocity.y >= 0;
            
            if (p1On) platform.playersOnPlatform.add(this.player1);
            else platform.playersOnPlatform.delete(this.player1);
            if (p2On) platform.playersOnPlatform.add(this.player2);
            else platform.playersOnPlatform.delete(this.player2);
            
            if (platform.playersOnPlatform.size > 0 && !platform.isFalling) {
                platform.fallTimer += dt;
                
                if (platform.fallTimer > 0.5) {
                    platform.setFillStyle(0xFF0000);
                }
                
                if (platform.fallTimer >= 1.0 && !platform.isFalling) {
                    // Mark as falling immediately to prevent multiple triggers
                    platform.isFalling = true;
                    
                    // CRITICAL: Remove all colliders BEFORE making platform dynamic
                    // This prevents the game from freezing
                    if (platform.colliders && platform.colliders.length > 0) {
                        // Create a copy of the array to avoid modification during iteration
                        const collidersToRemove = [...platform.colliders];
                        platform.colliders = [];
                        
                        collidersToRemove.forEach(collider => {
                            try {
                                if (collider && collider.active) {
                                    this.physics.world.removeCollider(collider);
                                }
                            } catch (e) {
                                // Ignore errors if collider is already removed
                            }
                        });
                    }
                    
                    // Remove colliders and manually animate the fall
                    // Static bodies can't be disabled, but we've already removed colliders
                    // Store fall velocity for manual animation
                    platform.fallVelocity = 0;
                    platform.setFillStyle(0x8B0000);
                }
            } else if (platform.playersOnPlatform.size === 0 && platform.fallTimer > 0) {
                platform.fallTimer = 0;
                platform.setFillStyle(0xFF6347);
            }
        });
    }
    
    updatePlayer(player, keys) {
        player.body.setAllowGravity(true);
        const upPressed = Phaser.Input.Keyboard.JustDown(keys.up);
        
        // HARDCODED: Apply debuff if player touched lava (15% reduction)
        const speedMultiplier = (player === this.player1 && this.player1LavaDebuff) || 
                               (player === this.player2 && this.player2LavaDebuff) ? 0.85 : 1.0;
        const jumpMultiplier = (player === this.player1 && this.player1LavaDebuff) || 
                              (player === this.player2 && this.player2LavaDebuff) ? 0.85 : 1.0;
        
        const currentSpeed = this.playerSpeed * speedMultiplier;
        const currentJump = this.jumpVelocity * jumpMultiplier;
        
        if (keys.left.isDown) player.body.setVelocityX(-currentSpeed);
        else if (keys.right.isDown) player.body.setVelocityX(currentSpeed);
        else player.body.setVelocityX(0);
        
        if (upPressed && player.body.touching.down) {
            player.body.setVelocityY(currentJump);
        }
    }
    
    updateRisingLava(dt) {
        // HARDCODED: Determine which lava event we're in (1st or 2nd)
        let currentWarningStart = 0;
        let currentLavaStart = 0;
        
        // Check for first event
        if (this.levelTime >= this.lavaRiseStartTime1 && this.levelTime < this.lavaRiseActualStart1) {
            // First event warning period
            if (this.lavaEventNumber === 0) {
                this.lavaEventNumber = 1;
            }
            currentWarningStart = this.lavaRiseStartTime1;
            currentLavaStart = this.lavaRiseActualStart1;
        } else if (this.levelTime >= this.lavaRiseActualStart1 && this.levelTime < this.lavaRiseStartTime2) {
            // First event lava rising period
            if (this.lavaEventNumber === 0) {
                this.lavaEventNumber = 1;
            }
            currentLavaStart = this.lavaRiseActualStart1;
        } else if (this.levelTime >= this.lavaRiseStartTime2 && this.levelTime < this.lavaRiseActualStart2) {
            // Second event warning period (reset flags if first event ended)
            if (this.lavaSurvivalChecked && this.lavaEventNumber <= 1) {
                // Reset flags for second event
                this.lavaSurvivalChecked = false;
                this.lavaRising = false;
                this.lavaRiseTimer = 0;
                this.lavaEventNumber = 2;
            }
            if (this.lavaEventNumber === 2) {
                currentWarningStart = this.lavaRiseStartTime2;
                currentLavaStart = this.lavaRiseActualStart2;
            }
        } else if (this.levelTime >= this.lavaRiseActualStart2) {
            // Second event lava rising period
            if (this.lavaSurvivalChecked && this.lavaEventNumber <= 1) {
                // Reset flags for second event
                this.lavaSurvivalChecked = false;
                this.lavaRising = false;
                this.lavaRiseTimer = 0;
                this.lavaEventNumber = 2;
            }
            if (this.lavaEventNumber === 2) {
                currentLavaStart = this.lavaRiseActualStart2;
            }
        }
        
        // HARDCODED: If lava was removed and we're not in a new event, don't update it
        if (!this.lavaRising && this.lavaSurvivalChecked && currentLavaStart === 0) {
            // Lava event is over, make sure it stays hidden
            if (this.lava) this.lava.setVisible(false);
            if (this.lavaGlow) this.lavaGlow.setVisible(false);
            if (this.lavaParticles) {
                this.lavaParticles.forEach(p => {
                    if (p) p.setVisible(false);
                });
            }
            // Still show warning if we're in warning period
            if (currentWarningStart > 0) {
                // Continue to show warning
            } else {
                return; // Exit early - don't process lava updates
            }
        }
        
        // HARDCODED: Only show lava when it's actually rising
        // Before that, keep it hidden
        if (currentLavaStart === 0 || this.levelTime < currentLavaStart) {
            // Before lava starts rising, keep it hidden
            if (this.lava) {
                this.lava.setVisible(false);
            }
            if (this.lavaGlow) {
                this.lavaGlow.setVisible(false);
            }
            if (this.lavaParticles && this.lavaParticles.length > 0) {
                this.lavaParticles.forEach(p => {
                    if (p) p.setVisible(false);
                });
            }
        } else {
            // After lava starts rising, make it visible
            if (this.lava) {
                this.lava.setVisible(true);
                this.lava.setAlpha(1.0);
                this.lava.setDepth(999);
            } else {
                // HARDCODED: Create lava if it doesn't exist (fallback)
                const lavaStartY = this.HARDCODED_GROUND_TOP || 914;
                this.lava = this.add.rectangle(914, lavaStartY, 1828, 0, 0xFF4500);
                this.lava.setOrigin(0.5, 1.0); // Origin at bottom
                this.lava.setDepth(999);
                this.lava.setAlpha(1.0);
                this.lava.setVisible(true);
                console.log('HARDCODED: Created missing lava in update!');
            }
            if (this.lavaGlow) {
                this.lavaGlow.setVisible(true);
                this.lavaGlow.setAlpha(1.0);
                this.lavaGlow.setDepth(1000);
            }
            if (this.lavaParticles && this.lavaParticles.length > 0) {
                this.lavaParticles.forEach(p => {
                    if (p) {
                        p.setVisible(true);
                        p.setAlpha(1.0);
                        p.setDepth(1001);
                    }
                });
            }
        }
        
        // Check if we should show warning timer
        if (currentWarningStart > 0 && this.levelTime >= currentWarningStart && this.levelTime < currentLavaStart) {
            if (!this.lavaWarningActive) {
                this.lavaWarningActive = true;
                this.lavaWarningText.setVisible(true);
            }
            
            // Show countdown: 10, 9, 8, ... 1
            const timeUntilRise = currentLavaStart - this.levelTime;
            const countdown = Math.ceil(timeUntilRise);
            this.lavaWarningText.setText(`LAVA RISING IN: ${countdown}`);
            
            // Pulse effect
            this.lavaWarningText.setScale(1.0 + Math.sin(this.levelTime * 10) * 0.1);
        } else if (currentLavaStart > 0 && this.levelTime >= currentLavaStart && !this.lavaSurvivalChecked) {
            // HARDCODED: Only start rising if lava event hasn't ended
            // Hide warning text
            if (this.lavaWarningActive) {
                this.lavaWarningActive = false;
                this.lavaWarningText.setVisible(false);
            }
            
            // Start rising lava
            if (!this.lavaRising) {
                this.lavaRising = true;
                this.lavaRiseTimer = 0;
                // HARDCODED: Force lava to be visible when it starts rising
                console.log('=== LAVA RISING STARTED ===');
                if (this.lava) {
                    this.lava.setVisible(true);
                    this.lava.setAlpha(1.0);
                    this.lava.setDepth(10);
                    console.log('LAVA OBJECT - Y:', this.lava.y, 'Visible:', this.lava.visible, 'Alpha:', this.lava.alpha, 'Depth:', this.lava.depth);
                } else {
                    console.error('LAVA OBJECT IS NULL!');
                }
                if (this.lavaGlow) {
                    this.lavaGlow.setVisible(true);
                    this.lavaGlow.setAlpha(0.8);
                    this.lavaGlow.setDepth(11);
                }
                if (this.lavaParticles && this.lavaParticles.length > 0) {
                    this.lavaParticles.forEach((p, i) => {
                        if (p) {
                            p.setVisible(true);
                            p.setAlpha(1.0);
                            p.setDepth(12);
                        }
                    });
                }
            }
            
            // HARDCODED: Only update timer if lava is still rising (not removed)
            if (this.lavaRising && !this.lavaSurvivalChecked) {
                this.lavaRiseTimer += dt;
            } else {
                // Lava was removed, stop updating
                this.lavaRising = false;
                return;
            }
            
            // Calculate lava fill progress
            const progress = Math.min(this.lavaRiseTimer / this.lavaRiseDuration, 1.0);
            
            // HARDCODED: EXTREME deceleration curve - VERY FAST start, MEDIUM middle, VERY SLOW end
            // Using ease-out with power 8 for EXTREME slowdown
            // This creates: VERY fast at beginning → medium in middle → VERY slow at end
            const easedProgress = 1 - Math.pow(1 - progress, 8);
            
            // HARDCODED: Calculate lava height (fills from bottom like water)
            // Ground is at y=914, topmost platform is at y=150 (top at y=135)
            // Lava should rise to just below top platform: 914 - 135 = 779 pixels
            const maxLavaHeight = 779; // From ground (914) to just below top platform (135) = 779px
            const currentLavaHeight = maxLavaHeight * easedProgress;
            this.lavaCurrentY = this.lavaStartY; // Keep bottom at ground level (914) - NEVER MOVES
            
            // HARDCODED: Update lava height (fills from bottom like water)
            if (this.lava) {
                // CRITICAL: Bottom stays at ground level, height increases upward
                // Make sure the rectangle actually grows from the bottom
                this.lava.height = currentLavaHeight; // Grow height upward from bottom
                this.lava.y = this.lavaStartY; // Bottom always at ground level (914) - NEVER MOVES
                this.lava.setVisible(true);
                this.lava.setAlpha(1.0);
                this.lava.setDepth(999);
                // HARDCODED: Force update the display
                this.lava.setSize(1828, currentLavaHeight);
            } else {
                console.error('LAVA OBJECT MISSING DURING RISE!');
                // HARDCODED: Try to recreate lava if it's missing
                if (!this.lava) {
                    const lavaStartY = this.HARDCODED_GROUND_TOP || 914;
                    this.lava = this.add.rectangle(914, lavaStartY, 1828, 0, 0xFF4500);
                    this.lava.setOrigin(0.5, 1.0); // Origin at bottom center
                    this.lava.setDepth(999);
                    this.lava.setAlpha(1.0);
                    this.lava.setVisible(true);
                    console.log('HARDCODED: Recreated missing lava!');
                }
            }
            
            // HARDCODED: Calculate lava top surface position
            const lavaTopY = this.lavaStartY - currentLavaHeight; // Top surface of lava
            
            // HARDCODED: Update lava glow - positioned exactly at the TOP SURFACE of lava
            if (this.lavaGlow) {
                this.lavaGlow.y = lavaTopY; // At the surface of the lava
                this.lavaGlow.setVisible(true);
                this.lavaGlow.setAlpha(0.8);
                this.lavaGlow.setDepth(1000);
            }
            
            // HARDCODED: Update lava particles - positioned at the TOP SURFACE of lava
            if (this.lavaParticles && this.lavaParticles.length > 0) {
                this.lavaParticles.forEach((particle, index) => {
                    if (particle && particle.active !== false) {
                        // Particles float at the surface of the lava
                        particle.y = lavaTopY + Math.sin(this.levelTime * 2 + index) * 10;
                        particle.x = 100 + (index * 80) + Math.cos(this.levelTime * 3 + index) * 5;
                        particle.setVisible(true);
                        particle.setAlpha(1.0);
                        particle.setDepth(1001);
                    }
                });
            }
            
            // Check for player-lava collisions
            this.checkLavaCollisions();
            
            // Stop rising after duration or when max height reached
            if (this.lavaRiseTimer >= this.lavaRiseDuration || currentLavaHeight >= 779) {
                this.lavaRising = false;
                // Check if both players survived
                this.checkLavaCollisions();
            }
        }
    }
    
    checkLavaCollisions() {
        // HARDCODED: Check if player touches lava (lava fills from bottom)
        if (!this.lava || !this.lava.visible) return; // No lava yet
        
        const lavaHeight = this.lava.height || 0;
        const lavaTopY = this.lavaStartY - lavaHeight; // Top of lava (grows upward from ground)
        const player1Bottom = this.player1.y + this.HARDCODED_PLAYER_HALF_HEIGHT;
        const player2Bottom = this.player2.y + this.HARDCODED_PLAYER_HALF_HEIGHT;
        
        // Check if player 1 falls into lava
        if (player1Bottom >= lavaTopY && !this.player1LavaDebuff) {
            // Player touched lava - apply debuff and end lava event
            this.player1LavaDebuff = true;
            console.log('Player 1 touched lava - debuff applied!');
            
            // HARDCODED: Don't modify global speed/jump - only affect player 1
            // The debuff is already applied per-player in updatePlayer function
            
            // HARDCODED: Temporarily change player color to red (only while message is visible)
            this.player1.setFillStyle(0xFF0000); // Red color
            
            // HARDCODED: Show message and remove lava (this will return players to start)
            this.showLavaMessage('SOLARI is weakened!', () => {
                // Callback when message disappears - restore original color
                this.player1.setFillStyle(0xFFD700); // Restore original gold color
            });
            this.removeLava();
        }
        
        // Check if player 2 falls into lava
        if (player2Bottom >= lavaTopY && !this.player2LavaDebuff) {
            // Player touched lava - apply debuff and end lava event
            this.player2LavaDebuff = true;
            console.log('Player 2 touched lava - debuff applied!');
            
            // HARDCODED: Don't modify global speed/jump - only affect player 2
            // The debuff is already applied per-player in updatePlayer function
            
            // HARDCODED: Temporarily change player color to red (only while message is visible)
            this.player2.setFillStyle(0xFF0000); // Red color
            
            // HARDCODED: Show message and remove lava (this will return players to start)
            this.showLavaMessage('UMBRAE is weakened!', () => {
                // Callback when message disappears - restore original color
                this.player2.setFillStyle(0x8B00FF); // Restore original purple color
            });
            this.removeLava();
        }
        
        // HARDCODED: Check if both players survive on final platform (only check once)
        if (!this.lavaSurvivalChecked && this.lavaRising) {
            const topPlatformY = 150;
            const topPlatformTop = topPlatformY - 15; // Platform height is 30, so top is at y-15
            // Check if lava has reached near the platform (within 20 pixels) and both players survived
            if (lavaTopY <= topPlatformTop + 20) {
                const player1Top = this.player1.y - this.HARDCODED_PLAYER_HALF_HEIGHT;
                const player2Top = this.player2.y - this.HARDCODED_PLAYER_HALF_HEIGHT;
                // Both players are above the platform (survived) and neither touched lava
                if (player1Top < topPlatformTop && player2Top < topPlatformTop && 
                    !this.player1LavaDebuff && !this.player2LavaDebuff) {
                    this.lavaSurvivalChecked = true;
                    this.showLavaMessage('Both sides survived the lava!');
                    this.removeLava();
                }
            }
        }
    }
    
    showLavaMessage(text, onComplete = null) {
        // HARDCODED: Show message in center of screen
        if (this.lavaMessageText) {
            this.lavaMessageText.destroy();
        }
        this.lavaMessageText = this.add.text(914, 360, text, {
            fontSize: '48px',
            fill: '#FFFFFF',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 6
        }).setOrigin(0.5, 0.5).setDepth(2000);
        
        // Remove message after 3 seconds
        this.time.delayedCall(3000, () => {
            if (this.lavaMessageText) {
                this.lavaMessageText.destroy();
                this.lavaMessageText = null;
            }
            // HARDCODED: Call callback when message disappears (to restore player color)
            if (onComplete) {
                onComplete();
            }
        });
    }
    
    removeLava() {
        // HARDCODED: FORCE stop lava rising and remove it completely
        this.lavaRising = false;
        this.lavaRiseTimer = 0;
        this.lavaSurvivalChecked = true; // Mark as checked so we don't check again
        this.lavaWarningActive = false; // Stop warning too
        
        // HARDCODED: Force hide all lava elements and reset height
        if (this.lava) {
            this.lava.setVisible(false);
            this.lava.height = 0; // Reset height for next event
            this.lava.y = this.lavaStartY; // Reset position
        }
        if (this.lavaGlow) {
            this.lavaGlow.setVisible(false);
        }
        if (this.lavaParticles && this.lavaParticles.length > 0) {
            this.lavaParticles.forEach(p => {
                if (p) {
                    p.setVisible(false);
                    p.setActive(false);
                }
            });
        }
        if (this.lavaWarningText) {
            this.lavaWarningText.setVisible(false);
        }
        
        // HARDCODED: Return players to start positions after minigame ends
        this.returnPlayersToStart();
        
        console.log('HARDCODED: Lava removed and stopped rising');
    }
    
    returnPlayersToStart() {
        // HARDCODED: Return both players to their start positions ABOVE the ground
        // Ground top is 914, player half height is 35.5
        // Player should be at: 914 - 35.5 = 878.5 (ABOVE ground, not inside)
        const player1StartX = 400;
        const player1StartY = this.HARDCODED_GROUND_TOP - this.HARDCODED_PLAYER_HALF_HEIGHT; // 914 - 35.5 = 878.5
        const player2StartX = 1428;
        const player2StartY = this.HARDCODED_GROUND_TOP - this.HARDCODED_PLAYER_HALF_HEIGHT; // 914 - 35.5 = 878.5
        
        // HARDCODED: Reset player positions and velocities - DISABLE physics temporarily
        if (this.player1) {
            // HARDCODED: Disable body temporarily to prevent ground collision interference
            this.player1.body.setEnable(false);
            this.player1.x = player1StartX;
            this.player1.y = player1StartY; // 878.5 - ABOVE ground
            this.player1.body.setVelocity(0, 0);
            // HARDCODED: Re-enable body after positioning
            this.time.delayedCall(50, () => {
                if (this.player1) {
                    this.player1.body.setEnable(true);
                    this.player1.body.setGravityY(this.gravity);
                    this.player1.body.updateFromGameObject();
                }
            });
        }
        if (this.player2) {
            // HARDCODED: Disable body temporarily to prevent ground collision interference
            this.player2.body.setEnable(false);
            this.player2.x = player2StartX;
            this.player2.y = player2StartY; // 878.5 - ABOVE ground
            this.player2.body.setVelocity(0, 0);
            // HARDCODED: Re-enable body after positioning
            this.time.delayedCall(50, () => {
                if (this.player2) {
                    this.player2.body.setEnable(true);
                    this.player2.body.setGravityY(this.gravity);
                    this.player2.body.updateFromGameObject();
                }
            });
        }
        
        // HARDCODED: Reset global speed/jump to base values (debuffs are per-player)
        this.playerSpeed = this.basePlayerSpeed;
        this.jumpVelocity = this.baseJumpVelocity;
        
        console.log('HARDCODED: Players returned to start positions - Y:', player1StartY, 'Ground top:', this.HARDCODED_GROUND_TOP);
    }
    
    updateInfluence(dt) {
        this.player1InfluenceText.setText(`${Math.floor(this.player1Influence)}/500`);
        this.player2InfluenceText.setText(`${Math.floor(this.player2Influence)}/500`);
        
        const p1Width = (this.player1Influence / this.maxInfluence) * 400;
        const p2Width = (this.player2Influence / this.maxInfluence) * 400;
        this.player1BarFill.width = p1Width;
        this.player2BarFill.width = p2Width;
        
        if (this.player1Influence >= this.maxInfluence) this.endLevel('Solari');
        else if (this.player2Influence >= this.maxInfluence) this.endLevel('Umbrae');
    }
    
    endLevel(winner) {
        const winnerText = winner 
            ? this.add.text(914, 514, `${winner} WINS!`, { fontSize: '68px', fill: winner === 'Solari' ? '#FFD700' : '#8B00FF', fontStyle: 'bold' }).setOrigin(0.5, 0.5)
            : this.add.text(914, 514, 'NO RESULT', { fontSize: '68px', fill: '#888888', fontStyle: 'bold' }).setOrigin(0.5, 0.5);
        this.scene.pause();
    }
    
    // ===== LEVEL EDITOR METHODS =====
    toggleEditorMode() {
        this.editorMode = !this.editorMode;
        
        if (this.editorMode) {
            // Make players semi-transparent in editor mode so you can see collisions
            this.player1.setVisible(true);
            this.player2.setVisible(true);
            this.player1.setAlpha(0.5);
            this.player2.setAlpha(0.5);
            // Keep physics bodies active so collisions still work for testing
            if (this.player1.body) this.player1.body.setEnable(true);
            if (this.player2.body) this.player2.body.setEnable(true);
            this.showEditorUI();
            console.log('EDITOR MODE: Press E to exit, Click to select, Drag to move, X to delete, C to clear all, S to save, L to load, P to add platform, O to add orb');
        } else {
            this.player1.setVisible(true);
            this.player2.setVisible(true);
            this.player1.setAlpha(1.0);
            this.player2.setAlpha(1.0);
            this.hideEditorUI();
            this.selectedObject = null;
            this.dragging = false;
            
            // HARDCODED: Refresh all platform colliders when exiting editor mode
            // This ensures any platforms created in editor have working collisions
            this.platforms.forEach(platform => {
                if (platform === this.platforms[0]) return; // Skip ground
                
                // Remove old colliders
                if (platform.colliders) {
                    platform.colliders.forEach(c => {
                        try {
                            if (c) {
                                this.physics.world.removeCollider(c);
                            }
                        } catch (e) {}
                    });
                }
                
                // Create fresh colliders
                const collider1 = this.physics.add.collider(this.player1, platform);
                const collider2 = this.physics.add.collider(this.player2, platform);
                
                // HARDCODED: Force active
                if (collider1) {
                    collider1.active = true;
                    if (collider1.enabled !== undefined) collider1.enabled = true;
                }
                if (collider2) {
                    collider2.active = true;
                    if (collider2.enabled !== undefined) collider2.enabled = true;
                }
                
                platform.colliders = [collider1, collider2];
            });
            
            console.log('HARDCODED: All platform colliders refreshed on exit editor');
        }
    }
    
    showEditorUI() {
        if (this.editorUI) {
            this.editorUI.bg.destroy();
            this.editorUI.instructions.destroy();
        }
        
        const bg = this.add.rectangle(914, 514, 1828, 1028, 0x000000, 0.3);
        bg.setDepth(100);
        const instructions = this.add.text(914, 50, 'LEVEL EDITOR - E: Exit | Click: Select | Drag: Move | X: Delete | C: Clear All | S: Save | L: Load | P: Add Platform | O: Add Orb | Arrows: Resize | F: Toggle Falling', {
            fontSize: '18px',
            fill: '#ffffff',
            backgroundColor: '#000000',
            padding: { x: 10, y: 5 }
        }).setOrigin(0.5, 0.5);
        instructions.setDepth(101);
        this.editorUI = { bg, instructions };
    }
    
    hideEditorUI() {
        if (this.editorUI) {
            this.editorUI.bg.destroy();
            this.editorUI.instructions.destroy();
            this.editorUI = null;
        }
        if (this.selectedIndicator) {
            this.selectedIndicator.destroy();
            this.selectedIndicator = null;
        }
    }
    
    handleEditorClick(pointer) {
        const worldX = pointer.worldX;
        const worldY = pointer.worldY;
        
        let clicked = false;
        for (let platform of this.platforms) {
            if (platform === this.platforms[0]) continue;
            const dist = Phaser.Math.Distance.Between(worldX, worldY, platform.x, platform.y);
            if (dist < Math.max(platform.width, platform.height) / 2) {
                this.selectObject(platform, 'platform');
                clicked = true;
                break;
            }
        }
        
        if (!clicked) {
            for (let orb of this.lavaOrbs) {
                const dist = Phaser.Math.Distance.Between(worldX, worldY, orb.x, orb.y);
                if (dist < orb.radius) {
                    this.selectObject(orb, 'orb');
                    clicked = true;
                    break;
                }
            }
        }
        
        if (!clicked) {
            this.selectedObject = null;
            if (this.selectedIndicator) {
                this.selectedIndicator.destroy();
                this.selectedIndicator = null;
            }
        } else {
            this.dragging = true;
        }
    }
    
    selectObject(obj, type) {
        this.selectedObject = { obj, type, orb: type === 'orb' ? obj : null };
        if (this.selectedIndicator) {
            this.selectedIndicator.destroy();
        }
        
        let indicator;
        if (type === 'platform') {
            indicator = this.add.rectangle(obj.x, obj.y, obj.width + 10, obj.height + 10, 0x00ff00, 0.3);
            indicator.setStrokeStyle(3, 0x00ff00);
        } else {
            indicator = this.add.circle(obj.x, obj.y, obj.radius + 10, 0x00ff00, 0.3);
            indicator.setStrokeStyle(3, 0x00ff00);
        }
        indicator.setDepth(200);
        this.selectedIndicator = indicator;
        console.log(`${type.toUpperCase()} selected at (${Math.round(obj.x)}, ${Math.round(obj.y)})`);
    }
    
    deleteSelectedObject() {
        if (!this.selectedObject) return;
        const { obj, type } = this.selectedObject;
        
        if (type === 'platform') {
            const index = this.platforms.indexOf(obj);
            if (index > -1 && index !== 0) { // Don't delete ground
                // Remove from falling platforms if it's a falling platform
                const fallingIndex = this.fallingPlatforms.indexOf(obj);
                if (fallingIndex > -1) {
                    this.fallingPlatforms.splice(fallingIndex, 1);
                }
                // Remove colliders
                if (obj.colliders) {
                    obj.colliders.forEach(collider => {
                        try {
                            if (collider && collider.active) {
                                this.physics.world.removeCollider(collider);
                            }
                        } catch (e) {}
                    });
                }
                this.platforms.splice(index, 1);
                obj.destroy();
            }
        } else if (type === 'orb') {
            // Stop any tweens on the orb
            this.tweens.killTweensOf([obj.glow, obj.body, obj.core]);
            // Destroy disabled indicator if it exists
            if (obj.disabledIndicator) {
                obj.disabledIndicator.destroy();
            }
            // Destroy charge timer text if it exists
            if (obj.chargeTimerText) {
                obj.chargeTimerText.destroy();
            }
            obj.glow.destroy();
            obj.body.destroy();
            obj.core.destroy();
            const index = this.lavaOrbs.indexOf(obj);
            if (index > -1) {
                this.lavaOrbs.splice(index, 1);
            }
        }
        
        this.selectedObject = null;
        if (this.selectedIndicator) {
            this.selectedIndicator.destroy();
            this.selectedIndicator = null;
        }
        console.log('Object deleted');
    }
    
    deleteAllObjects() {
        // Clear selection
        this.selectedObject = null;
        if (this.selectedIndicator) {
            this.selectedIndicator.destroy();
            this.selectedIndicator = null;
        }
        
        // Delete all platforms except ground (first platform)
        for (let i = this.platforms.length - 1; i > 0; i--) {
            const platform = this.platforms[i];
            
            // Remove from falling platforms if it's a falling platform
            const fallingIndex = this.fallingPlatforms.indexOf(platform);
            if (fallingIndex > -1) {
                this.fallingPlatforms.splice(fallingIndex, 1);
            }
            
            // Remove colliders
            if (platform.colliders) {
                platform.colliders.forEach(collider => {
                    try {
                        if (collider && collider.active) {
                            this.physics.world.removeCollider(collider);
                        }
                    } catch (e) {}
                });
            }
            
            platform.destroy();
            this.platforms.splice(i, 1);
        }
        
        // Delete all orbs
        this.lavaOrbs.forEach(orb => {
            // Stop any tweens
            if (orb.floatTween) {
                orb.floatTween.stop();
                orb.floatTween.destroy();
            }
            if (orb.pulseTween) {
                orb.pulseTween.stop();
                orb.pulseTween.destroy();
            }
            
            orb.glow.destroy();
            orb.body.destroy();
            orb.core.destroy();
        });
        this.lavaOrbs = [];
        
        console.log('All objects deleted (ground platform preserved)');
    }
    
    resizePlatform(dimension, amount) {
        if (!this.selectedObject || this.selectedObject.type !== 'platform') return;
        
        const platform = this.selectedObject.obj;
        const minSize = 20; // Minimum size
        const maxSize = 500; // Maximum size
        
        if (dimension === 'width') {
            const newWidth = Math.max(minSize, Math.min(maxSize, platform.width + amount));
            platform.width = newWidth;
            platform.displayWidth = newWidth;
            if (platform.body) {
                platform.body.setSize(newWidth, platform.height);
            }
        } else if (dimension === 'height') {
            const newHeight = Math.max(minSize, Math.min(maxSize, platform.height + amount));
            platform.height = newHeight;
            platform.displayHeight = newHeight;
            if (platform.body) {
                platform.body.setSize(platform.width, newHeight);
            }
        }
        
        // Update selection indicator
        if (this.selectedIndicator) {
            this.selectedIndicator.destroy();
        }
        const indicator = this.add.rectangle(platform.x, platform.y, platform.width + 10, platform.height + 10, 0x00ff00, 0.3);
        indicator.setStrokeStyle(3, 0x00ff00);
        indicator.setDepth(200);
        this.selectedIndicator = indicator;
        
        console.log(`Platform resized: ${dimension} = ${dimension === 'width' ? platform.width : platform.height}`);
    }
    
    toggleFallingPlatform() {
        if (!this.selectedObject || this.selectedObject.type !== 'platform') return;
        
        const platform = this.selectedObject.obj;
        const isCurrentlyFalling = this.fallingPlatforms.includes(platform);
        
        if (isCurrentlyFalling) {
            // Remove from falling platforms
            const index = this.fallingPlatforms.indexOf(platform);
            if (index > -1) {
                this.fallingPlatforms.splice(index, 1);
            }
            // Change appearance to normal platform
            platform.setFillStyle(0x8B4513); // Brown color
            platform.setStrokeStyle(0); // Remove stroke
            platform.isFalling = false;
            platform.fallTimer = 0;
            delete platform.playersOnPlatform;
            delete platform.colliders;
            delete platform.originalY;
            console.log('Platform changed to normal (non-falling)');
        } else {
            // Add to falling platforms
            this.fallingPlatforms.push(platform);
            // Change appearance to falling platform
            platform.setFillStyle(0xFF6347); // Red-orange color
            platform.setStrokeStyle(2, 0xFF4500); // Orange stroke
            platform.isFalling = false;
            platform.fallTimer = 0;
            platform.originalY = platform.y;
            platform.playersOnPlatform = new Set();
            platform.colliders = [];
            console.log('Platform changed to falling platform');
        }
        
        // Update selection indicator to show new color
        if (this.selectedIndicator) {
            this.selectedIndicator.destroy();
        }
        const indicator = this.add.rectangle(platform.x, platform.y, platform.width + 10, platform.height + 10, 0x00ff00, 0.3);
        indicator.setStrokeStyle(3, 0x00ff00);
        indicator.setDepth(200);
        this.selectedIndicator = indicator;
    }
    
    addNewPlatform() {
        // HARDCODED: Create platform EXACTLY like Start.js (lines 103-106, 234-235)
        const newPlatform = this.add.rectangle(914, 514, 150, 30, 0x8B4513);
        newPlatform.setOrigin(0.5, 0.5);
        
        // HARDCODED: Mark as editor-created platform (for collision enforcement)
        newPlatform.isEditorCreated = true;
        
        // HARDCODED: Add physics body as static - EXACTLY like Start.js line 105
        this.physics.add.existing(newPlatform, true);
        
        // HARDCODED: Force body to be enabled and active (NEVER canCollide=false)
        if (newPlatform.body) {
            newPlatform.body.enable = true;
            newPlatform.body.setSize(150, 30);
        }
        
        // HARDCODED: Add to platforms array - EXACTLY like Start.js line 106
        this.platforms.push(newPlatform);
        
        // HARDCODED: Create colliders EXACTLY like Start.js lines 234-235
        const collider1 = this.physics.add.collider(this.player1, newPlatform);
        const collider2 = this.physics.add.collider(this.player2, newPlatform);
        
        // HARDCODED: Force colliders to be active (NEVER canCollide=false)
        if (collider1) {
            collider1.active = true;
            if (collider1.enabled !== undefined) collider1.enabled = true;
        }
        if (collider2) {
            collider2.active = true;
            if (collider2.enabled !== undefined) collider2.enabled = true;
        }
        
        // HARDCODED: Store colliders for cleanup
        newPlatform.colliders = [collider1, collider2];
        
        this.selectObject(newPlatform, 'platform');
        console.log('HARDCODED: Editor platform added - body enabled:', newPlatform.body?.enable, 'colliders active:', collider1?.active, collider2?.active);
    }
    
    addNewOrb() {
        const pos = { x: 914, y: 514 };
        const orbGlow = this.add.circle(pos.x, pos.y, 30, 0xFF6347, 0.3);
        orbGlow.setDepth(5);
        const orbBody = this.add.circle(pos.x, pos.y, 20, 0xFF4500, 0.9);
        orbBody.setDepth(6);
        const orbCore = this.add.circle(pos.x, pos.y, 10, 0xFFD700, 1.0);
        orbCore.setDepth(7);
        
        const floatTween = this.tweens.add({
            targets: [orbGlow, orbBody, orbCore],
            y: { from: pos.y - 5, to: pos.y + 5 },
            duration: 1500 + Math.random() * 500,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
        
        // Charge timer text - shows remaining charge time
        const chargeTimerText = this.add.text(pos.x, pos.y - 40, '', {
            fontSize: '16px',
            fill: '#ffffff',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 3
        }).setOrigin(0.5, 0.5).setDepth(11).setVisible(false);
        
        const orb = {
            x: pos.x,
            y: pos.y,
            glow: orbGlow,
            body: orbBody,
            core: orbCore,
            chargeTimerText: chargeTimerText, // Store timer text reference
            floatTween: floatTween, // Store tween reference for editor
            isCharged: true,
            isOnCooldown: false,
            chargeTimer: 0,
            chargeTime: 5.0,
            cooldownTimer: 0,
            cooldownTime: 0.5,
            boostPower: -750,
            radius: 25,
            originalColors: { glow: 0xFF6347, body: 0xFF4500, core: 0xFFD700 }
        };
        
        // Make sure orb is added to the array so it can be used
        this.lavaOrbs.push(orb);
        this.selectObject(orb, 'orb');
        console.log('New orb added at (914, 514) - Orb will work when you exit editor mode');
    }
    
    saveLevelLayout() {
        const layout = {
            platforms: this.platforms.slice(1).map(p => ({
                x: p.x,
                y: p.y,
                width: p.width,
                height: p.height,
                falling: p.isFalling || false
            })),
            orbs: this.lavaOrbs.map(o => ({ x: o.x, y: o.y }))
        };
        
        localStorage.setItem('volcanoLevelLayout', JSON.stringify(layout));
        console.log('Level layout saved!', layout);
        console.log('Copy this code:', JSON.stringify(layout, null, 2));
    }
    
    loadLevelLayout() {
        const saved = localStorage.getItem('volcanoLevelLayout');
        if (!saved) {
            console.log('No saved layout found');
            return;
        }
        
        const layout = JSON.parse(saved);
        this.platforms.slice(1).forEach(p => p.destroy());
        this.platforms = [this.platforms[0]];
        
        this.lavaOrbs.forEach(o => {
            o.glow.destroy();
            o.body.destroy();
            o.core.destroy();
            if (o.chargeTimerText) o.chargeTimerText.destroy();
            if (o.disabledIndicator) o.disabledIndicator.destroy();
        });
        this.lavaOrbs = [];
        
        layout.platforms.forEach(data => {
            const platform = this.add.rectangle(data.x, data.y, data.width, data.height, data.falling ? 0xFF6347 : 0x8B4513);
            platform.setOrigin(0.5, 0.5);
            if (data.falling) {
                platform.setStrokeStyle(2, 0xFF4500);
                platform.isFalling = false;
                platform.fallTimer = 0;
                platform.originalY = data.y;
                platform.playersOnPlatform = new Set();
                platform.colliders = [];
                this.fallingPlatforms.push(platform);
            }
            this.physics.add.existing(platform, true);
            this.platforms.push(platform);
        });
        
        layout.orbs.forEach(pos => {
            const orbGlow = this.add.circle(pos.x, pos.y, 30, 0xFF6347, 0.3);
            orbGlow.setDepth(5);
            const orbBody = this.add.circle(pos.x, pos.y, 20, 0xFF4500, 0.9);
            orbBody.setDepth(6);
            const orbCore = this.add.circle(pos.x, pos.y, 10, 0xFFD700, 1.0);
            orbCore.setDepth(7);
            
            const floatTween = this.tweens.add({
                targets: [orbGlow, orbBody, orbCore],
                y: { from: pos.y - 5, to: pos.y + 5 },
                duration: 1500 + Math.random() * 500,
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut'
            });
            
            // Charge timer text - shows remaining charge time
            const chargeTimerText = this.add.text(pos.x, pos.y - 40, '', {
                fontSize: '16px',
                fill: '#ffffff',
                fontStyle: 'bold',
                stroke: '#000000',
                strokeThickness: 3
            }).setOrigin(0.5, 0.5).setDepth(11).setVisible(false);
            
            const orb = {
                x: pos.x,
                y: pos.y,
                glow: orbGlow,
                body: orbBody,
                core: orbCore,
                chargeTimerText: chargeTimerText, // Store timer text reference
                floatTween: floatTween, // Store tween reference
                isCharged: true,
                isOnCooldown: false,
                chargeTimer: 0,
                chargeTime: 5.0,
                cooldownTimer: 0,
                cooldownTime: 0.5,
                boostPower: -750,
                radius: 25,
                originalColors: { glow: 0xFF6347, body: 0xFF4500, core: 0xFFD700 }
            };
            
            this.lavaOrbs.push(orb);
        });
        
        this.platforms.forEach(platform => {
            const collider1 = this.physics.add.collider(this.player1, platform);
            const collider2 = this.physics.add.collider(this.player2, platform);
            if (platform.colliders) {
                platform.colliders.push(collider1, collider2);
            } else {
                platform.colliders = [collider1, collider2];
            }
        });
        
        console.log('Level layout loaded!');
    }
}
