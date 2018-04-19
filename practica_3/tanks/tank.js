
class Tank extends THREE.Object3D{

    constructor(){
        super();

        // *********
        // MATERIALS
        // *********

        this.material = (parameters.material === undefined ? new
        THREE.MeshPhongMaterial({
            color: 0xd4af37,
            specular: 0xfbf804,
            shininess: 70
        }) : parameters.material);

        // barrel material
        this.barrelMaterial = (parameters.barrelMaterial === undefined ?
            this.material : parameters.barrelMaterial);

        // hatch material
        this.hatchMaterial = (parameters.hatchMaterial === undefined ?
            this.material : parameters.hatchMaterial);

        // eye material
        this.eyeMaterial = (parameters.eyeMaterial === undefined ?
            this.material : parameters.eyeMaterial);

        // wheel material
        this.wheelMaterial = (parameters.wheelMaterial === undefined ?
            this.material : parameters.wheelMaterial);

        // turret material
        this.turretMaterial = (parameters.turretMaterial === undefined ?
            this.material : parameters.turretMaterial);

        // track material
        this.trackMaterial = (parameters.trackMaterial === undefined ?
            this.material : parameters.trackMaterial);

        // body material
        this.bodyMaterial = (parameters.bodyMaterial === undefined ?
            this.material : parameters.bodyMaterial);

        // *********
        // PARTS
        // *********

        // Barrel
        this.barrel = null;
        this.barrelHeight = 30;
        this.barrelRadius = 1;

        // Hatch
        this.hatch = null;
        this.hatchRadius = 2;
        this.hatchHeight = 1;

        // Wheel
        this.wheel = null;
        this.wheelRadius = 1;
        this.wheelHeight = 2;

        // Turret
        this.turret = null;
        this.turretRadius = 15;
        this.turretHeight = 7;

        // Track ni idea de como cojones hacerla, quizás un cilindro estirado y
        this.track = null;
        this.trackRadius = 1;
        this.trackHeight = 2;
        this.trackScaleX = 25;

        // Body
        this.body = null;
        this.bodyWidth = 25;
        this.bodyHeight = 10;
        this.bodyDepth = 15;

        // Extra nodes
        this.movementNode = null;

        this.add(createMovementNode());
    }

    /// It creates the movement node
    // TODO: añadir transformaciones, escalados y rotaciones si fuera necesario
    createMovementNode(){
        this.movementNode = new THREE.Object3D();
        this.movementNode.add(createBody());
        return this.movementNode;
    }

    /// It creates the body
    // TODO: añadir transformaciones, escalados y rotaciones si fuera necesario
    createBody(){
        var bodyGeometry = new THREE.BoxGeometry(
            this.bodyWidth,
            this.bodyHeight,
            this.bodyDepth
        );
        this.body = new THREE.Mesh(bodyGeometry, this.bodyMaterial);
        this.body.add(createTurret());
        this.body.add(createTrack(this.leftTrackPosition));
        this.body.add(createTrack(this.rightTrackPosition));
        return this.body;
    }

    /// It creates the turret
    // TODO: añadir transformaciones, escalados y rotaciones si fuera necesario
    createTurret(){
        var turretGeometry = new THREE.CylinderGeometry(
            this.turretRadius,
            this.turretRadius,
            this.turretHeight,
            50
        );
        this.turret = new THREE.Mesh(turretGeometry, this.turretMaterial);
        this.turret.add(createBarrel());
        this.turret.add(createHatch());
        return this.turret;
    }

    /// It creates the barrel
    // TODO: añadir transformaciones, escalados y rotaciones si fuera necesario
    createBarrel(){
        var barrelGeometry = new THREE.CylinderGeometry(
            this.barrelRadius,
            this.barrelRadius,
            this.barrelHeight,
            50
        );
        this.barrel = new THREE.Mesh(barrelGeometry, this.barrelMaterial);
        return this.barrel;
    }

    /// It creates the hatch
    // TODO: añadir transformaciones, escalados y rotaciones si fuera necesario
    createHatch(){
        var hatchGeometry = new THREE.CylinderGeometry(
            this.hatchRadius,
            this.hatchRadius,
            this.hatchHeight,
            50
        );
        this.hatch = new THREE.Mesh(hatchGeometry, this.hatchMaterial);
        return this.hatch;
    }

    // TODO: añadir transformaciones, escalados y rotaciones si fuera necesario
    /// It sets the track
    /**
     * @param trackPosition - Position (left/right) of the track
     */
    createTrack(trackPosition){
        var trackGeometry = new THREE.CylinderGeometry(
            this.trackRadius,
            this.trackRadius,
            this.hatchHeight,
            50
        );
        this.track = new THREE.Mesh(trackGeometry, this.trackMaterial);
        return this.track;
    }

    // TODO: createWheel() ?????
}
