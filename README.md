# Houston Lab

A Meteor JS project for the Houston Health Museum

## Install

### Get Meteor

    curl https://install.meteor.com/ | sh

### Startup Meteor on boot

Download https://raw.githubusercontent.com/scimusmn/sd-build/master/assets/launchd/org.smm.meteor.plist

Move this file to `~/Library/LaunchAgents`

Load it by restarting or running `launchctl load ~/Library/LaunchAgents/org.smm.meteor.plist`

### Populate Mongodb with the content

    cd ~/Desktop/source/
    brew install mongo
    ./restore.sh

### Get media

    cd ~/Desktop/source/public
    rsync -rtDv --size-only --progress username@server:houston/public/ ./
