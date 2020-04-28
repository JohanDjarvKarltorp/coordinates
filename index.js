"use strict";
const port = 1337;
const express = require("express");
const app = express();
const routeIndex = require("./route/index.js");
const middleware = require("./middleware/index.js");
const path = require("path");


app.set("view engine", "ejs");

app.use(middleware.logIncomingToConsole);
app.use(express.static(path.join(__dirname, "public")));
app.use("/", routeIndex);
app.listen(port, logStartUpDetailsToConsole);


function logStartUpDetailsToConsole() {
    let routes = [];

    // Find what routes are supported
    app._router.stack.forEach((middleware) => {
        if (middleware.route) {
            // Routes registered directly on the app
            routes.push(middleware.route);
        } else if (middleware.name === "router") {
            // Routes added as router middleware
            middleware.handle.stack.forEach((handler) => {
                let route;

                route = handler.route;
                route && routes.push(route);
            });
        }
    });

    console.info(`\nServer is listening on port ${port}.`);
    console.info("Available routes are:\n");
    console.table(routes);
}

module.exports = app;
