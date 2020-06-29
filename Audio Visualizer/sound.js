const video = document.querySelector('video');

function hslToRgb(h, s, l) {
  let r;
  let g;
  let b;

  if (s == 0) {
    r = g = b = l;
  } else {
    const hue2rgb = function hue2rgb(p, q, t) {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}


const WIDTH = 1500;
const HEIGHT = 1500;
const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
canvas.width = WIDTH;
canvas.height = HEIGHT;

let analyzer;
let bufferLength;

function handleError(err) {
  alert("You must give access to your mic in order to proceed");
  console.log(err);
}

async function getAudio() {
  const stream = await navigator.mediaDevices
    .getUserMedia({ audio: true })
    .catch(handleError);
  const audioCtx = new AudioContext();
  analyzer = audioCtx.createAnalyser();
  const source = audioCtx.createMediaStreamSource(stream);
  source.connect(analyzer);
  // How much data should we collect
  analyzer.fftSize = 2 ** 8;
  // pull the data off the audio
  // how many pieces of data are there?!?
  bufferLength = analyzer.frequencyBinCount;
  const timeData = new Uint8Array(bufferLength);
  const frequencyData = new Uint8Array(bufferLength);
  drawTimeData(timeData);
  drawFrequency(frequencyData);
}

function drawTimeData(timeData) {
  // inject the time data into our timeData array
  analyzer.getByteTimeDomainData(timeData);
  // now that we have the data, lets turn it into something visual
  // 1. Clear the canvas TODO
  ctx.clearRect(0, 0, WIDTH, HEIGHT);
  // 2. setup some canvas drawing
  ctx.lineWidth = 10;
  ctx.strokeStyle = "#ffc600";
  ctx.beginPath();
  const sliceWidth = WIDTH / bufferLength;
  let x = 0;
  timeData.forEach((data, i) => {
    const v = data / 128;
    const y = (v * HEIGHT) / 2;
    // draw our lines
    if (i === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
    x += sliceWidth;
  });

  ctx.stroke();

  // call itself as soon as possible
  requestAnimationFrame(() => drawTimeData(timeData));
}

function drawFrequency(frequencyData) {
  // get the frequency data into our frequencyData array
  analyzer.getByteFrequencyData(frequencyData);
  // figure out the bar width
  const barWidth = (WIDTH / bufferLength) * 2.5;
  let x = 0;
  frequencyData.forEach((amount) => {
    // 0 to 255
    const percent = amount / 255;
    const [h, s, l] = [360 / (percent * 360) - 0.5, 0.8, 0.5];
    const barHeight = HEIGHT * percent * 0.5;
    const [r, g, b] = hslToRgb(h, s, l);
    ctx.fillStyle = `rgb(${r},${g},${b})`;
    ctx.fillRect(x, HEIGHT - barHeight, barWidth, barHeight);
    x += barWidth + 2;
  });

  requestAnimationFrame(() => drawFrequency(frequencyData));
}

getAudio();

// Autoplay doesn't work with sound off on page load so
video.play();

document.addEventListener('keydown', function(e) {

  switch(e.key) {
    case ' ':
      video.paused ? video.play() : video.pause();
      break;
    case 'ArrowDown':
      if(video.volume - 0.1 >= 0) {
        video.volume -= 0.1;
      }
      break;
    case 'ArrowUp':
      if(video.volume + 0.1 <= 1) {
        video.volume += 0.1;
      }
      break;
    case 'f':
    case 'F':
      video.requestFullscreen();
    case 'ArrowLeft':
      video.currentTime -= 10;
      break;
    case 'ArrowRight':
      video.currentTime += 10;
      break;
    case 'm':
    case 'M':
      video.muted = !video.muted;
  }

});


video.addEventListener('ended', function() {

  const lyricText = document.querySelector('.rabbit-lyrics__line--active');
  lyricText.style.textShadow = 'none';
  lyricText.style.fontSize = '2rem';
  lyricText.style.letterSpacing = '0';
  lyricText.style.color = '#ffc600';

  const html =
    `Hope you had a nice time ! Now share the joy with
    the rest of the world by <a href="https://twitter.com/share?ref_src=twsrc%5Etfw" class="twitter-share-button" data-size="large" data-text="Have you tried 🎤 along with Ed Sheeran&#39;s 🎵 ? Don&#39;t wait to try anymore ! Go now " data-url="${window.location.href}" data-via="til20fifa14" data-hashtags="singwithtimedlyrics" data-lang="en" data-show-count="false">Tweet</a>ing 🚀. Also make sure to <a href="https://twitter.com/til20fifa14?ref_src=twsrc%5Etfw" class="twitter-follow-button" data-size="large" data-show-count="true">Follow @til20fifa14</a> for weekly tips on software and having fun !<script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script> `;

  const el = document.createRange().createContextualFragment(html);
  lyricText.textContent = '';
  lyricText.append(el);

});


