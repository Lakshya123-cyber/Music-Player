// required tags or elements

const wrapper = document.querySelector(".wrapper"),
musicImg = wrapper.querySelector(".img-area img"),
musicName = wrapper.querySelector(".song-details .name"),
musicArtist = wrapper.querySelector(".song-details .artist"),
mainAudio = wrapper.querySelector("#main-audio"),
playPauseBtn = wrapper.querySelector(".play-pause"),
prevBtn = wrapper.querySelector("#prev"),
nextBtn = wrapper.querySelector("#next"),
progressArea = wrapper.querySelector(".progress-area"),
progressBar = wrapper.querySelector(".progress-bar"),
musicList = wrapper.querySelector(".music-list"),
showMoreBtn = wrapper.querySelector("#more-music"),
hideMusicBtn = musicList.querySelector("#close");

// load random music on page refresh
let musicIndex = Math.floor((Math.random() * allMusic.length) + 1);

window.addEventListener("load", ()=>{
    loadMusic(musicIndex); // calling load music function once window loaded
    playingNow();
})

// load music function
function loadMusic(indexNumb){
    musicName.innerText = allMusic[indexNumb - 1].name;
    musicArtist.innerText = allMusic[indexNumb - 1].artist;
    musicImg.src = `assets/${allMusic[indexNumb - 1].img}`;
    mainAudio.src = `songs/${allMusic[indexNumb - 1].src}.mp3`;
}

// play music function
function playMusic(){
    wrapper.classList.add("paused");
    playPauseBtn.querySelector("i").innerText = "pause";
    mainAudio.play();
};

// pause music function
function pauseMusic(){
    wrapper.classList.remove("paused");
    playPauseBtn.querySelector("i").innerText = "play_arrow";
    mainAudio.pause();
};

// next song function
function nextMusic(){
    // increment of song index by 1
    musicIndex++;
    // if musicIndex is greater than array length then musicIndex will be 1...so the first song will be played
    musicIndex > allMusic.length ? musicIndex = 1 : musicIndex = musicIndex;
    loadMusic(musicIndex);
    playMusic();
    playingNow();
}

// previous song function
function prevMusic(){
    // decrement of song index by 1
    musicIndex--;
    // if musicIndex is less than 1 then musicIndex will be the length of array...so the last song will be played
    musicIndex < 1 ? musicIndex = allMusic.length : musicIndex = musicIndex;
    loadMusic(musicIndex);
    playMusic();
    playingNow();
}

// music button event
playPauseBtn.addEventListener("click", ()=>{
    const isMusicPaused = wrapper.classList.contains("paused");
    // if isMusicPaused is true then call pauseMusic else call playMusic
    isMusicPaused ? pauseMusic() : playMusic();
    playingNow();
});

// next music button event
nextBtn.addEventListener("click", ()=>{
    nextMusic(); // calling next music function
});

// previous music button event
prevBtn.addEventListener("click", ()=>{
    prevMusic(); // calling previous music function
});

// update progress bar width according to music current time
mainAudio.addEventListener("timeupdate", (e)=>{
    const currentTime = e.target.currentTime; // getting current time of the song
    const duration = e.target.duration; // getting total duration of song
    let progressWidth = (currentTime / duration) * 100;
    progressBar.style.width = `${progressWidth}%`;

    let musicCurrentTime = wrapper.querySelector(".current");
    musicDuration = wrapper.querySelector(".duration");

    mainAudio.addEventListener("loadeddata", ()=>{
        //update song total duration
        let audioDuration = mainAudio.duration;
        let totalMin = Math.floor(audioDuration / 60);
        let totalSec = Math.floor(audioDuration % 60);
        if(totalSec < 10){ // adding 0 if second is less than 10
            totalSec = `0${totalSec}`;
        }
        musicDuration.innerText = `${totalMin}:${totalSec}`;
    });

    //update playing song current time
    let currentMin = Math.floor(currentTime / 60);
    let currentSec = Math.floor(currentTime % 60);
    if(currentSec < 10){ // adding 0 if second is less than 10
        currentSec = `0${currentSec}`;
    }
    musicCurrentTime.innerText = `${currentMin}:${currentSec}`;
});

// update playing song current time according to the progress bar width
progressArea.addEventListener("click", (e)=>{
    let progressWidthval = progressArea.clientWidth; // getting width of the progress bar
    let clickedOffSetX = e.offsetX; //getting offset x value
    let songDuration = mainAudio.duration; // getting total song duration

    mainAudio.currentTime = (clickedOffSetX / progressWidthval) * songDuration;
    playMusic();
});

// repeat, shuffle song according to the icon
const repeatBtn = wrapper.querySelector("#repeat-plist")
repeatBtn.addEventListener("click", ()=>{
    // get innertext and then change accordingly
    let getText = repeatBtn.innerText;
    // different changes on different icon click using "SWITCH" METHOD
    switch(getText){
        case "repeat": // if the icon is repeat then change to repeat_one
            repeatBtn.innerText = "repeat_one";
            repeatBtn.setAttribute("title", "Song looped");
            break;
        case "repeat_one": // if the icon is repeat_one then change it to shuffle
            repeatBtn.innerText = "shuffle";
            repeatBtn.setAttribute("title", "Playback shuffle");
            break;
        case "shuffle": // if the icon is shuffle then change it to repeat
            repeatBtn.innerText = "repeat";
            repeatBtn.setAttribute("title", "Playlist looped");
            break;
    }
});

// after the song ends
mainAudio.addEventListener("ended", ()=>{
    let getText = repeatBtn.innerText;
    switch(getText){
        case "repeat": // if the icon is repeat then simply play next song
            nextMusic();
            break;
        case "repeat_one": // if the icon is repeat_one then same song will be looped
            mainAudio.currentTime = 0;
            loadMusic(musicIndex);
            playMusic();
            break;
        case "shuffle": // if the icon is shuffle then random song will be played
            let randIndex = Math.floor((Math.random() * allMusic.length) + 1);
            do{
                randIndex = Math.floor((Math.random() * allMusic.length) + 1);
            }while(musicIndex == randIndex); // this loop run until the next random number wont be of the same current music index
            musicIndex = randIndex; // passing random index to music index so the random song will be played
            loadMusic(musicIndex);
            playMusic();
            playingNow();
            break;
    }
});

showMoreBtn.addEventListener("click", ()=>{
    musicList.classList.toggle("show");
});

hideMusicBtn.addEventListener("click", ()=>{
    showMoreBtn.click();
});

const ulTag = wrapper.querySelector("ul");

// creating li according to the array length
for (let i = 0; i < allMusic.length; i++) {
    let liTag = `<li li-index="${i + 1}">
                    <div class="row">
                        <span>${allMusic[i].name}</span>
                        <p>${allMusic[i].artist}</p>
                    </div>
                    <audio class="${allMusic[i].src}" src="songs/${allMusic[i].src}.mp3"></audio>
                    <span id="${allMusic[i].src}" class="audio-duration">3:45</span>
                </li>`;
    ulTag.insertAdjacentHTML("beforeend", liTag);

    let liAudioDuration = ulTag.querySelector(`#${allMusic[i].src}`);
    let liAudioTag = ulTag.querySelector(`.${allMusic[i].src}`);

    liAudioTag.addEventListener("loadeddata", ()=>{
        let audioDuration = liAudioTag.duration;
        let totalMin = Math.floor(audioDuration / 60);
        let totalSec = Math.floor(audioDuration % 60);
        if(totalSec < 10){ // adding 0 if second is less than 10
            totalSec = `0${totalSec}`;
        }
        liAudioDuration.innerText = `${totalMin}:${totalSec}`;
        liAudioDuration.setAttribute("t-duration", `${totalMin}:${totalSec}`);
    });
}

// play the song from the queue
const allLiTags = ulTag.querySelectorAll("li");
function playingNow(){
    for (let j = 0; j < allLiTags.length; j++) {
        let audioTag = allLiTags[j].querySelector(".audio-duration");
        // remove playing classes from all other li except the last one which is clicked
        if(allLiTags[j].classList.contains("playing")){
            allLiTags[j].classList.remove("playing");
            // get audio duration
            let adDuration = audioTag.getAttribute("t-duration");
            audioTag.innerText = adDuration; // passing t-duration value to audio duration innerText
        }
        // li tag -> li-index is equal to music index -> then music plays -> styling
        if(allLiTags[j].getAttribute("li-index") == musicIndex){
            allLiTags[j].classList.add("playing");
            audioTag.innerText = "Playing";
        }

        // adding onclick attribute in all li tags
        allLiTags[j].setAttribute("onclick", "clicked(this)");
    }
}

// play song on li click
function clicked(element){
    // getting li index of particular clicked li tag
    let getLiIndex = element.getAttribute("li-index");
    musicIndex = getLiIndex; // passing the li index to music index
    loadMusic(musicIndex);
    playMusic();
    playingNow();
}