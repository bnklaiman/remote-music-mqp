// music init
let notes = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
let noteColor = ["#FF0000", "#FF8000", "#FFFF00", "#80FF00", "#00FF00", "#00FF80", "#00FFFF", "#0080FF", "#0000FF", "#8000FF", "#FF00FF", "#FF0080"]

// all keys
const C_MAJOR = [0, 2, 4, 5, 7, 9, 11];
const A_MINOR = [9, 11, 0, 2, 4, 5, 7];

const F_MAJOR = [5, 7, 9, 10, 0, 2, 4];
const B_FLAT_MAJOR = [10, 0, 2, 3, 5, 7, 9];
const E_FLAT_MAJOR = [3, 5, 7, 8, 10, 0, 1];
const A_FLAT_MAJOR = [8, 10, 0, 1, 3, 5, 7];
const D_FLAT_MAJOR = [1, 3, 5, 6, 8, 10, 0];
const G_FLAT_MAJOR = [6, 8, 10, 11, 1, 3, 5];
const C_FLAT_MAJOR = [11, 1, 3, 4, 6, 8, 10];

const D_MINOR = [2, 4, 5, 7, 9, 10, 0];
const G_MINOR = [7, 9, 10, 0, 2, 3, 5];
const C_MINOR = [0, 2, 3, 5, 7, 8, 10];
const F_MINOR = [5, 7, 8, 10, 0, 1, 3];
const B_FLAT_MINOR = [10, 0, 1, 3, 5, 6, 8];
const E_FLAT_MINOR = [3, 5, 6, 8, 10, 11, 1];
const A_FLAT_MINOR = [8, 10, 11, 1, 3, 4, 6];

const G_MAJOR = [7, 9, 11, 0, 2, 4, 6];
const D_MAJOR = [2, 4, 6, 7, 9, 11, 1];
const A_MAJOR = [9, 11, 1, 2, 4, 6, 8];
const E_MAJOR = [4, 6, 8, 9, 11, 1, 3];
const B_MAJOR = [11, 1, 3, 4, 6, 8, 10];
const F_SHARP_MAJOR = [6, 8, 10, 11, 1, 3, 5];
const C_SHARP_MAJOR = [1, 3, 5, 6, 8, 10, 0];

const E_MINOR = [4, 6, 7, 9, 11, 0, 2];
const B_MINOR = [11, 1, 2, 4, 6, 7, 9];
const F_SHARP_MINOR = [6, 8, 9, 11, 1, 2, 4];
const C_SHARP_MINOR = [1, 3, 4, 6, 8, 9, 11];
const G_SHARP_MINOR = [8, 10, 11, 1, 3, 4, 6];
const D_SHARP_MINOR = [3, 5, 6, 8, 10, 11, 1];
const A_SHARP_MINOR = [10, 0, 1, 3, 5, 6, 8];

let currentKey = A_SHARP_MINOR; // Ab minor, for testing purposes

// canvas madness
let canvas0 = document.getElementById("canvas0");
let context0 = canvas0.getContext("2d");
let centerX0 = canvas0.width / 4;
let centerY0 = canvas0.height / 2;
let radius0 = document.getElementById("volume").value;

let canvas1 = document.getElementById("canvas1");
let context1 = canvas1.getContext("2d");
let centerX1 = canvas1.width / 4;
let centerY1 = canvas1.height / 2;
let radius1 = document.getElementById("volume").value;

let canvas2 = document.getElementById("canvas2");
let context2 = canvas2.getContext("2d");
let centerX2 = canvas2.width / 4;
let centerY2 = canvas2.height / 2;
let radius2 = document.getElementById("volume").value;

let canvas3 = document.getElementById("canvas3");
let context3 = canvas3.getContext("2d");
let centerX3 = canvas3.width / 4;
let centerY3 = canvas3.height / 2;
let radius3 = document.getElementById("volume").value;

let canvas4 = document.getElementById("canvas4");
let context4 = canvas4.getContext("2d");
let centerX4 = canvas4.width / 4;
let centerY4 = canvas4.height / 2;
let radius4 = document.getElementById("volume").value;

let canvas5 = document.getElementById("canvas5");
let context5 = canvas5.getContext("2d");
let centerX5 = canvas5.width / 4;
let centerY5 = canvas5.height / 2;
let radius5 = document.getElementById("volume").value;

let canvas6 = document.getElementById("canvas6");
let context6 = canvas6.getContext("2d");
let centerX6 = canvas6.width / 4;
let centerY6 = canvas6.height / 2;
let radius6 = document.getElementById("volume").value;

let canvas7 = document.getElementById("canvas7");
let context7 = canvas7.getContext("2d");
let centerX7 = canvas7.width / 4;
let centerY7 = canvas7.height / 2;
let radius7 = document.getElementById("volume").value;

// palette canvas inits
let pRadius = 50;

let palette0 = document.getElementById("palette0");
let pContext0 = palette0.getContext("2d");
let pCenterX0 = palette0.width / 4;
let pCenterY0 = palette0.height / 2;

let palette1 = document.getElementById("palette1");
let pContext1 = palette1.getContext("2d");
let pCenterX1 = palette1.width / 4;
let pCenterY1 = palette1.height / 2;

let palette2 = document.getElementById("palette2");
let pContext2 = palette2.getContext("2d");
let pCenterX2 = palette2.width / 4;
let pCenterY2 = palette2.height / 2;

let palette3 = document.getElementById("palette3");
let pContext3 = palette3.getContext("2d");
let pCenterX3 = palette3.width / 4;
let pCenterY3 = palette3.height / 2;

let palette4 = document.getElementById("palette4");
let pContext4 = palette4.getContext("2d");
let pCenterX4 = palette4.width / 4;
let pCenterY4 = palette4.height / 2;

let palette5 = document.getElementById("palette5");
let pContext5 = palette5.getContext("2d");
let pCenterX5 = palette5.width / 4;
let pCenterY5 = palette5.height / 2;

let palette6 = document.getElementById("palette6");
let pContext6 = palette6.getContext("2d");
let pCenterX6 = palette6.width / 4;
let pCenterY6 = palette6.height / 2;

let paletteRest = document.getElementById("palette-rest");
let pContextR = paletteRest.getContext("2d");
let pCenterWR = paletteRest.width;
let pCenterHR = paletteRest.height;

let cell0Filled = false;
let cell1Filled = false;
let cell2Filled = false;
let cell3Filled = false;
let cell4Filled = false;
let cell5Filled = false;
let cell6Filled = false;
let cell7Filled = false;

let cell0Type = "";
let cell1Type = "";
let cell2Type = "";
let cell3Type = "";
let cell4Type = "";
let cell5Type = "";
let cell6Type = "";
let cell7Type = "";

context0.scale(2, 1);
context1.scale(2, 1);
context2.scale(2, 1);
context3.scale(2, 1);
context4.scale(2, 1);
context5.scale(2, 1);
context6.scale(2, 1);
context7.scale(2, 1);

pContext0.scale(2, 1);
pContext1.scale(2, 1);
pContext2.scale(2, 1);
pContext3.scale(2, 1);
pContext4.scale(2, 1);
pContext5.scale(2, 1);
pContext6.scale(2, 1);
pContextR.scale(2, 1);

function resetCells() {
	context0.clearRect(0, 0, canvas0.width * 2, canvas0.height);
	context1.clearRect(0, 0, canvas1.width * 2, canvas1.height);
	context2.clearRect(0, 0, canvas2.width * 2, canvas2.height);
	context3.clearRect(0, 0, canvas3.width * 2, canvas3.height);
	context4.clearRect(0, 0, canvas4.width * 2, canvas4.height);
	context5.clearRect(0, 0, canvas5.width * 2, canvas5.height);
	context6.clearRect(0, 0, canvas6.width * 2, canvas6.height);
	context7.clearRect(0, 0, canvas7.width * 2, canvas7.height);
	
	cell0Filled = false;
	cell1Filled = false;
	cell2Filled = false;
	cell3Filled = false;
	cell4Filled = false;
	cell5Filled = false;
	cell6Filled = false;
	cell7Filled = false;

	cell0Type = "";
	cell1Type = "";
	cell2Type = "";
	cell3Type = "";
	cell4Type = "";
	cell5Type = "";
	cell6Type = "";
	cell7Type = "";
}

function fillInNoteCell(context, centerX, centerY, radius, color) {
	context.clearRect(0, 0, centerX * 2, centerY * 2);
	context.beginPath();
	context.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
	context.fillStyle = color;
	context.fill();
}

function fillInRestCell(context, w, h) {
	let margin = 50;
	context.lineWidth = 10;
	context.moveTo(margin / 2, margin / 2);
	context.lineTo((w / 2) - (margin / 2), h - (margin / 2));
	context.stroke();
	context.moveTo((w / 2) - (margin / 2), margin / 2);
	context.lineTo((margin / 2), h - (margin / 2));
	context.stroke();
}

function processInput(currentColor, inputType) {
	if (cell0Filled === false) {
		if (inputType === "note") {
			fillInNoteCell(context0, centerX0, centerY0, document.getElementById("volume").value, currentColor);
		} else if (inputType === "rest") {
			fillInRestCell(context0, canvas0.width, canvas0.height);
		}
		cell0Filled = true;
		console.log("Cell 0 filled.");
	} else if (cell1Filled === false) {
		if (inputType === "note") {
			fillInNoteCell(context1, centerX1, centerY1, document.getElementById("volume").value, currentColor);
		} else if (inputType === "rest") {
			fillInRestCell(context1, canvas1.width, canvas1.height);
		}
		cell1Filled = true;
		console.log("Cell 1 filled.");
	} else if (cell2Filled === false) {
		if (inputType === "note") {
			fillInNoteCell(context2, centerX2, centerY2, document.getElementById("volume").value, currentColor);
		} else if (inputType === "rest") {
			fillInRestCell(context2, canvas2.width, canvas2.height);
		}
		cell2Filled = true;
		console.log("Cell 2 filled.");
	} else if (cell3Filled === false) {
		if (inputType === "note") {
			fillInNoteCell(context3, centerX3, centerY3, document.getElementById("volume").value, currentColor);
		} else if (inputType === "rest") {
			fillInRestCell(context3, canvas3.width, canvas3.height);
		}
		cell3Filled = true;
		console.log("Cell 3 filled.");
	} else if (cell4Filled === false) {
		if (inputType === "note") {
			fillInNoteCell(context4, centerX4, centerY4, document.getElementById("volume").value, currentColor);
		} else if (inputType === "rest") {
			fillInRestCell(context4, canvas4.width, canvas4.height);
		}
		cell4Filled = true;
		console.log("Cell 4 filled.");
	} else if (cell5Filled === false) {
		if (inputType === "note") {
			fillInNoteCell(context5, centerX5, centerY5, document.getElementById("volume").value, currentColor);
		} else if (inputType === "rest") {
			fillInRestCell(context5, canvas5.width, canvas5.height);
		}
		cell5Filled = true;
		console.log("Cell 5 filled.");
	} else if (cell6Filled === false) {
		if (inputType === "note") {
			fillInNoteCell(context6, centerX6, centerY6, document.getElementById("volume").value, currentColor);
		} else if (inputType === "rest") {
			fillInRestCell(context6, canvas6.width, canvas6.height);
		}
		cell6Filled = true;
		console.log("Cell 6 filled.");
	} else if (cell7Filled === false) {
		if (inputType === "note") {
			fillInNoteCell(context7, centerX7, centerY7, document.getElementById("volume").value, currentColor);
		} else if (inputType === "rest") {
			fillInRestCell(context7, canvas7.width, canvas7.height);
		}
		cell7Filled = true;
		console.log("Cell 7 filled.");
	}
}

function input0() {
	let currentColor = noteColor[currentKey[0]];
	processInput(currentColor, "note");
}

function input1() {
	let currentColor = noteColor[currentKey[1]];
	processInput(currentColor, "note");
}

function input2() {
	let currentColor = noteColor[currentKey[2]];
	processInput(currentColor, "note");
}

function input3() {
	let currentColor = noteColor[currentKey[3]];
	processInput(currentColor, "note");
}

function input4() {
	let currentColor = noteColor[currentKey[4]];
	processInput(currentColor, "note");
}

function input5() {
	let currentColor = noteColor[currentKey[5]];
	processInput(currentColor, "note");
}

function input6() {
	let currentColor = noteColor[currentKey[6]];
	processInput(currentColor, "note");
}

function inputRest() {
	processInput("#000000", "rest");
}

// draw palette
fillInNoteCell(pContext0, pCenterX0, pCenterY0, pRadius, noteColor[currentKey[0]]);
fillInNoteCell(pContext1, pCenterX1, pCenterY1, pRadius, noteColor[currentKey[1]]);
fillInNoteCell(pContext2, pCenterX2, pCenterY2, pRadius, noteColor[currentKey[2]]);
fillInNoteCell(pContext3, pCenterX3, pCenterY3, pRadius, noteColor[currentKey[3]]);
fillInNoteCell(pContext4, pCenterX4, pCenterY4, pRadius, noteColor[currentKey[4]]);
fillInNoteCell(pContext5, pCenterX5, pCenterY5, pRadius, noteColor[currentKey[5]]);
fillInNoteCell(pContext6, pCenterX6, pCenterY6, pRadius, noteColor[currentKey[6]]);
fillInRestCell(pContextR, pCenterWR, pCenterHR);