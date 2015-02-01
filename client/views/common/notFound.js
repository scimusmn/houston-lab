/**
 * Spinner settings
 */
Meteor.Spinner.options = {
    lines: 13, // The number of lines to draw
    length: 10, // The length of each line
    width: 5, // The line thickness
    radius: 15, // The radius of the inner circle
    corners: 0.7, // Corner roundness (0..1)
    rotate: 0, // The rotation offset
    direction: 1, // 1: clockwise, -1: counterclockwise
    color: '#333', // #rgb or #rrggbb
    speed: 1.5, // Rounds per second
    trail: 30, // Afterglow percentage
    shadow: true, // Whether to render a shadow
    hwaccel: false, // Whether to use hardware acceleration
    className: 'spinner', // The CSS class to assign to the spinner
    zIndex: 2e9, // The z-index (defaults to 2000000000)
    //
    // Disabled because auto breaks the appearance
    //
    //top: 'auto', // Top position relative to parent in px
    //left: 'auto' // Left position relative to parent in px
};

Template.notFound.events({
    /**
     * Custom actions for page links
     */
    'click button': function(e) {
        Router.go('home');
    }
});
