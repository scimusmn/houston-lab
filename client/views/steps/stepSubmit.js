function componentNumber() {
    return Router.current().params.query.componentNumber;
}

function parentLink() {
    return Router.current().params.query.link;
}

function order() {
    return Router.current().params.query.order;
}

Template.stepSubmit.rendered = function() {
    //
};

/**
 * Populate field with URL parameters if passed
 */
Template.stepSubmit.helpers({
    componentNumberHelper: function() {
        return componentNumber();
    },
    parentLinkHelper: function() {
        return parentLink();
    },
    orderHelper: function() {
        return order();
    }
});

Template.stepSubmit.events({
    //
});

AutoForm.addHooks(['insertStepForm'], {
    onSuccess: function(operation, result, template) {
        if (componentNumber() && parentLink()) {

            Router.go('/steps/submit?componentNumber=' + componentNumber() + '&link=' + parentLink() + '&order=' + (Number(order())+1));

        }
        else {
            Router.go('/components');
        }
    }
});
