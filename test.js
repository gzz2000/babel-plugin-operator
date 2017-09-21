
'bpo enable';

console.log('hello, world!');

class Point {
    x = 0;
    y = 0;

    constructor(_x, _y) {
	if(_x) this.x = _x;
	if(_y) this.y = _y;
    }

    toString = () => {
	return 'Point(' + this.x + ', ' + this.y + ')';
    }

    operatorAdd = (b) => {
	const a = this;
	return new Point(a.x + b.x, a.y + b.y);
    }

    operatorMul = (b) => {
	const a = this;
	return new Point(a.x * b, a.y * b);
    }

    operatorLess = (b) => {
	const a = this;
	if(a.x <= b.x && a.y <= b.y && (a.x < b.x || a.y < b.y)) return true;
	else return false;
    }

    operatorLessEqual = (b) => {
	const a = this;
	if(a.x <= b.x && a.y <= b.y) return true;
	else return false;
    }

    operatorEqual = (b) => {
	const a = this;
	return a.x == b.x && a.y == b.y;
    }
};

let a = new Point(1, 2), b = new Point(3, 4);

console.log((a + b * 3).toString());

let c = 'A string!';

String.prototype.operatorMul = function(times) {
    console.log(times);
    let ret = '';
    for(let i = 1; i <= times; ++i) ret += this;
    return ret;
};

let d = c * 3;

console.log(d);
