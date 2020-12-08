const db = firebase.firestore();
const READYING_UP = 0;
const PLAYING_MUSIC = 1;
const DONE_PLAYING = 2;
const instruments = [
	'conductor',
	'melody',
	'bass',
	'chord'
];


let memberName;
let memberDoc;
let memberRole;//reset on song start

let bandName;
let bandDoc;
let bandState;//reset on song start
let leaveBand;

let isHost = false;


//#region HELPER FUNCTIONS

/**
 * starts Timer for song for set number of minutes
 * @param {string} renderTarget 
 */
function startTimer(renderTarget) {
	const minutes = 1
	const currentTime = Date.parse(new Date());
	const deadline = new Date(currentTime + minutes * 60 * 1000);
	initializeClock(renderTarget, deadline);
}

/**
 * calculates time to target endtime
 * @param {number} endtime 
 */
function getTimeRemaining(endtime) {
	const total = Date.parse(endtime) - Date.parse(new Date());
	const seconds = Math.floor((total / 1000) % 60);
	const minutes = Math.floor((total / 1000 / 60) % 60);
	const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
	const days = Math.floor(total / (1000 * 60 * 60 * 24));

	return {
		total,
		days,
		hours,
		minutes,
		seconds
	};
}

/**
 * sets a clock div to count down
 * @param {string} id 
 * @param {number} endtime 
 */
function initializeClock(id, endtime) {//to use for backend stuff set id = false, take in function for end timer event
	const clock = document.getElementById(id);
	function updateClock() {
		const t = getTimeRemaining(endtime);
		clock.style.display = 'block';
		clock.innerHTML = 'days: ' + t.days + '<br>' +
			'hours: ' + t.hours + '<br>' +
			'minutes: ' + t.minutes + '<br>' +
			'seconds: ' + t.seconds;
		if (t.total <= 0) {
			clearInterval(timeinterval);
			if(isHost){
				bandDoc.update({
					status : DONE_PLAYING
				})
			}
		}
	}

	updateClock(); // run function once at first to avoid delay
	let timeinterval = setInterval(updateClock, 1000);
}

//#endregion



//#region FINDING A BAND

/**
 * empty at the moment
 * runs when join page starts
 */
function onPageLoaded() {

	//localStorage.clear();
	//add to count
	// db.doc('Members/allMembers')
	// 	.get()
	// 	.then(querySnap => {
	// 		console.log(`${querySnap.id} => ${querySnap.data().Count}`);

	// 		db.doc('Members/allMembers').update({
	// 			Count: querySnap.data().Count + 1
	// 		});
	// 	});
}

/**
 * unhide forms and close button
 * @param {boolean} hostBool 
 */
function openForm(hostBool) {
	isHost = hostBool;
	document.getElementById('createRoom').style.display = 'none';
	document.getElementById('joinRoom').style.display = 'none';
	document.getElementById('bandInfo').style.display = 'block';

	let formTitle = document.getElementById('joinChoice');
	if (isHost) {
		formTitle.style.display = 'block';
		formTitle.textContent = 'Create a Band';
	} else {
		formTitle.style.display = 'block';
		formTitle.textContent = 'Join a Band';
	}
}

/**
 * Attempts to create a new band or join existing one
 * Sets local storage for user and band to prep for page change
 * Will not create if band name exists as another
 * Will not join if band has more than 10 members, or if they are in the middle of playing
 */
function enterRoom() {

	bandName = document.getElementById('band').value;
	let userName = document.getElementById('name').value;
	let passCode = document.getElementById('passcode').value;
	localStorage.setItem('user', userName);
	localStorage.setItem('band', bandName);
	localStorage.setItem('isHost', isHost);

	const joinRef = db.collection('Bands').doc(bandName);

	if (isHost) {
		joinRef.get()
			.then((docSnapshot) => {
				if (docSnapshot.exists) {//Error
					const errorRoom = document.getElementById('errorRoom');
					errorRoom.style.display = 'block';
					errorRoom.textContent = 'This band name is taken';
				} else {
					joinRef.set({
						bandname: bandName,
						members: 0,
						status: READYING_UP,
						passCode: passCode,
						createdAt: new Date().getTime(),
						host: userName
					})
						.then(() =>
							//now make user a member of the band
							joinRef.collection('members').doc(userName).set({
								userName: userName,
								role: 'none',
							})
						).then(() =>
							location.href = 'room.html'
						)
				}
			});
	}
	else if (!isHost) {
		joinRef.get().then((docSnapshot) => {
			if (docSnapshot.exists) {
				//are they in the middle of a song?
				//are they full?
				//now make user a member of the band
				if (docSnapshot.data().members > 50) {
					const errorRoom = document.getElementById('errorRoom');
					errorRoom.style.display = 'block';
					errorRoom.textContent = 'This band has too many members - try another one';
				}
				else if (docSnapshot.data().status != READYING_UP) {
					const errorRoom = document.getElementById('errorRoom');
					errorRoom.style.display = 'block';
					errorRoom.textContent = 'The band is in the middle of playing! Wait until the room is open.';
				}
				else {

					joinRef.collection('members').doc(userName).set({
						userName: userName,
						role: 'none'
					})
						.then(() =>
							location.href = 'room.html'
						)
				}

			} else {
				const errorRoom = document.getElementById('errorRoom');
				errorRoom.style.display = 'block';
				errorRoom.textContent = 'The band you are looking for does not exist!';
			}
		});
	}


	/**
	 * if HOST
	 * check if band name already exists
	 * if exists, error, with 'Name Taken'
	 * else make band, add user
	 * 
	 * if JOINING
	 * check if band exists
	 * if exists, add member to band, redirect
	 * else error with 'band exists'
	 */



	//make band if host

}

//#endregion

//#region PLAYING A SONG


/**
 * Runs as soon as member joins music room
 * Sets all global variables, except member role and bandstate
 */
function onJoinRoom() {
	console.log('joining room');
	memberName = localStorage.getItem('user');
	bandName = localStorage.getItem('band');
	isHost = localStorage.getItem('isHost');

	memberDoc = db.doc(`Bands/${bandName}/members/${memberName}`);
	bandDoc = db.doc(`Bands/${bandName}`);

	document.getElementById('info').textContent = `Member Name: ${memberName}`;
	document.getElementById('instrument').textContent = `You are the ${instruments[90 % instruments.length]}`;
	if(isHost){
		document.getElementById('hostStart').style.display = '';
		console.log('should show button');
	}
	else if(!isHost){
		document.getElementById('hostStart').style.display = 'none';
		console.log('dont show button');

	}
	getBandInfo();
}

/**
 * Runs right after member joins room
 * Sets a band document listener to listen for band state
 * Continually updates number of members present
 */
function getBandInfo() {
	leaveBand = bandDoc.onSnapshot(function (doc) {
		console.log("SnapShot activated");

		//Band State changes
		const oldState = bandState;
		bandState = doc.data().status;
		if(oldState != bandState){
			console.log('Detected band state change: ' + oldState + ' to --> ' + bandState);
			bandStateChange(bandState);
		}

		bandDoc.collection('members').get().then(function (members) {
			let memberslist = members.docs.map(doc => doc.data());
			//console.log(`MembersList: ${memberslist}`);
			document.getElementById("allMembers").innerHTML = "Your Band: " + bandName + "<br>";

			memberslist.forEach(function (item, index) {
				document.getElementById("allMembers").innerHTML += index + ":" + item.userName + "<br>";
				//console.log(index, ' => ', item.userName);
			})

			bandDoc.update({//if memberslist is diff from current, snapshot will not rerun
				members: memberslist.length,
			})
		})
	})
}

/**
 * Changes UI of scene based on band state
 */
function bandStateChange(state){
	switch(state){
		case READYING_UP:
			//what UI elements are we hiding
			//which ones, if any are revealed?
			break;
		case PLAYING_MUSIC:
			//start Timer
			startTimer('clockdiv');
			break;
		case DONE_PLAYING:
			//hide music UI
			break;
		default:
			;
	}
}

/**
 * Based on role and boolean show or hide music UI
 * @param {string} role 
 */
function toggleMusicUI(role, show){
	switch(role){
		case 'conductor':
			break;
		default:
	}
}

/**
 * Host-only function
 * Updates band status to start everyone's timers
 * Triggers member assignment logic
 */
function beginSong() {
	//set band status to playing
	bandDoc.update({
		status: PLAYING_MUSIC
	})
	//assign member roles
	document.getElementById('hostStart').style.display = 'none';

}

/**
 * Runs as soon as timer ends
 * Shows buttons for play again or quit
 */
function endSong() {

}
//#endregion






// function onPageLeaving() {
// 	//subtract from count
// 	db.collection('Members')
// 		.doc('allMembers')
// 		.get()
// 		.then(querySnapshot => {
// 			db.doc('Members/allMembers').update({
// 				Count: querySnapshot.data().Count - 1
// 			});
// 		});
// }

// db.collection("users").doc("frank").update({
//     "age": 13,
//     "favorites.color": "Red"
// })
// .then(function() {
//     console.log("Document successfully updated!");
// });

//db.collection("users").get().then((querySnapshot) => {
//     querySnapshot.forEach((doc) => {
//         console.log(`${doc.id} => ${doc.data()}`);
//     });
// });

//The PLAN
//Members come in,
//Their id is the curent count
//Assign a random musical instrument from a list
//HOW DO I KNOW WHEN SOMEONE LEAVES???? ANSWER:  onbeforeunload event

// const docRef = db.collection("group-music-test").doc("Members");

// db.collection("Song1").where("MemberID", "==", "saalikperson")
//     .get()
//     .then(function(querySnapshot) {
//         querySnapshot.forEach(function(doc) {
//             // doc.data() is never undefined for query doc snapshots
//             console.log(doc.id, " => ", doc.data());
//         });
//     })
//     .catch(function(error) {
//         console.log("Error getting documents: ", error);
//     });

//     //create new collection,
//     db.collection("users").add({
//         first: "Boobles",
//         last: "Loj",
//         born: 2239
//     })
//     .then(function(docRef) {
//         console.log("Document written with ID: ", docRef.id);
//     })
//     .catch(function(error) {
//         console.error("Error adding document: ", error);
//     });

//     // Add a second document with a generated ID.
// db.collection("Song1/Members/mynewshit").add({
//     first: "Chunders",
//     middle: "mksl",
//     last: "acre",
//     born: 1912
// })
// .then(function(docRef) {
//     console.log("Noice");
// })
// .catch(function(error) {
//     console.error("Error adding document: ", error);
// });

// //check it
// db.collection("users").get().then((querySnapshot) => {
//     querySnapshot.forEach((doc) => {
//         console.log(`${doc.id} => ${doc.data()}`);
//     });