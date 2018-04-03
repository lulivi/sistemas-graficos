class OvoMa extends ObjetoVolador {
    constructor(parameters) {
	super()
	this.material = new THREE.MeshPhongMaterial({
                             color: 0xff0000,
                             specular: 0x00ffff,
                             shininess: 70
                         })
	this.ovoMaMaterial = (parameters.ovoMaMaterial === undefined ?
                            this.material : parameters.ovoBuMaterial)
	
	this.add(this.createOvoMa())
    }

    createOvoMa() {
	this.sphere = new THREE.Mesh(new
        THREE.SphereGeometry(this.radius, 32, 32),
				     this.ovoMaMaterial)
	this.sphere.position.x = this.spawnXpos
	this.sphere.position.y = this.spawnYPos	
	this.sphere.position.z = this.spawnZPos + 30
	return this.sphere
    }

}
