'use strict';

/// Several functions, including the main

/**
 * Scene graph
 */
var scene = null;

/**
 * The GUI information
 */
var GUIcontrols = null;

/**
 * The object for the statistics
 */
var stats = null;

/**
 *
 */
var ammoBarsArray = null;

/**
 * The pressed key
 */
var pressedKey = null;
/**
 * Currently pressed keys
 */
var pressedKeysArray = new Array();

/**
 * Player information GUI
 */
// var playerInfo = null;

/**
 * The current mode of the application
 */
// var gameMode = null;

/**
 * Renderer
 */
var renderer = null;

/**
 * Array of menus to show/hide them
 */
var menusArray = new Array();

/**
 * If the game is in pause
 */
var pause = false;

/**
* If we are in-game (pause menu, or the game itself)
*/
var inGame = false;

/**
 * If it is the irst time the function startGame is executed
 */
var firstTime = true;

/**
 * @enum
 */
const Menu = {
    MAIN: 0,
    MAIN_OPT: 1,
    INSTR: 2,
    PAUSE: 3,
    PAUSE_OPT: 4,
};

/**
 * Current visible menu
 */
var currentMenu = null;

/**
 * Last visible menu
 */
var previousMenu = null;

/**

 ######      ###    ##     ## ########
##    ##    ## ##   ###   ### ##
##         ##   ##  #### #### ##
##   #### ##     ## ## ### ## ######
##    ##  ######### ##     ## ##
##    ##  ##     ## ##     ## ##
 ######   ##     ## ##     ## ########

 ######   ######  ######## ##    ## ########
##    ## ##    ## ##       ###   ## ##
##       ##       ##       ####  ## ##
 ######  ##       ######   ## ## ## ######
      ## ##       ##       ##  #### ##
##    ## ##    ## ##       ##   ### ##
 ######   ######  ######## ##    ## ########

 #######  ######## ##     ## ######## ########
##     ##    ##    ##     ## ##       ##     ##
##     ##    ##    ##     ## ##       ##     ##
##     ##    ##    ######### ######   ########
##     ##    ##    ##     ## ##       ##   ##
##     ##    ##    ##     ## ##       ##    ##
 #######     ##    ##     ## ######## ##     ##

**/

function startGame(){
    if (firstTime) {
        firstTime = false;
        createGUI(true);
        render();
    } else {
        requestAnimationFrame(render);
    }
    toggleMenu(currentMenu);
    $('#Stats-output').show();
}

function restartScene() {
    scene = new TheScene(renderer.domElement);
    renderer.clear(false,true,true);
    $('#Stats-output').hide();
    toggleMenu(Menu.MAIN);
}

/**
 * It creates the GUI and, optionally, adds statistic information
 * @param withStats - A boolean to show the statictics or not
 */
function createGUI(withStats) {
    // GUIcontrols = new function() {
    //     this.axis = false;
    //     this.lightIntensity = 0.3;
    //     this.tankTurretRotation = 0;
    //     this.tankBarrelRotation = 0;
    //     this.hardMode = false;
    // };
    //
    // var gui = new dat.GUI();
    //
    // var gameControls = gui.addFolder('Game Controls');
    // gameControls.add(GUIcontrols, 'hardMode').name('Hard Mode: ');
    //
    // var tankControls = gui.addFolder('Tank Controls');
    // tankControls.add(
    //     GUIcontrols, 'tankTurretRotation', -180.0, 180.0
    // ).name('Turret Rotation :');
    //
    // var axisLights = gui.addFolder('Axis and Lights');
    // axisLights.add(GUIcontrols, 'axis').name('Axis on/off :');
    // axisLights.add(
    //     GUIcontrols, 'lightIntensity', 0, 1.0
    // ).name('Light intensity :');


    // The method  listen()  allows the height attribute to be written,
    // not only read

    if(withStats) {
        stats = initStats();
    }

    ammoBarsArray = initAmmoBars();
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

/**
 * Create the ammo bar(s)
 *
 * @param {Boolean} multiPlayer - True if the game is 1vs1
 * @return {Array.<AmmoBar>} - Ammo bars in use
 */
function initAmmoBars(multiPlayer = false){
    var ammoBarsArray = new Array();
    var ammoBar0 = new AmmoBar(0, 'red');

    $('#ammoBarsContainer')
        .addClass('w3-display-topmiddle')
        .append(ammoBar0.domElement);

    ammoBarsArray.push(ammoBar0);

    if(multiPlayer){
        var ammoBar1 = new AmmoBar(1, 'blue');
        $('#ammoBarsContainer')
            .append(ammoBar1.domElement);
        ammoBarsArray.push(ammoBar1);
    }

    return ammoBarsArray;
}

/**
 * It shows a feed-back message for the user
 * @param str - The message
 */
function setMessage(str) {
    $('#Messages').text('<h2>' + str + '</h2>');
}


/**

##     ## ######## ##    ## ##     ##  ######
###   ### ##       ###   ## ##     ## ##    ##
#### #### ##       ####  ## ##     ## ##
## ### ## ######   ## ## ## ##     ##  ######
##     ## ##       ##  #### ##     ##       ##
##     ## ##       ##   ### ##     ## ##    ##
##     ## ######## ##    ##  #######   ######

**/

/**
 * Manage menu changes (hide/show) and the consecuences of the changes
 *
 * @param {Menu} menuId - menusArray index
 */
function toggleMenu(menuId = Menu.MAIN) {
    // Hide current menu
    if (menuId === currentMenu) {
        // Hide current menu
        menusArray[menuId].hide();
        $('#fullScreenMenuContainer').hide();
        // Update current and previous menu vars
        previousMenu = currentMenu;
        currentMenu = null;
    // Show other menu and hide current one
    } else if (0 <= menuId || menuId < menusArray.length) {
        // If the current menu isn't null, hide it!
        if (currentMenu !== null)
            menusArray[currentMenu].hide();
        $('#fullScreenMenuContainer').show();
        // Show the new menu (menuId)
        menusArray[menuId].show();
        // Update current and previous menu vars
        previousMenu = currentMenu;
        currentMenu = menuId;
    }

    // If we come from the main menu, we are in game
    if (previousMenu === Menu.MAIN) {
        inGame = true;
        pause = false;
    }

    // If we are in the main menu, we are not in game
    if (currentMenu === Menu.MAIN) {
        inGame = false;
    }

    // If we came from pause menu and we are in game, restart rendering!
    if (previousMenu === Menu.PAUSE && currentMenu === null) {
        pause = false;
        requestAnimationFrame(render);
    }

    // If we are on pause menu and came from the game, it is paused
    if (currentMenu === Menu.PAUSE && previousMenu === null) {
        pause = true;
    }
}

/**
 * Create every menu in the game
 */
function createMenus(){
    // Get the div element which will contain the menus
    var fullScreenMenuContainer = $('#fullScreenMenuContainer')
        // Add basic classes for color and opacity
        .addClass('w3-container w3-opacity-min w3-black')
        // force full-screen and above every element in html
        .css({
            'height': '100vh',
            'width': '100vw',
            'position': 'fixed',
            'z-index': '10',
            'top': '0',
        }).hide();

    // Create the menus with each heading and buttons
    var menus = [
        {
            headingText: 'Tanks n\' Ducks',
            buttonsArray: [
                {text: '1 Jugador', func: 'startGame()'},
                {text: '1 vs 1', func: 'startGame()'},
                {text: 'Instrucciones', func: 'toggleMenu(Menu.INSTR)'},
                {text: 'Opciones', func: 'toggleMenu(Menu.MAIN_OPT)'},
            ],
        },
        {
            headingText: 'Opciones',
            buttonsArray: [
                {text: 'Velocidad', func: ''},
                {text: 'Nosequé', func: ''},
                {text: 'un puñao de cosas', func: ''},
                {text: 'pin pan pun', func: ''},
                {text: 'Atrás', func:'toggleMenu(previousMenu)'},
            ],
        },
        {
            headingText: 'Instrucciones',
            image: {
                src: './imgs/Instrucciones.png',
                title: 'Instrucciones',
                alt: 'Instrucciones',
            },
            buttonsArray: [
                {text: 'Atrás', func: 'toggleMenu(previousMenu)'},
            ],
        },
        {
            headingText: 'Pausa',
            buttonsArray: [
                {text: 'Reanudar', func:'toggleMenu(currentMenu)'},
                {text: 'Instrucciones', func: 'toggleMenu(Menu.INSTR)'},
                {text: 'Opciones rápidas', func: 'toggleMenu(Menu.PAUSE_OPT)'},
                {text: 'Menú principal', func:'restartScene()'},
            ],
        },
        {
            headingText: 'Opciones In-Game',
            buttonsArray: [
                {text: 'Velocidad', func: ''},
                {text: 'Nosequé', func: ''},
                {text: 'Atrás', func:'toggleMenu(previousMenu)'},
            ],
        },
    ];

    // For each menu, add it to the html
    menus.forEach(function(currMenuContents){
        // Menu itself
        var currMenu = $('<form>')
            .addClass(
                'menu w3-container w3-text-light-grey w3-center ' +
                'w3-display-middle w3-quarter'
            );
        fullScreenMenuContainer.append(currMenu);

        // Add a label with the current menu heading
        currMenu.append(
            $('<label>')
                .text(currMenuContents.headingText)
                .addClass(
                    'w3-xxlarge w3-margin-bottom w3-panel w3-block ' +
                    'w3-round-large w3-teal'
                )
        );

        if(currMenuContents.image !== undefined)
            currMenu.append(
                $('<img>')
                    .attr({
                        'src': currMenuContents.image.src,
                        'title': currMenuContents.image.title,
                        'alt': currMenuContents.image.alt,
                    }).width('100%')
                    .addClass('w3-margin-bottom w3-round-large')
            );

        // Add the buttons to de menu
        currMenuContents.buttonsArray.forEach(function(currButton){
            currMenu.append(
                $('<input>')
                    .attr({
                        'value': currButton.text,
                        'onmouseup':currButton.func,
                        'type': 'button'
                    }).addClass(
                        'w3-button w3-block w3-round-large w3-hover-teal'
                    )
            );
        });

        // Add the current menu to an array for future show/hide
        menusArray.push(currMenu.hide());
    });
}

/**

########  ######## ##    ## ########  ######## ########
##     ## ##       ###   ## ##     ## ##       ##     ##
##     ## ##       ####  ## ##     ## ##       ##     ##
########  ######   ## ## ## ##     ## ######   ########
##   ##   ##       ##  #### ##     ## ##       ##   ##
##    ##  ##       ##   ### ##     ## ##       ##    ##
##     ## ######## ##    ## ########  ######## ##     ##

**/

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

    // If we are in pause, dont request another animation frame
    if (pause)
        return;

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
}


/**

##       ####  ######  ######## ######## ##    ## ######## ########   ######
##        ##  ##    ##    ##    ##       ###   ## ##       ##     ## ##    ##
##        ##  ##          ##    ##       ####  ## ##       ##     ## ##
##        ##   ######     ##    ######   ## ## ## ######   ########   ######
##        ##        ##    ##    ##       ##  #### ##       ##   ##         ##
##        ##  ##    ##    ##    ##       ##   ### ##       ##    ##  ##    ##
######## ####  ######     ##    ######## ##    ## ######## ##     ##  ######

**/


/**
 * Key down listener
 * @param event - The key event
 */
function keyDownListener(event) {
    var key = (event.keyCode) ? event.keyCode : event.which;

    switch(key){
    case String('V').charCodeAt():
        scene.swapCamera();
        break;
    case 27: // Esc key
        if (inGame)
            toggleMenu(Menu.PAUSE);
    }
}

/**
 * Key up listener
 * @param event - The key event
 */
function keyUpListener(event) {
    var key = (event.keyCode) ? event.keyCode : event.which;

    if (inGame && !pause) {
        switch (key) {
        case String('W').charCodeAt():
        case String('A').charCodeAt():
        case String('S').charCodeAt():
        case String('D').charCodeAt():
        case String('Q').charCodeAt():
        case String('E').charCodeAt():
        case String(' ').charCodeAt():
        case 37: // Left arrow
        case 38: // Up arrow
        case 39: // Right arrow
        case 40: // Down arrow
            pressedKeysArray.splice(pressedKeysArray.indexOf(key),1);
        }
    }
}

/**
 * Runs code while a key is pressed
 * @param event - keyboard event
 */
function onKeyDown(event){
    var key = (event.keyCode) ? event.keyCode : event.which;

    if (inGame && !pause) {
        switch (key) {
        case String('W').charCodeAt():
        case String('A').charCodeAt():
        case String('S').charCodeAt():
        case String('D').charCodeAt():
        case String('Q').charCodeAt():
        case String('E').charCodeAt():
        case String(' ').charCodeAt():
        case 37: // Left arrow
        case 38: // Up arrow
        case 39: // Right arrow
        case 40: // Down arrow
            pressedKey = key;
            if(pressedKeysArray.indexOf(pressedKey) == -1) {
                pressedKeysArray.push(pressedKey);
            }
        }
    }
}

/**
 * Runs code while a key is released
 */
function onKeyUp(){
    pressedKey = null;
}

/**
 * It processes the clic-down of the mouse
 * @param event - Mouse information
 */
function onMouseDown(event) {
    if (inGame && !pause) {
        if (event.ctrlKey) {
            // The Trackballcontrol only works if Ctrl key is pressed
            scene.getCameraControls().enabled = true;
        } else {
            scene.getCameraControls().enabled = false;
        }
    }
}

/**
 * It processes the mouse wheel rotation
 * @param event - Mouse information
 */
function onMouseWheel(event) {
    if (inGame && !pause) {
        if (event.ctrlKey) {
            // The Trackballcontrol only works if Ctrl key is pressed
            scene.getCameraControls().enabled = true;
        } else {
            scene.getCameraControls().enabled = false;
        }
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

    createMenus();
    toggleMenu(Menu.MAIN);
});
