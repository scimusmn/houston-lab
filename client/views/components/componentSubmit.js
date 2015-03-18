Template.componentSubmit.rendered = function () {
    // Disable keyboard navigation
    Session.set('navBlock', true);
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
