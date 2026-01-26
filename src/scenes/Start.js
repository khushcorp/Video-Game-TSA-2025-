import { TextureGenerator } from '../utils/TextureGenerator.js';
import { TempleGenerator } from '../utils/TempleGenerator.js';

export class Start extends Phaser.Scene {

    constructor() {
        super('Start');
    }

    preload() {
        this.load.image('center-tv-image', 'assets/image.png');
    }

    create() {
        this.createTextures();

        this.setupLevel();
        this.createBackground(); 
        this.createUI();
        this.createPlatforms();
        this.createTVs();
        this.createPlayers();
        this.initPuzzles();
        this.setupInput();
        this.setupTimer();
        this.playersFrozen = true;
        this.cameras.main.centerOn(640, 360);
        this.startCountdown();
        
    }

    createTextures() {
        try {
            TextureGenerator.createAllTextures(this);
            TempleGenerator.createTemple(this);
            console.log('All textures created, temple should be ready');
        } catch (error) {
            console.error('Error creating textures:', error);
            // Continue anyway - game should still work without some background textures
        }
    }

    setupLevel() {
        this.baseWidth = 1280;
        this.baseHeight = 720;
        this.physics.world.setBounds(0, 0, 1280, 720);
        this.cameras.main.setBounds(0, 0, 1280, 720);
        this.cameras.main.setScroll(0, 0);
        this.cameras.main.centerOn(640, 360);
        this.updateViewport();
        this.scale.on('resize', this.updateViewport, this);
    }
        
    createBackground() {
        this.fullscreenBg = this.add.rectangle(0, 0, this.scale.width, this.scale.height, 0x2d5016);
        this.fullscreenBg.setOrigin(0, 0);
        this.fullscreenBg.setScrollFactor(0);
        this.fullscreenBg.setDepth(-1000);

        this.bgRects = [];
        
        if (this.textures.exists('bg-layer0-jungle')) {
            const jungleBg = this.add.image(640, 200, 'bg-layer0-jungle');
            jungleBg.setOrigin(0.5, 0.5);
            jungleBg.setDepth(-950);
            jungleBg.setScrollFactor(0); 
            jungleBg.setAlpha(0.7); 
            this.bgRects.push(jungleBg);
        }
        
        const nightSky = this.add.rectangle(640, 150, 1280, 300, 0x0a1929);
        nightSky.setOrigin(0.5, 0.5);
        nightSky.setDepth(-900);
        nightSky.setScrollFactor(0); 
        this.bgRects.push(nightSky);
        
        const stars = [
            {x: 100, y: 50}, {x: 200, y: 80}, {x: 350, y: 40},
            {x: 500, y: 90}, {x: 650, y: 60}, {x: 800, y: 45},
            {x: 950, y: 85}, {x: 1100, y: 55}, {x: 1200, y: 75}
        ];
        
        stars.forEach((star, i) => {
            const starSprite = this.add.circle(star.x, star.y, 2, 0xFFFFFF);
            starSprite.setDepth(-899);
            starSprite.setScrollFactor(0);
            starSprite.setAlpha(0.8);
            
            this.tweens.add({
                targets: starSprite,
                alpha: {from: 0.8, to: 0.2},
                duration: 1000 + i * 200,
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut'
            });
            
            this.bgRects.push(starSprite);
        });
        
        if (this.textures.exists('temple-main')) {
            const templeMain = this.add.image(320, 400, 'temple-main');
            templeMain.setOrigin(0.5, 1); 
            templeMain.setDepth(-200); 
            templeMain.setScrollFactor(0.1); 
            templeMain.setAlpha(0.95); 
            templeMain.setScale(1.0); 
            templeMain.setTint(0xCCCCCC); 
            this.bgRects.push(templeMain);
        }
        
        if (this.textures.exists('bg-fog-layer')) {
            const fogLayer = this.add.image(640, 350, 'bg-fog-layer');
            fogLayer.setOrigin(0.5, 1);
            fogLayer.setDepth(-100); 
            fogLayer.setScrollFactor(0.15); 
            fogLayer.setAlpha(0.2); 
            this.bgRects.push(fogLayer);
        }
        
        if (this.textures.exists('bg-layer3-vine-left')) {
            const vineLeft1 = this.add.image(100, 50, 'bg-layer3-vine-left');
            vineLeft1.setOrigin(0.5, 0);
            vineLeft1.setDepth(-30);
            vineLeft1.setScrollFactor(0.3);
            this.bgRects.push(vineLeft1);
            
            const vineLeft2 = this.add.image(150, 30, 'bg-layer3-vine-left');
            vineLeft2.setOrigin(0.5, 0);
            vineLeft2.setDepth(-30);
            vineLeft2.setScrollFactor(0.3);
            vineLeft2.setScale(0.8);
            this.bgRects.push(vineLeft2);
        }
        
        if (this.textures.exists('bg-layer3-vine-right')) {
            const vineRight1 = this.add.image(1180, 50, 'bg-layer3-vine-right');
            vineRight1.setOrigin(0.5, 0);
            vineRight1.setDepth(-30);
            vineRight1.setScrollFactor(0.3);
            this.bgRects.push(vineRight1);
            
            const vineRight2 = this.add.image(1130, 30, 'bg-layer3-vine-right');
            vineRight2.setOrigin(0.5, 0);
            vineRight2.setDepth(-30);
            vineRight2.setScrollFactor(0.3);
            vineRight2.setScale(0.8);
            this.bgRects.push(vineRight2);
        }
        
        if (this.textures.exists('bg-layer3-tree-left')) {
            const treeLeft = this.add.image(50, 200, 'bg-layer3-tree-left');
            treeLeft.setOrigin(0, 0.5);
            treeLeft.setDepth(-25);
            treeLeft.setScrollFactor(0.3);
            this.bgRects.push(treeLeft);
        }
        
        if (this.textures.exists('bg-layer3-tree-right')) {
            const treeRight = this.add.image(1230, 200, 'bg-layer3-tree-right');
            treeRight.setOrigin(1, 0.5);
            treeRight.setDepth(-25);
            treeRight.setScrollFactor(0.3);
            this.bgRects.push(treeRight);
        }
        
        if (this.textures.exists('bg-layer3-slab')) {
            const slabLeft = this.add.image(80, 420, 'bg-layer3-slab');
            slabLeft.setOrigin(0.5, 0.5);
            slabLeft.setDepth(-20);
            slabLeft.setScrollFactor(0.3);
            slabLeft.setRotation(-0.1); 
            this.bgRects.push(slabLeft);
            
            const slabRight = this.add.image(1200, 420, 'bg-layer3-slab');
            slabRight.setOrigin(0.5, 0.5);
            slabRight.setDepth(-20);
            slabRight.setScrollFactor(0.3);
            slabRight.setRotation(0.1); 
            this.bgRects.push(slabRight);
        }
        
        if (this.textures.exists('bg-layer3-foliage-bottom')) {
            const foliageBottom = this.add.image(640, 470, 'bg-layer3-foliage-bottom');
            foliageBottom.setOrigin(0.5, 1);
            foliageBottom.setDepth(-15);
            foliageBottom.setScrollFactor(0.3);
            this.bgRects.push(foliageBottom);
        }
        
        this.bgRects.push(this.add.rectangle(640, 610, 1280, 220, 0x1a1a1a)); 
        
        this.bgRects.forEach((bg, index) => {
            if (bg && bg.texture) {
                const key = bg.texture.key;
                if (key === 'bg-layer1-sky') {
                    this.tweens.add({
                        targets: bg,
                        y: bg.y + 2,
                        duration: 3000 + Math.random() * 2000,
                        yoyo: true,
                        repeat: -1,
                        ease: 'Sine.easeInOut'
                    });
                }
                if (key === 'bg-layer3-vine-left' || key === 'bg-layer3-vine-right') {
                    this.tweens.add({
                        targets: bg,
                        x: bg.x + (index % 2 === 0 ? 2 : -2),
                        duration: 2000 + Math.random() * 1000,
                        yoyo: true,
                        repeat: -1,
                        ease: 'Sine.easeInOut',
                        delay: index * 200
                    });
                }
                if (key === 'bg-fog-layer') {
                    this.tweens.add({
                        targets: bg,
                        alpha: 0.65,
                        duration: 4000,
                        yoyo: true,
                        repeat: -1,
                        ease: 'Sine.easeInOut'
                    });
                }
            }
        });
    }

    createUI() {
        this.player1Influence = 0; 
        this.player2Influence = 0; 
        this.maxInfluence = 500;
        
        const centerX = 640;
        
        this.player1BarBg = this.add.rectangle(centerX - 400, 30, 400, 30, 0x333333);
        this.player1BarBg.setOrigin(0.5, 0.5);
        this.player1BarBg.setAlpha(0.5); 
        this.player1BarFill = this.add.rectangle(centerX - 600, 30, 0, 25, 0xFFD700); 
        this.player1BarFill.setOrigin(0, 0.5);
        this.player1BarFill.setAlpha(0.7); 
        this.player1InfluenceText = this.add.text(centerX - 400, 55, '0/500', { fontSize: '14px', fill: '#ffffff', resolution: 2 }).setOrigin(0.5, 0.5).setDepth(10000);
        this.player1NameText = this.add.text(centerX - 400, 75, 'SOLARI', { fontSize: '18px', fill: '#FFD700', fontStyle: 'bold', resolution: 2 }).setOrigin(0.5, 0.5).setDepth(10000);
        
        this.player2BarBg = this.add.rectangle(centerX + 400, 30, 400, 30, 0x333333);
        this.player2BarBg.setOrigin(0.5, 0.5);
        this.player2BarBg.setAlpha(0.5); 
        this.player2BarFill = this.add.rectangle(centerX + 200, 30, 0, 25, 0x8B00FF); 
        this.player2BarFill.setOrigin(0, 0.5);
        this.player2BarFill.setAlpha(0.7); 
        this.player2InfluenceText = this.add.text(centerX + 400, 55, '0/500', { fontSize: '14px', fill: '#ffffff', resolution: 2 }).setOrigin(0.5, 0.5).setDepth(10000);
        this.player2NameText = this.add.text(centerX + 400, 75, 'UMBRAE', { fontSize: '18px', fill: '#8B00FF', fontStyle: 'bold', resolution: 2 }).setOrigin(0.5, 0.5).setDepth(10000);
        
        this.createInfluenceBlocks();
    }
        
    createPlatforms() {
        this.platforms = [];
        this.ground = this.add.sprite(640, 440, 'ground-textured');
        this.ground.setOrigin(0.5, 0.5);
        this.physics.add.existing(this.ground, true);
        this.platforms.push(this.ground);
        
        if (!this.textures.exists('platform-wood')) {
            const woodCanvas = this.textures.createCanvas('platform-wood', 150, 25);
            const ctx = woodCanvas.context;
            
            ctx.fillStyle = '#654321';
            ctx.fillRect(0, 0, 150, 25);
            
            ctx.fillStyle = '#5D4037';
            for (let i = 0; i < 30; i++) {
                const x = Math.random() * 150;
                const y = 5 + Math.random() * 15;
                const size = 2 + Math.random() * 3;
                ctx.fillRect(x, y, size, size);
            }
            
            ctx.fillStyle = '#4E342E'; 
            for (let x = 0; x < 150; x += 30) {
                ctx.fillRect(x, 0, 2, 25);
            }
            
            ctx.strokeStyle = '#4E342E';
            ctx.lineWidth = 1;
            for (let x = 0; x < 150; x += 4) {
                ctx.beginPath();
                const grainY = 5 + Math.sin(x * 0.1) * 2;
                ctx.moveTo(x, grainY);
                ctx.lineTo(x, grainY + 15);
                ctx.stroke();
            }
            
            ctx.fillStyle = '#8B6F47';
            for (let y = 2; y < 23; y += 6) {
                for (let x = 4; x < 146; x += 8) {
                    if (Math.random() > 0.7) {
                        ctx.fillRect(x, y, 2, 1);
                    }
                }
            }
            
            ctx.fillStyle = '#228B22'; 
            for (let x = 0; x < 150; x += 2) {
                const grassHeight = Math.random() > 0.5 ? 2 : (Math.random() > 0.3 ? 3 : 1);
                ctx.fillRect(x, 0, 2, grassHeight);
                
                if (Math.random() > 0.7) {
                    ctx.fillRect(x, 0, 2, grassHeight + 1);
                }
            }
            
            ctx.fillStyle = '#32CD32'; 
            for (let x = 0; x < 150; x += 4) {
                if (Math.random() > 0.6) {
                    const grassHeight = Math.random() > 0.5 ? 1 : 2;
                    ctx.fillRect(x, 0, 2, grassHeight);
                }
            }
            
            ctx.fillStyle = '#006400'; 
            for (let x = 0; x < 150; x += 6) {
                if (Math.random() > 0.7) {
                    ctx.fillRect(x, 0, 2, 1);
                }
            }
            
            ctx.fillStyle = '#2C1810'; 
            ctx.fillRect(0, 23, 150, 2);
            
            ctx.fillStyle = '#3E2723';
            ctx.fillRect(0, 0, 2, 25); 
            ctx.fillRect(148, 0, 2, 25); 
            
            ctx.fillStyle = '#2C1810';
            for (let x = 15; x < 150; x += 30) {
                ctx.fillRect(x, 3, 2, 2);
                ctx.fillRect(x, 20, 2, 2);
            }
            
            woodCanvas.refresh();
            this.textures.get('platform-wood').setFilter(Phaser.Textures.FilterMode.NEAREST);
        }
        
        if (!this.textures.exists('platform-stone')) {
            const stoneCanvas = this.textures.createCanvas('platform-stone', 150, 25);
            const ctx = stoneCanvas.context;
            
            ctx.fillStyle = '#696969';
            ctx.fillRect(0, 0, 150, 25);
            
            ctx.fillStyle = '#5D4037'; 
            for (let i = 0; i < 25; i++) {
                const x = Math.random() * 150;
                const y = 5 + Math.random() * 15;
                const size = 2 + Math.random() * 3;
                ctx.fillRect(x, y, size, size);
            }
            
            ctx.fillStyle = '#5A5A5A'; 
            for (let x = 0; x < 150; x += 25) {
                ctx.fillRect(x, 0, 1, 25);
            }
            ctx.fillRect(0, 12, 150, 1);
            
            ctx.fillStyle = '#7A7A7A'; 
            for (let y = 0; y < 25; y += 12) {
                for (let x = 0; x < 150; x += 25) {
                    if (Math.random() > 0.5) {
                        ctx.fillRect(x + 1, y + 1, 23, 11);
                    }
                }
            }
            
            ctx.fillStyle = '#4A4A4A'; 
            for (let i = 0; i < 60; i++) {
                const x = Math.random() * 150;
                const y = Math.random() * 25;
                ctx.fillRect(x, y, 2, 2);
            }
            
            ctx.fillStyle = '#8A8A8A'; 
            for (let i = 0; i < 40; i++) {
                const x = Math.random() * 150;
                const y = Math.random() * 25;
                ctx.fillRect(x, y, 2, 2);
            }
            
            ctx.fillStyle = '#3A3A3A';
            ctx.fillRect(0, 0, 2, 25); 
            ctx.fillRect(148, 0, 2, 25); 
            
            ctx.fillStyle = '#696969'; 
            ctx.fillRect(0, 24, 150, 1);
            
            ctx.fillStyle = '#4A4A4A';
            for (let x = 0; x < 150; x += 25) {
                ctx.fillRect(x, 0, 1, 25);
            }
            ctx.fillRect(0, 12, 150, 1);
            
            stoneCanvas.refresh();
            this.textures.get('platform-stone').setFilter(Phaser.Textures.FilterMode.NEAREST);
        }
        
        const createPlatform = (x, y, width, height, textureKey) => {
            const shadowHeight = 6; 
            const shadowY = y + height/2 + shadowHeight/2; 
            const shadow = this.add.rectangle(x, shadowY, width, shadowHeight, 0x000000, 0.3);
            shadow.setOrigin(0.5, 0.5);
            shadow.setDepth(-1); 
            
            const platform = this.add.sprite(x, y, textureKey);
            platform.setDisplaySize(width, height);
            platform.setOrigin(0.5, 0.5);
            this.physics.add.existing(platform, true);
            platform.setDepth(1); 
            
            platform.shadow = shadow;
            
            return platform;
        };
        
        const middlePlatform = createPlatform(640, 250, 400, 30, 'platform-stone');
        this.platforms.push(middlePlatform);
        
        const topPlatform = createPlatform(640, 70, 300, 30, 'platform-stone');
        this.platforms.push(topPlatform);
        
        const leftPlatform1 = createPlatform(300, 360, 150, 25, 'platform-stone');
        this.platforms.push(leftPlatform1);
        
        const rightPlatform1 = createPlatform(980, 360, 150, 25, 'platform-stone');
        this.platforms.push(rightPlatform1);
        
        const leftPlatform2 = createPlatform(350, 285, 120, 25, 'platform-wood');
        this.platforms.push(leftPlatform2);
        
        const rightPlatform2 = createPlatform(930, 285, 120, 25, 'platform-wood');
        this.platforms.push(rightPlatform2);
        
        const leftPlatform3 = createPlatform(450, 130, 100, 25, 'platform-stone');
        this.platforms.push(leftPlatform3);
        
        const rightPlatform3 = createPlatform(830, 130, 100, 25, 'platform-stone');
        this.platforms.push(rightPlatform3);
        
        const leftPlatform4 = createPlatform(500, 70, 100, 25, 'platform-wood');
        this.platforms.push(leftPlatform4);
        
        const rightPlatform4 = createPlatform(780, 70, 100, 25, 'platform-wood');
        this.platforms.push(rightPlatform4);
        
        this.vines = [];
        const leftVine = this.add.tileSprite(50, 400, 32, 360, 'vine-pixel');
        leftVine.setOrigin(0.5, 1); 
        this.vines.push(leftVine);
        
        const rightVine = this.add.tileSprite(1230, 400, 32, 360, 'vine-pixel');
        rightVine.setOrigin(0.5, 1); 
        this.vines.push(rightVine);
        
        const centerLeftVine = this.add.tileSprite(350, 272.5, 32, 150, 'vine-pixel');
        centerLeftVine.setOrigin(0.5, 1); 
        this.vines.push(centerLeftVine);
        
        const centerRightVine = this.add.tileSprite(930, 272.5, 32, 150, 'vine-pixel');
        centerRightVine.setOrigin(0.5, 1); 
        this.vines.push(centerRightVine);
        
        if (!this.textures.exists('platform-pillar')) {
            const pillarCanvas = this.textures.createCanvas('platform-pillar', 100, 25);
            const ctx = pillarCanvas.context;
            
            ctx.fillStyle = '#654321';
            ctx.fillRect(0, 0, 100, 25);
            
            ctx.fillStyle = '#5D4037';
            for (let i = 0; i < 20; i++) {
                const x = Math.random() * 100;
                const y = 5 + Math.random() * 15;
                const size = 2 + Math.random() * 3;
                ctx.fillRect(x, y, size, size);
            }
            
            ctx.fillStyle = '#4E342E'; 
            for (let x = 0; x < 100; x += 25) {
                ctx.fillRect(x, 0, 2, 25);
            }
            
            ctx.strokeStyle = '#4E342E';
            ctx.lineWidth = 1;
            for (let x = 0; x < 100; x += 4) {
                ctx.beginPath();
                const grainY = 5 + Math.sin(x * 0.1) * 2;
                ctx.moveTo(x, grainY);
                ctx.lineTo(x, grainY + 15);
                ctx.stroke();
            }
            
            ctx.fillStyle = '#8B6F47';
            for (let y = 2; y < 23; y += 6) {
                for (let x = 4; x < 96; x += 8) {
                    if (Math.random() > 0.7) {
                        ctx.fillRect(x, y, 2, 1);
                    }
                }
            }
            
            ctx.fillStyle = '#228B22'; 
            for (let x = 0; x < 100; x += 2) {
                const grassHeight = Math.random() > 0.5 ? 2 : (Math.random() > 0.3 ? 3 : 1);
                ctx.fillRect(x, 0, 2, grassHeight);
                
                if (Math.random() > 0.7) {
                    ctx.fillRect(x, 0, 2, grassHeight + 1);
                }
            }
            
            ctx.fillStyle = '#32CD32'; 
            for (let x = 0; x < 100; x += 4) {
                if (Math.random() > 0.6) {
                    const grassHeight = Math.random() > 0.5 ? 1 : 2;
                    ctx.fillRect(x, 0, 2, grassHeight);
                }
            }
            
            ctx.fillStyle = '#006400'; 
            for (let x = 0; x < 100; x += 6) {
                if (Math.random() > 0.7) {
                    ctx.fillRect(x, 0, 2, 1);
                }
            }
            
            ctx.fillStyle = '#2C1810'; 
            ctx.fillRect(0, 23, 100, 2);
            
            ctx.fillStyle = '#3E2723';
            ctx.fillRect(0, 0, 2, 25); 
            ctx.fillRect(98, 0, 2, 25); 
            
            ctx.fillStyle = '#2C1810';
            for (let x = 12; x < 100; x += 25) {
                ctx.fillRect(x, 3, 2, 2);
                ctx.fillRect(x, 20, 2, 2);
            }
            
            pillarCanvas.refresh();
            this.textures.get('platform-pillar').setFilter(Phaser.Textures.FilterMode.NEAREST);
        }
        
        const leftVineTopPlatform = createPlatform(130, 115, 100, 25, 'platform-pillar');
        this.platforms.push(leftVineTopPlatform);
        
        const rightVineTopPlatform = createPlatform(1150, 115, 100, 25, 'platform-pillar');
        this.platforms.push(rightVineTopPlatform);
        
        const leftVineGroundPlatform = createPlatform(130, 280, 100, 25, 'platform-pillar');
        this.platforms.push(leftVineGroundPlatform);
        
        const rightVineGroundPlatform = createPlatform(1150, 280, 100, 25, 'platform-pillar');
        this.platforms.push(rightVineGroundPlatform);
    }

    createTVs() {
        this.tvElementsP1 = [];
        this.tvElementsP2 = [];
        const centerX = 640;
        
        this.tvFrameP1 = this.add.sprite(centerX - 320, 600, 'tv-frame-p1');
        this.tvFrameP1.setOrigin(0.5, 0.5);
        this.tvFrameP1.setDepth(10);
        this.tvElementsP1.push(this.tvFrameP1);
        
        this.tvFrameP1Glow = this.add.sprite(centerX - 320, 600, 'tv-frame-p1');
        this.tvFrameP1Glow.setOrigin(0.5, 0.5);
        this.tvFrameP1Glow.setDepth(9); 
        this.tvFrameP1Glow.setTint(0xFFD700); 
        this.tvFrameP1Glow.setAlpha(0.7);
        this.tvFrameP1Glow.setScale(1.05); 
        this.tvElementsP1.push(this.tvFrameP1Glow);
        
        this.tweens.add({
            targets: this.tvFrameP1Glow,
            alpha: { from: 0.5, to: 0.9 },
            duration: 2000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
        
        this.tvScreenP1 = this.add.rectangle(centerX - 320, 600, 480, 200, 0x0a0a0a);
        this.tvScreenP1.setOrigin(0.5, 0.5);
        this.tvScreenP1.setDepth(11);
        this.tvElementsP1.push(this.tvScreenP1);
        
        this.tvStaticP1 = this.add.sprite(centerX - 320, 600, 'tv-static-frame-0');
        this.tvStaticP1.setOrigin(0.5, 0.5);
        this.tvStaticP1.setDepth(12);
        this.tvStaticP1.setAlpha(0.15); 
        this.tvStaticP1.play('tv-static-anim');
        this.tvElementsP1.push(this.tvStaticP1);
        
        this.tvElementsP1.push(this.add.text(centerX - 320, 530, 'SOLARI TV', { fontSize: '16px', fill: '#FFD700', fontStyle: 'bold', resolution: 2 }).setOrigin(0.5, 0.5).setDepth(13));
        
        this.tvFrameP2 = this.add.sprite(centerX + 320, 600, 'tv-frame-p2');
        this.tvFrameP2.setOrigin(0.5, 0.5);
        this.tvFrameP2.setDepth(10);
        this.tvElementsP2.push(this.tvFrameP2);
        
        this.tvFrameP2Glow = this.add.sprite(centerX + 320, 600, 'tv-frame-p2');
        this.tvFrameP2Glow.setOrigin(0.5, 0.5);
        this.tvFrameP2Glow.setDepth(9); 
        this.tvFrameP2Glow.setTint(0x8B00FF); 
        this.tvFrameP2Glow.setAlpha(0.7);
        this.tvFrameP2Glow.setScale(1.05); 
        this.tvElementsP2.push(this.tvFrameP2Glow);
        
        this.tweens.add({
            targets: this.tvFrameP2Glow,
            alpha: { from: 0.5, to: 0.9 },
            duration: 2000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
        
        this.tvScreenP2 = this.add.rectangle(centerX + 320, 600, 480, 200, 0x0a0a0a);
        this.tvScreenP2.setOrigin(0.5, 0.5);
        this.tvScreenP2.setDepth(11);
        this.tvElementsP2.push(this.tvScreenP2);
        
        this.tvStaticP2 = this.add.sprite(centerX + 320, 600, 'tv-static-frame-0');
        this.tvStaticP2.setOrigin(0.5, 0.5);
        this.tvStaticP2.setDepth(12);
        this.tvStaticP2.setAlpha(0.15); 
        this.tvStaticP2.play('tv-static-anim');
        this.tvElementsP2.push(this.tvStaticP2);
        
        this.tvElementsP2.push(this.add.text(centerX + 320, 530, 'UMBRAE TV', { fontSize: '16px', fill: '#8B00FF', fontStyle: 'bold', resolution: 2 }).setOrigin(0.5, 0.5).setDepth(13));
        
        this.centerTvImage = this.add.image(centerX, 600, 'center-tv-image');
        this.centerTvImage.setOrigin(0.5, 0.5);
        this.centerTvImage.setDepth(13);
        this.centerTvImage.setScale(0.5);
        this.tvElementsP1.push(this.centerTvImage);
        this.tvElementsP2.push(this.centerTvImage);
    }

    createPlayers() {
        this.player1 = this.add.rectangle(200, 375, 50, 50, 0xFFD700);
        this.player1.setOrigin(0.5, 0.5);
        this.physics.add.existing(this.player1);
        this.player1.body.setCollideWorldBounds(true);
        this.player1.body.setSize(50, 50);
        this.player1.setDepth(20); // Always on top so players can't hide behind each other
        this.player1.faction = 'Solari';
        this.player1.climbing = false;
        this.player1.onVine = null;
        this.player1.latchedToVine = false;
        this.player1.wWasDown = false;
        this.player1.vineIndicator = null;
        this.player1.vineParticles = []; // Store falling particles
        this.player1.lastParticleTime = 0; // Track when last particle was spawned
        this.player1.totemIndicator = null;
        this.player1.teleporting = false; // Track if player is being teleported
        this.player1.vineLatchCooldown = 0; // Cooldown after latching to prevent immediate jump-off
        
        // Player 2 (Umbrae - Shadow/Purple) - starts right (compressed position)
        this.player2 = this.add.rectangle(1080, 375, 50, 50, 0x8B00FF);
        this.player2.setOrigin(0.5, 0.5);
        this.physics.add.existing(this.player2);
        this.player2.body.setCollideWorldBounds(true);
        this.player2.body.setSize(50, 50);
        this.player2.setDepth(20); // Always on top so players can't hide behind each other
        this.player2.faction = 'Umbrae';
        this.player2.climbing = false;
        this.player2.onVine = null;
        this.player2.latchedToVine = false;
        this.player2.upWasDown = false;
        this.player2.vineIndicator = null;
        this.player2.vineParticles = []; // Store falling particles
        this.player2.lastParticleTime = 0; // Track when last particle was spawned
        this.player2.totemIndicator = null;
        this.player2.teleporting = false; // Track if player is being teleported
        this.player2.vineLatchCooldown = 0; // Cooldown after latching to prevent immediate jump-off
        
        // Collisions
        this.platforms.forEach(platform => {
            this.physics.add.collider(this.player1, platform);
            this.physics.add.collider(this.player2, platform);
        });
    }
        
    initPuzzles() {
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
    }
        
    setupInput() {
        // Player 1 controls (WASD)
        this.cursorsWASD = this.input.keyboard.addKeys('W,S,A,D');
        this.wKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        this.aKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.sKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        this.dKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        this.eKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);
        this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE); // Jump off vine
        
        // Player 2 controls (Arrow keys)
        this.cursorsArrows = this.input.keyboard.createCursorKeys();
        this.upKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
        this.downKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
        this.leftKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        this.rightKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        this.slashKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.FORWARD_SLASH);
        // Use ENTER / RETURN for Player 2 to jump off vine (near arrow keys)
        this.enterKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER); // Jump off vine
        
        // ===== MOVEMENT SETTINGS =====
        this.playerSpeed = 200;
        this.jumpVelocity = -550; // Slightly higher jump for harder parkour
        this.climbSpeed = 200; // Constant velocity for climbing
        // Initialize vine climb speed (can be modified by debuffs)
        this.player1.vineClimbSpeed = this.climbSpeed;
        this.player2.vineClimbSpeed = this.climbSpeed;
    }
        
    setupTimer() {
        this.levelTime = 0;
        this.levelDuration = 300;
        this.timeText = this.add.text(640, 110, '5:00', { fontSize: '24px', fill: '#ffffff', resolution: 2 }).setOrigin(0.5, 0.5).setDepth(10000);
        this.influenceRate = 0;
    }

    updateViewport() {
        const width = this.scale.width;
        const height = this.scale.height;
        const scaleX = width / this.baseWidth;
        const scaleY = height / this.baseHeight;
        const zoom = Math.min(scaleX, scaleY);
        this.cameras.main.setZoom(zoom);
        this.cameras.main.setBounds(0, 0, this.baseWidth, this.baseHeight);
        this.cameras.main.setScroll(0, 0);
        this.cameras.main.centerOn(640, 360);

        if (this.fullscreenBg) {
            this.fullscreenBg.setSize(width / zoom, height / zoom);
        }
    }

    createForestRunes() {
        // Create 3 pillars
        // Left and right pillars on new platforms near ground on the side vines
        // Middle pillar stays in the center
        this.runesPillars = [];
        const pillarPositions = [
            { x: 130, y: 217 },   // Left pillar on left vine platform (platform top at y: 267.5, pillar bottom at y: 267 sits on it)
            { x: 640, y: 350 },   // Middle pillar (center of screen, on ground) - Ground top is y=400, pillar height 100, so pillar center at 350 means pillar bottom = 350+50=400 (sits on ground)
            { x: 1150, y: 217 }   // Right pillar on right vine platform (platform top at y: 267.5, pillar bottom at y: 267 sits on it)
        ];
        
        pillarPositions.forEach((pos, index) => {
            // Large, visible pillar (Now using Pixel Art)
            const pillar = this.add.sprite(pos.x, pos.y, `pillar-pixel-${index + 1}`);
            pillar.setOrigin(0.5, 0.5);
            pillar.setDepth(15); 
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
        // IMPORTANT: Array order must match pillar order: [left (0), middle (1), right (2)]
        this.runes = [];
        
        // Left rune - on left vine top platform (requires W+D to reach) - NOW ORANGE
        // Platform is at y=115, height=25, so platform top is at y=102.5, orb sits at y=80 (moved up more)
        const leftRune = this.add.sprite(130, 80, 'rune-pixel-3'); // Changed to rune-pixel-3 (orange)
        leftRune.setOrigin(0.5, 0.5);
        leftRune.runeIndex = 0;
        leftRune.collected = false;
        leftRune.glow = this.add.circle(130, 80, 25, 0xFF4500, 0.3); // Orange glow
        leftRune.glow.setOrigin(0.5, 0.5);
        // Add pulsing glow animation
        this.tweens.add({
            targets: leftRune.glow,
            alpha: { from: 0.2, to: 0.6 },
            scale: { from: 0.9, to: 1.2 },
            duration: 1500,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
        // Add bouncing animation to orb
        this.tweens.add({
            targets: leftRune,
            y: { from: 75, to: 85 },
            duration: 1000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
        // Sync glow with orb bounce
        this.tweens.add({
            targets: leftRune.glow,
            y: { from: 75, to: 85 },
            duration: 1000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
        this.runes.push(leftRune); // runes[0] = left pillar (index 0)
        
        // Middle rune - spawns randomly after 25 seconds
        const middleRune = this.add.sprite(640, 90, 'rune-pixel-2');
        middleRune.setOrigin(0.5, 0.5);
        middleRune.runeIndex = 1;
        middleRune.collected = false;
        middleRune.glow = this.add.circle(640, 90, 25, 0x00FFFF, 0.3); // Matching cyan glow
        middleRune.glow.setOrigin(0.5, 0.5);
        middleRune.setVisible(false); // Start hidden
        middleRune.glow.setVisible(false);
        // Add pulsing glow animation (will start when rune becomes visible)
        this.tweens.add({
            targets: middleRune.glow,
            alpha: { from: 0.2, to: 0.6 },
            scale: { from: 0.9, to: 1.2 },
            duration: 1500,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut',
            paused: true // Start paused, will resume when rune spawns
        });
        middleRune.glowTween = this.tweens.getTweensOf(middleRune.glow)[0];
        // Add bouncing animation to orb (will start when rune becomes visible)
        const middleRuneBounce = this.tweens.add({
            targets: middleRune,
            y: { from: 85, to: 95 },
            duration: 1000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut',
            paused: true // Start paused, will resume when rune spawns
        });
        middleRune.bounceTween = middleRuneBounce;
        // Sync glow with orb bounce
        const middleRuneGlowBounce = this.tweens.add({
            targets: middleRune.glow,
            y: { from: 85, to: 95 },
            duration: 1000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut',
            paused: true // Start paused, will resume when rune spawns
        });
        middleRune.glowBounceTween = middleRuneGlowBounce;
        this.runes.push(middleRune); // runes[1] = middle pillar (index 1)
        
        // Right rune - on right vine top platform (requires Up+Right to reach) - NOW YELLOW
        // Platform is at y=115, height=25, so platform top is at y=102.5, orb sits at y=80 (moved up more)
        const rightRune = this.add.sprite(1150, 80, 'rune-pixel-1'); // Changed to rune-pixel-1 (yellow)
        rightRune.setOrigin(0.5, 0.5);
        rightRune.runeIndex = 2;
        rightRune.collected = false;
        rightRune.glow = this.add.circle(1150, 80, 25, 0xFFD700, 0.3); // Yellow/gold glow
        rightRune.glow.setOrigin(0.5, 0.5);
        // Add pulsing glow animation
        this.tweens.add({
            targets: rightRune.glow,
            alpha: { from: 0.2, to: 0.6 },
            scale: { from: 0.9, to: 1.2 },
            duration: 1500,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
        // Add bouncing animation to orb
        this.tweens.add({
            targets: rightRune,
            y: { from: 75, to: 85 },
            duration: 1000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
        // Sync glow with orb bounce
        this.tweens.add({
            targets: rightRune.glow,
            y: { from: 75, to: 85 },
            duration: 1000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
        this.runes.push(rightRune); // runes[2] = right pillar (index 2)
        
        // Create standalone torches on the ground around the map
        this.createGroundTorches();
        
        // Middle rune spawn system
        this.middleRuneSpawnTimer = 25; // 25 seconds until spawn
        this.middleRuneSpawned = false;
        // Timer positioned in center middle area, below level timer
        this.middleRuneTimerText = this.add.text(640, 140, 'Rune: 25s', {
            fontSize: '18px',
            fill: '#ffff00',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 3,
            resolution: 2
        }).setOrigin(0.5, 0.5).setDepth(10000);
        this.middleRuneTimerText.setDepth(100); // Make sure it's visible
        
        // List of reachable platform positions for random middle rune spawn
        // Positions are on TOP of platforms (platform top surface - rune radius to sit on platform)
        // Platform top = center Y - (height/2), Rune sits at top - 15 (so it's visible on platform)
        // HARDCODED: All positions that could be behind pillars or puzzles are excluded
        const allPossiblePositions = [
            { x: 300, y: 332 },   // leftPlatform1
            { x: 980, y: 332 },   // rightPlatform1
            { x: 350, y: 257 },   // leftPlatform2 (moved down and left)
            { x: 930, y: 257 },   // rightPlatform2 (moved down and right)
            { x: 450, y: 102 },   // leftPlatform3
            { x: 830, y: 102 },   // rightPlatform3
            { x: 500, y: 42 },    // leftPlatform4
            { x: 780, y: 42 },    // rightPlatform4
            { x: 130, y: 80 },    // leftVineTopPlatform (orb position, platform is at y=115)
            { x: 1150, y: 80 }    // rightVineTopPlatform (orb position, platform is at y=115)
        ];
        
        // HARDCODED: Define pillar and puzzle positions to avoid
        // Pillars: left (130, 217), middle (640, 350), right (1150, 217)
        // Vine block puzzle: middle platform (640, 250) - vineFlowIndicator
        // Wind totem: top platform (640, 55)
        const blockedAreas = [
            { x: 130, y: 217, radius: 60 },   // Left pillar (80 wide, 100 tall, so ~60 radius)
            { x: 640, y: 350, radius: 60 },   // Middle pillar
            { x: 1150, y: 217, radius: 60 },  // Right pillar
            { x: 640, y: 250, radius: 200 },  // Vine block puzzle (middle platform, 400 wide)
            { x: 640, y: 55, radius: 150 }    // Wind totem (top platform, 300 wide)
        ];
        
        // Filter out positions that are too close to pillars or puzzles
        this.reachablePlatformPositions = allPossiblePositions.filter(pos => {
            // Check if position is too close to any blocked area
            for (const blocked of blockedAreas) {
                const distance = Phaser.Math.Distance.Between(pos.x, pos.y, blocked.x, blocked.y);
                if (distance < blocked.radius) {
                    return false; // Too close, exclude this position
                }
            }
            return true; // Safe position, keep it
        });
        
        // Track which player is carrying which rune
        this.player1.carriedRune = null;
        this.player2.carriedRune = null;
        
        this.puzzleNodes.forestRunes = this.runesPillars;
    }

    createGroundTorches() {
        // Ground top is at y=400
        // Pillar is now 90px tall, positioned above ground
        // Space torches evenly and avoid platform intersections
        // Platform positions to avoid:
        // - leftVineGroundPlatform: x=130, width=100 (80-180)
        // - leftPlatform1: x=300, width=150 (225-375)
        // - leftPlatform2: x=350, width=120 (290-410)
        // - middlePlatform: x=640, width=400 (440-840)
        // - rightPlatform2: x=930, width=120 (870-990)
        // - rightPlatform1: x=980, width=150 (905-1055)
        // - rightVineGroundPlatform: x=1150, width=100 (1100-1200)
        
        const groundTop = 400;
        // Evenly spaced positions avoiding platforms and vines (6 torches)
        // Left vine at x=50 (width 32, covers 34-66), right vine at x=1230 (width 32, covers 1214-1246)
        const torchPositions = [
            { x: 20, y: groundTop },    // Far left (further left, away from vine at x=50)
            { x: 200, y: groundTop },   // Left (between vine and platform1)
            { x: 420, y: groundTop },   // Left-center (between platform1 and middle)
            { x: 850, y: groundTop },   // Right-center (between middle and platform2)
            { x: 1060, y: groundTop },  // Right (after rightPlatform1, before vine)
            { x: 1260, y: groundTop }   // Far right (further right, away from vine at x=1230)
        ];
        
        this.groundTorches = [];
        torchPositions.forEach((pos, index) => {
            // Create wooden pillar - positioned on ground, origin at bottom
            // Pillar is 90px tall, so bottom at groundTop, top at groundTop - 90
            const pillar = this.add.sprite(pos.x, groundTop, 'torch-pillar');
            pillar.setOrigin(0.5, 1); // Anchor to bottom (sits on ground)
            pillar.setDepth(10); // Above ground but below platforms
            
            // Create animated flame sprite on top of torch
            // Pillar top is at groundTop - 90, torch stick extends to groundTop - 90 + 16 = groundTop - 74
            // Flame is now 28px tall (shorter), anchored at bottom
            const flameY = groundTop - 74; // Top of torch stick (where flame starts)
            const flame = this.add.sprite(pos.x, flameY, 'flame-frame-0');
            flame.setOrigin(0.5, 1); // Anchor to bottom (where it meets torch) - points upward
            flame.setDepth(11);
            flame.play('flame-flicker');
            
            // No tween animation - just the frame animation for simple flicker
            
            // Sparking particles - real fire sparks
            const createSpark = () => {
                const sparkX = pos.x + (Math.random() - 0.5) * 6;
                const sparkY = flameY - 5 + Math.random() * 5; // Sparks from flame base
                
                // Random spark color (yellow, orange, or white)
                const sparkColors = [0xFFFF00, 0xFFA500, 0xFFFFFF];
                const sparkColor = sparkColors[Math.floor(Math.random() * sparkColors.length)];
                
                const spark = this.add.circle(sparkX, sparkY, 1 + Math.random(), sparkColor, 1.0);
                spark.setOrigin(0.5, 0.5);
                spark.setDepth(12);
                
                // Spark flies upward and outward
                const angle = (Math.random() - 0.5) * Math.PI * 0.6; // Mostly upward, some spread
                const distance = 8 + Math.random() * 8;
                const speed = 300 + Math.random() * 200;
                
                this.tweens.add({
                    targets: spark,
                    x: sparkX + Math.cos(angle) * distance,
                    y: sparkY - Math.abs(Math.sin(angle)) * distance - Math.random() * 5,
                    alpha: { from: 1.0, to: 0 },
                    scale: { from: 1.0, to: 0.3 },
                    duration: speed,
                    ease: 'Power2',
                    onComplete: () => spark.destroy()
                });
            };
            
            // Continuous sparking - create sparks periodically
            this.time.addEvent({
                delay: 200 + Math.random() * 300,
                callback: createSpark,
                loop: true,
                startAt: index * 100 // Stagger timing
            });
            
            // Occasional burst of sparks
            this.time.addEvent({
                delay: 2000 + index * 500,
                callback: () => {
                    for (let i = 0; i < 3 + Math.floor(Math.random() * 3); i++) {
                        this.time.delayedCall(i * 50, createSpark);
                    }
                },
                loop: true
            });
            
            // Store reference
            pillar.flame = flame;
            this.groundTorches.push(pillar);
        });
    }

    createVineFlowPuzzle() {
        // Create treasure chest indicator on middle platform
        const chestX = 640; // Center of middle platform
        // Middle platform is at y: 250, height 30, so top is at y: 235
        // Chest is 60px tall, so position it on the platform
        const chestY = 200; // Sits on top of platform, moved up a bit more (was 210)
        
        // Create treasure chest sprite
        this.vineFlowIndicator = this.add.sprite(chestX, chestY, 'treasure-chest');
        this.vineFlowIndicator.setOrigin(0.5, 0.5);
        this.vineFlowIndicator.setDepth(5);
        
        // Store gem and coin positions - exact pixel positions from texture
        // Chest texture is 100x75, center is at (50, 37.5)
        // Convert texture coordinates to world coordinates: worldX = chestX + (texX - 50), worldY = chestY + (texY - 37.5)
        const gemPositions = [
            { x: 14, y: 41, color: 0x000066, name: 'sapphire' },   // Top-left gem center (14, 41)
            { x: 86, y: 41, color: 0x006600, name: 'emerald' },   // Top-right gem center (86, 41)
            { x: 86, y: 69, color: 0xCC0000, name: 'ruby' },      // Bottom-right gem center (86, 69)
            { x: 14, y: 69, color: 0x440066, name: 'amethyst' }    // Bottom-left gem center (14, 69)
        ];
        
        const coinPositions = [
            { x: 29, y: 54.5 },  // Coin 1 - Left center (29, 54.5)
            { x: 71, y: 58.5 },  // Coin 2 - Right center (71, 58.5)
            { x: 50, y: 62.5 },  // Coin 3 - Center (50, 62.5)
            { x: 39, y: 59.5 },  // Coin 4 - Upper left center (39, 59.5)
            { x: 61, y: 63.5 }  // Coin 5 - Lower right center (61, 63.5)
        ];
        
        // Create shining animations for gems - small but noticeable
        this.vineFlowIndicator.gemSparkles = [];
        gemPositions.forEach((gem, index) => {
            // Convert texture coordinates to world coordinates
            const gemX = chestX + (gem.x - 50);
            const gemY = chestY + (gem.y - 37.5);
            
            // Small bright gem glow
            const gemGlow = this.add.circle(gemX, gemY, 5, gem.color, 0.8);
            gemGlow.setOrigin(0.5, 0.5);
            gemGlow.setDepth(6);
            
            // Pulsing glow animation - more noticeable
            this.tweens.add({
                targets: gemGlow,
                alpha: { from: 0.6, to: 1.0 },
                scale: { from: 0.9, to: 1.2 },
                duration: 800 + index * 150,
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut'
            });
            
            // Small bright sparkle particles
            for (let i = 0; i < 2; i++) {
                const sparkle = this.add.circle(gemX, gemY, 1.5, 0xFFFFFF, 1.0);
                sparkle.setOrigin(0.5, 0.5);
                sparkle.setDepth(7);
                
                const angle = (Math.PI * 2 * i) / 2 + index;
                const radius = 4;
                
                this.tweens.add({
                    targets: sparkle,
                    x: gemX + Math.cos(angle) * radius,
                    y: gemY + Math.sin(angle) * radius,
                    alpha: { from: 1.0, to: 0.3 },
                    scale: { from: 1.0, to: 0.8 },
                    duration: 1200 + index * 100,
                    yoyo: true,
                    repeat: -1,
                    ease: 'Sine.easeInOut',
                    delay: i * 300
                });
            }
            
            // Occasional bright flash
            this.time.addEvent({
                delay: 2500 + index * 500,
                callback: () => {
                    const flash = this.add.circle(gemX, gemY, 6, 0xFFFFFF, 0.9);
                    flash.setOrigin(0.5, 0.5);
                    flash.setDepth(7);
                    this.tweens.add({
                        targets: flash,
                        alpha: 0,
                        scale: 1.5,
                        duration: 400,
                        onComplete: () => flash.destroy()
                    });
                },
                loop: true
            });
            
            this.vineFlowIndicator.gemSparkles.push(gemGlow);
        });
        
        // Create shining animations for gold coins - small but noticeable
        this.vineFlowIndicator.coinGlows = [];
        coinPositions.forEach((coin, index) => {
            // Convert texture coordinates to world coordinates
            const coinX = chestX + (coin.x - 50);
            const coinY = chestY + (coin.y - 37.5);
            
            // Small bright gold coin glow
            const coinGlow = this.add.circle(coinX, coinY, 4, 0xFFD700, 0.7);
            coinGlow.setOrigin(0.5, 0.5);
            coinGlow.setDepth(6);
            
            // Shining pulse animation - more noticeable
            this.tweens.add({
                targets: coinGlow,
                alpha: { from: 0.5, to: 0.9 },
                scale: { from: 0.95, to: 1.15 },
                duration: 700 + index * 120,
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut',
                delay: index * 150
            });
            
            // Small bright sparkle on coin
            const sparkle = this.add.circle(coinX, coinY, 1, 0xFFFFFF, 1.0);
            sparkle.setOrigin(0.5, 0.5);
            sparkle.setDepth(7);
            this.tweens.add({
                targets: sparkle,
                alpha: { from: 0.8, to: 1.0 },
                scale: { from: 0.8, to: 1.2 },
                duration: 600 + index * 100,
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut',
                delay: index * 100
            });
            
            // Occasional bright flash - smaller but noticeable
            this.time.addEvent({
                delay: 1800 + index * 350,
                callback: () => {
                    const flash = this.add.circle(coinX, coinY, 5, 0xFFFF00, 0.9);
                    flash.setOrigin(0.5, 0.5);
                    flash.setDepth(7);
                    this.tweens.add({
                        targets: flash,
                        alpha: 0,
                        scale: 1.3,
                        duration: 350,
                        onComplete: () => flash.destroy()
                    });
                },
                loop: true
            });
            
            this.vineFlowIndicator.coinGlows.push(coinGlow);
        });
        
        
        // Subtle chest bounce animation (like it's heavy)
        this.tweens.add({
            targets: this.vineFlowIndicator,
            y: { from: chestY - 1, to: chestY + 1 },
            duration: 2000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
        
        // Vine Flow state
        this.vineFlowIndicator.active = false;
        this.vineFlowIndicator.owner = null;
        this.vineFlowIndicator.cooldownTimer = 0;
        this.vineFlowIndicator.cooldownActive = false;
        
        // Cooldown timer text
        this.vineFlowIndicator.cooldownText = this.add.text(
            chestX,
            chestY - 45,
            '',
            {
                fontSize: '20px',
                fill: '#ff0000',
                fontStyle: 'bold',
                resolution: 2
            }
        ).setOrigin(0.5, 1).setDepth(10000);
        this.vineFlowIndicator.cooldownText.setVisible(false);
        
        // Lights Out games for each player on TV screens
        this.lightsOutP1 = this.createLightsOutGame(320, 610, 'Solari');
        this.lightsOutP2 = this.createLightsOutGame(960, 610, 'Umbrae');
        
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
        container.setDepth(10000);
        container.setAlpha(0);
        game.container = container;
        
        const gameSize = 200; // Fits better in TV screen
        const numVines = 5; // Changed to 5 to match 5 keys per player
        const vineSpacing = gameSize / (numVines + 1);
        const vineSize = 22; // Slightly smaller to fit better
        
        // Background - sized to fit in TV (TV is 480x200, so keep it compact)
        const bgHeight = 180; // Reduced height to fit better in TV (200px tall)
        const bg = this.add.rectangle(0, 0, gameSize + 20, bgHeight, game.baseColor);
        bg.setStrokeStyle(3, 0xffffff);
        container.add(bg);
        game.bg = bg;
        
        // Create 5 passcode displays in a row (moved up to make room for text below)
        const vines = [];
        const vineState = [];
        for (let i = 0; i < numVines; i++) {
            const x = -gameSize/2 + (i + 1) * vineSpacing;
            const y = -50; // Move displays up more to fit everything
            
            // Create passcode display sprite
            const vine = this.add.sprite(x, y, 'passcode-display');
            vine.setOrigin(0.5, 0.5);
            vine.index = i;
            vine.isOn = false;
            
            // Create digit text overlay (always visible)
            const digitText = this.add.text(x, y, '?', {
                fontSize: '16px',
                fill: '#666666',
                fontStyle: 'normal',
                resolution: 2
            });
            digitText.setOrigin(0.5, 0.5);
            digitText.setAlpha(0.4); // Start dimmed (off state)
            vine.digitText = digitText;
            
            // Glow effect when display is "on" (activated)
            vine.glow = this.add.circle(x, y, vineSize/2, game.onColor, 0);
            vine.glow.setOrigin(0.5, 0.5);
            vine.glow.setAlpha(0);
            container.add(vine.glow);
            container.add(vine);
            container.add(digitText);
            vines.push(vine);
            vineState.push(false);
        }
        game.vines = vines;
        game.vineState = vineState;
        game.numVines = numVines;
        
        // Key hint (showing which keys to use) - above vines, within TV bounds
        const keyHint = playerFaction === 'Solari' 
            ? this.add.text(0, -80, 'Keys: W A S D E', {
                fontSize: '12px',
                fill: '#ffffff',
                align: 'center',
                fontStyle: 'bold',
                resolution: 2
            })
            : this.add.text(0, -80, 'Keys: ↑ ↓ ← → /', {
                fontSize: '12px',
                fill: '#ffffff',
                align: 'center',
                fontStyle: 'bold',
                resolution: 2
            });
        keyHint.setOrigin(0.5, 0.5);
        container.add(keyHint);
        game.keyHint = keyHint;

        // Timer text (below vines, before instructions)
        const timerText = this.add.text(0, -10, '15', {
            fontSize: '14px',
            fill: '#ffff00',
            fontStyle: 'bold',
            resolution: 2
        }).setOrigin(0.5, 0.5);
        timerText.setVisible(false); // Hide until minigame actually starts
        container.add(timerText);
        game.timerText = timerText;
        
        // Instruction text (positioned within TV bounds)
        const goalText = playerFaction === 'Solari' 
            ? 'Light ALL vines ON (Sun rewards you!)' 
            : 'Light ALL vines ON (Darkness rewards you!)';
        const keyText = playerFaction === 'Solari' ? 'W/A/S/D/E' : '↑/↓/←/→//';
        const instructionText = this.add.text(0, 35, `HOW TO PLAY:\nPress keys ${keyText} to toggle vines.\nEach press affects that vine and its neighbors.\n${goalText}`, {
            fontSize: '9px',
            fill: '#ffffff',
            align: 'center',
            wordWrap: { width: gameSize - 10 },
            resolution: 2
        }).setOrigin(0.5, 0.5);
        container.add(instructionText);
        game.instructionText = instructionText;
        
        // Status text - add directly to scene, not container, so it's always visible
        // Position it at the bottom of the TV screen area (centerY is 600, TV goes to y=700)
        const statusText = this.add.text(centerX, centerY + 75, '', {
            fontSize: '12px',
            fill: '#ffff00',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 2,
            resolution: 2
        }).setOrigin(0.5, 0.5);
        statusText.setVisible(false); // Start hidden, show when needed
        statusText.setDepth(10001); // Make sure it's on top of everything
        game.statusText = statusText;
        
        return game;
    }

    createWindTotemDial() {
        // Create Wind Totem (Pixel Art Sprite)
        // Platform top is at 55 (70 - 15), totem is 50px high, so y=30 puts it on top
        this.windTotem = this.add.sprite(640, 35, 'totem-pixel');
        this.windTotem.setOrigin(0.5, 0.5);
        
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
                fontStyle: 'bold',
                resolution: 2
            }
        ).setOrigin(0.5, 1).setDepth(10000);
        this.windTotem.cooldownText.setVisible(false);
        
        // Simon Says games for each player on TV screens (aligned with TV centers)
        this.simonSaysP1 = this.createSimonSaysGame(320, 610, 'Solari'); // On Player 1's TV
        this.simonSaysP2 = this.createSimonSaysGame(960, 610, 'Umbrae'); // On Player 2's TV
        
        // Add glowing animations for eyes and runes
        this.addTotemGlows();
        
        this.puzzleNodes.windTotem = this.windTotem;
    }
    
    addTotemGlows() {
        const totemX = this.windTotem.x; // 640
        const totemY = this.windTotem.y; // 35
        // Texture is 50x60, center is at (25, 30)
        // Convert texture coordinates to world: worldX = totemX + (texX - 25), worldY = totemY + (texY - 30)
        
        // Eye positions (from texture coordinates)
        // Left eye center: (16 + 2.5, 10 + 2.5) = (18.5, 12.5)
        // Right eye center: (29 + 2.5, 10 + 2.5) = (31.5, 12.5)
        const leftEyeX = totemX + (18.5 - 25);
        const leftEyeY = totemY + (12.5 - 30);
        const rightEyeX = totemX + (31.5 - 25);
        const rightEyeY = totemY + (12.5 - 30);
        
        // Blue glow for left eye
        const leftEyeGlow = this.add.circle(leftEyeX, leftEyeY, 4, 0x00FFFF, 0.7);
        leftEyeGlow.setOrigin(0.5, 0.5);
        leftEyeGlow.setDepth(this.windTotem.depth + 1);
        this.tweens.add({
            targets: leftEyeGlow,
            alpha: { from: 0.5, to: 1.0 },
            scale: { from: 0.9, to: 1.3 },
            duration: 800,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
        
        // Blue glow for right eye
        const rightEyeGlow = this.add.circle(rightEyeX, rightEyeY, 4, 0x00FFFF, 0.7);
        rightEyeGlow.setOrigin(0.5, 0.5);
        rightEyeGlow.setDepth(this.windTotem.depth + 1);
        this.tweens.add({
            targets: rightEyeGlow,
            alpha: { from: 0.5, to: 1.0 },
            scale: { from: 0.9, to: 1.3 },
            duration: 800,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut',
            delay: 200 // Slight offset for visual interest
        });
        
        // Occasional bright flash for eyes
        this.time.addEvent({
            delay: 2500,
            callback: () => {
                const flash1 = this.add.circle(leftEyeX, leftEyeY, 6, 0x00FFFF, 0.9);
                flash1.setOrigin(0.5, 0.5);
                flash1.setDepth(this.windTotem.depth + 2);
                const flash2 = this.add.circle(rightEyeX, rightEyeY, 6, 0x00FFFF, 0.9);
                flash2.setOrigin(0.5, 0.5);
                flash2.setDepth(this.windTotem.depth + 2);
                this.tweens.add({
                    targets: [flash1, flash2],
                    alpha: 0,
                    scale: 1.5,
                    duration: 400,
                    onComplete: () => {
                        flash1.destroy();
                        flash2.destroy();
                    }
                });
            },
            loop: true
        });
        
        // Rune positions (from texture coordinates)
        // Top rune center: (25, 9)
        // Middle rune centers: (25, 21) and (25, 29)
        // Bottom rune center: (25, 39)
        const runePositions = [
            { x: totemX + (25 - 25), y: totemY + (9 - 30) },   // Top
            { x: totemX + (25 - 25), y: totemY + (21 - 30) },  // Middle top
            { x: totemX + (25 - 25), y: totemY + (29 - 30) },  // Middle bottom
            { x: totemX + (25 - 25), y: totemY + (39 - 30) }   // Bottom
        ];
        
        // Green glow for runes
        this.windTotem.runeGlows = [];
        runePositions.forEach((rune, index) => {
            const runeGlow = this.add.circle(rune.x, rune.y, 5, 0x00FF00, 0.6);
            runeGlow.setOrigin(0.5, 0.5);
            runeGlow.setDepth(this.windTotem.depth + 1);
            this.tweens.add({
                targets: runeGlow,
                alpha: { from: 0.4, to: 0.8 },
                scale: { from: 0.9, to: 1.2 },
                duration: 1000 + index * 150,
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut',
                delay: index * 200
            });
            
            // Small sparkle on runes
            const sparkle = this.add.circle(rune.x, rune.y, 1.5, 0xFFFFFF, 1.0);
            sparkle.setOrigin(0.5, 0.5);
            sparkle.setDepth(this.windTotem.depth + 2);
            this.tweens.add({
                targets: sparkle,
                alpha: { from: 0.8, to: 1.0 },
                scale: { from: 0.8, to: 1.2 },
                duration: 700 + index * 100,
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut',
                delay: index * 150
            });
            
            // Occasional bright flash for runes
            this.time.addEvent({
                delay: 3000 + index * 500,
                callback: () => {
                    const flash = this.add.circle(rune.x, rune.y, 6, 0x00FF00, 0.9);
                    flash.setOrigin(0.5, 0.5);
                    flash.setDepth(this.windTotem.depth + 2);
                    this.tweens.add({
                        targets: flash,
                        alpha: 0,
                        scale: 1.4,
                        duration: 350,
                        onComplete: () => flash.destroy()
                    });
                },
                loop: true,
                startAt: index * 400
            });
            
            this.windTotem.runeGlows.push(runeGlow);
        });
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
        
        const size = 10;
        const minDistance = size + 2; // Minimum distance between pixels to prevent overlap
        
        // Try to find a non-overlapping position (max 20 attempts)
        let pixel = null;
        for (let attempt = 0; attempt < 20; attempt++) {
        const index = Phaser.Math.Between(0, paintable.length - 1);
        const target = paintable[index];
        
        // Pick a random point inside the target block's bounds
        const halfW = target.width / 2;
        const halfH = target.height / 2;
        const x = Phaser.Math.Between(target.x - halfW + size / 2, target.x + halfW - size / 2);
        const y = Phaser.Math.Between(target.y - halfH + size / 2, target.y + halfH - size / 2);
        
            // Check if this position overlaps with any existing pixel
            let overlaps = false;
            for (const existingPixel of collection) {
                const distance = Phaser.Math.Distance.Between(x, y, existingPixel.x, existingPixel.y);
                if (distance < minDistance) {
                    overlaps = true;
                    break;
                }
            }
            
            // If no overlap, create the pixel
            if (!overlaps) {
                pixel = this.add.rectangle(x, y, size, size, color);
        pixel.setOrigin(0.5, 0.5);
                pixel.setAlpha(0.3); // More transparent and clear
        pixel.setDepth(1); // above background, roughly on top of geometry
        collection.push(pixel);
                break; // Successfully placed, exit loop
            }
        }
        
        // If we couldn't find a non-overlapping position after 20 attempts, skip spawning this pixel
    }
    
    createSimonSaysGame(centerX, centerY, playerFaction) {
        // Create Wind Totem rotation memory game on the TV screen
        // TV screen is 480x200, so gameSize should fit within 200px height
        const gameSize = 180; // Reduced to fit within TV height (200px)
        const playerColor = playerFaction === 'Solari' ? 0xFFD700 : 0x8B00FF;
        const baseColor = 0x000000; // TV background
        
        // Game elements container (for smooth animation)
        const container = this.add.container(centerX, centerY);
        container.setVisible(false);
        container.setDepth(10000);
        container.setAlpha(0); // Start invisible for fade-in
        
        // Store reference for repositioning
        if (playerFaction === 'Solari') {
            this.simonSaysContainerP1 = container;
        } else {
            this.simonSaysContainerP2 = container;
        }
        
        // Background (TV screen content) - fit within TV height
        const bg = this.add.rectangle(0, 0, gameSize, gameSize, baseColor);
        bg.setOrigin(0.5, 0.5);
        container.add(bg);
        
        // Title (inside the TV container) – shows the player's entered rotation sequence
        // Position within TV bounds: TV goes from y=500 to y=700, center at y=600
        // So we can use y=-90 to y=+90 relative to center (600)
        const title = this.add.text(0, -75, '', {
            fontSize: '16px',
            fill: '#ffffff',
            fontStyle: 'bold',
            resolution: 2
        }).setOrigin(0.5, 0.5);
        container.add(title);
        
        // Instruction text (inside TV container, at top)
        const instructionText = this.add.text(0, -85, '', {
            fontSize: '12px',
            fill: '#ffffff',
            resolution: 2
        }).setOrigin(0.5, 0.5);
        container.add(instructionText);
        instructionText.setDepth(10001); // above everything in the TV area
        
        // Round text ("Round X/N") at bottom of play area, within TV bounds
        const timerText = this.add.text(0, 75, 'Round 1/5', {
            fontSize: '16px',
            fill: '#ffff00',
            fontStyle: 'bold',
            resolution: 2
        }).setOrigin(0.5, 0.5);
        container.add(timerText);
        
        // Plain-text key hints to show what inputs are used,
        // and to highlight (in green) which directions the player has pressed.
        // Place them inside the TV container, just above the totem
        const isSolari = playerFaction === 'Solari';
        const upLabel = isSolari ? 'W' : '↑';
        const leftLabel = isSolari ? 'A' : '←';
        const downLabel = isSolari ? 'S' : '↓';
        const rightLabel = isSolari ? 'D' : '→';
        const keyStyle = { fontSize: '14px', fill: '#ffffff', resolution: 2 };
        
        // Position key hints inside TV, above totem
        const keyRowY = -50;
        const keyUpText = this.add.text(-60, keyRowY, upLabel, keyStyle).setOrigin(0.5, 0.5);
        const keyLeftText = this.add.text(-20, keyRowY, leftLabel, keyStyle).setOrigin(0.5, 0.5);
        const keyDownText = this.add.text(20, keyRowY, downLabel, keyStyle).setOrigin(0.5, 0.5);
        const keyRightText = this.add.text(60, keyRowY, rightLabel, keyStyle).setOrigin(0.5, 0.5);
        container.add(keyUpText);
        container.add(keyLeftText);
        container.add(keyDownText);
        container.add(keyRightText);
        keyUpText.setVisible(false);
        keyLeftText.setVisible(false);
        keyDownText.setVisible(false);
        keyRightText.setVisible(false);
        
        // === Totem of Undying–style figure on the TV (Centered Pixel Art) ===
        const totem = this.add.container(0, 0);
        
        // Use the new pixel art sprite for the TV totem
        const totemSprite = this.add.sprite(0, 0, 'totem-pixel');
        totemSprite.setScale(1.5); // Make it slightly larger for the TV
        
        // Face (eyes) - we add these ON TOP of the sprite so they can change color during minigame
        const eyeColor = playerColor;
        const eyeLeft = this.add.rectangle(-9, -19, 6, 6, eyeColor);
        const eyeRight = this.add.rectangle(9, -19, 6, 6, eyeColor);
        
        totem.add([totemSprite, eyeLeft, eyeRight]);
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

    update() {
        if (this.playersFrozen) {
            // Stop movement during countdown
            if (this.player1 && this.player1.body) this.player1.body.setVelocity(0, 0);
            if (this.player2 && this.player2.body) this.player2.body.setVelocity(0, 0);
            return;
        }
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
        // Rune sprite keys: [Orange (0), Cyan (1), Yellow (2)]
        const runeSpriteKeys = ['rune-pixel-3', 'rune-pixel-2', 'rune-pixel-1'];
        
        // Player 1 rune indicator - show orb's sprite with same shade and symbol
        if (this.player1.carriedRune !== null) {
            const runeSpriteKey = runeSpriteKeys[this.player1.carriedRune];
            if (!this.player1.runeIndicator) {
                // Create sprite indicator showing the actual rune
                this.player1.runeIndicator = this.add.sprite(this.player1.x, this.player1.y - 40, runeSpriteKey);
                this.player1.runeIndicator.setOrigin(0.5, 0.5);
                this.player1.runeIndicator.setScale(0.6); // Smaller than actual rune
                this.player1.runeIndicator.setDepth(10000);
            } else {
                // Update sprite if rune changed
                if (this.player1.runeIndicator.texture.key !== runeSpriteKey) {
                    this.player1.runeIndicator.setTexture(runeSpriteKey);
                }
                this.player1.runeIndicator.setPosition(this.player1.x, this.player1.y - 40);
                this.player1.runeIndicator.setVisible(true);
            }
        } else if (this.player1.runeIndicator) {
            this.player1.runeIndicator.setVisible(false);
        }
        
        // Player 2 rune indicator - show orb's sprite with same shade and symbol
        if (this.player2.carriedRune !== null) {
            const runeSpriteKey = runeSpriteKeys[this.player2.carriedRune];
            if (!this.player2.runeIndicator) {
                // Create sprite indicator showing the actual rune
                this.player2.runeIndicator = this.add.sprite(this.player2.x, this.player2.y - 40, runeSpriteKey);
                this.player2.runeIndicator.setOrigin(0.5, 0.5);
                this.player2.runeIndicator.setScale(0.6); // Smaller than actual rune
                this.player2.runeIndicator.setDepth(10000);
            } else {
                // Update sprite if rune changed
                if (this.player2.runeIndicator.texture.key !== runeSpriteKey) {
                    this.player2.runeIndicator.setTexture(runeSpriteKey);
                }
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
            const vineTop = vine.getTopCenter().y;
            const vineBottom = vine.getBottomCenter().y;
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
                
                // Spawn falling particles while climbing - less frequent
                const currentTime = this.time.now;
                if (currentTime - this.player1.lastParticleTime > 100) { // Spawn particle every 100ms (less frequent)
                    this.spawnVineParticle(this.player1);
                    this.player1.lastParticleTime = currentTime;
                }
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
            const vineTop = vine.getTopCenter().y;
            const vineBottom = vine.getBottomCenter().y;
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
                
                // Spawn falling particles while climbing - less frequent
                const currentTime = this.time.now;
                if (currentTime - this.player2.lastParticleTime > 100) { // Spawn particle every 100ms (less frequent)
                    this.spawnVineParticle(this.player2);
                    this.player2.lastParticleTime = currentTime;
                }
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

    spawnVineParticle(player) {
        // Create pixelated green falling particles (leaves/debris)
        const particleColors = [0x228B22, 0x32CD32, 0x3CB371, 0x2E8B57, 0x6B8E23, 0x556B2F, 0x8FBC8F, 0x90EE90]; // Various shades of green
        const color = particleColors[Math.floor(Math.random() * particleColors.length)];
        
        // Spawn pixelated particle near player's position
        const offsetX = (Math.random() - 0.5) * 30; // Horizontal spread
        const particleSize = 3 + Math.floor(Math.random() * 3); // Pixel sizes: 3, 4, or 5px (pixelated)
        
        // Use rectangle for pixelated look instead of circle
        const particle = this.add.rectangle(player.x + offsetX, player.y + 15, particleSize, particleSize, color, 1.0);
        particle.setOrigin(0.5, 0.5);
        particle.setDepth(player.depth - 1); // Behind player
        
        // Animate pixelated particle falling and fading
        const fallDistance = 40 + Math.random() * 50;
        const fallSpeed = 400 + Math.random() * 300; // Slower fall
        const horizontalDrift = (Math.random() - 0.5) * 60;
        
        this.tweens.add({
            targets: particle,
            y: particle.y + fallDistance,
            x: particle.x + horizontalDrift,
            alpha: { from: 1.0, to: 0 },
            scale: { from: 1, to: 0.4 },
            duration: fallSpeed,
            ease: 'Power1',
            onComplete: () => {
                particle.destroy();
                // Remove from array
                const index = player.vineParticles.indexOf(particle);
                if (index > -1) {
                    player.vineParticles.splice(index, 1);
                }
            }
        });
        
        player.vineParticles.push(particle);
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
            const vineTop = vine.getTopCenter().y;
            const vineBottom = vine.getBottomCenter().y;
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
                    ? this.add.text(0, 0, 'W', { fontSize: '24px', fill: '#000000', fontStyle: 'bold', resolution: 2 })
                    : this.add.text(0, -2, '↑', { fontSize: '24px', fill: '#000000', fontStyle: 'bold', resolution: 2 });
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
                // HARDCODED: Spawn middle rune at random reachable platform position
                // Filter out any positions that might be behind pillars or puzzles
                const safePositions = this.reachablePlatformPositions.filter(pos => {
                    // Double-check against current pillar and puzzle positions
                    const blockedAreas = [
                        { x: 130, y: 217, radius: 60 },   // Left pillar
                        { x: 640, y: 350, radius: 60 },   // Middle pillar
                        { x: 1150, y: 217, radius: 60 },   // Right pillar
                        { x: 640, y: 250, radius: 200 },  // Vine block puzzle
                        { x: 640, y: 55, radius: 150 }     // Wind totem
                    ];
                    for (const blocked of blockedAreas) {
                        const distance = Phaser.Math.Distance.Between(pos.x, pos.y, blocked.x, blocked.y);
                        if (distance < blocked.radius) {
                            return false;
                        }
                    }
                    return true;
                });
            
                // Only spawn if we have safe positions
                if (safePositions.length > 0) {
                    const randomPos = Phaser.Utils.Array.GetRandom(safePositions);
                    middleRune.x = randomPos.x;
                    middleRune.y = randomPos.y;
                    middleRune.glow.x = randomPos.x;
                    middleRune.glow.y = randomPos.y;
                    middleRune.setVisible(true);
                    middleRune.glow.setVisible(true);
                    middleRune.collected = false;
                    this.middleRuneSpawned = true;
                    this.middleRuneTimerText.setVisible(false);
                    // Resume glow animation when rune spawns
                    if (middleRune.glowTween) {
                        middleRune.glowTween.resume();
                    }
                    // Start bounce animation when rune spawns
                    if (middleRune.bounceTween) {
                        middleRune.bounceTween.resume();
                    }
                    if (middleRune.glowBounceTween) {
                        middleRune.glowBounceTween.resume();
                    }
                } else {
                    // Fallback: spawn at a guaranteed safe position if all are blocked
                    middleRune.x = 300;
                    middleRune.y = 332;
                    middleRune.glow.x = 300;
                    middleRune.glow.y = 332;
                    middleRune.setVisible(true);
                    middleRune.glow.setVisible(true);
                    middleRune.collected = false;
                    this.middleRuneSpawned = true;
                    this.middleRuneTimerText.setVisible(false);
                    // Resume glow animation when rune spawns
                    if (middleRune.glowTween) {
                        middleRune.glowTween.resume();
                    }
                    // Start bounce animation when rune spawns
                    if (middleRune.bounceTween) {
                        middleRune.bounceTween.resume();
                    }
                    if (middleRune.glowBounceTween) {
                        middleRune.glowBounceTween.resume();
                    }
                }
            } else {
                // Update timer text
                const seconds = Math.floor(this.middleRuneSpawnTimer);
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
        // Mapping: runeIndex 0 (orange) -> pillar 2 (right), runeIndex 1 (cyan) -> pillar 1 (middle), runeIndex 2 (yellow) -> pillar 0 (left)
        const runeToPillarMap = { 0: 2, 1: 1, 2: 0 }; // Orange->Right, Cyan->Middle, Yellow->Left
        
        // HARDCODED: Runes can only be placed in matching pillars
        this.runesPillars.forEach((pillar, index) => {
            // Increase distance check for middle pillar (index 1) to make it easier to place runes
            const distanceThreshold = index === 1 ? 80 : 60; // Middle pillar gets larger interaction radius
            const p1Near = Phaser.Math.Distance.Between(this.player1.x, this.player1.y, pillar.x, pillar.y) < distanceThreshold;
            const p2Near = Phaser.Math.Distance.Between(this.player2.x, this.player2.y, pillar.x, pillar.y) < distanceThreshold;
            
            // Player 1 places rune - ONLY if it matches the pillar
            if (p1Near && this.player1.carriedRune !== null) {
                const wPressed = Phaser.Input.Keyboard.JustDown(this.wKey);
                if (wPressed && runeToPillarMap[this.player1.carriedRune] === index) {
                    // Hide the rune that was placed
                    const placedRuneIndex = this.player1.carriedRune;
                    const placedRune = this.runes[placedRuneIndex];
                    if (placedRune) {
                        placedRune.setVisible(false);
                        placedRune.glow.setVisible(false);
                        placedRune.collected = false;
                    }
                    
                    // Place rune in pillar
                    pillar.hasRune = true;
                    pillar.owner = this.player1.faction;
                    
            // Set color based on the rune that was placed (not pillar index)
            const runeColors = [0xFF4500, 0x00FFFF, 0xFFD700]; // Orange (0), Cyan (1), Yellow (2)
            const targetColor = runeColors[placedRuneIndex];
                    
                    pillar.setTint(targetColor); 
                    pillar.glow.setFillStyle(targetColor);
                    pillar.glow.setAlpha(0.6);
                    this.player1.carriedRune = null;
                    
                    // If middle rune was placed, respawn it after 25 seconds
                    if (placedRuneIndex === 1) {
                        this.middleRuneSpawned = false;
                        this.middleRuneSpawnTimer = 25;
                        this.middleRuneTimerText.setVisible(true);
                    }
                }
            }
            
            // Player 2 places rune - ONLY if it matches the pillar
            if (p2Near && this.player2.carriedRune !== null) {
                const upPressed = Phaser.Input.Keyboard.JustDown(this.upKey);
                if (upPressed && runeToPillarMap[this.player2.carriedRune] === index) {
                    // Hide the rune that was placed
                    const placedRuneIndex = this.player2.carriedRune;
                    const placedRune = this.runes[placedRuneIndex];
                    if (placedRune) {
                        placedRune.setVisible(false);
                        placedRune.glow.setVisible(false);
                        placedRune.collected = false;
                    }
                    
                    // Place rune in pillar
                    pillar.hasRune = true;
                    pillar.owner = this.player2.faction;
                    
                    // Set color based on the rune that was placed (not pillar index)
                    const runeColors = [0xFF4500, 0x00FFFF, 0xFFD700]; // Orange (0), Cyan (1), Yellow (2)
                    const targetColor = runeColors[placedRuneIndex];
                    
                    pillar.setTint(targetColor); 
                    pillar.glow.setFillStyle(targetColor);
                    pillar.glow.setAlpha(0.6);
                    this.player2.carriedRune = null;
                    
                    // If middle rune was placed, respawn it after 25 seconds
                    if (placedRuneIndex === 1) {
                        this.middleRuneSpawned = false;
                        this.middleRuneSpawnTimer = 25;
                        this.middleRuneTimerText.setVisible(true);
                    }
                }
            }
            
            // Visual feedback - show glow when player is near with the CORRECT rune
            const p1HasCorrectRune = p1Near && this.player1.carriedRune !== null && runeToPillarMap[this.player1.carriedRune] === index;
            const p2HasCorrectRune = p2Near && this.player2.carriedRune !== null && runeToPillarMap[this.player2.carriedRune] === index;
            if (p1HasCorrectRune || p2HasCorrectRune) {
                pillar.glow.setAlpha(0.4);
                pillar.glow.setFillStyle(0xffff00); // Yellow hint
            } else if (!pillar.hasRune) {
                pillar.glow.setAlpha(0);
            }
        });
        
        // HARDCODED: Calculate influence based on pillars owned - always works correctly
        let solariPillars = 0;
        let umbraePillars = 0;
        
        // Count pillars owned by each faction
        this.runesPillars.forEach(pillar => {
            if (pillar.hasRune && pillar.owner === 'Solari') {
                solariPillars++;
            }
            if (pillar.hasRune && pillar.owner === 'Umbrae') {
                umbraePillars++;
            }
        });
        
        // HARDCODED: Set influence - 2/sec per pillar (1=2, 2=4, 3=6)
        // Solari gets positive, Umbrae gets negative (will be converted to positive in update)
        this.puzzleInfluence.forestRunes = (solariPillars * 2) - (umbraePillars * 2);
    }

    updateVineFlowPuzzle() {
        const indicator = this.vineFlowIndicator;
        
        // Middle platform bounds: x: 640, y: 250, width: 400, height: 30
        // Platform horizontal range: 440 to 840 (640 ± 200)
        // Platform top: y: 235 (250 - 15)
        // Player must be on the platform to trigger (within platform bounds and standing on top)
        const platformLeft = 440;
        const platformRight = 840;
        const platformTop = 235;
        
        // Check if player is on the middle platform
        // Player is 50x50, so player bottom = player.y + 25
        // Player is on platform if: horizontal overlap AND player bottom is on platform top
        const checkPlayerOnPlatform = (player) => {
            const playerBottom = player.y + 25; // Player height is 50, so bottom = center + 25
            const horizontalOverlap = player.x >= platformLeft && player.x <= platformRight;
            const onPlatformTop = playerBottom >= platformTop - 5 && playerBottom <= platformTop + 15 && player.body.touching.down;
            return horizontalOverlap && onPlatformTop;
        };
        
        const p1OnPlatform = checkPlayerOnPlatform(this.player1);
        const p2OnPlatform = checkPlayerOnPlatform(this.player2);
        
        // Only trigger if player is on the platform and near the indicator
        const horizontalDist1 = Math.abs(this.player1.x - indicator.x);
        const p1Near = p1OnPlatform && horizontalDist1 < 80;
        
        const horizontalDist2 = Math.abs(this.player2.x - indicator.x);
        const p2Near = p2OnPlatform && horizontalDist2 < 80;
        
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
                        ? this.add.text(0, 0, 'W', { fontSize: '24px', fill: '#000000', fontStyle: 'bold', resolution: 2 })
                        : this.add.text(0, -2, '↑', { fontSize: '24px', fill: '#000000', fontStyle: 'bold', resolution: 2 });
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
        
        // Top platform bounds: x=640, y=70, width=300, height=30
        // Platform top = 70 - 15 = 55, Platform bottom = 70 + 15 = 85
        // Platform left = 640 - 150 = 490, Platform right = 640 + 150 = 790
        const topPlatformTop = 55;
        const topPlatformBottom = 85;
        const topPlatformLeft = 490;
        const topPlatformRight = 790;
        
        // Check if players are near totem AND on the top platform
        const checkPlayerOnTopPlatform = (player) => {
            const playerBottom = player.y + 25; // Player is 50x50, so bottom = y + 25
            const playerTop = player.y - 25;
            const isNearTotem = Phaser.Math.Distance.Between(player.x, player.y, totem.x, totem.y) < 80;
            const isOnTopPlatform = player.x >= topPlatformLeft && player.x <= topPlatformRight &&
                                   playerBottom >= topPlatformTop - 5 && playerBottom <= topPlatformTop + 15 &&
                                   playerTop <= topPlatformBottom &&
                                   player.body.touching.down; // Must be touching ground/platform
            return isNearTotem && isOnTopPlatform;
        };
        
        const p1Near = checkPlayerOnTopPlatform(this.player1);
        const p2Near = checkPlayerOnTopPlatform(this.player2);
        
        // Show a circular key indicator above each player when they walk up to the totem
        const updateTotemIndicator = (player, near) => {
            if (near && !player.teleporting && !this.simonSaysP1.active && !this.simonSaysP2.active) {
                if (!player.totemIndicator) {
                    const indicatorGroup = this.add.container(player.x, player.y - 50);
                    const circle = this.add.circle(0, 0, 25, 0xffffff, 0.9);
                    circle.setStrokeStyle(3, 0x000000);
                    const keyText = player.faction === 'Solari'
                        ? this.add.text(0, 0, 'W', { fontSize: '24px', fill: '#000000', fontStyle: 'bold', resolution: 2 })
                        : this.add.text(0, -2, '↑', { fontSize: '24px', fill: '#000000', fontStyle: 'bold', resolution: 2 });
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
        // Only allow if no game is currently active, player is not teleporting, AND player is on top platform
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
                    totem.clearTint();
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
            // Make sure player 2 is visible if they were in a puzzle
            if (this.player2 && this.player2.teleporting) {
                this.player2.setVisible(true);
                this.player2.teleporting = false;
                if (this.player2.body) {
                    this.player2.body.enable = true;
                }
            }
        } else {
            this.hideSimonSays(this.simonSaysP1);
            // Make sure player 1 is visible if they were in a puzzle
            if (this.player1 && this.player1.teleporting) {
                this.player1.setVisible(true);
                this.player1.teleporting = false;
                if (this.player1.body) {
                    this.player1.body.enable = true;
                }
            }
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
        
        // Safety check: ensure both players are visible
        if (this.player1 && !this.player1.teleporting) {
            this.player1.setVisible(true);
            if (this.player1.body && !this.player1.body.enable) {
                this.player1.body.enable = true;
            }
        }
        if (this.player2 && !this.player2.teleporting) {
            this.player2.setVisible(true);
            if (this.player2.body && !this.player2.body.enable) {
                this.player2.body.enable = true;
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
            this.windTotem.setTint(glowColor);
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
        // Keep player visible - don't despawn
        // player.setVisible(false);
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
            // Make sure player 2 is visible if they were in a puzzle
            if (this.player2 && this.player2.teleporting) {
                this.player2.setVisible(true);
                this.player2.teleporting = false;
                if (this.player2.body) {
                    this.player2.body.enable = true;
                }
            }
        } else {
            if (this.lightsOutP1 && this.lightsOutP1.container) {
                this.lightsOutP1.container.setVisible(false);
                this.lightsOutP1.container.setAlpha(0);
                this.lightsOutP1.active = false;
            }
            // Make sure player 1 is visible if they were in a puzzle
            if (this.player1 && this.player1.teleporting) {
                this.player1.setVisible(true);
                this.player1.teleporting = false;
                if (this.player1.body) {
                    this.player1.body.enable = true;
                }
            }
        }
        
        game.active = true;
        game.player = player;
        game.completed = false;
        game.phase = 'intro';
        game.introTimer = 0;
        game.timer = 15; // Reset timer to 15 seconds
        
        // Initialize keys immediately when game starts
        if (game.playerFaction === 'Solari') {
            // Player 1: W, A, S, D, E
            game.numKeys = {
                'W': this.wKey,
                'A': this.aKey,
                'S': this.sKey,
                'D': this.dKey,
                'E': this.eKey
            };
            game.keyMap = { 'W': 0, 'A': 1, 'S': 2, 'D': 3, 'E': 4 };
        } else {
            // Player 2: Up, Down, Left, Right, / (slash)
            game.numKeys = {
                'UP': this.upKey,
                'DOWN': this.downKey,
                'LEFT': this.leftKey,
                'RIGHT': this.rightKey,
                'SLASH': this.slashKey
            };
            game.keyMap = { 'UP': 0, 'DOWN': 1, 'LEFT': 2, 'RIGHT': 3, 'SLASH': 4 };
        }
        
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
        const numVines = 5; // Changed to 5 to match 5 keys per player
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
        const numVines = game.vines.length;
        const opponentOwns = game.currentOwner && game.currentOwner !== game.playerFaction;
        
        // Passcode digits to display (0-9, cycling)
        const digits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
        
        for (let i = 0; i < numVines; i++) {
            const vine = game.vines[i];
            if (!vine) continue;
            const isOn = game.vineState[i];
            vine.isOn = isOn;
            
            // Always show the digit text
            if (vine.digitText) {
                vine.digitText.setVisible(true);
                vine.digitText.setText(digits[i % 10]); // Cycle through digits
            }
            
            if (isOn) {
                // If opponent owns it and player hasn't toggled this vine yet, show opponent's color
                // Once player toggles it, show player's color
                const color = (opponentOwns && !game.vineToggled[i]) 
                    ? game.opponentColor 
                    : game.onColor;
                
                // Show passcode display as active - bright and colored
                vine.setTint(0xffffff); // White/neutral tint for active display
                vine.glow.setFillStyle(color);
                vine.glow.setAlpha(0.6);
                
                // Show digit text bright and colored (ON state)
                if (vine.digitText) {
                    const colorObj = Phaser.Display.Color.IntegerToColor(color);
                    vine.digitText.setFill(colorObj.rgba);
                    vine.digitText.setAlpha(1.0); // Fully visible
                    vine.digitText.setStyle({ fontSize: '20px', fontStyle: 'bold' }); // Bright and bold
                }
            } else {
                // OFF = dark/unlit (unowned or toggled off)
                vine.setTint(0x333333); // Dark tint for inactive display
                vine.glow.setAlpha(0);
                
                // Show digit text dimmed (OFF state)
                if (vine.digitText) {
                    vine.digitText.setFill('#666666'); // Dark gray for off state
                    vine.digitText.setAlpha(0.4); // Dimmed
                    vine.digitText.setStyle({ fontSize: '18px', fontStyle: 'normal' }); // Smaller and not bold
                }
            }
        }
    }
    
    toggleLightsOutVine(game, index) {
        const numVines = game.vines.length;
        
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
        const numVines = game.vines.length;
        
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
            const keyHint = game.playerFaction === 'Solari' ? '1-6' : '5-0';
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
            
            // Keys should already be initialized in startLightsOut, but check just in case
            if (!game.numKeys) {
                if (game.playerFaction === 'Solari') {
                    // Player 1: W, A, S, D, E
                    game.numKeys = {
                        'W': this.wKey,
                        'A': this.aKey,
                        'S': this.sKey,
                        'D': this.dKey,
                        'E': this.eKey
                    };
                    game.keyMap = { 'W': 0, 'A': 1, 'S': 2, 'D': 3, 'E': 4 };
                } else {
                    // Player 2: Up, Down, Left, Right, / (slash)
                    game.numKeys = {
                        'UP': this.upKey,
                        'DOWN': this.downKey,
                        'LEFT': this.leftKey,
                        'RIGHT': this.rightKey,
                        'SLASH': this.slashKey
                    };
                    game.keyMap = { 'UP': 0, 'DOWN': 1, 'LEFT': 2, 'RIGHT': 3, 'SLASH': 4 };
                }
            }
            
            // Check for key presses
            if (game.playerFaction === 'Solari') {
                // Player 1: W, A, S, D, E
                if (Phaser.Input.Keyboard.JustDown(game.numKeys['W'])) {
                    if (game.active && game.phase === 'playing') {
                        this.toggleLightsOutVine(game, game.keyMap['W']);
                    }
                }
                if (Phaser.Input.Keyboard.JustDown(game.numKeys['A'])) {
                    if (game.active && game.phase === 'playing') {
                        this.toggleLightsOutVine(game, game.keyMap['A']);
                    }
                }
                if (Phaser.Input.Keyboard.JustDown(game.numKeys['S'])) {
                    if (game.active && game.phase === 'playing') {
                        this.toggleLightsOutVine(game, game.keyMap['S']);
                    }
                }
                if (Phaser.Input.Keyboard.JustDown(game.numKeys['D'])) {
                    if (game.active && game.phase === 'playing') {
                        this.toggleLightsOutVine(game, game.keyMap['D']);
                    }
                }
                if (Phaser.Input.Keyboard.JustDown(game.numKeys['E'])) {
                    if (game.active && game.phase === 'playing') {
                        this.toggleLightsOutVine(game, game.keyMap['E']);
                    }
                }
            } else {
                // Player 2: Up, Down, Left, Right, /
                if (Phaser.Input.Keyboard.JustDown(game.numKeys['UP'])) {
                    if (game.active && game.phase === 'playing') {
                        this.toggleLightsOutVine(game, game.keyMap['UP']);
                    }
                }
                if (Phaser.Input.Keyboard.JustDown(game.numKeys['DOWN'])) {
                    if (game.active && game.phase === 'playing') {
                        this.toggleLightsOutVine(game, game.keyMap['DOWN']);
                    }
                }
                if (Phaser.Input.Keyboard.JustDown(game.numKeys['LEFT'])) {
                    if (game.active && game.phase === 'playing') {
                        this.toggleLightsOutVine(game, game.keyMap['LEFT']);
                    }
                }
                if (Phaser.Input.Keyboard.JustDown(game.numKeys['RIGHT'])) {
                    if (game.active && game.phase === 'playing') {
                        this.toggleLightsOutVine(game, game.keyMap['RIGHT']);
                    }
                }
                if (Phaser.Input.Keyboard.JustDown(game.numKeys['SLASH'])) {
                    if (game.active && game.phase === 'playing') {
                        this.toggleLightsOutVine(game, game.keyMap['SLASH']);
                    }
                }
            }
            
            // Check if puzzle is complete after any toggle
            if (game.active && game.phase === 'playing') {
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
        
        // Safety check: ensure both players are visible
        if (this.player1 && !this.player1.teleporting) {
            this.player1.setVisible(true);
            if (this.player1.body && !this.player1.body.enable) {
                this.player1.body.enable = true;
            }
        }
        if (this.player2 && !this.player2.teleporting) {
            this.player2.setVisible(true);
            if (this.player2.body && !this.player2.body.enable) {
                this.player2.body.enable = true;
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
        
        // HARDCODED: Forest Runes influence (2/sec per pillar: 1=2, 2=4, 3=6) - always works
        // Count pillars directly to ensure it always works
        let solariPillarCount = 0;
        let umbraePillarCount = 0;
        this.runesPillars.forEach(pillar => {
            if (pillar.hasRune && pillar.owner === 'Solari') {
                solariPillarCount++;
            }
            if (pillar.hasRune && pillar.owner === 'Umbrae') {
                umbraePillarCount++;
            }
        });
        // Apply influence directly - 2/sec per pillar
        solariInfluencePerSec += solariPillarCount * 2;
        umbraeInfluencePerSec += umbraePillarCount * 2;
        
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
                fontStyle: 'bold',
                resolution: 2
            }).setOrigin(0.5, 0.5).setDepth(10000);
        } else {
            winnerText = this.add.text(640, 300, 'NO RESULT', { 
                fontSize: '48px', 
                fill: '#888888',
                fontStyle: 'bold',
                resolution: 2
            }).setOrigin(0.5, 0.5).setDepth(10000);
        }
        
        const finalScoreText = this.add.text(640, 360, 
            `Solari: ${Math.floor(this.player1Influence)} | Umbrae: ${Math.floor(this.player2Influence)}`, 
            { fontSize: '24px', fill: '#ffffff', resolution: 2 }
        ).setOrigin(0.5, 0.5).setDepth(10000);
        
        // Stop game updates
        this.scene.pause();
        
        // In future, transition to next level
        // this.scene.start('VolcanoLevel');
    }
}