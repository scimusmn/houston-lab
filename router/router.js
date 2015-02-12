/**
 * Router
 *
 * If this file becomes to big and complex, seperate the config and the routes
 * using a pattern something like this.
 *
 *   * router/config.js
 *   * router/mainRoutes.js
 *   * router/otherRoutes.js
 */

/**
 * Iron Router configuration
 */
Router.configure({

    /**
     * Primary layout template
     */
    layoutTemplate: 'layout',

    /**
     * Page not found template
     */
     notFoundTemplate: 'notFound',

    /**
     * Loading template
     *
     * Displays while waitOn calls are waiting
     */
    loadingTemplate: 'loading',

    /**
     * Wait for global subscriptions
     *
     * Put global waits in here for things like notifications, e.g.
     * waitOn: function() {
     *     return [Meteor.subscribe('notifications')]
     * }
     *
     * In our apps there aren't any global subscriptions right now.
     */

    /**
     * Use Google Analytics to track all page views
     */
    trackPageView: true

});


/**
 * Filters
 *
 * TODO: Implement filters to modify the routes based on logged in status
 */

/**
 * Map URLs to templates
 */
Router.map(function() {

    /**
     * Homepage
     *
     * This is identical to the all items page
     */
    this.route('homepage', {
        path: '/',
        waitOn: function () {
            return Meteor.subscribe('allItems');
        },
        data: function () {
            return {
                items: Items.find()
            };
        }
    });

    /**
     * All components
     */
    this.route('components', {
        waitOn: function () {
            return Meteor.subscribe('allComponents');
        },
        data: function () {
            return {
                components: Components.find()
            };
        }
    });

    this.route('componentEdit', {
        path: '/components/:componentNumber' + '-' + ':link/edit',
        waitOn: function () {
            //var result = Components.findOne( { componentNumber: this.params.componentNumber } );
            return [
                Meteor.subscribe('singleComponent', this.params.componentNumber, this.params.link),
                //Meteor.subscribe('pages', {'componentNumber': result.componentNumber} )
                Meteor.subscribe('pages', this.params.componentNumber)
            ];
        },
        onBeforeAction: function () {
            AccountsEntry.signInRequired(this);
            //this.next();
        },
        data: function () {
            var result = Components.findOne( { $and: [ { componentNumber: this.params.componentNumber }, {link: this.params.link} ] });
            return result;
        }
    });

    this.route('componentSubmit', {
        path: '/components/submit',
        onBeforeAction: function () {
            AccountsEntry.signInRequired(this);
        }
    });

    /**
     * Single component
     *
     * TODO: Look at the router documentation and spell out the purpose of
     * each of these waitOn, data distinctions.
     */
    this.route('component', {
        path: '/components/:componentNumber' + '-' + ':link',
        waitOn: function () {
            //var result = Components.findOne( { componentNumber: this.params.componentNumber } );
            return [
                Meteor.subscribe('singleComponent', this.params.componentNumber, this.params.link),
                //Meteor.subscribe('pages', {'componentNumber': result.componentNumber} )
                Meteor.subscribe('pages', this.params.componentNumber)
            ];
        },
        data: function () {
            return {
                component: Components.findOne({componentNumber: this.params.componentNumber})
            };
        }
    });

    /**
     * Each top level page in the component
     */
    this.route('page', {
        path: '/components/:componentNumber/:link',
        waitOn: function () {
            return [
                Meteor.subscribe('singlePage', this.params.componentNumber, this.params.link )
            ];
        },
        // Data is the information exposed to the tempalte spacebars elements
        // for instance
        //      {{#with page}}
        //      {{#with component}}
        data: function () {
            return {
                //component: Components.findOne({componentNumber: this.params.componentNumber})
                page: Pages.findOne({})
            };
        }
    });

    /**
     * All items
     */
    this.route('items', {
        waitOn: function () {
            return Meteor.subscribe('allItems');
        },
        data: function () {
            return {
                items: Items.find()
            };
        }
    });

    /**
     * Single item
     *
     * TODO: Look at the router documentation and spell out the purpose of
     * each of these waitOn, data distinctions.
     */
    this.route('item', {
        path: '/items/:link',
        waitOn: function () {
            return Meteor.subscribe('singleItem', this.params.link);
        },
        data: function () {
            return {
                item: Items.findOne({link: this.params.link})
            };
        }
    });


    this.route('userProfile', {
        path: '/profile',
        template: 'profile',
        onBeforeAction: function () {
            AccountsEntry.signInRequired(this);
        }
    });

});

var requireLogin = function() {
    if (! Meteor.user()) {
        if (Meteor.loggingIn()) {
            this.render(this.loadingTemplate);
        } else {
            this.render('accessDenied');
        }
    } else {
        this.next();
    }
}

//Router.onBeforeAction(requireLogin, {only: 'componentSubmit'});

/**
 * Animate content
 *
 * TODO: Add examples of animating content in on route change
 */
