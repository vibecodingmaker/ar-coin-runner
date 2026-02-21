import Phaser from 'phaser';
import Tower from '../entities/Tower.js';
import Enemy from '../entities/Enemy.js';
import Pathfinding from '../utils/Pathfinding.js';
import WaveManager from '../utils/WaveManager.js';

export default class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
    }

    init() {
        // Game state
        this.gold = 100;
        this.lives = 20;
        this.score = 0;
        this.wave = 1;
        
        // Grid settings
        this.gridSize = 64;
        this.gridWidth = 16;
        this.gridHeight = 12;
        
        // Entities
        this.towers = [];
        this.enemies = [];
        this.projectiles = [];
        
        // Selected tower type
        this.selectedTowerType = 'soap-blaster';
    }

    create() {
        const { width, height } = this.cameras.main;
        
        // Create map
        this.createMap();
        
        // Create UI
        this.createUI();
        
        // Initialize pathfinding
        this.pathfinding = new Pathfinding(this.gridWidth, this.gridHeight);
        this.setPathPoints();
        
        // Initialize wave manager
        this.waveManager = new WaveManager(this);
        
        // Input handling
        this.input.on('pointerdown', this.handleMapClick, this);
        
        // Spawn test enemy
        this.time.delayedCall(2000, () => this.spawnEnemy());
        
        // Update loop
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
                const isPath = this.isPathTile(x, y);
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
                
                // Hover effect
                tile.on('pointerover', () => {
                    tile.setTint(0xcccccc);
                });
                tile.on('pointerout', () => {
                    tile.clearTint();
                });
                
                this.mapGroup.add(tile);
                this.grid[x][y] = { tile, hasTower: false, isPath };
            }
        }
        
        // Mark start and end points
        this.startPoint = { x: 0, y: 6 };
        this.endPoint = { x: 15, y: 6 };
    }

    isPathTile(x, y) {
        // Simple horizontal path for testing
        return y === 6;
    }

    setPathPoints() {
        // Define the path from start to end
        this.pathPoints = [
            { x: 0, y: 6 },
            { x: 1, y: 6 },
            { x: 2, y: 6 },
            { x: 3, y: 6 },
            { x: 4, y: 6 },
            { x: 5, y: 6 },
            { x: 6, y: 6 },
            { x: 7, y: 6 },
            { x: 8, y: 6 },
            { x: 9, y: 6 },
            { x: 10, y: 6 },
            { x: 11, y: 6 },
            { x: 12, y: 6 },
            { x: 13, y: 6 },
            { x: 14, y: 6 },
            { x: 15, y: 6 }
        ];
    }

    createUI() {
        // Top bar background
        this.add.rectangle(512, 20, 1024, 40, 0x1a1a1a);
        
        // Gold display
        this.goldText = this.add.text(20, 10, '💰 $100', {
            fontSize: '20px',
            fill: '#ffd700'
        });
        
        // Lives display
        this.livesText = this.add.text(200, 10, '❤️ 20', {
            fontSize: '20px',
            fill: '#e74c3c'
        });
        
        // Wave display
        this.waveText = this.add.text(380, 10, '🌊 Wave: 1', {
            fontSize: '20px',
            fill: '#3498db'
        });
        
        // Score display
        this.scoreText = this.add.text(600, 10, '⭐ Score: 0', {
            fontSize: '20px',
            fill: '#ffffff'
        });
        
        // Tower selection panel (bottom)
        this.add.rectangle(512, 748, 1024, 80, 0x2d2d2d);
        
        // Tower buttons
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
                // Update all buttons
                towerTypes.forEach((t, i) => {
                    const b = this.children.list.find(c => 
                        c.text && c.text.includes(t.name)
                    );
                    if (b) {
                        b.setStyle({ backgroundColor: t.key === tower.key ? '#e94560' : '#4a4a4a' });
                    }
                });
            });
        });
        
        // Back to menu button
        const menuBtn = this.add.text(924, 10, '🏠 Menu', {
            fontSize: '16px',
            fill: '#ffffff',
            backgroundColor: '#666666',
            padding: { x: 10, y: 5 }
        }).setInteractive({ useHandCursor: true });
        
        menuBtn.on('pointerdown', () => {
            this.scene.start('MainMenuScene');
        });
    }

    handleMapClick(pointer) {
        const gridX = Math.floor(pointer.x / this.gridSize);
        const gridY = Math.floor(pointer.y / this.gridSize);
        
        // Check bounds
        if (gridX < 0 || gridX >= this.gridWidth || gridY < 0 || gridY >= this.gridHeight) {
            return;
        }
        
        const cell = this.grid[gridX][gridY];
        
        // Can't place on path or existing tower
        if (cell.isPath || cell.hasTower) {
            return;
        }
        
        // Check gold cost
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

    spawnEnemy() {
        const startX = this.startPoint.x * this.gridSize + this.gridSize / 2;
        const startY = this.startPoint.y * this.gridSize + this.gridSize / 2;
        
        const enemy = new Enemy(this, startX, startY, 'rogue-sock');
        enemy.setPath(this.pathPoints, this.gridSize);
        this.enemies.push(enemy);
    }

    gameUpdate() {
        // Update towers
        this.towers.forEach(tower => tower.update());
        
        // Update enemies
        this.enemies = this.enemies.filter(enemy => {
            enemy.update();
            
            // Check if enemy reached the end
            const distToEnd = Phaser.Math.Distance.Between(
                enemy.x, enemy.y,
                this.endPoint.x * this.gridSize + this.gridSize / 2,
                this.endPoint.y * this.gridSize + this.gridSize / 2
            );
            
            if (distToEnd < 10) {
                this.lives--;
                enemy.destroy();
                this.updateUI();
                
                if (this.lives <= 0) {
                    this.gameOver();
                }
                return false;
            }
            
            // Check if enemy is dead
            if (enemy.hp <= 0) {
                this.gold += enemy.reward;
                this.score += enemy.reward * 10;
                enemy.destroy();
                this.updateUI();
                return false;
            }
            
            return true;
        });
        
        // Update projectiles
        this.projectiles = this.projectiles.filter(proj => {
            proj.update();
            if (proj.active) {
                return true;
            }
            proj.destroy();
            return false;
        });
        
        // Tower shooting
        this.towers.forEach(tower => {
            if (tower.canShoot()) {
                const target = this.findTarget(tower);
                if (target) {
                    tower.shoot(target);
                }
            }
        });
    }

    findTarget(tower) {
        // Find closest enemy within range
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
        
        // Show game over screen
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
        
        restartBtn.on('pointerdown', () => {
            this.scene.restart();
        });
    }
}
