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
        // Test projectile
        this.projectile = null;

        this.gameReset = false;
        this.hardMode = false;
        this.createLights();
        this.createCamera(renderer);
        this.firstPersonCamera = false;
        this.axis = new THREE.AxisHelper(25);
        this.add(this.axis);
        this.model = this.createModel();
        this.add(this.model);
        this.fog = new THREE.Fog(
            0xffffff,
            1000,
            1000
        );

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
            80, 50, 80
        );
        var look = new THREE.Vector3(
            0, 20, 0
        );
        this.camera.lookAt(look);
        this.trackballControls = new THREE.TrackballControls(this.camera,
                                                             renderer);
        this.trackballControls.rotateSpeed = 5;
        this.trackballControls.zoomSpeed = -2;
        this.trackballControls.panSpeed = 0.5;
        this.trackballControls.target = look;


        this.add(this.camera);
    }

    /// It creates lights and adds them to the graph
    createLights() {
        // add subtle ambient lighting
        this.ambientLight = new THREE.AmbientLight(0xccddee, 0.35);
        this.add(this.ambientLight);

        // add spotlight for the shadows
        this.spotLight = new THREE.SpotLight(0xffffff, 0.5);
        this.spotLight.position.set(
            100, 100, 30
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

        // Tank model
        var tankTexture = loader.load('imgs/metal1.jpg');
        
        this.tank = new Tank(
            {material: new THREE.MeshPhongMaterial(
                {
                    color: '#00ff00',
                    shininess: 70,
                    map: tankTexture
                }
            )
            }
        );
        model.add(this.tank);

        // Ground model
        var groundTexture = loader.load('imgs/rock.jpg');
        groundTexture.wrapS = THREE.RepeatWrapping;
        groundTexture.wrapT = THREE.RepeatWrapping;
        groundTexture.repeat = new THREE.Vector2(4,4);
        this.ground = new Ground(
            500, 500, new THREE.MeshPhongMaterial({
                map: groundTexture
            }), 4
        );
        model.add(this.ground);

        this.projectile = new Projectile();
        model.add(this.projectile.heart);
        return model;
    }

    /// It sets the crane position according to the GUI
    /**
     * @controls - The GUI information
     */
    animate(controls) {
        this.moveTank();
        this.projectile.animateHeart();
        // this.axis.visible = controls.axis;
        // this.spotLight.intensity = controls.lightIntensity;
        // this.tank.setTurretRotation(controls.tankTurretRotation);
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

    moveTank() {
        var speed = 1;
        var rotationSpeed = Math.PI*2/180;
        let self = this;
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
            }
        });
    }
}

function randNum(top) {
    return Math.floor(Math.random() * Math.floor(top));
}
