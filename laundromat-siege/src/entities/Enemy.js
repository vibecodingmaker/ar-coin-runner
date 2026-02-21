import Phaser from 'phaser';

export default class Enemy extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, type) {
        super(scene, x, y, 'enemy-placeholder');
        
        this.scene = scene;
        this.type = type;
        
        // Add to scene
        scene.add.existing(this);
        
        // Enemy properties based on type
        const stats = this.getEnemyStats(type);
        this.maxHp = stats.hp;
        this.hp = stats.hp;
        this.speed = stats.speed;
        this.reward = stats.reward;
        this.color = stats.color;
        
        // State
        this.pathIndex = 0;
        this.pathPoints = [];
        this.gridSize = 64;
        
        // Status effects
        this.slowFactor = 1;
        this.slowTimer = 0;
        
        // Visual setup
        this.setTint(this.color);
        
        // Health bar
        this.createHealthBar();
    }
    
    getEnemyStats(type) {
        const stats = {
            'rogue-sock': {
                hp: 30,
                speed: 100,
                reward: 5,
                color: 0xff6b6b
            },
            'lint-golem': {
                hp: 60,
                speed: 50,
                reward: 10,
                color: 0x9b59b6
            },
            'stain-slug': {
                hp: 100,
                speed: 30,
                reward: 15,
                color: 0x2ecc71
            },
            'laundry-basket': {
                hp: 80,
                speed: 40,
                reward: 12,
                color: 0xf39c12
            },
            'shrunk-shirt': {
                hp: 40,
                speed: 120,
                reward: 8,
                color: 0x3498db
            }
        };
        return stats[type] || stats['rogue-sock'];
    }
    
    createHealthBar() {
        const barWidth = 24;
        const barHeight = 4;
        
        this.healthBg = this.scene.add.rectangle(
            this.x, this.y - 15,
            barWidth, barHeight,
            0x000000, 0.7
        );
        
        this.healthBar = this.scene.add.rectangle(
            this.x - barWidth/2, this.y - 15,
            barWidth, barHeight,
            0x2ecc71
        );
        this.healthBar.setOrigin(0, 0.5);
    }
    
    setPath(pathPoints, gridSize) {
        this.pathPoints = pathPoints;
        this.gridSize = gridSize;
        this.pathIndex = 0;
    }
    
    update() {
        // Handle slow effect
        if (this.slowTimer > 0) {
            this.slowTimer -= 16; // Approximate frame time
            if (this.slowTimer <= 0) {
                this.slowFactor = 1;
                this.clearTint();
                this.setTint(this.color);
            }
        }
        
        // Move along path
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
                const moveX = (dx / dist) * this.speed * this.slowFactor * 0.016;
                const moveY = (dy / dist) * this.speed * this.slowFactor * 0.016;
                this.x += moveX;
                this.y += moveY;
            }
        }
        
        // Update health bar position
        this.updateHealthBar();
        
        // Bobbing animation
        this.y += Math.sin(this.scene.time.now * 0.005) * 0.5;
    }
    
    updateHealthBar() {
        const barWidth = 24;
        const healthPercent = this.hp / this.maxHp;
        const fillWidth = healthPercent * barWidth;
        
        this.healthBar.width = fillWidth;
        this.healthBar.x = this.x - barWidth/2;
        this.healthBar.y = this.y - 15;
        
        this.healthBg.x = this.x;
        this.healthBg.y = this.y - 15;
        
        // Change color based on health
        if (healthPercent > 0.6) {
            this.healthBar.setFillStyle(0x2ecc71);
        } else if (healthPercent > 0.3) {
            this.healthBar.setFillStyle(0xf1c40f);
        } else {
            this.healthBar.setFillStyle(0xe74c3c);
        }
        
        // Hide health bar if full health
        this.healthBar.visible = this.hp < this.maxHp;
        this.healthBg.visible = this.hp < this.maxHp;
    }
    
    takeDamage(amount) {
        this.hp -= amount;
        
        // Flash white
        this.setTint(0xffffff);
        this.scene.time.delayedCall(100, () => {
            if (this.active) {
                this.setTint(this.color);
            }
        });
        
        // Particle effect
        const particles = this.scene.add.particles(this.x, this.y, 'projectile-placeholder', {
            speed: 50,
            scale: { start: 0.3, end: 0 },
            quantity: 3,
            lifespan: 300,
            tint: this.color
        });
        
        this.scene.time.delayedCall(300, () => particles.destroy());
    }
    
    applySlow(duration, factor) {
        this.slowFactor = factor;
        this.slowTimer = duration;
        this.setTint(0x3498db); // Blue tint for slow
    }
    
    destroy() {
        if (this.healthBg) this.healthBg.destroy();
        if (this.healthBar) this.healthBar.destroy();
        super.destroy();
    }
}
