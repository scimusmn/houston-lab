# Houston Lab

A Meteor JS project for the Houston Health Museum

## Install

### Get Meteor

    curl https://install.meteor.com/ | sh

### Populate Mongodb with the content

    cd ~/Desktop/source/
    brew install mongo
    ./restore.sh

### Get media

    cd ~/Desktop/source/public
    rsync -rtDv --size-only --progress username@server:houston/public/ ./
