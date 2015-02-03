/**
 * Single component template code
 */
Template.component.created = function () {
    //
};

Template.component.helpers({
    myHelper: function () {
        //
    }
});

Template.component.rendered = function () {
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
    //
});
