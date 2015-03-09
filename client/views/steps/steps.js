Template.steps.helpers({
    steps: function() {
         // Sort steps by order
        return Steps.find({}, {sort: {order: 1}});
    }
});
