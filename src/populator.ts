import { Case } from "./interfaces";
import { TestCase } from "./testCase";
import { TestSituation } from "./situation";
import { TestAgent } from "./agent";
import { PassThrough } from "stream";

/**
 * The populator is a Cli context that deals with the creation of new cases,
 * it has a seperate vorpal instance which has commands specific to the creation of cases
 * a populator must have a case on hand, and it will also hold a kind of pathway 
 * through the case that is a walk through all the fields of the argument 
 *   
 */
export class PopulatorAgent {

    cli:any

    scene:TestSituation
    case:TestCase
    derefs:(string|number)[]

    constructor(private home:TestAgent){

    }



    /**
     * Attach this agent to the tty, this is the last instance to show, 
     */
    attachToTTY(){
        this.cli.delimiter(this.renderPrompt())
        this.cli.show()
    }

    renderPrompt():string {
        return this.case.index
    }

    createCLI(){

    }

    generateCase(){

    }

    setCase(){
        
    }

    setField(){

    }

    returnHome(){
        this.
    }

}


/**
 * A field is a populated entity that exists within a case and is responsible for dynamicising the values
 * a field is either an argument field(generator) or a result field (validator) 
 * fields have their own schema within the case definitions,
 * argument fields have generators which are iterable value creators that are called until returning undefined.
 * results are validators that throw errors with reason for failure and otherwise pass
 * a field is created by the case parsing system or from a generator and are serialized when thier case is
 * each kind of field is a function factory taking an interface for that kind
 * 
 * generators and validators should be entirely modular, that means that the installation of them involves 
 * adding an entry to a registry of possible validators
 * 
 * both the cli and data parsing must consider the complete capabilities and inform when things are beyond
 * 
 * much like a scene function this lends itself to allowing a generic type to be used to inform the creation 
 * of input values but lets not go crazy the input to parametrize a generator or validator should be shallow 
 * and static.
 * 
 * So there is a field loader facility that reads a configuration file that identifies all generator files and 
 * all validator files (recommended under gentlest) then this is done before loading any cases.  
 */

type GeneratorFactory = (data: any) => (index: number) => any;
type ValidatorFactory = (data: any) => (value: any) => void;

const generators: { [type: string]: GeneratorFactory} = {
    permutations : (items)=>{
        //create a function that explores all permutations of the 

        return function (){
            
        }
    }
 }



const validators: { [type: string]: ValidatorFactory} = {

}


 type generator  = (index:number) => any

 function parseField (field:FieldType) {
    switch (field.kind){
        case 'result': return field.factory(field.data)
        case 'argument': return field.factory(field.)
    }

 }
