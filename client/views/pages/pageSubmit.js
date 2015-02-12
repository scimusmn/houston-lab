Template.pageSubmit.rendered = function () {
    $('input[name="componentNumber"]').focus();
};

Template.pageSubmit.events({
    //
});

AutoForm.addHooks(['insertPageForm'], {
    onSuccess: function(operation, result, template) {
        Router.go('/components');
    }
});
