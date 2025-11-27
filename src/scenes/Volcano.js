// Volcano Level - Redesigned with calculated platform spacing
export class Volcano extends Phaser.Scene {
    constructor() { super('Volcano'); }
    preload() {}

    create() {
        // ===== LEVEL SETUP =====
        this.cameras.main.setZoom(0.7);
        this.cameras.main.setBounds(0, 0, 1828, 1028);
        
        // ===== BACKGROUND =====
        this.add.rectangle(914, 360, 1828, 720, 0x1a0a0a);
        this.add.rectangle(914, 180, 1828, 200, 0x2d1a1a);
        this.add.rectangle(914, 600, 1828, 300, 0x0a0505);
        
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
        this.maxInfluence = 500;
        
        this.player1BarBg = this.add.rectangle(320, 30, 400, 30, 0x333333).setOrigin(0.5, 0.5);
        this.player1BarFill = this.add.rectangle(120, 30, 0, 25, 0xFFD700).setOrigin(0, 0.5);
        this.player1InfluenceText = this.add.text(320, 55, '0/500', { fontSize: '14px', fill: '#ffffff' }).setOrigin(0.5, 0.5);
        this.player1NameText = this.add.text(320, 75, 'SOLARI', { fontSize: '18px', fill: '#FFD700', fontStyle: 'bold' }).setOrigin(0.5, 0.5);
        
        this.player2BarBg = this.add.rectangle(960, 30, 400, 30, 0x333333).setOrigin(0.5, 0.5);
        this.player2BarFill = this.add.rectangle(760, 30, 0, 25, 0x8B00FF).setOrigin(0, 0.5);
        this.player2InfluenceText = this.add.text(960, 55, '0/500', { fontSize: '14px', fill: '#ffffff' }).setOrigin(0.5, 0.5);
        this.player2NameText = this.add.text(960, 75, 'UMBRAE', { fontSize: '18px', fill: '#8B00FF', fontStyle: 'bold' }).setOrigin(0.5, 0.5);
        
        // ===== MOVEMENT SETTINGS =====
        this.playerSpeed = 286;
        this.jumpVelocity = -550; // Match Level 1 jump power
        this.gravity = 600;
        
        // Recalculate jump physics with new jump velocity
        // Max jump height: v^2 = u^2 + 2as => s = u^2 / (2a) = 550^2 / (2*600) = 252 pixels
        // Time to peak: t = u/a = 550/600 = 0.92 seconds
        // Total jump time: 1.84 seconds
        // Max horizontal distance: speed * time = 286 * 1.84 = 526 pixels
        this.maxJumpHeight = 252;
        this.maxJumpDistance = 526;
        
        // ===== PLATFORMS =====
        this.platforms = [];
        this.fallingPlatforms = [];
        
        // Ground platform at bottom of screen
        // Screen height: 1028, ground height: 114, so ground center = 1028 - 57 = 971
        // Ground top = 971 - 57 = 914
        const ground = this.add.rectangle(914, 971, 1828, 114, 0x4a1a0a);
        ground.setOrigin(0.5, 0.5);
        this.physics.add.existing(ground, true);
        this.platforms.push(ground);
        
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
        // Ground: y=971, h=114, origin 0.5,0.5 -> Ground top = 971 - 57 = 914
        // Player: h=71, origin 0.5,0.5 -> Player bottom = player.y + 35.5
        // To stand on ground: player.y + 35.5 = 914, so player.y = 878.5
        this.player1 = this.add.rectangle(400, 878.5, 71, 71, 0xFFD700);
        this.player1.setOrigin(0.5, 0.5);
        this.physics.add.existing(this.player1);
        this.player1.body.setCollideWorldBounds(true);
        this.player1.body.setSize(71, 71);
        this.player1.setDepth(20);
        this.player1.faction = 'Solari';
        
        this.player2 = this.add.rectangle(1428, 878.5, 71, 71, 0x8B00FF);
        this.player2.setOrigin(0.5, 0.5);
        this.physics.add.existing(this.player2);
        this.player2.body.setCollideWorldBounds(true);
        this.player2.body.setSize(71, 71);
        this.player2.setDepth(20);
        this.player2.faction = 'Umbrae';
        
        // Collisions - store colliders for falling platforms so we can remove them
        this.platforms.forEach(platform => {
            const collider1 = this.physics.add.collider(this.player1, platform);
            const collider2 = this.physics.add.collider(this.player2, platform);
            if (platform.colliders) {
                platform.colliders.push(collider1, collider2);
            }
        });
        
        // ===== INPUT =====
        this.cursorsWASD = this.input.keyboard.addKeys('W,S,A,D');
        this.wKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        this.cursorsArrows = this.input.keyboard.createCursorKeys();
        this.upKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
        
        // ===== LEVEL TIMER =====
        this.levelTime = 0;
        this.levelDuration = 300;
        this.timeText = this.add.text(640, 110, '5:00', { fontSize: '24px', fill: '#ffffff' }).setOrigin(0.5, 0.5);
        
        // ===== INFLUENCE SYSTEM =====
        this.influenceRate = 0;
    }

    update(time, delta) {
        const dt = delta / 1000;
        
        this.levelTime += dt;
        const minutes = Math.floor((this.levelDuration - this.levelTime) / 60);
        const seconds = Math.floor((this.levelDuration - this.levelTime) % 60);
        this.timeText.setText(`${minutes}:${seconds.toString().padStart(2, '0')}`);
        
        if (this.levelTime >= this.levelDuration) {
            let winner = null;
            if (this.player1Influence > this.player2Influence) winner = 'Solari';
            else if (this.player2Influence > this.player1Influence) winner = 'Umbrae';
            this.endLevel(winner);
            return;
        }
        
        this.updateFallingPlatforms(dt);
        this.updatePlayer(this.player1, { up: this.wKey, left: this.cursorsWASD.A, right: this.cursorsWASD.D });
        this.updatePlayer(this.player2, { up: this.upKey, left: this.cursorsArrows.left, right: this.cursorsArrows.right });
        this.updateInfluence(dt);
    }
    
    updateFallingPlatforms(dt) {
        this.fallingPlatforms.forEach(platform => {
            if (platform.isFalling) {
                if (platform.y > 1200) {
                    platform.setVisible(false);
                    platform.body.setEnable(false);
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
                
                if (platform.fallTimer >= 1.0) {
                    platform.isFalling = true;
                    
                    if (platform.colliders) {
                        platform.colliders.forEach(collider => {
                            if (collider && collider.active) {
                                this.physics.world.removeCollider(collider);
                            }
                        });
                        platform.colliders = [];
                    }
                    
                    platform.body.setStatic(false);
                    platform.body.setAllowGravity(true);
                    platform.body.setGravityY(this.gravity);
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
        
        if (keys.left.isDown) player.body.setVelocityX(-this.playerSpeed);
        else if (keys.right.isDown) player.body.setVelocityX(this.playerSpeed);
        else player.body.setVelocityX(0);
        
        if (upPressed && player.body.touching.down) {
            player.body.setVelocityY(this.jumpVelocity);
        }
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
}
