const db = firebase.firestore();
const CREATED = -1;
const READYING_UP = 0;
const PLAYING_MUSIC = 1;
const DONE_PLAYING = 2;
const LEAVE_BAND = 3;
const instruments = [
    'bass',
    'melody',
    'chord'
];

//could consider putting this in one object
let memberName;
let memberDoc; //reference to firestore
let memberRole;

//could consider putting this in one object
let bandName;
let bandDoc;//reference to firestore
let bandState;
let leaveBand;

let memberIsHost = false;

//#region HELPER FUNCTIONS

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
function initializeClock(id, endtime, endEvent) {//to use for backend stuff set id = false, take in function for end timer event
    let clock;
    if (id) {
        clock = document.getElementById(id);
    }

    function updateClock() {
        const t = getTimeRemaining(endtime);
        if (id) {
            clock.textContent =
                'Time Left: ' + ('0' + t.minutes).slice(-2) + ':' +
                ('0' + t.seconds).slice(-2);
        }
        if (t.total <= 0) {
            clearInterval(timeinterval);
            if (memberIsHost) {
                endEvent();
            }
        }
    }

    updateClock(); // run function once at first to avoid delay
    let timeinterval = setInterval(updateClock, 1000);
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
    memberIsHost = localStorage.getItem('isHost');
    memberIsHost = (memberIsHost === 'true');

    memberDoc = db.doc(`Bands/${bandName}/members/${memberName}`);
    bandDoc = db.doc(`Bands/${bandName}`);

    document.getElementById('info').textContent = `Member Name: ${memberName}`;
    // document.getElementById('instrument').textContent = `You are the ${instruments[90 % instruments.length]}`;
    console.log('This person is a host: ' + memberIsHost);
    if (memberIsHost) {
        prepPlay();
    }
    else {
        document.getElementById('hostStart').style.display = 'none';
        console.log('dont show button');

    }
    getBandInfo();
}

/**
 * Sets a band document listener to listen for band state
 */
function getBandInfo() {
    leaveBand = bandDoc.onSnapshot(/*{includeMetadataChanges: true},*/function (doc) {
        bandSnapShot(doc);
    })
}

/**
 * function for getBandInfo
 * Runs right after member joins room
 * Sets a band document listener to listen for band state
 * Continually updates number of members present
 */
function bandSnapShot(doc) {
    var source = doc.metadata.hasPendingWrites ? "Local" : "Server";
    console.log('SnapShot activated : ', source);

    //Update display names and member Role
    doc.ref.collection('members').get()
        .then(function (members) {
            return members.docs.map(doc => doc.data())
        })
        .then(function (memberslist) {
            document.getElementById('allMembers').innerHTML = "Your Band: " + bandName + "<br>" + "Hosted by " + doc.data().host + "<br>" + "<br>";
            memberslist.forEach(function (item) {

                if (item.userName === memberName) memberRole = item.role;
                let displayRole = item.role;

                if (displayRole === 'none') displayRole = '';
                else displayRole += ': ';
                document.getElementById('allMembers').innerHTML += displayRole + item.userName + "<br>";
            });
            document.getElementById('instrument').textContent = `You are the ${memberRole}`;
            bandDoc.update({ members: memberslist.length, });
        })
        .then(function () {
            //Band State changes
            const oldState = bandState;
            bandState = doc.data().status;
            if (oldState != bandState) {
                console.log('Detected band state change: ' + oldState + ' to --> ' + bandState);
                switch (bandState) {
                    case READYING_UP:
                        //what UI elements are we hiding
                        //which ones, if any are revealed?
                        document.getElementById('instrument').style.display = 'none';
                        if (memberIsHost) document.getElementById('hostStart').style.display = '';
                        document.getElementById('clockdiv').style.display = 'none';
                        document.getElementById('nextGame').style.display = 'none';

                        break;
                    case PLAYING_MUSIC:
                        //start Timer
                        console.log(memberRole);
                        document.getElementById('instrument').style.display = 'block';
                        document.getElementById('clockdiv').style.display = 'block';

                        //clock stuff
                        const minutes = .1;
                        const currentTime = Date.parse(new Date());
                        const deadline = new Date(currentTime + minutes * 60 * 1000);
                        initializeClock('clockdiv', deadline, endSong);
                        break;
                    case DONE_PLAYING:
                        //hide music UI
                        //hide timer
                        document.getElementById('clockdiv').style.display = 'none';
                        //document.getElementById('nextGame').style.display = 'block';
                        break;
                    case LEAVE_BAND://how to delete band?
                        exitBand();//This kicks EVERYONE out
                    default:
                        console.log('state is undefined');
                }
            }
        })
}

/**
 * Based on role and boolean show or hide music UI
 * @param {string} role 
 */
function toggleMusicUI(role, show) {
    switch (role) {
        case 'conductor':
            break;
        default:
    }
}

/**
 * Used when a member wants to leave
 */
function exitBand() {
    //db stuff
    //memberDoc.delete().then(() => console.log(memberName + 'left'));
    //bandDoc.update({ passCode: memberName });

    //local stuff
    console.log('Left');
    leaveBand();
    localStorage.clear();
    location.href = 'index.html';
}


//#endregion

//#region HOST FUNCTIONS

/**
 * Host-only function
 * Updates band status to start everyone's timers
 * Triggers member assignment logic
 */
function beginSong() {
    //set band status to playing
    //assign member roles
    assignRoles(PLAYING_MUSIC);
    document.getElementById('hostStart').style.display = 'none';
}

/**
 * Assign member roles and pull from database
 */
async function assignRoles(targetStatus) {
    if (!memberIsHost) {
        console.log('attempted to make chnages as a member, not a host')
        return;
    }

    let updatePromises = [];

    updatePromises.push(bandDoc.collection('members').get().then(function (members) {
        let memberslist = members.docs.map(doc => doc.data());
        let n = memberslist.length;
        let start = Math.floor(Math.random() * n);
        console.log(start);

        //set other instruments
        for (let i = 0; i < n; i++) {
            let name = memberslist[(i + start) % n].userName;//start conductor on random member
            console.log('checking: ' + name);
            if (targetStatus === PLAYING_MUSIC) {

                if (i === 0) {
                    updatePromises.push(bandDoc.collection('members').doc(name).update({
                        role: 'conductor',
                    }))
                }
                else {
                    let randomRole = instruments[i % instruments.length];//melody always chosen first
                    console.log(randomRole);
                    updatePromises.push(bandDoc.collection('members').doc(name).update({
                        role: randomRole,
                    }))
                }
            }
            else {
                updatePromises.push(bandDoc.collection('members').doc(name).update({
                    role: 'none',
                }))
            }

        }
    }))

    Promise.all(updatePromises)
    .then(() => 
        bandDoc.update({ status: targetStatus })
    )
    .then(() => 
        bandDoc.get().then(doc => 
        bandSnapShot(doc))
    )
}

/**
 * Runs as soon as timer ends
 * Shows buttons for play again or quit
 */
function endSong() {
    bandDoc.update({
        status: DONE_PLAYING
    })
    document.getElementById('nextGame').style.display = 'block';
}

/**
 * Sends band state back to readying up for another song
 */
function prepPlay() {
    assignRoles(READYING_UP);
    console.log('should show button');
}

/** 
 * sets band state change to end song for everyone
*/
function stopPlay() {
    console.log('leaveband');
    bandDoc.update({ status: LEAVE_BAND });
}

//#endregion
