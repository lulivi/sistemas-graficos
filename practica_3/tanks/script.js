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
 * True if stats on screen
 */
var showStats = true;

/**
 * Array of ammo bars
 */
var ammoBarsArray = null;

/**
 * Currently pressed keys
 */
var pressedKeysArray = [];

/**
 * Renderer
 */
var renderer = null;

/**
 * Array of menus to show/hide them
 */
var menusArray = [];

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
 * The game speed factor
 */
var gameSpeedFactor = 1;

/**
 * @enum
 */
const Menu = {
    MAIN: 0,
    OPTIONS: 1,
    INSTRUCTIONS: 2,
    PAUSE: 3,
    MAP_SELECTOR: 4,
    END_SCREEN: 5,
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


/**
 * Update music option text value
 */
function updateMusicOption() {
    var currText = 'Música';
    var currValue = (scene.musicOn ? 'ON': 'OFF');
    $('#optMusic').attr('value', currText + ' (' + currValue + ')');
}

/**
 * Update effects option text value
 */
function updateEffectsOption() {
    var currText = 'Efectos';
    var currValue = (scene.effectsOn() ? 'ON': 'OFF');
    $('#optEffects').attr('value', currText + ' (' + currValue + ')');
}

/**
 * Update speed option text value
 */
function updateSpeedOption() {
    var currText = 'Velocidad';
    var currValue = gameSpeedFactor;
    $('#optSpeed').attr('value', currText + ' (' + currValue + ')');
}

/**
 * Update stats option text value
 */
function updateStatsOption() {
    var currText = 'Información';
    var currValue = (showStats ? 'ON': 'OFF');
    $('#optStats').attr('value', currText + ' (' + currValue + ')');
}

/**
 * Update every option text value
 */
function updateAllOptions() {
    updateMusicOption();
    updateEffectsOption();
    updateSpeedOption();
    updateStatsOption();
}

/**
 * Toggle music ON/OFF
 */
function toggleMusic() {
    scene.toggleMusic();
    updateMusicOption();
}

/**
 * Toggle effects ON/OFF
 */
function toggleEffects() {
    scene.toggleEffects();
    updateEffectsOption();
}

/**
 * Rotate game speed factor
 */
function changeSpeed() {
    gameSpeedFactor = (gameSpeedFactor % 3) + 1;
    updateSpeedOption();
}

/**
 * Toggle stats ON/OFF
 */
function toggleStats() {
    showStats = !showStats;
    $('#statsOutput').toggle();
    updateStatsOption();
}

function startGame(mapName = 'galaxy'){
    if (firstTime) {
        firstTime = false;
        createGUI(true);
        render();
    } else {
        requestAnimationFrame(render);
    }
    scene.stopTheme();
    scene.createBackground(mapName);
    toggleMenu(currentMenu);
    if (showStats)
        $('#statsOutput').show();
    $('#ammoBarsContainer').show();
}

function restartScene() {
    scene.stopMusic();
    scene = new TheScene(renderer.domElement);
    renderer.clear(false,true,true);
    $('#statsOutput').hide();
    $('#ammoBarsContainer').hide();
    toggleMenu(Menu.MAIN);
}

/**
 * It creates the GUI and, optionally, adds statistic information
 * @param withStats - A boolean to show the statictics or not
 */
function createGUI(withStats) {

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

    $('#statsOutput').append(stats.domElement);

    return stats;
}

/**
 * Create the ammo bar(s)
 *
 * @param {Boolean} multiPlayer - True if the game is 1vs1
 * @return {Array.<AmmoBar>} - Ammo bars in use
 */
function initAmmoBars(multiPlayer = false){
    var ammoBarsArray = [];
    var ammoBar0 = new AmmoBar(1, 'red');

    $('#ammoBarsContainer')
        .addClass('w3-display-topmiddle')
        .append(ammoBar0.domElement);

    ammoBarsArray.push(ammoBar0);

    if(multiPlayer){
        var ammoBar1 = new AmmoBar(2, 'blue');
        $('#ammoBarsContainer')
            .append(ammoBar1.domElement);
        ammoBarsArray.push(ammoBar1);
    }

    return ammoBarsArray;
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

    if (currentMenu === Menu.OPTIONS)
        updateAllOptions();

    // If we come from the main menu, we are in game
    if (previousMenu === Menu.MAP_SELECTOR) {
        inGame = true;
        pause = false;
    }

    // If we are in the main menu, we are not in game
    if (currentMenu === Menu.MAIN) {
        inGame = false;
        pause = false;
    }

    // If we came from pause menu and we are in game, restart rendering!
    if (previousMenu === Menu.PAUSE && currentMenu === null) {
        pause = false;
        requestAnimationFrame(render);
    }

    // If we are on pause menu and came from the game, it is paused
    if ((currentMenu === Menu.PAUSE || currentMenu === Menu.END_SCREEN) &&
            previousMenu === null) {
        pressedKeysArray = [];
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
        .addClass('w3-container w3-black')
        // force full-screen and above every element in html
        .css({
            'height': '100vh',
            'width': '100vw',
            'position': 'fixed',
            'z-index': '10',
            'top': '0',
            'opacity': '0.85'
        }).hide();

    // Create the menus with each heading and buttons
    var menus = [
        {
            headingText: 'Tanks n\' Ducks',
            buttonsArray: [
                {text: '1 Jugador', func: 'toggleMenu(Menu.MAP_SELECTOR)'},
                {text: '1 vs 1', func: 'alert(\'Comming soon...\')'},
                {text: 'Instrucciones', func: 'toggleMenu(Menu.INSTRUCTIONS)'},
                {text: 'Opciones', func: 'toggleMenu(Menu.OPTIONS)'},
            ],
        },
        {
            headingText: 'Opciones',
            buttonsArray: [
                {
                    text: 'Música (ON)',
                    func: 'toggleMusic()',
                    id: 'optMusic'
                },
                {
                    text: 'Efectos (ON)',
                    func: 'toggleEffects()',
                    id: 'optEffects'
                },
                {
                    text: 'Velocidad (1)',
                    func: 'changeSpeed()',
                    id: 'optSpeed'
                },
                {
                    text: 'Información (ON)',
                    func: 'toggleStats()',
                    id: 'optStats'
                },
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
                {text: 'Instrucciones', func: 'toggleMenu(Menu.INSTRUCTIONS)'},
                {text: 'Opciones', func: 'toggleMenu(Menu.OPTIONS)'},
                {text: 'Menú principal', func:'restartScene()'},
            ],
        },
        {
            headingText: 'Selección de mapas',
            buttonsArray: [
                {text: 'Universo', func:'startGame(\'galaxy\')'},
                {text: 'Parque', func: 'startGame(\'park\')'},
                {text: 'Atrás', func:'toggleMenu(previousMenu)'},
            ],
        },
        {
            headingText: 'Fin del juego',
            image: {
                src: './imgs/see_you_later.png',
                title: 'See you later',
                alt: 'See you later',
            },
            buttonsArray: [
                {text: 'Menú principal', func:'restartScene()'},
            ]
        }
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
                        'id': (currButton.id === undefined? '': currButton.id),
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

    if (showStats)
        stats.update();

    scene.getCameraControls().update();
    scene.animate();

    renderer.render(scene, scene.getCamera());
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
        if (inGame || pause)
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
            if(pressedKeysArray.indexOf(key) == -1) {
                pressedKeysArray.push(key);
            }
        }
    }
}

/**
 * Runs code while a key is released
 */
function onKeyUp(){
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
            // The Trackballcontrol only works if Ctrl key isn't pressed
            scene.getCameraControls().enabled = false;
        } else {
            scene.getCameraControls().enabled = true;
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
    $('#webGLOutput').append(renderer.domElement);

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
