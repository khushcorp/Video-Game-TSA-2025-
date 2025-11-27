export class LevelSelect extends Phaser.Scene {

    constructor() {
        super('LevelSelect');
    }

    create() {
        const { width, height } = this.cameras.main;

        // Background with gradient effect
        const bg = this.add.rectangle(width / 2, height / 2, width, height, 0x1a1a2e);
        this.add.rectangle(width / 2, 0, width, height / 2, 0x0f0f1e).setOrigin(0.5, 0);

        // Title
        this.add.text(width / 2, 80, 'SELECT LEVEL', {
            fontSize: '48px',
            fill: '#ffffff',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 4
        }).setOrigin(0.5);

        // Level cards container
        const cardSpacing = 400;
        const cardY = height / 2;
        const cardWidth = 300;
        const cardHeight = 400;

        // Forest Level Card - positioned on the left
        const forestCardX = width / 2 - cardSpacing;
        const forestCard = this.add.rectangle(forestCardX, cardY, cardWidth, cardHeight, 0x228B22);
        forestCard.setStrokeStyle(3, 0xffffff);
        forestCard.setAlpha(0.8);
        forestCard.setInteractive({ useHandCursor: true });
        
        // Forest card text and decorations
        const forestTitle = this.add.text(forestCardX, cardY - 120, 'FOREST', {
            fontSize: '36px',
            fill: '#ffffff',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 3
        }).setOrigin(0.5);
        forestTitle.disableInteractive();
        
        const forestDesc = this.add.text(forestCardX, cardY + 100, 'A mystical forest filled with vines and ancient runes', {
            fontSize: '16px',
            fill: '#ffffff',
            align: 'center',
            wordWrap: { width: cardWidth - 40 },
            stroke: '#000000',
            strokeThickness: 2
        }).setOrigin(0.5);
        forestDesc.disableInteractive();
        
        // Forest decorations
        for (let i = 0; i < 3; i++) {
            const vine = this.add.rectangle(forestCardX - 30 + i * 30, cardY - 20, 8, 60, 0x228B22);
            vine.disableInteractive();
        }
        const forestCircle = this.add.circle(forestCardX, cardY - 50, 15, 0x32CD32);
        forestCircle.disableInteractive();
        
        // Forest card interactions
        forestCard.on('pointerdown', () => {
            this.scene.start('Start');
        });
        forestCard.on('pointerover', () => {
            forestCard.setScale(1.05);
            forestCard.setStrokeStyle(4, 0x32CD32);
        });
        forestCard.on('pointerout', () => {
            forestCard.setScale(1);
            forestCard.setStrokeStyle(3, 0xffffff);
        });

        // Volcano Level Card - positioned on the right (LOCKED - Work in Progress)
        const volcanoCardX = width / 2 + cardSpacing;
        const volcanoCard = this.add.rectangle(volcanoCardX, cardY, cardWidth, cardHeight, 0xFF4500);
        volcanoCard.setStrokeStyle(3, 0x666666);
        volcanoCard.setAlpha(0.5); // Dimmed to show it's locked
        volcanoCard.setInteractive({ useHandCursor: false }); // Disabled cursor
        
        // Large lock symbol - centered on card
        const lockX = volcanoCardX;
        const lockY = cardY - 30;
        
        // Large lock body (rectangle)
        const lockBody = this.add.rectangle(lockX, lockY + 25, 80, 70, 0x888888);
        lockBody.setStrokeStyle(5, 0xaaaaaa);
        lockBody.disableInteractive();
        
        // Large lock shackle (semicircle on top)
        const lockShackle = this.add.arc(lockX, lockY, 40, 180, 0, false, 0x888888);
        lockShackle.setStrokeStyle(5, 0xaaaaaa);
        lockShackle.disableInteractive();
        
        // Work in Progress message
        const wipText = this.add.text(volcanoCardX, cardY + 100, 'WORK IN PROGRESS', {
            fontSize: '24px',
            fill: '#ff0000',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 4
        }).setOrigin(0.5);
        wipText.disableInteractive();
        
        // Volcano title only
        const volcanoTitle = this.add.text(volcanoCardX, cardY - 120, 'VOLCANO', {
            fontSize: '36px',
            fill: '#888888',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 3
        }).setOrigin(0.5);
        volcanoTitle.disableInteractive();
        
        // Volcano card interactions - DISABLED (locked)
        volcanoCard.on('pointerover', () => {
            // No hover effect - card is locked
        });
        volcanoCard.on('pointerout', () => {
            // No hover effect - card is locked
        });
        // No pointerdown handler - card is locked and cannot be clicked

        // Back button
        const backButton = this.add.rectangle(width / 2, height - 80, 200, 50, 0x444444);
        backButton.setStrokeStyle(3, 0xffffff);
        const backText = this.add.text(width / 2, height - 80, 'BACK', {
            fontSize: '24px',
            fill: '#ffffff',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        backText.disableInteractive();
        backButton.setInteractive({ useHandCursor: true })
            .on('pointerover', () => {
                backButton.setFillStyle(0x666666);
                backText.setStyle({ fill: '#ffff00' });
            })
            .on('pointerout', () => {
                backButton.setFillStyle(0x444444);
                backText.setStyle({ fill: '#ffffff' });
            })
            .on('pointerdown', () => {
                this.scene.start('Menu');
            });
    }
}
