Template.layout.rendered = function () {
    if (!Session.get('currentLanguage')) {
        Session.set('currentLanguage', 'en');
        $('.en-switch').addClass('active');
    }
};

/**
 * Dev keyboard language switch
 *
 * Makes testing faster. Production application environment won't
 * have a keyboard, so we don't need to worry about removing.
 */
Template.body.events({
    'keyup': function(e) {
        e.preventDefault();
        // e
        if (e.keyCode == '69') {
            switchLang('en');
        }
        // s
        if (e.keyCode == '83') {
            switchLang('es');
        }
    }
});

Template.layout.events({
    'click .lang-switches a': function(e){
        e.preventDefault();
        var selectedLanguage = e.currentTarget.id;
        switchLang(selectedLanguage);
    }
});

function switchLang(selectedLanguage) {
    console.log('selectedLanguage - ', selectedLanguage);
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
}

