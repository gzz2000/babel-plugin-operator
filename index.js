
module.exports = function(babel) {
    var t = babel.types;

    var preCode = (function() {
	var _Op = (function(){
	    'bpo disable';

	    return {
		add(a, b) {
		    if(a.operatorAdd) return a.operatorAdd(b);
		    else return a + b;
		},

		sub(a, b) {
		    if(a.operatorSub) return a.operatorSub(b);
		    else return a - b;
		},

		mul(a, b) {
		    if(a.operatorMul) return a.operatorMul(b);
		    else return a * b;
		},

		div(a, b) {
		    if(a.operatorDiv) return a.operatorDiv(b);
		    else return a / b;
		},

		pow(a, b) {
		    if(a.operatorPow) return a.operatorPow(b);
		    else return a ** b;
		},

		binaryAnd(a, b) {
		    if(a.operatorBinaryAnd) return a.operatorBinaryAnd(b);
		    else return a & b;
		},

		binaryOr(a, b) {
		    if(a.operatorBinaryOr) return a.operatorBinaryOr(b);
		    else return a | b;
		},

		binaryXor(a, b) {
		    if(a.operatorBinaryXor) return a.operatorBinaryXor(b);
		    else return a ^ b;
		},

		binaryLShift(a, b) {
		    if(a.operatorBinaryLShift) return a.operatorBinaryLShift(b);
		    else return a << b;
		},

		binaryRShift(a, b) {
		    if(a.operatorBinaryRShift) return a.operatorBinaryRShift(b);
		    else return a >> b;
		},

		less(a, b) {
		    if(a.operatorLess) return a.operatorLess(b);
		    else if(b.operatorGreater) return b.operatorGreater(a);
		    else if(a.operatorGreaterEqual) return !a.operatorGreaterEqual(b);
		    else return a < b;
		},

		greater(a, b) {
		    if(a.operatorGreater) return a.operatorGreater(b);
		    else if(b.operatorLess) return b.operatorLess(a);
		    else if(a.operatorLessEqual) return !a.operatorLessEqual(b);
		    else return a > b;
		},

		lessEqual(a, b) {
		    if(a.operatorLessEqual) return a.operatorLessEqual(b);
		    else if(b.operatorGreaterEqual) return b.operatorGreaterEqual(a);
		    else if(a.operatorGreater) return !a.operatorGreater(b);
		    else return a <= b;
		},

		greaterEqual(a, b) {
		    if(a.operatorGreaterEqual) return a.operatorGreaterEqual(b);
		    else if(b.operatorLessEqual) return b.operatorLessEqual(a);
		    else if(a.operatorLess) return !a.operatorLess(b);
		    else return a >= b;
		},

		equal(a, b) {
		    if(a.operatorEqual) return a.operatorEqual(b);
		    else if(a.operatorNotEqual) return !a.operatorNotEqual(b);
		    else if(b.operatorEqual) return b.operatorEqual(a);
		    else if(b.operatorNotEqual) return !b.operatorNotEqual(a);
		    else return a == b;
		},

		notEqual(a, b) {
		    if(a.operatorNotEqual) return a.operatorNotEqual(b);
		    else if(a.operatorEqual) return !a.operatorEqual(b);
		    else if(b.operatorNotEqual) return b.operatorNotEqual(a);
		    else if(b.operatorEqual) return !b.operatorEqual(a);
		    else return a != b;
		},
	    };
	})();
    }).toString();

    preCode = preCode.slice(preCode.indexOf('{') + 1, preCode.lastIndexOf('}'));

    var preCodeAST = babel.template(preCode)({});

    function initStatus(path) {
	var firstBlockStatement = path.findParent(path => t.isBlockStatement(path.node) || t.isProgram(path.node));
	if(firstBlockStatement) {
	    for(directiveID in firstBlockStatement.node.directives) {
		let directive = firstBlockStatement.node.directives[directiveID];
		if(directive.value.value == 'bpo disable'){
		    path.node.BPO_HAVE_DEFAULT = true;
		    path.node.BPO_STATUS = false;
		    break;
		} else if(directive.value.value == 'bpo enable'){
		    path.node.BPO_HAVE_DEFAULT = true;
		    path.node.BPO_STATUS = true;
		    break;
		}
	    }
	    if(!path.node.BPO_HAVE_DEFAULT && firstBlockStatement.node.BPO_HAVE_DEFAULT) {
		path.node.BPO_HAVE_DEFAULT = true;
		path.node.BPO_STATUS = firstBlockStatement.node.BPO_STATUS;
	    }
	}
	if(!path.node.BPO_HAVE_DEFAULT) {
	    path.node.BPO_HAVE_DEFAULT = true;
	    path.node.BPO_STATUS = false;
	}
    }

    return {
	visitor: {
	    Program(path) {
		path.unshiftContainer('body', preCodeAST);
	    },
	    BlockStatement(path) {
		initStatus(path);
	    },
	    BinaryExpression(path) {
		initStatus(path, true);
		if(!path.node.BPO_STATUS) return;
		var tab = {
		    '+': 'add',
		    '-': 'sub',
		    '*': 'mul',
		    '/': 'div',
		    '**': 'pow',

		    '&': 'binaryAnd',
		    '|': 'binaryOr',
		    '^': 'binaryXor',
		    '<<': 'binaryLShift',
		    '>>': 'binaryRShift',
		    
		    '<': 'less',
		    '>': 'greater',
		    '<=': 'lessEqual',
		    '>=': 'greaterEqual',
		    '==': 'equal',
		    '!=': 'notEqual',
		};
		if(!(path.node.operator in tab)) return;
		path.replaceWith(
		    t.callExpression(
			t.MemberExpression(t.identifier('_Op'), t.identifier(tab[path.node.operator])),
			[path.node.left, path.node.right]
		    )
		);
	    },
	},
    };
};

