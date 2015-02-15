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
        if (Session.get('currentOrder')) {
            return Session.get('currentOrder');
        }
        else {
            Session.set('currentOrder', 0);
            return 0;
        }
    }
});

Template.component.rendered = function () {
    //
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
        e.preventDefault();
        Router.go('components');
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
        console.log('currentOrder - ', currentOrder);

        // Set the session for reactions in the template
        var nextOrder = (currentOrder + 1);
        console.log('nextOrder - ', nextOrder);
        Session.set('currentOrder', nextOrder);

        // Set the URL with a hash to track our step progress
        var nextOrderHash = 'step-' + _s.lpad(nextOrder, 4, '0');
        var path = Router.current().location.get().originalUrl;
        var uri = new URI(path);
        var hash = uri.hash();
        uri.hash(nextOrderHash);
        Router.go(uri.href());

    }
});
