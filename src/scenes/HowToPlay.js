export class HowToPlay extends Phaser.Scene {

    constructor() {
        super('HowToPlay');
    }

    create() {
        const { width, height } = this.cameras.main;

        // Background
        this.add.rectangle(width / 2, height / 2, width, height, 0x000000);

        // Title
        this.add.text(width / 2, 50, 'HOW TO PLAY', {
            fontSize: '40px',
            fill: '#ffffff',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        // Instructions text
        const howTextContent =
            'LEVEL 1 CONTROLS\n\n' +
            'Player 1 (Solari, Gold)\n' +
            '- Move: A / D\n' +
            '- Jump: W\n' +
            '- Climb vines: walk into a vine, then W to climb, S to slide, SPACE to jump off\n' +
            '- Totem minigame input: WASD to enter directions in order\n\n' +
            'Player 2 (Umbrae, Purple)\n' +
            '- Move: Left / Right arrows\n' +
            '- Jump: Up arrow\n' +
            '- Climb vines: walk into a vine, then Up to climb, Down to slide,\n' +
            '  ENTER / RETURN to jump off the vine\n' +
            '- Totem minigame input: Arrow keys to enter directions in order\n\n' +
            'OBJECTIVE\n' +
            '- Complete puzzles to gain influence.\n' +
            '- Influence paints the level with your color (gold or purple) over time.\n' +
            '- First faction to reach max influence wins the level.\n\n' +
            'TOTEM MINIGAME\n' +
            '- Stand near the totem and press W (P1) or Up Arrow (P2) to start.\n' +
            '- Watch the totem rotate and remember the sequence.\n' +
            '- When it is YOUR TURN, copy the rotations using WASD / Arrow keys.\n' +
            '- Each correct round makes the pattern longer. Completing all rounds\n' +
            '  powers up your faction and gives a speed boost.';

        this.add.text(width / 2, 120, howTextContent, {
            fontSize: '18px',
            fill: '#ffffff',
            align: 'left',
            wordWrap: { width: 1000 }
        }).setOrigin(0.5, 0);

        // Back button
        const backButton = this.add.rectangle(width / 2, height - 60, 200, 50, 0x444444);
        backButton.setStrokeStyle(3, 0xffffff);
        const backText = this.add.text(width / 2, height - 60, 'BACK', {
            fontSize: '24px',
            fill: '#ffffff',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        backButton.setInteractive({ useHandCursor: true })
            .on('pointerover', () => backButton.setFillStyle(0x666666))
            .on('pointerout', () => backButton.setFillStyle(0x444444))
            .on('pointerup', () => {
                this.scene.start('Menu');
            });
    }
}

