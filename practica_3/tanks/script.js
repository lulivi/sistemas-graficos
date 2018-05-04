'use strict';

/// Several functions, including the main

/// The scene graph
var scene = null;

/// The GUI information
var GUIcontrols = null;

/// The object for the statistics
var stats = null;

/// The pressed key
var pressedKey = null;

/// Player information GUI
var playerInfo = null;

/// The current mode of the application
var applicationMode = TheScene.NO_ACTION;

var renderer = null;

/**
 * It creates the GUI and, optionally, adds statistic information
 * @param withStats - A boolean to show the statictics or not
 */
function createGUI(withStats) {
    GUIcontrols = new function() {
        this.axis = false;
        this.lightIntensity = 0.3;
        this.tankTurretRotation = 0;
        this.tankBarrelRotation = 0;
        this.hardMode = false;
    };

    var gui = new dat.GUI();

    var gameControls = gui.addFolder('Game Controls');
    gameControls.add(GUIcontrols, 'hardMode').name('Hard Mode: ');

    var tankControls = gui.addFolder('Tank Controls');
    tankControls.add(
        GUIcontrols, 'tankTurretRotation', -180.0, 180.0
    ).name('Turret Rotation :');

    var axisLights = gui.addFolder('Axis and Lights');
    axisLights.add(GUIcontrols, 'axis').name('Axis on/off :');
    axisLights.add(
        GUIcontrols, 'lightIntensity', 0, 1.0
    ).name('Light intensity :');


    // The method  listen()  allows the height attribute to be written,
    // not only read

    if(withStats) {
        stats = initStats();
    }

    // playerInfo = initPlayerInfo();
}

/**
 * It adds statistics information to a previously created Div
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

/**
 * It shows a feed-back message for the user
 * @param str - The message
 */
function setMessage(str) {
    document.getElementById('Messages').innerHTML = '<h2>' + str +
        '</h2>';
}

/**
 * It processes the clic-down of the mouse
 * @param event - Mouse information
 */
function onMouseDown(event) {
    if (event.ctrlKey) {
        // The Trackballcontrol only works if Ctrl key is pressed
        scene.getCameraControls().enabled = true;
    } else {
        scene.getCameraControls().enabled = false;
    }
}

/**
 * It processes the mouse wheel rotation
 * @param event - Mouse information
 */
function onMouseWheel(event) {
    if (event.ctrlKey) {
        // The Trackballcontrol only works if Ctrl key is pressed
        scene.getCameraControls().enabled = true;
    } else {
        scene.getCameraControls().enabled = false;
    }
}

/**
 * It processes the window size changes
 */
function onWindowResize() {
    scene.setCameraAspect(window.innerWidth / window.innerHeight);
    renderer.setSize(window.innerWidth, window.innerHeight);
}

/**
 * It creates and configures the WebGL renderer
 * @return The renderer
 */
function createRenderer() {
    renderer = new THREE.WebGLRenderer();
    renderer.setClearColor(new THREE.Color(0xEEEEEE), 1.0);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    return renderer;
}

/**
 * It renders every frame
 */
function render() {
    requestAnimationFrame(render);

    stats.update();
    // playerInfo.update(scene.robot.energy, scene.robot.score);
    scene.getCameraControls().update();
    scene.animate(GUIcontrols);

    renderer.render(scene, scene.getCamera());

    if (scene.gameReset){
        scene.toggleReset();
        pressedKey = null;
    }

    if (pressedKey){
        scene.moveTank(pressedKey);
    }
}

/**
 * Key down listener
 * @param event - The key event
 */
function keyDownListener(event) {
    var key = (event.keyCode) ? event.keyCode : event.which;

    switch(key) {
    case String('V').charCodeAt():
        scene.swapCamera();
        break;
    case String(' ').charCodeAt():
        scene.pauseGame();
        break;
    }
}

/**
 * Key up listener
 * @param event - The key event
 */
function keyUpListener(event) {
    var key = (event.keyCode) ? event.keyCode : event.which;

    switch(key) {
    case String('W').charCodeAt():
    case String('A').charCodeAt():
    case String('S').charCodeAt():
    case String('D').charCodeAt():
    case 37: // Left arrow
    case 38: // Up arrow
    case 39: // Right arrow
    case 40: // Down arrow
        // scene.robot.movementCost();
    }
}

/**
 * Runs code while a key is pressed
 * @param event - keyboard event
 */
function onKeyDown(event){
    var key = (event.keyCode) ? event.keyCode : event.which;

    switch (key) {
    case String('W').charCodeAt():
    case String('A').charCodeAt():
    case String('S').charCodeAt():
    case String('D').charCodeAt():
    case 37: // Left arrow
    case 38: // Up arrow
    case 39: // Right arrow
    case 40: // Down arrow
        pressedKey = key;
    }
}

/**
 * Runs code while a key is released
 */
function onKeyUp(){
    pressedKey = null;
}

/**
 * The main function
 */
$(function() {
    // create a render and set the size
    renderer = createRenderer();
    // add the output of the renderer to the html element
    $('#WebGL-output').append(renderer.domElement);
    // liseners
    window.addEventListener('resize', onWindowResize);
    window.addEventListener(
        'mousedown', onMouseDown, true
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
    window.onkeydown = keyDownListener;
    window.onkeyup = keyUpListener;

    // create a scene, that will hold all our elements such as objects,
    // cameras and lights.
    scene = new TheScene(renderer.domElement);

    createGUI(true);

    render();
});
