/// Several functions, including the main

/// The scene graph
scene = null;

/// The GUI information
GUIcontrols = null;

/// The object for the statistics
stats = null;

/// A boolean to know if the left button of the mouse is down
mouseDown = false;

pressedKey = null;

/// Player information GUI
playerInfo = null;

/// The current mode of the application
applicationMode = TheScene.NO_ACTION;

/// It creates the GUI and, optionally, adds statistic information
/**
 * @param withStats - A boolean to show the statictics or not
 */
function createGUI(withStats) {
    GUIcontrols = new function() {
        this.axis = false;
        this.lightIntensity = 0.3;
        this.robotLegScaleFactor = 0;
        this.robotHeadTwist = 0;
        this.robotBodySwing = 0;
    };

    var gui = new dat.GUI();
    var axisLights = gui.addFolder('Axis and Lights');
    axisLights.add(GUIcontrols, 'axis').name('Axis on/off :');
    axisLights.add(
        GUIcontrols, 'lightIntensity', 0, 1.0
    ).name('Light' +
           'intensity :');

    var robotControls = gui.addFolder('Robot Controls');
    robotControls.add(
        GUIcontrols, 'robotLegScaleFactor', 0.0, 20.0
    ).name('Robot leg height :');
    robotControls.add(
        GUIcontrols, 'robotHeadTwist', -80.0, 80.0
    ).name('Robot head twist :');
    robotControls.add(
        GUIcontrols, 'robotBodySwing',
        -45.0,30.0
    ).name('Robot body swing :');

    // The method  listen()  allows the height attribute to be written,
    // not only read

    if (withStats)
        stats = initStats();

    playerInfo = initPlayerInfo();
}

/// It adds statistics information to a previously created Div
/**
 * @return The statistics object
 */
function initStats() {

    var stats = new Stats();

    stats.setMode(0); // 0: fps, 1: ms

    // Align top-left
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.left = '0px';
    stats.domElement.style.top = '0px';

    $('#Stats-output').append(stats.domElement);

    return stats;
}

function initPlayerInfo() {
    var playerInfo = new PlayerInfo();

    playerInfo.domElement.style.position = 'absolute';
    playerInfo.domElement.style.left = '0px';
    playerInfo.domElement.style.top = '100px';

    $('#Player-info').append(playerInfo.domElement);

    return playerInfo;
}

/// It shows a feed-back message for the user
/**
 * @param str - The message
 */
function setMessage(str) {
    document.getElementById('Messages').innerHTML = '<h2>' + str +
        '</h2>';
}

/// It processes the clic-down of the mouse
/**
 * @param event - Mouse information
 */
function onMouseDown(event) {
    if (event.ctrlKey) {
        // The Trackballcontrol only works if Ctrl key is pressed
        scene.getCameraControls().enabled = true;
    } else {
        scene.getCameraControls().enabled = false;
        if (event.button === 0) { // Left button
            mouseDown = true;
            switch (applicationMode) {
            case TheScene.ADDING_BOXES:
                scene.addBox(event, TheScene.NEW_BOX);
                break;
            case TheScene.MOVING_BOXES:
                scene.moveBox(event, TheScene.SELECT_BOX);
                break;
            default:
                applicationMode = TheScene.NO_ACTION;
                break;
            }
        } else {
            setMessage('');
            applicationMode = TheScene.NO_ACTION;
        }
    }
}

/// It processes the drag of the mouse
/**
 * @param event - Mouse information
 */
function onMouseMove(event) {
    if (mouseDown) {
        switch (applicationMode) {
        case TheScene.ADDING_BOXES:
        case TheScene.MOVING_BOXES:
            scene.moveBox(event, TheScene.MOVE_BOX);
            break;
        default:
            applicationMode = TheScene.NO_ACTION;
            break;
        }
    }
}

/// It processes the clic-up of the mouse
/**
 * @param event - Mouse information
 */
function onMouseUp(event) {
    if (mouseDown) {
        switch (applicationMode) {
        case TheScene.ADDING_BOXES:
            scene.addBox(event, TheScene.END_ACTION);
            break;
        case TheScene.MOVING_BOXES:
            scene.moveBox(event, TheScene.END_ACTION);
            break;
        default:
            applicationMode = TheScene.NO_ACTION;
            break;
        }
        mouseDown = false;
    }
}

/// It processes the wheel rolling of the mouse
/**
 * @param event - Mouse information
 */
function onMouseWheel(event) {
    if (event.ctrlKey) {
        // The Trackballcontrol only works if Ctrl key is pressed
        scene.getCameraControls().enabled = true;
    } else {
        scene.getCameraControls().enabled = false;
        if (mouseDown) {
            switch (applicationMode) {
            case TheScene.MOVING_BOXES:
                scene.moveBox(event, TheScene.ROTATE_BOX);
                break;
            }
        }
    }
}

/// It processes the window size changes
function onWindowResize() {
    scene.setCameraAspect(window.innerWidth / window.innerHeight);
    renderer.setSize(window.innerWidth, window.innerHeight);
}

/// It creates and configures the WebGL renderer
/**
 * @return The renderer
 */
function createRenderer() {
    var renderer = new THREE.WebGLRenderer();
    renderer.setClearColor(new THREE.Color(0xEEEEEE), 1.0);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    return renderer;
}

/// It renders every frame
function render() {
    requestAnimationFrame(render);

    stats.update();
    playerInfo.update(scene.robot.energy, scene.robot.score);
    scene.getCameraControls().update();
    scene.animate(GUIcontrols);

    renderer.render(scene, scene.getCamera());

    if (pressedKey){
        (!scene.gameReset) ? scene.moveRobot(pressedKey) : scene.toggleReset();
    }
}

// Attempt to create key listener
function keyListener(e) {
    var key = e.keyCode ? e.keyCode : e.which;

    switch(key) {
    case String.charCodeAt('V'):
        scene.swapCamera();
        break;
    case String.charCodeAt(' '):
        scene.pauseGame();
        break;
    }
}

function keyUpListener(e) {
    var key = e.keyCode ? e.keyCode : e.which;

    switch(key) {
    case String.charCodeAt('W'):
    case String.charCodeAt('A'):
    case String.charCodeAt('S'):
    case String.charCodeAt('D'):
    case 37: // Left
    case 38: // Up
    case 39: // Right
    case 40: // Down
        scene.robot.movementCost();
    }
}

/**
 * @param event - mouse/keyboard event
 */
function onKeyDown(event){
    var key = event.keyCode ? event.keyCode : event.which;

    switch (key) {
    case String.charCodeAt('W'):
    case String.charCodeAt('A'):
    case String.charCodeAt('S'):
    case String.charCodeAt('D'):
    case 37: // Left
    case 38: // Up
    case 39: // Right
    case 40: // Down
        pressedKey = key;
    }
}

function onKeyUp(){
    pressedKey = null;
}

/// The main function
$(function() {
    // create a render and set the size
    renderer = createRenderer();
    // add the output of the renderer to the html element
    $('#WebGL-output').append(renderer.domElement);
    // liseners
    window.addEventListener('resize', onWindowResize);
    window.addEventListener(
        'mousemove', onMouseMove, true
    );
    window.addEventListener(
        'mousedown', onMouseDown, true
    );
    window.addEventListener(
        'mouseup', onMouseUp, true
    );
    window.addEventListener(
        'mousewheel', onMouseWheel, true
    ); // For
    // Chrome an others
    window.addEventListener(
        'DOMMouseScroll', onMouseWheel, true
    ); // For Firefox
    window.addEventListener(
        'keydown', onKeyDown, false
    ); // For Firefox
    window.addEventListener(
        'keyup', onKeyUp, false
    ); // For Firefox
    window.onkeydown = keyListener;
    window.onkeyup = keyUpListener;

    // create a scene, that will hold all our elements such as objects,
    // cameras and lights.
    scene = new TheScene(renderer.domElement);

    createGUI(true);

    render();
});
