"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chalk_1 = require("chalk");
var chai_1 = require("chai");
var TestCase = /** @class */ (function () {
    function TestCase(situation, testCase) {
        this.situation = situation;
        this.argument = testCase.argument,
            this.result = testCase.result,
            this.xfail = testCase.xfail,
            this.errorMessage = testCase.errorMessage;
        this.status = {
            hasRun: false,
            isPassing: false
        };
    }
    TestCase.prototype.renderStatus = function () {
        var status = (!this.status.hasRun ?
            chalk_1.default.cyan('Unknown') :
            (this.isComplete() ?
                (this.status.isPassing ?
                    chalk_1.default.green("passing") :
                    chalk_1.default.red('failing')) :
                chalk_1.default.blue('incomplete')));
        return status;
    };
    TestCase.prototype.renderReport = function () {
        return "status: " + this.renderStatus() + "\n" + (!this.status.isPassing ? "because '" + this.status.reason : '');
    };
    TestCase.prototype.renderInfo = function () {
        return "Test Case " + this.index + " of situation " + this.situation.meta.name + "\nargument:" + JSON.stringify(this.argument, function (k, v) { return (v); }, ' ') + "\nexpected:" + JSON.stringify(this.result, function (k, v) { return (v); }, ' ') + "\n" + this.renderReport() + "\n";
    };
    TestCase.prototype.getJSON = function () {
        return {
            argumnent: this.argument,
            result: this.result,
            xfail: this.xfail,
            errorMessage: this.errorMessage
        };
    };
    TestCase.prototype.run = function () {
        this.status.hasRun = true;
        try {
            var result = this.situation.runFunc.call(null, this.argument);
            var expected = this.result;
            chai_1.assert.deepEqual(expected, result);
            this.status.isPassing = true;
        }
        catch (e) {
            this.status.isPassing = false;
            this.status.reason = e.message;
        }
    };
    TestCase.prototype.isValid = function () {
        return true;
    };
    TestCase.prototype.isComplete = function () {
        return true;
    };
    return TestCase;
}());
exports.TestCase = TestCase;
