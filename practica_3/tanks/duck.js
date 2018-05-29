'use strict';

/**
 * Duck object
 *
 * @param {Object} parameters - Initial object parameters
 * @param {Number} rotationY - Initial offset rotation
 * @param {Number} xPos - Initial x position
 * @param {Number} zPos - Initial z position
 * @param {Number} groundWidth - Movement limits
 */
class Duck extends THREE.Object3D {
    constructor(parameters){
        super();

        //*********
        // Counters
        //*********
        
        this.moveCounter = 0;
        this.moveLimit = randNum(100) + 50;
        this.twistCounter = 0;
        this.twistLimit = randNum(180) - 90;
        this.fadeCounter = 0;

        //*********
        // Modes
        //*********
        
        this.moveMode = true;
        this.twistMode = false;
        this.timeToGoHome = false; // Fades duck with animation

        //*********************
        // Model and properties
        //*********************
        
        this.duck = null;
        this.speed = 1;
        this.rotationSpeed = 2;
        this.collider = null;
        this.colliderRadius = 20;
        this.rotationOffset = parameters.rotationY;
        this.add(
            this.createDuck(
                {
                    x: parameters.xPos,
                    z: parameters.zPos
                },
                this.rotationOffset
            )
        );

        //*********
        // LookAt
        //*********
        
        this.lookAt = [
            Math.cos(this.duck.rotation.y - Math.PI / 2),
            0,
            -Math.sin(this.duck.rotation.y -  Math.PI / 2)
        ];
        
        //****************
        // Movement limits
        //****************
        this.widthLimit = parameters.groundWidth;
    }

    
    //*\/*\/*\/*\/*\/*
    // MODEL CREATION
    //*\/*\/*\/*\/*\/*


    /**
     * Creates duck and loads its model
     *
     * @param {{x: Number, z: Number}} position - x and z position of the duck
     * @param {Number} rotationY - y rotation angle
     **/
    createDuck(position, rotationY){
        this.duck = new THREE.Object3D();

        // /*
        var mtlLoader = new THREE.MTLLoader();
        mtlLoader.setPath( 'obj/duck/' );
        mtlLoader.setTexturePath( 'obj/duck/' );
        let self = this;
        mtlLoader.load( 'duck.mtl', function( materials ) {
            materials.preload();
            var objLoader = new THREE.OBJLoader();
            objLoader.setMaterials( materials );

            objLoader.setPath( 'obj/duck/' );
            objLoader.load( 'duck.obj', function ( object ) {


                // Ahora recorremos el subgrafo encabezado por object
                // para asignar materiales manualmente y recalcular normales

                object.traverse (function (child) {
                    if (child instanceof THREE.Mesh) {
                        // Asignación manual de material basándonos en que
                        // material y fragmento
                        // de geometría tiene el mismo nombre
                        child.material = materials.materials[child.name];
                        // No se quiere que se vea la geometría facetada
                        child.material.flatShading = false;

                        // Se recalculan las normales
                        var geom = new THREE.Geometry().fromBufferGeometry(
                            child.geometry
                        );
                        geom.computeFaceNormals();
                        geom.mergeVertices();
                        geom.computeVertexNormals();
                        geom.normalsNeedUpdate =true;
                        child.geometry = geom.clone();
                    }
                });


                self.duck.add(object);

            });
        });

        this.duck.scale.set (100, 100, 100);
        this.duck.position.x = position.x;
        this.duck.position.z = position.z;
        this.duck.rotation.y = rotationY * Math.PI / 180;

        this.duck.add(this.createCollider());
        return this.duck;
    }

    /**
     * Create duck collider, which is used to calculate collisions
     */
    createCollider() {
        var geometry = new THREE.SphereGeometry( this.colliderRadius, 32, 32 );
        var material = new THREE.MeshBasicMaterial( {color: 0xff0000} );
        material.transparent = true;
        material.opacity = 0;
        this.collider = new THREE.Mesh( geometry, material);
        this.collider.scale.set (1/100, 1/100, 1/100);
        this.collider.position.y /= 100;
        return this.collider;
    }


    
    //*\/*\/*\/*\/*\/*
    // DUCK MOVEMENT
    //*\/*\/*\/*\/*\/*

    /**
     * Moves duck towards its lookAt at a specific speed
     *
     * @param {Number} speed
     */
    moveDuck(speed){
        speed *= gameSpeed;
        var newXPos = this.duck.position.x +
            speed * this.lookAt[0];
        var newZPos = this.duck.position.z +
            speed * this.lookAt[2];
        var outOfRange = false;
        if(newXPos < this.widthLimit/2 &&  newXPos > -this.widthLimit/2)
        // X component of lookAt vector
            this.duck.position.x = newXPos;
        else
            outOfRange = true;
        // Z component of lookAt vector
        if(newZPos < this.widthLimit/2 &&  newZPos > -this.widthLimit/2)
            this.duck.position.z = newZPos;
        else
            outOfRange = true;
        return outOfRange;
    }

    /**
     * Rotates duck at a specific speed
     *
     * @param {Number} speed
     */
    rotateDuck(speed) {
        speed *= gameSpeed;
        this.duck.rotation.y += speed * Math.PI / 180;
        var offset = -90 * Math.PI/180;
        var lookat = this.duck.rotation.y + offset;
        this.lookAt[0] = Math.cos(lookat);
        this.lookAt[2] = -Math.sin(lookat);
    }

    /**
     * Animates duck
     */
    animateDuck() {
        if(this.moveMode) {
            this.moveCounter++;
            if(this.moveDuck(this.speed)){
                this.moveCounter = this.moveLimit;
            }
            if(this.moveCounter >= this.moveLimit) {
                this.moveMode = false;
                this.twistMode = true;
                this.moveCounter = 0;
                this.moveLimit = randNum(100) + 50;
            }
        } else if (this.twistMode) {
            this.twistCounter++;
            this.rotateDuck(this.rotationSpeed);
            if(this.twistCounter >= this.twistLimit) {
                this.twistMode = false;
                this.moveMode = true;
                this.twistCounter = 0;
                this.twistLimit = (randNum(180) - 90) / gameSpeed;
                this.rotationSpeed =
                    (randNum(10) < 5) ? 2 : -2;
            }
        }
        if(this.timeToGoHome) {
            this.fadeCounter += 2;
            this.duck.position.y = this.fadeCounter;
            this.duck.rotation.y +=3*Math.PI /180;
        }
    }

    
    //*\/*\/*\/*\/*\/*
    // ACCESSORS
    //*\/*\/*\/*\/*\/*

    goHome() {
        return this.fadeCounter;
    }
}
