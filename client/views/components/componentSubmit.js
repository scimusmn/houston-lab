Template.componentSubmit.events({
    //
});

AutoForm.hooks({
    insertComponentsForm: {
        onSuccess: function(operation, result, template) {
            Router.go('components');
        }
    }
});
