/**
 * Single component template code
 */

/**
 * Helpers
 *
 * Establish {{variables}} for use in the component.html template
 */
Template.component.helpers({

    // Expose the steps collection in the component template
    steps: function() {
         // Sort steps by order
        return Steps.find({}, {sort: {order: 1}});
    },

    // Expose Meteor session variables to enable reactive template changes
    // when the session changes.
    //
    // Allows us to switch languages and highlighted steps.
    currentLanguage: function() {
        return Session.get('currentLanguage');
    },
    currentOrder: function () {
        return Session.get('currentOrder');
    },
    currentOrderPad: function () {
        var currentOrder = Session.get('currentOrder');
        return _s.lpad(currentOrder, 4, '0');
    },
    maxOrder: function () {
        return maxOrder();
    },
    newStepOrder: function () {
        return (maxOrder() + 1);
    },

    // Auto Form helper to prompt before deleting items
    beforeRemove: function () {
        return function (collection, id) {
            var doc = collection.findOne(id);
            if (confirm('Really delete ' + doc.title + '?')) {
                this.remove();
            }
        };
    },

    // Dev mouse position helper
    mouseCoord: function () {
        return Session.get('mouseCoord');
    }
});

Template.step.helpers({
    timerValue: function() {
        return Math.ceil(Session.get('timerValue'));
    }

});

/**
 * Rendered
 *
 * Actions to complete when the component page is first loaded
 */
Template.component.rendered = function () {

    /**
     * Set the a session value to track the currentOrder based on the URL
     *
     * If there is no step hash in the URL, you're on the homepage. Set the
     * session variable to 0.
     */
    var path = Router.current().location.get().originalUrl;
    var uri = new URI(path);
    var hash = uri.hash();
    if (hash) {
        Session.set('currentOrder', _s.toNumber(_s.strRight(hash, '-')));
    }
    else {
        Session.set('currentOrder', 0);
    }

    /**
     * Setup page content based on the currentOrder
     */
    var currentOrder = Session.get('currentOrder');
    var nextOrder = (currentOrder + 1);
    devTrackStep('render', currentOrder, nextOrder);
    Meteor.setTimeout(function(){

        // On the homepage, all we need to do is play the intro audio
        if (currentOrder===0) {
            playMedia('audio', 'bodyAudio');
        }

        // On interior pages, we play the video, audio, and animate in steps
        else {

            // Show everything to start.
            // This allows us to get all of the DOM info
            $('div.step-container div').show();

            // Display a selection of steps, from the previous pager to the
            // current step. If there is no previous pager, set the start
            // value to 1.

            // Build array of pagers
            var prevPager = [0];
            $('div[data-pager=true]').each(function() {
                prevPager.push($(this).data('order'));
            });
            // Sort it numerically
            prevPager = prevPager.sort(sortNumber);

            // Filter array to only show orders below or equal to current order
            prevPager = prevPager.filter(function (element) {
                return element <= currentOrder;
            });

            // Hide everything and reset the style to the offscreen default
            var range = _.range(0, _.last(prevPager));
            _.each(range, function(i) {
                $('div[data-order=' + i + '] div').
                    hide().
                    removeClass().
                    addClass('animated bounceInRight');
            });

            // Show and animate in the filtered set of steps
            range = _.range(_.last(prevPager), nextOrder);
            _.each(range, function(i) {
                $('div[data-order=' + i + '] div').
                    show().
                    removeClass().
                    addClass('animated bounceInRight');
            });

            // Give the current step an active style
            $('div[data-order=' + currentOrder + '] div').addClass('step-active');

            // Play video and audio
            playMedia('audio', 'stepAudio');
            Meteor.setTimeout(function(){
                playMedia('video', 'stepVideo');
            }, 1000);

            // Timer steps
            checkTimer(currentOrder, 100);

        }
    }, 500);

};

/**
 * Events
 *
 * Actions to take based on user input
 */

/**
 * Dev arrow key navigation
 *
 * Makes testing faster. Production application environment won't
 * have a keyboard, so we don't need to worry about removing.
 */
Template.body.events({
    'keyup': function(e) {
        event.preventDefault();
        if (e.keyCode == '38') {
            goReset();
        }
        if (e.keyCode == '37') {
            goPrevious();
        }
        if (e.keyCode == '39') {
            goNext();
        }
    }
});

Template.component.events({

    'mousemove': function(e) {
        Session.set('mouseCoord', 'x,y: ' + e.pageX + ', ' + e.pageY);
    },

    'click #edit-link': function(e) {
        e.preventDefault();
        Router.go( Router.current().location.get().path + '/edit' );
    },

    'click .edit-step-link': function(e) {
        e.preventDefault();
        // Fix this to go to the correct edit page for this link
        Router.go('stepEdit', {
            componentNumber: this.componentNumber,
            parentLink: this.parentLink,
            link: this.link
        });
        //Router.go( Router.current().location.get().path + '/' + this.link + '/edit' );
    },

    'click #reset': function(e) {
        e.preventDefault();
        goReset();
    },

    'click #back': function(e) {
        e.preventDefault();
        goPrevious();
    },

    'click #forward, click #begin': function(e) {
        e.preventDefault();
        goNext();
    }

});

/**
 * Navigation
 */
function goReset() {
    if (Session.get('navBlock')) {
        console.log('Navigation blocked');
        return;
    }

    Session.set('currentOrder', 0);

    // Animate out steps
    $('div.step-container div.bounceInRight').removeClass().addClass('animated bounceOutRight');

    // Make the URL match the current step
    var nextOrder = 0;
    setURL(nextOrder);

    Meteor.setTimeout(function(){
        playMedia('audio', 'bodyAudio');
    }, 500);
}

function goPrevious() {
    if (Session.get('navBlock')) {
        console.log('Navigation blocked');
        return;
    }

    // Stop the current step audio
    var audio = stopMedia('audio', 'stepAudio');

    var currentOrder;
    var nextOrder;
    if (Session.get('currentOrder')) {
        currentOrder = Session.get('currentOrder');
        nextOrder = (currentOrder - 1);
    }
    else {
        currentOrder = 0;
        nextOrder = 0;
    }

    devTrackStep('previous', currentOrder, nextOrder);

    // Set the session for reactions in the template
    Session.set('currentOrder', nextOrder);

    var pager = $('div[data-order=' + currentOrder + ']').data('pager');
    var prevPager = [];
    $('div[data-pager=true]').each(function() {
        prevPager.push($(this).data('order'));
    });

    if (pager) {
        $('div.step-container div').hide();
        console.log('');
        console.log('-----' + 'pager' + '-----');
        console.log('nextOrder - ', nextOrder);
        console.log('default - prevPager - ', prevPager);
        prevPager = prevPager.sort(sortNumber).reverse();
        console.log('sort - prevPager - ', prevPager);

        prevPager = prevPager.filter(function (element) {
            return element < currentOrder;
        });
        console.log('filtered - prevPager - ', prevPager);

        $('div.step-container div').slice((prevPager[0] - 1), nextOrder).show();
        $('div[data-order=' + nextOrder + '] div').addClass('step-active');
    }
    else {
        $('div[data-order=' + currentOrder + '] div').removeClass().addClass('animated bounceOutRight');
        $('div[data-order=' + nextOrder + '] div').removeClass().addClass('step-active');
    }

    // Make the URL match the current step
    setURL(nextOrder);

    Meteor.setTimeout(function(){
        // No video on homepage
        playMedia(audio);
        if (nextOrder !== 0) {
            playMedia('video', 'stepVideo');
        }
    }, 200);
}

function goNext() {
    if (Session.get('navBlock')) {
        console.log('Navigation blocked');
        return;
    }

    var currentOrder;
    if (Session.get('currentOrder')) {
        currentOrder = Session.get('currentOrder');
    }
    else {
        currentOrder = 0;
    }
    var nextOrder = (currentOrder + 1);
    devTrackStep('next', currentOrder, nextOrder);

    // Exit goNext if you're trying to go beyond the current max step
    if (nextOrder > maxOrder()) {
        return;
    }

    // Set the session for reactions in the template
    Session.set('currentOrder', nextOrder);

    // Check if the upcoming step is a pager
    var pager = $('div[data-order=' + nextOrder + ']').data('pager');
    if (pager) {
        $('div.step-container div').show();
        $('div.step-container div').slice(0, currentOrder).hide();
    }

    // Make the URL match the current step
    setURL(nextOrder);

    /**
     * Load the next step
     *
     * Wait for a short bit so that the DOM element will be there.
     * We need to do this for the switch from the first body section
     * where the step divs haven't loaded yet.
     */
    var timeout;
    if (currentOrder === 0) {
        timeout = 500;
    }
    else {
        timeout = 0;
    }

    Meteor.setTimeout(function(){
        //
        // Switch video
        //
        playMedia('video', 'stepVideo');

        // Load the audio element again.
        // The source is changed in the template.
        playMedia('audio', 'stepAudio');

        //
        // Animate in step text
        //
        $('div.step-container div').removeClass('step-active');
        $('div[data-order=' + nextOrder + '] div').removeClass().addClass('animated bounceInRight step-active');

        checkTimer(nextOrder, 100);

    }, timeout);
}

/**
 * Media functions
 *
 * Playing and restarting audio and video files
 */
function stopMedia(type, id) {
    var media = getMedia(type, id);
    media.pause();
    media.currentTime = 0;
    return media;
}

function playMedia(type, id) {
    /**
     * Use an existing object, or find it in the DOM if type is a string
     */
    var media;
    if (typeof type=='object') {
        media = type;
    }
    else {
        media = getMedia(type, id);
    }
    media.load();
    media.play();
    return media;
}

function getMedia(type, id) {
    return $(type + '#' + id)[0];
}

function maxOrder() {
    var orders = Steps.find({}, {sort: {order: -1}, limit: 1 });
    return orders.fetch()[0].order;
}

function sortNumber(a,b) {
    return a - b;
}

/**
 * Set the URL with a hash to track our step progress
 * Remove the hash all together if you're at step 0,
 * aka the component intro page
 */
function setURL(nextOrder) {
    var nextOrderHash;
    if (nextOrder === 0) {
        nextOrderHash = '';
    }
    else {
        nextOrderHash = 'step-' + _s.lpad(nextOrder, 4, '0');
    }
    var path = Router.current().location.get().originalUrl;
    var uri = new URI(path);
    uri.hash(nextOrderHash);
    Router.go(uri.href());
}

function devTrackStep(operation, currentOrder, nextOrder) {
    console.log('');
    console.log('-----' + operation + '-----');
    console.log(operation + ': currentOrder - ', currentOrder);
    console.log(operation + ': nextOrder - ', nextOrder);
}

function checkTimer(currentOrder, intervalMiliseconds) {
    var clock;
    clock = $('div#step-timer-' + currentOrder).data('timer-length');
    if (clock) {
        console.log('Timer present');
        startTimer(currentOrder, intervalMiliseconds);
    } else {
        console.log('No timer');
    }
}

function startTimer(currentOrder, intervalMiliseconds) {
    var clock, timeLeft, interval;

    // Reset the timer
    Meteor.clearInterval(interval);

    // Block navigation
    Session.set('navBlock', true);

    // TODO - Do this without the DOM
    clock = $('div#step-timer-' + currentOrder).data('timer-length');
    timeLeft = function() {
        if (clock > 0) {
            // Store the full real number
            clock = (clock - (intervalMiliseconds / 1000));
            Session.set('timerValue', clock);
            return console.log(clock);
        } else {
            console.log('Timer done');

            // Unblock navigation
            Session.set('navBlock', false);

            // Go to the next step automatically
            goNext();

            // Clear timer. This must be done last or else you'll break
            // out of the conditional
            return Meteor.clearInterval(interval);
        }
    };
    interval = Meteor.setInterval(timeLeft, intervalMiliseconds);
}
