import {Session} from './session'
import {REPLServer} from 'repl'
import * as repl from 'repl'
import {TestCase} from './testCase'
import {TestSituation} from './situation'
import { Loader } from './loader';
import chalk from 'chalk'
const jsesc = require('jsesc')
const vorpal: any = require('vorpal')
import * as ora from 'ora'
import { SituationResult } from './interfaces';

export class TestAgent {

    currentCase: TestCase
    currentSituation: TestSituation
    replServer: REPLServer

    raiseError: (reason) => void
    finalExit: () => void;

    autorun:boolean;
    skipPassing:boolean;
    autonext:boolean;

    defaultCommand:string;

    cli:any

    constructor(public loader:Loader, public session: Session) {
        this.autorun = false;
        this.skipPassing = true;

        this.defaultCommand = 'next'

        this.cli = vorpal()
    }

    beginInteractive(): Promise<any> {

        this.cli
            .command('test', 'Executes tests')
            .option('-s', '--situation', 'run all the tests in this situation')
            .option('-a', '--all', 'run all tests in the entire suite')
            .option('-r', '--reload', 'reload the situation before running the case')
            .option('-v', '--verbose', 'log detailed results of the test.')
            .action((args, cb) => {
                this.test(args).then((result)=>{
                    cb(result)
                    this.refresh()
                }).catch(()=>{
                    this.cli.exec("exit")
                })
            })
        
        this.cli
            .command('show', 'information about current position')
            .alias('s')
            .option('-c', '--case', '..about the current case')
            .option('-s', '--situation', '..about the current situation')
            .action((args,cb)=>{
                cb(this.show(args))
            })

        this.cli
            .command('next', 'Move to next case')
            .alias('n')
            .action((args, cb) => {
                this.next()
                cb()
            })
        this.cli
            .command('restart', 'go back to the beginning')
            .alias('r')
            .action((args, cb) => {
                this.initialize()
                cb()
            })

        let exit = new Promise((resolve, reject) => {
            this.raiseError = reject
            this.finalExit = resolve
        })

        this.initialize()
        this.refresh()

        return exit
    }

    initialize() {
        try {
            this.openSituation(0)
        } catch (e) {
            this.raiseError("Could not initialize, no valid test scenarios found")
        }
    }

    formatPrompt(): string {
        let status = this.currentCase.renderStatus()
        return `${this.currentSituation.meta.name} ~ ${this.currentCase.index} (${status}) -| `
    }

    refresh() {
        this.cli.delimiter(this.formatPrompt())
        this.cli.show()
    }

    test({options}):Promise<string>{
        console.log(options)

        return new Promise<string>((resolve, reject)=>{
        

            if(options.r){
                this.currentSituation.loadMeta()
            }

            let report
            if(options.a){
                this.initialize()
                this.autonext = true;
                this.autorun = true; 
                report = this.run("Running all from beginning")
            }else if(options.s){
                
            }else {
                this.autorun = false;
                this.autonext = false;
                report = this.run("Running single case")
            }

            this.refresh()
            resolve(report)
            
        })
    }
    
    run(prior:string):string {
        this.currentCase.run()
        let report = prior+`\n-${this.currentCase.index}-\n`+this.currentCase.renderReport()

        if(this.autonext){
            let status = this.next()
            if(this.autorun && status != 'end'){
                return this.run(report)
            }
        }

        return report
    }

    next() {
        let si = this.currentSituation.index, ci = this.currentCase.index

        let finalcase = ci == this.currentSituation.cases.length - 1

        if (finalcase) {
            let finalsitch = si == this.session.situations.length - 1
            if (finalsitch) {
                return 'end'
            } else {
                this.closeSituation()
                this.openSituation(si + 1)
                return 'new situation'
            }
        } else {
            this.closeCase()
            this.openCase(ci + 1)
            return 'new case'
        }
    }

    show(args):string{

        return this.currentCase.renderInfo()
        // if(args.case){
        // }

    }

    goto(args){
    }

    completer(line){
        return [['help', 'test', 'next', 'go', 'find'], line]
    }

    openSituation(index: number) {
        let sitch = this.session.situations[index]

        if (sitch === undefined) {
            this.raiseError("Unable to find situation")
            return
        }

        this.currentSituation = sitch;

        this.openCase(0)
    }

    closeSituation() {

    }

    openCase(index) {
        let tc = this.currentSituation.cases[index]

        if (tc === undefined) {
            this.raiseError("No Such Case exists")
            return
        }

        // if(this.autorun){
        //     this.run()
        // }

        this.currentCase = tc

        this.refresh()
    }


    closeCase() {

    }
   

}
