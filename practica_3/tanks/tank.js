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

        // track material
        this.trackMaterial = (parameters.trackMaterial === undefined ?
            this.material : parameters.trackMaterial);

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
        this.barrelHeight = 30;
        this.barrelRadius = 1;

        // Hatch
        this.hatch = null;
        this.hatchRadius = 4;
        this.hatchHeight = 1;

        // Track ni idea de como cojones hacerla, quizás un cilindro estirado y
        this.trackLeft = null;
        this.trackRight = null;
        this.trackRadius = 1;
        this.trackHeight = 2;
        this.trackScaleX = 10;
        this.rightTrackPosition = this.bodyFront / 2;
        this.leftTrackPosition = - this.rightTrackPosition;

        // Wheel
        this.wheel = null;
        this.wheelRadius = 1;
        this.wheelHeight = 2;

        // Extra nodes
        this.movementNode = null;

        this.add(this.createMovementNode());
    }

    //*\/*\/*\/*\/*\/*
    // MODEL CREATION
    //*\/*\/*\/*\/*\/*

    /// It creates the movement node
    // TODO: añadir transformaciones, escalados y rotaciones si fuera necesario
    createMovementNode(){
        this.movementNode = new THREE.Object3D();
        this.movementNode.add(this.createBody());
        return this.movementNode;
    }

    /// It creates the body
    // TODO: añadir transformaciones, escalados y rotaciones si fuera necesario
    createBody(){
        var bodyGeometry = new THREE.BoxGeometry(
            this.bodySide,
            this.bodyHeight,
            this.bodyFront
        );
        this.body = new THREE.Mesh(bodyGeometry, this.bodyMaterial);
        this.body.add(this.createTurret());
        this.body.add(this.createTrack(this.leftTrackPosition));
        this.body.add(this.createTrack(this.rightTrackPosition));
        this.body.position.y = this.bodyHeight / 2 + this.trackRadius;
        return this.body;
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
        var track = new THREE.Mesh(trackGeometry, this.trackMaterial);
        track.position.z = trackPosition;
        track.position.y = -this.bodyHeight / 2;
        track.rotation.x = 90 * Math.PI / 180;
        track.scale.x = this.trackScaleX;
        (trackPosition > 0) ? this.trackRight = track : this.trackLeft = track;
        return track;
    }

    // TODO: createWheel() ?????

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
        this.turret.add(this.createBarrel());
        this.turret.add(this.createHatch());
        this.turret.position.y = this.turretHeight / 2 + this.bodyHeight / 2;
        this.turret.position.x = -this.bodySide / 5;
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
        this.barrel.rotation.z = 90 * Math.PI / 180;
        // Move barrel to z-y plane + turretRadius
        this.barrel.position.x = this.barrelHeight / 2 + this.turretRadius;
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
        // right on the turret
        this.hatch.position.y += this.hatchHeight / 2 + this.turretHeight / 2;
        return this.hatch;
    }

    //*\/*\/*\/*\/*\/*\/*
    // MOVEMENT FUNCTIONS
    //*\/*\/*\/*\/*\/*\/*

    // TODO: todo
    /// Move tank forward (+/-)
    moveForward(){
    }

    // TODO: todo
    /// Rotate tank (left/right)
    rotate(){
    }

    // TODO: todo
    /// Return tank camera
    getCamera(){

    }
}
