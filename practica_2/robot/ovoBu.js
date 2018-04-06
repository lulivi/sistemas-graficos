class OvoBu extends ObjetoVolador {
    constructor(parameters) {
        super()
        this.material = new THREE.MeshPhongMaterial({
            color: 0x00ff00,
            specular: 0xff00ff,
            shininess: 70
        });
        this.ovoBuMaterial = (parameters.ovoBuMaterial === undefined ?
                              this.material : parameters.ovoBuMaterial);

        this.add(this.createOvoBu());
    }

    createOvoBu() {
        this.sphere = new THREE.Mesh(new THREE.SphereGeometry(this.radius, 32,
                                     32), this.ovoBuMaterial);
        this.sphere.position.x = (parameters.spawnXPos === undefined ?
                                  this.spawnXPos : parameters.spawnXPos);
        this.sphere.position.y = (parameters.spawnYPos === undefined ?
                                  this.spawnYPos : parameters.spawnYPos);
        this.sphere.position.z = (parameters.spawnZPos === undefined ?
                                  this.spawnZPos : parameters.spawnZPos);
        return this.sphere
    }

}
