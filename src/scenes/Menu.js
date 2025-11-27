export class Menu extends Phaser.Scene {
    constructor() { super('Menu'); }
    create() {
        const { width, height } = this.cameras.main;
        this.add.rectangle(width / 2, height / 2, width, height, 0x000000);
        this.add.text(width / 2, 120, 'Untitled Game', { fontSize: '48px', fill: '#ffffff', fontStyle: 'bold' }).setOrigin(0.5);
        this.createButton(width / 2, 260, 'START', 0x1e90ff, 0x3aa0ff, () => this.scene.start('LevelSelect'));
        this.createButton(width / 2, 340, 'HOW TO PLAY', 0x444444, 0x666666, () => this.scene.start('HowToPlay'));
    }
    createButton(x, y, text, color, hoverColor, callback) {
        const btn = this.add.rectangle(x, y, 260, 60, color).setStrokeStyle(3, 0xffffff);
        this.add.text(x, y, text, { fontSize: text === 'START' ? '28px' : '24px', fill: '#ffffff', fontStyle: 'bold' }).setOrigin(0.5);
        btn.setInteractive({ useHandCursor: true })
            .on('pointerover', () => btn.setFillStyle(hoverColor))
            .on('pointerout', () => btn.setFillStyle(color))
            .on('pointerup', callback);
    }
}
 