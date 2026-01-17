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
    backgroundColor: '#1a1a2e',
    pixelArt: false,      // standard rendering for vector graphics
    roundPixels: true,   // snap to whole pixels
    antialias: true,     // smooth edges for circles and text
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
        mode: Phaser.Scale.FIT, // Scale the game to fit the window
        autoCenter: Phaser.Scale.CENTER_BOTH,
        parent: 'game-container'
    },
};

const game = new Phaser.Game(config);

            