import Phaser from 'phaser';

export default class MainMenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MainMenuScene' });
    }

    create() {
        const { width, height } = this.cameras.main;
        
        // Background
        this.add.rectangle(width/2, height/2, width, height, 0x2d1b4e);
        
        // Title
        const title = this.add.text(width/2, 150, '🫧 LAUNDROMAT SIEGE 🫧', {
            fontSize: '48px',
            fill: '#e94560',
            fontFamily: 'Courier New',
            stroke: '#fff',
            strokeThickness: 4
        }).setOrigin(0.5);
        
        // Subtitle
        this.add.text(width/2, 220, 'Suds & Scum Defense', {
            fontSize: '24px',
            fill: '#ffffff'
        }).setOrigin(0.5);
        
        // Tagline
        this.add.text(width/2, 270, 'Wash away the waves before the scum overflows!', {
            fontSize: '16px',
            fill: '#aaaaaa'
        }).setOrigin(0.5);
        
        // Start button
        const startBtn = this.add.text(width/2, 400, '▶ START SHIFT', {
            fontSize: '32px',
            fill: '#ffffff',
            backgroundColor: '#e94560',
            padding: { x: 30, y: 15 }
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });
        
        startBtn.on('pointerover', () => {
            startBtn.setScale(1.1);
            startBtn.setStyle({ fill: '#ffff00' });
        });
        
        startBtn.on('pointerout', () => {
            startBtn.setScale(1);
            startBtn.setStyle({ fill: '#ffffff' });
        });
        
        startBtn.on('pointerdown', () => {
            this.scene.start('GameScene');
        });
        
        // How to play button
        const howToBtn = this.add.text(width/2, 500, '❓ HOW TO PLAY', {
            fontSize: '24px',
            fill: '#ffffff',
            backgroundColor: '#4a4a6a',
            padding: { x: 20, y: 10 }
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });
        
        howToBtn.on('pointerover', () => howToBtn.setScale(1.1));
        howToBtn.on('pointerout', () => howToBtn.setScale(1));
        
        // Version info
        this.add.text(width - 10, height - 10, 'v0.1.0 - Day 1 Build', {
            fontSize: '12px',
            fill: '#666666'
        }).setOrigin(1, 1);
        
        // Animated bubbles
        this.createBubbles();
    }
    
    createBubbles() {
        for (let i = 0; i < 20; i++) {
            const x = Phaser.Math.Between(0, this.cameras.main.width);
            const y = Phaser.Math.Between(this.cameras.main.height, this.cameras.main.height + 200);
            const bubble = this.add.circle(x, y, Phaser.Math.Between(5, 15), 0xffffff, 0.3);
            
            this.tweens.add({
                targets: bubble,
                y: -50,
                duration: Phaser.Math.Between(5000, 10000),
                repeat: -1,
                delay: Phaser.Math.Between(0, 5000),
                onRepeat: () => {
                    bubble.x = Phaser.Math.Between(0, this.cameras.main.width);
                }
            });
        }
    }
}
