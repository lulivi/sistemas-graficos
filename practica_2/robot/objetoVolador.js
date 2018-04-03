class ObjetoVolador extends THREE.Object3D {
    constructor(parameters) {
	super()
	this.sphere = null

	// Quantitative attributes
	this.radius = 5
	this.spawnXpos = 50
	this.spawnYPos = 40
	this.spawnZPos = Math.floor(Math.random() * Math.floor(200)) -
	100 // Select number between -100,100
	
    }

    moveTowardsNegativeZ() {
	this.sphere.position.z -= 1
	if (this.sphere.position.z < -100)
	    this.sphere.position.z = 100
    }

    moveTowardsNegativeX() {
	this.sphere.position.x -= 1
	if (this.sphere.position.x < -100){
	    this.sphere.position.x = 100
	    var newZ = Math.floor(Math.random() * Math.floor(200)) -
	100 // Select number between -100,100 
		this.sphere.position.z = newZ
	}
    }
}
