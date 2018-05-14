'use strict';

class Projectile extends THREE.Object3D {
    constructor(){
        super();
        this.count = 0;
        this.heart = this.createHeart();
        this.growMode = true;
    }

    createHeart(){

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
                               object.position.y = 7;
                               object.scale.y = 0.1;
                               object.scale.x = 0.1;
                               object.scale.z = 0.1;
                               object.castShadow = true;

                               heart.add(object);
                               
                           });
        });

        
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
    }

    

}
