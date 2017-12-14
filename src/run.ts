#!/usr/bin/node
import * as Yargs from 'yargs';
import * as fse from 'fs-extra'
import * as path from 'path'

import { Loader } from './loader'
import { Session } from './session'
import {TestAgent} from './agent'

const argv = Yargs
.option('project', {
    alias:'p',
    default:'gentlest.json',
})
.option('interactive',{
    alias:'i',
    default:false
})
.command('init',
    "initialize project",
    (yargs)=>(yargs.option('project', {
        alias:'p',
        default:'gentlest.json'
    }).option('directory',{
        alias:'d',
        default:'gentlest'
    })),
    (initargs)=>{
        init(initargs)
    }
)
.argv

function init(args){
    let configfile = args.project
    
    if(fse.pathExistsSync(configfile)){
        exit(1, 'project already exists')
    }else{
        let json = fse.readJSONSync(path.join(__dirname, '../gentlest.json'))
        fse.ensureDirSync(args.directory)
        json.rootDir = args.directory
        fse.writeJSONSync(configfile, json)

        console.log("Created Gentlest Project")
        exit(0)
    }
}

function exit(status:number, message?: string){
    if(message){
        console.log(message)
    }
    process.exit(status)
}

let loader = new Loader(argv.project)
loader.loadConfig()
.catch((reason)=>{
    exit(1, reason)
})
.then(()=>{
    let session = new Session(loader)
    
    session.load()
    .catch((reason) => {
        exit(1, reason)
    }).then(()=>{
        console.log("Create Agent")
        let agent = new TestAgent(loader, session)
        return agent.beginInteractive()
    }).catch((reason)=>{
        exit(1, reason)
    }).then(()=>{
        exit(0)
    })
})




