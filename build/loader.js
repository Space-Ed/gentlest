"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var AJV = require("ajv");
var path = require("path");
var fse = require("fs-extra");
/**
 * Manage loading of files into standard objects with validation and update
 */
var Loader = /** @class */ (function () {
    function Loader(configPath) {
        this.configPath = configPath;
        var ajv = this.validator = new AJV();
        ajv.addMetaSchema(require('ajv/lib/refs/json-schema-draft-04.json'));
        ajv.addSchema(fse.readJSONSync(path.join(__dirname, '..', 'schema', 'config.json')), 'config')
            .addSchema(fse.readJSONSync(path.join(__dirname, '..', 'schema', 'cases.json')), 'cases');
    }
    Loader.prototype.loadConfig = function () {
        var _this = this;
        return fse.pathExists(this.configPath)
            .then(function (exists) {
            if (exists) {
                return fse.readJSON(_this.configPath);
            }
            else {
                return Promise.reject("Unable to locate config file at path: " + _this.configPath);
            }
        })
            .then(function (json) {
            var valid = _this.validator.validate('config', json);
            if (valid) {
                _this.config = json;
                return json;
            }
            else {
                return Promise.reject("Config file is not valid: \n" + _this.validator.errorsText());
            }
        });
    };
    return Loader;
}());
exports.Loader = Loader;
