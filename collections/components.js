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
    comopnentLink: {
        type: String,
        label: 'Link',
        regEx: /^[.a-zA-Z0-9-]+$/
    },
    componentTitle: {
        type: String,
        label: 'Title'
    },
    componentTitleEs: {
        type: String,
        label: 'Title - Spanish'
    },
    componentBody: {
        type: String,
        label: 'Body',
        min: 20,
        max: 1000,
        autoform: {
            rows: 5
        }
    }
}));

Components.simpleSchema().messages({
    'regEx link': [
        { msg: '[label]s can only include lowercase letters, numbers, and the - character.' },
    ]
});

/**
 * Allow posting if you're logged in
 */
Components.allow({
    'insert': function (userId, doc) {
        return !! userId;
    },
    'update': function (userId, doc) {
        return !! userId;
    },
    'remove': function (userId, doc) {
        return !! userId;
    }
});
