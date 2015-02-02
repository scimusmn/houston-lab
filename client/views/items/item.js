/**
 * Single item template code
 */
Template.item.created = function () {
    //
};

Template.item.helpers({
    myHelper: function () {
        //
    }
});

Template.item.rendered = function () {
    var itemId = this.data.item._id;
    $('.editable').editable({
        success: function(response, newValue) {
            //
            // Update this item
            //

            // Determine the field to update
            var updatedField = $(this).data('field-name');

            // Build the query
            var query = {$set: {}};
            query.$set[updatedField] = newValue;

            // Update content in the database
            Items.update(itemId, query, function(error) {
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

Template.item.events({
    //
});
