/**
 * Single component template code
 */
Template.component.created = function () {
    //
};

Template.component.helpers({
    currentLanguage: function() {
        return Session.get('currentLanguage');
    },
    english: function() {
        return false;
    },
    pages: function() {
        /**
         * Return only top level pages, no sub-pages (aka pages with defined parentIds)
         */
        return Pages.find({});
        //return Pages.find({
            //$and: [
                //{ componentId: this._id },
                //{ parentId: {$exists: false} }
            //],
        //},
        //{
            //sort: {order: 1}
        //});
    }
});

Template.component.rendered = function () {

    var pages = Pages.findOne({});

    var componentId = this.data.component._id;
    if (Meteor.user()) {


        setTimeout(function() {
          return $(".editable").editable({
            placement: "auto top",
            display: function() {},
            success: function(response, newValue) {
              var name, newVal, oldVal;
              newVal = {};
              oldVal = $.trim($(this).data("value"));
              name = $(this).data("name");
              newVal[name] = newValue;
              eval($(this).data("context")).update($(this).data("pk"), {
                $set: newVal
              }, function(error) {
                Notifications.error(error.message);
                return Meteor.defer(function() {
                  return $(".editable[data-name=" + name + "]").data('editableContainer').formOptions.value = oldVal;
                });
              });
              console.log("set new value to " + newValue);
              return Session.set("text", newValue);
            }
          });
        }, 500);
        //return this.autorun(function() {
            //Blaze.getCurrentData();
            //return tmplInst.$('.editable').editable('destroy').editable({
                //display: function() {},
                //success: function(response, newValue) {
                    ////
                    //// Update this component
                    ////

                    //// Determine the field to update
                    //var updatedField = $(this).data('field-name');

                    //// Build the query
                    //var query = {$set: {}};
                    //query.$set[updatedField] = newValue;

                    //// Update content in the database
                    //Components.update(componentId, query, function(error) {
                        //// Display an error to the user if needed
                        //if (error) {
                            //alert(error.reason);
                        //} else {
                            //console.log('Content saved');
                        //}
                    //});
                //}
            //});
        //});

        //this.autorun(function() {
            //Blaze.getData();
            //tmplInst.$('.editable').editable('destroy').editable({
                //display: function() {},
                //success: function(response, newValue) {
                    ////
                    //// Update this component
                    ////

                    //// Determine the field to update
                    //var updatedField = $(this).data('field-name');

                    //// Build the query
                    //var query = {$set: {}};
                    //query.$set[updatedField] = newValue;

                    //// Update content in the database
                    //Components.update(componentId, query, function(error) {
                        //// Display an error to the user if needed
                        //if (error) {
                            //alert(error.reason);
                        //} else {
                            //console.log('Content saved');
                        //}
                    //});

                //}
            //});
        //});

    }
    else {
        $('.editable').removeClass('editable');
    }
};

Template.component.events({
    'click #start-over': function(e) {
        e.preventDefault();
        Router.go('components');
        console.log('start over clicked');
    }
});
