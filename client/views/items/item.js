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
    $('#textArea.editable').editable({
        success: function(response, newValue) {
            console.log('newValue - ', newValue);
        }
    });
};

Template.item.events({
    //
});
