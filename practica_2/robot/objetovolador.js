class ObjetoVolador extends THREE.Object3D {
    constructor(parameters) {
        super();
        this.sphere = null;
        this.hasCollided = false;
        this.isBad = null;

        // Quantitative attributes
        this.radius = 5;
        this.spawnYPos = 40;
        this.spawnXPos = 200 + randNum(100);
        // Select number between -100,100
        this.spawnZPos = randNum(200) - 100;

    }

    moveTowardsNegativeZ() {
        this.sphere.position.z -= 1;
        if (this.sphere.position.z < -100)
            this.sphere.position.z = 100;
    }

    moveTowardsNegativeX(hardMode) {
        this.sphere.position.x -= (hardMode) ? 3 : 1;
        this.sphere.rotation.y += 0.1;
    }

    initialize(hardMode) {
        if (this.sphere.position.x < -100){
            // Select number between -100,100
            var newZ = Math.floor(randNum(200)) - 100;
            this.sphere.position.z = newZ;
            this.sphere.position.x = 100 + randNum(75);
            this.hasCollided = false;
            this.sphere.position.y = (hardMode) ?
                5 + randNum(50) :
                this.spawnYPos;
        }
    }

    changeCollision() {
        this.hasCollided = !this.hasCollided;
    }

    bad() {
        return this.isBad;
    }
}
