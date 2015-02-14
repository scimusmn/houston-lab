/**
 * Publications
 *
 * Expose server-side database elements to the client.
 *
 * Publication names should be distinct from each other so that they're easy
 * to find and replace in the boilerplate.
 *
 * In other words, names like:
 *
 *      `allItems` and `singleItem`
 *
 * are more distinct and better than:
 *
 *      `items` and `item`
 */

/**
 * All components
 */
Meteor.publish('allComponents', function() {
    var result = Components.find({});
    return result;
});

/**
 * Single component
 *
 * TODO: document the argument
 */
Meteor.publish('singleComponent', function(componentNumber, componentLink) {
    var result = Components.find( { $and: [
        {componentNumber: componentNumber },
        {componentLink: componentLink}
    ] });
    return result;
});

/**
 * Steps
 */
Meteor.publish('steps', function(componentNumber) {
    var result = Steps.find(
        {componentNumber: componentNumber},
        {sort: {order: 1}}
    );
    return result;
});

Meteor.publish('singleStep', function(link) {
    var step = Steps.find( { link: link } );
    //var step = Steps.find( { $and: [
        //{componentNumber: componentNumber, parentLink: parentLink, link: link }
    //]});
    return step;
});

/**
 * All items
 */
Meteor.publish('allItems', function() {
    var result = Items.find();
    return result;
});

/**
 * Single item
 *
 * TODO: document the argument
 */
Meteor.publish('singleItem', function(link) {
    var result = Items.find( { link: link } );
    return result;
});

/**
 * TODO: demo returning two collections.
 */
