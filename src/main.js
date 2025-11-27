import { Menu } from './scenes/Menu.js';
import { HowToPlay } from './scenes/HowToPlay.js';
import { Start } from './scenes/Start.js';
import { LevelSelect } from './scenes/LevelSelect.js';
import { Volcano } from './scenes/Volcano.js';

const config = {
    type: Phaser.AUTO,
    title: 'Untitled Game',
    description: '',
    parent: 'game-container',
    width: 1280,
    height: 720,
    backgroundColor: '#000000',
    pixelArt: false,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 600 },
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
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
}

new Phaser.Game(config);
            