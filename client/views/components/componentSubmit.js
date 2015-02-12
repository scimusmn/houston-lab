Template.componentSubmit.rendered = function () {
    $('input[name="componentNumber"]').focus();
};

Template.componentSubmit.events({
    //
});

AutoForm.addHooks(['insertComponentsForm'], {
    onSuccess: function(operation, result, template) {
        Router.go('components');
    }
});
