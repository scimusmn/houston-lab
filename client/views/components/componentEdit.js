Template.componentEdit.rendered = function () {
    $('input[name="componentNumber"]').focus();
};

Template.componentEdit.events({
    //
});

AutoForm.addHooks(['updateComponentsForm'], {
    onSuccess: function(operation, result, template) {
        // Delete 'edit' segemnt from the URL to get the parent component URL
        var path = Router.current().location.get().path;
        var uri = new URI(path);
        uri.segment(-1, '');
        Router.go(uri.href());
    }
});
