import Phaser from 'phaser';

export default class BootScene extends Phaser.Scene {
    constructor() {
        super({ key: 'BootScene' });
    }

    preload() {
        // Create placeholder graphics programmatically for now
        this.createPlaceholderAssets();
        
        // Loading bar
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;
        
        const progressBar = this.add.graphics();
        const progressBox = this.add.graphics();
        progressBox.fillStyle(0x222222, 0.8);
        progressBox.fillRect(width / 2 - 160, height / 2 - 30, 320, 50);
        
        const loadingText = this.add.text(width / 2, height / 2 - 50, 'Loading...', {
            fontSize: '20px',
            fill: '#ffffff'
        }).setOrigin(0.5);
        
        const percentText = this.add.text(width / 2, height / 2, '0%', {
            fontSize: '18px',
            fill: '#ffffff'
        }).setOrigin(0.5);
        
        this.load.on('progress', (value) => {
            percentText.setText(parseInt(value * 100) + '%');
            progressBar.clear();
            progressBar.fillStyle(0xe94560, 1);
            progressBar.fillRect(width / 2 - 150, height / 2 - 20, 300 * value, 30);
        });
        
        this.load.on('complete', () => {
            progressBar.destroy();
            progressBox.destroy();
            loadingText.destroy();
            percentText.destroy();
        });
    }

    create() {
        this.scene.start('MainMenuScene');
    }

    createPlaceholderAssets() {
        // Create simple colored rectangles as placeholder sprites
        const graphics = this.make.graphics({ x: 0, y: 0, add: false });
        
        // Tower placeholder (blue square)
        graphics.fillStyle(0x4a90d9);
        graphics.fillRect(0, 0, 32, 32);
        graphics.generateTexture('tower-placeholder', 32, 32);
        
        // Enemy placeholder (red square)
        graphics.clear();
        graphics.fillStyle(0xe74c3c);
        graphics.fillRect(0, 0, 24, 24);
        graphics.generateTexture('enemy-placeholder', 24, 24);
        
        // Projectile placeholder (white circle)
        graphics.clear();
        graphics.fillStyle(0xffffff);
        graphics.fillCircle(8, 8, 8);
        graphics.generateTexture('projectile-placeholder', 16, 16);
        
        // Map tile placeholder
        graphics.clear();
        graphics.fillStyle(0x8b7355);
        graphics.fillRect(0, 0, 64, 64);
        graphics.generateTexture('tile-floor', 64, 64);
        
        // Path placeholder
        graphics.clear();
        graphics.fillStyle(0x666666);
        graphics.fillRect(0, 0, 64, 64);
        graphics.generateTexture('tile-path', 64, 64);
    }
}
