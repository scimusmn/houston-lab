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
    pages: function() {
        /**
         * Return only top level pages, no sub-pages (aka pages with defined parentIds)
         */
        return Pages.find({}, {sort: {order: 1}});
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
    'click .edit-page-link': function(e) {
        e.preventDefault();
        console.log('this - ', this);
    },
    'click #start-over': function(e) {
        e.preventDefault();
        Router.go('components');
        console.log('start over clicked');
    }
});
