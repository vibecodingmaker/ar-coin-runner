// Sky Defender - 2D Plane Shooting Game
// MVP for each level/stage

// Game Configuration
const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'game-container',
    backgroundColor: '#0a0a0a',
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
        progressBox.fillStyle(0x111111, 0.8);
        progressBox.fillRect(width / 2 - 160, height / 2 - 30, 320, 50);
        
        const loadingText = this.add.text(width / 2, height / 2 - 50, 'Loading...', {
            fontSize: '20px',
            fill: '#00ff88'
        }).setOrigin(0.5);
        
        const percentText = this.add.text(width / 2, height / 2, '0%', {
            fontSize: '18px',
            fill: '#00ff88'
        }).setOrigin(0.5);
        
        this.load.on('progress', (value) => {
            percentText.setText(parseInt(value * 100) + '%');
            progressBar.clear();
            progressBar.fillStyle(0x00ff88, 1);
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
        
        // Player plane (green)
        graphics.fillStyle(0x00ff88);
        graphics.fillRect(0, 0, 48, 48);
        graphics.fillCircle(24, 24, 20);
        graphics.fillStyle(0x00cc66);
        graphics.fillRect(10, 5, 8, 15);
        graphics.fillRect(30, 5, 8, 15);
        graphics.fillRect(18, 5, 12, 8);
        graphics.generateTexture('player-plane', 48, 48);
        
        // Enemy types
        graphics.clear();
        graphics.fillStyle(0xff3366);
        graphics.fillRect(0, 0, 40, 40);
        graphics.generateTexture('enemy-1', 40, 40);
        
        graphics.clear();
        graphics.fillStyle(0xff6600);
        graphics.fillCircle(20, 20, 20);
        graphics.generateTexture('enemy-2', 40, 40);
        
        graphics.clear();
        graphics.fillStyle(0x9933ff);
        graphics.fillRect(0, 0, 50, 50);
        graphics.generateTexture('enemy-3', 50, 50);
        
        // Boss
        graphics.clear();
        graphics.fillStyle(0xff0000);
        graphics.fillRect(0, 0, 120, 120);
        graphics.fillStyle(0x000000);
        graphics.fillRect(30, 20, 20, 30);
        graphics.fillRect(70, 20, 20, 30);
        graphics.fillRect(45, 50, 30, 30);
        graphics.generateTexture('boss', 120, 120);
        
        // Bullet
        graphics.clear();
        graphics.fillStyle(0x00ffff);
        graphics.fillCircle(6, 6, 6);
        graphics.generateTexture('bullet', 12, 12);
        
        // Coin
        graphics.clear();
        graphics.fillStyle(0xffd700);
        graphics.fillCircle(10, 10, 10);
        graphics.generateTexture('coin', 20, 20);
        
        // Power-up
        graphics.clear();
        graphics.fillStyle(0xff00ff);
        graphics.fillCircle(10, 10, 10);
        graphics.generateTexture('powerup', 20, 20);
    }
}

// Main Menu Scene
class MainMenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MainMenuScene' });
    }

    create() {
        const { width, height } = this.cameras.main;
        
        this.add.rectangle(width/2, height/2, width, height, 0x0a0a0a);
        
        const title = this.add.text(width/2, 150, '✈️ SKY DEFENDER ✈️', {
            fontSize: '56px',
            fill: '#00ff88',
            fontFamily: 'Courier New',
            stroke: '#00ff88',
            strokeThickness: 4
        }).setOrigin(0.5);
        
        this.add.text(width/2, 220, '2D Plane Shooting Game', {
            fontSize: '24px',
            fill: '#ffffff'
        }).setOrigin(0.5);
        
        this.add.text(width/2, 280, 'Destroy enemies, collect coins, upgrade weapons!', {
            fontSize: '18px',
            fill: '#00ff88'
        }).setOrigin(0.5);
        
        const startBtn = this.add.text(width/2, 400, '▶ START MISSION', {
            fontSize: '32px',
            fill: '#ffffff',
            backgroundColor: '#00ff88',
            padding: { x: 30, y: 15 }
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });
        
        startBtn.on('pointerover', () => {
            startBtn.setScale(1.1);
            startBtn.setStyle({ fill: '#00ff00' });
        });
        
        startBtn.on('pointerout', () => {
            startBtn.setScale(1);
            startBtn.setStyle({ fill: '#ffffff' });
        });
        
        startBtn.on('pointerdown', () => {
            this.scene.start('Level1Scene');
        });
        
        const levelsBtn = this.add.text(width/2, 480, '📊 LEVELS', {
            fontSize: '24px',
            fill: '#ffffff',
            backgroundColor: '#00aa66',
            padding: { x: 20, y: 10 }
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });
        
        levelsBtn.on('pointerover', () => levelsBtn.setScale(1.1));
        levelsBtn.on('pointerout', () => levelsBtn.setScale(1));
        
        this.add.text(width - 10, height - 10, 'v0.1.0 - MVP Build', {
            fontSize: '12px',
            fill: '#666666'
        }).setOrigin(1, 1);
        
        this.createStars();
    }
    
    createStars() {
        for (let i = 0; i < 100; i++) {
            const x = Phaser.Math.Between(0, this.cameras.main.width);
            const y = Phaser.Math.Between(0, this.cameras.main.height);
            const star = this.add.circle(x, y, Phaser.Math.Between(1, 3), 0xffffff, 0.5);
            this.tweens.add({
                targets: star,
                alpha: 0.2,
                duration: 2000 + Phaser.Math.Between(0, 3000),
                repeat: -1
            });
        }
    }
}

// Base Level Scene
class BaseLevelScene extends Phaser.Scene {
    constructor(key, levelData) {
        super({ key });
        this.levelData = levelData;
        this.lives = 3;
        this.coins = 0;
        this.score = 0;
        this.weaponLevel = 1;
        this.consecutiveKills = 0;
        this.enemiesSpawned = 0;
        this.wave = 1;
        this.enemySpawnTimer = null;
    }

    init() {
        this.player = null;
        this.bullets = [];
        this.enemies = [];
        this.coinsList = [];
        this.powerups = [];
        this.boss = null;
    }

    create() {
        const { width, height } = this.cameras.main;
        
        this.createMap();
        this.createPlayer();
        this.createUI();
        this.createWeapons();
        
        this.input.on('pointerdown', this.handleInput, this);
        
        this.time.delayedCall(2000, () => this.startEnemySpawning());
    }

    createMap() {
        this.bg = this.add.rectangle(400, 300, 800, 600, 0x0a0a0a);
        
        // Clouds
        for (let i = 0; i < 10; i++) {
            const x = Phaser.Math.Between(-100, 900);
            const y = Phaser.Math.Between(50, 200);
            const cloud = this.add.image(x, y, 'player-plane').setScale(2);
            cloud.tint = 0x444444;
        }
    }

    createPlayer() {
        this.player = this.physics.add.sprite(80, 300, 'player-plane');
        this.player.setCollideWorldBounds(true);
        this.player.setDepth(10);
        this.playerVelocit y = { x: 0, y: 0 };
        this.playerSpeed = 300;
        this.playerShield = 1;
    }

    createUI() {
        this.add.rectangle(400, 30, 800, 50, 0x111111);
        
        this.livesText = this.add.text(20, 15, '❤️ 3', { fontSize: '20px', fill: '#ff3366' });
        this.coinsText = this.add.text(200, 15, '💰 0', { fontSize: '20px', fill: '#ffd700' });
        this.scoreText = this.add.text(350, 15, '⭐ Score: 0', { fontSize: '20px', fill: '#00ff88' });
        this.weaponText = this.add.text(550, 15, '🔫 Level ' + this.weaponLevel, { fontSize: '20px', fill: '#ff00ff' });
        this.comboText = this.add.text(700, 15, '🔥 Combo: 0', { fontSize: '20px', fill: '#ff6600' });
    }

    createWeapons() {
        this.weapon = this.physics.add.sprite(this.player.x, this.player.y - 20, 'bullet');
        this.weapon.setVisible(false);
        this.weapon.setDepth(9);
        this.fireRate = 300;
        this.lastShot = 0;
    }

    handleInput(pointer) {
        if (this.boss && this.boss.active) {
            this.fireBullet();
        }
    }

    fireBullet() {
        if (this.time.now - this.lastShot < this.fireRate) return;
        this.lastShot = this.time.now;
        
        const bullets = this.weaponLevel >= 3 ? 3 : this.weaponLevel >= 2 ? 2 : 1;
        
        for (let i = 0; i < bullets; i++) {
            const offsetX = i === 1 ? -15 : i === 2 ? 15 : 0;
            const bullet = this.physics.add.sprite(
                this.player.x + offsetX,
                this.player.y - 20,
                'bullet'
            );
            bullet.setVelocityY(-500);
            bullet.setDepth(9);
            bullet.damage = 10;
            this.bullets.push(bullet);
            
            this.tweens.add({
                targets: bullet,
                y: this.cameras.main.height + 20,
                duration: 1000,
                onComplete: () => bullet.destroy()
            });
        }
        
        // Weapon upgrade sound
        this.createShootEffect();
    }

    createShootEffect() {
        const flash = this.add.circle(this.player.x, this.player.y - 20, 20, 0x00ffff, 0.5);
        this.tweens.add({
            targets: flash,
            scale: 2,
            alpha: 0,
            duration: 100,
            onComplete: () => flash.destroy()
        });
    }

    startEnemySpawning() {
        this.enemySpawnTimer = this.time.addEvent({
            delay: 1500,
            callback: this.spawnEnemy,
            callbackScope: this,
            repeat: this.levelData.enemyCount - 1
        });
    }

    spawnEnemy() {
        this.enemiesSpawned++;
        
        const types = ['enemy-1', 'enemy-2', 'enemy-3'];
        const type = types[Phaser.Math.Between(0, Math.min(types.length - 1, this.wave))];
        
        const x = Phaser.Math.Between(700, 780);
        const y = Phaser.Math.Between(50, 550);
        
        const enemy = this.physics.add.sprite(x, y, type);
        enemy.setVelocityX(-150 - this.wave * 10);
        enemy.setDepth(5);
        enemy.hp = 30 + this.wave * 10;
        enemy.maxHp = enemy.hp;
        enemy.speed = 1 + this.wave * 0.1;
        enemy.reward = 10 + this.wave * 2;
        enemy.coinReward = Phaser.Math.Between(1, 3 + this.wave);
        enemy.enemyType = Phaser.Math.Between(0, 2);
        
        // Enemy health bar
        enemy.healthBarBg = this.add.rectangle(x, y - 30, 30, 4, 0x000000, 0.8);
        enemy.healthBar = this.add.rectangle(x - 15, y - 30, 30, 4, 0x00ff88);
        enemy.healthBar.setOrigin(0, 0.5);
        enemy.healthBar.targetWidth = 30;
        
        enemy.on('pointerover', () => enemy.healthBarBg.setVisible(true));
        enemy.on('pointerout', () => enemy.healthBarBg.setVisible(false));
        
        this.enemies.push(enemy);
        
        // Spawn coins occasionally
        if (Phaser.Math.Between(0, 1) === 0) {
            this.spawnCoin(x, y);
        }
        
        // Check for boss
        if (this.enemiesSpawned >= this.levelData.enemyCount - 5 && !this.boss) {
            this.spawnBoss();
        }
    }

    spawnBoss() {
        const boss = this.physics.add.sprite(700, 300, 'boss');
        boss.setVelocityX(-100);
        boss.setDepth(6);
        boss.hp = 500 + this.wave * 100;
        boss.maxHp = boss.hp;
        boss.reward = 1000 + this.wave * 200;
        boss.coinReward = 50;
        boss.enemyType = 3;
        boss.active = true;
        this.boss = boss;
        
        // Boss health bar
        boss.healthBarBg = this.add.rectangle(400, 50, 400, 20, 0x000000, 0.8);
        boss.healthBar = this.add.rectangle(200, 50, 400, 20, 0xff0000);
        boss.healthBar.setOrigin(0, 0.5);
        
        this.boss.fireTimer = this.time.addEvent({
            delay: 1000,
            callback: this.bossShoot,
            callbackScope: this,
            loop: true
        });
        
        this.tweens.add({
            targets: this.cameras.main,
            scrollX: -100,
            duration: 2000,
            repeat: -1,
            yoyo: true
        });
    }

    bossShoot() {
        if (!this.boss || !this.boss.active) return;
        
        for (let i = 0; i < 5; i++) {
            const angle = Phaser.Math.Between(0, Math.PI * 2);
            const speed = 200;
            const vx = Math.cos(angle) * speed;
            const vy = Math.sin(angle) * speed;
            
            const bullet = this.physics.add.sprite(this.boss.x, this.boss.y, 'bullet');
            bullet.setTint(0xff0000);
            bullet.setVelocityX(vx);
            bullet.setVelocityY(vy);
            bullet.setDepth(6);
            bullet.damage = 15;
            bullet.isEnemyBullet = true;
            this.bullets.push(bullet);
        }
    }

    spawnCoin(x, y) {
        const coin = this.physics.add.sprite(x, y, 'coin');
        coin.setVelocityY(-50);
        coin.setDepth(4);
        coin.coinValue = 1;
        coin.angle = 0;
        this.coinsList.push(coin);
    }

    createCollision() {
        this.physics.add.collider(this.player, this.coinsList, this.collectCoin, null, this);
        this.physics.add.collider(this.bullets, this.enemies, this.hitEnemy, null, this);
        this.physics.add.collider(this.bullets, this.boss, this.hitBoss, null, this);
        this.physics.add.collider(this.boss, this.bullets, this.hitBoss, null, this);
    }

    collectCoin(player, coin) {
        coin.destroy();
        this.coins += coin.coinValue;
        this.score += coin.coinValue * 5;
        
        const flash = this.add.circle(player.x, player.y, 20, 0xffd700, 0.5);
        this.tweens.add({ targets: flash, scale: 2, alpha: 0, duration: 100, onComplete: () => flash.destroy() });
        
        this.updateUI();
    }

    hitEnemy(bullet, enemy) {
        bullet.active = false;
        enemy.hp -= bullet.damage;
        
        const percent = enemy.hp / enemy.maxHp;
        enemy.healthBar.targetWidth = percent * 30;
        
        // Hit effect
        const flash = this.add.circle(enemy.x, enemy.y, 15, 0xffffff, 0.5);
        this.tweens.add({ targets: flash, scale: 2, alpha: 0, duration: 100, onComplete: () => flash.destroy() });
        
        if (enemy.hp <= 0) {
            enemy.destroy();
            this.bullets = this.bullets.filter(b => b !== bullet);
            this.destroyEnemy(enemy);
        }
    }

    hitBoss(bullet, boss) {
        bullet.active = false;
        boss.hp -= bullet.damage;
        
        const percent = boss.hp / boss.maxHp;
        boss.healthBar.width = percent * 400;
        
        if (boss.hp <= 0 && boss.active) {
            boss.destroy();
            this.bullets = this.bullets.filter(b => b !== bullet);
            this.destroyBoss();
        }
    }

    destroyEnemy(enemy) {
        // Add consecutive kill bonus
        this.consecutiveKills++;
        const comboBonus = Math.floor(this.consecutiveKills / 5) * 20;
        this.score += enemy.reward + comboBonus;
        this.coins += enemy.coinReward;
        
        // Special enemy bonus
        if (enemy.enemyType === 1) {
            this.score += 50;
            this.createExplosion(enemy.x, enemy.y, 0xff6600);
        } else if (enemy.enemyType === 2) {
            this.score += 100;
            this.createExplosion(enemy.x, enemy.y, 0x9933ff);
        }
        
        // Check for weapon upgrade
        if (this.consecutiveKills % 20 === 0) {
            this.weaponLevel = Math.min(3, this.weaponLevel + 1);
        }
        
        // Reset combo after 5 seconds of no kills
        this.time.delayedCall(5000, () => {
            if (this.consecutiveKills > 0) {
                this.consecutiveKills = 0;
                this.updateUI();
            }
        });
        
        this.createExplosion(enemy.x, enemy.y, 0xff3366);
        this.updateUI();
    }

    createExplosion(x, y, color) {
        for (let i = 0; i < 10; i++) {
            const particle = this.add.circle(x, y, Phaser.Math.Between(5, 15), color, 0.8);
            const angle = Phaser.Math.Between(0, Math.PI * 2);
            const speed = Phaser.Math.Between(50, 150);
            this.tweens.add({
                targets: particle,
                x: x + Math.cos(angle) * speed,
                y: y + Math.sin(angle) * speed,
                alpha: 0,
                duration: 500,
                onComplete: () => particle.destroy()
            });
        }
    }

    destroyBoss() {
        if (!this.boss) return;
        
        this.createExplosion(this.boss.x, this.boss.y, 0xff0000);
        
        // Boss defeated!
        this.coins += this.boss.coinReward;
        this.score += this.boss.reward;
        
        // Bonus for boss kill
        this.score += 500;
        
        this.boss.destroy();
        this.boss = null;
        
        // Level complete
        this.time.delayedCall(2000, () => {
            this.scene.start('LevelCompleteScene', { level: this.levelData.level });
        });
    }

    createBossCollision() {
        this.physics.add.overlap(this.player, this.bullets, this.playerHit, null, this);
        this.physics.add.overlap(this.bullets, this.player, null, null, this);
    }

    playerHit(player, bullet) {
        if (bullet.isEnemyBullet) {
            bullet.active = false;
            this.lives--;
            player.setTint(0xff0000);
            this.time.delayedCall(200, () => player.clearTint());
            
            const flash = this.add.circle(player.x, player.y, 30, 0xff0000, 0.5);
            this.tweens.add({ targets: flash, scale: 2, alpha: 0, duration: 100, onComplete: () => flash.destroy() });
            
            if (this.lives <= 0) {
                this.gameOver();
            }
            
            this.updateUI();
        }
    }

    updateUI() {
        this.livesText.setText('❤️ ' + this.lives);
        this.coinsText.setText('💰 ' + this.coins);
        this.scoreText.setText('⭐ Score: ' + this.score);
        this.weaponText.setText('🔫 Level ' + this.weaponLevel);
        this.comboText.setText('🔥 Combo: ' + this.consecutiveKills);
    }

    gameOver() {
        this.physics.pause();
        this.player.setTint(0xff0000);
        
        const overlay = this.add.rectangle(400, 300, 800, 600, 0x000000, 0.9);
        
        this.add.text(400, 200, 'GAME OVER', {
            fontSize: '64px',
            fill: '#ff3366'
        }).setOrigin(0.5);
        
        this.add.text(400, 280, 'Final Score: ' + this.score, {
            fontSize: '32px',
            fill: '#00ff88'
        }).setOrigin(0.5);
        
        this.add.text(400, 350, 'Coins: ' + this.coins, {
            fontSize: '24px',
            fill: '#ffd700'
        }).setOrigin(0.5);
        
        const restartBtn = this.add.text(400, 450, '🔄 Try Again', {
            fontSize: '28px',
            fill: '#ffffff',
            backgroundColor: '#00ff88',
            padding: { x: 20, y: 10 }
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });
        
        restartBtn.on('pointerdown', () => {
            this.scene.start('MainMenuScene');
        });
    }
}

// Level 1 Scene
class Level1Scene extends BaseLevelScene {
    constructor() {
        super('Level1Scene', {
            level: 1,
            enemyCount: 20,
            name: 'Training Mission'
        });
    }
}

// Level Complete Scene
class LevelCompleteScene extends Phaser.Scene {
    constructor() {
        super({ key: 'LevelCompleteScene' });
    }

    init(data) {
        this.level = data.level;
    }

    create() {
        const { width, height } = this.cameras.main;
        
        this.add.rectangle(width/2, height/2, width, height, 0x0a0a0a);
        
        this.add.text(width/2, 150, 'LEVEL ' + this.level + ' COMPLETE!', {
            fontSize: '48px',
            fill: '#00ff88',
            fontFamily: 'Courier New',
            stroke: '#00ff88',
            strokeThickness: 4
        }).setOrigin(0.5);
        
        this.add.text(width/2, 220, 'Mission Accomplished!', {
            fontSize: '28px',
            fill: '#ffffff'
        }).setOrigin(0.5);
        
        this.add.text(width/2, 300, 'Score: ' + this.scene.get('Level1Scene').score, {
            fontSize: '24px',
            fill: '#00ff88'
        }).setOrigin(0.5);
        
        this.add.text(width/2, 350, 'Coins: ' + this.scene.get('Level1Scene').coins, {
            fontSize: '24px',
            fill: '#ffd700'
        }).setOrigin(0.5);
        
        this.add.text(width/2, 420, 'Weapon Level: ' + this.scene.get('Level1Scene').weaponLevel, {
            fontSize: '24px',
            fill: '#ff00ff'
        }).setOrigin(0.5);
        
        const nextBtn = this.add.text(width/2, 500, '➡️ Next Level', {
            fontSize: '32px',
            fill: '#ffffff',
            backgroundColor: '#00aa66',
            padding: { x: 30, y: 15 }
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });
        
        nextBtn.on('pointerdown', () => {
            if (this.level === 1) {
                this.scene.start('Level2Scene');
            } else {
                this.scene.start('MainMenuScene');
            }
        });
    }
}

// Level 2 Scene
class Level2Scene extends BaseLevelScene {
    constructor() {
        super('Level2Scene', {
            level: 2,
            enemyCount: 30,
            name: 'Danger Zone'
        });
    }
}

// Register scenes
config.scene = [BootScene, MainMenuScene, Level1Scene, Level2Scene, LevelCompleteScene];

// Hide loading and start
window.onload = () => {
    document.getElementById('loading').style.display = 'none';
    const game = new Phaser.Game(config);
};
