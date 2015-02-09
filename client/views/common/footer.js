Template.footer.helpers({
    accountEmail: function() {
        /**
         * Return only top level pages, no sub-pages (aka pages with defined parentIds)
         */
        return Meteor.user().emails[0].address;
        //return Pages.find({});
        //return Pages.find({
            //$and: [
                //{ componentId: this._id },
                //{ parentId: {$exists: false} }
            //],
        //},
        //{
            //sort: {order: 1}
        //});
    }
});


