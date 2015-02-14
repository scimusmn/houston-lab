/**
 * Setup the Steps collection
 */

Steps = new Meteor.Collection('steps');

Steps.attachSchema(new SimpleSchema({
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
    order: {
        type: Number,
        label: 'Order'
    },
    title: {
        type: String,
        label: 'Step',
        min: 4,
        max: 1000,
        autoform: {
            rows: 5
        }
    },
    titleEs: {
        type: String,
        label: 'Step - Spanish',
        min: 4,
        max: 1000,
        autoform: {
            rows: 5
        }
    }
}));


Steps.simpleSchema().messages({
    'regEx parentLink': [
        { msg: '[label]s can only include lowercase letters, numbers, and the - character.' },
    ]
});

/**
 * Allow posting if you're logged in
 */
Steps.allow({
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
