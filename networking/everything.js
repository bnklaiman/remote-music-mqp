// regular polygonal geometry constants
//   we can effectively use however many sides we want,
//   but fewer than 3 sides is not a polygon and more than 8 can get visually confusing
//   also, pentagons and heptagons look awful with the rotation anyway
const TRIANGLE = 3;
const SQUARE   = 4;
const HEXAGON  = 6;
const OCTAGON  = 8;

// easing parameters
let min = 0;
let max = 1;
let step = 0.01;

const LIFESPAN = 3;

let shapes = [];

// music init
let notes = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

let noteColor = ["#FF0000", 
				 "#FF8000", 
				 "#FFFF00", 
				 "#80FF00", 
				 "#00FF00", 
				 "#00FF80", 
				 "#00FFFF", 
				 "#0080FF", 
				 "#0000FF", 
				 "#8000FF", 
				 "#FF00FF", 
				 "#FF0080"]

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
let keyName = "";
changeKey("A_SHARP_MINOR");

Tone.Transport.bpm.value = 120;
changeBPM(Tone.Transport.bpm.value);

// define instruments
const synth = new Tone.Synth().toDestination();
const fmSynth = new Tone.FMSynth().toDestination()
const polySynth = new Tone.PolySynth(Tone.Synth, {
	oscillator: {
		type: "fatsawtooth",
		count: 3,
		spread: 30
	},
	envelope: {
		attack: 0.01,
		decay: 0.1,
		sustain: 0.5,
		release: 0.4,
		attackCurve: "exponential"
	},
}).toDestination();
const piano = new Tone.Sampler({
	urls: {
		C4: "C4.mp3",
	},
	baseUrl: "../audio/"
}).toDestination();

// set up note playback
document.addEventListener('keydown', (event) => {
	switch (event.code) {
		case 'Digit1': synth.triggerAttackRelease(notes[currentKey[0]] + "4", "16n"); break;
		case 'Digit2': synth.triggerAttackRelease(notes[currentKey[1]] + "4", "16n"); break;
		case 'Digit3': synth.triggerAttackRelease(notes[currentKey[2]] + "4", "16n"); break;
		case 'Digit4': synth.triggerAttackRelease(notes[currentKey[3]] + "4", "16n"); break;
		case 'Digit5': synth.triggerAttackRelease(notes[currentKey[4]] + "4", "16n"); break;
		case 'Digit6': synth.triggerAttackRelease(notes[currentKey[5]] + "4", "16n"); break;
		case 'Digit7': synth.triggerAttackRelease(notes[currentKey[6]] + "4", "16n"); break;

		case 'KeyQ': fmSynth.triggerAttackRelease(notes[currentKey[0]] + "4", "16n"); break;
		case 'KeyW': fmSynth.triggerAttackRelease(notes[currentKey[1]] + "4", "16n"); break;
		case 'KeyE': fmSynth.triggerAttackRelease(notes[currentKey[2]] + "4", "16n"); break;
		case 'KeyR': fmSynth.triggerAttackRelease(notes[currentKey[3]] + "4", "16n"); break;
		case 'KeyT': fmSynth.triggerAttackRelease(notes[currentKey[4]] + "4", "16n"); break;
		case 'KeyY': fmSynth.triggerAttackRelease(notes[currentKey[5]] + "4", "16n"); break;
		case 'KeyU': fmSynth.triggerAttackRelease(notes[currentKey[6]] + "4", "16n"); break;

		case 'KeyA': polySynth.triggerAttackRelease(notes[currentKey[0]] + "4", "16n"); break;
		case 'KeyS': polySynth.triggerAttackRelease(notes[currentKey[1]] + "4", "16n"); break;
		case 'KeyD': polySynth.triggerAttackRelease(notes[currentKey[2]] + "4", "16n"); break;
		case 'KeyF': polySynth.triggerAttackRelease(notes[currentKey[3]] + "4", "16n"); break;
		case 'KeyG': polySynth.triggerAttackRelease(notes[currentKey[4]] + "4", "16n"); break;
		case 'KeyH': polySynth.triggerAttackRelease(notes[currentKey[5]] + "4", "16n"); break;
		case 'KeyJ': polySynth.triggerAttackRelease(notes[currentKey[6]] + "4", "16n"); break;

		// we want this to work, but it doesn't work with local files :/
		/*
		case 'KeyZ': piano.triggerAttackRelease(notes[currentKey[0]] + "2"); break;
		case 'KeyX': piano.triggerAttackRelease(notes[currentKey[1]] + "2"); break;
		case 'KeyC': piano.triggerAttackRelease(notes[currentKey[2]] + "2"); break;
		case 'KeyV': piano.triggerAttackRelease(notes[currentKey[3]] + "2"); break;
		case 'KeyB': piano.triggerAttackRelease(notes[currentKey[4]] + "2"); break;
		case 'KeyN': piano.triggerAttackRelease(notes[currentKey[5]] + "2"); break;
		case 'KeyM': piano.triggerAttackRelease(notes[currentKey[6]] + "2"); break;
		*/

		// so for now we're using the basic synth instead :)
		case 'KeyZ': synth.triggerAttackRelease(notes[currentKey[0]] + "4", "16n"); break;
		case 'KeyX': synth.triggerAttackRelease(notes[currentKey[1]] + "4", "16n"); break;
		case 'KeyC': synth.triggerAttackRelease(notes[currentKey[2]] + "4", "16n"); break;
		case 'KeyV': synth.triggerAttackRelease(notes[currentKey[3]] + "4", "16n"); break;
		case 'KeyB': synth.triggerAttackRelease(notes[currentKey[4]] + "4", "16n"); break;
		case 'KeyN': synth.triggerAttackRelease(notes[currentKey[5]] + "4", "16n"); break;
		case 'KeyM': synth.triggerAttackRelease(notes[currentKey[6]] + "4", "16n"); break;
	}
})

var canvas;

// initialize page and cell numbers for note grid
let currentPage = 1;
let currentCell = 1;
document.getElementById("note-grid-page-label").textContent = `Page ${currentPage}/4`;
document.getElementById("note-grid-cell-count").textContent = `Cell ${currentCell}`;
// maximum and minimum number of grid pages
const maxPages = 4;
const minPages = 1;
const maxCells = 8;

function nextPage() {
	if (!(currentPage + 1 > maxPages)) {
		document.getElementById("note-grid-page-label").textContent = `Page ${currentPage + 1}/4`;
		currentPage += 1;
	} else {
		console.log("Cannot go past maximum grid page!");
	}
}

function previousPage() {
	if (!(currentPage - 1 < minPages)) {
		document.getElementById("note-grid-page-label").textContent = `Page ${currentPage - 1}/4`;
		currentPage -= 1;
	} else {
		console.log("Cannot go past minimum grid page!");
	}
}



function setup() {
	canvas = createCanvas(windowWidth, windowHeight);
	canvas.position(0, 0);
	canvas.style('z-index', '-1');
	rectMode(CENTER);
	noStroke();
}

function processSongChange() {
	let newBPM = document.getElementById("conductor-bpm").value;
	let newKey = document.getElementById("keys").value;
	if (newBPM === "") {
		alert("The BPM field cannot be empty!");
	} else if (newKey === "") {
		// Shouldn't happen, but just in case
		alert("The key field cannot be empty!");
	} else {
		// we good, change the song info
		changeBPM(newBPM);
		changeKey(newKey);

		// update the note palette
		fillInNoteCell(pContext0, pCenterX0, pCenterY0, pRadius, noteColor[currentKey[0]]);
		fillInNoteCell(pContext1, pCenterX1, pCenterY1, pRadius, noteColor[currentKey[1]]);
		fillInNoteCell(pContext2, pCenterX2, pCenterY2, pRadius, noteColor[currentKey[2]]);
		fillInNoteCell(pContext3, pCenterX3, pCenterY3, pRadius, noteColor[currentKey[3]]);
		fillInNoteCell(pContext4, pCenterX4, pCenterY4, pRadius, noteColor[currentKey[4]]);
		fillInNoteCell(pContext5, pCenterX5, pCenterY5, pRadius, noteColor[currentKey[5]]);
		fillInNoteCell(pContext6, pCenterX6, pCenterY6, pRadius, noteColor[currentKey[6]]);
		fillInRestCell(pContextR, pCenterWR, pCenterHR);
	}
}

function changeBPM(bpm) {
	document.getElementById("bpm").textContent = bpm;
}

function changeKey(key) {
	switch (key) {
		case "C_MAJOR": currentKey = C_MAJOR; keyName = "C major"; break;
		case "A_MINOR": currentKey = A_MINOR; keyName = "A minor"; break;

		case "F_MAJOR": currentKey = F_MAJOR; keyName = "F major"; break;
		case "B_FLAT_MAJOR": currentKey = B_FLAT_MAJOR; keyName = "B\u266D major"; break;
		case "E_FLAT_MAJOR": currentKey = E_FLAT_MAJOR; keyName = "E\u266D major"; break;
		case "A_FLAT_MAJOR": currentKey = A_FLAT_MAJOR; keyName = "A\u266D major"; break;
		case "D_FLAT_MAJOR": currentKey = D_FLAT_MAJOR; keyName = "D\u266D major"; break;
		case "G_FLAT_MAJOR": currentKey = G_FLAT_MAJOR; keyName = "G\u266D major"; break;
		case "C_FLAT_MAJOR": currentKey = C_FLAT_MAJOR; keyName = "C\u266D major"; break;

		case "D_MINOR": currentKey = D_MINOR; keyName = "D minor"; break;
		case "G_MINOR": currentKey = G_MINOR; keyName = "G minor"; break;
		case "C_MINOR": currentKey = C_MINOR; keyName = "C minor"; break;
		case "F_MINOR": currentKey = F_MINOR; keyName = "F minor"; break;
		case "B_FLAT_MINOR": currentKey = B_FLAT_MINOR; keyName = "B\u266D minor"; break;
		case "E_FLAT_MINOR": currentKey = E_FLAT_MINOR; keyName = "E\u266D minor"; break;
		case "A_FLAT_MINOR": currentKey = A_FLAT_MINOR; keyName = "A\u266D minor"; break;

		case "G_MAJOR": currentKey = G_MAJOR; keyName = "G major"; break;
		case "D_MAJOR": currentKey = D_MAJOR; keyName = "D major"; break;
		case "A_MAJOR": currentKey = A_MAJOR; keyName = "A major"; break;
		case "E_MAJOR": currentKey = E_MAJOR; keyName = "E major"; break;
		case "B_MAJOR": currentKey = B_MAJOR; keyName = "B major"; break;
		case "F_SHARP_MAJOR": currentKey = F_SHARP_MAJOR; keyName = "F\u266F major"; break;
		case "C_SHARP_MAJOR": currentKey = C_SHARP_MAJOR; keyName = "C\u266F major"; break;

		case "E_MINOR": currentKey = E_MINOR; keyName = "E minor"; break;
		case "B_MINOR": currentKey = B_MINOR; keyName = "B minor"; break;
		case "F_SHARP_MINOR": currentKey = F_SHARP_MINOR; keyName = "F\u266F minor"; break;
		case "C_SHARP_MINOR": currentKey = C_SHARP_MINOR; keyName = "C\u266F minor"; break;
		case "G_SHARP_MINOR": currentKey = G_SHARP_MINOR; keyName = "G\u266F minor"; break;
		case "D_SHARP_MINOR": currentKey = D_SHARP_MINOR; keyName = "D\u266F minor"; break;
		case "A_SHARP_MINOR": currentKey = A_SHARP_MINOR; keyName = "A\u266F minor"; break;

		default: currentKey = C_MAJOR; keyName = "C major"; break;
	}
	document.getElementById("key").textContent = keyName;
	let noteListHTML = "";
	noteListHTML += "<ul id='notes'>";
	for (let i = 0; i < 7; i++) {
		noteListHTML += "<li><strong><span style=\"color:" + noteColor[currentKey[i]] + ";\">" + notes[currentKey[i]] + "</span></strong></li>";
	}
	noteListHTML += "</ul>";
	document.getElementById("notes").outerHTML = noteListHTML;
}
  
function draw() {
	// Main visualization area
	background(0);
	translate(width / 2, height / 2);
	rotate(frameCount / 600);
	for (let i = 0; i < shapes.length; i++) {
		push();
		if (shapes[i].timeAlive > LIFESPAN) {
			deleteItem(i, shapes);
		} else {
			shapes[i].display();
			if (shapes[i].scale >= 0) shapes[i].scale -= 0.05;
		}
		pop();
	}
}

function getNoteName(note) {
	switch (note) {
		case 0:  return "C";
		case 1:  return "C#";
		case 2:  return "D";
		case 3:  return "D#";
		case 4:  return "E";
		case 5:  return "F";
		case 6:  return "F#";
		case 7:  return "G";
		case 8:  return "G#";
		case 9:  return "A";
		case 10: return "A#";
		case 11: return "B";
		default: return "error";
	}
}

function deleteItem(item, array) {
	array.splice(item, 1);
}

function keyPressed() {
	shapes.push(new Shape());
	// return false;  // prevent default key behavior
}

function polygon(x, y, radius, scale, npoints, color) {
	fill(color);
	let angle = TWO_PI / npoints;
	beginShape();
	for (let a = 0; a < TWO_PI; a += angle) {
		let sx = x + cos(a) * (radius * scale);
		let sy = y + sin(a) * (radius * scale);
		vertex(sx, sy);
	}
	endShape(CLOSE);
}

class Shape {
	constructor() {
		this.x = random(-width * 0.2, width * 0.2);
		this.y = random(-height * 0.4, height * 0.4);
		this.scale = 1.0;
		this.radius = 82;
		switch (keyCode) {
			case 49: case 50: case 51: case 52: case 53: case 54: case 55:
				this.npoints = TRIANGLE; break;
			case 81: case 87: case 69: case 82: case 84: case 89: case 85:
				this.npoints = SQUARE; break;
			case 65: case 83: case 68: case 70: case 71: case 72: case 74:
				this.npoints = HEXAGON; break;
			case 90: case 88: case 67: case 86: case 66: case 78: case 77:
				this.npoints = OCTAGON; break;
			default:
				this.npoints = TRIANGLE; break;
		}
		switch(keyCode) {
			case 49: case 81: case 65: case 90:
				this.note = getNoteName(currentKey[0]); break;
			case 50: case 87: case 83: case 88:
				this.note = getNoteName(currentKey[1]); break;
			case 51: case 69: case 68: case 67:
				this.note = getNoteName(currentKey[2]); break;
			case 52: case 82: case 70: case 86:
				this.note = getNoteName(currentKey[3]); break;
			case 53: case 84: case 71: case 66:
				this.note = getNoteName(currentKey[4]); break;
			case 54: case 89: case 72: case 78:
				this.note = getNoteName(currentKey[5]); break;
			case 55: case 85: case 74: case 77:
				this.note = getNoteName(currentKey[6]); break;
			default:
				this.note = "C";
		}
		this.timeAlive = 0;
	}

	display() {
		let color;
		switch (this.note) {
			case "C":  color = "#FF0000"; break;
			case "C#": color = "#FF8000"; break;
			case "D":  color = "#FFFF00"; break;
			case "D#": color = "#80FF00"; break;
			case "E":  color = "#00FF00"; break;
			case "F":  color = "#00FF80"; break;
			case "F#": color = "#00FFFF"; break;
			case "G":  color = "#0080FF"; break;
			case "G#": color = "#0000FF"; break;
			case "A":  color = "#8000FF"; break;
			case "A#": color = "#FF00FF"; break;
			case "B":  color = "#FF0080"; break;
			default:   color = "#FFFFFF"; break;
		}
		polygon(this.x, this.y, this.radius, this.scale, this.npoints, color);
		this.timeAlive += 1 / frameRate();
	}
} 

// controls

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

// cell grid init
let cell0Filled = false;
let cell1Filled = false;
let cell2Filled = false;
let cell3Filled = false;
let cell4Filled = false;
let cell5Filled = false;
let cell6Filled = false;
let cell7Filled = false;

// canvas context scaling
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

function resetPattern() {
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

	currentCell = 1;
	document.getElementById("note-grid-cell-count").textContent = `Cell ${currentCell}`;
}

function fillInNoteCell(context, centerX, centerY, radius, color) {
	context.clearRect(0, 0, centerX * 2, centerY * 2);
	context.beginPath();
	context.strokeStyle = "rgba(1, 1, 1, 0)";
	context.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
	context.fillStyle = color;
	context.fill();
}

function fillInRestCell(context, w, h) {
	let margin = 50;
	context.lineWidth = 10;
	context.strokeStyle = "#FFFFFF";
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

	if (!(currentCell + 1 > maxCells) && !cell7Filled) {
		currentCell += 1;
		document.getElementById("note-grid-cell-count").textContent = `Cell ${currentCell}`;
	} else {
		document.getElementById("note-grid-cell-count").textContent = "";
		console.log("Cannot go past maximum cell count!");
	}
}

// run one of these when a user selects a note or rest
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
	processInput("#FFFFFF", "rest");
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