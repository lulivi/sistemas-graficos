
var PlayerInfo = function() {

    var playerLife = 100;

    var container = document.createElement('div');
    container.id = 'playerInfo';
    container.style.cssText = 'width:80px;'

    var playerLifeDiv = document.createElement('div');
    playerLifeDiv.id = 'playerLife';
    // playerLifeDiv.style.cssText = 'padding:0 0 3px 3px;text-align:left;'
    container.appendChild(playerLifeDiv)

    var playerLifeText = document.createElement('div');
    playerLifeText.id = 'playerLifeText';
    // playerLifeText.style.css =
    playerLifeText.innerHTML = '% Life';
    container.appendChild(playerLifeText);

    return {
        REVISION: 11,
        domElement: container,
        update: function (newPlayerLife){
            playerLife = newPlayerLife;
        }
    }
}
