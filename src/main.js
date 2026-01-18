import { Menu } from './scenes/Menu.js';
import { HowToPlay } from './scenes/HowToPlay.js';
import { Start } from './scenes/Start.js';
import { LevelSelect } from './scenes/LevelSelect.js';
import { Volcano } from './scenes/Volcano.js';

// Use a fixed base resolution for the game logic
// The game is designed for 1280x720 (16:9)
const gameWidth = 1280;
const gameHeight = 720;

const config = {
    type: Phaser.AUTO,
    title: 'Untitled Game',
    description: '',
    parent: 'game-container',
    width: gameWidth,
    height: gameHeight,
    backgroundColor: '#000000',
    pixelArt: true,      // pixel-art rendering
    roundPixels: true,   // snap to whole pixels
    antialias: false,    // keep sprites sharp
    render: { pixelArt: true, antialias: false },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 600 }, // keep original gameplay gravity
            debug: false
        }
    },
    scene: [
        Menu,
        HowToPlay,
        LevelSelect,
        Start,
        Volcano
    ],
    scale: {
        mode: Phaser.Scale.RESIZE, // Scale the game to fill the window
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: '100%',
        height: '100%',
        parent: 'game-container'
    },
};

const game = new Phaser.Game(config);

            