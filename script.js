const musicsData = [
  { title: "Solar", artist: "Betical", id: 1 },
  { title: "Electric-Feel", artist: "TEEMID", id: 2 },
  { title: "Aurora", artist: "SLUMB", id: 3 },
  { title: "Lost-Colours", artist: "Fakear", id: 4 },
];

const musicPlayer = document.querySelector("audio");
const musicTitle = document.querySelector(".music-title");
const artistName = document.querySelector(".music-artist");
const musicCover = document.querySelector(".thumbnail");
const index = document.querySelector(".current-index");

let currentIndex = 1;

function musicUI({title, artist}) {
	musicTitle.textContent = title;
	artistName.textContent = artist;
	musicCover.src = `assets/thumbs/${title}.png`;
	musicPlayer.src = `assets/music/${title}.mp3`;
	index.textContent = `${currentIndex}/${musicsData.length}`;
}

musicUI(musicsData[currentIndex - 1]);

const playBtn = document.querySelector(".play-btn");

playBtn.addEventListener("click", handlePlayPause);

function handlePlayPause() {
	musicPlayer.paused ? play() : pause();
}

function play() {
	playBtn.querySelector("img").src = "assets/icons/pause-icon.svg";
	musicPlayer.play();
}

function pause() {
	playBtn.querySelector("img").src = "assets/icons/play-icon.svg";
	musicPlayer.pause();
}

const dislayCurrentTime = document.querySelector(".current-time");
const dislayDuration = document.querySelector(".duration-time");
const progressBar = document.querySelector(".progress-bar");

let currenTime;
let totalDuration;

musicPlayer.addEventListener("loadeddata", setDuration);

function setDuration() {
	currenTime = musicPlayer.currentTime;
	totalDuration = musicPlayer.duration;
	formatValue(currenTime, dislayCurrentTime);
	formatValue(totalDuration, dislayDuration);
}

function formatValue(value, element) {
	const currMinutes = Math.floor(value / 60);
	let currSeconds = Math.floor(value % 60);

	if (currSeconds < 10) currSeconds = `0${currSeconds}`;

	element.textContent = `${currMinutes}:${currSeconds}`;
}

musicPlayer.addEventListener("timeupdate", updateTime);

function updateTime(e) {
	currenTime = e.srcElement.currentTime;
	formatValue(currenTime, dislayCurrentTime);

	updateProgressBar();
}

function updateProgressBar() {
	const progressValue = currenTime / totalDuration;
	progressBar.style.transform = `scaleX(${progressValue})`;
}

const progressBarContainer = document.querySelector(".progress-container");
progressBarContainer.addEventListener("click", handleProgressBar);

let rect = progressBarContainer.getBoundingClientRect();
let progressBarWidth = rect.width;

function handleProgressBar(e) {
	const clickX = e.clientX - rect.left;
	musicPlayer.currentTime = (clickX / progressBarWidth) * totalDuration;
}


const btnShuffle = document.querySelector(".shuffle");
btnShuffle.addEventListener("click", toggleShuffle)

let shuffle = false;

function toggleShuffle(){
	btnShuffle.classList.toggle("active")
	shuffle = !shuffle;
	if (shuffle) playAShuffledSong();
}


const nextBtn = document.querySelector(".next-btn");
const prevBtn = document.querySelector(".prev-btn");

[prevBtn, nextBtn].forEach(btn => btn.addEventListener("click", changeSong))
musicPlayer.addEventListener("ended", changeSong)

function changeSong(e){
	if(shuffle) {
		playAShuffledSong();
		return;
	}

	e.target.classList.contains("next-btn") || e.type === "ended" ? currentIndex++ : currentIndex--;

	if(currentIndex < 1) currentIndex = musicsData.length;
	else if(currentIndex > musicsData.length) currentIndex = 1;

	musicUI(musicsData[currentIndex - 1])
	play()
}

function playAShuffledSong(){
	const musicsWithoutCurrentSong = musicsData.filter(el => el.id !== currentIndex); // toutes les musiques sauf celle en cours
	const randomMusic = musicsWithoutCurrentSong[Math.trunc(Math.random() * musicsWithoutCurrentSong.length)]; // musique au hasard

	currentIndex = randomMusic.id; 
	musicUI(musicsData[currentIndex - 1])
	play()
}