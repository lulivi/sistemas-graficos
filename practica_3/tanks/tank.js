'use strict';


class Tank extends THREE.Object3D{

    constructor(parameters){
        super();

        // *********
        // MATERIALS
        // *********

        this.material = (parameters.material === undefined ? new
        THREE.MeshPhongMaterial({
            color: 0x00ff00,
            specular: 0x00ff00,
            shininess: 40
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
        this.bulletSpawnPoint = null;

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

        // Limits
        this.lengthLimit = parameters.ground.length;
        this.widthLimit = parameters.ground.width;

        // Extra nodes
        this.movementNode = null;

        //********
        // Look At
        //********

        // Look-at vector for tank movement
        this.lookAt = [
            1,
            0,
            0
        ];

        // Shooting
        // Look-at vector for turret. Used for shooting
        this.turretLookAt = [
            1,
            0,
            0
        ];

        this.maxAmmo = 10;
        this.ammo = 10;
        this.firedAmmo = 0;
        this.friendsCount = 0;

        // The ammo gain depending on the gameSpeedFactor
        this.ammoGain = {
            1: 3,
            2: 2,
            3: 0
        };

        this.bulletsArray = [];
        this.cooldown = null;
        this.playerId = parameters.playerId;

        // First person camera
        this.subjectiveCamera = null;

        this.add(this.createMovementNode());

        // Audio
        this.volume = 0.5;
        this.listener = new THREE.AudioListener();
        this.add( this.listener );


        // create a global audio source
        this.sound = new THREE.Audio( this.listener );
        this.audioLoader = new THREE.AudioLoader();

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
        var wheelsArray = [];
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
        this.turret.add(this.createCamera());
        this.turret.add(this.createBulletSpawnPoint());
        this.turret.position.y = this.turretHeight / 2 + this.bodyHeight / 2;
        this.turret.position.x = -this.bodySide / 5;
        return this.turret;
    }

    /**
     * It creates the first person camera
     * @return {THREE.PerspectiveCamera} The camera object
     */
    createCamera() {
        this.subjectiveCamera =
            new THREE.PerspectiveCamera(
                50,
                window.innerWidth / window.innerHeight,
                0.1,
                1000
            );
        this.subjectiveCamera.rotation.y = Math.PI * -90 / 180;
        var look = new THREE.Vector3(30,-5,0);
        this.subjectiveCamera.lookAt(look);
        this.subjectiveCamera.position.x += 1;
        this.subjectiveCamera.position.y += 7;
        return this.subjectiveCamera;
    }

    /**
     * Creates spawn point for bullets
     */
    createBulletSpawnPoint() {
        this.bulletSpawnPoint = new THREE.Object3D();
        this.bulletSpawnPoint.position.x += 20;
        return this.bulletSpawnPoint;
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

        this.turretLookAt[0] = Math.cos(
            this.turret.rotation.y + this.movementNode.rotation.y
        );
        this.turretLookAt[2] = -Math.sin(
            this.turret.rotation.y + this.movementNode.rotation.y
        );
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
    rotateWheels(rightWheels, speed){
        var wheelsArray = (rightWheels) ?
            this.wheelsArrayRight :
            this.wheelsArrayLeft;
        wheelsArray.forEach(function(item){
            item.rotation.z += -speed * 5 * Math.PI / 180;
        });
    }

    //*\/*\/*\/*\/*\/*\/*
    // MOVEMENT FUNCTIONS
    //*\/*\/*\/*\/*\/*\/*

    /**
     * Change x-z position
     * @param speed {Number} - Space to displace
     */
    moveForward(speed){
        // speed *= gameSpeedFactor;
        var newXPos = this.movementNode.position.x +
            speed * this.lookAt[0];
        var newZPos = this.movementNode.position.z +
            speed * this.lookAt[2];

        if(newXPos < this.widthLimit/2 &&  newXPos > -this.widthLimit/2)
        // X component of lookAt vector
            this.movementNode.position.x = newXPos;
        // Z component of lookAt vector
        if(newZPos < this.lengthLimit/2 &&  newZPos > -this.lengthLimit/2)
            this.movementNode.position.z = newZPos;
        // Rotation of wheels
        this.rotateWheels(true, speed);
        this.rotateWheels(false, speed);
    }

    /**
     * Change x-z position
     * @param rotationSpeed {Number}
     * @param speed {Number}
     */
    /// Rotate tank (left/right)
    rotate(rotationSpeed, speed){
        // speed *= gameSpeedFactor;
        speed /=2;
        this.movementNode.rotation.y += rotationSpeed;
        this.lookAt[0] = Math.cos(this.movementNode.rotation.y);
        this.lookAt[2] = -Math.sin(this.movementNode.rotation.y);
        this.turretLookAt[0] = Math.cos(
            this.turret.rotation.y + this.movementNode.rotation.y
        );
        this.turretLookAt[2] = -Math.sin(
            this.turret.rotation.y + this.movementNode.rotation.y
        );
        if (rotationSpeed > 0) { // Turn left
            this.rotateWheels(true, speed);
            this.rotateWheels(false, -speed);
        } else if (rotationSpeed < 0) {
            this.rotateWheels(false, speed);
            this.rotateWheels(true, -speed);
        }
    }

    //*\/*\/*\/*\/*\/*\/*
    // SHOOTING FUNCTIONS
    //*\/*\/*\/*\/*\/*\/*

    /**
     * Shoots a projectile
     */
    shoot() {
        if(this.firedAmmo < this.maxAmmo) {
            var array = this.turretLookAt;
            var bullet = new Projectile({
                position: {
                    x: this.bulletSpawnPoint.getWorldPosition().x,
                    z: this.bulletSpawnPoint.getWorldPosition().z
                },
                rotation: {
                    y: this.turret.rotation.y + this.movementNode.rotation.y
                },
                vector: array,
                playerId: this.playerId
            });

            this.playPium();
            this.bulletsArray.push(bullet);
            this.add(this.bulletsArray[this.bulletsArray.length -1].heart);
            this.cooldown = 40;
            ++this.firedAmmo;
        }
    }

    /**
     * Decreases cooldown in order to be able to shoot again
     */
    reduceCooldown() {
        --this.cooldown;
    }

    /**
     * Move bullets, animate them and managing its despawn with its sounds
     * @param ducks {Duck (array)}
     */
    animateBullets(ducks) {
        let self = this;
        ducks.forEach(function(duck,i) {
            if (duck.timeToGoHome) {
                if (duck.goHome() >= 50) {
                    scene.model.remove(duck.duck);
                    ducks.splice(i,1);
                    ++self.friendsCount;
                }
            }
        });
        this.bulletsArray.forEach(function(bullet, index){
            bullet.animateHeart();
            ducks.forEach(function(duck) {
                if(bullet.checkCollision(duck)) {
                    bullet.hit = true;
                    duck.timeToGoHome = true;
                }
            });
            if(bullet.isOutOfRange(self.lengthLimit) || bullet.hit) {
                if(bullet.explode() >= 20) {
                    self.playPop();
                    self.remove(bullet.heart);
                    self.bulletsArray.splice(index,1);
                    if (!bullet.hit) {
                        --self.ammo;
                        if (self.ammo == 0) {
                            scene.stopMusic();
                            toggleMenu(Menu.END_SCREEN);
                        }
                    }
                }
                if(bullet.hit && bullet.explode() <= 2) {
                    self.playCuack();
                    if(bullet.playerId == self.playerId) {
                        self.ammo = Math.min(
                            self.maxAmmo,
                            self.ammo + self.ammoGain[gameSpeedFactor]
                        );
                        self.firedAmmo = Math.max(0, self.firedAmmo - 4);
                    }
                }
            }
        });
    }


    //*\/*\/*\/*\/*\/*\/*
    // OTHER FUNCTIONS
    //*\/*\/*\/*\/*\/*\/*

    /**
     * Return tank camera
     */
    getCamera(){
        return this.subjectiveCamera;
    }

    
    /**
     * Toggles effects on and off
     **/
    toggleEffects() {
        this.volume =
            this.volume === 0 ? 0.5 : 0;
        this.sound.setVolume(this.volume);
    }

    /**
     * Returns if effects are on
     **/
    effectsOn() {
        return this.volume !== 0;
    }

    /**
     * Plays "cuack" sound
     **/
    playCuack() {
        let self = this;
        self.audioLoader.load(
            'sounds/cuack.mp3', function(buffer) {
                self.sound.setBuffer(buffer);
                self.sound.isPlaying = false;
                self.sound.setLoop(false);
                self.sound.setVolume(self.volume);
                self.sound.play();
            }
        );
    }

    /**
     * Plays "Pop" sound
     **/
    playPop() {
        let self = this;
        self.audioLoader.load(
            'sounds/heartPop.mp3', function(buffer) {
                self.sound.setBuffer(buffer);
                self.sound.isPlaying = false;
                self.sound.setLoop(false);
                self.sound.setVolume(self.volume);
                self.sound.play();
            }
        );
    }

    /**
     * Plays "pium" sound
     **/
    playPium() {
        let self = this;
        self.audioLoader.load(
            'sounds/pium.mp3', function(buffer) {
                self.sound.setBuffer(buffer);
                self.sound.isPlaying = false;
                self.sound.setLoop(false);
                self.sound.setVolume(self.volume);
                self.sound.play();
            }
        );
    }
}
