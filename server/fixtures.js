/**
 * Fixtures
 *
 * If you start up Meteor without any data, fixtures helps define dummy data.
 */

// Use dimsum to create dummy content in style of the zwordy wifpho nordool
dimsum.configure({ flavor: 'jabberwocky' });

if (Components.find().count() === 0) {
    Components.insert({
        order: 1,
        link: 'anti-bacteria',
        title: 'Anti Bacteria',
        body: 'At this experiment'
    });

}

if (Items.find().count() === 0) {

    var entries = 500;
    var i = 0;

    var title;
    var link;
    while (i < entries) {
        title = dimsum.sentence(1);
        link = title.split(/\s+/).slice(1,3).join('-').toLowerCase();
        i += 1;
        Items.insert({
            order: i,
            link: link,
            title: title,
            body: dimsum()
        });
    }

}

