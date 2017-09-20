# react-plugin-operator

## Description
This is a [babel](https://github.com/babel/babel) plugin that adds operator overloading into javascript.

## Examples
### 1
Below is an example that implemented a simple Point or Vector on a planar. We should allow programmer to `add` two Points or to `multiply` one Point by a certain factor.
``` javascript
class Point {
    x = 0;
    y = 0;

    constructor(_x, _y) {
		if(_x) this.x = _x;
		if(_y) this.y = _y;
    }

    operatorAdd = (b) => {
		const a = this;
		return new Point(a.x + b.x, a.y + b.y);
    }

    operatorMul = (b) => {
		const a = this;
		return new Point(a.x * b, a.y * b);
    }
};
```

And below is the usage of it.
``` javascript
let a = new Point(1, 2), b = new Point(3, 4);

console.log(a + b * 3);
```

### 2
``` javascript
String.prototype.operatorMul = function(times) {
    console.log(times);
    let ret = '';
    for(let i = 1; i <= times; ++i) ret += this;
    return ret;
};
```

After this, we can:
``` javascript
let c = 'A string!';
let d = c * 3;
console.log(d);		//would be 'A string!A string!A string!'
```

### More...
It can be more. For example, by adding this plugin with [Crunch](https://github.com/vukicevic/crunch), we'll get an arbitrary-precision integer type that can be used conveniently.

## Installation
### Taste it now
This project is actually a source code compiler, see [Principle](#principle) for more.

The fastest way to use it is downloading this repo and run

```
node run.js source.js > dest.js
```

and the `dest.js` is yours.

### Install it
For it's based on babel, you can use it wherever you can use babel. Additional source mapping will be available for you to debug.

First you should make your [babel](https://github.com/babel/babel) working.

And install the package.

```
npm install babel-plugin-operator --save
```

And configure your `.babelrc`.

``` javascript
{
  "presets": ["es2015", "react", "stage-2"],
  "plugins": ["operator"]
}
```


## Usage
First, insert a certain function into your class.

``` javascript
'+': 'operatorAdd',
'-': 'operatorSub',
'*': 'operatorMul',
'/': 'operatorDiv',
'**': 'operatorPow',

'&': 'operatorBinaryAnd',
'|': 'operatorBinaryOr',
'^': 'operatorBinaryXor',
'<<': 'operatorBinaryLShift',
'>>': 'operatorBinaryRShift',

'<': 'operatorLess',
'>': 'operatorGreater',
'<=': 'operatorLessEqual',
'>=': 'operatorGreaterEqual',
'==': 'operatorEqual',
'!=': 'operatorNotEqual',
```

Make the function accept one parameter as the right data, `this` as the left data, and do what you like.

> Hint: For the comparison operators, we will call the propriate function for you. This means if you only declared a `operatorLess`, you will get `< > <= >=` all work right. Defining other functions is only needed if you need a special comparison rule such as a partial order.

## Principle
This is a plugin of babeljs. By simply modifying the AST, it will replace

``` javascript
a + b
```

with

``` javascript
_Op_Add(a, b)
```