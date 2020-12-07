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
let keyName = "";
changeKey("A_SHARP_MINOR");

var canvas;

function setup() {
	canvas = createCanvas(windowWidth, windowHeight);
	canvas.position(0, 0);
	canvas.style('z-index', '-1');
	rectMode(CENTER);
	noStroke();
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

function repeatChar(count, char) {
	output = "";
	for (let i = 0; i < count; i++) {
		output += char;
	}
	return output;
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
			default:    color = "#FFFFFF"; break;
		}
		polygon(this.x, this.y, this.radius, this.scale, this.npoints, color);
		this.timeAlive += 1 / frameRate();
	}
} 