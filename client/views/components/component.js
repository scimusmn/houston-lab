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

/**
 * Rendered
 *
 * Actions to complete when the component page is first loaded
 */
Template.component.rendered = function () {
    /**
     * Ignore the session if you come to the page without a hash link
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
     * Animate the page elements in based on the session value
     */
    var currentOrder = Session.get('currentOrder');
    setTimeout(function(){
        // Play body audio on component home page
        var nextOrder = (currentOrder + 1);
        if (currentOrder===0) {
            playMedia('audio', 'bodyAudio');
        }
        else {
            // Animate in all the steps up to the current one

            console.log('Page loaded. Ready to animate in the right steps');
            console.log('Render');
            console.log('render: currentOrder - ', currentOrder);
            console.log('render: nextOrder - ', nextOrder);
            var pager = $('div[data-order=' + nextOrder + ']').data('pager');
            $('div.step-container div').show();
            if (pager) {
                //$('div.step-container div').show();
                //$('div.step-container div').slice(0, currentOrder).hide();
            }
            var prevPager = [];
            $('div[data-pager=true]').each(function() {
                prevPager.push($(this).data('order'));
            });
            prevPager = prevPager.sort(sortNumber);

            prevPager = prevPager.filter(function (element) {
                return element < currentOrder;
            });

            var range = _.range(0, _.last(prevPager));
            _.each(range, function(i) {
                $('div[data-order=' + i + '] div').
                    hide();
            });
            range = _.range(_.last(prevPager), nextOrder);
            _.each(range, function(i) {
                $('div[data-order=' + i + '] div').
                    show().
                    removeClass().
                    addClass('animated bounceInRight');
            });

            // Play video and audio
            playMedia('audio', 'stepAudio');
            setTimeout(function(){
                playMedia('video', 'stepVideo');
            }, 500);

            $('div[data-order=' + currentOrder + '] div').addClass('step-active');
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
        console.log('e - ', e.keyCode);
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

    'click #start-over': function(e) {
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
    Session.set('currentOrder', 0);
    Router.go('component', {
        componentNumber: this.component.componentNumber,
        componentLink: this.component.componentLink
    });
    $('div.step-container div.bounceInRight').removeClass().addClass('animated bounceOutRight');
    setTimeout(function(){
        playMedia('audio', 'bodyAudio');
    }, 500);
}

function goPrevious() {
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

    console.log('BACK');
    console.log('back: currentOrder - ', currentOrder);
    console.log('back: nextOrder - ', nextOrder);

    // Set the session for reactions in the template
    Session.set('currentOrder', nextOrder);

    var pager = $('div[data-order=' + currentOrder + ']').data('pager');
    var prevPager = [];
    $('div[data-pager=true]').each(function() {
        prevPager.push($(this).data('order'));
    });

    if (pager) {
        $('div.step-container div').hide();
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

    // Set the URL with a hash to track our step progress
    var nextOrderHash = 'step-' + _s.lpad(nextOrder, 4, '0');
    var path = Router.current().location.get().originalUrl;
    var uri = new URI(path);
    uri.hash(nextOrderHash);
    Router.go(uri.href());


    setTimeout(function(){
        playMedia('video', 'stepVideo');
        playMedia(audio);
    }, 200);
}

function goNext() {
    var currentOrder;
    if (Session.get('currentOrder')) {
        currentOrder = Session.get('currentOrder');
    }
    else {
        currentOrder = 0;
    }

    // Set the session for reactions in the template
    var nextOrder = (currentOrder + 1);
    Session.set('currentOrder', nextOrder);

    console.log('FWD');
    console.log('fwd: currentOrder - ', currentOrder);
    console.log('fwd: nextOrder - ', nextOrder);

    // Check if the upcoming step is a pager
    var pager = $('div[data-order=' + nextOrder + ']').data('pager');
    if (pager) {
        $('div.step-container div').show();
        $('div.step-container div').slice(0, currentOrder).hide();
    }

    // Set the URL with a hash to track our step progress
    var nextOrderHash = 'step-' + _s.lpad(nextOrder, 4, '0');
    var path = Router.current().location.get().originalUrl;
    var uri = new URI(path);
    uri.hash(nextOrderHash);
    Router.go(uri.href());

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

    setTimeout(function(){
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
