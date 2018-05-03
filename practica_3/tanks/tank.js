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

        // barrel swing point material
        this.barrelSwingPointMaterial =
            (parameters.barrelSwingPointMaterial === undefined ?
                this.material : parameters.barrelSwingPointMaterial);

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

        // Barrel swing point
        this.barrelSwingPoint = null;
        this.barrelSwingPointRadius = 1;

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
        this.turret.add(this.createBarrelSwingPoint());
        this.turret.add(this.createHatch());
        this.turret.position.y = this.turretHeight / 2 + this.bodyHeight / 2;
        this.turret.position.x = -this.bodySide / 5;
        return this.turret;
    }

    createBarrelSwingPoint(){
        var barrelSwingPoint = new THREE.SphereGeometry(
            this.barrelSwingPointRadius,
            32,
            32
        );
        this.barrelSwingPoint = new THREE.Mesh(barrelSwingPoint,
                                               this.barrelSwingPointMaterial);
        this.barrelSwingPoint.position.x = this.barrelSwingPointRadius / 2 +
                                           this.turretRadius;
        this.barrelSwingPoint.add(this.createBarrel());
        return this.barrelSwingPoint;
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
        this.barrel.position.x = this.barrelHeight / 2;
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
     * Rotate the barrel to its default position
     */
    setBarrelSwingPointDefaultRotation(){
        this.barrelSwingPoint.rotation.z = 0;
    }

    /**
     * Rotate the barrel <degrees> degrees
     * @param degrees {Number} Degrees of the rotation
     */
    setBarrelSwingPointRotation(degrees){
        if(30 >= degrees && degrees >= 0){
            this.barrelSwingPoint.rotation.z = degrees * Math.PI / 180;
        }
    }

    /**
     * Increment the barrel rotation in <degrees> degrees
     * @param degrees {Number} Degrees of the rotation
     */
    rotateBarrelSwingPoint(degrees){
        var requestedDegrees = degrees + (this.barrelSwingPoint.rotation.z *
                                          180 / Math.PI);
        if(30 >= requestedDegrees && requestedDegrees >= 0){
            this.barrelSwingPoint.rotation.z = requestedDegrees * Math.PI / 180;
        } else if(requestedDegrees > 30){
            this.barrelSwingPoint.rotation.z = 30 * Math.PI / 180;
        } else {
            this.barrelSwingPoint.rotation.z = 0;
        }
    }


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
    rotateTurret(degrees){
        this.turret.rotation.y += degrees * Math.PI / 180;
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

    // TODO: todo
    /// Move tank forward (+/-)
    moveForward(){
    }

    // TODO: coordinar avance con giro de ruedas utilizando
    // this.wheelsArray[Left/Right]
    /// Rotate tank (left/right)
    rotate(){
    }

    // TODO: todo
    /// Return tank camera
    getCamera(){
    }
}
