var        startBtn = document.getElementById("start"),
          greenBtn = document.getElementById("green"),
              redBtn = document.getElementById("red"),
          yellowBtn = document.getElementById("yellow"),
             blueBtn = document.getElementById("blue"),
    greeBtnAudio = document.getElementById("greenBtnAudio"),
      redBtnAudio = document.getElementById("redBtnAudio"),
  yellowBtnAudio = document.getElementById("yellowBtnAudio"),
     blueBtnAudio = document.getElementById("blueBtnAudio"),
            currTime = document.getElementById("time-js"),
             strictBtn = document.getElementById( "strict-js" ),
              counter = document.getElementById("counter"),
   onOffSliderBtn = document.getElementById("slider_js");

var gameState = {
    playerTurn: false,
    computerSequence: [],
    userSequence: [],
    round: 0,
    lock: false,
    userRound: 0,
    isStart: false,
    waitingOnPlayer: false,
    isStrict: false,
    animationFrameId: null,
    isOn: false
};

var colors = {
    green: 0,
    red: 1,
    yellow: 2,
    blue: 3
}

greenBtn.style.opacity = 1;
redBtn.style.opacity = 1;
yellowBtn.style.opacity = 1;
blueBtn.style.opacity = 1;

var clickHandler = function(e) {
    // console.log(e.target.id.toUpperCase());

    var button = [e.target],
        userChoice = userButtonChoice(button);

    gameState.start = Date.now();
    if (gameState.playerTurn) {
        animateButtons(button, function() {

            gameState.userSequence.push(userChoice);
            var userInputCorrect = processInput();
            if (userInputCorrect) {
                gameState.userRound++;
                if (gameState.userRound >= gameState.round) {
                    var didUpdateOccur = update();
                    if (didUpdateOccur) {
                        userSettingDefault();
                        render();
                    } else {
                        // Game is over. Reset gameState
                        userSettingDefault();
                        // Animate Game Over
                        elementAnimation("WON", "", counter, render);
                        handleStart();
                    }
                } else {
                    gameState.start = Date.now();
                    console.log("waiting on user input");
                }

            } else {
                
                if( gameState.isStrict ) {
                    gameState.computerSequence = [];
                    init();
                }
                userSettingDefault();                
                // Animate Error
                elementAnimation("!!", "", counter, render);
            }

        });
    } else {
        console.log("Game is currently locked.");
    }
    //          console.log( JSON.stringify( gameState, null, 2 ) );
};

function userButtonChoice(button) {
    var userChoice;

    switch (button[0].id) {
        case "green":
            userChoice = 0;
            break;
        case "red":
            userChoice = 1;
            break;
        case "yellow":
            userChoice = 2;
            break;
        default:
            userChoice = 3;
    }

    return userChoice;
}

function animateButtons(arr, callback) {

    var seq = Array.isArray(arr) ? arr.slice() : [arr],
        count = 0,
        len = seq.length;

    var id = setInterval(function() {
        playBtnSound(seq[count]);
        if (seq.length - count === 1) {
            buttonBlink(seq[count], callback);
        } else {
            buttonBlink(seq[count]);
        }

        count++;
        if (count >= len) {
            clearTimeout(id);
        }
    }, 600);

}

function playBtnSound(button) {

    var button = typeof button === "object" ? colors[(button.id).toLowerCase()] : button;

    if (button === 0) {
        greenBtnAudio.play();
    } else if (button === 1) {
        redBtnAudio.play();
    } else if (button === 2) {
        yellowBtnAudio.play();
    } else {
        blueBtnAudio.play();
    }
}

function buttonBlink(color, callback) {

    var button, btnColor;

    if (typeof color === "object") {
        button = color;
    } else {
        if (color === 0) {
            button = greenBtn;
        } else if (color === 1) {
            button = redBtn;
        } else if (color === 2) {
            button = yellowBtn;
        } else {
            button = blueBtn;
        }
    }

    button.style.opacity = .5;
    setTimeout(function() {
        button.style.opacity = 1;
        if (typeof callback === "function") {
            callback();
        }
    }, 300);
}

function errorAnimation(callback) {
    var count = 0;

    var id = setInterval(function() {
        if (count === 1) {
            animateCounterError("!!", callback);
        } else {
            animateCounterError("!!");
        }
        count++;
        if (count >= 2) {
            clearInterval(id);
        }
    }, 500);
}

function animateCounterError(str, callback) {
    var errorStr = str || "!!";

    counter.textContent = errorStr;
    setTimeout(
        function() {

            counter.textContent = "";
            if (typeof callback === "function") {
                callback();
            }
        }, 400
    )
}

function elementAnimation(defaultStr, toggleStr, element, callback) {
    var count = 0;

    var id = setInterval(function() {
        if (count === 1) {
            animateElement(defaultStr, toggleStr, element, callback);
        } else {
            animateElement(defaultStr, toggleStr, element);
        }
        count++;
        if (count >= 2) {
            clearInterval(id);
        }
    }, 500);
}

function animateElement(defaultStr, toggleStr, element, callback) {
    var defaultStr = defaultStr || "!!";

    if (typeof element === "object") {
        element.textContent = defaultStr;
    }

    setTimeout(function() {
        element.textContent = toggleStr;
        if (typeof callback === "function") {
            callback();
        }
    }, 400)

}

function run() {
    var elapsedTime = (Date.now() - gameState.start) / 1000;
    if ( elapsedTime > 8 ) {
     console.log( elapsedTime );
    }
    
    if (gameState.isStart) {

        currTime.textContent = elapsedTime;
        if ( elapsedTime > 10 && !gameState.lock ) {
            gameState.lock = true;
            // took to long to input data
            userSettingDefault();
            elementAnimation( "!!", "", counter, function() { 
                render( function() {
                    gameState.lock = false;
                });
                
            } )            
        }
    }

    // console.log( JSON.stringify( gameState, null, 2 ) );
    gameState.animationFrameId = requestAnimationFrame(run);
}

function processInput() {
    var userRound = gameState.userRound;

    return gameState.computerSequence[userRound] === gameState.userSequence[userRound];
}

function update() {
    var len = gameState.computerSequence.length;

    if (len < 20) {
        gameState.computerSequence.push(randomColor());
        gameState.round++;
        return true;
    }
    return false;
}

function userSettingDefault() {
    gameState.playerTurn = false;
    gameState.userRound = 0;
    gameState.userSequence = [];
}

function render( callback ) {

    animateButtons(gameState.computerSequence, function() {
        gameState.start = Date.now();
        gameState.playerTurn = true;
        if( typeof callback === "function" ) {
            callback();
        }
    });
    // counter.textContent = gameState.round;
    update_time( gameState.round );
}

function randomColor() {
    var num = Math.random();

    if (num <= .25) {
        return 0;
    } else if (num <= .50) {
        return 1;
    } else if (num <= .75) {
        return 2;
    } else {
        return 3;
    }
}

function handleStart( e ) {
    if( gameState.isOn ) {
        gameState.isStart = true;
        changeCursorToPointer( [greenBtn, redBtn, yellowBtn, blueBtn], "pointer" );
        changeButtonClass( e.target, "btn-start-off", "btn-start-on" );
        if (gameState.computerSequence.length === 0) {
            init();
            if( gameState.animationFrameId !== null ) {
                window.cancelAnimationFrame( gameState.animationFrameId );
            }
            render( run );
        } else {
            gameState.computerSequence = [];
            gameState.round = 0;
            init();
            if( gameState.animationFrameId !== null ) {
                window.cancelAnimationFrame( gameState.animationFrameId );
            }
            render( run );
        }
    }
    
    console.log("Pressing start.");
}

function changeCursorToPointer( elements, cursorStyle ) {
    elements.forEach( function ( element ) {
        element.style.cursor = cursorStyle;
    })
}

function changeButtonClass( button, currentClassState, updatedClassState  ) {
    console.log( button.className );
    var classes = button.className;
     
    classes = classes.replace( currentClassState, updatedClassState );
    console.log( classes );
    button.className = classes;
 
}

function handleStrictBtn( e ) {
    e.preventDefault();
    var button = e.target;
    if( gameState.isStart ) {
        if( gameState.isStrict ) { 
            gameState.isStrict = false;
            changeButtonClass( e.target, "btn-strict-on", "btn-strict-off" );
        } else {
            gameState.isStrict = true;
            changeButtonClass( e.target, "btn-strict-off", "btn-strict-on" );
        }
        
    }
    
    console.log( "Strict: " + gameState.isStrict );

}

function handleOnOffSlider( e ) {
    
    if( !gameState.isOn ) {
        gameState.isOn = true;
        changeButtonClass( e.target, "slider-button-off", "slider-button-on" );
        changeCursorToPointer( [startBtn, strictBtn], "pointer");
    } else {
        gameState.isOn = false;
        changeButtonClass( e.target, "slider-button-on", "slider-button-off" );
        resetGameToDefaultSettings();
    }
}

function resetGameToDefaultSettings() {
    console.log( "game state reset to default" );
    if( gameState.animationFrameId !== null ) {
        clearInterval( gameState.animationFrameId );
    }
    
    changeCursorToPointer( [greenBtn, redBtn, yellowBtn, blueBtn], "initial");
    changeCursorToPointer( [startBtn, strictBtn], "initial");
    changeButtonClass( startBtn, "btn-start-on", "btn-start-off" );
    changeButtonClass( strictBtn, "btn-strict-on", "btn-start-off" );
    animateElement( "--", 0, counter, function() { console.log( "Power off" ); } )
    
    gameState = {
        playerTurn: false,
        computerSequence: [],
        userSequence: [],
        round: 0,
        lock: false,
        userRound: 0,
        isStart: false,
        waitingOnPlayer: false,
        isStrict: false,
        animationFrameId: null,
        isOn: false
    };
}

greenBtn.addEventListener("click", clickHandler, false);
redBtn.addEventListener("click", clickHandler, false);
yellowBtn.addEventListener("click", clickHandler, false);
blueBtn.addEventListener("click", clickHandler, false);
startBtn.addEventListener("click", handleStart, false);
strictBtn.addEventListener( "click", handleStrictBtn, false );
onOffSliderBtn.addEventListener( "click", handleOnOffSlider, false);

function init() {

    gameState.computerSequence.push( randomColor() );
    gameState.round = gameState.computerSequence.length;
    gameState.start = Date.now();

    console.log(JSON.stringify(gameState, null, 2));
}

/* code is from http://tutorialzine.com/2013/06/digital-clock/ by Martin Angelov */
var clock = $( "#clock" );

var digits_to_name = "zero one two three four five six seven eight nine".split(" ");

var digits = {};

var positions = [ "second", "first" ];

var digit_holder = clock.find(".digits");

$.each( positions, function() {
    
      var pos = $("<div>");
      for( var i = 1; i < 8; i++ ){
          pos.append("<span class='d" + i + "'>");
      }
      // console.log( this );
      // Set the digits as key:value pairs in the digits object
      digits[this] = pos;
      
      // Add the digit elements to the page
      digit_holder.append(pos);
    
    
});

function update_time( num ) {
  var numStr = num + "",
        numStrArr, firstStr, secondStr;
  if( numStr.length > 1 ) {
    numStrArr = numStr.split("");
    secondNumberStr = numStrArr[0];
    firstNumberStr = numStrArr[1];
    digits.first.attr( "class", digits_to_name[parseInt(firstNumberStr, 10)] );
    digits.second.attr( "class", digits_to_name[parseInt(secondNumberStr, 10)] );
  } else {
    digits.first.attr( "class", digits_to_name[num] );
  }
  // console.log( digits );
  // digits.first.attr("class", digits_to_name[0]);
}

// update_time(10);

/* End of code from http://tutorialzine.com/2013/06/digital-clock/ by Martin Angelov */