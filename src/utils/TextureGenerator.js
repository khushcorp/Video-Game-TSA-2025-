export class TextureGenerator {
    static createAllTextures(scene) {
        TextureGenerator.createVineTexture(scene);
        TextureGenerator.createTotemTexture(scene);
        TextureGenerator.createTVStaticTexture(scene);
        TextureGenerator.createTVFrames(scene);
        TextureGenerator.createPasscodeDisplay(scene);
        TextureGenerator.createTreasureChest(scene);
        TextureGenerator.createTorchPillar(scene);
        TextureGenerator.createFlameAnimation(scene);
        TextureGenerator.createPillarRuneTextures(scene);
        TextureGenerator.createBackgroundTemple(scene);
        TextureGenerator.createGroundTexture(scene);
        TextureGenerator.createPlatformTextures(scene);
        // New layered background system
        TextureGenerator.createBackgroundLayer1Sky(scene);
        TextureGenerator.createBackgroundLayer0Jungle(scene); // Deepest layer - jungle trees
        TextureGenerator.createBackgroundLayer2Temple(scene);
        TextureGenerator.createBackgroundLayer3Framing(scene);
        TextureGenerator.createBackgroundFogLayer(scene);
    }

    static createVineTexture(scene) {
        if (scene.textures.exists('vine-pixel')) return;
        const canvas = scene.textures.createCanvas('vine-pixel', 32, 32);
        const ctx = canvas.context;
        ctx.fillStyle = '#1B3D0A';
        ctx.fillRect(12, 0, 8, 8); ctx.fillRect(14, 8, 8, 8); ctx.fillRect(16, 16, 8, 8); ctx.fillRect(14, 24, 8, 8);
        ctx.fillStyle = '#0F2405';
        ctx.fillRect(12, 0, 3, 8); ctx.fillRect(14, 8, 3, 8); ctx.fillRect(16, 16, 3, 8); ctx.fillRect(14, 24, 3, 8);
        ctx.fillStyle = '#3D6B1F';
        ctx.fillRect(10, 4, 2, 2); ctx.fillRect(22, 12, 2, 2); ctx.fillRect(24, 20, 2, 2); ctx.fillRect(12, 28, 2, 2);
        ctx.fillStyle = '#2D5016';
        ctx.fillRect(4, 2, 8, 6); ctx.fillRect(6, 0, 4, 2); ctx.fillRect(6, 8, 4, 2);
        ctx.fillRect(24, 14, 8, 6); ctx.fillRect(26, 12, 4, 2); ctx.fillRect(26, 20, 4, 2);
        ctx.fillRect(6, 24, 8, 6); ctx.fillRect(8, 22, 4, 2); ctx.fillRect(8, 30, 4, 2);
        ctx.fillStyle = '#4A8C2D';
        ctx.fillRect(6, 3, 3, 2); ctx.fillRect(26, 15, 3, 2); ctx.fillRect(8, 25, 3, 2);
        ctx.fillStyle = '#89B84C';
        ctx.fillRect(10, 4, 2, 2); ctx.fillRect(24, 16, 2, 2); ctx.fillRect(12, 26, 2, 2);
        canvas.refresh();
    }

    static createTotemTexture(scene) {
        if (scene.textures.exists('totem-pixel')) return;
        const canvas = scene.textures.createCanvas('totem-pixel', 50, 60);
        const ctx = canvas.context;
        ctx.fillStyle = '#B8860B';
        ctx.fillRect(10, 3, 30, 8); ctx.fillRect(12, 11, 26, 20); ctx.fillRect(14, 31, 22, 18);
        ctx.fillStyle = '#FFD700';
        ctx.fillRect(12, 5, 26, 6); ctx.fillRect(14, 13, 22, 18); ctx.fillRect(16, 33, 18, 16);
        ctx.fillStyle = '#DAA520';
        ctx.fillRect(28, 5, 4, 6); ctx.fillRect(30, 13, 4, 18); ctx.fillRect(30, 33, 4, 16);
        ctx.fillStyle = '#FFE55C';
        ctx.fillRect(12, 5, 2, 6); ctx.fillRect(14, 13, 2, 18); ctx.fillRect(16, 33, 2, 16);
        ctx.fillStyle = '#B8860B';
        ctx.fillRect(18, 0, 14, 4); ctx.fillRect(20, 1, 10, 2); ctx.fillRect(16, 2, 2, 2); ctx.fillRect(32, 2, 2, 2);
        ctx.fillStyle = '#B8860B';
        ctx.fillRect(0, 18, 12, 3); ctx.fillRect(1, 21, 10, 8); ctx.fillRect(2, 29, 8, 4); ctx.fillRect(3, 33, 6, 2);
        ctx.fillStyle = '#FFD700';
        ctx.fillRect(2, 19, 8, 2); ctx.fillRect(3, 22, 6, 6); ctx.fillRect(4, 30, 4, 2);
        ctx.fillStyle = '#B8860B';
        ctx.fillRect(38, 18, 12, 3); ctx.fillRect(39, 21, 10, 8); ctx.fillRect(40, 29, 8, 4); ctx.fillRect(41, 33, 6, 2);
        ctx.fillStyle = '#FFD700';
        ctx.fillRect(40, 19, 8, 2); ctx.fillRect(41, 22, 6, 6); ctx.fillRect(42, 30, 4, 2);
        ctx.fillStyle = '#B8860B';
        ctx.fillRect(8, 12, 3, 2); ctx.fillRect(7, 14, 2, 1); ctx.fillRect(9, 25, 3, 2); ctx.fillRect(8, 27, 2, 1);
        ctx.fillRect(39, 12, 3, 2); ctx.fillRect(41, 14, 2, 1); ctx.fillRect(38, 25, 3, 2); ctx.fillRect(40, 27, 2, 1);
        ctx.fillStyle = '#006400';
        ctx.fillRect(18, 8, 14, 2); ctx.fillRect(20, 6, 2, 4); ctx.fillRect(28, 6, 2, 4);
        ctx.fillRect(18, 20, 14, 2); ctx.fillRect(18, 28, 14, 2); ctx.fillRect(24, 20, 2, 10);
        ctx.fillRect(18, 38, 14, 2); ctx.fillRect(20, 40, 2, 4); ctx.fillRect(28, 40, 2, 4); ctx.fillRect(22, 42, 6, 2);
        ctx.fillRect(16, 15, 2, 3); ctx.fillRect(32, 15, 2, 3); ctx.fillRect(16, 32, 2, 3); ctx.fillRect(32, 32, 2, 3);
        ctx.fillStyle = '#00FFFF';
        ctx.fillRect(16, 10, 5, 5); ctx.fillRect(29, 10, 5, 5);
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(17, 11, 2, 2); ctx.fillRect(30, 11, 2, 2);
        ctx.fillStyle = '#00FFFF';
        ctx.globalAlpha = 0.3;
        ctx.fillRect(14, 8, 3, 2); ctx.fillRect(33, 8, 3, 2);
        ctx.globalAlpha = 1.0;
        ctx.fillStyle = '#4B3621';
        ctx.fillRect(22, 17, 6, 2); ctx.fillRect(23, 19, 4, 1);
        ctx.fillStyle = '#B8860B';
        ctx.fillRect(20, 20, 10, 3); ctx.fillRect(21, 23, 8, 2);
        ctx.fillStyle = '#00FF00';
        ctx.fillRect(4, 24, 4, 4); ctx.fillRect(42, 24, 4, 4); ctx.fillRect(6, 28, 2, 2); ctx.fillRect(42, 28, 2, 2);
        ctx.fillStyle = '#8B6914';
        ctx.fillRect(14, 49, 22, 2); ctx.fillRect(16, 51, 18, 1); ctx.fillRect(10, 47, 2, 4); ctx.fillRect(38, 47, 2, 4);
        canvas.refresh();
        scene.textures.get('totem-pixel').setFilter(Phaser.Textures.FilterMode.NEAREST);
    }

    static createTVStaticTexture(scene) {
        if (scene.textures.exists('tv-static-frame-0')) return;
        for (let frame = 0; frame < 4; frame++) {
            const canvas = scene.textures.createCanvas(`tv-static-frame-${frame}`, 500, 220);
            const ctx = canvas.context;
            for (let y = 0; y < 220; y += 2) {
                for (let x = 0; x < 500; x += 2) {
                    const noise = Math.random();
                    if (noise > 0.7) {
                        ctx.fillStyle = `rgba(255, 255, 255, ${Math.random() * 0.3})`;
                        ctx.fillRect(x, y, 2, 2);
                    } else if (noise < 0.1) {
                        ctx.fillStyle = `rgba(0, 0, 0, ${Math.random() * 0.2})`;
                        ctx.fillRect(x, y, 2, 2);
                    }
                }
            }
            canvas.refresh();
            scene.textures.get(`tv-static-frame-${frame}`).setFilter(Phaser.Textures.FilterMode.NEAREST);
        }
        scene.anims.create({
            key: 'tv-static-anim',
            frames: [{ key: 'tv-static-frame-0' }, { key: 'tv-static-frame-1' }, { key: 'tv-static-frame-2' }, { key: 'tv-static-frame-3' }],
            frameRate: 12,
            repeat: -1
        });
    }

    static createTVFrames(scene) {
        if (scene.textures.exists('tv-frame-p1')) return;
        const colors = { p1: { outer: '#3D2817', stroke: '#5D4037', inner: '#FFD700', glow: '#FFE55C', accent: '#FFD700' },
                         p2: { outer: '#2D1B4E', stroke: '#4A2C5A', inner: '#8B00FF', glow: '#A855F7', accent: '#8B00FF' } };
        ['p1', 'p2'].forEach(player => {
            const canvas = scene.textures.createCanvas(`tv-frame-${player}`, 520, 240);
            const ctx = canvas.context;
            const c = colors[player];
            ctx.fillStyle = c.outer;
            ctx.fillRect(0, 0, 520, 240);
            // Removed wavy brown patterns - they were creating brown dashes in the TV screens
            // Simple clean frame instead
            ctx.strokeStyle = c.stroke;
            ctx.lineWidth = 2;
            // Just straight borders, no wavy patterns
            ctx.strokeStyle = c.inner;
            ctx.lineWidth = 3;
            ctx.strokeRect(10, 10, 500, 220);
            ctx.strokeStyle = c.glow;
            ctx.lineWidth = 1;
            ctx.strokeRect(12, 12, 496, 216);
            ctx.fillStyle = c.accent;
            ctx.fillRect(10, 10, 8, 8); ctx.fillRect(502, 10, 8, 8);
            ctx.fillRect(10, 222, 8, 8); ctx.fillRect(502, 222, 8, 8);
            canvas.refresh();
            scene.textures.get(`tv-frame-${player}`).setFilter(Phaser.Textures.FilterMode.NEAREST);
        });
    }

    static createPasscodeDisplay(scene) {
        if (scene.textures.exists('passcode-display')) return;
        const canvas = scene.textures.createCanvas('passcode-display', 30, 40);
        const ctx = canvas.context;
        ctx.fillStyle = '#1a1a1a';
        ctx.fillRect(0, 0, 30, 40);
        ctx.strokeStyle = '#444444';
        ctx.lineWidth = 2;
        ctx.strokeRect(1, 1, 28, 38);
        ctx.fillStyle = '#0a0a0a';
        ctx.fillRect(3, 3, 24, 34);
        ctx.fillStyle = '#222222';
        ctx.fillRect(5, 8, 20, 24);
        canvas.refresh();
        scene.textures.get('passcode-display').setFilter(Phaser.Textures.FilterMode.NEAREST);
    }

    static createTreasureChest(scene) {
        if (scene.textures.exists('treasure-chest')) return;
        const canvas = scene.textures.createCanvas('treasure-chest', 100, 75);
        const ctx = canvas.context;
        ctx.fillStyle = '#3D2817';
        ctx.fillRect(12, 37, 75, 37);
        ctx.fillStyle = '#2A1A0F';
        for (let i = 0; i < 10; i++) ctx.fillRect(15 + i * 8, 40, 1, 32);
        ctx.fillStyle = '#1A1008';
        ctx.fillRect(19, 44, 2, 25); ctx.fillRect(56, 47, 2, 22); ctx.fillRect(81, 52, 2, 19);
        ctx.fillStyle = '#4A4A4A';
        ctx.fillRect(10, 44, 80, 5); ctx.fillRect(10, 56, 80, 5); ctx.fillRect(10, 69, 80, 5);
        ctx.fillStyle = '#6A6A6A';
        ctx.fillRect(10, 44, 80, 2); ctx.fillRect(10, 56, 80, 2); ctx.fillRect(10, 69, 80, 2);
        ctx.fillStyle = '#3A3A3A';
        ctx.fillRect(10, 37, 15, 10); ctx.fillRect(10, 37, 10, 15);
        ctx.fillRect(75, 37, 15, 10); ctx.fillRect(80, 37, 10, 15);
        ctx.fillRect(10, 65, 15, 10); ctx.fillRect(10, 65, 10, 15);
        ctx.fillRect(75, 65, 15, 10); ctx.fillRect(80, 65, 10, 15);
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(11, 39, 4, 4); ctx.fillRect(85, 39, 4, 4); ctx.fillRect(11, 70, 4, 4); ctx.fillRect(85, 70, 4, 4);
        ctx.fillStyle = '#3D2817';
        ctx.strokeStyle = '#3D2817';
        ctx.beginPath();
        ctx.moveTo(12, 37); ctx.quadraticCurveTo(50, 19, 88, 37);
        ctx.lineTo(88, 44); ctx.quadraticCurveTo(50, 25, 12, 44); ctx.closePath();
        ctx.fill(); ctx.stroke();
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(12, 37); ctx.quadraticCurveTo(50, 19, 88, 37);
        ctx.lineTo(88, 44); ctx.quadraticCurveTo(50, 25, 12, 44); ctx.closePath();
        ctx.clip();
        ctx.strokeStyle = '#2A1A0F';
        ctx.lineWidth = 1;
        for (let i = 0; i < 7; i++) {
            ctx.beginPath();
            ctx.moveTo(15 + i * 12, 37); ctx.quadraticCurveTo(50, 19, 15 + i * 12 + 12, 37); ctx.stroke();
        }
        ctx.restore();
        ctx.fillStyle = '#4A4A4A';
        ctx.fillRect(12, 37, 76, 4);
        ctx.fillStyle = '#6A6A6A';
        ctx.fillRect(12, 37, 76, 1);
        ctx.fillStyle = '#5A5A5A';
        ctx.fillRect(44, 47, 12, 15);
        ctx.fillStyle = '#3A3A3A';
        ctx.fillRect(45, 49, 10, 12);
        ctx.fillStyle = '#000000';
        ctx.fillRect(49, 52, 2, 7);
        ctx.beginPath();
        ctx.arc(50, 52, 2, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(45, 50, 2, 2); ctx.fillRect(53, 56, 2, 2);
        const coins = [{x:25,y:52}, {x:67,y:56}, {x:46,y:60}, {x:35,y:57}, {x:57,y:61}];
        coins.forEach(coin => {
            ctx.fillStyle = '#B8860B';
            ctx.fillRect(coin.x, coin.y, 8, 5);
            ctx.fillStyle = '#8B6914';
            ctx.fillRect(coin.x, coin.y + 3, 8, 2); ctx.fillRect(coin.x, coin.y, 2, 5);
            ctx.fillStyle = '#FFD700';
            ctx.fillRect(coin.x + 4, coin.y, 4, 2);
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(coin.x + 5, coin.y + 1, 1, 1);
            ctx.fillStyle = '#FFB800';
            ctx.globalAlpha = 0.5;
            ctx.fillRect(coin.x + 1, coin.y + 1, 5, 2);
            ctx.globalAlpha = 1.0;
        });
        ctx.fillStyle = '#FFB800';
        ctx.globalAlpha = 0.3;
        ctx.fillRect(22, 50, 55, 17);
        ctx.globalAlpha = 1.0;
        ctx.fillStyle = '#5D4A2A';
        ctx.fillRect(15, 40, 70, 2); ctx.fillRect(19, 42, 62, 1);
        ctx.fillStyle = '#8A8A8A';
        ctx.fillRect(10, 44, 80, 1); ctx.fillRect(10, 56, 80, 1); ctx.fillRect(10, 69, 80, 1);
        ctx.fillStyle = '#7A7A7A';
        ctx.fillRect(44, 47, 12, 2);
        ctx.fillStyle = '#9A9A9A';
        ctx.fillRect(45, 49, 10, 1);
        ctx.fillStyle = '#6A6A6A';
        ctx.fillRect(48, 50, 5, 7);
        ctx.fillStyle = '#8A8A8A';
        ctx.fillRect(48, 50, 5, 2);
        ctx.fillStyle = '#000000';
        ctx.fillRect(50, 52, 2, 4);
        ctx.beginPath();
        ctx.arc(50, 52, 1, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#AAAAAA';
        ctx.fillRect(49, 50, 2, 1);
        const gems = [{x:82,y:65,base:'#CC0000',dark:'#990000',bright:'#FF3333',light:'#FF6666'},
                      {x:82,y:37,base:'#006600',dark:'#004400',bright:'#00CC33',light:'#00AA55'},
                      {x:10,y:37,base:'#000066',dark:'#000044',bright:'#3366FF',light:'#0066AA'},
                      {x:10,y:65,base:'#440066',dark:'#330044',bright:'#9966FF',light:'#8844AA'}];
        gems.forEach(gem => {
            ctx.fillStyle = gem.base;
            ctx.fillRect(gem.x, gem.y, 8, 8);
            ctx.fillStyle = gem.dark;
            ctx.fillRect(gem.x, gem.y + 4, 8, 3); ctx.fillRect(gem.x, gem.y, 2, 8);
            ctx.fillStyle = gem.bright;
            ctx.fillRect(gem.x + 4, gem.y, 4, 4);
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(gem.x + 5, gem.y + 1, 2, 2);
            ctx.fillStyle = gem.light;
            ctx.globalAlpha = 0.4;
            ctx.fillRect(gem.x + 1, gem.y + 1, 5, 5);
            ctx.globalAlpha = 1.0;
        });
        ctx.strokeStyle = '#4A3A27';
        ctx.fillStyle = '#4A3A27';
        ctx.beginPath();
        ctx.moveTo(12, 37); ctx.quadraticCurveTo(50, 19, 88, 37);
        ctx.lineWidth = 2; ctx.stroke();
        canvas.refresh();
        scene.textures.get('treasure-chest').setFilter(Phaser.Textures.FilterMode.NEAREST);
    }

    static createTorchPillar(scene) {
        if (scene.textures.exists('torch-pillar')) return;
        const canvas = scene.textures.createCanvas('torch-pillar', 24, 90);
        const ctx = canvas.context;
        ctx.fillStyle = '#5D2906';
        ctx.fillRect(7, 20, 10, 70);
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(8, 22, 8, 66);
        ctx.fillStyle = '#6B3410';
        ctx.fillRect(9, 24, 1, 60); ctx.fillRect(11, 26, 1, 56);
        ctx.fillRect(13, 28, 1, 52); ctx.fillRect(15, 30, 1, 48);
        ctx.fillStyle = '#A0522D';
        ctx.fillRect(8, 22, 2, 66); ctx.fillRect(12, 24, 2, 62); ctx.fillRect(16, 26, 2, 58);
        ctx.fillStyle = '#3D1F0A';
        ctx.fillRect(7, 25, 1, 65); ctx.fillRect(17, 27, 1, 63);
        ctx.fillStyle = '#4A4A4A';
        ctx.fillRect(6, 16, 12, 6);
        ctx.fillStyle = '#6B6B6B';
        ctx.fillRect(7, 17, 10, 4);
        ctx.fillStyle = '#2A2A2A';
        ctx.fillRect(6, 16, 12, 1); ctx.fillRect(6, 21, 12, 1);
        ctx.fillStyle = '#5D2906';
        ctx.fillRect(10, 4, 4, 12);
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(11, 5, 2, 10);
        ctx.fillStyle = '#2A1A0A';
        ctx.fillRect(10, 4, 4, 3);
        canvas.refresh();
        scene.textures.get('torch-pillar').setFilter(Phaser.Textures.FilterMode.NEAREST);
    }

    static createFlameAnimation(scene) {
        if (scene.textures.exists('flame-animated')) return;
        const flameFrames = [];
        for (let frame = 0; frame < 8; frame++) {
            const canvas = scene.textures.createCanvas(`flame-frame-${frame}`, 20, 28);
            const ctx = canvas.context;
            const time = frame * Math.PI / 4;
            const heightVariation = Math.sin(time * 0.8) * 0.8;
            const baseWidth = 7 + Math.sin(time * 0.6) * 0.8;
            ctx.fillStyle = '#AA2200';
            ctx.fillRect(6.5, 20, baseWidth, 6);
            const lowerWidth = 8 + Math.sin(time * 0.9) * 1.2;
            ctx.fillStyle = '#CC3300';
            ctx.fillRect(6, 14, lowerWidth, 7);
            const middleWidth = 9 + Math.sin(time * 1.2) * 1.5;
            ctx.fillStyle = '#FF4400';
            ctx.fillRect(5.5, 8 + heightVariation * 0.2, middleWidth, 7);
            const upperWidth = 7 + Math.sin(time * 1.4) * 1.5;
            ctx.fillStyle = '#FF5500';
            ctx.fillRect(6.5, 4 + heightVariation * 0.3, upperWidth, 5);
            const topWidth = 6 + Math.sin(time * 1.6) * 1.2;
            ctx.fillStyle = '#FF6600';
            ctx.fillRect(7, 1 + heightVariation * 0.4, topWidth, 4);
            ctx.fillStyle = '#FF7700';
            ctx.fillRect(8, 0 + heightVariation * 0.5, 4, 2);
            const leftFlameY = 10 + Math.sin(time * 0.9) * 0.6;
            const rightFlameY = 11 + Math.sin(time * 1.1) * 0.6;
            ctx.fillStyle = '#FF4400';
            ctx.fillRect(2, leftFlameY, 2, 6);
            ctx.fillRect(16, rightFlameY, 2, 5);
            ctx.fillStyle = '#FF6600';
            const coreWidth = 3 + Math.sin(time * 1.8) * 0.6;
            ctx.fillRect(8.5, 6 + heightVariation * 0.15, coreWidth, 8);
            ctx.fillStyle = '#FF5500';
            ctx.fillRect(8.5, 20, 3, 5);
            canvas.refresh();
            flameFrames.push(`flame-frame-${frame}`);
        }
        scene.anims.create({
            key: 'flame-flicker',
            frames: flameFrames.map(f => ({ key: f })),
            frameRate: 12,
            repeat: -1
        });
    }

    static createPillarRuneTextures(scene) {
        const runeColors = ['#FFD700', '#00FFFF', '#FF4500'];
        for (let i = 1; i <= 3; i++) {
            const pKey = `pillar-pixel-${i}`;
            const rKey = `rune-pixel-${i}`;
            const color = runeColors[i-1];
            if (!scene.textures.exists(pKey)) {
                const canvas = scene.textures.createCanvas(pKey, 80, 100);
                const ctx = canvas.context;
                ctx.fillStyle = '#4A4A4A';
                ctx.fillRect(0, 0, 80, 100);
                ctx.fillStyle = '#3A3A3A';
                for(let j=0; j<100; j++) ctx.fillRect(Math.random()*80, Math.random()*100, 4, 4);
                ctx.strokeStyle = color;
                ctx.lineWidth = 3;
                ctx.beginPath();
                if (i === 1) {
                    ctx.moveTo(20, 20); ctx.lineTo(60, 20); ctx.lineTo(40, 80); ctx.closePath();
                    ctx.moveTo(20, 40); ctx.lineTo(60, 40);
                } else if (i === 2) {
                    ctx.arc(40, 50, 25, 0, Math.PI * 2);
                    ctx.moveTo(40, 25); ctx.lineTo(40, 75);
                    ctx.moveTo(15, 50); ctx.lineTo(65, 50);
                } else {
                    ctx.moveTo(20, 20); ctx.lineTo(60, 20); ctx.lineTo(20, 80); ctx.lineTo(60, 80);
                }
                ctx.stroke();
                ctx.strokeStyle = '#1B3D0A';
                ctx.lineWidth = 4;
                ctx.beginPath();
                ctx.moveTo(0, 90); ctx.bezierCurveTo(40, 70, 40, 30, 80, 10); ctx.stroke();
                ctx.fillStyle = '#2D5016';
                for(let v=0; v<5; v++) ctx.fillRect(10 + v*12, 80 - v*15, 8, 6);
                canvas.refresh();
            }
            if (!scene.textures.exists(rKey)) {
                const canvas = scene.textures.createCanvas(rKey, 40, 40);
                const ctx = canvas.context;
                ctx.fillStyle = '#5D2906';
                ctx.beginPath(); ctx.arc(20, 20, 18, 0, Math.PI * 2); ctx.fill();
                ctx.fillStyle = '#3D1F1F';
                ctx.beginPath(); ctx.arc(20, 20, 18, 0, Math.PI); ctx.fill();
                ctx.fillStyle = '#8B4513';
                ctx.beginPath(); ctx.arc(20, 20, 14, 0, Math.PI * 2); ctx.fill();
                ctx.strokeStyle = color;
                ctx.lineWidth = 2;
                ctx.beginPath();
                if (i === 1) {
                    ctx.moveTo(15, 12); ctx.lineTo(25, 12); ctx.lineTo(20, 28); ctx.closePath();
                    ctx.moveTo(15, 18); ctx.lineTo(25, 18);
                } else if (i === 2) {
                    ctx.arc(20, 20, 10, 0, Math.PI * 2);
                    ctx.moveTo(20, 10); ctx.lineTo(20, 30);
                    ctx.moveTo(10, 20); ctx.lineTo(30, 20);
                } else {
                    ctx.moveTo(12, 12); ctx.lineTo(28, 12); ctx.lineTo(12, 28); ctx.lineTo(28, 28);
                }
                ctx.stroke();
                canvas.refresh();
            }
        }
    }

    static createBackgroundTemple(scene) {
        if (scene.textures.exists('bg-temple-detailed')) return;
        const canvas = scene.textures.createCanvas('bg-temple-detailed', 400, 280);
        const ctx = canvas.context;
        for (let y = 0; y < 280; y++) {
            const ratio = y / 280;
            const r = Math.floor(26 + ratio * 10), g = Math.floor(45 + ratio * 15), b = Math.floor(18 + ratio * 8);
            ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
            ctx.fillRect(0, y, 400, 1);
        }
        const baseY = 270;
        ctx.fillStyle = '#6B5B4D';
        ctx.fillRect(33, baseY - 30, 334, 30);
        ctx.fillStyle = '#4A3E35';
        for (let i = 0; i < 7; i++) ctx.fillRect(33 + i * 48, baseY - 30, 2, 30);
        for (let i = 0; i < 2; i++) ctx.fillRect(33, baseY - 30 + i * 15, 334, 2);
        ctx.fillStyle = '#8B7A6B';
        for (let i = 0; i < 3; i++) ctx.fillRect(37 + i * 67, baseY - 26, 30, 11);
        ctx.fillStyle = '#8B7355';
        ctx.fillRect(67, baseY - 53, 267, 17);
        ctx.fillStyle = '#6B5B4D';
        ctx.fillRect(73, baseY - 48, 255, 1); ctx.fillRect(73, baseY - 43, 255, 1); ctx.fillRect(73, baseY - 38, 255, 1);
        for (let i = 0; i < 5; i++) ctx.fillRect(80 + i * 33, baseY - 53, 2, 17);
        ctx.fillStyle = '#9B8365';
        ctx.fillRect(80, baseY - 73, 240, 17);
        ctx.fillStyle = '#7B6B5D';
        ctx.fillRect(87, baseY - 68, 226, 1); ctx.fillRect(87, baseY - 63, 226, 1);
        for (let i = 0; i < 5; i++) ctx.fillRect(93 + i * 33, baseY - 73, 2, 17);
        ctx.fillStyle = '#AB9365';
        ctx.fillRect(93, baseY - 93, 213, 17);
        ctx.fillStyle = '#8B7B6D';
        ctx.fillRect(100, baseY - 88, 200, 1); ctx.fillRect(100, baseY - 83, 200, 1);
        for (let i = 0; i < 4; i++) ctx.fillRect(107 + i * 33, baseY - 93, 2, 17);
        const mainY = baseY - 133;
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(120, mainY, 160, 40);
        ctx.fillStyle = '#6B3410';
        for (let y = 0; y < 2; y++) {
            for (let x = 0; x < 4; x++) {
                if ((x + y) % 2 === 0) ctx.fillRect(123 + x * 27, mainY + y * 13, 24, 12);
            }
        }
        ctx.fillStyle = '#A0522D';
        for (let y = 0; y < 2; y++) {
            for (let x = 0; x < 2; x++) ctx.fillRect(127 + x * 53, mainY + 3 + y * 20, 23, 10);
        }
        ctx.fillStyle = '#4A2E1A';
        ctx.fillRect(120, mainY + 7, 160, 2); ctx.fillRect(120, mainY + 20, 160, 2); ctx.fillRect(120, mainY + 33, 160, 2);
        for (let i = 0; i < 3; i++) ctx.fillRect(133 + i * 33, mainY, 2, 40);
        ctx.fillStyle = '#CD5C5C';
        ctx.fillRect(133, mainY - 33, 133, 27);
        ctx.fillStyle = '#8B0000';
        ctx.fillRect(140, mainY - 28, 119, 1); ctx.fillRect(140, mainY - 23, 119, 1); ctx.fillRect(140, mainY - 18, 119, 1);
        ctx.fillStyle = '#FFD700';
        ctx.fillRect(137, mainY - 30, 127, 1); ctx.fillRect(137, mainY - 19, 127, 1);
        ctx.fillStyle = '#D4AF37';
        ctx.fillRect(153, mainY - 60, 107, 23);
        ctx.fillStyle = '#B8860B';
        ctx.fillRect(160, mainY - 55, 93, 1); ctx.fillRect(160, mainY - 50, 93, 1);
        ctx.fillRect(160, mainY - 45, 93, 1); ctx.fillRect(160, mainY - 40, 93, 1);
        ctx.fillRect(153, mainY - 58, 2, 21); ctx.fillRect(258, mainY - 58, 2, 21);
        ctx.fillStyle = '#FFD700';
        ctx.fillRect(173, mainY - 83, 80, 20);
        ctx.fillStyle = '#D4AF37';
        ctx.fillRect(180, mainY - 78, 66, 1); ctx.fillRect(180, mainY - 73, 66, 1); ctx.fillRect(180, mainY - 68, 66, 1);
        ctx.fillStyle = '#D4AF37';
        ctx.fillRect(187, mainY - 107, 53, 17);
        ctx.fillRect(193, mainY - 120, 40, 10);
        ctx.fillRect(200, mainY - 130, 27, 7);
        ctx.fillStyle = '#FFD700';
        ctx.fillRect(207, mainY - 137, 13, 3);
        ctx.fillStyle = '#B8860B';
        ctx.fillRect(187, mainY - 104, 53, 1); ctx.fillRect(193, mainY - 117, 40, 1);
        for (let i = 0; i < 2; i++) ctx.fillRect(190 + i * 17, mainY - 107, 2, 17);
        ctx.fillStyle = '#6B5B4D';
        ctx.fillRect(53, mainY + 13, 53, 27);
        ctx.fillRect(60, mainY - 13, 40, 27);
        ctx.fillStyle = '#4A3E35';
        ctx.fillRect(57, mainY + 17, 45, 1); ctx.fillRect(63, mainY - 9, 33, 1);
        ctx.fillStyle = '#8B7355';
        ctx.fillRect(67, mainY - 27, 27, 10);
        ctx.fillStyle = '#6B5B4D';
        ctx.fillRect(293, mainY + 13, 53, 27);
        ctx.fillRect(300, mainY - 13, 40, 27);
        ctx.fillStyle = '#4A3E35';
        ctx.fillRect(297, mainY + 17, 45, 1); ctx.fillRect(303, mainY - 9, 33, 1);
        ctx.fillStyle = '#8B7355';
        ctx.fillRect(307, mainY - 27, 27, 10);
        ctx.fillStyle = '#A0A0A0';
        ctx.fillRect(107, mainY + 7, 12, 33);
        ctx.fillStyle = '#D4AF37';
        ctx.fillRect(105, mainY + 7, 16, 8);
        ctx.fillStyle = '#808080';
        for (let i = 0; i < 3; i++) ctx.fillRect(108 + i * 2, mainY + 15, 1, 25);
        ctx.fillStyle = '#6B5B4D';
        ctx.fillRect(104, mainY + 38, 18, 1);
        ctx.fillStyle = '#A0A0A0';
        ctx.fillRect(281, mainY + 7, 12, 33);
        ctx.fillStyle = '#D4AF37';
        ctx.fillRect(279, mainY + 7, 16, 8);
        ctx.fillStyle = '#808080';
        for (let i = 0; i < 3; i++) ctx.fillRect(282 + i * 2, mainY + 15, 1, 25);
        ctx.fillStyle = '#6B5B4D';
        ctx.fillRect(278, mainY + 38, 18, 1);
        ctx.fillStyle = '#00FF00';
        ctx.globalAlpha = 0.6;
        ctx.beginPath();
        ctx.arc(200, mainY + 20, 17, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#00CC00';
        ctx.fillRect(185, mainY + 10, 30, 2); ctx.fillRect(185, mainY + 28, 30, 2); ctx.fillRect(199, mainY + 10, 2, 20);
        ctx.globalAlpha = 1.0;
        ctx.fillStyle = '#FFD700';
        ctx.globalAlpha = 0.7;
        ctx.fillRect(193, mainY - 25, 13, 2); ctx.fillRect(193, mainY - 21, 13, 2);
        ctx.beginPath();
        ctx.arc(200, mainY - 50, 5, 0, Math.PI * 2); ctx.fill();
        ctx.globalAlpha = 1.0;
        ctx.fillStyle = '#228B22';
        for (let i = 0; i < 13; i++) {
            const x = 67 + Math.random() * 267, y = mainY - 33 + Math.random() * 133;
            ctx.fillRect(x, y, 1 + Math.random() * 2, 1 + Math.random() * 2);
        }
        ctx.fillStyle = '#1a3d0a';
        for (let x = 133; x < 267; x += 33) {
            const length = 20 + Math.random() * 27;
            for (let y = 0; y < length; y += 2) ctx.fillRect(x, y, 1, 2);
        }
        canvas.refresh();
        scene.textures.get('bg-temple-detailed').setFilter(Phaser.Textures.FilterMode.NEAREST);
    }

    static createGroundTexture(scene) {
        if (scene.textures.exists('ground-textured')) return;
        const canvas = scene.textures.createCanvas('ground-textured', 1280, 80);
        const ctx = canvas.context;
        
        // Base dirt layer (dark brown)
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(0, 0, 1280, 80);
        
        // Dirt texture variation
        ctx.fillStyle = '#654321';
        for (let y = 0; y < 80; y += 4) {
            for (let x = 0; x < 1280; x += 4) {
                if (Math.random() > 0.6) ctx.fillRect(x, y, 4, 4);
            }
        }
        
        // Lighter dirt highlights
        ctx.fillStyle = '#A0522D';
        for (let y = 0; y < 80; y += 6) {
            for (let x = 0; x < 1280; x += 6) {
                if (Math.random() > 0.85) ctx.fillRect(x, y, 3, 3);
            }
        }
        
        // Top edge: Jagged vibrant green grass
        ctx.fillStyle = '#228B22';
        for (let x = 0; x < 1280; x += 2) {
            const h = Math.random() > 0.5 ? 3 : (Math.random() > 0.3 ? 4 : 2);
            ctx.fillRect(x, 0, 2, h);
            if (Math.random() > 0.7) ctx.fillRect(x, 0, 2, h + 1);
        }
        
        // Additional grass detail
        ctx.fillStyle = '#32CD32';
        for (let x = 0; x < 1280; x += 4) {
            if (Math.random() > 0.6) {
                const h = Math.random() > 0.5 ? 2 : 3;
                ctx.fillRect(x, 0, 2, h);
            }
        }
        
        // Bottom edge border
        ctx.fillStyle = '#3E2723';
        ctx.fillRect(0, 78, 1280, 2);
        
        canvas.refresh();
        scene.textures.get('ground-textured').setFilter(Phaser.Textures.FilterMode.NEAREST);
    }

    static createPlatformTextures(scene) {
        if (scene.textures.exists('platform-wood')) return;
        
        // 1. DIRT PLATFORM (Formerly Wood)
        const createDirt = () => {
            const canvas = scene.textures.createCanvas('platform-wood', 150, 25);
            const ctx = canvas.context;
            
            // Base dirt color
            ctx.fillStyle = '#8B4513';
            ctx.fillRect(0, 0, 150, 25);
            
            // Clumpy dirt texture
            const colors = ['#5D4037', '#654321', '#A0522D'];
            for (let i = 0; i < 150; i++) {
                ctx.fillStyle = colors[Math.floor(Math.random() * colors.length)];
                const x = Math.random() * 150;
                const y = 5 + Math.random() * 20;
                const size = 2 + Math.random() * 4;
                ctx.fillRect(x, y, size, size);
            }
            
            // Small pebbles in dirt
            ctx.fillStyle = '#4E342E';
            for (let i = 0; i < 20; i++) {
                ctx.fillRect(Math.random() * 150, 10 + Math.random() * 12, 2, 2);
            }
            
            // Top edge: Jagged grass
            ctx.fillStyle = '#228B22'; // Forest green
            for (let x = 0; x < 150; x += 2) {
                const h = Math.random() > 0.5 ? 3 : (Math.random() > 0.3 ? 4 : 2);
                ctx.fillRect(x, 0, 2, h);
                if (Math.random() > 0.7) ctx.fillRect(x, 0, 2, h + 1);
            }
            
            // Grass highlights
            ctx.fillStyle = '#32CD32';
            for (let x = 0; x < 150; x += 4) {
                if (Math.random() > 0.6) {
                    const h = Math.random() > 0.5 ? 2 : 3;
                    ctx.fillRect(x, 0, 2, h);
                }
            }
            
            // Bottom edge border
            ctx.fillStyle = '#3E2723';
            ctx.fillRect(0, 23, 150, 2);
            ctx.fillRect(0, 0, 2, 25);
            ctx.fillRect(148, 0, 2, 25);
            
            canvas.refresh();
            scene.textures.get('platform-wood').setFilter(Phaser.Textures.FilterMode.NEAREST);
        };

        // 2. ROCKY/CRACKED STONE PLATFORM
        const createStone = () => {
            const canvas = scene.textures.createCanvas('platform-stone', 150, 25);
            const ctx = canvas.context;
            
            // Base stone color
            ctx.fillStyle = '#808080';
            ctx.fillRect(0, 0, 150, 25);
            
            // Cobblestone patches
            ctx.fillStyle = '#696969';
            for (let i = 0; i < 40; i++) {
                const x = Math.random() * 150;
                const y = Math.random() * 25;
                const w = 10 + Math.random() * 20;
                const h = 5 + Math.random() * 10;
                ctx.fillRect(x, y, w, h);
            }
            
            // Cracks and fractures
            ctx.strokeStyle = '#333333';
            ctx.lineWidth = 1;
            for (let i = 0; i < 8; i++) {
                ctx.beginPath();
                let x = Math.random() * 150;
                let y = Math.random() * 25;
                ctx.moveTo(x, y);
                for (let j = 0; j < 3; j++) {
                    x += (Math.random() - 0.5) * 15;
                    y += (Math.random() - 0.5) * 10;
                    ctx.lineTo(x, y);
                }
                ctx.stroke();
            }
            
            // Crack highlights (makes them look deeper)
            ctx.strokeStyle = '#A9A9A9';
            for (let i = 0; i < 5; i++) {
                ctx.beginPath();
                let x = Math.random() * 150;
                let y = Math.random() * 25;
                ctx.moveTo(x, y);
                ctx.lineTo(x + 2, y + 2);
                ctx.stroke();
            }
            
            // Stone texture noise
            for (let i = 0; i < 100; i++) {
                ctx.fillStyle = Math.random() > 0.5 ? '#A9A9A9' : '#555555';
                ctx.fillRect(Math.random() * 150, Math.random() * 25, 1, 1);
            }
            
            // Edges
            ctx.fillStyle = '#333333';
            ctx.fillRect(0, 0, 150, 1);
            ctx.fillRect(0, 24, 150, 1);
            ctx.fillRect(0, 0, 1, 25);
            ctx.fillRect(149, 0, 1, 25);
            
            canvas.refresh();
            scene.textures.get('platform-stone').setFilter(Phaser.Textures.FilterMode.NEAREST);
        };

        // 3. PILLAR PLATFORM (Similar to dirt but for pillars)
        const createPillar = () => {
            const canvas = scene.textures.createCanvas('platform-pillar', 100, 25);
            const ctx = canvas.context;
            
            ctx.fillStyle = '#8B4513';
            ctx.fillRect(0, 0, 100, 25);
            
            // Clumpy dirt
            const colors = ['#5D4037', '#654321'];
            for (let i = 0; i < 80; i++) {
                ctx.fillStyle = colors[Math.floor(Math.random() * colors.length)];
                ctx.fillRect(Math.random() * 100, 5 + Math.random() * 20, 3, 3);
            }
            
            // Grass top
            ctx.fillStyle = '#228B22';
            for (let x = 0; x < 100; x += 2) {
                ctx.fillRect(x, 0, 2, 2 + Math.random() * 2);
            }
            
            ctx.fillStyle = '#3E2723';
            ctx.fillRect(0, 23, 100, 2);
            
            canvas.refresh();
            scene.textures.get('platform-pillar').setFilter(Phaser.Textures.FilterMode.NEAREST);
        };

        createDirt();
        createStone();
        createPillar();
    }

    // ===== LAYERED BACKGROUND SYSTEM =====
    
    /**
     * LAYER 0 — DEEPEST BACKGROUND (Jungle Tree Silhouettes)
     * Creates dark tree silhouettes for depth - very far back
     */
    static createBackgroundLayer0Jungle(scene) {
        if (scene.textures.exists('bg-layer0-jungle')) return;
        try {
            const canvas = scene.textures.createCanvas('bg-layer0-jungle', 1280, 400);
        const ctx = canvas.context;
        
        // Dark jungle green background (very dark, muted)
        ctx.fillStyle = '#1a2d1a';
        ctx.fillRect(0, 0, 1280, 400);
        
        // Tree silhouettes (dark, organic shapes)
        ctx.fillStyle = '#0f1a0f'; // Very dark green-black
        
        // Left side trees (varying heights, organic shapes)
        // Tree 1
        ctx.fillRect(50, 200, 40, 200);
        ctx.fillRect(45, 150, 50, 30);
        ctx.fillRect(40, 120, 60, 25);
        ctx.fillRect(35, 100, 70, 20);
        
        // Tree 2
        ctx.fillRect(180, 180, 35, 220);
        ctx.fillRect(175, 140, 45, 28);
        ctx.fillRect(170, 115, 55, 22);
        
        // Tree 3
        ctx.fillRect(320, 190, 45, 210);
        ctx.fillRect(315, 145, 55, 32);
        ctx.fillRect(310, 118, 65, 24);
        ctx.fillRect(305, 95, 75, 20);
        
        // Center trees (behind temple)
        ctx.fillRect(550, 170, 50, 230);
        ctx.fillRect(545, 130, 60, 30);
        ctx.fillRect(540, 105, 70, 22);
        
        ctx.fillRect(680, 185, 42, 215);
        ctx.fillRect(675, 142, 52, 28);
        ctx.fillRect(670, 118, 62, 21);
        
        // Right side trees
        ctx.fillRect(900, 175, 38, 225);
        ctx.fillRect(895, 135, 48, 30);
        ctx.fillRect(890, 110, 58, 23);
        
        ctx.fillRect(1050, 195, 44, 205);
        ctx.fillRect(1045, 150, 54, 32);
        ctx.fillRect(1040, 122, 64, 25);
        ctx.fillRect(1035, 98, 74, 20);
        
        ctx.fillRect(1180, 180, 36, 220);
        ctx.fillRect(1175, 138, 46, 29);
        ctx.fillRect(1170, 112, 56, 23);
        
        // Add some large jungle leaves (dark silhouettes)
        ctx.fillStyle = '#152015';
        // Large leaves scattered (fixed sizes for consistency)
        const leafSizes = [
            {x: 100, y: 50, w: 35, h: 22},
            {x: 200, y: 130, w: 42, h: 28},
            {x: 300, y: 50, w: 38, h: 25},
            {x: 400, y: 130, w: 45, h: 30},
            {x: 500, y: 50, w: 40, h: 26},
            {x: 600, y: 130, w: 43, h: 29},
            {x: 700, y: 50, w: 37, h: 24},
            {x: 800, y: 130, w: 41, h: 27},
            {x: 900, y: 50, w: 39, h: 25},
            {x: 1000, y: 130, w: 44, h: 31},
            {x: 1100, y: 50, w: 36, h: 23},
            {x: 1200, y: 130, w: 40, h: 26}
        ];
        leafSizes.forEach(leaf => {
            ctx.fillStyle = '#152015';
            ctx.fillRect(leaf.x, leaf.y, leaf.w, leaf.h);
            // Leaf veins
            ctx.fillStyle = '#0f1a0f';
            ctx.fillRect(leaf.x + leaf.w/2, leaf.y, 1, leaf.h);
        });
        
            canvas.refresh();
            if (scene.textures.exists('bg-layer0-jungle')) {
                scene.textures.get('bg-layer0-jungle').setFilter(Phaser.Textures.FilterMode.NEAREST);
            }
        } catch (error) {
            console.error('Error creating jungle background layer:', error);
        }
    }
    
    /**
     * LAYER 1 — FAR BACKGROUND (Sky & Atmosphere)
     * Creates a distant atmospheric layer with gradient sky, fog, and firefly particles
     */
    static createBackgroundLayer1Sky(scene) {
        if (scene.textures.exists('bg-layer1-sky')) return;
        const canvas = scene.textures.createCanvas('bg-layer1-sky', 1280, 300);
        const ctx = canvas.context;
        
        // Sky gradient: dark blue-green at top to lighter near horizon (reduced saturation)
        for (let y = 0; y < 300; y++) {
            const ratio = y / 300;
            // Reduced saturation - more muted colors
            // Top: #1a3d2e (26, 61, 46), Horizon: #3d6b1f (61, 107, 31) -> more muted
            const r = Math.floor(26 + ratio * 30); // Reduced red
            const g = Math.floor(55 + ratio * 40); // Reduced green saturation
            const b = Math.floor(42 - ratio * 12);  // Reduced blue
            ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
            ctx.fillRect(0, y, 1280, 1);
        }
        
        // Fog/mist effect near ground (bottom 100px)
        ctx.globalAlpha = 0.2;
        ctx.fillStyle = '#B8E6B8';
        for (let y = 200; y < 300; y += 8) {
            const alpha = 0.15 + (y - 200) / 100 * 0.1;
            ctx.globalAlpha = alpha;
            for (let x = 0; x < 1280; x += 16) {
                if (Math.random() > 0.3) {
                    ctx.fillRect(x, y, 16, 4);
                }
            }
        }
        ctx.globalAlpha = 1.0;
        
        // Firefly particles (warm, natural colors only - no cyan/neon)
        const fireflyColors = ['#FFE5B4', '#D4A574', '#B8C896']; // Warm yellow, amber, muted green
        for (let i = 0; i < 15; i++) {
            const x = Math.random() * 1280;
            const y = 50 + Math.random() * 250; // More concentrated near horizon
            const color = fireflyColors[Math.floor(Math.random() * fireflyColors.length)];
            const size = 2 + Math.random();
            
            ctx.fillStyle = color;
            ctx.globalAlpha = 0.3 + Math.random() * 0.2; // More subtle
            ctx.fillRect(Math.floor(x), Math.floor(y), size, size);
        }
        ctx.globalAlpha = 1.0;
        
        canvas.refresh();
        scene.textures.get('bg-layer1-sky').setFilter(Phaser.Textures.FilterMode.NEAREST);
    }

    /**
     * LAYER 2 — MID-BACKGROUND (Ancient Jungle Temple Ruins)
     * Mesoamerican/Southeast Asian style - hand-carved stone, overgrown, weathered
     */
    static createBackgroundLayer2Temple(scene) {
        if (scene.textures.exists('bg-layer2-temple')) return;
        const canvas = scene.textures.createCanvas('bg-layer2-temple', 600, 380);
        const ctx = canvas.context;
        
        const baseY = 370; // Ground level
        const centerX = 300;
        
        // Earthy, muted stone colors (no bright highlights)
        const stoneBase = '#5A4B3D';      // Weathered stone gray-brown
        const stoneDark = '#3A2E25';      // Deep shadow
        const stoneMoist = '#4A3E35';     // Moist/darker stone patches
        const stoneLight = '#6B5B4D';     // Very subtle highlight (minimal)
        const mossDark = '#1a3d0a';       // Dark moss
        const mossLight = '#2d5016';      // Light moss
        const mossBright = '#3d6b1f';     // Bright moss (rare)
        const vineColor = '#1a3d0a';      // Dark vine green
        const vineLight = '#2d5016';      // Lighter vine
        const rootColor = '#3A1E0A';      // Dark brown roots
        const carvingColor = '#4A3E35';   // Carvings are DARKER than stone (engraved, not glowing)
        const dirtColor = '#4A2E1A';      // Dirt in cracks
        
        // === BASE PLATFORM (Asymmetrical, eroded) ===
        ctx.fillStyle = stoneBase;
        // Base is not perfectly rectangular - left side extends further
        ctx.fillRect(45, baseY - 65, 510, 65);
        // Right side is slightly shorter
        ctx.fillRect(520, baseY - 60, 35, 60);
        
        // Uneven stone blocks - varying sizes and positions
        const blockPositions = [
            {x: 45, w: 58, h: 30, offset: 0},
            {x: 103, w: 62, h: 32, offset: -1},
            {x: 165, w: 55, h: 28, offset: 1},
            {x: 220, w: 64, h: 30, offset: 0},
            {x: 284, w: 60, h: 31, offset: -1},
            {x: 344, w: 58, h: 29, offset: 1},
            {x: 402, w: 61, h: 30, offset: 0},
            {x: 463, w: 57, h: 32, offset: -1},
            {x: 520, w: 35, h: 30, offset: 0}
        ];
        
        // Draw individual hand-carved stone blocks (irregular, not perfect rectangles)
        blockPositions.forEach((block, index) => {
            // Vary stone color slightly (some darker from moisture)
            const stoneVariation = index % 3 === 0 ? stoneMoist : stoneBase;
            ctx.fillStyle = stoneVariation;
            
            // Blocks are slightly irregular - not perfect rectangles
            const irregularity = (index % 2 === 0 ? 1 : -1) * (index % 3);
            ctx.fillRect(block.x, baseY - block.h + block.offset + irregularity, block.w, block.h);
            
            // Chipped edges (not sharp corners)
            ctx.fillStyle = stoneShadow;
            // Left edge (slightly irregular)
            ctx.fillRect(block.x, baseY - block.h + block.offset + irregularity, 1, block.h);
            // Right edge
            ctx.fillRect(block.x + block.w - 1, baseY - block.h + block.offset + irregularity, 1, block.h);
            
            // Add texture/noise to stone surface (hand-carved feel)
            ctx.fillStyle = stoneDark;
            ctx.globalAlpha = 0.2;
            for (let i = 0; i < 3; i++) {
                const tx = block.x + Math.random() * block.w;
                const ty = baseY - block.h + block.offset + Math.random() * block.h;
                ctx.fillRect(tx, ty, 1, 1);
            }
            ctx.globalAlpha = 1.0;
        });
        
        // Horizontal seams (not perfectly aligned - hand-built)
        ctx.fillStyle = stoneShadow;
        // Wavy, irregular seams (not straight lines)
        for (let x = 45; x < 555; x += 2) {
            const wave = Math.sin(x * 0.05) * 0.5;
            ctx.fillRect(x, baseY - 35 + wave, 2, 1);
        }
        for (let x = 50; x < 550; x += 2) {
            const wave = Math.cos(x * 0.06) * 0.5;
            ctx.fillRect(x, baseY - 5 + wave, 2, 1);
        }
        
        // Missing blocks - gaps where nature shows through
        ctx.fillStyle = '#2d5016'; // Background green
        ctx.fillRect(180, baseY - 40, 15, 20); // Gap in base
        ctx.fillRect(420, baseY - 35, 12, 15); // Another gap
        
        // Moss patches on random stones
        const mossPatches = [
            {x: 50, y: baseY - 50, w: 20, h: 8},
            {x: 120, y: baseY - 45, w: 15, h: 6},
            {x: 250, y: baseY - 48, w: 18, h: 7},
            {x: 380, y: baseY - 52, w: 22, h: 9},
            {x: 480, y: baseY - 46, w: 16, h: 6}
        ];
        mossPatches.forEach(patch => {
            ctx.fillStyle = mossLight;
            ctx.fillRect(patch.x, patch.y, patch.w, patch.h);
            // Moss texture
            ctx.fillStyle = mossDark;
            for (let i = 0; i < 4; i++) {
                ctx.fillRect(patch.x + i * 4, patch.y, 2, patch.h);
            }
        });
        
        // === MAIN TEMPLE BODY (Asymmetrical, collapsed) ===
        // Tier 4 (bottom, widest) - NOT perfectly centered
        const tier4Left = 95; // Slightly left of center
        const tier4Width = 410; // Not perfectly symmetrical
        ctx.fillStyle = stoneBase;
        ctx.fillRect(tier4Left, baseY - 200, tier4Width, 42);
        
        // Uneven stone blocks on tier 4
        ctx.fillStyle = stoneShadow;
        const tier4Blocks = [0, 68, 135, 205, 275, 345];
        tier4Blocks.forEach((x, i) => {
            const offset = (i % 2 === 0 ? -1 : 1) * (i * 0.5);
            ctx.fillRect(tier4Left + x, baseY - 200 + offset, 1, 42);
        });
        
        // Missing blocks on tier 4
        ctx.fillStyle = '#2d5016';
        ctx.fillRect(tier4Left + 150, baseY - 195, 25, 15); // Collapsed section
        ctx.fillRect(tier4Left + 320, baseY - 198, 18, 12);
        
        // Cracks on tier 4 (uneven width)
        ctx.fillStyle = stoneShadow;
        ctx.fillRect(tier4Left + 80, baseY - 200, 1, 42);
        ctx.fillRect(tier4Left + 82, baseY - 195, 1, 32); // Zigzag crack
        ctx.fillRect(tier4Left + 350, baseY - 200, 2, 42); // Wider crack
        
        // Thick organic vines crawling across tier 4 (not perfectly vertical, varying thickness)
        ctx.fillStyle = vineColor;
        // Left side thick vine (diagonal, organic curve)
        for (let i = 0; i < 10; i++) {
            const x = tier4Left + 15 + i * 7;
            const y = baseY - 190 + i * 1.8 + Math.sin(i * 0.5) * 1;
            const thickness = 4 + Math.sin(i * 0.3) * 1; // Varying thickness
            ctx.fillRect(x, y, thickness, 8);
        }
        // Right side vine (different pattern)
        for (let i = 0; i < 8; i++) {
            const x = tier4Left + 385 - i * 6;
            const y = baseY - 185 + i * 1.5 + Math.cos(i * 0.4) * 1;
            const thickness = 4 + Math.cos(i * 0.2) * 1;
            ctx.fillRect(x, y, thickness, 7);
        }
        // Center vine wrapping around
        for (let i = 0; i < 6; i++) {
            const x = centerX - 20 + i * 7;
            const y = baseY - 188 + Math.sin(i * 0.6) * 2;
            ctx.fillRect(x, y, 3, 6);
        }
        
        // Chiseled stone carvings on tier 4 (engraved, darker than stone - NOT glowing)
        ctx.fillStyle = carvingColor; // Darker than stone (engraved)
        // Left: Sun motif (chiseled circle with rays)
        ctx.beginPath();
        ctx.arc(tier4Left + 60, baseY - 180, 5, 0, Math.PI * 2);
        ctx.fill();
        // Sun rays (chiseled lines)
        ctx.fillRect(tier4Left + 60, baseY - 188, 1, 3);
        ctx.fillRect(tier4Left + 60, baseY - 175, 1, 3);
        ctx.fillRect(tier4Left + 53, baseY - 180, 3, 1);
        ctx.fillRect(tier4Left + 65, baseY - 180, 3, 1);
        
        // Center: Tribal pattern (interlocking lines)
        ctx.fillRect(centerX - 8, baseY - 185, 16, 1);
        ctx.fillRect(centerX - 8, baseY - 175, 16, 1);
        ctx.fillRect(centerX - 1, baseY - 190, 1, 20);
        
        // Right: Animal god motif (simplified jaguar/serpent head - abstract)
        // Serpent head shape (chiseled)
        ctx.fillRect(tier4Left + 350, baseY - 185, 8, 4);
        ctx.fillRect(tier4Left + 352, baseY - 190, 4, 2);
        ctx.fillRect(tier4Left + 354, baseY - 192, 2, 1);
        
        // Tier 3 (offset, not perfectly aligned)
        const tier3Left = 118; // Different offset
        const tier3Width = 365;
        ctx.fillStyle = stoneBase;
        ctx.fillRect(tier3Left, baseY - 242, tier3Width, 36);
        
        // Missing corner on tier 3
        ctx.fillStyle = '#2d5016';
        ctx.fillRect(tier3Left + 340, baseY - 242, 25, 20);
        
        // Uneven blocks
        ctx.fillStyle = stoneShadow;
        const tier3Blocks = [0, 73, 148, 225, 300];
        tier3Blocks.forEach((x, i) => {
            const offset = (i % 3 === 0 ? -1 : 0);
            ctx.fillRect(tier3Left + x, baseY - 242 + offset, 1, 36);
        });
        
        // Cracks
        ctx.fillRect(tier3Left + 100, baseY - 242, 2, 36);
        ctx.fillRect(tier3Left + 250, baseY - 242, 1, 30);
        
        // Thick vines on tier 3 (more prominent)
        ctx.fillStyle = vineColor;
        for (let i = 0; i < 6; i++) {
            const x = tier3Left + 45 + i * 11;
            const y = baseY - 235 + Math.sin(i * 0.8) * 2;
            const thickness = 3 + (i % 2);
            ctx.fillRect(x, y, thickness, 10);
        }
        // Vine wrapping around left side
        ctx.fillRect(tier3Left - 2, baseY - 230, 4, 30);
        
        // Chiseled carvings on tier 3 (partially hidden by vines/moss)
        ctx.fillStyle = carvingColor; // Dark engraved lines
        // Left: Geometric pattern (zigzag - partially worn)
        for (let i = 0; i < 4; i++) {
            const x = tier3Left + 70 + i * 4;
            const y = baseY - 225 + (i % 2) * 3;
            ctx.fillRect(x, y, 2, 1);
        }
        // Right: Wave pattern (partially visible through moss)
        for (let i = 0; i < 3; i++) {
            const x = tier3Left + 260 + i * 5;
            const y = baseY - 225 + Math.sin(i) * 2;
            ctx.fillRect(x, y, 3, 1);
        }
        
        // Tier 2 (more collapsed)
        const tier2Left = 138;
        const tier2Width = 325;
        ctx.fillStyle = stoneBase;
        ctx.fillRect(tier2Left, baseY - 278, tier2Width, 32);
        
        // Large missing section
        ctx.fillStyle = '#2d5016';
        ctx.fillRect(tier2Left + 200, baseY - 278, 60, 25);
        
        // Uneven blocks
        ctx.fillStyle = stoneShadow;
        const tier2Blocks = [0, 81, 162, 243];
        tier2Blocks.forEach((x, i) => {
            ctx.fillRect(tier2Left + x, baseY - 278, 1, 32);
        });
        
        // Major crack
        ctx.fillRect(tier2Left + 120, baseY - 278, 2, 32);
        
        // Chiseled carvings on tier 2 (very worn, mostly hidden)
        ctx.fillStyle = carvingColor; // Dark engraved
        // Left: Partially visible triangle (worn by time)
        ctx.fillRect(tier2Left + 45, baseY - 270, 1, 8);
        ctx.fillRect(tier2Left + 42, baseY - 268, 1, 6);
        ctx.fillRect(tier2Left + 48, baseY - 268, 1, 6);
        // Right: Faint spiral pattern (almost gone)
        ctx.fillRect(tier2Left + 240, baseY - 270, 2, 1);
        ctx.fillRect(tier2Left + 242, baseY - 272, 1, 2);
        
        // Tier 1 (top, most collapsed)
        const tier1Left = 158;
        const tier1Width = 285;
        ctx.fillStyle = stoneBase;
        ctx.fillRect(tier1Left, baseY - 308, tier1Width, 28);
        
        // Multiple missing sections
        ctx.fillStyle = '#2d5016';
        ctx.fillRect(tier1Left + 180, baseY - 308, 45, 20);
        ctx.fillRect(tier1Left + 80, baseY - 305, 30, 15);
        
        // Uneven blocks
        ctx.fillStyle = stoneShadow;
        ctx.fillRect(tier1Left, baseY - 308, 1, 28);
        ctx.fillRect(tier1Left + 95, baseY - 308, 1, 28);
        ctx.fillRect(tier1Left + 190, baseY - 308, 1, 28);
        
        // Tree growing through top
        ctx.fillStyle = rootColor;
        ctx.fillRect(tier1Left + 200, baseY - 308, 8, 28);
        
        // === PILLARS (Asymmetrical, varied damage) ===
        // Left pillar 1 (tilted slightly)
        ctx.fillStyle = stoneBase;
        ctx.fillRect(58, baseY - 185, 38, 185);
        ctx.fillStyle = stoneShadow;
        ctx.fillRect(58, baseY - 185, 1, 185);
        ctx.fillRect(95, baseY - 185, 1, 185);
        // Crack
        ctx.fillRect(75, baseY - 150, 1, 80);
        // Thick vines wrapping pillar (not perfectly vertical, organic curves)
        ctx.fillStyle = vineColor;
        for (let i = 0; i < 14; i++) {
            const x = 55 + Math.sin(i * 0.3) * 3;
            const y = baseY - 170 + i * 11;
            const thickness = 4 + Math.sin(i * 0.2) * 1;
            ctx.fillRect(x, y, thickness, 9);
        }
        for (let i = 0; i < 12; i++) {
            const x = 95 + Math.sin(i * 0.4) * 3;
            const y = baseY - 160 + i * 12;
            const thickness = 4 + Math.cos(i * 0.25) * 1;
            ctx.fillRect(x, y, thickness, 8);
        }
        // Moss patches
        ctx.fillStyle = mossLight;
        ctx.fillRect(62, baseY - 105, 28, 10);
        ctx.fillRect(68, baseY - 55, 18, 8);
        ctx.fillStyle = mossDark;
        ctx.fillRect(65, baseY - 102, 22, 6);
        
        // Left pillar 2 (broken - top third missing, more damage)
        ctx.fillStyle = stoneBase;
        ctx.fillRect(18, baseY - 125, 32, 125);
        ctx.fillStyle = stoneShadow;
        ctx.fillRect(18, baseY - 125, 1, 125);
        ctx.fillRect(49, baseY - 125, 1, 125);
        // Multiple cracks
        ctx.fillRect(28, baseY - 100, 1, 50);
        ctx.fillRect(35, baseY - 80, 1, 40);
        // Vines
        ctx.fillStyle = vineColor;
        for (let i = 0; i < 8; i++) {
            const x = 16 + Math.sin(i * 0.5) * 3;
            const y = baseY - 105 + i * 10;
            ctx.fillRect(x, y, 3, 6);
        }
        // Large moss patch
        ctx.fillStyle = mossLight;
        ctx.fillRect(22, baseY - 60, 24, 12);
        
        // Right pillar 1 (different damage pattern)
        ctx.fillStyle = stoneBase;
        ctx.fillRect(510, baseY - 175, 36, 175);
        ctx.fillStyle = stoneShadow;
        ctx.fillRect(510, baseY - 175, 1, 175);
        ctx.fillRect(545, baseY - 175, 1, 175);
        // Crack
        ctx.fillRect(525, baseY - 140, 1, 70);
        // Vines (different pattern)
        ctx.fillStyle = vineColor;
        for (let i = 0; i < 11; i++) {
            const x = 508 + Math.sin(i * 0.35) * 2;
            const y = baseY - 160 + i * 11;
            ctx.fillRect(x, y, 3, 7);
        }
        for (let i = 0; i < 9; i++) {
            const x = 547 + Math.sin(i * 0.3) * 2;
            const y = baseY - 155 + i * 12;
            ctx.fillRect(x, y, 3, 6);
        }
        // Moss
        ctx.fillStyle = mossLight;
        ctx.fillRect(515, baseY - 95, 24, 9);
        ctx.fillRect(520, baseY - 48, 16, 7);
        
        // Right pillar 2 (most damaged)
        ctx.fillStyle = stoneBase;
        ctx.fillRect(555, baseY - 115, 30, 115);
        ctx.fillStyle = stoneShadow;
        ctx.fillRect(555, baseY - 115, 1, 115);
        ctx.fillRect(584, baseY - 115, 1, 115);
        // Major crack
        ctx.fillRect(570, baseY - 90, 2, 60);
        // Vines
        ctx.fillStyle = vineColor;
        for (let i = 0; i < 7; i++) {
            const x = 553 + Math.sin(i * 0.4) * 2;
            const y = baseY - 95 + i * 9;
            ctx.fillRect(x, y, 3, 5);
        }
        
        // === TREE ROOTS BREAKING THROUGH (More prominent) ===
        ctx.fillStyle = rootColor;
        // Left side root (larger)
        ctx.fillRect(42, baseY - 55, 15, 35);
        ctx.fillRect(38, baseY - 35, 22, 10);
        ctx.fillRect(35, baseY - 25, 28, 8);
        // Small plant growing from root
        ctx.fillStyle = mossLight;
        ctx.fillRect(45, baseY - 60, 3, 8);
        ctx.fillRect(48, baseY - 58, 2, 6);
        
        // Right side root (different shape)
        ctx.fillStyle = rootColor;
        ctx.fillRect(548, baseY - 52, 14, 32);
        ctx.fillRect(545, baseY - 32, 20, 9);
        ctx.fillRect(542, baseY - 22, 25, 7);
        // Plant
        ctx.fillStyle = mossLight;
        ctx.fillRect(550, baseY - 58, 3, 7);
        ctx.fillRect(553, baseY - 56, 2, 5);
        
        // === SMALL PLANTS ON TEMPLE ===
        // Ferns in gaps
        ctx.fillStyle = mossLight;
        ctx.fillRect(185, baseY - 192, 5, 14);
        ctx.fillRect(187, baseY - 190, 2, 10);
        ctx.fillRect(425, baseY - 195, 5, 12);
        ctx.fillRect(427, baseY - 193, 2, 8);
        
        // Grass tufts on ledges
        ctx.fillStyle = '#3d6b1f';
        ctx.fillRect(210, baseY - 198, 2, 6);
        ctx.fillRect(350, baseY - 196, 2, 5);
        ctx.fillRect(280, baseY - 200, 2, 7);
        ctx.fillRect(450, baseY - 197, 2, 6);
        
        // === MOISTURE/DIRT PATCHES (Weathered stone) ===
        // Darker patches where water/moisture has stained the stone
        ctx.fillStyle = stoneMoist;
        ctx.globalAlpha = 0.4;
        // Moisture patches on various tiers
        ctx.fillRect(tier4Left + 100, baseY - 195, 30, 15);
        ctx.fillRect(tier4Left + 280, baseY - 198, 25, 12);
        ctx.fillRect(tier3Left + 150, baseY - 238, 35, 18);
        ctx.fillRect(tier2Left + 80, baseY - 275, 28, 14);
        // Dirt accumulation in cracks
        ctx.fillStyle = dirtColor;
        ctx.globalAlpha = 0.5;
        ctx.fillRect(tier4Left + 80, baseY - 198, 2, 8);
        ctx.fillRect(tier3Left + 100, baseY - 240, 2, 6);
        ctx.globalAlpha = 1.0;
        
        // === HORIZONTAL SHADING LINES (Depth effect) ===
        // Subtle horizontal lines to suggest distance
        ctx.fillStyle = stoneShadow;
        ctx.globalAlpha = 0.25;
        for (let y = baseY - 300; y < baseY - 60; y += 25) {
            ctx.fillRect(50, y, 500, 1);
        }
        ctx.globalAlpha = 1.0;
        
        // === ADDITIONAL CRACKS (Varied widths) ===
        ctx.fillStyle = stoneShadow;
        // Thin crack
        ctx.fillRect(tier4Left + 200, baseY - 200, 1, 42);
        // Medium crack
        ctx.fillRect(tier3Left + 180, baseY - 242, 2, 36);
        // Wide crack
        ctx.fillRect(tier2Left + 80, baseY - 278, 3, 32);
        
        canvas.refresh();
        scene.textures.get('bg-layer2-temple').setFilter(Phaser.Textures.FilterMode.NEAREST);
    }

    /**
     * LAYER 3 — NEAR BACKGROUND (Framing Elements)
     * Creates vines, tree trunks, and foliage that frame the play area
     */
    static createBackgroundLayer3Framing(scene) {
        // Left hanging vine
        if (!scene.textures.exists('bg-layer3-vine-left')) {
            const canvas = scene.textures.createCanvas('bg-layer3-vine-left', 32, 250);
            const ctx = canvas.context;
            // Main vine stem (curved)
            ctx.fillStyle = '#1a3d0a';
            for (let y = 0; y < 250; y += 8) {
                const offset = Math.sin(y * 0.05) * 3;
                ctx.fillRect(14 + offset, y, 6, 8);
            }
            // Shadow/depth
            ctx.fillStyle = '#0F2405';
            for (let y = 0; y < 250; y += 8) {
                const offset = Math.sin(y * 0.05) * 3;
                ctx.fillRect(14 + offset, y, 2, 8);
            }
            // Leaves
            ctx.fillStyle = '#2d5016';
            ctx.fillRect(8, 20, 12, 10);
            ctx.fillRect(6, 22, 4, 6);
            ctx.fillRect(18, 50, 12, 10);
            ctx.fillRect(22, 52, 4, 6);
            ctx.fillRect(4, 80, 12, 10);
            ctx.fillRect(2, 82, 4, 6);
            ctx.fillRect(16, 120, 12, 10);
            ctx.fillRect(20, 122, 4, 6);
            ctx.fillRect(6, 160, 12, 10);
            ctx.fillRect(4, 162, 4, 6);
            ctx.fillRect(18, 200, 12, 10);
            ctx.fillRect(22, 202, 4, 6);
            canvas.refresh();
            scene.textures.get('bg-layer3-vine-left').setFilter(Phaser.Textures.FilterMode.NEAREST);
        }
        
        // Right hanging vine
        if (!scene.textures.exists('bg-layer3-vine-right')) {
            const canvas = scene.textures.createCanvas('bg-layer3-vine-right', 32, 250);
            const ctx = canvas.context;
            // Main vine stem (curved, opposite direction)
            ctx.fillStyle = '#1a3d0a';
            for (let y = 0; y < 250; y += 8) {
                const offset = -Math.sin(y * 0.05) * 3;
                ctx.fillRect(14 + offset, y, 6, 8);
            }
            // Shadow
            ctx.fillStyle = '#0F2405';
            for (let y = 0; y < 250; y += 8) {
                const offset = -Math.sin(y * 0.05) * 3;
                ctx.fillRect(14 + offset, y, 2, 8);
            }
            // Leaves (mirrored)
            ctx.fillStyle = '#2d5016';
            ctx.fillRect(12, 20, 12, 10);
            ctx.fillRect(22, 22, 4, 6);
            ctx.fillRect(2, 50, 12, 10);
            ctx.fillRect(6, 52, 4, 6);
            ctx.fillRect(16, 80, 12, 10);
            ctx.fillRect(26, 82, 4, 6);
            ctx.fillRect(4, 120, 12, 10);
            ctx.fillRect(8, 122, 4, 6);
            ctx.fillRect(14, 160, 12, 10);
            ctx.fillRect(24, 162, 4, 6);
            ctx.fillRect(2, 200, 12, 10);
            ctx.fillRect(6, 202, 4, 6);
            canvas.refresh();
            scene.textures.get('bg-layer3-vine-right').setFilter(Phaser.Textures.FilterMode.NEAREST);
        }
        
        // Tree trunk (left side)
        if (!scene.textures.exists('bg-layer3-tree-left')) {
            const canvas = scene.textures.createCanvas('bg-layer3-tree-left', 100, 400);
            const ctx = canvas.context;
            // Bark texture
            ctx.fillStyle = '#4A2E1A';
            ctx.fillRect(0, 0, 100, 400);
            // Bark pattern (vertical lines)
            ctx.fillStyle = '#3A1E0A';
            for (let x = 0; x < 100; x += 4) {
                ctx.fillRect(x, 0, 1, 400);
            }
            // Highlights
            ctx.fillStyle = '#5A3E2A';
            for (let i = 0; i < 20; i++) {
                const x = Math.random() * 100;
                const y = Math.random() * 400;
                ctx.fillRect(x, y, 2, 8);
            }
            // Visible roots at bottom
            ctx.fillStyle = '#3A1E0A';
            ctx.fillRect(20, 380, 30, 20);
            ctx.fillRect(50, 385, 25, 15);
            canvas.refresh();
            scene.textures.get('bg-layer3-tree-left').setFilter(Phaser.Textures.FilterMode.NEAREST);
        }
        
        // Tree trunk (right side)
        if (!scene.textures.exists('bg-layer3-tree-right')) {
            const canvas = scene.textures.createCanvas('bg-layer3-tree-right', 100, 400);
            const ctx = canvas.context;
            // Same as left but mirrored
            ctx.fillStyle = '#4A2E1A';
            ctx.fillRect(0, 0, 100, 400);
            ctx.fillStyle = '#3A1E0A';
            for (let x = 0; x < 100; x += 4) {
                ctx.fillRect(x, 0, 1, 400);
            }
            ctx.fillStyle = '#5A3E2A';
            for (let i = 0; i < 20; i++) {
                const x = Math.random() * 100;
                const y = Math.random() * 400;
                ctx.fillRect(x, y, 2, 8);
            }
            ctx.fillStyle = '#3A1E0A';
            ctx.fillRect(50, 380, 30, 20);
            ctx.fillRect(25, 385, 25, 15);
            canvas.refresh();
            scene.textures.get('bg-layer3-tree-right').setFilter(Phaser.Textures.FilterMode.NEAREST);
        }
        
        // Broken stone slab
        if (!scene.textures.exists('bg-layer3-slab')) {
            const canvas = scene.textures.createCanvas('bg-layer3-slab', 60, 40);
            const ctx = canvas.context;
            // Stone base
            ctx.fillStyle = '#6B5B4D';
            ctx.fillRect(0, 0, 60, 40);
            // Tilted appearance (diamond shape)
            ctx.fillStyle = '#4A3E35';
            ctx.fillRect(0, 0, 2, 40);
            ctx.fillRect(58, 0, 2, 40);
            ctx.fillRect(0, 0, 60, 2);
            ctx.fillRect(0, 38, 60, 2);
            // Crack
            ctx.fillRect(30, 5, 1, 30);
            // Moss
            ctx.fillStyle = '#2d5016';
            ctx.fillRect(5, 30, 15, 8);
            ctx.fillRect(40, 25, 12, 6);
            canvas.refresh();
            scene.textures.get('bg-layer3-slab').setFilter(Phaser.Textures.FilterMode.NEAREST);
        }
        
        // Bottom foliage (ferns and bushes)
        if (!scene.textures.exists('bg-layer3-foliage-bottom')) {
            const canvas = scene.textures.createCanvas('bg-layer3-foliage-bottom', 1280, 100);
            const ctx = canvas.context;
            // Sparse ferns and bushes - more on edges, less in center
            ctx.fillStyle = '#2d5016';
            // Left side ferns
            for (let x = 50; x < 300; x += 40) {
                const y = 60 + Math.random() * 30;
                ctx.fillRect(x, y, 3, 15);
                ctx.fillRect(x - 1, y + 2, 2, 8);
                ctx.fillRect(x + 3, y + 2, 2, 8);
            }
            // Right side ferns
            for (let x = 980; x < 1230; x += 40) {
                const y = 60 + Math.random() * 30;
                ctx.fillRect(x, y, 3, 15);
                ctx.fillRect(x - 1, y + 2, 2, 8);
                ctx.fillRect(x + 3, y + 2, 2, 8);
            }
            // Bushes
            ctx.fillStyle = '#1a3d0a';
            for (let x = 100; x < 250; x += 50) {
                const y = 70 + Math.random() * 20;
                ctx.fillRect(x, y, 12, 8);
            }
            for (let x = 1030; x < 1180; x += 50) {
                const y = 70 + Math.random() * 20;
                ctx.fillRect(x, y, 12, 8);
            }
            canvas.refresh();
            scene.textures.get('bg-layer3-foliage-bottom').setFilter(Phaser.Textures.FilterMode.NEAREST);
        }
    }

    /**
     * FOG LAYER — Between temple and platforms
     * Creates atmospheric fog to push temple further back visually
     */
    static createBackgroundFogLayer(scene) {
        if (scene.textures.exists('bg-fog-layer')) return;
        const canvas = scene.textures.createCanvas('bg-fog-layer', 1280, 200);
        const ctx = canvas.context;
        
        // Fog gradient - more dense near ground, lighter higher up
        for (let y = 0; y < 200; y++) {
            const ratio = y / 200;
            // Fog color: muted green-white, very transparent
            const alpha = (1 - ratio) * 0.25; // More fog at bottom
            const r = Math.floor(180 + ratio * 20);
            const g = Math.floor(200 + ratio * 15);
            const b = Math.floor(180 + ratio * 20);
            ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
            ctx.fillRect(0, y, 1280, 1);
        }
        
        // Add horizontal fog bands for depth
        ctx.globalAlpha = 0.15;
        ctx.fillStyle = '#C8E6C8';
        for (let y = 50; y < 200; y += 20) {
            const alpha = (200 - y) / 200 * 0.15;
            ctx.globalAlpha = alpha;
            for (let x = 0; x < 1280; x += 32) {
                if (Math.random() > 0.4) {
                    ctx.fillRect(x, y, 32, 3);
                }
            }
        }
        ctx.globalAlpha = 1.0;
        
        canvas.refresh();
        scene.textures.get('bg-fog-layer').setFilter(Phaser.Textures.FilterMode.NEAREST);
    }
}
