'use strict';

class Projectile extends THREE.Object3D {
    constructor(parameters){
        super();
        this.count = 0;
        this.lookAt = [0,0,0];
        this.heart = this.createHeart(
            parameters.position,
            parameters.rotation,
            parameters.vector
        );
        this.heartRadius = 5;
        this.growMode = true;
        this.speed = 2;
        this.explodeCount = 0;
        this.hit = false;
        this.playerId = parameters.playerId;
        
    }

    /**
     * Creates heart 
     * @param {{x: Number, z: Number}} position - position.x
     * and position.z of the heart
     * @param {y: Number} rotation - y rotation of the heart
     * @param {Array.<Number>} vector - the lookAt of the heart
     */
    createHeart(position, rotation, vector){
        for(var i = 0; i < 3; i++)
            this.lookAt[i] = vector[i];
        
        var heart = new THREE.Object3D();
        heart.rotation.y = rotation.y + Math.PI * 90 / 180;
        heart.position.x = position.x;
        heart.position.y = 7;
        heart.position.z = position.z;
        
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

                               
                               object.scale.y = 0.1;
                               object.scale.x = 0.1;
                               object.scale.z = 0.1;
                               object.castShadow = true;

                               heart.add(object);
                           });
        });
        return heart;
    }

    /**
     * Scale heart's size
     * @param {Bool} positive - heart will grow or shrink
     */
    scaleHeart(positive){
        var factor = positive? 0.01 : -0.01;
        this.heart.scale.y += factor;
        this.heart.scale.x += factor;
        this.heart.scale.z += factor;
    }

    /**
     * Animates heart beating
     */
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

    /**
     * Returns if the bullet is out of the field
     * @param {Number} groundLenght - Field limits
     */ 
    isOutOfRange(groundLength) {
        var xPos = this.heart.getWorldPosition().x;
        var zPos = this.heart.getWorldPosition().z;
        return !(groundLength/2 > xPos && -groundLength/2 < xPos
                && groundLength/2 > zPos && -groundLength/2 < zPos);
    }

    /**
     * Checks if the heart is colliding with any duck
     * @param {Array.<Duck>} ducks - Array of ducks in the scene
     */
    checkCollision(ducks) {

        // for each duck do:
        var bullet = this.heart.getWorldPosition();
        var duck = ducks.collider.getWorldPosition();
        return bullet.distanceTo(duck) <
            ducks.colliderRadius + this.heartRadius;
    }

    /**
     * Explode animation
     */
    explode() {
        this.explodeCount++;
        var factor = 0.3;
        this.heart.scale.y += factor;
        this.heart.scale.x += factor;
        this.heart.scale.z += factor;
        return this.explodeCount;
    }
    

}
