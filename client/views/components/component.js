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
    videoDisabled: function () {
        if (Session.get('videoDisabled') === true) {
            return true;
        } else {
            return false;
        }
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
    hema1: function() {
        return Session.get('hema1');
    },
    hema2: function() {
        return Session.get('hema2');
    },
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

    Session.set('componentNumber', this.data.component.componentNumber);

    Session.set('hema1', '-');
    Session.set('hema2', '-');

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

    // Disable video on some steps
    if (Session.get('currentOrder') !== 0) {
        setVideoState(Session.get('currentOrder'));
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

            console.log('');
            console.log('-----' + 'pager' + '-----');
            console.log('nextOrder - ', nextOrder);
            console.log('orders with pagers - ', prevPager);

            // Sort it numerically
            prevPager = prevPager.sort(sortNumber);
            console.log('orders with pagers sorted - ', prevPager);

            // Filter array to only show orders below or equal to current order
            prevPager = prevPager.filter(function (element) {
                return element <= currentOrder;
            });
            console.log('orders with pagers filtered - ', prevPager);

            // Hide everything and reset the style to the offscreen default
            var range = _.range(0, _.last(prevPager));
            console.log('range - ', range);
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

    'click #reload-video': function(e) {
        e.preventDefault();
        console.log('reload video');
        playMedia('audio', 'stepAudio');
        playMedia('video', 'stepVideo');
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

    'click #check-hema': function(e) {
        e.preventDefault();
        Router.go('/components/0109-check-hema');
    },

    'click #blood-typing': function(e) {
        e.preventDefault();
        Router.go('/components/0110-blood-typing');
    },

    'click #forward, click #begin': function(e) {
        e.preventDefault();
        goNext();
    },

    'click .num-button': function(e) {
        console.log('Hema clicked');
        console.log('e - ', e.currentTarget.innerHTML);
        if (Session.get('currentOrder') == '32') {
            var hema1 = Session.get('hema1');
            console.log('hema1 - ', hema1);
            if (hema1 == '-') {
                hema1 = e.currentTarget.innerHTML;
                Session.set('hema1', hema1);
            }
            else if (hema1.length == 1) {
                Session.set('hema1', hema1 + e.currentTarget.innerHTML);
            }
        }
        if (Session.get('currentOrder') == '38') {
            var hema2 = Session.get('hema2');
            console.log('hema2 - ', hema2);
            if (hema2 == '-') {
                hema2 = e.currentTarget.innerHTML;
                Session.set('hema2', hema2);
            }
            else if (hema2.length == 1) {
                Session.set('hema2', hema2 + e.currentTarget.innerHTML);
            }
        }
    },

    'click .clear-button': function(e) {
        console.log('Clear clicked');
        console.log('e - ', e.currentTarget.innerHTML);
        if (Session.get('currentOrder') == '32') {
            Session.set('hema1', '-');
        }
        if (Session.get('currentOrder') == '38') {
            Session.set('hema2', '-');
        }
    },

});

/**
 * Navigation
 */
function goReset() {
    if (Session.get('navBlock')) {
        return;
    }

    console.log('componentNumber', Session.get('componentNumber'));
    if (Session.get('componentNumber') == '0110' || Session.get('componentNumber') == '0109') {
        Router.go('/components/0107-blood-bench');
    }
    else {
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
}

function goPrevious() {
    if (Session.get('navBlock')) {
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

    // Check and see if an order exists for the next step.
    // Otherwise keep incrementing the order until we find one.
    while (checkStepExists(nextOrder) === false) {
        nextOrder--;
    }

    // Set the session for reactions in the template
    Session.set('currentOrder', nextOrder);

    // Disable video on some steps
    setVideoState(Session.get('currentOrder'));

    var pager = $('div[data-order=' + currentOrder + ']').data('pager');
    var prevPager = [];
    $('div[data-pager=true]').each(function() {
        prevPager.push($(this).data('order'));
    });

    $('div[data-order=' + currentOrder + '] div').removeClass().addClass('animated bounceOutRight');

    if (pager) {
        $('div.step-container div').hide();
        console.log('');
        console.log('-----' + 'pager' + '-----');
        console.log('nextOrder - ', nextOrder);
        console.log('orders with pagers - ', prevPager);
        prevPager = prevPager.sort(sortNumber).reverse();
        console.log('orders with pagers sorted - ', prevPager);

        prevPager = prevPager.filter(function (element) {
            return element < currentOrder;
        });
        console.log('filtered - prevPager - ', prevPager);
        console.log('slicing steps from ', prevPager[0], 'to', nextOrder);

        // Show the selection of steps between the two pagers
        var sliceMaxIndex = $('div.step-container').index($('div[data-order=' + currentOrder + ']'));
        var sliceMinIndex;
        if (prevPager[0] > 0) {
            sliceMinIndex = $('div.step-container').index($('div[data-order=' + prevPager[0] + ']'));
        } else {
            sliceMinIndex = 0;
        }
        $('div.step-container div').slice(sliceMinIndex, sliceMaxIndex).show();

        //Identify active step
        $('div[data-order=' + nextOrder + '] div').addClass('step-active');

    }
    else {
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
    devTrackStep('before next', currentOrder, nextOrder);

    // Exit goNext if you're trying to go beyond the current max step
    if (nextOrder > maxOrder()) {
        return;
    }

    // Check and see if an order exists for the next step.
    // Otherwise keep incrementing the order until we find one.
    var skipped = 0;
    while (checkStepExists(nextOrder) === false) {
        nextOrder++;
        skipped++;
        console.log('skipped - ', skipped);
        devTrackStep('next', currentOrder, nextOrder);
    }

    // Set the session for reactions in the template
    Session.set('currentOrder', nextOrder);
    //
    // Disable video on some steps
    setVideoState(Session.get('currentOrder'));

    // Check if the upcoming step is a pager
    var nextStepDiv = $('div[data-order=' + nextOrder + ']');
    var pager = nextStepDiv.data('pager');
    if (pager) {
        var sliceIndex = $('div.step-container').index(nextStepDiv);
        $('div.step-container div').show();
        $('div.step-container div').slice(0, sliceIndex).hide();
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

    // Don't try to play videos when they're disabled
    if (type == 'video' && Session.get('videoDisabled')) {
        return;
    }

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
    clock = $('span#step-timer-' + currentOrder).data('timer-length');
    if (clock) {
        startTimer(currentOrder, clock, intervalMiliseconds);
    }
}

function startTimer(currentOrder, clock, intervalMiliseconds) {
    var timeLeft, interval;

    // Reset the timer
    Meteor.clearInterval(interval);

    // Block navigation
    Session.set('navBlock', true);

    // TODO - Do this without the DOM
    timeLeft = function() {
        if (clock > 0) {
            // Store the full real number
            clock = (clock - (intervalMiliseconds / 1000));
            Session.set('timerValue', clock);
            return console.log(clock);
        } else {
            console.log('Timer done', currentOrder);

            // Unblock navigation
            Session.set('navBlock', false);

            // Go to the next step automatically
            //
            // The conditional here is lazy hack to deal with some
            // non-standard behavior in one component.
            //
            // TODO: fix how this is handled in the long run
            //
            if (currentOrder == 15 && Session.get('componentNumber')) {
                console.log('Not going next b/c the timer and the video length conflict.');
            }
            else {
                goNext();
            }

            // Clear timer. This must be done last or else you'll break
            // out of the conditional
            return Meteor.clearInterval(interval);
        }
    };
    interval = Meteor.setInterval(timeLeft, intervalMiliseconds);
}

function checkStepExists(order) {
    var nextStep = Steps.findOne({ order: order });
    if (nextStep) {
        return true;
    } else {
        return false;
    }
}

function setVideoState(order) {
    var step = Steps.findOne({ order: order });
    if (step.videoAbsent) {
        Session.set('videoDisabled', true);
    } else {
        Session.set('videoDisabled', false);
    }
}
