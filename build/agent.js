"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var jsesc = require('jsesc');
var vorpal = require('vorpal');
var TestAgent = /** @class */ (function () {
    function TestAgent(loader, session) {
        this.loader = loader;
        this.session = session;
        this.autorun = false;
        this.skipPassing = true;
        this.defaultCommand = 'next';
        this.cli = vorpal();
    }
    TestAgent.prototype.beginInteractive = function () {
        var _this = this;
        this.cli
            .command('test', 'Executes tests')
            .option('-s', '--situation', 'run all the tests in this situation')
            .option('-a', '--all', 'run all tests in the entire suite')
            .option('-r', '--reload', 'reload the situation before running the case')
            .option('-v', '--verbose', 'log detailed results of the test.')
            .action(function (args, cb) {
            _this.test(args).then(function (result) {
                cb(result);
                _this.refresh();
            }).catch(function () {
                _this.cli.exec("exit");
            });
        });
        this.cli
            .command('show', 'information about current position')
            .alias('s')
            .option('-c', '--case', '..about the current case')
            .option('-s', '--situation', '..about the current situation')
            .action(function (args, cb) {
            cb(_this.show(args));
        });
        this.cli
            .command('next', 'Move to next case')
            .alias('n')
            .action(function (args, cb) {
            _this.next();
            cb();
        });
        this.cli
            .command('restart', 'go back to the beginning')
            .alias('r')
            .action(function (args, cb) {
            _this.initialize();
            cb();
        });
        var exit = new Promise(function (resolve, reject) {
            _this.raiseError = reject;
            _this.finalExit = resolve;
        });
        this.initialize();
        this.refresh();
        return exit;
    };
    TestAgent.prototype.initialize = function () {
        try {
            this.openSituation(0);
        }
        catch (e) {
            this.raiseError("Could not initialize, no valid test scenarios found");
        }
    };
    TestAgent.prototype.formatPrompt = function () {
        var status = this.currentCase.renderStatus();
        return this.currentSituation.meta.name + " ~ " + this.currentCase.index + " (" + status + ") -| ";
    };
    TestAgent.prototype.refresh = function () {
        this.cli.delimiter(this.formatPrompt());
        this.cli.show();
    };
    TestAgent.prototype.test = function (_a) {
        var _this = this;
        var options = _a.options;
        console.log(options);
        return new Promise(function (resolve, reject) {
            if (options.r) {
                _this.currentSituation.loadMeta();
            }
            var report;
            if (options.a) {
                _this.initialize();
                _this.autonext = true;
                _this.autorun = true;
                report = _this.run("Running all from beginning");
            }
            else if (options.s) {
            }
            else {
                _this.autorun = false;
                _this.autonext = false;
                report = _this.run("Running single case");
            }
            _this.refresh();
            resolve(report);
        });
    };
    TestAgent.prototype.run = function (prior) {
        this.currentCase.run();
        var report = prior + ("\n-" + this.currentCase.index + "-\n") + this.currentCase.renderReport();
        if (this.autonext) {
            var status = this.next();
            if (this.autorun && status != 'end') {
                return this.run(report);
            }
        }
        return report;
    };
    TestAgent.prototype.next = function () {
        var si = this.currentSituation.index, ci = this.currentCase.index;
        var finalcase = ci == this.currentSituation.cases.length - 1;
        if (finalcase) {
            var finalsitch = si == this.session.situations.length - 1;
            if (finalsitch) {
                return 'end';
            }
            else {
                this.closeSituation();
                this.openSituation(si + 1);
                return 'new situation';
            }
        }
        else {
            this.closeCase();
            this.openCase(ci + 1);
            return 'new case';
        }
    };
    TestAgent.prototype.show = function (args) {
        return this.currentCase.renderInfo();
        // if(args.case){
        // }
    };
    TestAgent.prototype.goto = function (args) {
    };
    TestAgent.prototype.completer = function (line) {
        return [['help', 'test', 'next', 'go', 'find'], line];
    };
    TestAgent.prototype.openSituation = function (index) {
        var sitch = this.session.situations[index];
        if (sitch === undefined) {
            this.raiseError("Unable to find situation");
            return;
        }
        this.currentSituation = sitch;
        this.openCase(0);
    };
    TestAgent.prototype.closeSituation = function () {
    };
    TestAgent.prototype.openCase = function (index) {
        var tc = this.currentSituation.cases[index];
        if (tc === undefined) {
            this.raiseError("No Such Case exists");
            return;
        }
        // if(this.autorun){
        //     this.run()
        // }
        this.currentCase = tc;
        this.refresh();
    };
    TestAgent.prototype.closeCase = function () {
    };
    return TestAgent;
}());
exports.TestAgent = TestAgent;
