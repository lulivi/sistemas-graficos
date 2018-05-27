'use strict';

/// The Model Facade class. The root node of the graph.
/**
 * @param renderer - The renderer to visualize the scene
 */
class TheScene extends THREE.Scene {

    constructor(renderer) {
        super();

        // Attributes
        this.ambientLight = null;
        this.spotLight = null;
        this.camera = null;
        this.trackballControls = null;
        this.tank = null;
        this.ground = null;
        this.groundWidth = 500;
        this.groundLength = 500;
        // Ducks

        this.duckArray = Array();
        this.ducksLimit = 5;
        this.duckCooldown = 0;
        // Audio

        this.listener = new THREE.AudioListener();
        this.add( this.listener );

        // create a global audio source
        this.musicOn = true;
        this.sound = new THREE.Audio( this.listener );
        this.audioLoader = new THREE.AudioLoader();
        let self = this;
        this.audioLoader.load(
            'sounds/song.mp3', function( buffer ) {
                self.sound.setBuffer( buffer );
                self.sound.setLoop( true );
                self.sound.setVolume( 0.5 );
                if (self.musicOn)
                    self.sound.play();
            }
        );

        this.gameReset = false;
        this.hardMode = false;
        this.createLights();
        this.firstPersonCamera = false;
        this.model = this.createModel();
        this.add(this.model);
        this.createCamera(renderer);
        this.fog = new THREE.Fog(
            0xffffff,
            1000,
            1000
        );
    }


    /** Creates background cube image
     *
     **/

    createBackground(mapName) {
        var path = 'imgs/' + mapName + '/';
        var format = '.jpg';
        var urls = [
            path + 'px' + format, path + 'nx' + format,
            path + 'py' + format, path + 'ny' + format,
            path + 'pz' + format, path + 'nz' + format
        ];
        var reflectionCube = new THREE.CubeTextureLoader().load( urls );
        reflectionCube.format = THREE.RGBFormat;
        this.background = reflectionCube;
    }

    /// It creates the camera and adds it to the graph
    /**
     * @param renderer - The renderer associated with the camera
     */
    createCamera(renderer) {
        this.camera = new THREE.PerspectiveCamera(
            45, window.innerWidth / window.innerHeight,
            0.1, 1000
        );
        this.camera.position.set(
            -120, 40, 0
        );
        var look = new THREE.Vector3(
            0, 0, 0
        );
        this.camera.lookAt(look);
        this.trackballControls = new THREE.TrackballControls(this.camera,
                                                             renderer);
        this.trackballControls.rotateSpeed = 5;
        this.trackballControls.zoomSpeed = 2;
        this.trackballControls.panSpeed = 0.5;
        this.trackballControls.target = look;

        //this.add(this.camera);
        this.tank.turret.add(this.camera);
    }

    /// It creates lights and adds them to the graph
    createLights() {
        // add subtle ambient lighting
        this.ambientLight = new THREE.AmbientLight(0xccddee, 0.35);
        this.add(this.ambientLight);

        // add spotlight for the shadows
        this.spotLight = new THREE.SpotLight(0xffffff, 0.5);
        this.spotLight.angle = Math.PI/2;
        this.spotLight.position.set(
            0, 100, 0
        );
        this.spotLight.castShadow = true;
        // the shadow resolution
        this.spotLight.shadow.mapSize.width = 2048;
        this.spotLight.shadow.mapSize.height = 2048;
        this.add(this.spotLight);
    }

    /// It creates the geometric model
    /**
     * @return The model
     */
    createModel() {
        var model = new THREE.Object3D();
        var loader = new THREE.TextureLoader();

        // Ground model
        var groundTexture = loader.load('imgs/water.jpg');
        groundTexture.wrapS = THREE.RepeatWrapping;
        groundTexture.wrapT = THREE.RepeatWrapping;
        groundTexture.repeat = new THREE.Vector2(8,8);
        this.ground = new Ground(
            this.groundWidth, this.groundLength, new THREE.MeshPhongMaterial({
                map: groundTexture
            }), 4
        );
        model.add(this.ground);

        // Tank model
        var tankTexture = loader.load('imgs/metal1.jpg');
        var wheelTexture = loader.load('imgs/wheel.jpg');

        this.tank = new Tank({
            material: new THREE.MeshPhongMaterial({
                color: '#00ff00',
                shininess: 70,
                map: tankTexture
            }),
            ground: {
                length: this.groundLength,
                width: this.groundWidth
            },
            wheelMaterial: new THREE.MeshPhongMaterial({
                color: '#00aa00',
                shininess: 0,
                map: wheelTexture
            }),
            playerId: 1
        });
        model.add(this.tank);
        return model;
    }

    /// It sets the crane position according to the GUI
    /**
     * @controls - The GUI information
     */
    animate(controls) {
        this.moveTank();
        this.tank.animateBullets(this.duckArray);
        ammoBarsArray[0].updateAmmo(this.tank.ammo, this.tank.friendsCount);
        this.createDucks();
        this.duckArray.forEach(function(duck) {
            duck.animateDuck();
        });
    }

    /// It returns the camera
    /**
     * @return The camera
     */
    getCamera() {
        if (this.firstPersonCamera) {
            return this.tank.getCamera();
        } else {
            return this.camera;
        }
    }

    swapCamera() {
        this.firstPersonCamera = !this.firstPersonCamera;
    }

    /*
    pauseGame() {
        alert('El juego está en pausa, pulse de nuevo la barra' +
              'espaciadora para continuar');
    }
    */

    toggleReset() {
        this.gameReset = !this.gameReset;
    }

    reset() {
        this.toggleReset();
    }

    /// It returns the camera controls
    /**
     * @return The camera controls
     */
    getCameraControls() {
        return this.trackballControls;
    }

    /// It updates the aspect ratio of the camera
    /**
     * @param anAspectRatio - The new aspect ratio for the camera
     */
    setCameraAspect(anAspectRatio) {
        this.camera.aspect = anAspectRatio;
        this.camera.updateProjectionMatrix();
    }

    /**
     * Moves tank, depending on which keys are being pressed
     **/
    moveTank() {
        var speed = 1 * gameSpeedFactor;
        var rotationSpeed = Math.PI * 2 / 180;
        let self = this;
        self.tank.reduceCooldown();
        pressedKeysArray.forEach(function(item) {
            switch (String.fromCharCode(item)) {
            case 'W': // Up
                self.tank.moveForward(speed);
                break;
            case 'A': // Left
                self.tank.rotate(rotationSpeed, speed);
                break;
            case 'S': // Down
                self.tank.moveForward(-speed);
                break;
            case 'D': // Right
                self.tank.rotate(-rotationSpeed, speed);
                break;
            case 'Q': // turn left turret
                self.tank.rotateTurret(rotationSpeed);
                break;
            case 'E': // turn right turret
                self.tank.rotateTurret(-rotationSpeed);
                break;
            case ' ':
                if (self.tank.cooldown <= 0) {
                    self.tank.shoot();
                }
                break;
            }
        });
    }

    /**
     * Plays "focus" music
     **/
    playFocus() {
        let self = this;
        self.audioLoader.load(
            'sounds/focus.mp3', function( buffer ) {
                self.sound.setBuffer( buffer );
                self.sound.setLoop( true );
                self.sound.setVolume( 0.5 );
                if (self.musicOn)
                    self.sound.play();
            }
        );
    }

    /**
     * Turns music on/off
     **/
    toggleMusic() {
        this.musicOn = !this.musicOn;
        this.sound.isPlaying?
            this.sound.stop() :
            this.sound.play();
    }

    toggleEffects() {
        this.tank.toggleEffects();
    }

    effectsOn() {
        return this.tank.effectsOn();
    }

    /**
     * Stops any sound playing on the scene and goes cuacks
     **/
    stopMusic() {
        this.sound.stop();
        this.tank.playCuack();
    }

    /**
     * Stops main theme and
     **/
    stopTheme() {
        this.sound.stop();
        this.playFocus();
    }

    /**
     * Creates ducks when possible, at random pos.
     **/
    createDucks() {
        if(this.duckArray.length < this.ducksLimit && this.duckCooldown <= 0) {
            var duck = new Duck({
                groundWidth: this.groundWidth,
                xPos: randNum(500) - 250,
                yPos: randNum(500) - 250,
                rotationY: randNum(360)
            });
            this.duckArray.push(duck);

            this.model.add(this.duckArray[this.duckArray.length-1].duck);
            this.duckCooldown = 200;
            this.tank.playCuack();
        }
        this.duckCooldown--;
    }
}


/**
 * Generates a random number between 0 and top
 * @param {Number} top - The greatest number that might be generated
**/

function randNum(top) {
    return Math.floor(Math.random() * Math.floor(top));
}
