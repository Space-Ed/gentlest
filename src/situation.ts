import { Meta } from "../meta";
import { GentlestConfig, Case , SituationResult, CaseRunResult} from './interfaces'
import * as fse from 'fs-extra'
import * as path from 'path'
import * as TJS from 'typescript-json-schema'
import {TestCase} from './testCase'
import {assert} from 'chai'

export class TestSituation {

    index: number
    cases: TestCase[]
    meta: Meta

    argSchema: TJS.Definition
    resultSchema: TJS.Definition

    runFunc: (arg: any) => { result: any }

    constructor(public config: GentlestConfig, public filePath: string, public dir: string) {
        this.cases = []
    }

    loadMeta() {
        // optionally pass argument to schema generator
        const settings: TJS.PartialArgs = {
            required: true,
            topRef: false,
            ref: false,
            aliasRef: false
        };

        // optionally pass ts compiler options
        const compilerOptions: TJS.CompilerOptions = {
            strictNullChecks: true,
        }

        let filePath = path.resolve(this.filePath)

        // LOAD SCHEMA from     
        const program = TJS.getProgramFromFiles([filePath], compilerOptions);

        // emit js file
        let emitted = program.emit()

        //assign meta and run
        let emittedJS = path.join(process.cwd(), this.dir, path.parse(this.filePath).name + '.js')
        let testModule = require(emittedJS)
        this.runFunc = testModule.run
        this.meta = testModule.meta || {}
        this.meta.name = testModule.name

        const argSchema = TJS.generateSchema(program, "Argument", settings);
        const resultSchema = TJS.generateSchema(program, "Result", settings);

        if (argSchema == null) {
            throw new Error('"Argument" Interface Must be defined in test file to be valid')
        }

        if (resultSchema == null) {
            throw new Error('"Result" Interface Must be defined in test file to be valid')
        }

        this.argSchema = argSchema
        this.resultSchema = resultSchema
    }
    
    addCase(testCase: Case) {
        console.log('adding new case', testCase)
        let newCase = new TestCase(this, testCase)
        newCase.index = this.cases.length
        this.cases.push(newCase)
    }

    loadCases() {

        let cases = fse.readJSONSync(path.join(this.dir, this.config.caseFileName))
        cases.forEach((testCase) => {
            this.addCase(testCase)
        })

        //load files, creating situation cases

    }

    reloadCases(){
        this.cases = []
        this.loadCases()
    }

    begin() {

    }

    end() {

    }

    run(): SituationResult {
        return null
    }

    runCases(): CaseRunResult[] {
        let results = []

        this.cases.forEach((tc) => {
            results.push(tc.run())
        })

        return results
    }

}
