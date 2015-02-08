/**
 * Setup the Components collection
 */

Components = new Meteor.Collection('components');

Components.attachSchema(new SimpleSchema({
    componentNumber: {
        type: String,
        label: 'Component number',
        max: 4
    },
    title: {
        type: String,
        label: 'Title'
    },
    link: {
        type: String,
        label: 'Link'
    },
    body: {
        type: String,
        label: 'Body',
        min: 20,
        max: 1000,
        autoform: {
            rows: 5
        }
    }
}));
