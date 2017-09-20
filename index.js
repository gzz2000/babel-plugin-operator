
module.exports = function(babel) {
    var t = babel.types;

    var preCode = (function() {
	function _Op_Add(a, b) {
	    if(a.operatorAdd) return a.operatorAdd(b);
	    else return a + b;
	}

	function _Op_Sub(a, b) {
	    if(a.operatorSub) return a.operatorSub(b);
	    else return a - b;
	}

	function _Op_Mul(a, b) {
	    if(a.operatorMul) return a.operatorMul(b);
	    else return a * b;
	}

	function _Op_Div(a, b) {
	    if(a.operatorDiv) return a.operatorDiv(b);
	    else return a / b;
	}

	function _Op_Pow(a, b) {
	    if(a.operatorPow) return a.operatorPow(b);
	    else return a ** b;
	}

	function _Op_BinaryAnd(a, b) {
	    if(a.operatorBinaryAnd) return a.operatorBinaryAnd(b);
	    else return a & b;
	}

	function _Op_BinaryOr(a, b) {
	    if(a.operatorBinaryOr) return a.operatorBinaryOr(b);
	    else return a | b;
	}

	function _Op_BinaryXor(a, b) {
	    if(a.operatorBinaryXor) return a.operatorBinaryXor(b);
	    else return a ^ b;
	}

	function _Op_BinaryLShift(a, b) {
	    if(a.operatorBinaryLShift) return a.operatorBinaryLShift(b);
	    else return a << b;
	}

	function _Op_BinaryRShift(a, b) {
	    if(a.operatorBinaryRShift) return a.operatorBinaryRShift(b);
	    else return a >> b;
	}

	function _Op_Less(a, b) {
	    if(a.operatorLess) return a.operatorLess(b);
	    else if(b.operatorGreater) return b.operatorGreater(a);
	    else if(a.operatorGreaterEqual) return !a.operatorGreaterEqual(b);
	    else return a < b;
	}

	function _Op_Greater(a, b) {
	    if(a.operatorGreater) return a.operatorGreater(b);
	    else if(b.operatorLess) return b.operatorLess(a);
	    else if(a.operatorLessEqual) return !a.operatorLessEqual(b);
	    else return a > b;
	}

	function _Op_LessEqual(a, b) {
	    if(a.operatorLessEqual) return a.operatorLessEqual(b);
	    else if(b.operatorGreaterEqual) return b.operatorGreaterEqual(a);
	    else if(a.operatorGreater) return !a.operatorGreater(b);
	    else return a <= b;
	}

	function _Op_GreaterEqual(a, b) {
	    if(a.operatorGreaterEqual) return a.operatorGreaterEqual(b);
	    else if(b.operatorLessEqual) return b.operatorLessEqual(a);
	    else if(a.operatorLess) return !a.operatorLess(b);
	    else return a >= b;
	}

	function _Op_Equal(a, b) {
	    if(a.operatorEqual) return a.operatorEqual(b);
	    else if(a.operatorNotEqual) return !a.operatorNotEqual(b);
	    else if(b.operatorEqual) return b.operatorEqual(a);
	    else if(b.operatorNotEqual) return !b.operatorNotEqual(a);
	    else return a == b;
	}

	function _Op_NotEqual(a, b) {
	    if(a.operatorNotEqual) return a.operatorNotEqual(b);
	    else if(a.operatorEqual) return !a.operatorEqual(b);
	    else if(b.operatorNotEqual) return b.operatorNotEqual(a);
	    else if(b.operatorEqual) return !b.operatorEqual(a);
	    else return a != b;
	}

	'START REPLACING: operator_overload!';
    }).toString();

    preCode = preCode.slice(preCode.indexOf('{') + 1, preCode.lastIndexOf('}'));

    var preCodeAST = babel.template(preCode)({});

    var beginReplace = false;

    return {
	visitor: {
	    Program(path, file) {
		path.unshiftContainer('body', preCodeAST);
	    },
	    StringLiteral(path) {
		if(path.node.value == 'START REPLACING: operator_overload!') {
		    beginReplace = true;
		    return path.remove();
		}
	    },
	    BinaryExpression(path) {
		if(!beginReplace || path.node.SHOULDNT_REPLACE) {
		    path.node.SHOULDNT_REPLACE = true;
		    return;
		}
		var tab = {
		    '+': '_Op_Add',
		    '-': '_Op_Sub',
		    '*': '_Op_Mul',
		    '/': '_Op_Div',
		    '**': '_Op_Pow',

		    '&': '_Op_BinaryAnd',
		    '|': '_Op_BinaryOr',
		    '^': '_Op_BinaryXor',
		    '<<': '_Op_BinaryLShift',
		    '>>': '_Op_BinaryRShift',
		    
		    '<': '_Op_Less',
		    '>': '_Op_Greater',
		    '<=': '_Op_LessEqual',
		    '>=': '_Op_GreaterEqual',
		    '==': '_Op_Equal',
		    '!=': '_Op_NotEqual',
		};
		if(!(path.node.operator in tab)) return;
		path.replaceWith(
		    t.callExpression(
			t.identifier(tab[path.node.operator]),
			[path.node.left, path.node.right]
		    )
		);
	    },
	}
    };
};

