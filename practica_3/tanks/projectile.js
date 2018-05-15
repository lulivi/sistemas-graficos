'use strict';

class Projectile extends THREE.Object3D {
    constructor(parameters){
        super();
        this.count = 0;
        this.lookAt = null;
        this.heart = this.createHeart(
            parameters.position,
            parameters.vector
        );
        this.growMode = true;
        this.speed = 2;

        
    }

    createHeart(position, vector){

        var heart = new THREE.Object3D();
        var mtlLoader = new THREE.MTLLoader();
        mtlLoader.setBaseUrl('obj/heart/');
        mtlLoader.setPath('obj/heart/');
        mtlLoader.load('heart.mtl', function (materials) {
            
            materials.preload();
            var objLoader = new THREE.OBJLoader();
            objLoader.setMaterials(materials);
            objLoader.setPath('obj/heart/');
            objLoader.load('heart.obj', 
                           
                           function (object) {
                               object.position.x = position.x;
                               object.position.y = 7;
                               object.position.z = position.z;
                               object.scale.y = 0.1;
                               object.scale.x = 0.1;
                               object.scale.z = 0.1;
                               object.castShadow = true;

                               heart.add(object);
                               
                           });
        });

        this.lookAt = vector;

        console.log('Position: x:' + position.x + ' z:' + position.z + ' Vector: ' + this.lookAt); 
        return heart;
    }
    
    scaleHeart(positive){
        var factor = positive? 0.01 : -0.01;
        this.heart.scale.y += factor;
        this.heart.scale.x += factor;
        this.heart.scale.z += factor;
    }
    
    animateHeart() {
        if(this.growMode) {
            this.count++;
            this.scaleHeart(true);
            if(this.count >= 50)
                this.growMode = false;
        } else {
            this.count--;
            this.scaleHeart(false);
            if(this.count <= 0)
                this.growMode = true;
        }

        // X component of lookAt vector
        this.heart.position.x += this.speed * this.lookAt[0];
        // Z component of lookAt vector
        this.heart.position.z += this.speed * this.lookAt[2];        
    }

    

}
