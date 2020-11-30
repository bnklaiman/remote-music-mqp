// geometry constants
//   we can effectively use however many sides we want,
//   but fewer than 3 sides is not a polygon and more than 8 can get visually confusing
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
let notes = ["C4", "C#4", "D4", "D#4", "E4", "F4", "F#4", "G4", "G#4", "A4", "A#4", "B4"];
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
let keyName = "A\u266F minor";

function setup() {
	createCanvas(windowWidth, windowHeight);
	rectMode(CENTER);
	noStroke();
}

function changeKey(key) {
	switch (key) {
		case "C_MAJOR": currentKey = C_MAJOR; keyName = "C major"; break;
		case "A_MINOR": currentKey = A_MINOR; keyName = "A minor"; break;

		case "F_MAJOR": currentKey = F_MAJOR; keyName = "F major"; break;
		case "B_FLAT_MAJOR": currentKey = B_FLAT_MAJOR; keyName = "Bb major"; break;
		case "E_FLAT_MAJOR": currentKey = E_FLAT_MAJOR; keyName = "Eb major"; break;
		case "A_FLAT_MAJOR": currentKey = A_FLAT_MAJOR; keyName = "Ab major"; break;
		case "D_FLAT_MAJOR": currentKey = D_FLAT_MAJOR; keyName = "Db major"; break;
		case "G_FLAT_MAJOR": currentKey = G_FLAT_MAJOR; keyName = "Gb major"; break;
		case "C_FLAT_MAJOR": currentKey = C_FLAT_MAJOR; keyName = "Cb major"; break;

		case "D_MINOR": currentKey = D_MINOR; keyName = "D minor"; break;
		case "G_MINOR": currentKey = G_MINOR; keyName = "G minor"; break;
		case "C_MINOR": currentKey = C_MINOR; keyName = "C minor"; break;
		case "F_MINOR": currentKey = F_MINOR; keyName = "F minor"; break;
		case "B_FLAT_MINOR": currentKey = B_FLAT_MINOR; keyName = "Bb minor"; break;
		case "E_FLAT_MINOR": currentKey = E_FLAT_MINOR; keyName = "Eb minor"; break;
		case "A_FLAT_MINOR": currentKey = A_FLAT_MINOR; keyName = "Ab minor"; break;

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
}
  
function draw() {
	background(0);

	// Text
	push();
	fill(255);
	textSize(20);
	textStyle(BOLD);
	text("    Music Info", width * 0.03, height * 0.1);
	textStyle(NORMAL);
	text("\nTempo: XXX BPM", width * 0.03, height * 0.1);
	text("\n\nKey: " + keyName, width * 0.03, height * 0.1);
	text("\n\n\nNotes:", width * 0.03, height * 0.1);
	stroke(255);
	strokeWeight(1);
	for (let i = 0; i < 7; i++) {
		fill(noteColor[currentKey[i]]);
		text(repeatChar(4 + i, "\n") + "  " + getNoteName(currentKey[i]), width * 0.03, height * 0.1);
	}
	noStroke();
	fill(255);
	
	textStyle(BOLD);
	text("    Connected Users", width * 0.8, height * 0.1);
	// iterate over all connected users here
	pop();

	// Main visualization area
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
		case 0:  return "C4";  break;
		case 1:  return "C#4"; break;
		case 2:  return "D4";  break;
		case 3:  return "D#4"; break;
		case 4:  return "E4";  break;
		case 5:  return "F4";  break;
		case 6:  return "F#4"; break;
		case 7:  return "G4";  break;
		case 8:  return "G#4"; break;
		case 9:  return "A4";  break;
		case 10: return "A#4"; break;
		case 11: return "B4";  break;
		default: return "error"; break;
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
				this.note = "C4";
		}
		this.timeAlive = 0;
	}

	display() {
		let color;
		switch (this.note) {
			case "C4":  color = "#FF0000"; break;
			case "C#4": color = "#FF8000"; break;
			case "D4":  color = "#FFFF00"; break;
			case "D#4": color = "#80FF00"; break;
			case "E4":  color = "#00FF00"; break;
			case "F4":  color = "#00FF80"; break;
			case "F#4": color = "#00FFFF"; break;
			case "G4":  color = "#0080FF"; break;
			case "G#4": color = "#0000FF"; break;
			case "A4":  color = "#8000FF"; break;
			case "A#4": color = "#FF00FF"; break;
			case "B4":  color = "#FF0080"; break;
			default:    color = "#FFFFFF"; break;
		}
		polygon(this.x, this.y, this.radius, this.scale, this.npoints, color);
		this.timeAlive += 1 / frameRate();
	}
} 