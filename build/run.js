#!/usr/bin/node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Yargs = require("yargs");
var fse = require("fs-extra");
var path = require("path");
var loader_1 = require("./loader");
var session_1 = require("./session");
var agent_1 = require("./agent");
var argv = Yargs
    .option('project', {
    alias: 'p',
    default: 'gentlest.json',
})
    .option('interactive', {
    alias: 'i',
    default: false
})
    .command('init', "initialize project", function (yargs) { return (yargs.option('project', {
    alias: 'p',
    default: 'gentlest.json'
}).option('directory', {
    alias: 'd',
    default: 'gentlest'
})); }, function (initargs) {
    init(initargs);
})
    .argv;
function init(args) {
    var configfile = args.project;
    if (fse.pathExistsSync(configfile)) {
        exit(1, 'project already exists');
    }
    else {
        var json = fse.readJSONSync(path.join(__dirname, '../gentlest.json'));
        fse.ensureDirSync(args.directory);
        json.rootDir = args.directory;
        fse.writeJSONSync(configfile, json);
        console.log("Created Gentlest Project");
        exit(0);
    }
}
function exit(status, message) {
    if (message) {
        console.log(message);
    }
    process.exit(status);
}
var loader = new loader_1.Loader(argv.project);
loader.loadConfig()
    .catch(function (reason) {
    exit(1, reason);
})
    .then(function () {
    var session = new session_1.Session(loader);
    session.load()
        .catch(function (reason) {
        exit(1, reason);
    }).then(function () {
        console.log("Create Agent");
        var agent = new agent_1.TestAgent(loader, session);
        return agent.beginInteractive();
    }).catch(function (reason) {
        exit(1, reason);
    }).then(function () {
        exit(0);
    });
});
