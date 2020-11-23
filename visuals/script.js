// geometry constants
//   we can effectively use however many sides we want,
//   but fewer than 3 sides is not a polygon and more than 8 can get visually confusing
const TRIANGLE = 3;
const SQUARE   = 4;
const PENTAGON = 5;
const HEXAGON  = 6;
const HEPTAGON = 7;
const OCTAGON  = 8;

// easing parameters
let min = 0;
let max = 1;
let step = 0.01;

const LIFESPAN = 3;

let shapes = [];

function setup() {
	createCanvas(windowWidth, windowHeight);
	rectMode(CENTER);
	noStroke();
}
  
function draw() {
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

function deleteItem(item, array) {
	array.splice(item, 1);
}

function keyPressed() {
	shapes.push(new Shape());
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
		this.npoints = TRIANGLE;
		this.note = "C4";
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