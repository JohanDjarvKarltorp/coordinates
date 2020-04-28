# Coordinates
Display randomize points inside specified country.

## Run
- clone the repo `git@github.com:JohanDjarvKarltorp/coordinates.git`
- Jump to directory `cd coordinates`
- install npm modules `npm install`
- start server `node index.js`
- Go to http://localhost:1337/

## Workflow
- clone the repo `git@github.com:JohanDjarvKarltorp/coordinates.git`
- install npm modules (this is required for code linting) `npm install`
- code
- run `npm test` to run linters etc.
- create a branch, commit and push to it
- pre-commit hook will run linters on commits and needs to pass before commit is accepted 
- Create pull request to merge with master

# Project structure
This is the file structure of the project, use this as a reference when adding more code.

## Index file
This is the file that starts everything up, it will probably be pretty much unchanged.

## Routers
A router keeps track of it's routes and is mounted in the index file. The router shall not contain any logic
besides responding with data.

## Src / Functions
The src directory is where most things happen. Here is all logic stored, split up to relevant files.
This is where things such as database calls and calculations stored.

## middleware
A middleware activates before the request meets the router. This can be used to log
to console or file.
