## Overview

This application is the front end web app for the committee of committees (coc).
It is a web-app powered by React and used in conjunction with the coc back-end
server application. This project was bootstrapped with
[Create React App](https://github.com/facebook/create-react-app).

## Requirements

1. Node.js and npm:
   [Install instructions](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)
2. Coc server for building the end-to-end application

## Building the application

### Clone and Install back-end application

For the front end application to work you must first install, build and seed the
back-end database. Full instructions for this setup are located in the README
file in the server repository.

### Running the front-end

### `npm start`

Runs the app in the development mode. Open
[http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits. You will also see any lint errors in the
console.

### Running application end-to-end

1. F om the prod-coc-server project run: `docker-compose up -d` 1b. If you are
   having issues running this on windows run without -d option.
2. From the prod-coc-server directory run: `node index.js`
3. From the prod-coc-client directory run: `npm start`

## Testing

### `npm test`

Launches the test runner in the interactive watch mode. See the section about
[running tests](https://facebook.github.io/create-react-app/docs/running-tests)
for more information.

## Deployment

### Building front end assets

In order to serve the front-end application from the back-end server, the
front-end assets must be built and copied to the back-end.

1. Build the static assets: `npm run build`
2. Copy the `build/` directory created by this command into the coc-server.
3. On the server, run `npm start` and visit http://localhost:8080/; the
   front-end page should be visible
