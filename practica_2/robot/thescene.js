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
        this.crane = null;
        this.robot = null;
        this.ground = null;
        this.flyingObjects = null;
        this.spawnedFO = 0;
        this.spawnedFOArray = null;

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
            45, window.innerWidth /
                                                  window.innerHeight,
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
        this.spotLight = new THREE.SpotLight(0xffffff);
        this.spotLight.position.set(
            100, 100, 30
        );
        this.spotLight.castShadow = true;
        // the shadow resolution
        this.spotLight.shadow.mapSize.width = 2048;
        this.spotLight.shadow.mapSize.height = 2048;
        this.add(this.spotLight);
    }

    /// It creates the geometric model: crane and ground
    /**
     * @return The model
     */
    createModel() {
        var model = new THREE.Object3D();
        var loader = new THREE.TextureLoader();

        // Robot model
        var robotTexture = loader.load('imgs/body.jpg');
        robotTexture.offset = new THREE.Vector2(0.265,0);
        var headTexture = loader.load('imgs/head.jpg');
        var legTexture = loader.load('imgs/leg.jpg');
        var rustyMetalTex = loader.load('imgs/rustymetal.jpg');
        this.robot = new Robot({
            eyeMaterial: new THREE.MeshPhongMaterial({ color: '#000000',
                                                       shininess: 70 }),
            headMaterial: new THREE.MeshPhongMaterial({ color: '#888888',
                                                        shininess: 70,
                                                        map: headTexture}),
            bodyMaterial: new THREE.MeshPhongMaterial({ color: '#e8e8e8',
                                                        shininess: 70,
                                                        map: robotTexture}),
            footMaterial: new THREE.MeshPhongMaterial({ color: '#001284',
                                                        shininess: 70,
                                                        map:
                                                        rustyMetalTex}),
            legMaterial: new THREE.MeshPhongMaterial({ color: '#e8e8e8',
                                                       shininess: 70 ,
                                                       map: legTexture}),
            shoulderMaterial: new THREE.MeshPhongMaterial({ color:
                                                            '#001284',
                                                            shininess:
                                                            70,
                                                            map:
                                                            rustyMetalTex})
        });
        // model.add (this.crane);
        model.add(this.robot);

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

        // Flying objects
        this.spawnedFOArray = new Array(
            -1,
            -1,
            -1
        );
        
        var ovoMaTexture = loader.load('imgs/ovoma.jpg');
        this.flyingObjects = new Array(10);
        for (var i = 0; i < 8; i++)
            this.flyingObjects[i] = new OvoMa({
                ovoMaMaterial: new
                THREE.MeshPhongMaterial({
                    color: '#ff0000',
                    shininess: 70,
                    map: ovoMaTexture})});


        var ovoBuTexture = loader.load('imgs/ovobu.jpg');
        for (i = 8; i < 10; i++)
            this.flyingObjects[i] = new OvoBu({
                ovoBuMaterial: new THREE.MeshPhongMaterial({
                    color: '#00ff00',
                    shininess: 70,
                    map: ovoBuTexture})});
        return model;
    }

    flyingObjectsAgent() {
        // Primero hay que spawnear algún objeto, añadiéndolo al
        // modelo (this.model) y luego estos hay que moverlos y cuando
        // lleguen a una posición determinada, borrarlos e instanciar
        // unos nuevos
        this.flyingObjectSpawner(this.spawnedFO);
        this.flyingObjectMover();
        this.flyingObjectRemover();
    }

    flyingObjectSpawner(FOindex) {
        if(FOindex < 3) {
        // Nos aseguramos de que el objeto que se genere no esté
        // ya en el juego
            do {
                var lastGenerated = randNum(10);
                var found = this.spawnedFOArray.find(function(element) {
                    return element == lastGenerated;
                });
            } while(found !== undefined);

            this.spawnedFOArray[FOindex] =
                lastGenerated;
            ++this.spawnedFO;
            this.flyingObjects[lastGenerated].initialize(this.hardMode);
            this.model.add(this.flyingObjects[lastGenerated]);
        }
    }

    flyingObjectMover() {
        for(var i = 0; i < this.spawnedFO; ++i) {
            this.flyingObjects[
                this.spawnedFOArray[i]].moveTowardsNegativeX(this.hardMode);
        }

    }
    
    flyingObjectRemover() {
        for(var i = 0; i < this.spawnedFO; ++i) {
            if(this.flyingObjects[this.spawnedFOArray[i]].sphere.position.x
           < -150) {
                this.model.remove(this.flyingObjects[this.spawnedFOArray[i]]);
                --this.spawnedFO;
                this.spawnedFOArray[i] = -1;
                this.flyingObjectSpawner(i);
            }

        }
    }
    
    /// It sets the crane position according to the GUI
    /**
     * @controls - The GUI information
     */
    animate(controls) {
        this.axis.visible = controls.axis;
        this.spotLight.intensity = controls.lightIntensity;
        this.hardMode = controls.hardMode;
        this.robot.setLegHeight(controls.robotLegScaleFactor);
        this.robot.setHeadTwist(controls.robotHeadTwist);
        this.robot.setBodySwing(controls.robotBodySwing);
        this.robot.turnFrontalLight(controls.robotFlashlightOn);
        this.flyingObjectsAgent();
        this.checkPosition();
        this.checkEnergy();
        this.collisionDetector();
        this.fogAgent();
    }

    checkPosition() {
        var robotPosition = new THREE.Vector3();
        this.robot.body.getWorldPosition(robotPosition);
        var posX = robotPosition.x;
        var posZ = robotPosition.z;
        if(posX < -this.ground.width / 2 || posX >
           this.ground.width / 2 || posZ < -this.ground.deep / 2 || posZ
           > this.ground.deep / 2) {
            alert('Ooopsie wopsieeee you ran away from the' +
                  'fieeeelldd w.w You loosse o.o I\'m sowy\nScore: '+
                  this.robot.score);
            this.reset();
        }

    }

    checkEnergy() {
        if(this.robot.energy <= 0) {
            alert('GAME OVER\nPuntuación: ' + this.robot.score);
            this.reset();
        }
    }

    fogAgent() {
        if(this.hardMode) {
            this.fog.near = 100;
            this.fog.far = 300;
        } else {
            this.fog.near = 1000;
            this.fog.far = 1000;
        }
    }

    /// It returns the camera
    /**
     * @return The camera
     */
    getCamera() {
        if (this.firstPersonCamera) {
            return this.robot.getCamera();
        } else {
            return this.camera;
        }
    }

    swapCamera() {
        this.firstPersonCamera = !this.firstPersonCamera;
    }

    pauseGame() {
        alert('El juego está en pausa, pulse de nuevo la barra' +
              'espaciadora para continuar');
    }

    toggleReset() {
        this.gameReset = !this.gameReset;
    }

    reset() {
        this.toggleReset();
        this.robot.reset();
    }

    collisionDetector() {
        var headPosition = new THREE.Vector3();
        this.robot.head.getWorldPosition(headPosition);
        var FOPosition = new THREE.Vector3();
        var distance = null;
        var FORadius = this.flyingObjects[0].radius;
        var headRadius = this.robot.headRadius;
        for(var i = 0; i < this.spawnedFO; ++i) {
            this.flyingObjects[
                this.spawnedFOArray[i]].sphere.getWorldPosition(FOPosition);
            distance = headPosition.distanceTo(FOPosition);
            if(distance < ( headRadius + FORadius) || 
               this.robot.body.geometry.boundingBox.
                   distanceToPoint(FOPosition)
            < FORadius)  {
                if(!this.flyingObjects[this.spawnedFOArray[i]].hasCollided) {
                    this.flyingObjects[this.spawnedFOArray[i]].
                        changeCollision();
                    if(this.flyingObjects[this.spawnedFOArray[i]].bad()){
                        this.robot.reduceEnergy();
                    } else {
                        this.robot.increaseEnergy();
                    }
                }
            } else {
                if(this.flyingObjects[
                    this.spawnedFOArray[i]].hasCollided) {
                    this.flyingObjects[
                        this.spawnedFOArray[i]].changeCollision();
                }
            }
        }
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

    moveRobot(key) {
        var speed = null;
        speed = (this.hardMode) ? 3 : 1;
        var rotationSpeed = 2;

        switch (key) {
        case String.charCodeAt('W'): // Up
        case 38: // Up
            this.robot.moveRobotForward(speed);
            break;
        case String.charCodeAt('A'): // Left
        case 37: // Left
            this.robot.rotateRobot(rotationSpeed);
            break;
        case String.charCodeAt('S'): // Down
        case 40: // Down
            this.robot.moveRobotForward(-speed);
            break;
        case String.charCodeAt('D'): // Right
        case 39: // Right
            this.robot.rotateRobot(-rotationSpeed);
            break;
        case String.charCodeAt('V'):
            this.swapCamera();
            break;
        }
    }
}


function randNum(top) {
    return Math.floor(Math.random() * Math.floor(top));
}

