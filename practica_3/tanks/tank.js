'use strict';


class Tank extends THREE.Object3D{

    constructor(parameters){
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

        // wheel material
        this.wheelMaterial = (parameters.wheelMaterial === undefined ?
            this.material : parameters.wheelMaterial);

        // body material
        this.bodyMaterial = (parameters.bodyMaterial === undefined ?
            this.material : parameters.bodyMaterial);

        // *********
        // PARTS
        // *********

        // Body
        this.body = null;
        this.bodySide = 25;
        this.bodyHeight = 7;
        this.bodyFront = 17;

        // Turret
        this.turret = null;
        this.turretRadius = 7;
        this.turretHeight = 4;

        // Barrel
        this.barrel = null;
        this.barrelHeight = 15;
        this.barrelRadius = 1;

        // Hatch
        this.hatch = null;
        this.hatchRadius = 4;
        this.hatchHeight = this.barrelRadius;

        // Wheels
        this.wheelsArrayLeft = null;
        this.wheelsArrayRight = null;
        this.wheelRadius = this.hatchRadius / 1.5;
        this.wheelHeight = 2;
        this.rightWheelsPosition = this.bodyFront / 2;
        this.leftWheelsPosition = - this.rightWheelsPosition;

        // Extra nodes
        this.movementNode = null;

        // Look-at vector for tank movement
        this.lookAt = [
            1,
            0,
            0
        ];

        // First person camera
        this.subjectiveCamera = null;

        this.add(this.createMovementNode());
    }

    //*\/*\/*\/*\/*\/*
    // MODEL CREATION
    //*\/*\/*\/*\/*\/*

    /**
     * It creates the movement node
     * @return {THREE.Object3D} Movement node
     */
    createMovementNode(){
        this.movementNode = new THREE.Object3D();
        this.movementNode.add(this.createBody());
        return this.movementNode;
    }

    /**
     * It creates the body
     * @return {THREE.Mesh} Body mesh
     */
    createBody(){
        var bodyGeometry = new THREE.BoxGeometry(
            this.bodySide,
            this.bodyHeight,
            this.bodyFront
        );
        this.body = new THREE.Mesh(bodyGeometry, this.bodyMaterial);
        this.body.add(this.createTurret());
        this.body.add(this.createWheelArray(this.leftWheelsPosition));
        this.body.add(this.createWheelArray(this.rightWheelsPosition));
        this.body.position.y = this.bodyHeight / 2 + this.wheelRadius;
        return this.body;
    }

    /**
     * Create one side wheels. Wheels array will help when rotating all side
     * wheels at once (simulating movement).
     * @param wheelZPosition {Number} Z axis offset
     * @return {THREE.Object3D} Wheel array node
     */
    createWheelArray(wheelZPosition){
        var wheelsArray = new Array();
        var wheelsArrayNode = new THREE.Object3D();

        var frontWheel = this.createWheel(9, wheelZPosition);
        wheelsArray.push(frontWheel);
        wheelsArrayNode.add(frontWheel);

        var middleWheel = this.createWheel(-3.5, wheelZPosition);
        wheelsArray.push(middleWheel);
        wheelsArrayNode.add(middleWheel);

        var backWheel = this.createWheel(-9, wheelZPosition);
        wheelsArray.push(backWheel);
        wheelsArrayNode.add(backWheel);

        (wheelZPosition > 0) ?
            this.wheelsArrayRight = wheelsArray :
            this.wheelsArrayLeft = wheelsArray;

        return wheelsArrayNode;
    }

    /**
     * Create a wheel and return it
     * @param wheelXPosition {Number} X axis offset
     * @param wheelZPosition {Number} Z axis offset
     * @return {THREE.Mesh} Wheel mesh
     */
    createWheel(wheelXPosition, wheelZPosition){
        var wheelGeometry = new THREE.CylinderGeometry(
            this.wheelRadius,
            this.wheelRadius,
            this.wheelHeight,
            50
        );
        wheelGeometry.
            applyMatrix(new THREE.Matrix4().makeRotationX(Math.PI / 2));
        var wheel = new THREE.Mesh(wheelGeometry, this.wheelMaterial);
        wheel.position.z = wheelZPosition;
        wheel.position.x = wheelXPosition;
        wheel.position.y = -this.bodyHeight / 2;
        // wheel.rotation.x = 90 * Math.PI / 180;
        return wheel;
    }

    /**
     * It creates the turret
     * @return {THREE.Mesh} Turret mesh
     */
    createTurret(){
        var turretGeometry = new THREE.CylinderGeometry(
            this.turretRadius,
            this.turretRadius,
            this.turretHeight,
            50
        );
        this.turret = new THREE.Mesh(turretGeometry, this.turretMaterial);
        this.turret.add(this.createBarrel());
        this.turret.add(this.createHatch());
        this.turret.position.y = this.turretHeight / 2 + this.bodyHeight / 2;
        this.turret.position.x = -this.bodySide / 5;
        this.createCamera();
        return this.turret;
    }

    
    createCamera() {
        this.subjectiveCamera =
        new THREE.PerspectiveCamera(
            45,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        this.subjectiveCamera.rotation.y = Math.PI * -90 / 180;
        this.subjectiveCamera.position.x += 1;
        this.subjectiveCamera.position.y += 4;
        this.turret.add(this.subjectiveCamera);
    }

    /**
     * It creates the barrel
     * @return {THREE.Mesh} Barrel mesh
     */
    createBarrel(){
        var barrelGeometry = new THREE.CylinderGeometry(
            this.barrelRadius,
            this.barrelRadius,
            this.barrelHeight,
            50
        );
        this.barrel = new THREE.Mesh(barrelGeometry, this.barrelMaterial);
        this.barrel.rotation.z = 90 * Math.PI / 180;
        // Move barrel to z-y plane
        this.barrel.position.x = this.barrelHeight / 2 + this.turretRadius;
        return this.barrel;
    }

    /**
     * Create the hatch
     * @return {THREE.Mesh} Hatch mesh
     */
    createHatch(){
        var hatchGeometry = new THREE.CylinderGeometry(
            this.hatchRadius,
            this.hatchRadius,
            this.hatchHeight,
            50
        );
        this.hatch = new THREE.Mesh(hatchGeometry, this.hatchMaterial);
        // right on the turret
        this.hatch.position.y += this.hatchHeight / 2 + this.turretHeight / 2;
        return this.hatch;
    }

    //*\/*\/*\/*\/*\/*\/*
    // ATTRIBUTES FUNCTIONS
    //*\/*\/*\/*\/*\/*\/*

    /**
     * Rotate the turret to its default position
     */
    setTurretDefaultRotation(){
        this.turret.rotation.y = 0;
    }

    /**
     * Rotate the turret <degrees> degrees
     * @param degrees {Number} Degrees of the rotation
     */
    setTurretRotation(degrees){
        this.turret.rotation.y = degrees * Math.PI / 180;
    }

    /**
     * Increment the turret rotation in <degrees> degrees
     * @param degrees {Number} Degrees of the rotation
     */
    rotateTurret(rotationSpeed){
        this.turret.rotation.y += rotationSpeed;
    }

    /**
     * Rotate one side wheels array <degrees> degrees
     * @param rightWheels {Boolean} Right array of wheels
     * @param degrees {Number} Degrees of the rotation
     */
    setWheelsRotation(rightWheels, degrees){
        var wheelsArray = (rightWheels) ?
            this.wheelsArrayRight :
            this.wheelsArrayLeft;
        wheelsArray.forEach(function(item){
            item.rotation.z = degrees * Math.PI / 180;
        });
    }

    /**
     * Increment rotation angle of one side wheels array <degrees> degrees
     * @param rightWheels {Boolean} Right array of wheels
     * @param degrees {Number} Degrees of the rotation
     */
    rotateWheels(rightWheels, degrees){
        var wheelsArray = (rightWheels) ?
            this.wheelsArrayRight :
            this.wheelsArrayLeft;
        wheelsArray.forEach(function(item){
            item.rotation.z += degrees * Math.PI / 180;
        });
    }

    //*\/*\/*\/*\/*\/*\/*
    // MOVEMENT FUNCTIONS
    //*\/*\/*\/*\/*\/*\/*

    moveForward(speed){
        // X component of lookAt vector
        this.movementNode.position.x += speed * this.lookAt[0];
        // Z component of lookAt vector
        this.movementNode.position.z += speed * this.lookAt[2];
    }

    // TODO: coordinar avance con giro de ruedas utilizando
    // this.wheelsArray[Left/Right]
    /// Rotate tank (left/right)
    rotate(rotationSpeed){
        this.movementNode.rotation.y += rotationSpeed;
        this.lookAt[0] = Math.cos(this.movementNode.rotation.y);
        this.lookAt[2] = -Math.sin(this.movementNode.rotation.y);
    }

    // TODO: todo
    /// Return tank camera
    getCamera(){
        return this.subjectiveCamera;
    }
}
