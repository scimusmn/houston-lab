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
    $('#textArea.editable').editable({
        success: function(response, newValue) {
            // Update this item
            Items.update(itemId, {$set: {body: newValue}}, function(error) {
                // Display an error to the user.
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
