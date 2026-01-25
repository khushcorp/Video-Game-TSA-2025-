// Volcano Level - Redesigned with calculated platform spacing
export class Volcano extends Phaser.Scene {
    constructor() { super('Volcano'); }
    preload() {
        this.load.image('volcano', 'assets/volcano.webp');
    }

    create() {
        // ===== LEVEL SETUP =====
        this.cameras.main.setZoom(1.0);
        
        // Design the level for a 1280x720 viewport (Standard FIT resolution)
        const worldWidth = 1280;
        const worldHeight = 720;
        
        // Set physics world bounds - INCREASED HEIGHT so players can exist near ground (y=1050)
        // This was the "invisible barrier" pushing players up!
        this.physics.world.setBounds(0, 0, worldWidth, 2000);
        
        // Center camera on the level
        this.cameras.main.setBounds(0, 0, worldWidth, worldHeight);
        this.cameras.main.centerOn(worldWidth / 2, worldHeight / 2);
        
        // ===== BACKGROUND =====
        this.createBackground();
        
        // Lava glow effects - adjusted for new ground position
        for (let i = 0; i < 5; i++) {
            const glow = this.add.circle(200 + i * 220, 680, 50 + Math.random() * 30, 0xFF4500, 0.3);
            this.tweens.add({
                targets: glow,
                alpha: { from: 0.3, to: 0.6 },
                duration: 1000 + Math.random() * 1000,
                yoyo: true,
                repeat: -1
            });
        }
        
        // ===== INFLUENCE BARS UI (screen-anchored) =====
        this.player1Influence = 0;
        this.player2Influence = 0;
        this.maxInfluence = 500;
        
        // HARDCODED: Per-second influence rates (stack and persist until next event)
        // Note: Rates can be negative (losing influence/sec), but actual influence is clamped to >= 0
        this.player1InfluenceRate = 0;
        this.player2InfluenceRate = 0;
        
        const uiPadding = 320;
        this.player1BarBg = this.add.rectangle(uiPadding, 30, 400, 30, 0x333333);
        this.player1BarBg.setOrigin(0.5, 0.5);
        this.player1BarFill = this.add.rectangle(uiPadding - 200, 30, 0, 25, 0xFFD700);
        this.player1BarFill.setOrigin(0, 0.5);
        this.player1InfluenceText = this.add.text(uiPadding, 55, '0/500', { fontSize: '14px', fill: '#ffffff', resolution: 2 }).setOrigin(0.5, 0.5).setDepth(10000);
        this.player1NameText = this.add.text(uiPadding, 75, 'SOLARI', { fontSize: '18px', fill: '#FFD700', fontStyle: 'bold', resolution: 2 }).setOrigin(0.5, 0.5).setDepth(10000);
        
        const p2X = 1280 - uiPadding;
        this.player2BarBg = this.add.rectangle(p2X, 30, 400, 30, 0x333333);
        this.player2BarBg.setOrigin(0.5, 0.5);
        this.player2BarFill = this.add.rectangle(p2X - 200, 30, 0, 25, 0x8B00FF);
        this.player2BarFill.setOrigin(0, 0.5);
        this.player2InfluenceText = this.add.text(p2X, 55, '0/500', { fontSize: '14px', fill: '#ffffff', resolution: 2 }).setOrigin(0.5, 0.5).setDepth(10000);
        this.player2NameText = this.add.text(p2X, 75, 'UMBRAE', { fontSize: '18px', fill: '#8B00FF', fontStyle: 'bold', resolution: 2 }).setOrigin(0.5, 0.5).setDepth(10000);
        
        // Influence map blocks
        this.solariTerritoryBlocks = [];
        this.umbraeTerritoryBlocks = [];
        this.lastSolariInfluenceInt = 0;
        this.lastUmbraeInfluenceInt = 0;
        
        // ===== MOVEMENT SETTINGS =====
        this.playerSpeed = 200;
        this.jumpVelocity = -550; // Match Level 1 jump power
        this.climbSpeed = 200;
        
        // HARDCODED: Store original values for debuff system
        this.basePlayerSpeed = 200;
        this.baseJumpVelocity = -550;
        
        // ===== RISING LAVA MECHANIC =====
        this.lavaRiseStartTime1 = 20; 
        this.lavaRiseActualStart1 = 30; 
        this.lavaRiseStartTime2 = 80; // 1:30 - 10 seconds warning
        this.lavaRiseActualStart2 = 90; // 1:30 (90 seconds) 
        this.lavaRiseWarningDuration = 10; 
        this.lavaRiseDuration = 80; 
        this.lavaRiseTimer = 0;
        this.lavaRising = false;
        this.lavaWarningActive = false;
        this.lavaMessageText = null; 
        this.lavaSurvivalChecked = false; 
        this.lavaEndTime = 0; 
        this.lavaEventNumber = 0; 
        
        this.lavaStartY = this.HARDCODED_GROUND_TOP; // Dynamic ground top
        this.lavaTopY = 0; 
        this.lavaCurrentY = this.HARDCODED_GROUND_TOP;
        this.lava = null;
        this.lavaGlow = null;
        this.lavaParticles = [];
        
        // Lava warning timer text (centered at top)
        this.lavaWarningText = this.add.text(1280 / 2, 50, '', {
            fontSize: '48px',
            fill: '#FF4500',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 4,
            resolution: 2
        }).setOrigin(0.5, 0.5).setDepth(10000).setVisible(false);
        
        // Player debuff flags (for lava damage)
        this.player1LavaDebuff = false;
        this.player2LavaDebuff = false;
        this.player1FellInLava = false;
        this.player2FellInLava = false;
        this.player1Respawned = true;
        this.player2Respawned = true;
        // HARDCODED: Freeze players only while lava message is visible
        this.playersFrozenForLavaMessage = false;
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
        
        // ===== LAVA JUMP ORBS (Strategic placement) =====
        this.lavaOrbs = [];
        const orbPositions = [
            { x: 1550, y:  350},   // Left ascent start
            { x: 1500, y: 600 },  // Right ascent start
            { x: 695, y: 620 },   // Center gap crosser
            { x: 1300, y: 220 },   // Upper left path
            { x: 429, y: 360 },   // Upper right path
            { x: 1120, y: 700 },   // Final summit boost
        ];
        
        orbPositions.forEach((pos, index) => {
            const orbGlow = this.add.circle(pos.x, pos.y, 30, 0xFF6347, 0.3).setDepth(5);
            const orbBody = this.add.circle(pos.x, pos.y, 20, 0xFF4500, 0.9).setDepth(6);
            const orbCore = this.add.circle(pos.x, pos.y, 10, 0xFFD700, 1.0).setDepth(7);
            
            this.tweens.add({
                targets: [orbGlow, orbBody, orbCore],
                y: { from: pos.y - 5, to: pos.y + 5 },
                duration: 1500 + Math.random() * 500,
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut'
            });
            
            const chargeTimerText = this.add.text(pos.x, pos.y - 40, '', {
                fontSize: '16px', fill: '#ffffff', fontStyle: 'bold', stroke: '#000000', strokeThickness: 3, resolution: 2
            }).setOrigin(0.5, 0.5).setDepth(10000).setVisible(false);
            
            this.lavaOrbs.push({
                x: pos.x, y: pos.y, glow: orbGlow, body: orbBody, core: orbCore,
                chargeTimerText: chargeTimerText, isCharged: true, isOnCooldown: false,
                chargeTimer: 0, chargeTime: 5.0, cooldownTimer: 0, cooldownTime: 0.5,
                boostPower: -750, radius: 25, originalColors: { glow: 0xFF6347, body: 0xFF4500, core: 0xFFD700 }
            });
        });

        const romanNumerals = ['I','II','III','IV','V','VI','VII','VIII'];
        const labelOrder = Phaser.Utils.Array.Shuffle(romanNumerals.slice());
        this.orbSequenceIndices = Phaser.Utils.Array.Shuffle([0,1,2,3,4,5]); // Only 6 orbs now
        this.orbSequenceNumerals = this.orbSequenceIndices.map(i => labelOrder[i]);
        this.orbSequenceProgress = { Solari: 0, Umbrae: 0 };
        this.orbSequenceLastTouched = { Solari: null, Umbrae: null };
        this.orbSequenceOwner = null;
        this.orbSequenceCompleted = false;
        this.orbSequenceStarted = false;
        this.orbSequenceStartTime = 120;
        this.orbSequenceBonusRate = 3;
        this.orbSequenceActive = false;
        this.orbSequenceText = null;
        this.lavaOrbs.forEach((orb, i) => {
            const numeral = labelOrder[i];
            orb.romanNumeral = numeral;
            orb.romanText = this.add.text(orb.x, orb.y + 40, numeral, {
                fontSize: '20px', fill: '#FFFFFF', fontStyle: 'bold', stroke: '#000000', strokeThickness: 3, resolution: 2
            }).setOrigin(0.5, 0.5).setDepth(10000);
        });
        
        // ===== PLATFORMS (Ascent Design) =====
        this.platforms = [];
        this.fallingPlatforms = [];
        
        // Generate Magma Platform Texture
        if (!this.textures.exists('magma-platform')) {
            const magmaCanvas = this.textures.createCanvas('magma-platform', 32, 32);
            const ctx = magmaCanvas.context;
            
            // Base Rock (Dark Basalt)
            ctx.fillStyle = '#1A1A1A';
            ctx.fillRect(0, 0, 32, 32);
            
            // Rock chunks (Dark Brown/Red)
            ctx.fillStyle = '#3D1F1F';
            ctx.fillRect(2, 2, 12, 12);
            ctx.fillRect(18, 4, 10, 10);
            ctx.fillRect(4, 18, 14, 10);
            ctx.fillRect(20, 20, 8, 8);
            
            // Lava Cracks (Orange/Red)
            ctx.fillStyle = '#8B0000'; // Dark Red base for cracks
            ctx.fillRect(0, 14, 32, 2);
            ctx.fillRect(14, 0, 2, 32);
            
            ctx.fillStyle = '#FF4500'; // Bright Orange Glow
            ctx.fillRect(0, 15, 32, 1);
            ctx.fillRect(15, 0, 1, 32);
            
            // Hot spots (Yellow)
            ctx.fillStyle = '#FFD700';
            ctx.fillRect(15, 15, 2, 2);
            ctx.fillRect(2, 15, 1, 1);
            ctx.fillRect(15, 2, 1, 1);
            
            magmaCanvas.refresh();
            this.textures.get('magma-platform').setFilter(Phaser.Textures.FilterMode.NEAREST);
        }

        // Generate Drum Platform Texture (Blue version of magma)
        if (!this.textures.exists('drum-platform')) {
            const drumCanvas = this.textures.createCanvas('drum-platform', 32, 32);
            const ctx = drumCanvas.context;
            
            ctx.fillStyle = '#1A1A1A';
            ctx.fillRect(0, 0, 32, 32);
            
            ctx.fillStyle = '#1F2D3D'; // Dark Blue-Grey Rock
            ctx.fillRect(2, 2, 12, 12);
            ctx.fillRect(18, 4, 10, 10);
            ctx.fillRect(4, 18, 14, 10);
            ctx.fillRect(20, 20, 8, 8);
            
            ctx.fillStyle = '#00008B'; // Dark Blue cracks
            ctx.fillRect(0, 14, 32, 2);
            ctx.fillRect(14, 0, 2, 32);
            
            ctx.fillStyle = '#0066CC'; // Electric Blue Glow
            ctx.fillRect(0, 15, 32, 1);
            ctx.fillRect(15, 0, 1, 32);
            
            ctx.fillStyle = '#00FFFF'; // Cyan hot spots
            ctx.fillRect(15, 15, 2, 2);
            
            drumCanvas.refresh();
            this.textures.get('drum-platform').setFilter(Phaser.Textures.FilterMode.NEAREST);
        }

        // Generate Falling Magma Platform Texture (Intense "Level 5" Danger)
        if (!this.textures.exists('falling-magma-platform')) {
            const fallingCanvas = this.textures.createCanvas('falling-magma-platform', 32, 32);
            const ctx = fallingCanvas.context;
            
            // 1. Base (Pitch Black scorched rock for max contrast)
            ctx.fillStyle = '#000000';
            ctx.fillRect(0, 0, 32, 32);
            
            // 2. Deep Under-Glow (Dark Red)
            ctx.fillStyle = '#660000';
            ctx.fillRect(2, 2, 28, 28);
            
            // 3. Primary Wide Cracks (Bright Orange-Red)
            ctx.fillStyle = '#FF4500';
            // Thick jagged horizontal crack
            ctx.fillRect(0, 12, 32, 4);
            // Thick jagged vertical crack
            ctx.fillRect(14, 0, 4, 32);
            
            // 4. Secondary Sharp Cracks (Bright Orange)
            ctx.fillStyle = '#FF8C00';
            ctx.fillRect(0, 13, 32, 2);
            ctx.fillRect(15, 0, 2, 32);
            // Diagonal shatters
            ctx.beginPath();
            ctx.strokeStyle = '#FF8C00';
            ctx.lineWidth = 2;
            ctx.moveTo(0, 0); ctx.lineTo(14, 12);
            ctx.moveTo(32, 0); ctx.lineTo(18, 12);
            ctx.moveTo(0, 32); ctx.lineTo(14, 16);
            ctx.moveTo(32, 32); ctx.lineTo(18, 16);
            ctx.stroke();
            
            // 5. INTENSE CORE GLOW (Yellow/White) - This makes it "Stand Out"
            ctx.fillStyle = '#FFD700'; // Gold/Yellow
            // Intersection glow
            ctx.fillRect(13, 11, 6, 6);
            // Small highlight cracks
            ctx.fillStyle = '#FFFF00'; 
            ctx.fillRect(0, 14, 32, 1);
            ctx.fillRect(15, 0, 1, 32);
            
            // 6. HOTTEST SPOTS (Pure White) - Level 5 Danger
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(15, 13, 2, 2); // Center core
            ctx.fillRect(4, 4, 1, 1);
            ctx.fillRect(27, 27, 1, 1);
            ctx.fillRect(27, 4, 1, 1);
            ctx.fillRect(4, 27, 1, 1);
            
            // 7. Surface Embers (Random bright pixels)
            ctx.fillStyle = '#FF4500';
            ctx.fillRect(8, 6, 2, 2);
            ctx.fillRect(22, 24, 2, 2);
            
            fallingCanvas.refresh();
            this.textures.get('falling-magma-platform').setFilter(Phaser.Textures.FilterMode.NEAREST);
        }

        // Generate Sci-Fi Pressure Plate Texture for Fault Lines
        if (!this.textures.exists('sci-fi-plate')) {
            // Updated to 50x20 to perfectly fit the platform height (20) and width (150/200)
            const plateCanvas = this.textures.createCanvas('sci-fi-plate', 50, 20);
            const ctx = plateCanvas.context;
            
            // 1. Outer Casing (Polished Steel Grey instead of Black)
            ctx.fillStyle = '#555555';
            ctx.fillRect(0, 0, 50, 20);
            
            // 2. Industrial Bevel (Lighter highlight on top edge for 3D effect)
            ctx.fillStyle = '#888888';
            ctx.fillRect(0, 0, 50, 1);
            
            // 3. Metallic Frame (Dark Grey)
            ctx.fillStyle = '#333333';
            ctx.fillRect(1, 1, 48, 18);
            
            // 4. Blue Structural Trim (Deep Blue)
            ctx.fillStyle = '#004488';
            ctx.fillRect(3, 3, 44, 14);
            
            // 4. Inner Recessed Plate (Darker Blue-Grey)
            ctx.fillStyle = '#1A222E';
            ctx.fillRect(5, 5, 40, 10);
            
            // 5. Glowing Pads (Light Blue/Cyan) - Perfectly Symmetrical
            // We'll place three distinct square pads
            ctx.fillStyle = '#00FFFF';
            ctx.fillRect(10, 7, 6, 6); // Left pad
            ctx.fillRect(22, 7, 6, 6); // Middle pad
            ctx.fillRect(34, 7, 6, 6); // Right pad
            
            // 6. White Power Cores (Center of each pad)
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(12, 9, 2, 2);
            ctx.fillRect(24, 9, 2, 2);
            ctx.fillRect(36, 9, 2, 2);
            
            // 7. Symmetrical Detail Dots (Symmetry check)
            ctx.fillStyle = '#0088FF';
            ctx.fillRect(6, 6, 2, 2);   // Top-Left detail
            ctx.fillRect(42, 6, 2, 2);  // Top-Right detail
            ctx.fillRect(6, 12, 2, 2);  // Bottom-Left detail
            ctx.fillRect(42, 12, 2, 2); // Bottom-Right detail
            
            plateCanvas.refresh();
            this.textures.get('sci-fi-plate').setFilter(Phaser.Textures.FilterMode.NEAREST);
        }

        // ===== GROUND =====
        // Manually set your ground dimensions and position here
        const groundX = 900;
        const groundY = 1050;
        const groundWidth = 2690;
        const groundHeight = 250;
        
        // Ground using Magma Texture
        const ground = this.add.tileSprite(groundX, groundY, groundWidth, groundHeight, 'magma-platform');
        ground.setOrigin(0.5, 0.5).setDepth(1).setTileScale(1, 1);
        this.physics.add.existing(ground, true);
        this.platforms.push(ground);
        
        // Logical constants for gameplay (auto-calculated from your values above)
        this.HARDCODED_GROUND_TOP = groundY - (groundHeight / 2);
        this.groundTop = this.HARDCODED_GROUND_TOP;
        this.HARDCODED_PLAYER_HALF_HEIGHT = 25;
        this.scalesActive = false;
        this.previousScalesActive = false;
        this.scales = [];
        this.solariScaleCount = 0;
        this.umbraeScaleCount = 0;
        
        // Create lava (adjusted for new ground)
        // HARDCODED: Lava depth must be higher than faultline indicators (10000) and roman numerals (10000) to cover them
        this.time.delayedCall(100, () => {
            const lavaStartY = this.HARDCODED_GROUND_TOP; 
            this.lavaStartY = lavaStartY;
            this.lavaCurrentY = lavaStartY;
            this.lava = this.add.rectangle(1280/2, lavaStartY, 3500, 0, 0xFF4500).setOrigin(0.5, 1.0).setDepth(10001).setVisible(false);
            this.lavaGlow = this.add.rectangle(1280/2, lavaStartY, 3500, 50, 0xFF6347).setOrigin(0.5, 0.5).setDepth(10002).setVisible(false);
            this.lavaParticles = [];
            for (let i = 0; i < 20; i++) {
                const particle = this.add.circle(100 + (i * 60), lavaStartY - 100, 8, 0xFFD700, 1.0).setDepth(10003).setVisible(false);
                this.lavaParticles.push(particle);
            }
        });
        
        // New Parkour Platform Data (Ascent path)
        const platformData = [
            // Tier 1 (Low)
            { x: 1950, y: 830, w: 150, h: 20, falling: false },
            { x: 1700, y: 747, w: 150, h: 20, falling: false },
            { x: 1975, y: 630, w: 225, h: 20, falling: false }, // Central start
            
            // Tier 2 (Mid-Low)
            { x: 1837, y: 250, w: 120, h: 20, falling: true },
            { x: 1837, y: 250, w: 120, h: 20, falling: true },

            
            // Tier 3 (Mid-High)
            { x: 1132, y: 350, w: 130, h: 20, falling: false },
            { x: 911, y: 725, w: 120, h: 20, falling: true },
            { x: 1350, y: 725, w: 120, h: 20, falling: true },
            
            // Tier 4 (High)
            { x: 550, y: 200, w: 120, h: 20, falling: false },
            
            // Tier 5 (Peak)
            { x: 150, y: 605, w: 120, h: 20, falling: false },

            // Additional Manual Platforms (Move these manually)
            { x: 550, y: 830, w: 120, h: 20, falling: false },
            { x: 1120, y: 830, w: 120, h: 20, falling: false },
            { x: 980, y: 550, w: 120, h: 20, falling: false },
            { x: 1280, y: 550, w: 120, h: 20, falling: false },
            { x: 1130, y: 450, w: 310, h: 20, falling: false },
            { x: 325, y: 200, w: 120, h: 20, falling: false },
            { x: 325, y: 725, w: 120, h: 20, falling: true },
            { x: 850, y: 500, w: 120, h: 20, falling: true },
            { x: 850, y: 200, w: 120, h: 20, falling: true },



            // DRUM STEEL PLATE PLATFORMS (Move these manually)
            { x: 1135, y: 125, w: 150, h: 20, falling: false, isDrum: true },
            { x: 1700, y: 530, w: 150, h: 20, falling: false, isDrum: true },
            { x: 425, y: 500, w: 150, h: 20, falling: false, isDrum: true },
        ];
        
        platformData.forEach((data) => {
            let platform;
            const isDrum = data.isDrum || false;
            
            if (data.falling) {
                // Falling platforms use the new unstable fiery magma texture
                platform = this.add.tileSprite(data.x, data.y, data.w, data.h, 'falling-magma-platform').setOrigin(0.5, 0.5);
            } else if (isDrum) {
                // Apply Sci-Fi Pressure Plate pixel art to drum platforms
                platform = this.add.tileSprite(data.x, data.y, data.w, data.h, 'sci-fi-plate').setOrigin(0.5, 0.5);
            } else {
                // Other static platforms use Magma texture
                platform = this.add.tileSprite(data.x, data.y, data.w, data.h, 'magma-platform').setOrigin(0.5, 0.5);
            }
            
            this.physics.add.existing(platform, true);
            this.platforms.push(platform);
            
            if (data.falling) {
                platform.isFalling = false;
                platform.fallTimer = 0;
                platform.originalX = data.x;
                platform.originalY = data.y;
                platform.playersOnPlatform = new Set();
                platform.colliders = [];
                this.fallingPlatforms.push(platform);
            }
        });
        
        // ===== LADDERS (Recovery paths) =====
        this.vines = [];
        
        // Generate procedural pixel art ladder texture if it doesn't exist
        if (!this.textures.exists('ladder-pixel')) {
            // Increased size to 32x32 and adjusted drawing for chunkier, more pixelated look
            const ladderCanvas = this.textures.createCanvas('ladder-pixel', 32, 32);
            const ctx = ladderCanvas.context;
            
            // Background (transparent)
            ctx.clearRect(0, 0, 32, 32);
            
            // Rails (Brownish-red) - Thicker rails for "chunky" pixel look
            ctx.fillStyle = '#5D2906'; // Dark brown base
            ctx.fillRect(0, 0, 6, 32);  // Left rail (6px wide)
            ctx.fillRect(26, 0, 6, 32); // Right rail (6px wide)
            
            // Rail highlights (Lighter brown) - 2px wide highlights
            ctx.fillStyle = '#8B4513';
            ctx.fillRect(2, 0, 2, 32);
            ctx.fillRect(28, 0, 2, 32);
            
            // Rungs (Brown with red heat) - Chunkier 8px high rungs
            ctx.fillStyle = '#5D2906';
            ctx.fillRect(6, 12, 20, 8); // Rung base
            
            // Heat highlights on rungs - Increased detail blocks
            ctx.fillStyle = '#FF4500'; // OrangeRed heat
            ctx.fillRect(8, 14, 16, 4);
            ctx.fillStyle = '#FF0000'; // Pure red hot spot center
            ctx.fillRect(12, 15, 8, 2);
            
            ladderCanvas.refresh();
            
            // Ensure pixel art clarity
            this.textures.get('ladder-pixel').setFilter(Phaser.Textures.FilterMode.NEAREST);
        }

        const ladderData = [
            { x: 105, y: 407, w: 32, h: 380 },
            { x: 2072, y: 414, w: 32, h: 410 },
            { x: 320, y: 91, w: 32, h: 200 },
            { x: 1837, y: 93, w: 32, h: 300 }
        ];

        ladderData.forEach(data => {
            const ladder = this.add.tileSprite(data.x, data.y, data.w, data.h, 'ladder-pixel').setOrigin(0.5, 0.5);
            this.vines.push(ladder);
        });
        
        // ===== DRUM PLATES (Mechanic) =====
        // Connect the mechanics to the new platform positions
        const drumPlateTargets = platformData
            .filter(d => d.isDrum)
            .map(d => ({ x: d.x, y: d.y }));
        
        this.scales = [];
        drumPlateTargets.forEach((pos, index) => {
            const x = pos.x;
            const baseY = pos.y - 10;
            const fillMax = 60;
            
            const base = this.add.rectangle(x, baseY + 10, 30, 10, 0x444444).setOrigin(0.5, 1.0).setDepth(3);
            const tubeBg = this.add.rectangle(x, baseY, 20, fillMax, 0x222222).setOrigin(0.5, 1.0).setDepth(3);
            const tubeFill = this.add.rectangle(x, baseY, 16, 0, 0x888888).setOrigin(0.5, 0.0).setDepth(4);
            const indicator = this.add.text(x, baseY - fillMax - 20, '✕', {
                fontSize: '28px', fill: '#FF0000', fontStyle: 'bold', resolution: 2
            }).setOrigin(0.5, 0.5).setDepth(10000);
            
            this.scales.push({
                index, base, tubeBg, tubeFill, indicator, owner: null,
                capturePlayer: null, captureProgress: 0, fillMaxHeight: fillMax, fillBottomY: baseY
            });
        });
        
        this.faultlinePlates = [];
        drumPlateTargets.forEach(target => {
            const plat = this.platforms.find(p => Math.abs(p.x - target.x) < 1 && Math.abs(p.y - target.y) < 1);
            // Push the result even if null to keep array indices matched with drumPlateTargets/scales
            this.faultlinePlates.push(plat ? { body: plat } : null);
        });
        
        // ===== PLAYERS =====
        const spawnY = 900; 
        
        this.player1 = this.add.rectangle(400, spawnY, 50, 50, 0xFFD700).setOrigin(0.5, 0.5);
        this.physics.add.existing(this.player1);
        // REMOVED setCollideWorldBounds(true) - This was another "invisible barrier" forcing players up
        this.player1.body.setSize(50, 50).setGravityY(this.gravity);
        this.player1.setDepth(20).faction = 'Solari';
        this.player1.climbing = false;
        this.player1.onVine = null;
        this.player1.latchedToVine = false;
        this.player1.wWasDown = false;
        this.player1.vineIndicator = null;
        this.player1.vineLatchCooldown = 0;
        this.player1.vineClimbSpeed = this.climbSpeed;
        
        this.player2 = this.add.rectangle(880, spawnY, 50, 50, 0x8B00FF).setOrigin(0.5, 0.5);
        this.physics.add.existing(this.player2);
        // REMOVED setCollideWorldBounds(true) - This was another "invisible barrier" forcing players up
        this.player2.body.setSize(50, 50).setGravityY(this.gravity);
        this.player2.setDepth(20).faction = 'Umbrae';
        this.player2.climbing = false;
        this.player2.onVine = null;
        this.player2.latchedToVine = false;
        this.player2.upWasDown = false;
        this.player2.vineIndicator = null;
        this.player2.vineLatchCooldown = 0;
        this.player2.vineClimbSpeed = this.climbSpeed;
        
        this.HARDCODED_PLAYER_SPAWN_Y = spawnY;
        
        this.platforms.forEach(platform => {
            const collider1 = this.physics.add.collider(this.player1, platform);
            const collider2 = this.physics.add.collider(this.player2, platform);
            if (platform.colliders) platform.colliders.push(collider1, collider2);
        });
        
        // Repeatedly force player to ground at start to prevent falling through
        for (let t of [0, 10, 50, 100, 200]) {
            this.time.delayedCall(t, () => {
                this.player1.y = this.HARDCODED_PLAYER_SPAWN_Y;
                this.player2.y = this.HARDCODED_PLAYER_SPAWN_Y;
                if (t > 10) {
                    this.player1.body.setVelocityY(0);
                    this.player2.body.setVelocityY(0);
                }
            });
        }
        
        // ===== INPUT =====
        this.cursorsWASD = this.input.keyboard.addKeys('W,S,A,D');
        this.wKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        this.sKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        this.cursorsArrows = this.input.keyboard.createCursorKeys();
        this.upKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
        this.downKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
        
        // ===== LEVEL TIMER =====
        this.levelTime = 0;
        this.levelDuration = 300;
        this.timeText = this.add.text(1280 / 2, 50, '5:00', { fontSize: '24px', fill: '#ffffff', resolution: 2 }).setOrigin(0.5, 0.5).setDepth(10000);
        
        // ===== INFLUENCE SYSTEM =====
        this.influenceRate = 0;
        this.playersFrozen = true;
        this.influencePenalty = null;
        this.influenceReward = null;
        this.startCountdown();
    }

    startCountdown() {
        const countdownValues = ['3', '2', '1', 'GO!'];
        let currentIndex = 0;

        const showNext = () => {
            if (currentIndex >= countdownValues.length) {
                this.playersFrozen = false;
                return;
            }

            const value = countdownValues[currentIndex];
            
            // Center of the ACTUAL screen (browser window)
            const centerX = this.scale.width / 2;
            const centerY = this.scale.height / 2;

            const text = this.add.text(centerX, centerY, value, {
                fontSize: '120px', // Uniform size for numbers and GO!
                fill: '#ffff00',
                fontStyle: 'bold',
                stroke: '#000000',
                strokeThickness: 12,
                resolution: 2
            }).setOrigin(0.5).setScale(0).setDepth(100000).setScrollFactor(0);

            // Level 5 Danger Animation: Scale from 0 to massive, then fade
            this.tweens.add({
                targets: text,
                scale: 2.5, // Uniform scale for numbers and GO!
                alpha: 1, // Fully opaque yellow
                duration: 800,
                ease: 'Back.easeOut',
                onComplete: () => {
                    this.tweens.add({
                        targets: text,
                        alpha: 0,
                        scale: 3.5,
                        duration: 200,
                        onComplete: () => {
                            text.destroy();
                            currentIndex++;
                            showNext();
                        }
                    });
                }
            });
        };

        showNext();
    }

    centerGameplayCamera() {
        const worldWidth = 1280;
        const worldHeight = 1200; // Match new ground height
        const zoom = this.cameras.main ? (this.cameras.main.zoom || 1) : 1;
        const viewWidth = this.scale.width / zoom;
        const viewHeight = this.scale.height / zoom;
        const padX = Math.max(0, (viewWidth - worldWidth) / 2);
        const padY = Math.max(0, (viewHeight - worldHeight) / 2);

        this.cameras.main.setBounds(-padX, -padY, worldWidth + padX * 2, worldHeight + padY * 2);
        this.cameras.main.centerOn(worldWidth / 2, worldHeight / 2);
    }

    update(time, delta) {
        if (this.playersFrozen) {
            // Stop movement during countdown
            if (this.player1 && this.player1.body) this.player1.body.setVelocity(0, 0);
            if (this.player2 && this.player2.body) this.player2.body.setVelocity(0, 0);
            return;
        }
        const dt = delta / 1000;
        
        // HARDCODED: Freeze players while lava message is visible - keep them locked at spawn position
        if (this.playersFrozenForLavaMessage) {
            // Force players to stay at spawn position while message is visible
            if (this.player1 && this.player1SpawnX !== undefined && this.player1SpawnY !== undefined) {
                this.player1.x = this.player1SpawnX;
                this.player1.y = this.player1SpawnY;
                if (this.player1.body) {
                    this.player1.body.setVelocity(0, 0);
                }
            }
            if (this.player2 && this.player2SpawnX !== undefined && this.player2SpawnY !== undefined) {
                this.player2.x = this.player2SpawnX;
                this.player2.y = this.player2SpawnY;
                if (this.player2.body) {
                    this.player2.body.setVelocity(0, 0);
                }
            }
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
        
        // HARDCODED: Skip ground correction if players are frozen for message or for 0.5 seconds after lava ends
        const timeSinceLavaEnd = this.lavaEndTime > 0 ? this.levelTime - this.lavaEndTime : 999;
        const skipGroundCorrection = this.playersFrozenForLavaMessage || (this.lavaSurvivalChecked && timeSinceLavaEnd < 0.5);
        
        // Only force players to ground position if they're actually on the ground platform
        // HARDCODED: Skip ground correction for players who have fallen into lava
        if (!skipGroundCorrection) {
            const groundTop = this.groundTop;
            
            // Only check player 1 if they haven't fallen into lava
            if (!this.player1FellInLava && this.player1 && this.player1.body) {
                const playerBottom1 = this.player1.y + this.HARDCODED_PLAYER_HALF_HEIGHT;
                const isOnGround1 = this.player1.body.touching.down && Math.abs(playerBottom1 - groundTop) < 50;
                
                // Only correct position if player is actually on the ground AND not falling
                // This prevents forcing player into ground when falling from high heights
                if (isOnGround1 && Math.abs(this.player1.body.velocity.y) < 10 && this.player1OrbBoostTimer === 0) {
                    const expectedY = groundTop - this.HARDCODED_PLAYER_HALF_HEIGHT;
                    // Only correct if player is very close to expected position (within 2 pixels)
                    if (Math.abs(this.player1.y - expectedY) <= 2) {
                        this.player1.y = expectedY;
                    }
                }
            }
            
            // Only check player 2 if they haven't fallen into lava
            if (!this.player2FellInLava && this.player2 && this.player2.body) {
                const playerBottom2 = this.player2.y + this.HARDCODED_PLAYER_HALF_HEIGHT;
                const isOnGround2 = this.player2.body.touching.down && Math.abs(playerBottom2 - groundTop) < 50;
                
                // Only correct position if player is actually on the ground AND not falling
                // This prevents forcing player into ground when falling from high heights
                if (isOnGround2 && Math.abs(this.player2.body.velocity.y) < 10 && this.player2OrbBoostTimer === 0) {
                    const expectedY = groundTop - this.HARDCODED_PLAYER_HALF_HEIGHT;
                    // Only correct if player is very close to expected position (within 2 pixels)
                    if (Math.abs(this.player2.y - expectedY) <= 2) {
                        this.player2.y = expectedY;
                    }
                }
            }
        }
        
        this.levelTime += dt;
        const remaining = Math.max(0, this.levelDuration - this.levelTime);
        const minutes = Math.floor(remaining / 60);
        const seconds = Math.floor(remaining % 60);
        this.timeText.setText(`${minutes}:${seconds.toString().padStart(2, '0')}`);
        
        if (!this.orbSequenceStarted && this.levelTime >= this.orbSequenceStartTime) {
            this.startOrbSequence();
        }
        
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
        this.updateOrbSequence(dt);
        
        // HARDCODED: Only check climbing and update players if they haven't fallen into lava and aren't frozen for message
        if (!this.player1FellInLava && !this.playersFrozenForLavaMessage) {
            this.checkClimbing(this.player1);
        }
        if (!this.player2FellInLava && !this.playersFrozenForLavaMessage) {
            this.checkClimbing(this.player2);
        }
        
        if (!this.playersFrozen && !this.playersFrozenForLavaMessage) {
            // HARDCODED: Only update players if they haven't fallen into lava and aren't frozen for message
            if (!this.player1FellInLava) {
                this.updatePlayer(this.player1, { up: this.wKey, down: this.sKey, left: this.cursorsWASD.A, right: this.cursorsWASD.D });
            }
            if (!this.player2FellInLava) {
                this.updatePlayer(this.player2, { up: this.upKey, down: this.downKey, left: this.cursorsArrows.left, right: this.cursorsArrows.right });
            }
        } else {
            if (this.player1 && this.player1.body && (!this.player1FellInLava || this.playersFrozenForLavaMessage)) {
                this.player1.body.setVelocity(0, 0);
            }
            if (this.player2 && this.player2.body && (!this.player2FellInLava || this.playersFrozenForLavaMessage)) {
                this.player2.body.setVelocity(0, 0);
            }
        }
        
        this.updateFaultlinePuzzle(dt);
        this.updateInfluence(dt);
    }

    createBackground() {
        this.backgroundLayer = this.add.layer();
        this.backgroundLayer.setDepth(-100);
        const background = this.add.image(0, 0, 'volcano');
        background.setOrigin(0.5, 0.5);
        background.setDepth(-100);
        background.setScrollFactor(0, 0);
        const texture = this.textures.get('volcano');
        if (texture) {
            texture.setFilter(Phaser.Textures.FilterMode.NEAREST);
        }
        this.backgroundLayer.add(background);
        this.volcanoBackground = background;
        this.resizeBackground();
        this.scale.on('resize', this.resizeBackground, this);
    }

    resizeBackground() {
        if (!this.volcanoBackground) return;
        const width = this.scale.width;
        const height = this.scale.height;
        const zoom = this.cameras.main ? (this.cameras.main.zoom || 1) : 1;
        
        // Calculate the world dimensions that are currently visible
        const visibleWorldWidth = width / zoom;
        const visibleWorldHeight = height / zoom;
        
        // Get original dimensions of the image (396x224)
        const bgWidth = this.volcanoBackground.width;
        const bgHeight = this.volcanoBackground.height;
        
        // Log required debug info
        console.log(`Camera viewport size: ${width}x${height}`);
        console.log(`Background bounds before scaling: ${bgWidth}x${bgHeight}`);
        
        // Calculate the 'Cover' scale against the VISIBLE WORLD area
        const scaleX = visibleWorldWidth / bgWidth;
        const scaleY = visibleWorldHeight / bgHeight;
        const scale = Math.max(scaleX, scaleY);
        
        console.log(`Background scale applied: ${scale}`);
        
        // Apply scale
        this.volcanoBackground.setScale(scale);
        
        // Center the background in the world (where the gameplay is)
        this.volcanoBackground.setPosition(this.cameras.main.centerX, this.cameras.main.centerY);
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
                        fontStyle: 'bold',
                        resolution: 2
                    }).setOrigin(0.5, 0.5).setDepth(10000);
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
                        resolution: 2,
                        alpha: 1.0 - chargeProgress // Fade out as it charges
                    }).setOrigin(0.5, 0.5).setDepth(10000);
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
                
                // Intense Shake Effect (Level 5 Danger)
                platform.x = platform.originalX + (Math.random() - 0.5) * 4;
                platform.y = platform.originalY + (Math.random() - 0.5) * 4;
                
                if (platform.fallTimer > 0.5) {
                    platform.setTint(0xFF0000); // Warning tint
                    // Faster shake
                    platform.x = platform.originalX + (Math.random() - 0.5) * 8;
                    platform.y = platform.originalY + (Math.random() - 0.5) * 8;
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
                    platform.setTint(0x8B0000); // Falling tint
                }
            } else if (platform.playersOnPlatform.size === 0 && platform.fallTimer > 0) {
                platform.fallTimer = 0;
                platform.clearTint();
                // Reset position after shaking
                platform.x = platform.originalX;
                platform.y = platform.originalY;
            }
        });
    }
    
    updatePlayer(player, keys) {
        player.body.setAllowGravity(true);
        const upPressed = Phaser.Input.Keyboard.JustDown(keys.up);
        const upHeld = keys.up.isDown;
        const downPressed = keys.down ? Phaser.Input.Keyboard.JustDown(keys.down) : false;
        const leftPressed = Phaser.Input.Keyboard.JustDown(keys.left);
        const rightPressed = Phaser.Input.Keyboard.JustDown(keys.right);
        const currentSpeed = this.playerSpeed;
        const currentJump = this.jumpVelocity;
        
        if (upPressed && !player.latchedToVine && player.climbing && player.onVine) {
            player.latchedToVine = true;
            player.vineLatchCooldown = 0.15;
            player.body.setVelocityY(0);
            player.body.setVelocityX(0);
        }
        
        if (player.latchedToVine && player.onVine) {
            const vine = player.onVine;
            const vineTop = vine.getTopCenter().y;
            const vineBottom = vine.getBottomCenter().y;
            const playerHalfHeight = this.HARDCODED_PLAYER_HALF_HEIGHT;
            
            player.x = vine.x;
            player.body.setVelocityX(0);
            
            if (player.vineIndicator) {
                player.vineIndicator.setVisible(false);
            }
            
            if (player.vineLatchCooldown > 0) {
                player.vineLatchCooldown -= 1 / 60;
                if (player.vineLatchCooldown < 0) {
                    player.vineLatchCooldown = 0;
                }
            }
            
            if (downPressed) {
                player.latchedToVine = false;
                player.climbing = false;
                player.onVine = null;
                player.body.setAllowGravity(true);
                player.body.setGravityY(this.gravity);
                if (player.wWasDown !== undefined) player.wWasDown = false;
                if (player.upWasDown !== undefined) player.upWasDown = false;
                player.vineLatchCooldown = 0;
            } else {
                const upAndLeft = (upPressed && keys.left.isDown) || (upHeld && leftPressed);
                const upAndRight = (upPressed && keys.right.isDown) || (upHeld && rightPressed);
                
                if ((upAndLeft || upAndRight) && player.vineLatchCooldown <= 0) {
                    player.latchedToVine = false;
                    player.climbing = false;
                    player.onVine = null;
                    player.body.setAllowGravity(true);
                    player.body.setGravityY(this.gravity);
                    player.body.setVelocityY(currentJump);
                    if (upAndLeft || keys.left.isDown) {
                        player.body.setVelocityX(-200);
                    } else if (upAndRight || keys.right.isDown) {
                        player.body.setVelocityX(200);
                    }
                    if (player.wWasDown !== undefined) player.wWasDown = false;
                    if (player.upWasDown !== undefined) player.upWasDown = false;
                } else if (upHeld || upPressed) {
                    player.body.setGravityY(0);
                    player.body.setAllowGravity(false);
                    player.body.setVelocityY(-(player.vineClimbSpeed || this.climbSpeed));
                    if (player.y <= vineTop + playerHalfHeight) {
                        player.y = vineTop + playerHalfHeight;
                        player.body.setVelocityY(0);
                    }
                    if (player.wWasDown !== undefined) player.wWasDown = true;
                    if (player.upWasDown !== undefined) player.upWasDown = true;
                } else {
                    player.body.setVelocityY(0);
                    player.body.setAllowGravity(true);
                    player.body.setGravityY(50);
                    if (player.y >= vineBottom - playerHalfHeight) {
                        player.y = vineBottom - playerHalfHeight;
                        player.body.setVelocityY(0);
                        player.body.setGravityY(0);
                        player.body.setAllowGravity(false);
                    }
                }
            }
        } else {
            if (player.wWasDown !== undefined) player.wWasDown = false;
            if (player.upWasDown !== undefined) player.upWasDown = false;
            
            player.body.setVelocityX(0);
            if (keys.left.isDown) {
                player.body.setVelocityX(-currentSpeed);
            } else if (keys.right.isDown) {
                player.body.setVelocityX(currentSpeed);
            }
            
            player.body.setGravityY(this.gravity);
            
            if (upPressed && player.body.touching.down) {
                player.body.setVelocityY(currentJump);
            }
        }
    }
    
    checkClimbing(player) {
        if (player.latchedToVine && player.onVine) {
            return;
        }
        
        let nearVine = false;
        let closestVine = null;
        let minDist = Infinity;
        
        if (!this.vines || !this.vines.length) {
            player.climbing = false;
            player.onVine = null;
            if (player.vineIndicator) {
                player.vineIndicator.setVisible(false);
            }
            return;
        }
        
        this.vines.forEach(vine => {
            const dist = Math.abs(player.x - vine.x);
            const vineTop = vine.getTopCenter().y;
            const vineBottom = vine.getBottomCenter().y;
            const withinVineBounds = player.y >= vineTop - 30 && player.y <= vineBottom + 30;
            
            if (dist < 50 && dist < minDist && withinVineBounds) {
                minDist = dist;
                closestVine = vine;
                nearVine = true;
            }
        });
        
        if (nearVine && closestVine) {
            player.climbing = true;
            player.onVine = closestVine;
            
            if (!player.vineIndicator) {
                const indicatorGroup = this.add.container(player.x, player.y - 50);
                const circle = this.add.circle(0, 0, 25, 0xffffff, 0.9);
                circle.setStrokeStyle(3, 0x000000);
                const keyText = player.faction === 'Solari' 
                    ? this.add.text(0, 0, 'W', { fontSize: '24px', fill: '#000000', fontStyle: 'bold' })
                    : this.add.text(0, -2, '↑', { fontSize: '24px', fill: '#000000', fontStyle: 'bold' });
                keyText.setOrigin(0.5, 0.5);
                indicatorGroup.add([circle, keyText]);
                player.vineIndicator = indicatorGroup;
            } else {
                player.vineIndicator.setPosition(player.x, player.y - 50);
                player.vineIndicator.setVisible(true);
            }
        } else {
            player.climbing = false;
            player.onVine = null;
            if (player.vineIndicator) {
                player.vineIndicator.setVisible(false);
            }
        }
    }
    
    startOrbSequence() {
        this.orbSequenceStarted = true;
        this.orbSequenceActive = true;
        if (!this.lavaOrbs || !this.lavaOrbs.length) {
            return;
        }
        const sequenceText = this.orbSequenceNumerals.join(' → ');
        const lore = 'The lava orbs whisper an order.\nFollow the Roman numerals:\n' + sequenceText;
        this.orbSequenceText = this.add.text(640, 200, lore, {
            fontSize: '20px',
            fill: '#FFFFFF',
            fontStyle: 'bold',
            align: 'center',
            stroke: '#000000',
            strokeThickness: 4,
            wordWrap: { width: 900 },
            resolution: 2
        }).setOrigin(0.5, 0.5).setDepth(10000);
    }
    
    updateOrbSequence(dt) {
        if (!this.orbSequenceActive || this.orbSequenceCompleted) {
            return;
        }
        if (!this.lavaOrbs || !this.lavaOrbs.length || !this.orbSequenceIndices || !this.orbSequenceNumerals) {
            return;
        }
        
        const handlePlayer = (player, key) => {
            if (!player || !player.body) return;
            
            let progress = this.orbSequenceProgress[key];
            let lastTouched = this.orbSequenceLastTouched[key];
            let anyTouch = false;
            const sequence = this.orbSequenceIndices;
            
            for (let i = 0; i < this.lavaOrbs.length; i++) {
                const orb = this.lavaOrbs[i];
                const dist = Phaser.Math.Distance.Between(player.x, player.y, orb.x, orb.y);
                const radius = orb.radius || 25;
                const touching = dist < radius;
                
                if (touching) {
                    anyTouch = true;
                    if (lastTouched === i) {
                        continue;
                    }
                    const expectedIndex = sequence[progress];
                    if (i === expectedIndex) {
                        progress += 1;
                        lastTouched = i;
                        if (progress >= sequence.length && !this.orbSequenceCompleted) {
                            this.orbSequenceCompleted = true;
                            this.orbSequenceOwner = key;
                            this.orbSequenceActive = false;
                            const winnerName = key === 'Solari' ? 'SOLARI' : 'UMBRAE';
                            const extra = '\n' + winnerName + ' mastered the orbs (+3 influence/sec).';
                            if (this.orbSequenceText) {
                                this.orbSequenceText.setText(this.orbSequenceText.text + extra);
                            } else {
                                this.orbSequenceText = this.add.text(640, 200, winnerName + ' mastered the orbs (+3 influence/sec).', {
                                    fontSize: '24px',
                                    fill: '#FFFFFF',
                                    fontStyle: 'bold',
                                    align: 'center',
                                    stroke: '#000000',
                                    strokeThickness: 4,
                                    wordWrap: { width: 900 },
                                    resolution: 2
                                }).setOrigin(0.5, 0.5).setDepth(10000);
                            }
                            break;
                        }
                    } else {
                        const firstIndex = sequence[0];
                        if (i === firstIndex) {
                            progress = 1;
                            lastTouched = i;
                        } else {
                            progress = 0;
                            lastTouched = i;
                        }
                    }
                }
            }
            
            if (!anyTouch) {
                lastTouched = null;
            }
            
            this.orbSequenceProgress[key] = progress;
            this.orbSequenceLastTouched[key] = lastTouched;
        };
        
        handlePlayer(this.player1, 'Solari');
        if (!this.orbSequenceCompleted) {
            handlePlayer(this.player2, 'Umbrae');
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
                this.player1LavaDebuff = false;
                this.player2LavaDebuff = false;
                this.player1FellInLava = false;
                this.player2FellInLava = false;
                this.player1Respawned = true;
                this.player2Respawned = true;
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
                this.player1LavaDebuff = false;
                this.player2LavaDebuff = false;
                this.player1FellInLava = false;
                this.player2FellInLava = false;
                this.player1Respawned = true;
                this.player2Respawned = true;
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
            // After lava starts rising, only show if event is active
            if (!this.lavaSurvivalChecked) {
                if (this.lava) {
                    this.lava.setVisible(true);
                    this.lava.setAlpha(1.0);
                    this.lava.setDepth(10001); // HARDCODED: Higher than indicators (10000) to cover them
                } else {
                    // HARDCODED: Create lava if it doesn't exist (fallback)
                    const lavaStartY = this.HARDCODED_GROUND_TOP;
                    this.lava = this.add.rectangle(640, lavaStartY, 3500, 0, 0xFF4500);
                    this.lava.setOrigin(0.5, 1.0); // Origin at bottom
                    this.lava.setDepth(10001); // HARDCODED: Higher than indicators (10000) to cover them
                    this.lava.setAlpha(1.0);
                    this.lava.setVisible(true);
                    console.log('HARDCODED: Created missing lava in update!');
                }
                if (this.lavaGlow) {
                    this.lavaGlow.setVisible(true);
                    this.lavaGlow.setAlpha(1.0);
                    this.lavaGlow.setDepth(10002); // HARDCODED: Higher than lava to show glow
                }
                if (this.lavaParticles && this.lavaParticles.length > 0) {
                    this.lavaParticles.forEach(p => {
                        if (p) {
                            p.setVisible(true);
                            p.setAlpha(1.0);
                            p.setDepth(10003); // HARDCODED: Highest for particles
                        }
                    });
                }
            } else {
                // Event ended: keep everything hidden
                if (this.lava) this.lava.setVisible(false);
                if (this.lavaGlow) this.lavaGlow.setVisible(false);
                if (this.lavaParticles && this.lavaParticles.length > 0) {
                    this.lavaParticles.forEach(p => { if (p) p.setVisible(false); });
                }
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
            const countdown = Math.floor(timeUntilRise);
            this.lavaWarningText.setText(`LAVA RISING COOLDOWN: ${countdown}`);
            
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
                    this.lava.setDepth(10001); // HARDCODED: Higher than indicators (10000) to cover them
                    console.log('LAVA OBJECT - Y:', this.lava.y, 'Visible:', this.lava.visible, 'Alpha:', this.lava.alpha, 'Depth:', this.lava.depth);
                } else {
                    console.error('LAVA OBJECT IS NULL!');
                }
                if (this.lavaGlow) {
                    this.lavaGlow.setVisible(true);
                    this.lavaGlow.setAlpha(0.8);
                    this.lavaGlow.setDepth(10002); // HARDCODED: Higher than lava to show glow
                }
                if (this.lavaParticles && this.lavaParticles.length > 0) {
                    this.lavaParticles.forEach((p, i) => {
                        if (p) {
                            p.setVisible(true);
                            p.setAlpha(1.0);
                            p.setDepth(10003); // HARDCODED: Highest for particles
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
            // Ground is at this.HARDCODED_GROUND_TOP, topmost platform is at y=100 (top at y=90)
            // Lava should rise to just below top platform
            const maxLavaHeight = this.HARDCODED_GROUND_TOP - 90; 
            const currentLavaHeight = maxLavaHeight * easedProgress;
            this.lavaCurrentY = this.lavaStartY; // Keep bottom at ground level - NEVER MOVES
            
            // HARDCODED: Update lava height (fills from bottom like water)
            if (this.lava) {
                // CRITICAL: Bottom stays at ground level, height increases upward
                // Make sure the rectangle actually grows from the bottom
                this.lava.height = currentLavaHeight; // Grow height upward from bottom
                this.lava.y = this.lavaStartY; // Bottom always at ground level - NEVER MOVES
                this.lava.setVisible(true);
                this.lava.setAlpha(1.0);
                this.lava.setDepth(10001); // HARDCODED: Higher than indicators (10000) to cover them
                // HARDCODED: Force update the display
                this.lava.setSize(3500, currentLavaHeight);
            } else {
                console.error('LAVA OBJECT MISSING DURING RISE!');
                // HARDCODED: Try to recreate lava if it's missing
                if (!this.lava) {
                    const lavaStartY = this.HARDCODED_GROUND_TOP;
                    this.lava = this.add.rectangle(640, lavaStartY, 3500, 0, 0xFF4500);
                    this.lava.setOrigin(0.5, 1.0); // Origin at bottom center
                    this.lava.setDepth(10001); // HARDCODED: Higher than indicators (10000) to cover them
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
                this.lavaGlow.setDepth(10002); // HARDCODED: Higher than lava to show glow
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
                        particle.setDepth(10003); // HARDCODED: Highest for particles
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
        
        // Track if a new player just fell (for message display)
        let player1JustFell = false;
        let player2JustFell = false;
        
        // Check if player 1 falls into lava
        if (player1Bottom >= lavaTopY && !this.player1FellInLava) {
            this.player1FellInLava = true;
            this.player1LavaDebuff = true;
            this.player1Respawned = false;
            player1JustFell = true;
            // Hide player 1
            if (this.player1) {
                this.player1.setVisible(false);
                this.player1.body.setEnable(false);
            }
            console.log('Player 1 (Solari) fell into lava');
        }
        
        // Check if player 2 falls into lava
        if (player2Bottom >= lavaTopY && !this.player2FellInLava) {
            this.player2FellInLava = true;
            this.player2LavaDebuff = true;
            this.player2Respawned = false;
            player2JustFell = true;
            // Hide player 2
            if (this.player2) {
                this.player2.setVisible(false);
                this.player2.body.setEnable(false);
            }
            console.log('Player 2 (Umbrae) fell into lava');
        }
        
        // HARDCODED: Show appropriate message based on who fell
        if (player1JustFell && player2JustFell) {
            // Both players fell at the same time
            this.removeLava(); // This immediately teleports players to spawn
            this.showLavaMessage('Both players fell into the lava!', () => {
                // Players are already at spawn, now they can move (unfrozen)
            });
        } else if (player1JustFell) {
            // Player 1 just fell - check if both have now fallen
            if (this.player1FellInLava && this.player2FellInLava) {
                // Both players have now fallen - show combined message
                this.removeLava(); // This immediately teleports players to spawn
                this.showLavaMessage('Both players fell into the lava!', () => {
                    // Players are already at spawn, now they can move (unfrozen)
                });
            } else {
                // Only player 1 fell so far
                this.showLavaMessage('Solari fell into the lava!', () => {});
            }
        } else if (player2JustFell) {
            // Player 2 just fell - check if both have now fallen
            if (this.player1FellInLava && this.player2FellInLava) {
                // Both players have now fallen - show combined message
                this.removeLava(); // This immediately teleports players to spawn
                this.showLavaMessage('Both players fell into the lava!', () => {
                    // Players are already at spawn, now they can move (unfrozen)
                });
            } else {
                // Only player 2 fell so far
                this.showLavaMessage('Umbrae fell into the lava!', () => {});
            }
        }
        
        // Check if a player survived (reached top platform)
        // HARDCODED: Only check survival if lava is still rising and we haven't checked yet
        if (!this.lavaSurvivalChecked && this.lavaRising) {
            const topPlatformY = 150;
            const topPlatformTop = topPlatformY - 15; // Platform height is 30, so top is at y-15
            if (lavaTopY <= topPlatformTop + 20) {
                // HARDCODED: Check if players survived (only if they didn't fall)
                const player1Top = !this.player1FellInLava && this.player1 ? this.player1.y - this.HARDCODED_PLAYER_HALF_HEIGHT : 9999;
                const player2Top = !this.player2FellInLava && this.player2 ? this.player2.y - this.HARDCODED_PLAYER_HALF_HEIGHT : 9999;
                
                const player1Survived = player1Top < topPlatformTop && !this.player1FellInLava;
                const player2Survived = player2Top < topPlatformTop && !this.player2FellInLava;
                
                // HARDCODED: Determine outcome and show appropriate message
                // All influence changes are now per-second rates that stack
                if (player1Survived && player2Survived) {
                    // Both players survived - both gain 2 influence/sec
                    this.lavaSurvivalChecked = true;
                    this.removeLava(); // This immediately teleports players to spawn
                    this.showLavaMessage('Both players escaped the lava!', () => {
                        // Both get +2 influence/sec (rates stack)
                        this.player1InfluenceRate += 2;
                        this.player2InfluenceRate += 2;
                        // Players are already at spawn, now they can move (unfrozen)
                    });
                } else if (player1Survived && this.player2FellInLava) {
                    // Player 1 survived, player 2 fell
                    this.lavaSurvivalChecked = true;
                    this.removeLava(); // This immediately teleports players to spawn
                    // Show message (previous "Umbrae fell" message will be replaced, which is fine)
                    this.showLavaMessage('Solari escaped the lava!', () => {
                        // Player 1 (winner) gains +2 influence/sec, Player 2 (loser) loses -2 influence/sec
                        this.player1InfluenceRate += 2;
                        this.player2InfluenceRate -= 2;
                        // Players are already at spawn, now they can move (unfrozen)
                    });
                } else if (player2Survived && this.player1FellInLava) {
                    // Player 2 survived, player 1 fell
                    this.lavaSurvivalChecked = true;
                    this.removeLava(); // This immediately teleports players to spawn
                    // Show message (previous "Solari fell" message will be replaced, which is fine)
                    this.showLavaMessage('Umbrae escaped the lava!', () => {
                        // Player 2 (winner) gains +2 influence/sec, Player 1 (loser) loses -2 influence/sec
                        this.player2InfluenceRate += 2;
                        this.player1InfluenceRate -= 2;
                        // Players are already at spawn, now they can move (unfrozen)
                    });
                } else if (player1Survived && !this.player2FellInLava) {
                    // Player 1 survived, player 2 didn't make it (but didn't fall)
                    this.lavaSurvivalChecked = true;
                    this.removeLava(); // This immediately teleports players to spawn
                    this.showLavaMessage('Solari escaped the lava!', () => {
                        // Player 1 (winner) gains +2 influence/sec, Player 2 (loser) loses -2 influence/sec
                        this.player1InfluenceRate += 2;
                        this.player2InfluenceRate -= 2;
                        // Players are already at spawn, now they can move (unfrozen)
                    });
                } else if (player2Survived && !this.player1FellInLava) {
                    // Player 2 survived, player 1 didn't make it (but didn't fall)
                    this.lavaSurvivalChecked = true;
                    this.removeLava(); // This immediately teleports players to spawn
                    this.showLavaMessage('Umbrae escaped the lava!', () => {
                        // Player 2 (winner) gains +2 influence/sec, Player 1 (loser) loses -2 influence/sec
                        this.player2InfluenceRate += 2;
                        this.player1InfluenceRate -= 2;
                        // Players are already at spawn, now they can move (unfrozen)
                    });
                } else if (this.player1FellInLava && this.player2FellInLava) {
                    // Both players fell - no influence changes (both lose, nothing happens)
                    if (!this.lavaSurvivalChecked) {
                        this.lavaSurvivalChecked = true;
                        this.removeLava(); // This immediately teleports players to spawn
                        // HARDCODED: Show message and freeze players (message should have been shown in collision check, but ensure it's shown)
                        if (!this.lavaMessageText) {
                            this.showLavaMessage('Both players fell into the lava!', () => {
                                // Players are already at spawn, now they can move (unfrozen)
                            });
                        }
                    }
                }
            }
        }
    }
    
    showLavaMessage(text, onComplete = null) {
        // HARDCODED: Show message in center of screen
        // Clear any existing message timer to prevent premature destruction
        if (this.lavaMessageTimer) {
            this.lavaMessageTimer.remove();
            this.lavaMessageTimer = null;
        }
        
        if (this.lavaMessageText) {
            this.lavaMessageText.destroy();
        }
        this.lavaMessageText = this.add.text(640, 300, text, {
            fontSize: '48px',
            fill: '#FFFFFF',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 6,
            resolution: 2
        }).setOrigin(0.5, 0.5).setDepth(10000);
        
        // HARDCODED: Freeze players while message is visible
        this.playersFrozenForLavaMessage = true;
        if (this.player1 && this.player1.body) {
            this.player1.body.setVelocity(0, 0);
        }
        if (this.player2 && this.player2.body) {
            this.player2.body.setVelocity(0, 0);
        }
        
        // HARDCODED: Remove message after at least 2 seconds (using 2500ms for safety)
        this.lavaMessageTimer = this.time.delayedCall(2500, () => {
            if (this.lavaMessageText) {
                this.lavaMessageText.destroy();
                this.lavaMessageText = null;
            }
            this.lavaMessageTimer = null;
            
            // HARDCODED: Unfreeze players when message disappears
            this.playersFrozenForLavaMessage = false;
            
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
        
        // HARDCODED: Store who fell before resetting flags
        const player1Fell = this.player1FellInLava;
        const player2Fell = this.player2FellInLava;
        
        // HARDCODED: Completely remove lava entities
        if (this.lava) {
            this.lava.destroy();
            this.lava = null;
        }
        if (this.lavaGlow) {
            this.lavaGlow.destroy();
            this.lavaGlow = null;
        }
        if (this.lavaParticles && this.lavaParticles.length > 0) {
            this.lavaParticles.forEach(p => {
                if (p) {
                    p.destroy();
                }
            });
            this.lavaParticles = [];
        }
        if (this.lavaWarningText) {
            this.lavaWarningText.setVisible(false);
        }
        this.lavaEndTime = this.levelTime;
        
        // HARDCODED: IMMEDIATELY teleport players to spawn point when lava ends
        // (player1Fell and player2Fell already stored above)
        // IMMEDIATELY respawn players at spawn point
        this.returnPlayersToStart(player1Fell, player2Fell);
        
        // Reset flags for next lava event
        this.player1LavaDebuff = false;
        this.player2LavaDebuff = false;
        this.player1FellInLava = false;
        this.player2FellInLava = false;
        this.player1Respawned = true;
        this.player2Respawned = true;
        
        console.log('HARDCODED: Lava removed and stopped rising - players immediately teleported to spawn');
    }
    
    returnPlayersToStart(player1Fell = false, player2Fell = false) {
        // HARDCODED: Return players to their start positions ABOVE the ground
        // Always respawn all players when lava event ends (they return to original spawn)
        const player1StartX = 400;
        const spawnY = this.groundTop - this.HARDCODED_PLAYER_HALF_HEIGHT; 
        const player2StartX = 880;
        
        // HARDCODED: Store spawn positions so players stay locked there during message freeze
        this.player1SpawnX = player1StartX;
        this.player1SpawnY = spawnY;
        this.player2SpawnX = player2StartX;
        this.player2SpawnY = spawnY;
        
        // HARDCODED: Always respawn player 1 (they return to original spawn when event ends)
        if (this.player1) {
            // Disable body temporarily to prevent ground collision interference
            this.player1.body.setEnable(false);
            this.player1.x = player1StartX;
            this.player1.y = spawnY; // ABOVE ground
            this.player1.body.setVelocity(0, 0);
            this.player1.setVisible(true);
            this.player1Respawned = true;
            // Re-enable body after positioning
            this.time.delayedCall(50, () => {
                if (this.player1) {
                    this.player1.body.setEnable(true);
                    this.player1.body.setGravityY(this.gravity);
                    this.player1.body.updateFromGameObject();
                }
            });
            console.log('HARDCODED: Player 1 (Solari) respawned at X:', player1StartX, 'Y:', spawnY);
        }
        
        // HARDCODED: Always respawn player 2 (they return to original spawn when event ends)
        if (this.player2) {
            // Disable body temporarily to prevent ground collision interference
            this.player2.body.setEnable(false);
            this.player2.x = player2StartX;
            this.player2.y = spawnY; // ABOVE ground
            this.player2.body.setVelocity(0, 0);
            this.player2.setVisible(true);
            this.player2Respawned = true;
            // Re-enable body after positioning
            this.time.delayedCall(50, () => {
                if (this.player2) {
                    this.player2.body.setEnable(true);
                    this.player2.body.setGravityY(this.gravity);
                    this.player2.body.updateFromGameObject();
                }
            });
            console.log('HARDCODED: Player 2 (Umbrae) respawned at X:', player2StartX, 'Y:', spawnY);
        }
        
        // HARDCODED: Reset global speed/jump to base values (debuffs are per-player)
        this.playerSpeed = this.basePlayerSpeed;
        this.jumpVelocity = this.baseJumpVelocity;
        
        console.log('HARDCODED: All players returned to start positions - Y:', spawnY, 'Ground top:', this.HARDCODED_GROUND_TOP);
    }
    
    updateFaultlinePuzzle(dt) {
        const phaseIndex = Math.floor(this.levelTime / 15);
        const activeNow = phaseIndex % 2 === 1;
        
        if (!activeNow && this.previousScalesActive) {
            this.scales.forEach(scale => {
                scale.captureProgress = 0;
                scale.capturePlayer = null;
                scale.tubeFill.height = 0;
            });
        }
        
        this.scalesActive = activeNow;
        this.previousScalesActive = activeNow;
        
        this.scales.forEach((scale, index) => {
            const plate = this.faultlinePlates[index];
            if (!plate || !plate.body) return; // Safety check: skip if plate is missing or moved
            
            if (this.scalesActive) {
                scale.indicator.setText('✔');
                scale.indicator.setColor('#00FF00');
            } else {
                scale.indicator.setText('✕');
                scale.indicator.setColor('#FF0000');
            }
            
            const p1Dist = Phaser.Math.Distance.Between(this.player1.x, this.player1.y, plate.body.x, plate.body.y);
            const p2Dist = Phaser.Math.Distance.Between(this.player2.x, this.player2.y, plate.body.x, plate.body.y);
            
            const p1OnPlate = p1Dist < 120;
            const p2OnPlate = p2Dist < 120;
            
            let activePlayer = null;
            if (p1OnPlate && !p2OnPlate) {
                activePlayer = 'Solari';
            } else if (p2OnPlate && !p1OnPlate) {
                activePlayer = 'Umbrae';
            }
            
            if (this.scalesActive && activePlayer) {
                if (scale.capturePlayer !== activePlayer) {
                    scale.capturePlayer = activePlayer;
                    scale.captureProgress = 0;
                }
                scale.captureProgress = Math.min(5, scale.captureProgress + dt);
                
                const ratio = Math.min(1, scale.captureProgress / 5);
                const fillHeight = scale.fillMaxHeight * ratio;
                scale.tubeFill.height = fillHeight;
                scale.tubeFill.y = scale.fillBottomY - fillHeight;
                
                let fillColor = 0x888888;
                if (activePlayer === 'Solari') {
                    fillColor = 0xFFD700;
                } else if (activePlayer === 'Umbrae') {
                    fillColor = 0x8B00FF;
                } else if (scale.owner === 'Solari') {
                    fillColor = 0xFFD700;
                } else if (scale.owner === 'Umbrae') {
                    fillColor = 0x8B00FF;
                }
                scale.tubeFill.setFillStyle(fillColor);
                
                if (ratio >= 1 && scale.owner !== activePlayer) {
                    scale.owner = activePlayer;
                }
            }
            
            if (!this.scalesActive) {
                plate.body.setTint(0x0066CC);
            } else if (activePlayer === 'Solari') {
                plate.body.setTint(0xFFD700);
            } else if (activePlayer === 'Umbrae') {
                plate.body.setTint(0x8B00FF);
            } else {
                plate.body.setTint(0x0066CC);
            }
        });
        
        let solariOwned = 0;
        let umbraeOwned = 0;
        
        if (this.scalesActive) {
            this.scales.forEach(scale => {
                if (scale.owner === 'Solari') {
                    solariOwned += 1;
                } else if (scale.owner === 'Umbrae') {
                    umbraeOwned += 1;
                }
            });
        }
        
        this.solariScaleCount = solariOwned;
        this.umbraeScaleCount = umbraeOwned;
    }

    updateInfluence(dt) {
        // HARDCODED: Calculate net influence rate per second for each player (all rates stack)
        let player1NetRate = 0;
        let player2NetRate = 0;
        
        // 1. Lava event rates (persist until next event, stack)
        player1NetRate += this.player1InfluenceRate;
        player2NetRate += this.player2InfluenceRate;
        
        // 2. Orb sequence bonus (+3/sec for winner)
        if (this.orbSequenceOwner === 'Solari') {
            player1NetRate += this.orbSequenceBonusRate; // +3/sec
        } else if (this.orbSequenceOwner === 'Umbrae') {
            player2NetRate += this.orbSequenceBonusRate; // +3/sec
        }
        
        // 3. Fault line scales (+1/sec per scale owned, only when scales are active)
        if (this.scalesActive && this.scales && this.scales.length) {
            player1NetRate += (this.solariScaleCount || 0); // +1/sec per scale
            player2NetRate += (this.umbraeScaleCount || 0); // +1/sec per scale
        }
        
        // 4. Legacy influence reward system (if still used)
        if (this.influenceReward) {
            if (!this.influenceReward.endTime || this.levelTime <= this.influenceReward.endTime) {
                player1NetRate += this.influenceReward.rate;
                player2NetRate += this.influenceReward.rate;
            } else {
                this.influenceReward = null;
            }
        }
        
        // HARDCODED: Apply net rates per second (rates stack, so we sum them all)
        this.player1Influence += player1NetRate * dt;
        this.player2Influence += player2NetRate * dt;
        
        // Clamp influence to valid range
        this.player1Influence = Phaser.Math.Clamp(this.player1Influence, 0, this.maxInfluence);
        this.player2Influence = Phaser.Math.Clamp(this.player2Influence, 0, this.maxInfluence);
        
        const p1BarWidth = (this.player1Influence / this.maxInfluence) * 400;
        const p2BarWidth = (this.player2Influence / this.maxInfluence) * 400;
        
        this.player1BarFill.setSize(p1BarWidth, 25);
        this.player2BarFill.setSize(p2BarWidth, 25);
        
        this.player1InfluenceText.setText(`${Math.floor(this.player1Influence)}/500`);
        this.player2InfluenceText.setText(`${Math.floor(this.player2Influence)}/500`);
        
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
    }
    
    spawnInfluenceBlock(color, collection) {
        const paintable = [];
        if (this.platforms && this.platforms.length) {
            paintable.push(...this.platforms);
        }
        if (this.fallingPlatforms && this.fallingPlatforms.length) {
            paintable.push(...this.fallingPlatforms);
        }
        if (paintable.length === 0) return;
        
        const index = Phaser.Math.Between(0, paintable.length - 1);
        const target = paintable[index];
        const size = 10;
        
        const halfW = target.width / 2;
        const halfH = target.height / 2;
        const x = Phaser.Math.Between(target.x - halfW + size / 2, target.x + halfW - size / 2);
        const y = Phaser.Math.Between(target.y - halfH + size / 2, target.y + halfH - size / 2);
        
        const pixel = this.add.rectangle(x, y, size, size, color);
        pixel.setOrigin(0.5, 0.5);
        pixel.setDepth(2);
        collection.push(pixel);
    }
    
    endLevel(winner) {
        const winnerText = winner 
            ? this.add.text(640, 360, `${winner} WINS!`, { 
                fontSize: '68px', 
                fill: winner === 'Solari' ? '#FFD700' : '#8B00FF', 
                fontStyle: 'bold',
                resolution: 2 
            }).setOrigin(0.5, 0.5).setDepth(10000)
            : this.add.text(640, 360, 'NO RESULT', { 
                fontSize: '68px', 
                fill: '#888888', 
                fontStyle: 'bold',
                resolution: 2 
            }).setOrigin(0.5, 0.5).setDepth(10000);
        this.scene.pause();
    }
    
}
