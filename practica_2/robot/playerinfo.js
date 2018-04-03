
var PlayerInfo = function() {

    var playerScore = 0;

    var container = document.createElement('div');
    container.id = 'playerInfo';
    container.style.cssText = 'height: 130px; font-size: 100%; background-color: #FFE1F0; border-width: 1%; border-style: solid;border-color: #FF96CA; display: inline-block; padding: 10px'

    // Player Score
    var playerScoreDiv = document.createElement('div');
    playerScoreDiv.id = 'playerScoreDiv';
    playerScoreDiv.style.cssText = 'height: 20%; width: 80px;'
    container.appendChild(playerScoreDiv);

    var playerScoreValue = document.createElement('div');
    playerScoreValue.id = 'playerScoreValue';
    playerScoreValue.style.cssText = 'font-family: Monospace; display: inline-block'
    playerScoreDiv.appendChild(playerScoreValue)

    var playerScoreText = document.createElement('div');
    playerScoreText.id = 'playerScoreText';
    playerScoreText.style.cssText = 'font-size: 70%; padding-left: 3%; display: inline-block; margin-bottom: 0px; padding-bottom: 0px;'
    playerScoreText.innerHTML = 'puntos!'
    playerScoreDiv.appendChild(playerScoreText)

    // Energy bar
    // var playerEnergyText = document.createElement('div');
    // playerEnergyText.id = 'playerEnergyText';
    // playerEnergyText.style.cssText = 'transform: rotate(90deg); display: inline-block; left:0px';
    // playerEnergyText.innerHTML = 'Player Health';
    // container.appendChild(playerEnergyText);

    var playerEnergyBar = document.createElement('div');
    playerEnergyBar.id = 'playerEnergyBar';
    playerEnergyBar.style.cssText = 'height: 80%; width: 30px; background-color: #ddd; position:relative;'
    container.appendChild(playerEnergyBar)

    var playerEnergyPercentage = document.createElement('div');
    playerEnergyPercentage.id = 'playerEnergyPercentage';
    playerEnergyPercentage.style.cssText = 'width: 100%; height: 100%;' +
        'background-color: #4CAF50; display: inline-block; bottom:0; position: absolute; bottom:0; '
    playerEnergyBar.appendChild(playerEnergyPercentage);

    return {
        REVISION: 11,
        domElement: container,
        updateEnergy : function(newPlayerEnergy) {
            var color = null
            // var oldPlayerEnergy =
            if (newPlayerEnergy > 66) {
                color = '#4CAF50';
            } else if (33 < newPlayerEnergy && newPlayerEnergy < 66) {
                color = '#FFFF32';
            } else {
                color = '#FF3232';
            }
            playerEnergyPercentage.style.height = newPlayerEnergy + '%';
            playerEnergyPercentage.style.backgroundColor = color;
        },
        updateScore : function(newPlayerScore) {
            playerScoreValue.innerHTML = newPlayerScore;
        },
        update: function (newPlayerEnergy, newPlayerScore){
            this.updateEnergy(newPlayerEnergy);
            this.updateScore(newPlayerScore);
        }
    }
}
