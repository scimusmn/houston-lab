Template.footer.rendered = function() {
    //
};

Template.footer.helpers({
    accountEmail: function() {
        /**
         * Return only top level pages, no sub-pages (aka pages with defined parentIds)
         */
        return Meteor.user().emails[0].address;
    }
});


