//Template.pageSubmit.rendered = function () {
    //$('input[name="componentNumber"]').focus();
//};

function componentNumber() {
    return Router.current().params.query.componentNumber;
}

function parentLink() {
    return Router.current().params.query.link;
}

Template.pageSubmit.rendered = function() {
    //
};

/**
 * Populate field with URL parameters if passed
 */
Template.pageSubmit.helpers({
    componentNumberHelper: function() {
        return componentNumber();
    },
    parentLinkHelper: function() {
        return parentLink();
    }
});

Template.pageSubmit.events({
    //
});

AutoForm.addHooks(['insertPageForm'], {
    onSuccess: function(operation, result, template) {
        if (componentNumber() && parentLink()) {
            Router.go('/components/' + componentNumber() + '-' + parentLink());
        }
        else {
            Router.go('/components');
        }
    }
});
