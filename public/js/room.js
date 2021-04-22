window.room = function() {
    const db = firebase.firestore();
    const CREATED = -1;
    const READYING_UP = 0;
    const PLAYING_MUSIC = 1;
    const DONE_PLAYING = 2;
    const LEAVE_BAND = 3;
    const instruments = [
        'synth',
        'FM synth',
        'piano',
        'guitar'
    ];

    //could consider putting this in one object
    let memberName;
    let memberRole;

    //could consider putting this in one object
    let bandName;
    let bandDoc;//reference to firestore
    let bandState;
    let leaveBand;

    let music_key;
    let music_bpm;

    let memberIsHost = false;

    //#region HELPER FUNCTIONS

    /**
     * calculates time to target endtime
     * @param {number} endtime 
     */
    const getTimeRemaining = (endtime) => {
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
    const initializeClock = (id, endtime, endEvent) => {//to use for backend stuff set id = false, take in function for end timer event
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
    const onJoinRoom = () => {
        console.log('joining room');
        memberName = localStorage.getItem('user');
        bandName = localStorage.getItem('band');
        memberIsHost = localStorage.getItem('isHost');
        memberIsHost = (memberIsHost === 'true');

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
    const getBandInfo = () => {
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
    const bandSnapShot = (doc) => {
        // var source = doc.metadata.hasPendingWrites ? "Local" : "Server";
        // console.log('SnapShot activated : ', source);
        //Update display names and member Role
        readPatterns(doc);//read pushed music changes
        let bandmembers = doc.data().members;
        let memberslist = Object.keys(bandmembers);
        let memberRoles = Object.values(bandmembers);
        document.getElementById('allMembers').innerHTML = "Your Band: " + bandName + "<br>" + "Hosted by " + doc.data().host + "<br>" + "<br>";
        
        for (let i = 0; i < memberslist.length; i++) {
            if (memberslist[i] === memberName) memberRole = memberRoles[i];
            let displayRole = memberRoles[i];

            if (displayRole === 'none') displayRole = '';
            else displayRole += ': ';
            document.getElementById('allMembers').innerHTML += displayRole + memberslist[i] + "<br>";
        }

        document.getElementById('instrument').textContent = `You are the ${memberRole}`;
        bandDoc.update({ groupSize: memberslist.length, })
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
                            //start Timer;
                            toggleMusicUI(memberRole, true);
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
                            toggleMusicUI(memberRole, false);
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
    const toggleMusicUI = (role, show) => {
        switch (role) {
            case 'conductor':
                break;
            default:
                // TODO - if true, then show the music stuff, if false hide the music stuff
        }
    }

    /**
     * place this in Benny's js file
     * send conductor key and bpm to group
     */
    function conductorSend() {
        let conductorKey = 'Am';//document.getElementById()...value
        let conductorBpm = 120;//document.getElementById()...value


        bandDoc.update({
            key: conductorKey,
            bpm: conductorBpm
        })
    }

    /**
     * place this in Benny's js file
     * run on music UI button
     * set "pattern" to js object of noteval:volume, noteval:volume
     */
    function sendPattern() {
        // let pattern = {1 :{7 : 8}, 2 : {7 : 8}, 3 : {7 : 8}, 4 : {7 : 8}, 5 : {7 : 8}, 6 : {7 : 8}, 7 : {7 : 8}, 8 : {7 : 8}};
        let pattern = 
        {
            1: { "value": 2, "volume": 5 },
            2: { "value": 1, "volume": 15 },
            3: { "value": 4, "volume": 25 },
            4: { "value": 3, "volume": 35 },
            5: { "value": 6, "volume": 45 },
            6: { "value": 5, "volume": 55 },
            7: { "value": 7, "volume": 65 },
            8: { "value": "rest", "volume": 40 }
        };
        bandDoc.update({
            ['music.' + (memberName + ':' + memberRole)]: pattern
        })
    }

    /**
     * run in onSnapshot, 
     */
    const readPatterns = (doc) => {
        if (bandState != PLAYING_MUSIC) {
            return;
        }
        //parse music to role, and pattern
        music_bpm = doc.data().bpm;
        music_key = doc.data().key;

        let allRoles = Object.keys(doc.data().music);
        let allMusic = Object.values(doc.data().music);

        for (let i = 0; i < allRoles.length; i++) {
            let thisRole = allRoles[i].split(':')[1];//gets role, like 'melody'
            // so now, we have both role and associatted music - tone js has to play it
        }

    }

    /**
     * Used when a member wants to leave
     */
    const exitBand = () => {
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
    const beginSong = () => {
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
            console.log('attempted to make changes as a member, not as a host')
            return;
        }

        //let updatePromises = [];

        bandDoc.get().then(function (doc) {
            let bandmembers = doc.data().members;
            console.log(bandmembers);
            let memberslist = Object.keys(bandmembers);
            let memberRoles = Object.values(bandmembers);

            let n = memberslist.length;
            let start = Math.floor(Math.random() * n);

            for (let i = 0; i < n; i++) {

                let name = memberslist[(i + start) % n];//start conductor on random member
                console.log('checking: ' + name);
                if (targetStatus === PLAYING_MUSIC) {

                    if (i === 0) {

                        bandmembers[memberslist[i]] = 'conductor';
                    }
                    else {
                        let randomRole = instruments[i % instruments.length];//melody always chosen first
                        console.log(randomRole);
                        bandmembers[memberslist[i]] = randomRole;
                    }
                }
                else {
                    bandmembers[memberslist[i]] = 'none';
                }
            }
            console.log("After Assigned Roles:", bandmembers);
            return bandmembers

        }).then((band) => {
            bandDoc.update({
                members: band,
                status: targetStatus
            })
        })
            .then(() =>
                bandDoc.get().then(doc =>
                    bandSnapShot(doc))
            )
    }

    /**
     * Runs as soon as timer ends
     * Shows buttons for play again or quit
     */
    const endSong = () => {
        bandDoc.update({
            status: DONE_PLAYING
        })
        document.getElementById('nextGame').style.display = 'block';
    }

    /**
     * Sends band state back to readying up for another song
     */
    const prepPlay = () => {
        assignRoles(READYING_UP);
        console.log('should show button');
    }

    /** 
     * sets band state change to end song for everyone
    */
    const stopPlay = () => {
        console.log('leaveband');
        bandDoc.update({ status: LEAVE_BAND });
    }

    //#endregion

    // NOTE: ADD FIELDS TO `return` STATEMENT AS NEEDED
    return { db, beginSong };
}
