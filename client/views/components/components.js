/**
 * All components template code
 */
Template.components.created = function () {
    //
};

Template.components.helpers({
    components: function () {
        return Components.find({}, {sort: {componentNumber: 1}});
    },
    /**
     * Confirm component deletion
     */
    beforeRemove: function () {
        return function (collection, id) {
            var doc = collection.findOne(id);
            if (confirm('Really delete ' + doc.componentTitle + '?')) {
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
