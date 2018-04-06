class ObjetoVolador extends THREE.Object3D {
    constructor(parameters) {
	super();
	this.sphere = null;
	
	// Quantitative attributes
	this.radius = 5;
	this.spawnXPos = 100 + randNum(75);
	this.spawnYPos = 40;
	// Select number between -100,100
	this.spawnZPos = randNum(200) - 100;

    }

    moveTowardsNegativeZ() {
        this.sphere.position.z -= 1;
        if (this.sphere.position.z < -100)
            this.sphere.position.z = 100;
    }

    moveTowardsNegativeX() {
        this.sphere.position.x -= 1;
        if (this.sphere.position.x < -100){
            this.sphere.position.x = 100 + randNum(75);
            // Select number between -100,100
            var newZ = Math.floor(randNum(200)) - 100;
            this.sphere.position.z = newZ;
        }
    }
}
