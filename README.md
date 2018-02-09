## bestest

## The ultimate testing environment will enable developers to 

increase the failure rate by making it easy to create new tests
express cases clearly and concicely
have instant feedback when a test is broken
Generate cases combinatorially and permutatively
populate expected results by prompt
provide information about test counts
integrates with code coverage tools effectively
provides useful information on failures
allows you to focus on one thing at a time 

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

``` bash
$ gentlest
```

``` bash
$ gentlest -i 
```

will begin an interactive prompt.

```
<current situation> ~ <current test case> -|
```


```
-| help

Commands:

    help [command...]  Provides help for a given command.
    exit               Exits application.
    test [options]     Executes tests
    show [options]     information about current position
    next               Move to next case
    restart            go back to the beginning
```

from here we can run tests.

```
-| test

Running single case
-0-
status: passing

```

### Workflows

tight cycle testing
test -> develop 

stage feature -> check regression 

