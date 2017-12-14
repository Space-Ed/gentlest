## Gentlest

The test runner for gentlepersons

### rules of the gentry
- one does not mix up test case data with execution scenarios
- one prefers to not touch cases instead delegating generators to create them
- one uses Typescript interfaces to create schema

A test runner for generative prompt testing, a testing strategy involving an interactive CLI that guides the creation of test cases for 

### Installation

``` npm install -g gentlest```

### Usage 

setup in your project directory
```
gentlest init
```

write a test scenario file
eg. gentlest/arroganceTest.ts

```javascript
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
```

run the tests

```
> gentlest
```


