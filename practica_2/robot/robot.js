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
  constructor (parameters) {
    super()

    this.material = (parameters.material === undefined
      ? new THREE.MeshPhongMaterial({
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
    this.bodyHeight = (parameters.craneHeight === undefined ? 40 : parameters.robotBodyHeight)
    this.bodyRadius = (parameters.craneWidth === undefined ? 10 : parameters.robotBodyRadius)

    // Head
    this.headRadius = this.bodyRadius * 9 / 10
    this.eyeHeight = this.headRadius / 2
    this.eyeRadius = this.headRadius / 5

    // Legs
    this.legsHeight = this.bodyHeight
    this.legsRadius = this.headRadius / 5
    this.legLeftPosition = this.bodyRadius + (0.9 * this.bodyRadius) + this.legsRadius
    this.legRightPosition = -(this.bodyRadius + (0.9 * this.bodyRadius) + this.legsRadius)

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
    this.legsMinHeight = this.bodyHeight
    this.legsMaxHeight = this.legsHeight + (this.legsHeight * 20 / 100)

    // **************
    // MODEL CREATION
    // **************

    this.add(this.createBody())
    // this.add(this.createLeg(this.legLeftPosition))
    // this.add(this.createLeg(this.legRightPosition))
  }

  // ***************
  // PRIVATE MDETHODS
  // ***************

  createBody () {
    this.body = new THREE.Mesh(
      new THREE.CylinderGeometry(this.bodyRadius, this.bodyRadius, this.bodyHeight, 50),
      this.material
    )
    // Translate the body above the ground
    this.body.geometry.applyMatrix(new THREE.Matrix4().makeTranslation(0, this.bodyHeight / 2, 0))
    // Translate the body and it childs mid-head above the ground
    this.body.position.y = this.headRadius
    this.body.castShadow = true
    this.body.add(this.createHead())
    return this.body
  }

  createHead () {
    // SphereGeometry(radius : Float, widthSegments : Integer, heightSegments
    this.head = new THREE.Mesh(
      new THREE.SphereGeometry(this.headRadius, 32, 32),
      this.material
    )
    this.head.position.y = this.bodyHeight
    this.head.rotation.z = 20 * Math.PI / 180
    this.head.castShadow = true
    this.head.add(this.createEye())
    return this.head
  }

  createEye () {
    this.eye = new THREE.Mesh(
      new THREE.CylinderGeometry(this.eyeRadius, this.eyeRadius, this.eyeHeight, 50),
      this.material
    )
    this.eye.geometry.applyMatrix(new THREE.Matrix4().makeRotationZ(Math.PI / 2))
    this.eye.position.x = this.headRadius
    this.eye.castShadow = true
    return this.eye
  }

  createFoot (legPosition) {

  }

  createLeg (legPosition) {

  }

  createShoulder (legPosition) {

  }

  /// It sets the angle of the jib
  /**
   * @param anAngle - The angle of the jib
   */
  setJib (anAngle) {
    this.angle = anAngle
    this.jib.rotation.y = this.angle
    if (this.feedBack.visible) {
      this.feedBack.update()
    }
  }

  /// It sets the distance of the trolley from the mast
  /**
   * @param aDistance - The distance of the trolley from the mast
   */
  setTrolley (aDistance) {
    if (this.distanceMin <= aDistance && aDistance <= this.distanceMax) {
      this.distance = aDistance
      this.trolley.position.x = this.distance
    }
  }

  /// It sets the distance of the hook from the bottom of the base
  /**
   * @param aHeight - The distance of the hook from the bottom of the base
   */
  setHook (aHeight) {
    if (this.heightMin <= aHeight && aHeight <= this.heightMax) {
      this.height = aHeight
      this.stringLength = this.computeStringLength()
      this.string.scale.y = this.stringLength
      this.hook.position.y = -this.stringLength
    }
  }

  /// It makes the crane feedback visible or not
  /**
   * @param onOff - Visibility (true or false)
   */
  setFeedBack (onOff) {
    this.feedBack.visible = onOff
  }

  /// It sets the hook according to
  /**
   * @param anAngle - The angle of the jib
   * @param aDistance - The distance of the trolley from the mast
   * @param aHeight - The distance of the hook from the bottom of the base
   */
  setHookPosition (anAngle, aDistance, aHeight) {
    this.setJib(anAngle)
    this.setTrolley(aDistance)
    this.setHook(aHeight)
  }

  /// It returns the position of the hook
  /**
   * @param world - Whether the returned position is referenced to the World Coordinates System (Robot.WORLD) or is referenced to the crane position (Robot.LOCAL)
   * @return A Vector3 with the asked position
   */
  getHookPosition (world) {
    if (world === undefined) {
      world = Robot.WORLD
    }
    var hookPosition = new THREE.Vector3()
    hookPosition.setFromMatrixPosition(this.hook.matrixWorld)
    hookPosition.y -= this.baseHookHeight
    if (world === Robot.LOCAL) {
      var cranePosition = new THREE.Vector3()
      cranePosition.setFromMatrixPosition(this.matrixWorld)
      hookPosition.sub(cranePosition)
    }
    return hookPosition
  }

  /// The crane takes a box
  /**
   * @param aBox - The box to be taken
   * @return The new height of the hook, on the top of the box. Zero if no box is taken
   */
  takeBox (aBox) {
    if (this.box === null) {
      this.setFeedBack(true)
      this.box = aBox
      var newHeight = this.box.position.y + this.box.geometry.parameters
        .height
      this.heightMin = this.box.geometry.parameters.height
      this.box.position.x = 0
      this.box.position.y = -this.box.geometry.parameters.height -
        this.baseHookHeight
      this.box.position.z = 0
      this.box.rotation.y -= this.jib.rotation.y
      this.hook.add(this.box)
      return newHeight
    }
    return 0
  }

  /// The crane drops its taken box
  /**
   * @return The dropped box, or null if no box is dropped.
   */
  dropBox () {
    if (this.box !== null) {
      this.setFeedBack(false)
      var theBox = this.box
      this.hook.remove(this.box)
      this.box = null
      theBox.rotation.y += this.jib.rotation.y
      this.heightMin = 0
      return theBox
    } else {
      return null
    }
  }
}

// class variables
Robot.WORLD = 0
Robot.LOCAL = 1
