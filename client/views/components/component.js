/**
 * Single component template code
 */
Template.component.created = function () {
    //
};

Template.component.helpers({
    pages: function() {
        /**
         * Return only top level pages, no sub-pages (aka pages with defined parentIds)
         */
        return Pages.find({});
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

Template.component.rendered = function () {
    var components = Components.findOne({});

    var pages = Pages.findOne({});

    var componentId = this.data.component._id;
    $('.editable').editable({
        success: function(response, newValue) {
            //
            // Update this component
            //

            // Determine the field to update
            var updatedField = $(this).data('field-name');

            // Build the query
            var query = {$set: {}};
            query.$set[updatedField] = newValue;

            // Update content in the database
            Components.update(componentId, query, function(error) {
                // Display an error to the user if needed
                if (error) {
                    alert(error.reason);
                } else {
                    console.log('Content saved');
                }
            });

        }
    });
};

Template.component.events({
    'click #start-over': function(e) {
        e.preventDefault();
        Router.go('components');
        console.log('start over clicked');
    }
});
