export class Menu extends Phaser.Scene {
    constructor() { super('Menu'); }
    create() {
        const { width, height } = this.cameras.main;
        
        // Initialize global volume if not already set
        if (!this.registry.has('musicVolume')) this.registry.set('musicVolume', 0.5);
        if (!this.registry.has('sfxVolume')) this.registry.set('sfxVolume', 0.5);

        this.background = this.add.rectangle(width / 2, height / 2, width, height, 0x000000);
        this.title = this.add.text(width / 2, 120, 'Untitled Game', { fontSize: '48px', fill: '#ffffff', fontStyle: 'bold', resolution: 2 }).setOrigin(0.5);
        
        this.menuContainer = this.add.container(0, 0);
        this.createButton(width / 2, 260, 'START', 0x1e90ff, 0x3aa0ff, () => this.scene.start('LevelSelect'), this.menuContainer);
        this.createButton(width / 2, 340, 'HOW TO PLAY', 0x444444, 0x666666, () => this.scene.start('HowToPlay'), this.menuContainer);
        this.createButton(width / 2, 420, 'SETTINGS', 0x444444, 0x666666, () => this.showSettings(), this.menuContainer);

        // Handle window resize
        this.scale.on('resize', this.handleResize, this);
    }

    handleResize(gameSize) {
        const { width, height } = gameSize;
        if (this.background && this.background.scene) {
            this.background.setPosition(width / 2, height / 2);
            this.background.setDisplaySize(width, height);
        }
        if (this.title && this.title.scene) this.title.setPosition(width / 2, 120);
        
        // Reposition buttons in menuContainer
        if (this.menuContainer && this.menuContainer.scene) {
            let i = 0;
            this.menuContainer.iterate(child => {
                const index = Math.floor(i / 2);
                const y = 260 + (index * 80);
                child.setPosition(width / 2, y);
                i++;
            });
        }

        // Re-show settings if it was open to reposition
        if (this.settingsContainer && this.settingsContainer.scene && this.settingsContainer.visible) {
            this.showSettings();
        }
    }

    createButton(x, y, text, color, hoverColor, callback, container) {
        const btn = this.add.rectangle(x, y, 260, 60, color).setStrokeStyle(3, 0xffffff);
        const txt = this.add.text(x, y, text, { fontSize: text === 'START' ? '28px' : '24px', fill: '#ffffff', fontStyle: 'bold', resolution: 2 }).setOrigin(0.5);
        btn.setInteractive({ useHandCursor: true })
            .on('pointerover', () => btn.setFillStyle(hoverColor))
            .on('pointerout', () => btn.setFillStyle(color))
            .on('pointerup', callback);
        
        if (container) {
            container.add([btn, txt]);
        }
    }

    showSettings() {
        const { width, height } = this.cameras.main;
        this.menuContainer.setVisible(false);

        if (this.settingsContainer) this.settingsContainer.destroy();
        this.settingsContainer = this.add.container(0, 0).setDepth(20000); // Ensure entire container is on top
        
        // 1. Background FIRST (Bottom of container)
        const bg = this.add.rectangle(width / 2, height / 2, 550, 500, 0x111111).setStrokeStyle(4, 0xffffff);
        const title = this.add.text(width / 2, height / 2 - 180, 'SETTINGS', { fontSize: '32px', fill: '#ffffff', fontStyle: 'bold', resolution: 2 }).setOrigin(0.5);
        this.settingsContainer.add([bg, title]);

        // 2. Music Slider Section
        const musicY = height / 2 - 60;
        const musicLabel = this.add.text(width / 2 - 220, musicY - 40, 'MUSIC VOLUME', { fontSize: '18px', fill: '#ffffff', resolution: 2 }).setOrigin(0, 0.5);
        const musicPercentText = this.add.text(width / 2 + 220, musicY, '50%', { fontSize: '22px', fill: '#00ffff', fontStyle: 'bold', resolution: 2 }).setOrigin(1, 0.5);
        this.settingsContainer.add([musicLabel, musicPercentText]);
        this.createSlider(width / 2, musicY, 'musicVolume', (val) => {
            musicPercentText.setText(`${Math.round(val * 100)}%`);
        }, this.settingsContainer);

        // 3. SFX Slider Section
        const sfxY = height / 2 + 80;
        const sfxLabel = this.add.text(width / 2 - 220, sfxY - 40, 'SFX VOLUME', { fontSize: '18px', fill: '#ffffff', resolution: 2 }).setOrigin(0, 0.5);
        const sfxPercentText = this.add.text(width / 2 + 220, sfxY, '50%', { fontSize: '22px', fill: '#00ffff', fontStyle: 'bold', resolution: 2 }).setOrigin(1, 0.5);
        this.settingsContainer.add([sfxLabel, sfxPercentText]);
        this.createSlider(width / 2, sfxY, 'sfxVolume', (val) => {
            sfxPercentText.setText(`${Math.round(val * 100)}%`);
        }, this.settingsContainer);

        // Set initial percentages
        musicPercentText.setText(`${Math.round(this.registry.get('musicVolume') * 100)}%`);
        sfxPercentText.setText(`${Math.round(this.registry.get('sfxVolume') * 100)}%`);

        // 4. Back Button (Top of container)
        this.createButton(width / 2, height / 2 + 190, 'BACK', 0xcc3300, 0xff4400, () => {
            this.settingsContainer.destroy();
            this.settingsContainer = null;
            this.menuContainer.setVisible(true);
        }, this.settingsContainer);
    }

    createSlider(x, y, registryKey, onUpdate, container) {
        const width = 300;
        
        // Track background
        const track = this.add.rectangle(x, y, width, 12, 0x444444).setOrigin(0.5).setStrokeStyle(2, 0x888888);
        
        // Fill bar (shows how much is filled)
        const fillBar = this.add.rectangle(x - width / 2, y, 0, 12, 0x00ffff).setOrigin(0, 0.5);
        
        // Handle (Draggable circle)
        const handle = this.add.circle(x, y, 12, 0xffffff).setOrigin(0.5).setInteractive({ draggable: true, useHandCursor: true }).setStrokeStyle(3, 0x000000);
        
        // Function to update visuals based on current value
        const updateSliderVisuals = (val) => {
            handle.x = (x - width / 2) + (val * width);
            fillBar.width = val * width;
        };

        // Set initial state
        const currentVal = this.registry.get(registryKey);
        updateSliderVisuals(currentVal);

        // DRAG LOGIC
        this.input.setDraggable(handle);
        
        handle.on('drag', (pointer, dragX) => {
            const minX = x - width / 2;
            const maxX = x + width / 2;
            const clampedX = Phaser.Math.Clamp(dragX, minX, maxX);
            handle.x = clampedX;
            
            const newValue = (clampedX - minX) / width;
            fillBar.width = newValue * width;
            
            this.registry.set(registryKey, newValue);
            if (onUpdate) onUpdate(newValue);
        });

        container.add([track, fillBar, handle]);
    }
}
 