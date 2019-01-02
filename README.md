# congress-commentator

## Usage

1) start mongodb with default settings
    
    run `brew services start mongodb`
    * install mongodb via brew on mac: https://treehouse.github.io/installation-guides/mac/mongo-mac.html

2) install dependencies

    run `npm install` in terminal inside app directory

3) add a local config file with secret keys

    instructions: https://paper.dropbox.com/doc/Congress-Commentator-Config--ATwHo6jeqCx0nBut_EiLAZ7eAQ-xYEzMfpbVCa7PU3lziVFq

4) run app

    run `configPath='./localConfig.js' node index.js`
