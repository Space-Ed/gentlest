"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fse = require("fs-extra");
var path = require("path");
var TJS = require("typescript-json-schema");
var testCase_1 = require("./testCase");
var TestSituation = /** @class */ (function () {
    function TestSituation(config, filePath, dir) {
        this.config = config;
        this.filePath = filePath;
        this.dir = dir;
        this.cases = [];
    }
    TestSituation.prototype.loadMeta = function () {
        // optionally pass argument to schema generator
        var settings = {
            required: true,
            topRef: false,
            ref: false,
            aliasRef: false
        };
        // optionally pass ts compiler options
        var compilerOptions = {
            strictNullChecks: true,
        };
        var filePath = path.resolve(this.filePath);
        // LOAD SCHEMA from     
        var program = TJS.getProgramFromFiles([filePath], compilerOptions);
        // emit js file
        var emitted = program.emit();
        //assign meta and run
        var emittedJS = path.join(process.cwd(), this.dir, path.parse(this.filePath).name + '.js');
        var testModule = require(emittedJS);
        this.runFunc = testModule.run;
        this.meta = testModule.meta || {};
        this.meta.name = testModule.name;
        var argSchema = TJS.generateSchema(program, "Argument", settings);
        var resultSchema = TJS.generateSchema(program, "Result", settings);
        if (argSchema == null) {
            throw new Error('"Argument" Interface Must be defined in test file to be valid');
        }
        if (resultSchema == null) {
            throw new Error('"Result" Interface Must be defined in test file to be valid');
        }
        this.argSchema = argSchema;
        this.resultSchema = resultSchema;
    };
    TestSituation.prototype.addCase = function (testCase) {
        console.log('adding new case', testCase);
        var newCase = new testCase_1.TestCase(this, testCase);
        newCase.index = this.cases.length;
        this.cases.push(newCase);
    };
    TestSituation.prototype.loadCases = function () {
        var _this = this;
        var cases = fse.readJSONSync(path.join(this.dir, this.config.caseFileName));
        cases.forEach(function (testCase) {
            _this.addCase(testCase);
        });
        //load files, creating situation cases
    };
    TestSituation.prototype.reloadCases = function () {
        this.cases = [];
        this.loadCases();
    };
    TestSituation.prototype.begin = function () {
    };
    TestSituation.prototype.end = function () {
    };
    TestSituation.prototype.run = function () {
        return null;
    };
    TestSituation.prototype.runCases = function () {
        var results = [];
        this.cases.forEach(function (tc) {
            results.push(tc.run());
        });
        return results;
    };
    return TestSituation;
}());
exports.TestSituation = TestSituation;
