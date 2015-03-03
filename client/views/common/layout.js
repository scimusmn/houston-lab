Template.layout.rendered = function () {
    if (!Session.get('currentLanguage')) {
        Session.set('currentLanguage', 'en');
        $('.en-switch').addClass('active');
    }
    var currentLanguage = Session.get('currentLanguage');
    console.log('currentLanguage - ', currentLanguage);
    //Session.set('currentLanguage', 'en');
};

Template.layout.events({
    'click .lang-switches a': function(e){
        var selectedLanguage = e.currentTarget.id;
        Session.set('currentLanguage', selectedLanguage);
        if (selectedLanguage == 'en') {
            $('.en-switch').addClass('active');
            $('.es-switch').removeClass('active');
        }
        if (selectedLanguage == 'es') {
            $('.en-switch').removeClass('active');
            $('.es-switch').addClass('active');
        }

        /**
         * Stop current audio, wait for language switch in the template,
         * and then play new language file.
         */
        var audio = $('audio')[0];
        audio.pause();
        audio.currentTime = 0;
        setTimeout(function(){
            audio.load();
            audio.play();
        }, 500);

        //// Retrieve the unique ID of the player that's been clicked
        //var playerId = this._id;

        //// Create a session to store the unique ID of the clicked player
        //Session.set('selectedPlayer', playerId);
    }
});
