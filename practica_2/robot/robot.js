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
    super()
    
    this.material = (parameters.material === undefined ? new THREE.MeshPhongMaterial({
      color: 0xd4af37,
      specular: 0xfbf804,
      shininess: 70
    }) : parameters.material)

    // **********
    // BODY PARTS
    // **********
    this.body = null
    this.head = null
    this.eye = null

    this.shoulderLeft = null
    this.shoulderRight = null
    this.footLeft = null
    this.footRight = null
    this.legLeft = null
    this.legRight = null

    // **************
    // BASIC MEASURES
    // **************

    // Body
    this.bodyHeight = (parameters.craneHeight === undefined ? 28 : parameters.robotBodyHeight)
    this.bodyRadius = (parameters.craneWidth === undefined ? 12 : parameters.robotBodyRadius)

    // Head
    this.headRadius = this.bodyRadius * 0.95
    this.eyeHeight = this.headRadius / 2
    this.eyeRadius = this.headRadius / 5

    // Legs
    this.legHeight = this.bodyHeight * 1.15
    this.legRadius = this.headRadius / 5
    this.legLeftPosition = this.bodyRadius + this.legRadius * 1.2
    this.legRightPosition = -(this.bodyRadius + this.legRadius * 1.2)

    // Feet
    this.footHeight = this.headRadius / 2
    this.footRadiusTop = this.legRadius * 1.2
    this.footRadiusBottom = this.footRadiusTop * 2

    // Shoulders
    this.shoulderWidth = this.footRadiusTop * 2
    this.shoulderHeight = this.footRadiusTop * 2
    this.shoulderDepth = this.footRadiusTop * 3

    // **************
    // MEASURE LIMITS
    // **************

    // Head turn
    this.headMaxTurnRight = 80 * Math.PI / 180
    this.headMaxTurnLeft = -80 * Math.PI / 180

    // Body swing
    this.bodyHeadMaxRotationForward = 30 * Math.PI / 180
    this.bodyHeadMaxRotationBackward = -45 * Math.PI / 180

    // Max leg lenght = 20% of normal leg lenght
    this.legMinHeight = this.bodyHeight
    this.legMaxHeight = this.legHeight + (this.legHeight * 20 / 100)

    // **************
    // MODEL CREATION
    // **************

    this.add(this.createBody())
    this.add(this.createFoot(this.legLeftPosition))
    this.add(this.createFoot(this.legRightPosition))
  }

  // ***************
  // PRIVATE MDETHODS
  // ***************

  createBody() {
    this.body = new THREE.Mesh(
      new THREE.CylinderGeometry(this.bodyRadius, this.bodyRadius, this.bodyHeight,
				 50),
      this.material
    )
    // Translate the body above the ground
    this.body.geometry.applyMatrix(new THREE.Matrix4().makeTranslation(0, this.bodyHeight /
								       2, 0))
    // Translate the body and it childs mid-head above the ground
    this.body.position.y = this.headRadius
    this.body.castShadow = true
    this.body.add(this.createHead())
    return this.body
  }

  createHead() {
    // SphereGeometry(radius : Float, widthSegments : Integer, heightSegments
    this.head = new THREE.Mesh(
      new THREE.SphereGeometry(this.headRadius, 32, 32),
      this.material
    )
    this.head.position.y = this.bodyHeight
    this.head.castShadow = true
    this.head.add(this.createEye())
    return this.head
  }

  createEye() {
    this.eye = new THREE.Mesh(
      new THREE.CylinderGeometry(this.eyeRadius, this.eyeRadius, this.eyeHeight,
				 50),
      this.material
    )
    this.eye.geometry.applyMatrix(new THREE.Matrix4().makeRotationZ(Math.PI / 2))
    this.eye.geometry.applyMatrix(new THREE.Matrix4().makeTranslation(this.headRadius *
								      0.9, 0, 0))
    this.eye.geometry.applyMatrix(new THREE.Matrix4().makeRotationZ(20 * Math.PI /
								    180))
    this.eye.castShadow = true
    return this.eye
  }

  createFoot(legPosition) {
    var foot = new THREE.Mesh(
      new THREE.CylinderGeometry(this.footRadiusTop, this.footRadiusBottom,
				 this.footHeight, 50),
      this.material
    )
    foot.geometry.applyMatrix(new THREE.Matrix4().makeTranslation(0, this.footHeight /
								  2, 0))
    foot.position.z = legPosition
    foot.castShadow = true
    foot.add(this.createLeg(legPosition))
    foot.add(this.createShoulder(legPosition))
    if (legPosition > 0) {
      this.footRight = foot
    } else {
      this.footLeft = foot
    }
    return foot
  }

  createLeg(legPosition) {
    var leg = new THREE.Mesh(
      new THREE.CylinderGeometry(this.legRadius, this.legRadius, this.legHeight,
				 50),
      this.material
    )
    leg.geometry.applyMatrix(new THREE.Matrix4().makeTranslation(0, this.legHeight /
								 2, 0))
    leg.castShadow = true
    if (legPosition > 0) {
      this.legRight = leg
    } else {
      this.legLeft = leg
    }
    return leg
  }

  createShoulder(legPosition) {
    var shoulder = new THREE.Mesh(
      new THREE.BoxGeometry(this.shoulderWidth, this.shoulderHeight, this.shoulderDepth),
      this.material
    )
    shoulder.geometry.applyMatrix(new THREE.Matrix4().makeTranslation(0, this.shoulderHeight /
								      2 + this.legHeight, 0))
    shoulder.castShadow = true
    if (legPosition > 0) {
      this.shoulderRight = shoulder
    } else {
      this.shoulderLeft = shoulder
    }
    return shoulder
  }

  setLegHeight(newLegHeight) {
    var requestedLegHeight = (1 + (newLegHeight / 100))

    if (requestedLegHeight >= 1 && requestedLegHeight <= 1.20) {
      this.legScaleFactor = requestedLegHeight
      this.legLeft.scale.y = this.legScaleFactor
      this.legRight.scale.y = this.legScaleFactor
      this.shoulderRight.position.y = this.legScaleFactor
      this.shoulderLeft.position.y = this.legScaleFactor
      this.updateBody(this.legMinHeight * this.legScaleFactor - this.legMinHeight)
    }
  }

  updateBody(height) {
    this.body.position.y = this.headRadius + height
    this.shoulderLeft.position.y = height
    this.shoulderRight.position.y = height
  }

  setHeadTwist(headTwist) {
    this.head.rotation.y = headTwist * Math.PI / 180
  }

}

// class variables
Robot.WORLD = 0
Robot.LOCAL = 1
