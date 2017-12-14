"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var path = require("path");
var glob = require('glob');
var situation_1 = require("./situation");
var Session = /** @class */ (function () {
    function Session(loader) {
        this.loader = loader;
        this.situations = [];
    }
    /**
     * Use the config to scan the working directory for situation directories.
     *
     * @param config the config data to drive the loading
     */
    Session.prototype.load = function () {
        var _this = this;
        var config = this.loader.config;
        this.rootDir = config.rootDir;
        return new Promise(function (resolve, reject) {
            glob(config.testFiles, {
                cwd: config.rootDir
            }, function (err, matches) {
                if (err) {
                    reject(err);
                }
                var chain = new Promise(function (resolve) { resolve(); });
                matches.forEach(function (match) {
                    console.log("match detected by glob", match);
                    chain.then(function () {
                        return _this.prospectSituationMatch(config, match).catch(function (reason) {
                            console.log("Invalid Situation: ", match, " Because", reason);
                        });
                    });
                });
                chain.then(function () {
                    console.log("Completed Load with,", _this.currentState());
                    resolve();
                }).catch(function (reason) {
                    console.error("could not run because " + reason);
                });
            });
        });
    };
    Session.prototype.currentState = function () {
        var situations = [];
        for (var _i = 0, _a = this.situations; _i < _a.length; _i++) {
            var sitch = _a[_i];
            situations.push({
                name: sitch.meta.name,
                cases: sitch.cases.map(function (tc) {
                    return tc.getJSON();
                })
            });
        }
        return situations;
    };
    Session.prototype.prospectSituationMatch = function (config, match) {
        var _this = this;
        var _a = path.parse(match), dir = _a.dir, base = _a.base;
        var realdir = path.join(this.rootDir, dir);
        var situationFile = path.join(this.rootDir, match);
        console.log("Compiling Test Source: " + match);
        var newsit = new situation_1.TestSituation(config, situationFile, realdir);
        return new Promise(function (resolve, reject) {
            try {
                newsit.loadMeta();
                console.log("Loading Cases");
                newsit.loadCases();
                console.log("Adding Situation");
                newsit.index = _this.situations.length;
                _this.situations.push(newsit);
                resolve();
            }
            catch (e) {
                reject("File Invalid Meta: " + e.message);
            }
        });
    };
    return Session;
}());
exports.Session = Session;
