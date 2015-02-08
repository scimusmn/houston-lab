Template.componentSubmit.events({
    'submit form': function(e) {
        console.log('formclicked');
        Router.go('components');
    }
});
