Template.steps.helpers({
    steps: function() {
         // Sort steps by order
        return Steps.find({}, {sort: {order: 1}});
    }
});

Template.steps.events({
    'click .edit-step-link': function(e) {
        e.preventDefault();
        Router.go('stepEdit', {
            componentNumber: this.componentNumber,
            parentLink: this.parentLink,
            link: this.link
        });
        //Router.go( Router.current().location.get().path + '/' + this.link + '/edit' );
    },
});
