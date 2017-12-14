"use strict";
exports.__esModule = true;
exports.name = 'Test Coolness';
function run(args) {
    return {
        coolness: args.name === 'Edward' ? 'Very' : 'Hardy'
    };
}
exports.run = run;
