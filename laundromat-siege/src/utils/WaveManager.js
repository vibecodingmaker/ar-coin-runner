export default class WaveManager {
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
        
        // Generate 10 waves with increasing difficulty
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
        
        // Show wave announcement
        this.showWaveAnnouncement();
        
        // Start spawning
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
        // Random enemy type from available types for this wave
        const type = Phaser.Math.RND.pick(config.enemyTypes);
        this.scene.spawnEnemy(type);
        this.enemiesSpawned++;
        
        // Check if wave is complete
        if (this.enemiesSpawned >= config.enemyCount) {
            this.waveInProgress = false;
            this.scheduleNextWave();
        }
    }
    
    scheduleNextWave() {
        // Wait for all enemies to be defeated before next wave
        const checkInterval = this.scene.time.addEvent({
            delay: 1000,
            callback: () => {
                if (this.scene.enemies.length === 0 && !this.waveInProgress) {
                    this.wave++;
                    this.scene.wave = this.wave;
                    this.scene.updateUI();
                    
                    // Give wave reward
                    const config = this.waveConfig[this.wave - 2] || this.waveConfig[9];
                    this.scene.gold += config.waveReward;
                    this.scene.updateUI();
                    
                    // Show reward
                    this.showRewardText(config.waveReward);
                    
                    // Start next wave after delay
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
    
    getWaveInfo() {
        const config = this.waveConfig[this.wave - 1];
        return {
            wave: this.wave,
            enemiesRemaining: config ? config.enemyCount - this.enemiesSpawned : 0,
            inProgress: this.waveInProgress
        };
    }
}
