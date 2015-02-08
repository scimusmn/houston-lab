/**
 * All components template code
 */
Template.components.created = function () {
    //
};

Template.components.helpers({
    /**
     * Confirm component deletion
     */
    beforeRemove: function () {
        return function (collection, id) {
            var doc = collection.findOne(id);
            if (confirm('Really delete "' + doc.name + '"?')) {
                this.remove();
            }
        };
    }
});

Template.components.rendered = function () {
    //
};

Template.components.events({
    //
});
