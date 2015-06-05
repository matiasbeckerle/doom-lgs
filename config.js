var env = process.env.NODE_ENV || "development";
var settings = require("./settings.json")[env];

module.exports = {
    env: env,
    port: process.env.PORT || 666, // Appropriate port number for Doom related, right?
    requirejsCommand: settings.requirejsCommand
};