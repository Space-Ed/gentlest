import {CaseRunResult } from './interfaces'
import chalk from 'chalk'
import { TestSituation } from './situation';
import {assert} from 'chai'
import {Session } from './session'
import { Loader } from './loader';

export class TestCase {

    index: number
    argument: any
    result: any
    xfail: boolean
    errorMessage: string
    
    status:{
        hasRun: boolean,
        isPassing: boolean,
        reason?:string,
        lastResult?:any
    }

    constructor(public situation:TestSituation, testCase) {
        
        this.argument = testCase.argument,
        this.result = testCase.result,
        this.xfail = testCase.xfail,
        this.errorMessage = testCase.errorMessage

        this.status = {
            hasRun:false,
            isPassing:false
        }
    }

    renderStatus():string{
        let status = 
            (!this.status.hasRun ?
                chalk.cyan('Unknown') :
                (this.isComplete() ?
                    (this.status.isPassing ? 
                        chalk.green("passing"): 
                        chalk.red('failing')) :
                    chalk.blue('incomplete')))

        return status
    }

    renderReport() {
        return `status: ${this.renderStatus()}
${!this.status.isPassing?`because '${this.status.reason}`:''}`
    }

    renderInfo(){
        return `Test Case ${this.index} of situation ${this.situation.meta.name}
argument:${JSON.stringify(this.argument, (k,v)=>(v), ' ')}
expected:${JSON.stringify(this.result, (k, v) => (v), ' ')}
${this.renderReport()}
`
    }


    getJSON() {
        return {
            argumnent: this.argument,
            result: this.result,
            xfail: this.xfail,
            errorMessage: this.errorMessage
        }
    }

    run() {

        this.status.hasRun = true;


        try {
            let result = this.situation.runFunc.call(null, this.argument)
            let expected = this.result

            assert.deepEqual(expected, result)
            this.status.isPassing = true
            
        } catch (e) {
            this.status.isPassing = false
            this.status.reason = e.message
        }
    }

    
    isValid() {
        return true
    }

    isComplete() {
        return true
    }
}