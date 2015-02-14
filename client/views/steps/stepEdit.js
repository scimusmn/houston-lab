Template.stepEdit.rendered = function () {
    $('input[name="componentNumber"]').focus();
};

Template.stepEdit.events({
    //
});

AutoForm.addHooks(['updateStepsForm'], {
    onSuccess: function(operation, result, template) {
        // Delete two of the tail segemnts from the current URL to get the
        // parent component URL
        var path = Router.current().location.get().path;
        var uri = new URI(path);
        uri.segment(-1, '');
        uri.segment(-1, '');
        Router.go(uri.href());
    }
});
