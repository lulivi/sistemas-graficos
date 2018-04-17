
var PlayerInfo = function() {

    var container = document.createElement('div');
    container.id = 'playerInfo';
    container.style.cssText = 'height: 130px; font-size: 100%;' +
        'background-color: #FFE1F0; border-width: 1%; border-style:' +
        'solid;border-color: #FF96CA; display: inline-block; padding:' +
        '10px';

    // Player Score
    var playerScoreDiv = document.createElement('div');
    playerScoreDiv.id = 'playerScoreDiv';
    playerScoreDiv.style.cssText = 'height: 20%; width: 80px;';
    container.appendChild(playerScoreDiv);

    var playerScoreValue = document.createElement('div');
    playerScoreValue.id = 'playerScoreValue';
    playerScoreValue.style.cssText = 'font-family: Monospace;' +
        'display: inline-block';
    playerScoreDiv.appendChild(playerScoreValue);

    var playerScoreText = document.createElement('div');
    playerScoreText.id = 'playerScoreText';
    playerScoreText.style.cssText = 'font-size: 70%; padding-left:' +
    '3%; display: inline-block; margin-bottom: 0px; padding-bottom: 0px;';
    playerScoreText.innerHTML = 'points';
    playerScoreDiv.appendChild(playerScoreText);

    // Energy text
    var playerEnergyTextDiv = document.createElement('div');
    playerEnergyTextDiv.id = 'playerEnergyTextDiv';
    playerEnergyTextDiv.style.cssText ='height: 20%; top: 20%; width: 80px';
    container.appendChild(playerEnergyTextDiv);

    var playerEnergyValue = document.createElement('div');
    playerEnergyValue.id = 'playerEnergyValue';
    playerEnergyValue.style.cssText = 'font-family: Monospace;' +
        'display: inline-block';
    playerEnergyTextDiv.appendChild(playerEnergyValue);

    var playerEnergyText = document.createElement('div');
    playerEnergyText.id = 'playerEnergyText';
    playerEnergyText.style.cssText = 'font-size: 70%; padding-left:' +
    '3%; display: inline-block; margin-bottom: 0px; padding-bottom: 0px;';
    playerEnergyText.innerHTML = '% Energy';
    playerEnergyTextDiv.appendChild(playerEnergyText);

    // Energy bar
    var playerEnergyDiv = document.createElement('div');
    playerEnergyDiv.id = 'playerEnergyDiv';
    playerEnergyDiv.style.cssText ='height: 60%; bottom: 0;';
    container.appendChild(playerEnergyDiv);

    var playerEnergyBar = document.createElement('div');
    playerEnergyBar.id = 'playerEnergyBar';
    playerEnergyBar.style.cssText = 'height: 100%; width: 30px;' +
        'background-color: #ddd; position:relative;';
    playerEnergyDiv.appendChild(playerEnergyBar);

    var playerEnergyPercentage = document.createElement('div');
    playerEnergyPercentage.id = 'playerEnergyPercentage';
    playerEnergyPercentage.style.cssText = 'width: 100%; height: 100%;' +
        'background-color: #4CAF50; display: inline-block; bottom:0;' +
        'position: absolute; bottom:0;';
    playerEnergyBar.appendChild(playerEnergyPercentage);

    var energyPercentageColor = function (energyPercentage) {
        var color = null;
        if (energyPercentage > 66) {
            color = '#4CAF50'; // Green
        } else if (33 < energyPercentage && energyPercentage <= 66) {
            color = '#FFFF32'; // Yellow
        } else {
            color = '#FF3232'; // Red
        }
        return color;
    };

    return {
        REVISION: 11,
        domElement: container,
        updateEnergy : function(newPlayerEnergy) {
            var currentEnergy = parseInt(playerEnergyPercentage.style.height);
            var energyDecreasing = (currentEnergy > newPlayerEnergy);

            playerEnergyValue.innerHTML = currentEnergy;

            if (energyDecreasing){
                playerEnergyValue.style.color = '#FF0000';
                playerEnergyPercentage.style.backgroundColor =
                    '#FF0000';
            } else if (currentEnergy < newPlayerEnergy) {
                playerEnergyValue.style.color = '#00FF00';
                playerEnergyPercentage.style.backgroundColor =
                    '#00FF00';
            }

            var id = setInterval(frame, 10);
            function frame() {
                if (currentEnergy == newPlayerEnergy) {
                    clearInterval(id);
                    playerEnergyValue.style.color = '';
                    playerEnergyPercentage.style.backgroundColor =
                        energyPercentageColor(currentEnergy);
                } else {
                    (energyDecreasing) ? --currentEnergy : ++currentEnergy;
                    playerEnergyPercentage.style.height = currentEnergy + '%';
                    playerEnergyValue.innerHTML = currentEnergy;
                }
            }
        },
        updateScore : function(newPlayerScore) {
            playerScoreValue.innerHTML = newPlayerScore;
        },
        update: function (newPlayerEnergy, newPlayerScore){
            this.updateEnergy(newPlayerEnergy);
            this.updateScore(newPlayerScore);
        }
    };
};
