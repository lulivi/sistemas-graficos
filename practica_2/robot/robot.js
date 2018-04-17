/// The Robot class
/**
 * @author
 *
 * @param parameters = {
 *      robotBodyHeight: <float>,
 *      robotBodyRadius : <float>,
 *      material: <Material>
 * }
 */

class Robot extends THREE.Object3D {
    constructor(parameters) {
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

        this.eyeMaterial = (parameters.eyeMaterial === undefined ?
            this.material : parameters.eyeMaterial);

        this.headMaterial = (parameters.headMaterial === undefined ?
            this.material : parameters.headMaterial);

        this.bodyMaterial = (parameters.bodyMaterial === undefined ?
            this.material : parameters.bodyMaterial);

        this.footMaterial = (parameters.footMaterial === undefined ?
            this.material : parameters.footMaterial);

        this.legMaterial = (parameters.legMaterial === undefined ?
            this.material : parameters.legMaterial);

        this.shoulderMaterial = (parameters.shoulderMaterial === undefined
            ? this.material : parameters.shoulderMaterial);

        // **********
        // BODY PARTS
        // **********
        this.movementNode = null;
        this.lookAt = [
            1,
            0,
            0
        ];
        this.swingNode = null;
        this.body = null;
        this.head = null;
        this.eye = null;
        this.subjectiveCamera = null;

        this.shoulderLeft = null;
        this.shoulderRight = null;
        this.footLeft = null;
        this.footRight = null;
        this.legLeft = null;
        this.legRight = null;

        // **************
        // BASIC MEASURES
        // **************

        // Movement node
        this.rotationOffset = 90; // lookAt has a 90 degrees offset

        // Body
        this.bodyHeight = (parameters.craneHeight === undefined ?
            28 : parameters.robotBodyHeight);
        this.bodyRadius = (parameters.craneWidth === undefined ?
            12 : parameters.robotBodyRadius);

        // Head
        this.headRadius = this.bodyRadius * 0.95;
        this.eyeHeight = this.headRadius / 2;
        this.eyeRadius = this.headRadius / 5;

        // Legs
        this.legHeight = this.bodyHeight;
        this.legRadius = this.headRadius / 5;
        this.legLeftPosition = this.bodyRadius + this.legRadius * 1.2;
        this.legRightPosition = -(this.bodyRadius + this.legRadius * 1.2);

        // Feet
        this.footHeight = this.headRadius / 2;
        this.footRadiusTop = this.legRadius * 1.2;
        this.footRadiusBottom = this.footRadiusTop * 2;

        // Shoulders
        this.shoulderWidth = this.footRadiusTop * 2;
        this.shoulderHeight = this.footRadiusTop * 2;
        this.shoulderDepth = this.footRadiusTop * 3;
        this.shoulderBodyHeight = this.shoulderHeight / 2 + this.legHeight
            - this.headRadius;

        // **************
        // MEASURE LIMITS
        // **************

        // Head turn
        this.headMaxTurnRight = 80 * Math.PI / 180;
        this.headMaxTurnLeft = -80 * Math.PI / 180;

        // Body swing
        this.bodyHeadMaxRotationForward = 30 * Math.PI / 180;
        this.bodyHeadMaxRotationBackward = -45 * Math.PI / 180;

        // Max leg lenght = 20% of normal leg lenght
        this.legMinHeight = this.bodyHeight;
        this.legMaxHeight = this.legHeight + (this.legHeight * 20 / 100);


        // ROBOT ILUMINATION
        this.frontalLight = new THREE.SpotLight(0xffffff);
        // **************
        // MODEL CREATION
        // **************

        this.add(this.createMovementNode());

        // ****************
        // ROBOT ATTRIBUTES
        // ****************

        this.energy = 100;
        this.score = 0;
        this.MAX_POINTS = 5;
    }

    // ***************
    // MODEL CREATION
    // ***************

    createMovementNode(){
        this.movementNode = new THREE.Object3D();
        this.movementNode.add(this.createSwingNode());
        this.movementNode.add(this.createFoot(this.legLeftPosition));
        this.movementNode.add(this.createFoot(this.legRightPosition));
        return this.movementNode;
    }

    createSwingNode() {
        this.swingNode = new THREE.Object3D();
        this.swingNode.position.y = this.headRadius + this.footHeight;
        this.swingNode.add(this.createBody());
        return this.swingNode;
    }

    createBody() {
        this.body = new THREE.Mesh(new THREE.CylinderGeometry(
            this.bodyRadius, this.bodyRadius,this.bodyHeight, 50
        ), this.bodyMaterial);
        this.body.geometry.applyMatrix(new
        THREE.Matrix4().makeTranslation(
            0, this.bodyHeight / 2, 0
        ));
        this.body.castShadow = true;
        this.body.geometry.computeBoundingBox();
        this.body.add(this.createHead());
        return this.body;
    }

    createHead() {
        this.head = new THREE.Mesh(new
        THREE.SphereGeometry(
            this.headRadius, 32, 32
        ),
                                   this.headMaterial);
        this.head.position.y = this.bodyHeight;
        this.head.castShadow = true;
        this.head.add(this.createEye());
        return this.head;
    }

    createEye() {
        this.eye = new THREE.Mesh(new
        THREE.CylinderGeometry(
            this.eyeRadius, this.eyeRadius,
            this.eyeHeight, 50
        ), this.eyeMaterial);
        this.eye.geometry.applyMatrix(new
        THREE.Matrix4().makeRotationZ(Math.PI / 2));
        this.eye.geometry.applyMatrix(new
        THREE.Matrix4().makeTranslation(
            this.headRadius * 0.9, 0, 0
        ));
        this.eye.geometry.applyMatrix(new
        THREE.Matrix4().makeRotationZ(20 * Math.PI / 180));
        this.eye.castShadow = true;
        // "Miner" Light
        this.createLight();
        // Subjective Camera
        this.createCamera();
        return this.eye;
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
        this.subjectiveCamera.position.x += 10;
        this.eye.add(this.subjectiveCamera);
    }

    createFoot(legPosition) {
        var foot = new THREE.Mesh(new
        THREE.CylinderGeometry(
            this.footRadiusTop,
            this.footRadiusBottom, this.footHeight, 50
        ), this.footMaterial);
        foot.geometry.applyMatrix(new
        THREE.Matrix4().makeTranslation(
            0, this.footHeight / 2, 0
        ));
        foot.position.z = legPosition;
        foot.castShadow = true;
        foot.add(this.createLeg(legPosition));
        foot.add(this.createShoulder(legPosition));
        (legPosition > 0) ? this.footRight = foot : this.footLeft = foot;
        return foot;
    }

    createLeg(legPosition) {
        var leg = new THREE.Mesh(new
        THREE.CylinderGeometry(
            this.legRadius, this.legRadius, this.legHeight,
            50
        ), this.legMaterial);
        leg.position.y = this.footHeight;
        leg.geometry.applyMatrix(new
        THREE.Matrix4().makeTranslation(
            0, this.legHeight / 2 , 0
        ));
        leg.castShadow = true;
        (legPosition > 0) ? this.legRight = leg : this.legLeft = leg;
        return leg;
    }

    createShoulder(legPosition) {
        var shoulder = new THREE.Mesh(new
        THREE.BoxGeometry(
            this.shoulderWidth, this.shoulderHeight,
            this.shoulderDepth
        ), this.shoulderMaterial);
        shoulder.geometry.applyMatrix(new
        THREE.Matrix4().makeTranslation(
            0, this.shoulderHeight / 2 +
        this.legHeight + this.footHeight, 0
        ));
        shoulder.castShadow = true;
        (legPosition > 0) ?
            this.shoulderRight = shoulder :
            this.shoulderLeft = shoulder;
        return shoulder;
    }

    // ******************
    // MODEL MANIPULATION
    // ******************

    setBodyHeight(height) {
        this.swingNode.position.y =  height + this.shoulderBodyHeight +
            this.headRadius + this.footHeight;
        this.shoulderLeft.position.y = height;
        this.shoulderRight.position.y = height;
    }

    setLegHeight(newLegHeight) {
        var scaleFactor = (newLegHeight / 100);
        var legScaleFactor = (1 + scaleFactor);

        if (legScaleFactor >= 1 && legScaleFactor <= 1.20) {
            this.legLeft.scale.y = legScaleFactor;
            this.legRight.scale.y = legScaleFactor;
            this.shoulderRight.position.y = legScaleFactor;
            this.shoulderLeft.position.y = legScaleFactor;
            this.setBodyHeight(this.legMinHeight * scaleFactor);
        }
    }

    setHeadTwist(headTwistAngle) {
        this.head.rotation.y = headTwistAngle * Math.PI / 180;
    }

    setBodySwing(bodySwingAngle) {
        this.body.position.y = -this.bodyHeight + this.shoulderHeight;
        this.swingNode.rotation.z = bodySwingAngle * Math.PI / 180;
    }

    rotateRobot(value){
        this.movementNode.rotation.y += value * Math.PI / 180;
        this.lookAt[0] = Math.cos(this.movementNode.rotation.y);
        this.lookAt[2] = -Math.sin(this.movementNode.rotation.y);
    }

    moveRobotForward(value) {
        this.movementNode.position.x += value * this.lookAt[0];
        // X component of lookAt vector
        this.movementNode.position.z += value * this.lookAt[2];
        // Z component of lookAt vector
        this.updateBoundingBox();
    }

    updateBoundingBox() {
        var min = this.body.getWorldPosition();
        var max = min;
        min.x -= this.bodyRadius;
        min.y -= this.bodyHeight / 2;
        min.z -= this.bodyRadius;
        max.x += this.bodyRadius;
        max.y += this.bodyHeight / 2;
        max.z += this.bodyRadius;
        this.body.geometry.boundingBox.set(min,max);
    }

    createLight() {
        var target = new THREE.Object3D();
        target.position.x = 100;
        target.position.y = -30;
        this.frontalLight.position.x += 15;
        this.frontalLight.target = target;
        this.eye.add(this.frontalLight.target);
        this.frontalLight.castShadow = true;
        this.frontalLight.shadow.mapSize.width = 2048;
        this.frontalLight.shadow.mapSize.height = 2048;
        this.eye.add(this.frontalLight);
    }

    turnFrontalLight(lightState){
        this.frontalLight.intensity = (lightState) ? 1 : 0;
    }

    getCamera() {
        return this.subjectiveCamera;
    }


    // *****************************
    // MODEL ATTRIBUTES MANIPULATION
    // *****************************

    reduceEnergy() {
        if(this.energy > 10) {
            this.energy -= 10;
        } else {
            this.energy = 0;
        }
    }

    increaseEnergy() {
        var points = Math.floor(Math.random() * Math.floor(this.MAX_POINTS));
        this.score += points;
        if(this.energy + this.MAX_POINTS - points <= 100){
            this.energy += this.MAX_POINTS - points;
        } else {
            this.energy = 100;
        }
    }

    movementCost() {
        if(this.energy > 0) {
            this.energy -= 1;
        }
    }

    reset() {
        this.energy = 100;
        this.movementNode.position.set(
            0,
            0,
            0
        );
        this.movementNode.rotation.y = 0;
        this.score = 0;
        this.lookAt = [
            1,
            0,
            0
        ];
    }
}


// class variables
Robot.WORLD = 0;
Robot.LOCAL = 1;
