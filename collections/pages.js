/**
 * Setup the Items collection
 */

Pages = new Meteor.Collection('pages');

Pages.attachSchema(new SimpleSchema({
    componentNumber: {
        type: String,
        label: 'Component number',
        max: 4
    },
    parentLink: {
        type: String,
        label: 'Parent link',
        regEx: /^[.a-zA-Z0-9-]+$/
    },
    link: {
        type: String,
        label: 'Link',
        regEx: /^[.a-zA-Z0-9-]+$/
    },
    order: {
        type: Number,
        label: 'Order'
    },
    title: {
        type: String,
        label: 'Title'
    },
    titleEs: {
        type: String,
        label: 'Title - Spanish'
    },
    body: {
        type: String,
        label: 'Body',
        min: 4,
        max: 1000,
        autoform: {
            rows: 5
        }
    },
    bodyEs: {
        type: String,
        label: 'Body - Spanish',
        min: 4,
        max: 1000,
        autoform: {
            rows: 5
        }
    }
}));


Pages.simpleSchema().messages({
    'regEx parentLink': [
        { msg: '[label]s can only include lowercase letters, numbers, and the - character.' },
    ]
});

/**
 * Allow posting if you're logged in
 */
Pages.allow({
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
