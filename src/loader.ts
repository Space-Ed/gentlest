
import * as I from './interfaces'

import * as AJV from 'ajv'
import * as path from 'path'
import * as fse from 'fs-extra'


/**
 * Manage loading of files into standard objects with validation and update
 */
export class Loader {

    validator:AJV.Ajv
    config:I.GentlestConfig

    constructor(public configPath:string){

        let ajv = this.validator = new AJV()
        ajv.addMetaSchema(require('ajv/lib/refs/json-schema-draft-04.json'));

        ajv .addSchema(fse.readJSONSync(path.join(__dirname, '..', 'schema', 'config.json')), 'config')
            .addSchema(fse.readJSONSync(path.join(__dirname, '..', 'schema', 'cases.json')), 'cases')
    }

    loadConfig():Promise<I.GentlestConfig> {

        return fse.pathExists(this.configPath)
            .then((exists)=>{
                if(exists){
                    return fse.readJSON(this.configPath)
                }else{
                    return Promise.reject("Unable to locate config file at path: " + this.configPath)
                }
            })
            .then((json)=>{
                let valid = this.validator.validate('config', json)
                
                if(valid){
                    this.config = json;
                    return json
                }else{
                    return Promise.reject(`Config file is not valid: \n${this.validator.errorsText()}`)
                }
            })

    }

    loadGenerators():Promise<{[type:string]:GeneratorFactory}> {

    }

    loadValidators():Promise<{[type:string]: ValidatorFactory} {

    }

    



}