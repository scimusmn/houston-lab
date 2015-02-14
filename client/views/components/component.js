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
        return Session.get('specialValue');
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
        console.log('this - ', this);
        e.preventDefault();

        // TODO
        // Use the hash on both sides of this, while still setting the hash
        // for bookmarking
        var path = Router.current().location.get().originalUrl;

        var uri = new URI(path);
        var hash = uri.hash();
        var stepNum;
        if (hash) {
            console.log('hash - ', hash);
            stepNum = _s.toNumber(_s.strRight(hash, '-'));
        }
        else {
            stepNum = 0;
        }
        var nextStepNum = (stepNum + 1);
        var nextStepHash = 'step-' + _s.lpad(nextStepNum, 4, '0');
        Session.set('specialValue', nextStepNum);

        uri.hash(nextStepHash);
        Router.go(uri.href());

    }
});
