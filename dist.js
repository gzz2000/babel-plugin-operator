'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _Op_Add(a, b) {
    if (a.operatorAdd) return a.operatorAdd(b);
    return a + b;
}

function _Op_Sub(a, b) {
    if (a.operatorSub) return a.operatorSub(b);
    return a - b;
}

function _Op_Mul(a, b) {
    if (a.operatorMul) return a.operatorMul(b);
    return a * b;
}

function _Op_Div(a, b) {
    if (a.operatorDiv) return a.operatorDiv(b);
    return a / b;
}

function _Op_Less(a, b) {
    if (a.operatorLess) return a.operatorLess(b);else if (b.operatorGreater) return b.operatorGreater(a);else if (a.operatorGreaterEqual) return !a.operatorGreaterEqual(b);else return a < b;
}

function _Op_Greater(a, b) {
    if (a.operatorGreater) return a.operatorGreater(b);else if (b.operatorLess) return b.operatorLess(a);else if (a.operatorLessEqual) return !a.operatorLessEqual(b);else return a > b;
}

function _Op_LessEqual(a, b) {
    if (a.operatorLessEqual) return a.operatorLessEqual(b);else if (b.operatorGreaterEqual) return b.operatorGreaterEqual(a);else if (a.operatorGreater) return !a.operatorGreater(b);else return a <= b;
}

function _Op_GreaterEqual(a, b) {
    if (a.operatorGreaterEqual) return a.operatorGreaterEqual(b);else if (b.operatorLessEqual) return b.operatorLessEqual(a);else if (a.operatorLess) return !a.operatorLess(b);else return a >= b;
}

function _Op_Equal(a, b) {
    if (a.operatorEqual) return a.operatorEqual(b);else if (a.operatorNotEqual) return !a.operatorNotEqual(b);else if (b.operatorEqual) return b.operatorEqual(a);else if (b.operatorNotEqual) return !b.operatorNotEqual(a);else return a == b;
}

function _Op_NotEqual(a, b) {
    if (a.operatorNotEqual) return a.operatorNotEqual(b);else if (a.operatorEqual) return !a.operatorEqual(b);else if (b.operatorNotEqual) return b.operatorNotEqual(a);else if (b.operatorEqual) return !b.operatorEqual(a);else return a != b;
}

console.log('hello, world!');

var Point = function Point(_x, _y) {
    var _this = this;

    _classCallCheck(this, Point);

    this.x = 0;
    this.y = 0;

    this.toString = function () {
        return _Op_Add(_Op_Add(_Op_Add(_Op_Add('Point(', _this.x), ', '), _this.y), ')');
    };

    this.operatorAdd = function (b) {
        var a = _this;
        return new Point(_Op_Add(a.x, b.x), _Op_Add(a.y, b.y));
    };

    if (_x) this.x = _x;
    if (_y) this.y = _y;
};

;

var a = new Point(1, 2),
    b = new Point(3, 4);

console.log(_Op_Add(a, b).toString());

var c = 'A string!';

String.prototype.operatorMul = function (times) {
    console.log(times);
    var ret = '';
    for (var i = 1; _Op_LessEqual(i, times); ++i) {
        ret += this;
    }return ret;
};

var d = _Op_Mul(c, 3);

console.log(d);
