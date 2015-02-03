Template.componentSubmit.events({
    'submit form': function(e) {
        console.log('formclicked');
        e.preventDefault();
        var component = {
            componentNumber: $(e.target).find('[name=componentNumber]').val(),
            link: $(e.target).find('[name=link]').val(),
            body: $(e.target).find('[name=body]').val(),
            title: $(e.target).find('[name=title]').val()
        };
        component._id = Components.insert(component);
        Router.go('components');
    }
});
