'use strict';

class Duck extends THREE.Object3D {
    constructor(parameters){
        super();
        this.moveCounter = 0;
        this.twistCounter = 0;
        this.moveMode = true;
        this.twistMode = false;
        this.duck = null;
        this.speed = 1;
        this.collider = null;
        this.colliderRadius = 20;
        this.add(this.createDuck());
        this.lookAt = [
            1,
            0,
            0
        ];
        this.groundWidth = parameters.groundWidth; 
    }

    /**
     * Creates duck and loads its model
     **/
    createDuck(){
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
        this.duck.position.x = 200;
        this.duck.rotation.y = 90* Math.PI / 180;
    
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

    /**
     * Moves duck towards its lookAt at a specific speed
     * @param speed {Number}
     */
    moveDuck(speed){
        var newXPos = this.duck.position.x +
            speed * this.lookAt[0];
        var newZPos = this.duck.position.z +
            speed * this.lookAt[2];

        if(newXPos < this.groundWidth/2 &&  newXPos > -this.groundWidth/2)
        // X component of lookAt vector
            this.duck.position.x = newXPos;
        // Z component of lookAt vector
        if(newZPos < this.groundWidth/2 &&  newZPos > -this.groundWidth/2)
            this.duck.position.z = newZPos;
    }

    /** 
     * Rotates duck at a specific speed
     * @param speed {Number}
     */
    rotateDuck(speed) {
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
            this.moveDuck(this.speed);
            if(this.moveCounter >= 100) {
                this.moveMode = false;
                this.twistMode = true;
                this.moveCounter = 0;
            }
        } else if (this.twistMode) {
            this.twistCounter++;
            this.rotateDuck(2);
            if(this.twistCounter >= 90) {
                this.twistMode = false;
                this.moveMode = true;
                this.twistCounter = 0;
            }
        }
    }

    

}
