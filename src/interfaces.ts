
export interface GentlestConfig {
    rootDir: string,
    caseFileName: string,
    testFiles:string  
}

export interface Case {
    result:any,
    argument:any
    meta:any
}


export interface SituationResult {
    total
    caseResults: CaseRunResult
}

export interface CaseRunResult {

}

export interface Gap {
    fill: (value: any) => boolean,
    type: 'string'
}

