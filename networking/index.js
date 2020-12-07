const db = firebase.firestore();

let memberID;
let memberName;
let memberslist;
let bandName;
let isHost = false;
let instruments = [
	'conductor',
	'flute gal',
	'guitar man',
	'trumpet guy',
	'bassist'
];

async function setID() {
	let snapshot = await db.doc('Members/allMembers').get();
	memberID = snapshot.data().Count;
	console.log(`This is the member ID: ${memberID}`);
	memberName = localStorage.getItem('user');

	document.getElementById('info').innerHTML = `Member ID: ${memberID}` + '<br>' + `Member Name: ${memberName}`;
	document.getElementById('instrument').innerHTML = `You are the ${instruments[memberID % instruments.length]
		}`;
}

function displayMembers() {
	//document.getElementById('allMembers').innerHTML = `Member ID: ${memberID}`;
	db.doc(`Bands/${bandName}`).onSnapshot(function(doc) {
		console.log("SnapShot activated");
		db.collection(`Bands/${bandName}/members`).get().then( function(members){
			let memberslist = members.docs.map(doc => doc.data());
			//console.log(`Global MembersList: ${memberslist}`);
			document.getElementById("allMembers").innerHTML = "Your Band: " + bandName + "<br>";
			
			memberslist.forEach(function (item, index) {
				document.getElementById("allMembers").innerHTML += index + ":" + item.userName + "<br>";
				//console.log(index, ' => ', item.userName);
			})

			db.doc(`Bands/${bandName}`).set({//if memberslist is diff from current, snapshot will not rerun
				members: memberslist.length,
			})
		})
	})
	
	// let snapshot = await db.collection('Bands').doc(bandName).collection('members').get();
	// memberslist = snapshot.docs.map(doc => doc.data());
	// console.log(`Global MembersList: ${memberslist}`);
	// //console.log(`Global MembersList: ${memberslist[8]}`);
	// document.getElementById("allMembers").innerHTML = "Your Band: " + bandName + "<br>";
	// memberslist.forEach(function (item, index) {
	// 	// doc.data() is never undefined for query doc snapshots
	// 	document.getElementById("allMembers").innerHTML += index + ":" + item.userName + "<br>";
	// 	console.log(index, ' => ', item.userName);
	// })
}

async function getDoc(path) {
	return await db.doc(path).get();
}

function onPageLoaded() {
	//add to count
	db.doc('Members/allMembers')
		.get()
		.then(querySnap => {
			console.log(`${querySnap.id} => ${querySnap.data().Count}`);

			db.doc('Members/allMembers').update({
				Count: querySnap.data().Count + 1
			});
		});
}

function onRoomLoaded() {
	bandName = localStorage.getItem('band');
	setID();
	displayMembers();
}


//unhide forms and close buttons
function openForm(hostBool) {
	isHost = hostBool;
	document.getElementById('createRoom').style.display = 'none';
	document.getElementById('joinRoom').style.display = 'none';
	document.getElementById('bandInfo').style.display = 'block';

	let formTitle = document.getElementById('joinChoice');
	if (isHost) {
		formTitle.style.display = 'block';
		formTitle.innerHTML = 'Create a Band';
	} else {
		formTitle.style.display = 'block';
		formTitle.innerHTML = 'Join a Band';
	}
}

//take data and start room or error
function enterRoom() {
	
	bandName = document.getElementById('band').value;
	let userName = document.getElementById('name').value;
	let passCode = document.getElementById('passcode').value;
	localStorage.setItem('user', userName);
	localStorage.setItem('band', bandName);
	//console.log(`BandName: ${bandName}`);

	// if(!isHost){
	//     let n = getDoc(`Bands/${bandName}`)
	//     let realCode = n.data().passCode;
	//     if(passCode != realCode){
	//         document.getElementById("errorRoom").style.display = "block";
	//         return;
	//     }
	// }


	//make band
	db.collection('Bands')
		.doc(bandName)
		.set({
			bandname: bandName,
			members: 0,
			status: 'readying up',
			passCode: passCode
		})
		.then(() =>
			//now make user a member of the band
			db
				.collection('Bands')
				.doc(bandName)
				.collection('members')
				.doc(userName)
				.set({
					userName: userName
				})
		).then(() =>
			location.href = 'room.html'
		)
		
	//setID();
	//displayMembers();
	// document.getElementById('bandInfo').style.display = 'none';
	
	//document.getElementById('mainRoom').style.display = 'block';

}

function onPageLeaving() {
	//subtract from count
	db.collection('Members')
		.doc('allMembers')
		.get()
		.then(querySnapshot => {
			db.doc('Members/allMembers').update({
				Count: querySnapshot.data().Count - 1
			});
		});
}

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
// });
