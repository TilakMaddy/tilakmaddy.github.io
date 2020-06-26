const video = document.getElementById("dontshowvideo");

const container = document.querySelector('.container');
const status = container.querySelector('.status');

const laughingVideo = document.querySelector('#laughvideo');

const scoreEl = document.querySelector('.your_score .value');
const laughsEl = document.querySelector('.laughs .value');

const twttrShare = document.querySelector('.twitter-follow-button');
const twttrFollow = document.querySelector('.twitter-share-button');

Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
  faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
  faceapi.nets.faceRecognitionNet.loadFromUri("/models"),
  faceapi.nets.faceExpressionNet.loadFromUri("/models"),
])
.then(() => {
  navigator.getUserMedia(
    { video: {} },
    stream => (video.srcObject = stream),
    err => console.error(err)
  );
});

let renderer;
let firstTime = true;
let lastAction = "NOT_SMILING";
let lastTime = Date.now() - 5000;
let score = 0;
let laughs = 0;


function playVideo() {

  renderer = setInterval(async () => {

    const detections = await faceapi
      .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks()
      .withFaceExpressions();

    if(firstTime) {
      document.querySelector('.share-screen').remove();
      laughingVideo.play();
      firstTime = false;
    }

    // Check is user went off-camera to hide and laugh
    // Dont inc score w/ time now
    // (Pausing the video is bad idea cuz maybe scenes are offensive)
    if(!detections || !detections[0]) {
      return;
    }

    // * Assuming only 1 face will be present so detection[0] is only considered
    if(detections && detections[0] && detections[0].expressions && detections[0].expressions.happy > 0.93) {

      // Take action iff user is laughing now and previously not laughing
      // and give 3 seconds for user to adjust his smiling status
      if(lastAction === 'NOT_SMILING' && (Date.now() - lastTime) > 2000){
        lastAction = 'SMILING';
        laughingVideo.pause();
        lastTime = Date.now();

        score -= 300;
        laughs++;
        new Audio("assets/down_trump.mp3").play();


        console.log('pausing ...');
      }
    }
    else {

      score += 10;

      // Take action iff user is not laughing now and previously laughing
      if(lastAction === 'SMILING' && (Date.now() - lastTime) > 2000) {
        lastTime = Date.now();
        lastAction = 'NOT_SMILING';
        laughingVideo.play();

        console.log('playing ... ');
      }
    }

    laughsEl.textContent = laughs;
    scoreEl.textContent = score;

  }, 100);
};

video.addEventListener('play', playVideo);

videojs('#laughvideo').on('ended', function(){
  this.dispose();
  clearInterval(renderer);

  let text = `I laughed ${laughs} times and scored ${score}. 🚀 Tweet me yours before you grab a 🍕! `;
  if(laughs === 0){
    text = `I won the challenge 🙌 !! . High score is ${score}. 🚀 Tweet me yours before you grab a 🍕! `;
  }

  const shareString = `<div class="share-screen">
    Now share with the WORLD, a part of your smile 😃 ! <br>
    <a href="https://twitter.com/share?ref_src=twsrc%5Etfw" class="twitter-share-button" data-size="large" data-text="${text}" data-url="${window.location.href}" data-via="til20fifa14" data-hashtags="trynottolaughchallenge" data-lang="en" data-show-count="false">Tweet</a> your score
    and <a href="https://twitter.com/til20fifa14?ref_src=twsrc%5Etfw" class="twitter-follow-button" data-size="large" data-via="til20fifa14" data-lang="en">Follow @til20fifa14</a> for more exciting weekly stuff.
    <script src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>
    <br>
    <a href="https://tilakmaddy.github.io/Windows-XP-dumb-things/" target="_blank" class="link2otherproject">
      Checkout Quarantine and chill with Win-XP &rarr;
    </a>
    </div>`;

  /**
   * Diretly calling insertAdjacentHTML on the above string will not
   * execute the JS the Twitter Script tag. So I resorted to creating
   * document fragment
   *
   * ?COLT STEELE ! If you are reading this, please explain in the video
   */

  document.querySelector('.video-container').appendChild(document.createRange().createContextualFragment(shareString));

  // Stop requesting the webcam of the user
  video.srcObject.getTracks().forEach(track => track.stop());
});