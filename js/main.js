const wrapper = document.querySelector(".wrapper"),
musicImg = wrapper.querySelector(".img-area img"),
musicName = wrapper.querySelector(".song-details .name"),
musicsinger = wrapper.querySelector(".song-details .singer"),
playPauseBtn = wrapper.querySelector(".play-pause"),
prevBtn = wrapper.querySelector("#prev"),
nextBtn = wrapper.querySelector("#next"),
mainAudio = wrapper.querySelector("#main-audio"),
progressArea = wrapper.querySelector(".progress-area"),
progressBar = progressArea.querySelector(".progress-bar"),
musicList = wrapper.querySelector(".music-list"),
moreMusicBtn = wrapper.querySelector("#more-music"),
closemoreMusic = musicList.querySelector("#close");

let musicIndex = Math.floor((Math.random() * allMusic.length) + 1);
isMusicPaused = true;

window.addEventListener("load", ()=>{
  loadMusic(musicIndex);
  playingSong(); 
});

function loadMusic(indexNumb){
  musicName.innerText = allMusic[indexNumb - 1].name;
  musicsinger.innerText = allMusic[indexNumb - 1].singer;
  musicImg.src = `images/${allMusic[indexNumb - 1].image}.jpg`;
  mainAudio.src = `songs/${allMusic[indexNumb - 1].src}.mp3`;
}

function playMusic(){
  wrapper.classList.add("paused");
  playPauseBtn.querySelector("i").innerText = "pause";
  mainAudio.play();
}

function pauseMusic(){
  wrapper.classList.remove("paused");
  playPauseBtn.querySelector("i").innerText = "play_arrow";
  mainAudio.pause();
}


function prevMusic(){
  musicIndex--; 
  musicIndex < 1 ? musicIndex = allMusic.length : musicIndex = musicIndex;
  loadMusic(musicIndex);
  playMusic();
  playingSong(); 
}

function nextMusic(){
  musicIndex++; 
  musicIndex > allMusic.length ? musicIndex = 1 : musicIndex = musicIndex;
  loadMusic(musicIndex);
  playMusic();
  playingSong(); 
}

// Bắt đầu hay tạm ngừngg bài hát khi click
playPauseBtn.addEventListener("click", ()=>{
  const isMusicPlay = wrapper.classList.contains("paused");
  isMusicPlay ? pauseMusic() : playMusic();
  playingSong();
});

//Sự kiện khi nhấn Pre
prevBtn.addEventListener("click", ()=>{
  prevMusic();
});

//Sự kiện khi nhấn Next
nextBtn.addEventListener("click", ()=>{
  nextMusic();
});

// Thanh tiến trình với số giây của bài hát
mainAudio.addEventListener("timeupdate", (e)=>{
  const currentTime = e.target.currentTime; 
  const duration = e.target.duration; 
  let progressWidth = (currentTime / duration) * 100;
  progressBar.style.width = `${progressWidth}%`;

  let musicCurrentTime = wrapper.querySelector(".current-time"),
  musicDuartion = wrapper.querySelector(".max-duration");
  mainAudio.addEventListener("loadeddata", ()=>{
    // Tổng số phút của bài hát
    let mainAdDuration = mainAudio.duration;
    let totalMin = Math.floor(mainAdDuration / 60);
    let totalSec = Math.floor(mainAdDuration % 60);
    if(totalSec < 10){ //if sec is less than 10 then add 0 before it
      totalSec = `0${totalSec}`;
    }
    musicDuartion.innerText = `${totalMin}:${totalSec}`;
  });
  // Thời gian hiện tại của bài hát
  let currentMin = Math.floor(currentTime / 60);
  let currentSec = Math.floor(currentTime % 60);
  if(currentSec < 10){ 
    currentSec = `0${currentSec}`;
  }
  musicCurrentTime.innerText = `${currentMin}:${currentSec}`;
});

// Hàm đếm ngược số giây còn lại của bài hát
mainAudio.addEventListener("timeupdate", function() {
  var timeleft = wrapper.querySelector('.max-duration'),
      duration = parseInt( mainAudio.duration ),
      currentTime = parseInt( mainAudio.currentTime ),
      timeLeft = duration - currentTime,
      s, m;
  
  
  s = timeLeft % 60;
  m = Math.floor( timeLeft / 60 ) % 60;
  
  s = s < 10 ? "0"+s : s;
  m = m < 10 ? "0"+m : m;
  
  timeleft.innerHTML = m+":"+s;
  
}, false);

// cập nhật thời gian phát bài hát hiện tại theo độ rộng của thanh tiến trình
progressArea.addEventListener("click", (e)=>{
  let progressWidth = progressArea.clientWidth; //chiều rộng của thanh tiến trình
  let clickedOffsetX = e.offsetX; // giá trị offset x
  let songDuration = mainAudio.duration; //  tổng thời gian bài hát
  
  mainAudio.currentTime = (clickedOffsetX / progressWidth) * songDuration;
  playMusic(); // gọi hàm playMusic
  playingSong();
});


const repeatBtn = wrapper.querySelector("#repeat-plist");
repeatBtn.addEventListener("click", ()=>{
  let getText = repeatBtn.innerText; 
  switch(getText){
    case "repeat":
      repeatBtn.innerText = "repeat_one";
      repeatBtn.setAttribute("title", "Song looped");
      break;
    case "repeat_one":
      repeatBtn.innerText = "shuffle";
      repeatBtn.setAttribute("title", "Playback shuffled");
      break;
    case "shuffle":
      repeatBtn.innerText = "repeat";
      repeatBtn.setAttribute("title", "Playlist looped");
      break;
  }
});

//  Những việc cần làm sau khi bài hát kết thúc
mainAudio.addEventListener("ended", ()=>{
  
  // Lặp lại bài hát
  let getText = repeatBtn.innerText; 
  switch(getText){
    case "repeat":
      nextMusic(); //chuyển tới bài hát tiếp theo
      break;
    case "repeat_one":
      mainAudio.currentTime = 0; //chuyển thời gian hiện tại của bài hát thành 0
      loadMusic(musicIndex); 
      playMusic(); //gọi hàm playmusic
      break;
    case "shuffle":
      let randIndex = Math.floor((Math.random() * allMusic.length) + 1); //tính toán bài hát ngẫu nhiên với độ dài của mảng
      do{
        randIndex = Math.floor((Math.random() * allMusic.length) + 1);
      }while(musicIndex == randIndex); // vòng lặp này chạy cho đến khi số ngẫu nhiên tiếp theo không giống với musicIndex hiện tại
      musicIndex = randIndex; // chuyển randomIndex sang musicIndex
      loadMusic(musicIndex);
      playMusic();
      playingSong();
      break;
  }
});

// hiển thị danh sách nhạc khi nhấp vào biểu tượng âm nhạc
moreMusicBtn.addEventListener("click", ()=>{
  musicList.classList.toggle("show");
});
closemoreMusic.addEventListener("click", ()=>{
  moreMusicBtn.click();
});

const ulTag = wrapper.querySelector("ul");
// cho phép tạo thẻ li theo độ dài mảng cho danh sách
for (let i = 0; i < allMusic.length; i++) {
  //Lấy tên ca sĩ và bài hát từ mảng
  let liTag = `<li li-index="${i + 1}">
                <div class="row">
                  <span>${allMusic[i].name}</span>
                  <p>${allMusic[i].singer}</p>
                </div>
                <span id="${allMusic[i].src}" class="audio-duration">3:40</span>
                <audio class="${allMusic[i].src}" src="songs/${allMusic[i].src}.mp3"></audio>
              </li>`;
  ulTag.insertAdjacentHTML("beforeend", liTag); 
  let liAudioDuartionTag = ulTag.querySelector(`#${allMusic[i].src}`);
  let liAudioTag = ulTag.querySelector(`.${allMusic[i].src}`);
  liAudioTag.addEventListener("loadeddata", ()=>{
    let duration = liAudioTag.duration;
    let totalMin = Math.floor(duration / 60);
    let totalSec = Math.floor(duration % 60);
    if(totalSec < 10){ // nếu giây nhỏ hơn 10 thì thêm 0 vào trước nó
      totalSec = `0${totalSec}`;
    };
    liAudioDuartionTag.innerText = `${totalMin}:${totalSec}`; //Lấy tổng thời lượng bài hát
    liAudioDuartionTag.setAttribute("t-duration", `${totalMin}:${totalSec}`); 
  });
}

// phát bài hát cụ thể từ danh sách khi nhấp vào thẻ li trong playlist
function playingSong(){
  const allLiTag = ulTag.querySelectorAll("li");
  
  for (let j = 0; j < allLiTag.length; j++) {
    let audioTag = allLiTag[j].querySelector(".audio-duration");
    
    if(allLiTag[j].classList.contains("playing")){
      allLiTag[j].classList.remove("playing");
      let adDuration = audioTag.getAttribute("t-duration");
      audioTag.innerText = adDuration;
    }

    // nếu chỉ mục thẻ li bằng musicIndex thì được phép Playing
    if(allLiTag[j].getAttribute("li-index") == musicIndex){
      allLiTag[j].classList.add("playing");
      audioTag.innerText = "Playing";
    }

    allLiTag[j].setAttribute("onclick", "clicked(this)");
  }
}


function clicked(element){
  let getLiIndex = element.getAttribute("li-index");
  musicIndex = getLiIndex; 
  loadMusic(musicIndex);
  playMusic();
  playingSong();
}
