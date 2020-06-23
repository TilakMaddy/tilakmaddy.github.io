//css3 transform bug with jquery ui drag - fixed(works fine whether position, absolute or relative)
var __dx;
var __dy;
var __scale=0.5;
var __recoupLeft, __recoupTop;

function renderDraggableFunctionality() {
  $(".window:not(.nerrc)").draggable({
    //revert: false,
    stack: "div",

    //zIndex: 100,
    drag: function (event, ui) {
        //resize bug fix ui drag `enter code here`
        __dx = ui.position.left - ui.originalPosition.left;
        __dy = ui.position.top - ui.originalPosition.top;
        //ui.position.left = ui.originalPosition.left + ( __dx/__scale);
        //ui.position.top = ui.originalPosition.top + ( __dy/__scale );
        ui.position.left = ui.originalPosition.left + (__dx);
        ui.position.top = ui.originalPosition.top + (__dy);
        //
        ui.position.left += __recoupLeft;
        ui.position.top += __recoupTop;
    },
    start: function (event, ui) {

        //resize bug fix ui drag
        var left = parseInt($(this).css('left'), 10);
        left = isNaN(left) ? 0 : left;
        var top = parseInt($(this).css('top'), 10);
        top = isNaN(top) ? 0 : top;
        __recoupLeft = left - ui.position.left;
        __recoupTop = top - ui.position.top;
    },
    // stop: function (event, ui) {
    //     // //alternate to revert (don't use revert)

    //     // $(this).animate({
    //     //     left: $(this).attr('oriLeft'),
    //     //     top: $(this).attr('oriTop')
    //     // }, 1000)
    // },
    // create: function (event, ui) {
    //     $(this).attr('oriLeft', $(this).css('left'));
    //     $(this).attr('oriTop', $(this).css('top'));
    // }
  });
}

renderDraggableFunctionality();

// END OF BUG FIXES

//*START OF STORY LINE

/**
 *
 *
 */

// END OF STORY LINE
const wait = (time = 100) => new Promise(res => setTimeout(res, time));


const gbars = document.querySelectorAll('.gbar');
const loadingScreen = document.querySelector('.loading');


const xplogo = document.querySelector('.xp_logo');

const boxes = {};
['tfs', 'hwu', 'knw', 'preg', 'nerr', 'fene', 'delc', 'sle'].forEach(name => {
  boxes[name] = document.querySelector(`.${name}`);
});


Object.values(boxes).forEach(box => box.remove());

// Audio
const startup = new Audio('icons/sounds/Windows XP Startup.wav');
const criticalStop = new Audio('icons/sounds/Windows XP Critical Stop.wav');
const shutdown = new Audio('icons/sounds/Windows XP Shutdown.wav');
const error = new Audio('icons/sounds/Windows XP Error.wav');
const hardwareFail = new Audio('icons/sounds/Windows XP Hardware Fail.wav');
const tada = new Audio('icons/sounds/tada.mp3');
const infoBar = new Audio('icons/sounds/Windows XP Information Bar.wav');

// const test = document.querySelectorAll('.tfs button');
// test.forEach(butt => {
  //   butt.addEventListener('click', function(){
    //     document.body.insertAdjacentElement('afterBegin', loadingScreen);
    //     loadScreen(function(){
      //       console.log('Finished loading');
      //     });
      //   });
      // });

      let top2down = false;
      let doneDisplaying = false; //? for hwu windows detected mouse move


      function loadScreen(cbk) {
        setTimeout(function(){
          gbars.forEach(gbar => {
            gbar.classList.add('finish_loading');
          });
          gbars[0].addEventListener('transitionend', function(){
            xplogo.style.filter = 'brightness(200%)';
            setTimeout(() => {
              loadingScreen.remove();
              gbars.forEach(gbar => gbar.classList.remove('finish_loading'));
              if(top2down) {
                loadingScreen.style.transform = 'rotate(0deg)';
              } else {
                loadingScreen.style.transform = 'rotate(180deg)';
              }
              top2down = !top2down;
              if(cbk)
              cbk();
            }, 100);
          }, {once: true});
        }, 1000);
      }

      // *FIRST LOADING OF SCREEN*

      loadScreen(function(){
        function hwuMegaDisplay(e){
          setTimeout(async function(){
            if(doneDisplaying) return;
            displayBox(boxes['hwu'].cloneNode(true), `${10 + 4*3}%`, `${5 +15}%`);
            stopStart(null, criticalStop) ;
            await wait(1000);

            displayBox(boxes['hwu'].cloneNode(true), `${10 + 5*3}%`, `${6 +15}%`);
            stopStart(null, criticalStop) ;
            await wait(250);

            displayBox(boxes['hwu'].cloneNode(true), `${10 + 6*3}%`, `${7 +15}%`);
            stopStart(null, criticalStop) ;
            await wait(100);

            // let beats = 100;
            for(const value of Array.from({length:10}, (_, i) => i + 7)) {
              displayBox(boxes['hwu'].cloneNode(true), `${10 + value*3}%`, `${(value + 1) +15}%`);
              stopStart(null, criticalStop) ;
              await wait();
              //await wait(beats);
              //beats /= 1.4;
            }

            // let first = true;
            // beats = 100;
            for(const value of Array.from({length:6}, (_, i) => i + 4)) {
              displayBox(boxes['hwu'].cloneNode(true), `${10 + value*3}%`, `${(value + 1) + 50}%`);
              stopStart(null, criticalStop) ;
              // if(first) {
                //   await wait(500);
                //   first = false;
                // }
                // else {
                  //   await wait(beats);
                  //   beats /= 2;
                  // }
                  await wait();
                }

                // displayBox(boxes['hwu'].cloneNode(true), `${10 + 7*3}%`, `${8 +15}%`);
                // stopStart(null, criticalStop) ;
                // await wait();

                // displayBox(boxes['hwu'].cloneNode(true), `${10 + 8*3}%`, `${9 +15}%`);
                // stopStart(null, criticalStop) ;
                // await wait();

                // displayBox(boxes['hwu'].cloneNode(true), `${10 + 9*3}%`, `${10 +15}%`);
                // stopStart(null, criticalStop) ;
                // await wait();

                // displayBox(boxes['hwu'].cloneNode(true), `${10 + 10*3}%`, `${11 +15}%`);
                // stopStart(null, criticalStop) ;
                // await wait();

                renderDraggableFunctionality();
                doneDisplaying = true;
                window.removeEventListener('mousemove', hwuMegaDisplay);
              }, 300);
            }
            startup.play();
            setTimeout(function(){
              stopStart(startup, criticalStop);
              displayBox(boxes['tfs']);
              window.addEventListener('mousemove', hwuMegaDisplay, { once: true });
            }, 800);
          });

          function stopStart(stop, start) {
            if(stop) {
              stop.pause();
              stop.currentTime = 0;
            }
            if(start)
            new Audio(start.src).play();
          }

          function tfsClicked() {
            boxes['tfs'].remove();
          }

          // //function knwClicked() {
            //   //boxes['knw'].remove();
            // // }

            async function feneClicked() {
              document.querySelector('.container').innerHTML = '';
              stopStart(null, shutdown);
              await wait(1500);
              document.body.insertAdjacentElement('afterBegin', loadingScreen);
              loadScreen(async function(){
                startup.play();
                await wait(1100);
                document.querySelector('.container').innerHTML = '';

                stopStart(startup, tada);
                await wait(250);
                displayBox(boxes['preg']);
              });
            }

            async function retry() {
              boxes['preg'].remove();
              await wait(250);

              stopStart(null, infoBar);
              await wait();

              boxes['delc'].querySelector('.message').textContent
              =  `Proceeding with the operation 'Retry' will retry to repair NO ERROR condition.
      What do you wish to do ?`;

      boxes['delc'].querySelector('.delb').textContent = 'Retry';
      displayBox(boxes['delc']);
    }

    async function ignore() {
      boxes['preg'].remove();
      await wait(250);

      stopStart(null, infoBar);
      await wait();

      boxes['delc'].querySelector('.message').textContent
      =  `Proceeding with the operation 'Ignore' will ignore the Result of repairing NO ERROR condition.
      What do you wish to do ?`;

      boxes['delc'].querySelector('.delb').textContent = 'Ignore';
      displayBox(boxes['delc']);
    }

          const nextStep = async function (e) {
            await wait();
            stopStart(null, criticalStop);
            displayBox(boxes['fene'], '30%');
          }

    async function nerrClicked() {

      boxes['nerr'].remove();
      await wait();
      stopStart(null, hardwareFail);
      displayBox(boxes['knw']);
      window.addEventListener('keydown', nextStep , { once:true });
      //window.addEventListener('click', nextStep , { once:true });
    }

    async function hwuRestartClicked() {
      document.querySelector('.container').innerHTML = '';
      stopStart(null, shutdown);
      await wait(1500);
      document.body.insertAdjacentElement('afterBegin', loadingScreen);
      loadScreen(async function(){
        // when you click restart before all of those show up, you'll be
        // left with some on the screen. a
        document.querySelector('.container').innerHTML = '';
        startup.play();
        await wait(800);

        stopStart(startup, error);
        await wait();
        stopStart(null, error);
        await wait();
        displayBox(boxes['nerr'], '40%');
      });
    }

    async function proceed() {
      document.querySelector('.container').innerHTML = '';
      await wait(200);
      const endScreen = document.createRange().createContextualFragment(
        `
        <div class="end-screen">
            <div class="center-screen">
              If <span style="color:#ffc600">you got a smile on your face </span>right now, please <span style="color: blue; background:white; border-radius:20px;">drop a huge LIKE</span> on the video
              and <span style="background:red; border-radius:20px;">SUBSCRIBE</span> to the channel for more epic content. <br> <br>
              <span style="color:fuchsia;">Share the joy with your loved ones</span> by <a href="https://twitter.com/share?ref_src=twsrc%5Etfw" class="twitter-share-button" data-size="large" data-text="Reminiscing dumb Windows XP, but on steroids ! " data-url="http://www.google.com" data-via="til20fifa14" data-hashtags="xpheadachesthatonly2000skidsunderstand" data-related="til20fifa14" data-show-screen-name="false" data-show-count="false">Tweet</a>
              ing it and <a href="https://twitter.com/til20fifa14?ref_src=twsrc%5Etfw" class="twitter-follow-button" data-size="large" data-text="Reminiscing dumb Windows XP, but on steroids ! " data-url="http://www.google.com" data-via="til20fifa14" data-hashtags="xpheadachesthatonly2000skidsunderstand" data-related="til20fifa14" data-show-screen-name="false" data-show-count="false">Follow @til20fifa14</a> me as I post weekly tips and tricks on Software
              Make sure you comment <i> lorem ipsum dolor... </i> below for Youtube's algorithm to promote the video.
            </div>
            <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>
        </div>
        `
      );
      console.log(endScreen);
      document.body.appendChild(endScreen);
    }

    // default position is center !
    function displayBox(box, top='50%', left='50%') {
      box.style.position = 'fixed';
      box.style.top = top;
      box.style.left = left;
      box.style.transform = 'translate(-50%, -50%)';
      document.querySelector('.container').appendChild(box);
    }

boxes['nerr'].addEventListener('mousedown', async function (e){
  if(e.target.matches('button')){
    return;
  }
  stopStart(null, error);
  this.querySelectorAll('.nerrc')[1].style.display = 'none';
  await wait(130);
  this.querySelectorAll('.nerrc')[1].style.display = '';
});