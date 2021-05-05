window.index = function() {
	const db = firebase.firestore();
	const CREATED = -1;
	const READYING_UP = 0;
	const PLAYING_MUSIC = 1;
	const DONE_PLAYING = 2;
	const LEAVE_BAND = 3;

	//#region FINDING A BAND

	/**
	 * definitely not empty at the moment
	 * runs when join page starts
	 */
	const onPageLoaded = () => {
		document.getElementById('music-info').style.display = 'none';
		document.getElementById('mainRoom').style.display = 'none';
		document.getElementById('user-controls').style.display = 'none';
		document.getElementById('conductor-controls').style.display = 'none';
	}

	/**
	 * unhide forms and close button
	 * @param {boolean} hostBool 
	 */
	const openForm = (hostBool) => {
		localStorage.setItem('isHost', hostBool);
		document.getElementById('createRoom').style.display = 'none';
		document.getElementById('joinRoom').style.display = 'none';
		document.getElementById('bandInfo').style.display = 'block';

		let formTitle = document.getElementById('joinChoice');
		let bandInfo = document.getElementById('bandInfo');
		bandInfo.style.visibility = 'block';
		if (hostBool) {
			formTitle.style.visibility = 'block';
			formTitle.textContent = 'Create a Band';
		} else {
			formTitle.style.visibility = 'block';
			formTitle.textContent = 'Join a Band';
		}
	}

	// Returns to the Create/Join Band menu
	const goBack = () => {
		document.getElementById('bandInfo').style.display = 'none';
		document.getElementById('createRoom').style.display = 'inline';
		document.getElementById('joinRoom').style.display = 'inline';
	}

	/**
	 * Attempts to create a new band or join existing one
	 * Sets local storage for user and band to prep for page change
	 * Will not create if band name exists as another
	 * Will not join if band has more than 4 members, or if they are in the middle of playing
	 */
	const enterRoom = () => {
		let bandName = document.getElementById('band').value;
		let userName = document.getElementById('name').value;
		let passCode = 1;//document.getElementById('passcode').value;
		localStorage.setItem('user', userName);
		localStorage.setItem('band', bandName);
		
		const joinRef = db.collection('Bands').doc(bandName);

		if (localStorage.getItem('isHost') == 'true') {  // trying to create a band
			bandInfo.style.visibility = 'none';
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
							host: userName,
							music : {},
							bpm : 60,
							key : 'C#'
						}).then((docRef) => {
							// Band added successfully
							document.getElementById('bandInfo').style.display = 'none';
							document.getElementById('mainRoom').style.display = 'block';
							room.onJoinRoom();
						}).catch((error) => {
							console.error("Error adding band: ", error);
						});
						document.getElementById('bandInfo').style.display = 'none';
					}
				});
		} else {  //member is trying to join the band instead
			bandInfo.style.visibility = 'none';
			joinRef.get().then((docSnapshot) => {
				if (docSnapshot.exists) {
					if (docSnapshot.data().members > 4) {//limit to 4 members
						const errorRoom = document.getElementById('errorRoom');
						errorRoom.style.display = 'block';
						errorRoom.textContent = 'This band has too many members - try another one';
					}
					else if (docSnapshot.data().status === PLAYING_MUSIC) {//doesn't allow member to a join a band that is already playing
						const errorRoom = document.getElementById('errorRoom');
						errorRoom.style.display = 'block';
						errorRoom.textContent = 'The band is in the middle of playing! Wait until the room is open.';
					}
					else {
						joinRef//create the member under the band
						.update({
							['members.' + userName] : 'none'
						});
						document.getElementById('nextGame').style.display = 'none';
						document.getElementById('bandInfo').style.display = 'none';
						document.getElementById('mainRoom').style.display = 'block';
						room.onJoinRoom();

						/*.then(() =>//redirect to the room
								location.href = 'room.html'
						)*/
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
	return { 
		db, 
		CREATED, READYING_UP, PLAYING_MUSIC, DONE_PLAYING, LEAVE_BAND,
		onPageLoaded, openForm, enterRoom, goBack 
	}
}

window.onload = function() {
	room = room();
}