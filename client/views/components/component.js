/**
 * Single component template code
 */

/**
 * Helpers
 *
 * Establish {{variables}} for use in the component.html template
 */
Template.component.helpers({
    currentLanguage: function() {
        return Session.get('currentLanguage');
    },
    english: function() {
        return false;
    },
    steps: function() {
        /**
         * Sort steps by order
         */
        return Steps.find({}, {sort: {order: 1}});
    },
    beforeRemove: function () {
        return function (collection, id) {
            var doc = collection.findOne(id);
            if (confirm('Really delete ' + doc.title + '?')) {
                this.remove();
            }
        };
    },
    currentOrder: function () {
        return Session.get('currentOrder');
    },
    currentOrderPad: function () {
        var currentOrder = Session.get('currentOrder');
        return _s.lpad(currentOrder, 4, '0');
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
    var range = _.range(1, (currentOrder + 1));
    _.each(range, function(i) {
        $('div[data-order=' + i + '] div').
            removeClass().
            addClass('animated bounceInRight');
    });

    /**
     * Play body audio on component home page
     */
    setTimeout(function(){
        playMedia('audio', 'bodyAudio');
    }, 500);

};

/**
 * Events
 *
 * Actions to take based on user input
 */
Template.component.events({
    'click #edit-link': function(e) {
        e.preventDefault();
        Router.go( Router.current().location.get().path + '/edit' );
    },
    'click .edit-step-link': function(e) {
        e.preventDefault();
        // Fix this to go to the correct edit page for this link
        console.log('this- ', this);
        Router.go('stepEdit', {
            componentNumber: this.componentNumber,
            parentLink: this.parentLink,
            link: this.link
        });
        //Router.go( Router.current().location.get().path + '/' + this.link + '/edit' );
    },

    'click #start-over': function(e) {
        console.log('this- ', this);
        e.preventDefault();
        Session.set('currentOrder', 0);
        Router.go('component', {
            componentNumber: this.component.componentNumber,
            componentLink: this.component.componentLink
        });
        $('div.step-container div.bounceInRight').removeClass().addClass('animated bounceOutRight');

        setTimeout(function(){
            var audio = $('audio#bodyAudio')[0];
            audio.load();
            audio.play();
        }, 500);
    },

    'click #back': function(e) {
        e.preventDefault();

        // Stop the current step audio
        var audio = $('audio#stepAudio')[0];
        audio.pause();
        audio.currentTime = 0;

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

        // Set the session for reactions in the template
        Session.set('currentOrder', nextOrder);

        // Set the URL with a hash to track our step progress
        var nextOrderHash = 'step-' + _s.lpad(nextOrder, 4, '0');
        var path = Router.current().location.get().originalUrl;
        var uri = new URI(path);
        uri.hash(nextOrderHash);
        Router.go(uri.href());

        $('div[data-order=' + currentOrder + '] div').removeClass().addClass('animated bounceOutRight');
        $('div[data-order=' + nextOrder + '] div').removeClass().addClass('step-active');

        console.log('Starting previous slide\'s audio');
        setTimeout(function(){
            //var audio = $('audio#bodyAudio')[0];
            audio.load();
            audio.play();
        }, 500);

    },
    'click #forward, click #begin': function(e) {
        e.preventDefault();

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

        // Set the URL with a hash to track our step progress
        var nextOrderPad = _s.lpad(nextOrder, 4, '0');
        var nextOrderHash = 'step-' + nextOrderPad;
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
            var video = $('video#stepVideo')[0];
            //video.src = videoPath;
            video.load();
            video.play();

            // Load the audio element again.
            // The source is changed in the template.
            var audio = $('audio#stepAudio')[0];
            audio.load();
            audio.play();

            //
            // Animate in step text
            //
            $('div.step-container div').removeClass('step-active');
            $('div[data-order=' + nextOrder + '] div').removeClass().addClass('animated bounceInRight step-active');

        }, timeout);

    }

});

function playAudio(id) {
    var audio = getMedia('audio', id);
    audio.load();
    audio.play();
}

function getMedia(type, id) {
    return $(type + '#' + id)[0];
}
