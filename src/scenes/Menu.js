export class Menu extends Phaser.Scene {

    constructor() {
        super('Menu');
    }

    create() {
        const { width, height } = this.cameras.main;

        // Simple background
        this.add.rectangle(width / 2, height / 2, width, height, 0x000000);

        // Title
        this.add.text(width / 2, 120, 'Untitled Game', {
            fontSize: '48px',
            fill: '#ffffff',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        // Start button
        const startButton = this.add.rectangle(width / 2, 260, 260, 60, 0x1e90ff);
        startButton.setStrokeStyle(3, 0xffffff);
        const startText = this.add.text(width / 2, 260, 'START', {
            fontSize: '28px',
            fill: '#ffffff',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        startButton.setInteractive({ useHandCursor: true })
            .on('pointerover', () => startButton.setFillStyle(0x3aa0ff))
            .on('pointerout', () => startButton.setFillStyle(0x1e90ff))
            .on('pointerup', () => {
                this.scene.start('Start');
            });

        // How To Play button
        const howButton = this.add.rectangle(width / 2, 340, 260, 60, 0x444444);
        howButton.setStrokeStyle(3, 0xffffff);
        const howText = this.add.text(width / 2, 340, 'HOW TO PLAY', {
            fontSize: '24px',
            fill: '#ffffff',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        howButton.setInteractive({ useHandCursor: true })
            .on('pointerover', () => howButton.setFillStyle(0x666666))
            .on('pointerout', () => howButton.setFillStyle(0x444444))
            .on('pointerup', () => {
                this.scene.start('HowToPlay');
            });
    }
}


