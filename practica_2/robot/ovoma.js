class OvoMa extends ObjetoVolador {
    constructor(parameters) {
        super();
        this.material = new THREE.MeshPhongMaterial({
            color: 0xff0000,
            specular: 0x00ffff,
            shininess: 70
        });
        this.ovoMaMaterial = (parameters.ovoMaMaterial === undefined ?
            this.material : parameters.ovoMaMaterial);

        this.add(this.createOvoMa(parameters));
    }

    createOvoMa(parameters) {
        this.sphere = new THREE.Mesh(new THREE.SphereGeometry(
            this.radius, 32,
            32
        ), this.ovoMaMaterial);
        this.sphere.position.x = (parameters.spawnXPos === undefined ?
            this.spawnXPos : parameters.spawnXPos);
        this.sphere.position.y = (parameters.spawnYPos === undefined ?
            this.spawnYPos : parameters.spawnYPos);
        this.sphere.position.z = (parameters.spawnZPos === undefined ?
            this.spawnZPos : parameters.spawnZPos);
        return this.sphere;
    }

}
