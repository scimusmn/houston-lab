Template.componentEdit.rendered = function () {
    $('input[name="componentNumber"]').focus();
};

Template.componentEdit.events({
    //
});

AutoForm.addHooks(['updateComponentsForm'], {
    onSuccess: function(operation, result, template) {
        Router.go('components');
    }
});
