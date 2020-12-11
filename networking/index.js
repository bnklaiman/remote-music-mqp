const db = firebase.firestore();
const CREATED = -1;
const READYING_UP = 0;
const PLAYING_MUSIC = 1;
const DONE_PLAYING = 2;
const LEAVE_BAND = 3;

//#region FINDING A BAND

/**
 * empty at the moment
 * runs when join page starts
 */
function onPageLoaded() {
}

/**
 * unhide forms and close button
 * @param {boolean} hostBool 
 */
function openForm(hostBool) {
	localStorage.setItem('isHost', hostBool);
	document.getElementById('createRoom').style.display = 'none';
	document.getElementById('joinRoom').style.display = 'none';
	document.getElementById('bandInfo').style.display = 'block';

	let formTitle = document.getElementById('joinChoice');
	if (hostBool) {
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
	let bandName = document.getElementById('band').value;
	let userName = document.getElementById('name').value;
	let passCode = 1;//document.getElementById('passcode').value;
	localStorage.setItem('user', userName);
	localStorage.setItem('band', bandName);
	

	const joinRef = db.collection('Bands').doc(bandName);

	if (localStorage.getItem('isHost') == 'true') {
		joinRef.get()
			.then((docSnapshot) => {
				if (docSnapshot.exists) {//Cannot make a band that already exists
					const errorRoom = document.getElementById('errorRoom');
					errorRoom.style.display = 'block';
					errorRoom.textContent = 'This band name is taken';
				} else {//Create the band!
					joinRef.set({
						bandname: bandName,
						members: {[userName] : 'none'},
						status: CREATED,
						passCode: passCode,
						createdAt: new Date().getTime(),
						host: userName
					}).then(() =>//redirect host to their room
						location.href = 'room.html'
					)
				}
			});
	}
	else{//member is trying to join the band instead
		joinRef.get().then((docSnapshot) => {
			if (docSnapshot.exists) {
				if (docSnapshot.data().members > 10) {//limit to 10 members
					const errorRoom = document.getElementById('errorRoom');
					errorRoom.style.display = 'block';
					errorRoom.textContent = 'This band has too many members - try another one';
				}
				else if (docSnapshot.data().status != READYING_UP) {//doesn't allow member to a join a band that is already playing
					const errorRoom = document.getElementById('errorRoom');
					errorRoom.style.display = 'block';
					errorRoom.textContent = 'The band is in the middle of playing! Wait until the room is open.';
				}
				else {
					joinRef//create the member under the band
					.update({
						['members.' + userName] : 'none'
					})
					.then(() =>//redirect to the room
							location.href = 'room.html'
					)
				}
			} 
			else {//band does not exist
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
}

//#endregion