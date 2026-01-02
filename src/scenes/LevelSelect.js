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

        // Volcano Level Card - positioned on the right
        const volcanoCardX = width / 2 + cardSpacing;
        const volcanoCard = this.add.rectangle(volcanoCardX, cardY, cardWidth, cardHeight, 0xFF4500);
        volcanoCard.setStrokeStyle(3, 0xffffff);
        volcanoCard.setAlpha(0.8);
        volcanoCard.setInteractive({ useHandCursor: true });
        
        // Volcano card text and decorations
        const volcanoTitle = this.add.text(volcanoCardX, cardY - 120, 'VOLCANO', {
            fontSize: '36px',
            fill: '#ffffff',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 3
        }).setOrigin(0.5);
        volcanoTitle.disableInteractive();
        
        const volcanoDesc = this.add.text(volcanoCardX, cardY + 100, 'A dangerous volcanic landscape with falling platforms', {
            fontSize: '16px',
            fill: '#ffffff',
            align: 'center',
            wordWrap: { width: cardWidth - 40 },
            stroke: '#000000',
            strokeThickness: 2
        }).setOrigin(0.5);
        volcanoDesc.disableInteractive();
        
        // Volcano decorations
        const volcanoShape = this.add.polygon(volcanoCardX, cardY + 20, [
            -40, 20,
            0, -40,
            40, 20
        ], 0xFF4500);
        volcanoShape.disableInteractive();
        const volcanoCircle1 = this.add.circle(volcanoCardX, cardY - 10, 20, 0xFF6347);
        volcanoCircle1.disableInteractive();
        const volcanoCircle2 = this.add.circle(volcanoCardX - 15, cardY - 5, 8, 0xFFD700);
        volcanoCircle2.disableInteractive();
        const volcanoCircle3 = this.add.circle(volcanoCardX + 15, cardY - 5, 8, 0xFFD700);
        volcanoCircle3.disableInteractive();
        
        // Volcano card interactions
        volcanoCard.on('pointerdown', () => {
            this.scene.start('Volcano');
        });
        volcanoCard.on('pointerover', () => {
            volcanoCard.setScale(1.05);
            volcanoCard.setStrokeStyle(4, 0xFF6347);
        });
        volcanoCard.on('pointerout', () => {
            volcanoCard.setScale(1);
            volcanoCard.setStrokeStyle(3, 0xffffff);
        });

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
