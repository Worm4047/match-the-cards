/*
 * Create a list that holds all of your cards
 */
var symbols = ['bicycle', 'bicycle', 'leaf', 'leaf', 'cube', 'cube', 'anchor', 'anchor', 'paper-plane-o', 'paper-plane-o', 'bolt', 'bolt', 'bomb', 'bomb', 'diamond', 'diamond'];
var opened = [];
var matched = 0;
var moves = 0;
var deck = document.getElementsByClassName("deck")[0];
var score_panel = document.getElementById("score-panel");
var moveNum = document.getElementsByClassName("moves")[0];
var ratingStars =document.getElementsByTagName("i");
var restart = document.getElementsByClassName("restart")[0];
var timer = document.getElementById("timer");
var timer_object = new Date(0,0,0,0,0,0,0);
var total_time = 0;
console.log(restart);
var delay = 500;
var gameCardsQTY = symbols.length / 2;
var rank3stars = gameCardsQTY + 10;
var rank2stars = gameCardsQTY + 16;
var rank1stars = gameCardsQTY + 20;
initGame();
timerFunction();
function timerFunction() {
	// Update the count down every 1 second
	var x = setInterval(function() {
	timer_object.setSeconds(timer_object.getSeconds() + 1);
	var minutes = timer_object.getMinutes();
	var seconds = timer_object.getSeconds();
	total_time = minutes*60  +seconds;
	// Display the result in the element with id="demo"
	document.getElementById("timer").innerHTML =minutes + "m " + seconds + " s ";
	}, 1000);
}

//Initialise Deck
function initGame(){
	shuffle(symbols);
	deck.innerHTML = "";
	matched = 0;
	moves = 0;
	total_time = 0;
	timer_object = new Date(0,0,0,0,0,0,0);
	timer.innerHTML= "0m 0s";
	moveNum.innerHTML = "0";
	for(var i=0;i<ratingStars.length;i++){
		star = ratingStars[i];
		star.classList.remove('fa-star-o');
		star.classList.add('fa-star');
	};
	symbols.forEach(function(symbol){
	  	var li = document.createElement("li");
	  	li.setAttribute("class","card");
	  	var i = document.createElement("i");
	  	i.setAttribute("class","fa fa-"+symbol);
	  	li.appendChild(i);
	  	deck.appendChild(li);	
	});
	addCardListener();
}

//Set user ratings based on the number of moves
function setRating(){
	var rating = 0;
	if (moves >= rank3stars && moves < rank2stars) {
		ratingStars[2].classList.remove('fa-star');
		ratingStars[2].classList.add('fa-star-o');
		rating = 2;
	} else if (moves >= rank2stars && moves < rank1stars) {
		ratingStars[1].classList.remove('fa-star');
		ratingStars[1].classList.add('fa-star-o');
		rating = 1;
	} 	
	return { score: rating };
}

// End Game
function endGame(moves, score) {
	swal({
		allowEscapeKey: false,
		allowOutsideClick: false,
		title: 'Congratulations! You Won!',
		text: 'With ' + moves + ' Moves and ' + score + ' Stars. Time Taken was '+total_time+' Seconds \n Woooooo!',
		type: 'success',
		confirmButtonColor: '#02ccba',
		confirmButtonText: 'Play again!'
	}).then(function(isConfirm) {
		if (isConfirm) {
			initGame();
		}
	})
}

// Restart Game
$(".restart").on('click', function() {
	console.log("Restart");
  swal({
    allowEscapeKey: false,
    allowOutsideClick: false,
    title: 'Are you sure?',
    text: "Your progress will be Lost!",
    type: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#02ccba',
    cancelButtonColor: '#f95c3c',
    confirmButtonText: 'Yes, Restart Game!'
  }).then(function(isConfirm) {
    if (isConfirm) {
      initGame();
    }
  })
});

///Push to opened cards list
function add_to_opened(elem){
	opened.push(elem);
}

//Display the clicked card
function display_card(elem){
	elem.classList.add("open","show");
}

//When two cards match lock them
function lock_cards(){
	opened.forEach(function(card){
		card.classList.add("match","animated","infinite","rubberBand");
		setTimeout(function(){
			card.classList.remove("open","show","animated","infinite","rubberBand");
		},delay);
	});
	matched++;
}

//
function remove_cards(){
	//different cards
	var temp = opened;
	temp.forEach(function(open_card){
		open_card.classList.add("notmatch","animated","infinite","wobble");
	});
	setTimeout(function(){
		temp.forEach(function(open_card){
			open_card.classList.remove("animated","infinite","wobble");
		});	
		setTimeout(function(){
			temp.forEach(function(open_card){
				open_card.classList.remove("open","show","notmatch");
			})
		},delay);
	},delay/1.5);
}

function increase_and_display_counter(){
	moves++;
	setRating();
	moveNum.innerHTML = moves;
}

function check_end_game(){
	if(matched == gameCardsQTY){
		setRating(moves);
		var score = setRating(moves).score;
		setTimeout(function() {
			endGame(moves, score);
		}, delay);
	}
}

//Function to add listener for click event
function addCardListener(){
	$(".card").on("click",function(evt){
		var elem = this;
		if(!elem.classList.contains("open") && !elem.classList.contains("show") && !elem.classList.contains("match")){
			display_card(elem);
			add_to_opened(elem);
			if(opened.length > 1){
				if(opened[0].innerHTML === opened[1].innerHTML)
					lock_cards();
				else
					remove_cards();
				opened = [];				
			}
			increase_and_display_counter();
			check_end_game();
		}
	});
}

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
}



