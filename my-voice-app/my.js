const results = document.querySelector('.results');

const jokeBtn = document.getElementById("joke-btn");
const songBtn = document.getElementById("song-btn");
const muskBtn = document.getElementById("musk-btn");

const wait = (time = 100) => new Promise(res => setTimeout(res, time));

function getRandomYoutubeSong() {

  const bunch = [
    // Sign of the Times - Harry Styles
    `qN4ooNx77u0`,

    // See you again - Wiz Khalifa ft.Charlie Puth
    `RgKAFK5djSk`,

    // Stiches - Shawn Mendes
    `VbfpW0pbvaU`,

    // Let her go - Passenger
    `RBumgq5yVrA`,

    // before you go
    `Jtauh8GcxBY`,

    // someone you loved
    `bCuhuePlP8o`,

    // shape of you
    `JGwWNGJdvx8`,

    // marron 5 - payphone
    `KRaWnd3LJfs`
  ];

  function createIFrameString(videoId) {
    return `<iframe width="560" height="315" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
  }

  const randomString = createIFrameString(bunch[Math.floor(Math.random() * bunch.length)]);
  const iframe = document.createRange().createContextualFragment(randomString);
  return iframe;

}

async function getRandomJoke() {
  const res = await fetch("https://icanhazdadjoke.com/", {
    headers: {
      'Accept': 'application/json'
    }
  });
  const json = await res.json();
  return json.joke;
}

function renderTweets() {
  const html = `
  <div class="musk-stuff">
              <a class="twitter-timeline" data-theme="dark" href="https://twitter.com/elonmusk?ref_src=twsrc%5Etfw">Tweets by elonmusk</a> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>
          </div>
  `;
  const el = document.createRange().createContextualFragment(html);
  results.innerHTML = '';
  results.appendChild(el);
}

function renderSong() {
  results.innerHTML = '';
  results.append(getRandomYoutubeSong());
}

async function renderJoke() {
  const html = `
  <div class="joke-text">
          ${await getRandomJoke()}
        </div>`;
  const el = document.createRange().createContextualFragment(html);
  results.innerHTML = '';
  results.appendChild(el);
}


if (annyang) {

  const commands = {

    'tell me a joke': async () => {
      jokeBtn.classList.add("highlight");
      renderJoke();
      await wait(500);
      jokeBtn.classList.remove("highlight");
    },
    'another joke' :async () => {
      jokeBtn.classList.add("highlight");
      renderJoke();
      await wait(500);
      jokeBtn.classList.remove("highlight");
    },

    'play me a song':async () => {
      songBtn.classList.add("highlight");
      renderSong();
      await wait(500);
      songBtn.classList.remove("highlight");
    },
    'another song': async () => {
      songBtn.classList.add("highlight");
      renderSong();
      await wait(500);
      songBtn.classList.remove("highlight");
    },

    'spy on the meme lord':async () => {
      muskBtn.classList.add("highlight");
      renderTweets();
      await wait(500);
      muskBtn.classList.remove("highlight");
    },
    'what\'s going on with Elon Musk':async () => {
      muskBtn.classList.add("highlight");
      renderTweets();
      await wait(500);
      muskBtn.classList.remove("highlight");
    },
  };

  annyang.addCommands(commands);

  annyang.start();
}