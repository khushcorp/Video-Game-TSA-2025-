import { Menu } from './scenes/Menu.js';
import { HowToPlay } from './scenes/HowToPlay.js';
import { Start } from './scenes/Start.js';
import { LevelSelect } from './scenes/LevelSelect.js';
import { Volcano } from './scenes/Volcano.js';

// Calculate game size from the current window to avoid side bars
let gameWidth = typeof window !== 'undefined' ? window.innerWidth : 1280;
let gameHeight = typeof window !== 'undefined' ? window.innerHeight : 720;

const config = {
    type: Phaser.AUTO,
    title: 'Untitled Game',
    description: '',
    parent: 'game-container',
    width: gameWidth,
    height: gameHeight,
    backgroundColor: '#1a1a2e',
    pixelArt: true,      // crisp pixels for background
    roundPixels: true,   // snap to whole pixels
    antialias: false,    // no smoothing
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
        mode: Phaser.Scale.NONE, // use the exact size we set
        autoCenter: Phaser.Scale.CENTER_BOTH,
        parent: 'game-container'
    },
};

const game = new Phaser.Game(config);

// Resize the game when the window size changes
if (typeof window !== 'undefined') {
    window.addEventListener('resize', () => {
        if (game && game.scale) {
            game.scale.resize(window.innerWidth, window.innerHeight);
        }
    });
}
            