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

        // Two-column layout to fit everything on screen
        const leftX = width * 0.25;
        const rightX = width * 0.75;
        let currentY = 100;
        const fontSize = 11;
        const lineSpacing = 14;

        // LEFT COLUMN
        const controlsText =
            'CONTROLS\n\n' +
            'Player 1 (Solari, Gold)\n' +
            '- Move: A / D\n' +
            '- Jump: W\n' +
            '- Climb: W up, S down, SPACE off\n' +
            '- Totem: WASD\n' +
            '- Lights Out: Keys 1-7\n\n' +
            'Player 2 (Umbrae, Purple)\n' +
            '- Move: Left / Right arrows\n' +
            '- Jump: Up arrow\n' +
            '- Climb: Up down, Down down, ENTER off\n' +
            '- Totem: Arrow keys\n' +
            '- Lights Out: Keys 4-0\n\n';

        const objectiveText =
            'OBJECTIVE\n' +
            '- Complete puzzles to gain influence.\n' +
            '- Influence paints the level with your color.\n' +
            '- First to max influence wins.\n\n';

        this.add.text(leftX, currentY, controlsText + objectiveText, {
            fontSize: fontSize + 'px',
            fill: '#ffffff',
            align: 'left',
            wordWrap: { width: 550 }
        }).setOrigin(0.5, 0);

        // RIGHT COLUMN - LIGHTS OUT (HIGHLIGHTED)
        const lightsOutText =
            'LIGHTS OUT PUZZLE\n' +
            'Location: GREEN VINE WALL on MIDDLE PLATFORM (center, Y=280)\n' +
            'Start: Press W (P1) or Up (P2) near indicator\n\n' +
            'Controls:\n' +
            'P1: Keys 1-7 | P2: Keys 4-0\n\n' +
            'How it works:\n' +
            'Each key toggles that vine + neighbors:\n' +
            'Key 1: vines 1,2 | Key 2: vines 1,2,3\n' +
            'Key 3: vines 2,3,4 | Key 4: vines 3,4,5\n' +
            'Key 5: vines 4,5,6 | Key 6: vines 5,6,7\n' +
            'Key 7: vines 6,7\n' +
            '(P2: Key 4=vine1, Key5=vine2... Key0=vine7)\n\n' +
            'Goal: Turn ALL 7 vines ON to your color\n' +
            'Solari: GOLD/YELLOW | Umbrae: PURPLE\n\n' +
            'Starting state:\n' +
            'Unclaimed: All GREEN (OFF)\n' +
            'Opponent owns: All OPPONENT COLOR (ON)\n\n' +
            'Time: 15 seconds\n' +
            'Reward: +2 influence/sec while owned\n' +
            'Penalty: -2 influence/sec + 50% slower climbing (20s)\n' +
            'Cooldown: 20s after fail OR first claim\n' +
            'Steal from opponent: NO cooldown\n' +
            'Ownership: Only ONE player controls at a time';

        this.add.text(rightX, currentY, lightsOutText, {
            fontSize: fontSize + 'px',
            fill: '#ffff00',
            align: 'left',
            fontStyle: 'bold',
            wordWrap: { width: 550 }
        }).setOrigin(0.5, 0);

        // TOTEM - Below left column (moved further down to avoid overlap)
        const totemY = currentY + 280;
        const totemText =
            'TOTEM MINIGAME (Top Center)\n' +
            'Stand near totem, press W (P1) or Up (P2)\n' +
            'Watch rotation sequence, copy with WASD/Arrows\n' +
            '5 rounds, each gets longer\n' +
            'Reward: Speed boost + influence\n' +
            'Cooldown: 20 seconds';

        this.add.text(leftX, totemY, totemText, {
            fontSize: fontSize + 'px',
            fill: '#ffffff',
            align: 'left',
            wordWrap: { width: 550 }
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

