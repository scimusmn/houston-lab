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
    var result = Components.find({}, {sort: {componentNumber: 1}});
    return result;
});

/**
 * Single component
 *
 * TODO: document the argument
 */
Meteor.publish('singleComponent', function(link) {
    var result = Components.find( { link: link } );
    return result;
});

/**
 * Pages
 */
Meteor.publish('pages', function(componentNumber) {
    console.log('componentNumber - ', componentNumber);
    var result = Pages.find({componentNumber: componentNumber}, {sort: {order: 1}});
    console.log('result - ', result.fetch());
    return result;
});

Meteor.publish('singlePage', function(colorPalate, link) {
    /**
     * Return any page with the URL ID
     * as well as any subpages with the same parentId
     */
    var topPage = Pages.findOne( { $and: [ { 'colorPalate': colorPalate, 'link': link } ] } );
    var id = topPage._id;
    return id && Pages.find( { $or: [ {_id: id}, {parentId: id} ] } );
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
