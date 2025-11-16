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
        // Jungle/forest background - dark green with some texture
        this.add.rectangle(640, 360, 1280, 720, 0x2d5016); // Dark green background
        // Add some variation
        this.add.rectangle(640, 200, 1280, 150, 0x3d6b1f); // Lighter green for sky area
        this.add.rectangle(640, 600, 1280, 200, 0x1a3d0a); // Darker green for ground area
        
        // ===== BALANCE METER UI =====
        this.balanceValue = 0; // -100 (Umbrae) to +100 (Solari), 0 = balanced
        this.maxBalance = 100;
        
        // Balance meter background
        this.balanceMeterBg = this.add.rectangle(640, 30, 600, 40, 0x333333);
        this.balanceMeterBg.setOrigin(0.5, 0.5);
        
        // Balance meter fill (starts neutral/white)
        this.balanceMeterFill = this.add.rectangle(640, 30, 1, 35, 0xffffff);
        this.balanceMeterFill.setOrigin(0, 0.5);
        
        // Balance meter center indicator (neutral zone)
        this.balanceCenter = this.add.rectangle(640, 30, 4, 40, 0xffff00);
        this.balanceCenter.setOrigin(0.5, 0.5);
        
        // Labels
        this.add.text(200, 30, 'UMBRAE', { fontSize: '20px', fill: '#8B00FF' }).setOrigin(0.5, 0.5);
        this.add.text(1080, 30, 'SOLARI', { fontSize: '20px', fill: '#FFD700' }).setOrigin(0.5, 0.5);
        
        // ===== PLATFORMS =====
        this.platforms = [];
        
        // Ground level platform (main floor)
        const ground = this.add.rectangle(640, 680, 1280, 80, 0x8B4513);
        ground.setOrigin(0.5, 0.5);
        this.physics.add.existing(ground, true);
        this.platforms.push(ground);
        
        // Middle platform (for Vine Pattern Wall)
        const middlePlatform = this.add.rectangle(640, 400, 400, 30, 0x654321);
        middlePlatform.setOrigin(0.5, 0.5);
        this.physics.add.existing(middlePlatform, true);
        this.platforms.push(middlePlatform);
        
        // Top platform (for Wind Totem Dial)
        const topPlatform = this.add.rectangle(640, 150, 300, 30, 0x654321);
        topPlatform.setOrigin(0.5, 0.5);
        this.physics.add.existing(topPlatform, true);
        this.platforms.push(topPlatform);
        
        // Additional platforms for parkour
        const leftPlatform = this.add.rectangle(200, 550, 150, 25, 0x654321);
        leftPlatform.setOrigin(0.5, 0.5);
        this.physics.add.existing(leftPlatform, true);
        this.platforms.push(leftPlatform);
        
        const rightPlatform = this.add.rectangle(1080, 550, 150, 25, 0x654321);
        rightPlatform.setOrigin(0.5, 0.5);
        this.physics.add.existing(rightPlatform, true);
        this.platforms.push(rightPlatform);
        
        // ===== VINES (Climbable) =====
        this.vines = [];
        // Left vine
        const leftVine = this.add.rectangle(100, 400, 20, 500, 0x228B22);
        leftVine.setOrigin(0.5, 0.5);
        this.physics.add.existing(leftVine, true);
        this.vines.push(leftVine);
        
        // Right vine
        const rightVine = this.add.rectangle(1180, 400, 20, 500, 0x228B22);
        rightVine.setOrigin(0.5, 0.5);
        this.physics.add.existing(rightVine, true);
        this.vines.push(rightVine);
        
        // ===== PLAYERS =====
        // Player 1 (Solari - Light/Gold) - starts left
        this.player1 = this.add.rectangle(200, 600, 50, 50, 0xFFD700);
        this.player1.setOrigin(0.5, 0.5);
        this.physics.add.existing(this.player1);
        this.player1.body.setCollideWorldBounds(true);
        this.player1.body.setSize(50, 50);
        this.player1.faction = 'Solari';
        this.player1.climbing = false;
        this.player1.onVine = null;
        this.player1.latchedToVine = false;
        this.player1.wWasDown = false;
        
        // Player 2 (Umbrae - Shadow/Purple) - starts right
        this.player2 = this.add.rectangle(1080, 600, 50, 50, 0x8B00FF);
        this.player2.setOrigin(0.5, 0.5);
        this.physics.add.existing(this.player2);
        this.player2.body.setCollideWorldBounds(true);
        this.player2.body.setSize(50, 50);
        this.player2.faction = 'Umbrae';
        this.player2.climbing = false;
        this.player2.onVine = null;
        this.player2.latchedToVine = false;
        this.player2.upWasDown = false;
        
        // Collisions
        this.platforms.forEach(platform => {
            this.physics.add.collider(this.player1, platform);
            this.physics.add.collider(this.player2, platform);
        });
        
        // ===== PUZZLE NODES =====
        this.puzzleNodes = {};
        this.puzzleInfluence = {}; // Track influence per second from each puzzle
        
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
        
        // Player 2 controls (Arrow keys)
        this.cursorsArrows = this.input.keyboard.createCursorKeys();
        this.upKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
        this.downKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
        
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
        // Create pattern wall on middle platform
        const patternPositions = [
            {x: 540, y: 385}, {x: 600, y: 385}, {x: 660, y: 385}, {x: 720, y: 385},
            {x: 540, y: 415}, {x: 600, y: 415}, {x: 660, y: 415}, {x: 720, y: 415}
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
        // Create wind totem dial at top platform
        this.windTotem = this.add.circle(640, 135, 40, 0x8B7355);
        this.windTotem.setOrigin(0.5, 0.5);
        this.windTotem.activated = false;
        this.windTotem.owner = null;
        this.windTotem.sequence = [0, 1, 2, 3]; // 4 sections to hit in order
        this.windTotem.currentStep = 0;
        this.windTotem.sections = [];
        
        // Create 4 sections around the dial
        for (let i = 0; i < 4; i++) {
            const angle = (i * Math.PI * 2) / 4;
            const x = 640 + Math.cos(angle) * 30;
            const y = 135 + Math.sin(angle) * 30;
            const section = this.add.circle(x, y, 15, 0xcccccc);
            section.setOrigin(0.5, 0.5);
            section.sectionIndex = i;
            section.highlighted = false;
            section.activated = false;
            this.windTotem.sections.push(section);
        }
        
        this.puzzleNodes.windTotem = this.windTotem;
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
        const wPressed = Phaser.Input.Keyboard.JustDown(this.wKey);
        const wHeld = this.cursorsWASD.W.isDown;
        const sPressed = Phaser.Input.Keyboard.JustDown(this.sKey);
        
        // Check if we should latch onto vine (W pressed when near vine but not latched)
        if (wPressed && !this.player1.latchedToVine && this.player1.climbing && this.player1.onVine) {
            this.player1.latchedToVine = true;
            this.player1.body.setGravityY(0);
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
            this.player1.body.setGravityY(0);
            
            // Check for unlatch: W released after being held, or S pressed
            const wJustReleased = this.player1.wWasDown && !wHeld;
            if (wJustReleased || sPressed) {
                this.player1.latchedToVine = false;
                this.player1.climbing = false;
                this.player1.onVine = null;
                this.player1.body.setGravityY(600);
                // Jump off if W was released
                if (wJustReleased) {
                    this.player1.body.setVelocityY(this.jumpVelocity);
                }
                this.player1.wWasDown = false;
            } 
            // Climb up with W held
            else if (wHeld) {
                this.player1.body.setVelocityY(-this.climbSpeed);
                // Stop at top
                if (this.player1.y <= vineTop + playerHalfHeight) {
                    this.player1.y = vineTop + playerHalfHeight;
                    this.player1.body.setVelocityY(0);
                }
                this.player1.wWasDown = true;
            } 
            // Not climbing, stay still
            else {
                this.player1.body.setVelocityY(0);
                this.player1.wWasDown = false;
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
        const upPressed = Phaser.Input.Keyboard.JustDown(this.upKey);
        const upHeld = this.cursorsArrows.up.isDown;
        const downPressed = Phaser.Input.Keyboard.JustDown(this.downKey);
        
        // Check if we should latch onto vine (Up Arrow pressed when near vine but not latched)
        if (upPressed && !this.player2.latchedToVine && this.player2.climbing && this.player2.onVine) {
            this.player2.latchedToVine = true;
            this.player2.body.setGravityY(0);
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
            this.player2.body.setGravityY(0);
            
            // Check for unlatch: Up Arrow released after being held, or Down Arrow pressed
            const upJustReleased = this.player2.upWasDown && !upHeld;
            if (upJustReleased || downPressed) {
                this.player2.latchedToVine = false;
                this.player2.climbing = false;
                this.player2.onVine = null;
                this.player2.body.setGravityY(600);
                // Jump off if Up Arrow was released
                if (upJustReleased) {
                    this.player2.body.setVelocityY(this.jumpVelocity);
                }
                this.player2.upWasDown = false;
            } 
            // Climb up with Up Arrow held
            else if (upHeld) {
                this.player2.body.setVelocityY(-this.climbSpeed);
                // Stop at top
                if (this.player2.y <= vineTop + playerHalfHeight) {
                    this.player2.y = vineTop + playerHalfHeight;
                    this.player2.body.setVelocityY(0);
                }
                this.player2.upWasDown = true;
            } 
            // Not climbing, stay still
            else {
                this.player2.body.setVelocityY(0);
                this.player2.upWasDown = false;
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
        // If already latched, keep checking bounds
        if (player.latchedToVine && player.onVine) {
            const vine = player.onVine;
            const vineTop = vine.y - vine.height / 2;
            const vineBottom = vine.y + vine.height / 2;
            // If player goes outside vine bounds, auto-unlatch
            if (player.y < vineTop || player.y > vineBottom) {
                player.latchedToVine = false;
                player.climbing = false;
                player.onVine = null;
                player.body.setGravityY(600);
            }
            return;
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
        } else {
            player.climbing = false;
            player.onVine = null;
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
        
        // Highlight current section
        totem.sections.forEach((section, index) => {
            if (index === totem.sequence[totem.currentStep]) {
                section.highlighted = true;
                section.setFillStyle(0xffff00);
            } else {
                section.highlighted = false;
                if (!section.activated) {
                    section.setFillStyle(0xcccccc);
                }
            }
        });
        
        // Check if player is near totem
        const p1Near = Phaser.Math.Distance.Between(this.player1.x, this.player1.y, totem.x, totem.y) < 60;
        const p2Near = Phaser.Math.Distance.Between(this.player2.x, this.player2.y, totem.x, totem.y) < 60;
        
        if (p1Near || p2Near) {
            const player = p1Near ? this.player1 : this.player2;
            const currentSection = totem.sections[totem.sequence[totem.currentStep]];
            const playerOnSection = Phaser.Math.Distance.Between(player.x, player.y, currentSection.x, currentSection.y) < 25;
            
            if (playerOnSection && currentSection.highlighted) {
                currentSection.activated = true;
                currentSection.setFillStyle(player.faction === 'Solari' ? 0xFFD700 : 0x8B00FF);
                totem.currentStep++;
                
                if (totem.currentStep >= totem.sequence.length) {
                    // Totem completed!
                    totem.activated = true;
                    totem.owner = player.faction;
                    this.puzzleInfluence.windTotem = player.faction === 'Solari' ? 3 : -3;
                    // Reset after delay
                    this.time.delayedCall(5000, () => {
                        totem.activated = false;
                        totem.currentStep = 0;
                        totem.sections.forEach(s => {
                            s.activated = false;
                            s.setFillStyle(0xcccccc);
                        });
                    });
                }
            }
        }
    }

    updateBalanceMeter() {
        // Calculate net influence
        let netInfluence = 0;
        if (this.puzzleInfluence.drumPads) netInfluence += this.puzzleInfluence.drumPads;
        if (this.puzzleInfluence.vinePattern) netInfluence += this.puzzleInfluence.vinePattern;
        if (this.puzzleInfluence.windTotem) netInfluence += this.puzzleInfluence.windTotem;
        
        // Update balance value (per second)
        this.balanceValue += netInfluence / 60; // Assuming 60 FPS
        
        // Clamp balance
        this.balanceValue = Phaser.Math.Clamp(this.balanceValue, -this.maxBalance, this.maxBalance);
        
        // Update meter visual
        const meterWidth = (Math.abs(this.balanceValue) / this.maxBalance) * 300;
        this.balanceMeterFill.setSize(meterWidth, 35);
        
        // Color based on faction
        if (this.balanceValue > 0) {
            // Solari (gold)
            this.balanceMeterFill.setFillStyle(0xFFD700);
            this.balanceMeterFill.x = 640 - meterWidth / 2;
        } else if (this.balanceValue < 0) {
            // Umbrae (purple)
            this.balanceMeterFill.setFillStyle(0x8B00FF);
            this.balanceMeterFill.x = 640 - meterWidth / 2;
        } else {
            // Balanced (white)
            this.balanceMeterFill.setFillStyle(0xffffff);
            this.balanceMeterFill.setSize(1, 35);
            this.balanceMeterFill.x = 640;
        }
        
        // Check for puzzle domination (all nodes controlled by one faction)
        const allSolari = (this.puzzleInfluence.drumPads > 0 || !this.puzzleInfluence.drumPads) &&
                          (this.puzzleInfluence.vinePattern > 0 || !this.puzzleInfluence.vinePattern) &&
                          (this.puzzleInfluence.windTotem > 0 || !this.puzzleInfluence.windTotem);
        const allUmbrae = (this.puzzleInfluence.drumPads < 0 || !this.puzzleInfluence.drumPads) &&
                          (this.puzzleInfluence.vinePattern < 0 || !this.puzzleInfluence.vinePattern) &&
                          (this.puzzleInfluence.windTotem < 0 || !this.puzzleInfluence.windTotem);
        
        if ((allSolari || allUmbrae) && Object.keys(this.puzzleInfluence).length === 3) {
            // Check if held for 3 seconds
            if (!this.dominationTimer) {
                this.dominationTimer = 0;
            }
            this.dominationTimer += 1/60;
            if (this.dominationTimer >= 3) {
                this.endLevel();
            }
        } else {
            this.dominationTimer = 0;
        }
    }

    endLevel() {
        // Determine outcome based on balance
        let outcome = 'balanced';
        if (this.balanceValue > 20) outcome = 'solari';
        else if (this.balanceValue < -20) outcome = 'umbrae';
        
        // Display outcome (for now, just log)
        console.log('Level ended! Outcome:', outcome);
        console.log('Final balance:', this.balanceValue);
        
        // In future, transition to next level
        // this.scene.start('VolcanoLevel');
    }
}
