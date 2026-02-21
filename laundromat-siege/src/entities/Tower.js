import Phaser from 'phaser';

export default class Tower extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, type) {
        super(scene, x, y, 'tower-placeholder');
        
        this.scene = scene;
        this.type = type;
        
        // Add to scene
        scene.add.existing(this);
        
        // Tower properties based on type
        const stats = this.getTowerStats(type);
        this.damage = stats.damage;
        this.range = stats.range;
        this.fireRate = stats.fireRate;
        this.cost = stats.cost;
        this.cleanseRate = stats.cleanseRate;
        
        // State
        this.lastShot = 0;
        this.cleanseMeter = 0;
        this.level = 1;
        
        // Visual setup
        this.setTint(stats.color);
        
        // Range indicator (hidden by default)
        this.rangeIndicator = scene.add.circle(x, y, this.range, 0xffffff, 0.1);
        this.rangeIndicator.setVisible(false);
        
        // Cleanse meter bar
        this.createCleanseMeter();
        
        // Interactions
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
            'soap-blaster': {
                damage: 10,
                range: 150,
                fireRate: 800,
                cost: 50,
                cleanseRate: 10,
                color: 0x4a90d9
            },
            'spin-cycle': {
                damage: 5,
                range: 100,
                fireRate: 100,
                cost: 100,
                cleanseRate: 15,
                color: 0x9b59b6
            },
            'dryer-cannon': {
                damage: 25,
                range: 200,
                fireRate: 1500,
                cost: 150,
                cleanseRate: 20,
                color: 0xe74c3c
            }
        };
        return stats[type] || stats['soap-blaster'];
    }
    
    createCleanseMeter() {
        const barWidth = 32;
        const barHeight = 4;
        
        this.cleanseBg = this.scene.add.rectangle(
            this.x, this.y - 25,
            barWidth, barHeight,
            0x000000, 0.5
        );
        
        this.cleanseBar = this.scene.add.rectangle(
            this.x - barWidth/2, this.y - 25,
            0, barHeight,
            0x00ff00
        );
        this.cleanseBar.setOrigin(0, 0.5);
    }
    
    update() {
        // Build up cleanse meter over time
        if (this.cleanseMeter < 100) {
            this.cleanseMeter += this.cleanseRate * 0.016; // Per frame at 60fps
            this.updateCleanseBar();
        }
        
        // Check for deep clean activation
        if (this.cleanseMeter >= 100) {
            this.activateDeepClean();
        }
    }
    
    updateCleanseBar() {
        const barWidth = 32;
        const fillWidth = (this.cleanseMeter / 100) * barWidth;
        this.cleanseBar.width = fillWidth;
        
        // Change color based on fill
        if (this.cleanseMeter < 50) {
            this.cleanseBar.setFillStyle(0x00ff00);
        } else if (this.cleanseMeter < 80) {
            this.cleanseBar.setFillStyle(0xffff00);
        } else {
            this.cleanseBar.setFillStyle(0xff0000);
        }
    }
    
    activateDeepClean() {
        this.cleanseMeter = 0;
        
        // AoE stun/slow effect
        const burst = this.scene.add.circle(this.x, this.y, 10, 0xffffff, 0.8);
        
        this.scene.tweens.add({
            targets: burst,
            scale: 3,
            alpha: 0,
            duration: 500,
            onComplete: () => burst.destroy()
        });
        
        // Apply slow to nearby enemies
        this.scene.enemies.forEach(enemy => {
            const dist = Phaser.Math.Distance.Between(this.x, this.y, enemy.x, enemy.y);
            if (dist <= this.range) {
                enemy.applySlow(2000, 0.5); // 2 seconds, 50% slow
            }
        });
        
        // Refund partial gold
        this.scene.gold += Math.floor(this.cost * 0.1);
        this.scene.updateUI();
    }
    
    canShoot() {
        return this.scene.time.now - this.lastShot >= this.fireRate;
    }
    
    shoot(target) {
        this.lastShot = this.scene.time.now;
        
        // Create projectile
        const projectile = this.scene.add.sprite(this.x, this.y, 'projectile-placeholder');
        projectile.setTint(0xffffff);
        
        // Calculate velocity
        const angle = Phaser.Math.Angle.Between(this.x, this.y, target.x, target.y);
        const speed = 400;
        const vx = Math.cos(angle) * speed;
        const vy = Math.sin(angle) * speed;
        
        projectile.vx = vx;
        projectile.vy = vy;
        projectile.damage = this.damage;
        projectile.target = target;
        
        projectile.update = function() {
            this.x += this.vx * 0.016;
            this.y += this.vy * 0.016;
            
            // Check collision with target
            if (this.target && this.target.active) {
                const dist = Phaser.Math.Distance.Between(this.x, this.y, this.target.x, this.target.y);
                if (dist < 20) {
                    this.target.takeDamage(this.damage);
                    this.active = false;
                }
            }
            
            // Check bounds
            if (this.x < 0 || this.x > 1024 || this.y < 0 || this.y > 768) {
                this.active = false;
            }
        };
        
        this.scene.projectiles.push(projectile);
    }
    
    upgrade() {
        if (this.level < 3) {
            this.level++;
            this.damage *= 1.5;
            this.range *= 1.2;
            this.fireRate *= 0.8;
            
            // Visual upgrade
            this.setScale(1 + this.level * 0.1);
            
            // Particle effect
            const particles = this.scene.add.particles(this.x, this.y, 'projectile-placeholder', {
                speed: 100,
                scale: { start: 0.5, end: 0 },
                quantity: 10,
                lifespan: 500
            });
            
            this.scene.time.delayedCall(500, () => particles.destroy());
        }
    }
    
    destroy() {
        if (this.rangeIndicator) this.rangeIndicator.destroy();
        if (this.cleanseBg) this.cleanseBg.destroy();
        if (this.cleanseBar) this.cleanseBar.destroy();
        super.destroy();
    }
}
