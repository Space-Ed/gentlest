
export const name = 'Test Coolness'

export interface Argument {
    name:string
}

export interface Result {
    coolness:string
}

export function run(args:Argument):Result{
    return {
        coolness: args.name === 'Edward'?'Very':'Hardly'
    }
}
