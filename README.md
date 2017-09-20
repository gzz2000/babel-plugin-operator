# react-plugin-operator

## Description
This is a [babel](https://github.com/babel/babel) plugin that adds operator overloading into javascript.

## Examples
### 1
Below is an example that implemented a simple Point or Vector on a planar. We should allow programmer to `add` two Points or to `multiply` one Point by a certain factor.
```
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
```
let a = new Point(1, 2), b = new Point(3, 4);

console.log(a + b * 3);
```

### 2
```
String.prototype.operatorMul = function(times) {
    console.log(times);
    let ret = '';
    for(let i = 1; i <= times; ++i) ret += this;
    return ret;
};
```

After this, we can:
```
let c = 'A string!';
let d = c * 3;
console.log(d);		//would be 'A string!A string!A string!'
```

### More...
It can be more. For example, by adding this plugin with [Crunch](https://github.com/vukicevic/crunch), we'll get an arbitrary-precision integer type that can be used conveniently.

## Installation
First you should make your [babel](https://github.com/babel/babel) working.

And install the package.

```
pending...
```

And configure your `.babelrc`.

```
pending...
```


## Usage
First, insert a certain function into your class.

```
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

```
a + b
```

with

```
_Op_Add(a, b)
```