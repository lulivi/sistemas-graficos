/**
 * Create a ammoBar to display player ammo
 */
var AmmoBar = function(id = 0, ammoColor = 'red') {
    // Current ammo count
    var currentAmmo = 20;

    // Bar id
    var barId = 'ammoBar' + id;

    // Create the bar div
    var bar = $('<div>')
        .attr('id', barId)
        .addClass('w3-card w3-round-xlarge w3-light-grey w3-padding ' +
            'w3-center w3-cell-middle w3-margin w3-text-' + ammoColor);

    bar.append('Player ' + id + ' ');

    // Insert 20 hearts in the bar
    for (var i = 0; i < 20; ++i)
        bar.append(
            $('<i>').addClass('w3-cell-middle fas fa-heart')
        ).append(' ');

    var toggleHeart = function(heartIdx) {
        return $('#' + barId)
            .children('i')
            .eq(heartIdx)
            .toggleClass('w3-text-dark-gray');
    };

    // Function to animate increment/decrement of the current ammo
    var changeAmmo = function(newAmmo) {
        var ammoDecreasing = null;

        // Set the correct action (decrease/increase) and change the colours
        // regarding the action
        if (currentAmmo > newAmmo) {
            ammoDecreasing = true;
            $('#' + barId)
                .toggleClass('w3-pale-red w3-light-grey');
        } else {
            ammoDecreasing = false;
            $('#' + barId)
                .toggleClass('w3-pale-green w3-light-grey');
        }

        // Create an interval to animate the ammo change
        var interval = setInterval(frame, 100);
        function frame() {
            if (currentAmmo == newAmmo) {
                clearInterval(interval);
                // End of the interval. Clear green and red colours and toggle
                // basic grey one
                $('#' + barId)
                    .removeClass('w3-pale-green w3-pale-red')
                    .toggleClass('w3-light-grey');
            } else {
                if (ammoDecreasing) {
                    --currentAmmo;
                    toggleHeart(currentAmmo);
                } else {
                    toggleHeart(currentAmmo);
                    ++currentAmmo;
                }
            }
        }
    };

    return {
        id: barId,
        currentAmmo: currentAmmo,
        color: ammoColor,
        domElement: bar,
        updateAmmo: function(ammoDiff = 0) {
            var newAmmo = currentAmmo + ammoDiff;
            if (0 <= newAmmo && newAmmo <= 20)
                changeAmmo(newAmmo);
        },
    };
};
