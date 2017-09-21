# babel-plugin-operator

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
after this, we can:

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
This project can be used as a source code converter, see [Principle](#principle) for more information.

The fastest way to use it is downloading this repo and run

```
node run.js source.js > dest.js
```

and check `dest.js` and run it.

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
  "presets": ["es2015", "stage-2"],
  "plugins": ["operator"]
}
```


## Usage
First, put a magic word at the very top of your source file:
``` javascript
'bpo enable';
```
This will make the overloading available in the whole file.

After that, all you need to do is to insert a certain function into your class, which can calculate the right answer for an operator.

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

For example, `a + b` will be redirected to `a.operatorAdd(b)`. If `a` doesn't have a function named `operatorAdd`, the operator falls back to the original `+`.

> Hint: For the comparison operators, we will call the propriate function for you. This means if you only declared a `operatorLess`, you will get `< > <= >=` all work right. Defining other functions is only needed if you need a special comparison rule such as a partial order. Same to `operatorEqual` and `operatorNotEqual`.

## Principle
This is a plugin of babeljs. By simply modifying the AST, it will replace

``` javascript
a + b
```

with

``` javascript
_Op.add(a, b)
```

while `_Op.add` is like this:

``` javascript
add(a, b) {
	if(a.operatorAdd) return a.operatorAdd(b);
	else return a + b;
}
```

## Controllers
Because that we implemented this by replacing calculations with function calls, it may cause lack of speed. Our suggestion is that we disable the overloading in some functions which have intensive computing.

The way to do this is to add a string in front of the function body as a mark:

``` javascript
function foo() {
	'bpo disable';
    //your code
}
```

Actually, the plugin is disabled by default, so we added a string `'bpo enable';` in front of the file just now. if we remove it, we can add it to certain functions that need the overloading.