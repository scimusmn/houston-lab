Template.layout.rendered = function () {
    if (!Session.get('currentLanguage')) {
        Session.set('currentLanguage', 'en');
        $('.en-switch').addClass('active');
    }
    var sSaver;
    //sSaverTimeout = 180000;
    // Dev timeout
    sSaverTimeout = 5000;

    clearTimeout(sSaver);
    saveScreen(sSaverTimeout);
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
console.log('Meteor - ', Meteor);
console.log('Meteor.settings.public - ', Meteor.settings);

Template.layout.events({
    'click #screensaver': function(e){
        // Fade the screensaver
        // It's important to hide the element or nothing underneath
        // will be clickable
        $('#screensaver').removeClass('animated fadeIn');
        $('#screensaver').addClass('animated fadeOut');
        setTimeout(function(){
            $('#screensaver').hide();
        }, 600);
        console.log('Meteor.settings.public - ', Meteor.settings.public);

        if (Session.get('componentNumber') == '0110' || Session.get('componentNumber') == '0109') {
          Router.go('/components/0107-blood-bench');
        }
        else {
          Session.set('currentOrder', 0);

          // Animate out steps
          $('div.step-container div.bounceInRight').removeClass().addClass('animated bounceOutRight');

          // Make the URL match the current step
          var nextOrder = 0;

          var nextOrderHash;
          if (nextOrder === 0) {
            nextOrderHash = '';
          }
          else {
            nextOrderHash = 'step-' + _s.lpad(nextOrder, 4, '0');
          }
          var path = Router.current().location.get().originalUrl;
          var uri = new URI(path);
          uri.hash(nextOrderHash);
          Router.go(uri.href());

          Meteor.setTimeout(function(){
            var type = 'audio';
            var id = 'bodyAudio';
            var media;
            if (typeof type=='object') {
              media = type;
            }
            else {
              media = $(type + '#' + id)[0];
            }
            media.load();
            media.play();
          }, 500);
        }

        // Restart the screensaver timer
        clearTimeout(sSaver);
        saveScreen(sSaverTimeout);
    },
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

/**
 * Display the screensaver after a timeout
 */
function saveScreen(sSaverTimeout) {
  sSaver = setTimeout(function(){
    var audio = $('audio')[0];
    audio.pause();
    audio.currentTime = 0;

    $('#screensaver').removeClass('animated fadeOut');
    $('#screensaver').addClass('animated fadeIn');
    $('#screensaver').show();
  }, sSaverTimeout);
}

