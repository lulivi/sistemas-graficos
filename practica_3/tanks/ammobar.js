/**
 * Create a ammoBar to display player ammo
 */
var AmmoBar = function(id = 1, ammoColor = 'red') {
    // Current ammo count
    var currentAmmo = 20;

    // To queue new updates and don't
    var updateQueue = [];

    // Check if the function changeAmmo is executing
    var updatingAmmo = false;

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

    bar.append(
        $('<div>')
            .append('Friends made: ')
            .append(
                $('<div>')
                    .attr('id', 'Player' + barId + 'FriendsCount')
                    .css('display', 'inline')
                    .addClass('w3-cell-middle')
                    .text('0')
            )
    );

    /**
     * Toggle between grey and the real color of the heart
     *
     * @param {Number} heartIdx - Index of the heart to toggle color
     */
    var toggleHeart = function(heartIdx) {
        return $('#' + barId)
            .children('i')
            .eq(heartIdx)
            .toggleClass('w3-text-dark-gray');
    };

    /**
     * Animate the change of the current ammo
     *
     * @param {Number} lastCurrentAmmo - currentAmmo value when the function
     * were queued
     * @param {Number} newAmmo - New value of ammo
     */
    var changeAmmo = function(lastCurrentAmmo, newAmmo) {
        updatingAmmo = true;
        return new Promise((resolve, reject) => {
            var ammoDecreasing = null;
            // Set the correct action (decrease/increase) and change the
            // colours regarding the action
            if (lastCurrentAmmo > newAmmo) {
                ammoDecreasing = true;
                // Remove the basic grey color and add the new red-decreassing
                // color
                $('#' + barId)
                    .toggleClass('w3-pale-red w3-light-grey');
            } else {
                ammoDecreasing = false;
                // Remove the basic grey color and add the new
                // green-increassing color
                $('#' + barId)
                    .toggleClass('w3-pale-green w3-light-grey');
            }

            // Create an interval to animate the ammo change
            var interval = setInterval(frame, 100);
            function frame() {
                if (lastCurrentAmmo == newAmmo) {
                    // End of the interval
                    clearInterval(interval);
                    // Clear green and red colours and
                    // add basic grey one
                    $('#' + barId)
                        .removeClass('w3-pale-green w3-pale-red')
                        .addClass('w3-light-grey');
                    // Finish the promise
                    resolve();
                } else {
                    if (ammoDecreasing) {
                        --lastCurrentAmmo;
                        toggleHeart(lastCurrentAmmo);
                    } else {
                        toggleHeart(lastCurrentAmmo);
                        ++lastCurrentAmmo;
                    }
                }
            }
        });
    };

    /**
     * Create a promise to turn updatingAmmo off after the changeAmmo function
     * execution
     *
     * @param {Number} lastCurrentAmmo - CurrentAmmo value when the function
     * were queued
     * @param {Number} newAmmo - New value of ammo
     */
    var promiseChangeAmmo = function(lastCurrentAmmo, newAmmo) {
        changeAmmo(lastCurrentAmmo, newAmmo).then(function(){
            updatingAmmo = false;
        });
    };

    /**
     * Function wrapping code.
     *
     * @param {Object} fn - Reference to a function for queuing
     * @param {context} context - Function context
     * @param {Array<Object>} params - Array of parameters to pass the function
     */
    var wrapFunction = function(fn, context, params) {
        return function() {
            fn.apply(context, params);
        };
    };

    /**
     * Queue a new update.
     *
     * @param {Number} lastCurrentAmmo - CurrentAmmo value when the function
     * were queued
     * @param {Number} newAmmo - New value of ammo
     */
    var queueAmmoUpdate = function(lastCurrentAmmo, newAmmo) {
        updateQueue.push(
            wrapFunction(promiseChangeAmmo, this, [lastCurrentAmmo, newAmmo])
        );
    };

    return {
        id: barId,
        getVars: function() {
            return {
                currentAmmo: currentAmmo,
                updatingAmmo: updatingAmmo,
                updateQueue: updateQueue,
            };
        },
        color: ammoColor,
        domElement: bar,
        updateAmmo: function(newAmmo, friendsCount) {
            // Execute one ammo update of the queue
            if (!updatingAmmo && updateQueue.length > 0)
                (updateQueue.shift())();
            // Queue a new ammo update
            if (0 <= newAmmo && newAmmo <= 20 && newAmmo != currentAmmo) {
                // Queue a new update with currentAmmo and the newAmmo
                queueAmmoUpdate(currentAmmo, newAmmo);
                // Change the currentAmmo var for futures updates
                currentAmmo = newAmmo;
            }
            // Friends count
            $('#Player' + barId + 'FriendsCount').text(friendsCount);
        },
    };
};
