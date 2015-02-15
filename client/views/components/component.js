/**
 * Single component template code
 */
Template.component.created = function () {
    //
};

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
    sessionUpdate: function () {
        return Session.get('currentOrder');
    },

});

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
    console.log('currentOrder - ', currentOrder);
    var range = _.range(1, (currentOrder + 1));
    console.log('range - ', range);
    _.each(range, function(i) {
        $('div[data-order=' + i + '] div').
            removeClass().
            addClass('animated bounceInLeft');
    });
};

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
        $('div.step-container div.bounceInLeft').removeClass().addClass('animated bounceOutLeft');
    },
    'click #back': function(e) {
        e.preventDefault();

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
        var hash = uri.hash();
        uri.hash(nextOrderHash);
        Router.go(uri.href());

        $('div[data-order=' + currentOrder + '] div').removeClass().addClass('animated bounceOutLeft');

    },
    'click #forward': function(e) {
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
        var nextOrderHash = 'step-' + _s.lpad(nextOrder, 4, '0');
        var path = Router.current().location.get().originalUrl;
        var uri = new URI(path);
        var hash = uri.hash();
        uri.hash(nextOrderHash);
        Router.go(uri.href());

        // Animate the step in
        $('div[data-order=' + nextOrder + '] div').removeClass().addClass('animated bounceInLeft');

    }
});
