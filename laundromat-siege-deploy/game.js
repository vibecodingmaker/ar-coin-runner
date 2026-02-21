// Laundromat Siege - Complete Game Code
// Stage 1 (Day 1) - Foundation Build

// Game Configuration
const config = {
    type: Phaser.AUTO,
    width: 1024,
    height: 768,
    parent: 'game-container',
    backgroundColor: '#2d1b4e',
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    scene: []
};

// Boot Scene
class BootScene extends Phaser.Scene {
    constructor() {
        super({ key: 'BootScene' });
    }

    preload() {
        this.createPlaceholderAssets();
        
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
        const graphics = this.make.graphics({ x: 0, y: 0, add: false });
        
        graphics.fillStyle(0x4a90d9);
        graphics.fillRect(0, 0, 32, 32);
        graphics.generateTexture('tower-placeholder', 32, 32);
        
        graphics.clear();
        graphics.fillStyle(0xe74c3c);
        graphics.fillRect(0, 0, 24, 24);
        graphics.generateTexture('enemy-placeholder', 24, 24);
        
        graphics.clear();
        graphics.fillStyle(0xffffff);
        graphics.fillCircle(8, 8, 8);
        graphics.generateTexture('projectile-placeholder', 16, 16);
        
        graphics.clear();
        graphics.fillStyle(0x8b7355);
        graphics.fillRect(0, 0, 64, 64);
        graphics.generateTexture('tile-floor', 64, 64);
        
        graphics.clear();
        graphics.fillStyle(0x666666);
        graphics.fillRect(0, 0, 64, 64);
        graphics.generateTexture('tile-path', 64, 64);
    }
}

// Main Menu Scene
class MainMenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MainMenuScene' });
    }

    create() {
        const { width, height } = this.cameras.main;
        
        this.add.rectangle(width/2, height/2, width, height, 0x2d1b4e);
        
        const title = this.add.text(width/2, 150, '🫧 LAUNDROMAT SIEGE 🫧', {
            fontSize: '48px',
            fill: '#e94560',
            fontFamily: 'Courier New',
            stroke: '#fff',
            strokeThickness: 4
        }).setOrigin(0.5);
        
        this.add.text(width/2, 220, 'Suds & Scum Defense', {
            fontSize: '24px',
            fill: '#ffffff'
        }).setOrigin(0.5);
        
        this.add.text(width/2, 270, 'Wash away the waves before the scum overflows!', {
            fontSize: '16px',
            fill: '#aaaaaa'
        }).setOrigin(0.5);
        
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
        
        const howToBtn = this.add.text(width/2, 500, '❓ HOW TO PLAY', {
            fontSize: '24px',
            fill: '#ffffff',
            backgroundColor: '#4a4a6a',
            padding: { x: 20, y: 10 }
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });
        
        howToBtn.on('pointerover', () => howToBtn.setScale(1.1));
        howToBtn.on('pointerout', () => howToBtn.setScale(1));
        
        this.add.text(width - 10, height - 10, 'v0.1.0 - Stage 1 Build', {
            fontSize: '12px',
            fill: '#666666'
        }).setOrigin(1, 1);
        
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

// Tower Class
class Tower extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, type) {
        super(scene, x, y, 'tower-placeholder');
        
        this.scene = scene;
        this.type = type;
        scene.add.existing(this);
        
        const stats = this.getTowerStats(type);
        this.damage = stats.damage;
        this.range = stats.range;
        this.fireRate = stats.fireRate;
        this.cost = stats.cost;
        this.cleanseRate = stats.cleanseRate;
        
        this.lastShot = 0;
        this.cleanseMeter = 0;
        this.level = 1;
        
        this.setTint(stats.color);
        
        this.rangeIndicator = scene.add.circle(x, y, this.range, 0xffffff, 0.1);
        this.rangeIndicator.setVisible(false);
        
        this.createCleanseMeter();
        
        this.setInteractive({ useHandCursor: true });
        this.on('pointerover', () => {
            this.rangeIndicator.setVisible(true);
            this.setTint(0xffffff);
        });
        this.on('pointerout', () => {
            this.rangeIndicator.setVisible(false);
            this.setTint(stats.color);
        });
    }
    
    getTowerStats(type) {
        const stats = {
            'soap-blaster': { damage: 10, range: 150, fireRate: 800, cost: 50, cleanseRate: 10, color: 0x4a90d9 },
            'spin-cycle': { damage: 5, range: 100, fireRate: 100, cost: 100, cleanseRate: 15, color: 0x9b59b6 },
            'dryer-cannon': { damage: 25, range: 200, fireRate: 1500, cost: 150, cleanseRate: 20, color: 0xe74c3c }
        };
        return stats[type] || stats['soap-blaster'];
    }
    
    createCleanseMeter() {
        const barWidth = 32;
        const barHeight = 4;
        
        this.cleanseBg = this.scene.add.rectangle(this.x, this.y - 25, barWidth, barHeight, 0x000000, 0.5);
        this.cleanseBar = this.scene.add.rectangle(this.x - barWidth/2, this.y - 25, 0, barHeight, 0x00ff00);
        this.cleanseBar.setOrigin(0, 0.5);
    }
    
    update() {
        if (this.cleanseMeter < 100) {
            this.cleanseMeter += this.cleanseRate * 0.016;
            this.updateCleanseBar();
        }
        
        if (this.cleanseMeter >= 100) {
            this.activateDeepClean();
        }
    }
    
    updateCleanseBar() {
        const barWidth = 32;
        this.cleanseBar.width = (this.cleanseMeter / 100) * barWidth;
        
        if (this.cleanseMeter < 50) this.cleanseBar.setFillStyle(0x00ff00);
        else if (this.cleanseMeter < 80) this.cleanseBar.setFillStyle(0xffff00);
        else this.cleanseBar.setFillStyle(0xff0000);
    }
    
    activateDeepClean() {
        this.cleanseMeter = 0;
        
        const burst = this.scene.add.circle(this.x, this.y, 10, 0xffffff, 0.8);
        this.scene.tweens.add({
            targets: burst,
            scale: 3,
            alpha: 0,
            duration: 500,
            onComplete: () => burst.destroy()
        });
        
        this.scene.enemies.forEach(enemy => {
            const dist = Phaser.Math.Distance.Between(this.x, this.y, enemy.x, enemy.y);
            if (dist <= this.range) {
                enemy.applySlow(2000, 0.5);
            }
        });
        
        this.scene.gold += Math.floor(this.cost * 0.1);
        this.scene.updateUI();
    }
    
    canShoot() {
        return this.scene.time.now - this.lastShot >= this.fireRate;
    }
    
    shoot(target) {
        this.lastShot = this.scene.time.now;
        
        const projectile = this.scene.add.sprite(this.x, this.y, 'projectile-placeholder');
        projectile.setTint(0xffffff);
        
        const angle = Phaser.Math.Angle.Between(this.x, this.y, target.x, target.y);
        const speed = 400;
        projectile.vx = Math.cos(angle) * speed;
        projectile.vy = Math.sin(angle) * speed;
        projectile.damage = this.damage;
        projectile.target = target;
        
        projectile.update = function() {
            this.x += this.vx * 0.016;
            this.y += this.vy * 0.016;
            
            if (this.target && this.target.active) {
                const dist = Phaser.Math.Distance.Between(this.x, this.y, this.target.x, this.target.y);
                if (dist < 20) {
                    this.target.takeDamage(this.damage);
                    this.active = false;
                }
            }
            
            if (this.x < 0 || this.x > 1024 || this.y < 0 || this.y > 768) {
                this.active = false;
            }
        };
        
        this.scene.projectiles.push(projectile);
    }
    
    destroy() {
        if (this.rangeIndicator) this.rangeIndicator.destroy();
        if (this.cleanseBg) this.cleanseBg.destroy();
        if (this.cleanseBar) this.cleanseBar.destroy();
        super.destroy();
    }
}

// Enemy Class
class Enemy extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, type) {
        super(scene, x, y, 'enemy-placeholder');
        
        this.scene = scene;
        this.type = type;
        scene.add.existing(this);
        
        const stats = this.getEnemyStats(type);
        this.maxHp = stats.hp;
        this.hp = stats.hp;
        this.speed = stats.speed;
        this.reward = stats.reward;
        this.color = stats.color;
        
        this.pathIndex = 0;
        this.pathPoints = [];
        this.gridSize = 64;
        
        this.slowFactor = 1;
        this.slowTimer = 0;
        
        this.setTint(this.color);
        this.createHealthBar();
    }
    
    getEnemyStats(type) {
        const stats = {
            'rogue-sock': { hp: 30, speed: 100, reward: 5, color: 0xff6b6b },
            'lint-golem': { hp: 60, speed: 50, reward: 10, color: 0x9b59b6 },
            'stain-slug': { hp: 100, speed: 30, reward: 15, color: 0x2ecc71 },
            'laundry-basket': { hp: 80, speed: 40, reward: 12, color: 0xf39c12 },
            'shrunk-shirt': { hp: 40, speed: 120, reward: 8, color: 0x3498db }
        };
        return stats[type] || stats['rogue-sock'];
    }
    
    createHealthBar() {
        const barWidth = 24;
        const barHeight = 4;
        
        this.healthBg = this.scene.add.rectangle(this.x, this.y - 15, barWidth, barHeight, 0x000000, 0.7);
        this.healthBar = this.scene.add.rectangle(this.x - barWidth/2, this.y - 15, barWidth, barHeight, 0x2ecc71);
        this.healthBar.setOrigin(0, 0.5);
    }
    
    setPath(pathPoints, gridSize) {
        this.pathPoints = pathPoints;
        this.gridSize = gridSize;
        this.pathIndex = 0;
    }
    
    update() {
        if (this.slowTimer > 0) {
            this.slowTimer -= 16;
            if (this.slowTimer <= 0) {
                this.slowFactor = 1;
                this.clearTint();
                this.setTint(this.color);
            }
        }
        
        if (this.pathIndex < this.pathPoints.length) {
            const target = this.pathPoints[this.pathIndex];
            const targetX = target.x * this.gridSize + this.gridSize / 2;
            const targetY = target.y * this.gridSize + this.gridSize / 2;
            
            const dx = targetX - this.x;
            const dy = targetY - this.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            
            if (dist < 5) {
                this.pathIndex++;
            } else {
                this.x += (dx / dist) * this.speed * this.slowFactor * 0.016;
                this.y += (dy / dist) * this.speed * this.slowFactor * 0.016;
            }
        }
        
        this.updateHealthBar();
        this.y += Math.sin(this.scene.time.now * 0.005) * 0.5;
    }
    
    updateHealthBar() {
        const barWidth = 24;
        const healthPercent = this.hp / this.maxHp;
        
        this.healthBar.width = healthPercent * barWidth;
        this.healthBar.x = this.x - barWidth/2;
        this.healthBar.y = this.y - 15;
        
        this.healthBg.x = this.x;
        this.healthBg.y = this.y - 15;
        
        if (healthPercent > 0.6) this.healthBar.setFillStyle(0x2ecc71);
        else if (healthPercent > 0.3) this.healthBar.setFillStyle(0xf1c40f);
        else this.healthBar.setFillStyle(0xe74c3c);
        
        this.healthBar.visible = this.hp < this.maxHp;
        this.healthBg.visible = this.hp < this.maxHp;
    }
    
    takeDamage(amount) {
        this.hp -= amount;
        this.setTint(0xffffff);
        this.scene.time.delayedCall(100, () => {
            if (this.active) this.setTint(this.color);
        });
    }
    
    applySlow(duration, factor) {
        this.slowFactor = factor;
        this.slowTimer = duration;
        this.setTint(0x3498db);
    }
    
    destroy() {
        if (this.healthBg) this.healthBg.destroy();
        if (this.healthBar) this.healthBar.destroy();
        super.destroy();
    }
}

// Wave Manager
class WaveManager {
    constructor(scene) {
        this.scene = scene;
        this.wave = 1;
        this.enemiesSpawned = 0;
        this.waveInProgress = false;
        this.spawnTimer = null;
        this.waveConfig = this.generateWaveConfig();
    }
    
    generateWaveConfig() {
        const waves = [];
        for (let i = 1; i <= 10; i++) {
            const wave = {
                enemyCount: 5 + i * 3,
                enemyTypes: this.getEnemyTypesForWave(i),
                spawnInterval: Math.max(500, 2000 - i * 150),
                waveReward: 50 + i * 10
            };
            waves.push(wave);
        }
        return waves;
    }
    
    getEnemyTypesForWave(waveNumber) {
        const types = ['rogue-sock'];
        if (waveNumber >= 2) types.push('lint-golem');
        if (waveNumber >= 4) types.push('stain-slug');
        if (waveNumber >= 6) types.push('laundry-basket');
        if (waveNumber >= 8) types.push('shrunk-shirt');
        return types;
    }
    
    startWave() {
        if (this.waveInProgress) return;
        
        this.waveInProgress = true;
        this.enemiesSpawned = 0;
        
        const config = this.waveConfig[this.wave - 1] || this.waveConfig[9];
        
        this.showWaveAnnouncement();
        
        this.spawnTimer = this.scene.time.addEvent({
            delay: config.spawnInterval,
            callback: () => this.spawnEnemy(config),
            callbackScope: this,
            repeat: config.enemyCount - 1
        });
    }
    
    showWaveAnnouncement() {
        const text = this.scene.add.text(512, 200, `WAVE ${this.wave}`, {
            fontSize: '48px',
            fill: '#e94560',
            stroke: '#fff',
            strokeThickness: 4
        }).setOrigin(0.5);
        
        this.scene.tweens.add({
            targets: text,
            scale: { from: 0, to: 1 },
            duration: 500,
            ease: 'Back.out',
            onComplete: () => {
                this.scene.time.delayedCall(1500, () => {
                    this.scene.tweens.add({
                        targets: text,
                        alpha: 0,
                        duration: 300,
                        onComplete: () => text.destroy()
                    });
                });
            }
        });
    }
    
    spawnEnemy(config) {
        const type = Phaser.Math.RND.pick(config.enemyTypes);
        this.scene.spawnEnemy(type);
        this.enemiesSpawned++;
        
        if (this.enemiesSpawned >= config.enemyCount) {
            this.waveInProgress = false;
            this.scheduleNextWave();
        }
    }
    
    scheduleNextWave() {
        const checkInterval = this.scene.time.addEvent({
            delay: 1000,
            callback: () => {
                if (this.scene.enemies.length === 0 && !this.waveInProgress) {
                    this.wave++;
                    this.scene.wave = this.wave;
                    this.scene.updateUI();
                    
                    const config = this.waveConfig[this.wave - 2] || this.waveConfig[9];
                    this.scene.gold += config.waveReward;
                    this.scene.updateUI();
                    
                    this.showRewardText(config.waveReward);
                    this.scene.time.delayedCall(3000, () => this.startWave());
                    checkInterval.remove();
                }
            },
            callbackScope: this,
            loop: true
        });
    }
    
    showRewardText(amount) {
        const text = this.scene.add.text(512, 300, `+ $${amount}`, {
            fontSize: '32px',
            fill: '#ffd700'
        }).setOrigin(0.5);
        
        this.scene.tweens.add({
            targets: text,
            y: 250,
            alpha: 0,
            duration: 1500,
            onComplete: () => text.destroy()
        });
    }
}

// Game Scene
class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
    }

    init() {
        this.gold = 100;
        this.lives = 20;
        this.score = 0;
        this.wave = 1;
        this.gridSize = 64;
        this.gridWidth = 16;
        this.gridHeight = 12;
        this.towers = [];
        this.enemies = [];
        this.projectiles = [];
        this.selectedTowerType = 'soap-blaster';
    }

    create() {
        this.createMap();
        this.createUI();
        
        this.waveManager = new WaveManager(this);
        
        this.pathPoints = [
            { x: 0, y: 6 }, { x: 1, y: 6 }, { x: 2, y: 6 }, { x: 3, y: 6 },
            { x: 4, y: 6 }, { x: 5, y: 6 }, { x: 6, y: 6 }, { x: 7, y: 6 },
            { x: 8, y: 6 }, { x: 9, y: 6 }, { x: 10, y: 6 }, { x: 11, y: 6 },
            { x: 12, y: 6 }, { x: 13, y: 6 }, { x: 14, y: 6 }, { x: 15, y: 6 }
        ];
        
        this.startPoint = { x: 0, y: 6 };
        this.endPoint = { x: 15, y: 6 };
        
        this.input.on('pointerdown', this.handleMapClick, this);
        
        this.time.delayedCall(2000, () => this.waveManager.startWave());
        
        this.updateTimer = this.time.addEvent({
            delay: 16,
            callback: this.gameUpdate,
            callbackScope: this,
            loop: true
        });
    }

    createMap() {
        this.mapGroup = this.add.group();
        this.grid = [];
        
        for (let x = 0; x < this.gridWidth; x++) {
            this.grid[x] = [];
            for (let y = 0; y < this.gridHeight; y++) {
                const isPath = (y === 6);
                const tile = this.add.image(
                    x * this.gridSize + this.gridSize / 2,
                    y * this.gridSize + this.gridSize / 2,
                    isPath ? 'tile-path' : 'tile-floor'
                );
                tile.setOrigin(0.5);
                tile.gridX = x;
                tile.gridY = y;
                tile.isPath = isPath;
                tile.setInteractive();
                
                tile.on('pointerover', () => tile.setTint(0xcccccc));
                tile.on('pointerout', () => tile.clearTint());
                
                this.mapGroup.add(tile);
                this.grid[x][y] = { tile, hasTower: false, isPath };
            }
        }
    }

    createUI() {
        this.add.rectangle(512, 20, 1024, 40, 0x1a1a1a);
        
        this.goldText = this.add.text(20, 10, '💰 $100', { fontSize: '20px', fill: '#ffd700' });
        this.livesText = this.add.text(200, 10, '❤️ 20', { fontSize: '20px', fill: '#e74c3c' });
        this.waveText = this.add.text(380, 10, '🌊 Wave: 1', { fontSize: '20px', fill: '#3498db' });
        this.scoreText = this.add.text(600, 10, '⭐ Score: 0', { fontSize: '20px', fill: '#ffffff' });
        
        this.add.rectangle(512, 748, 1024, 80, 0x2d2d2d);
        
        const towerTypes = [
            { key: 'soap-blaster', name: '🧼 Soap Blaster', cost: 50 },
            { key: 'spin-cycle', name: '🔄 Spin Cycle', cost: 100 },
            { key: 'dryer-cannon', name: '🔥 Dryer Cannon', cost: 150 }
        ];
        
        towerTypes.forEach((tower, index) => {
            const btn = this.add.text(100 + index * 250, 740, `${tower.name} ($${tower.cost})`, {
                fontSize: '16px',
                fill: '#ffffff',
                backgroundColor: this.selectedTowerType === tower.key ? '#e94560' : '#4a4a4a',
                padding: { x: 15, y: 10 }
            }).setInteractive({ useHandCursor: true });
            
            btn.on('pointerdown', () => {
                this.selectedTowerType = tower.key;
                towerTypes.forEach((t) => {
                    const b = this.children.list.find(c => c.text && c.text.includes(t.name));
                    if (b) b.setStyle({ backgroundColor: t.key === tower.key ? '#e94560' : '#4a4a4a' });
                });
            });
        });
        
        const menuBtn = this.add.text(924, 10, '🏠 Menu', {
            fontSize: '16px',
            fill: '#ffffff',
            backgroundColor: '#666666',
            padding: { x: 10, y: 5 }
        }).setInteractive({ useHandCursor: true });
        
        menuBtn.on('pointerdown', () => this.scene.start('MainMenuScene'));
    }

    handleMapClick(pointer) {
        const gridX = Math.floor(pointer.x / this.gridSize);
        const gridY = Math.floor(pointer.y / this.gridSize);
        
        if (gridX < 0 || gridX >= this.gridWidth || gridY < 0 || gridY >= this.gridHeight) return;
        
        const cell = this.grid[gridX][gridY];
        if (cell.isPath || cell.hasTower) return;
        
        const costs = { 'soap-blaster': 50, 'spin-cycle': 100, 'dryer-cannon': 150 };
        if (this.gold >= costs[this.selectedTowerType]) {
            this.placeTower(gridX, gridY, this.selectedTowerType);
            this.gold -= costs[this.selectedTowerType];
            this.updateUI();
        }
    }

    placeTower(gridX, gridY, type) {
        const x = gridX * this.gridSize + this.gridSize / 2;
        const y = gridY * this.gridSize + this.gridSize / 2;
        
        const tower = new Tower(this, x, y, type);
        this.towers.push(tower);
        this.grid[gridX][gridY].hasTower = true;
    }

    spawnEnemy(type) {
        const startX = this.startPoint.x * this.gridSize + this.gridSize / 2;
        const startY = this.startPoint.y * this.gridSize + this.gridSize / 2;
        
        const enemy = new Enemy(this, startX, startY, type);
        enemy.setPath(this.pathPoints, this.gridSize);
        this.enemies.push(enemy);
    }

    gameUpdate() {
        this.towers.forEach(tower => tower.update());
        
        this.enemies = this.enemies.filter(enemy => {
            enemy.update();
            
            const distToEnd = Phaser.Math.Distance.Between(
                enemy.x, enemy.y,
                this.endPoint.x * this.gridSize + this.gridSize / 2,
                this.endPoint.y * this.gridSize + this.gridSize / 2
            );
            
            if (distToEnd < 10) {
                this.lives--;
                enemy.destroy();
                this.updateUI();
                
                if (this.lives <= 0) this.gameOver();
                return false;
            }
            
            if (enemy.hp <= 0) {
                this.gold += enemy.reward;
                this.score += enemy.reward * 10;
                enemy.destroy();
                this.updateUI();
                return false;
            }
            
            return true;
        });
        
        this.projectiles = this.projectiles.filter(proj => {
            proj.update();
            if (proj.active) return true;
            proj.destroy();
            return false;
        });
        
        this.towers.forEach(tower => {
            if (tower.canShoot()) {
                const target = this.findTarget(tower);
                if (target) tower.shoot(target);
            }
        });
    }

    findTarget(tower) {
        let closest = null;
        let minDist = Infinity;
        
        this.enemies.forEach(enemy => {
            const dist = Phaser.Math.Distance.Between(tower.x, tower.y, enemy.x, enemy.y);
            if (dist <= tower.range && dist < minDist) {
                minDist = dist;
                closest = enemy;
            }
        });
        
        return closest;
    }

    updateUI() {
        this.goldText.setText(`💰 $${this.gold}`);
        this.livesText.setText(`❤️ ${this.lives}`);
        this.waveText.setText(`🌊 Wave: ${this.wave}`);
        this.scoreText.setText(`⭐ Score: ${this.score}`);
    }

    gameOver() {
        this.updateTimer.remove();
        
        const overlay = this.add.rectangle(512, 384, 1024, 768, 0x000000, 0.8);
        
        this.add.text(512, 300, 'GAME OVER', {
            fontSize: '64px',
            fill: '#e74c3c'
        }).setOrigin(0.5);
        
        this.add.text(512, 400, `Final Score: ${this.score}`, {
            fontSize: '32px',
            fill: '#ffffff'
        }).setOrigin(0.5);
        
        const restartBtn = this.add.text(512, 500, '🔄 Try Again', {
            fontSize: '28px',
            fill: '#ffffff',
            backgroundColor: '#e94560',
            padding: { x: 20, y: 10 }
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });
        
        restartBtn.on('pointerdown', () => this.scene.restart());
    }
}

// Register scenes
config.scene = [BootScene, MainMenuScene, GameScene];

// Hide loading and start game
window.onload = () => {
    document.getElementById('loading').style.display = 'none';
    const game = new Phaser.Game(config);
};
