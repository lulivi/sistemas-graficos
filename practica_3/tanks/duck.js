'use strict';

class Duck extends THREE.Object3D {
    constructor(){
        super();
        this.moveCounter = 0;
        this.twistCounter = 0;
        this.moveMode = true;
        this.twistMode = false;
        this.duck = this.createDuck();
        this.lookAt = [
            1,
            0,
            0
        ];
    }

    createDuck(){
        var duck = new THREE.Object3D();

        // /*
        var mtlLoader = new THREE.MTLLoader();
        mtlLoader.setPath( 'obj/duck/' );
        mtlLoader.setTexturePath( 'obj/duck/' );
        mtlLoader.load( 'duck.mtl', function( materials ) {
            materials.preload();
            var objLoader = new THREE.OBJLoader();
            objLoader.setMaterials( materials );
            
            objLoader.setPath( 'obj/duck/' );
            objLoader.load( 'duck.obj', function ( object ) {
                
                object.scale.set (100, 100, 100);
                object.position.z = 50;
                object.position.y = 30;
                object.rotation.y = 90* Math.PI / 180; 

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
                

                duck.add(object);
            });
        });
        // */
        
        /*
        var mtlLoader = new THREE.MTLLoader();
        mtlLoader.setBaseUrl('obj/duck/');
        mtlLoader.setPath('obj/duck/');
        mtlLoader.load('duck.mtl', function (materials) {
            
            materials.preload();
            var objLoader = new THREE.OBJLoader();
            objLoader.setMaterials(materials);
            objLoader.setPath('obj/duck/');
            objLoader.load('duck.obj', 
                           
                           function (object) {
                               object.position.z = 50;
                               object.rotation.y = 90* Math.PI / 180; 
                               object.scale.y = 100;
                               object.scale.x = 100;
                               object.scale.z = 100;
                               object.castShadow = true;

                               duck.add(object);
                               
                           });
        });
        */
        
        return duck;
    }
    
    moveDuck(speed){
        this.duck.position.x += speed * this.lookAt[0];
        this.duck.position.z += speed * this.lookAt[2];
        
    }

    rotateDuck(speed) {
        this.duck.rotation.y += speed * Math.PI / 180;
        this.lookAt[0] = Math.cos(this.duck.rotation.y);
        this.lookAt[2] = -Math.sin(this.duck.rotation.y);
    }
    
    animateDuck() {
        if(this.moveMode) {
            this.moveCounter++;
            this.moveDuck(1);
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
