(function() {
	'use strict';
	const LIST_NAME = 'i_{nputs}';
	
	// key is the js name of the key being pressed
	// to know key names use this: https://keycode.info/
	// value is the value you want to insert into Desmos when the key is active
	// state is for internal use
	const KEYS = [
		{key: 'KeyF', value: '1', state: false},
		{key: 'KeyG', value: '2', state: false},
		{key: 'KeyH', value: '3', state: false},
		{key: 'KeyJ', value: '4', state: false},
		
		{key: 'ArrowLeft', value: '1', state: false},
		{key: 'ArrowDown', value: '2', state: false},
		{key: 'ArrowUp', value: '3', state: false},
		{key: 'ArrowRight', value: '4', state: false},
	];
	
	let keyListID = captureVar(LIST_NAME);
	let tInterval = 16; // loop interval in milliseconds
	
	if (keyListID == null) {
		keyListID = LIST_NAME
		Calc.setExpression({
			id: LIST_NAME,
			latex: String.raw`${LIST_NAME}=\left[\right]`
		})
	}
	
	messageLoop();
	
	function messageLoop() {
		let values = [];
		KEYS.forEach((item, i) => {
			if (item.state) {
				values.push(item.value);
			}
		});
		
		if (values.length > 0) {
			setVar(
				keyListID,
				LIST_NAME,
				String.raw`\left[${values.join(',')}\right]`
			);
		} else {
			setVar(
				keyListID,
				LIST_NAME,
				String.raw`\left[1,2,3,4,\right]`
			);
		}
		
		requestAnimationFrame(messageLoop, tInterval);
	}
	
	window.addEventListener('keydown', (e) => {
		
		// do something only when the target isn't a textinput
		if (e.target.nodeName.toLowerCase() === 'body') {
			// prevent caps lock from killing the code
			let cKey = e.code;
			
			KEYS.forEach((item, i) => {
				if (item.key === cKey) {
					item.state = true;
				}
			});
			
		}
	});
	
	window.addEventListener('keyup', (e) => {
		// do something only when the target isn't a textinput
		if (e.target.nodeName.toLowerCase() === 'body') {
			// prevent caps lock from killing the code
			let cKey = e.code;
			
			KEYS.forEach((item, i) => {
				if (item.key === cKey) {
					item.state = false;
				}
			});
			
		}
	});
	
	function setVar(id, varName, value) {
		Calc.setExpression({
			id: id,
			latex: `${varName}=${value}`
		});
	}
	
	function filterExprAssignment(exprs, varNames) {
		let rxFilter = new RegExp(String.raw`^((?:${varNames.join('|')})=)(.+)$`, '');
		
		return exprs.filter((exp) => {
			if (exp.hasOwnProperty('latex')) {
				return rxFilter.test(exp.latex);
			}
			
			return false;
		});
	}
	
	function captureVar(varName) {
		let exprs = Calc.getState().expressions.list;
		// get array with expressions containing sought variables
		let expItem = filterExprAssignment(exprs, [varName]);
		
		if (expItem.length > 0) return expItem[0].id;
		else return null;
	}
	
}());
