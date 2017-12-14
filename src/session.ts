import { Meta } from "../meta";
import * as repl from 'repl'
import { REPLServer } from "repl";
import {GentlestConfig, Case} from './interfaces'
import * as fse from 'fs-extra'
import * as path from 'path'
import * as TJS from 'typescript-json-schema'
const glob = require('glob')
import {TestSituation} from './situation'
import {Loader} from './loader'

export class Session {
    situations:TestSituation[]
    rootDir:string

    constructor(public loader:Loader){
        this.situations = []
    }

    /**
     * Use the config to scan the working directory for situation directories. 
     * 
     * @param config the config data to drive the loading
     */
    load():Promise<any>{
        let config = this.loader.config
        this.rootDir = config.rootDir

        return new Promise((resolve, reject)=>{

            glob(config.testFiles, {
                cwd:config.rootDir
            }, (err, matches)=>{
                if (err) {
                    reject(err)
                }
                
                let chain= new Promise((resolve)=>{resolve()})

                matches.forEach((match)=>{
                    console.log("match detected by glob", match)
                    chain.then(()=>{
                        return this.prospectSituationMatch(config, match).catch((reason)=>{
                            console.log("Invalid Situation: ", match, " Because", reason)
                        })
                    })
                })

                chain.then(()=>{
                    console.log("Completed Load with,", this.currentState())
                    resolve()
                }).catch((reason)=>{
                    console.error(`could not run because ${reason}`)
                })

            })
        })
    }

    currentState(){
        let situations = []
        
        for (let sitch of this.situations){
            situations.push({
                name:sitch.meta.name,
                cases:sitch.cases.map((tc)=>{
                    return tc.getJSON()
                })
            })
        }

        return situations
    }

    prospectSituationMatch(config: GentlestConfig, match: string): Promise<any> {
        let { dir, base } = path.parse(match)
        let realdir = path.join(this.rootDir, dir)
        let situationFile = path.join(this.rootDir, match)

        console.log(`Compiling Test Source: ${match}`)

        let newsit = new TestSituation(config, situationFile, realdir)

        return new Promise((resolve, reject) => {
            try {
                newsit.loadMeta()
                
                console.log("Loading Cases")
                newsit.loadCases()

                console.log("Adding Situation")
                newsit.index = this.situations.length
                this.situations.push(newsit)
                
                resolve()
            } catch (e) {
                reject(`File Invalid Meta: ${e.message}`)
            }
        })
    }


}
