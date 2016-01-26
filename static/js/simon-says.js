var PATTERN_INTERVAL_MS = 1000;
var PATTERN_SIZE = 3;
var CURRENT_ROUND = 1;
var INVERVAL_ID = 0;

var GREEN = 'green';
var RED = 'red';
var YELLOW = 'yellow'
var BLUE = 'blue';
var COLORS = [GREEN, RED, YELLOW, BLUE];

var COLOR_SOUNDS = [
					new Audio("./static/audio/400Hz.wav"),
					new Audio("./static/audio/500Hz.wav"),
					new Audio("./static/audio/600Hz.wav"),
					new Audio("./static/audio/700Hz.wav")
				   ];


var LIGHT_UP_CLASS = 'light_up';

var simon_pattern = [];
var user_pattern = [];

$(document).ready(function()
{
	showMenu();
});

$('#menu_div button.start').click(function()
{
	PATTERN_INTERVAL_MS = 1000;
	PATTERN_SIZE = 3;
	CURRENT_ROUND = 1;
	
	startGame();
});

function startGame()
{
	hideMenu();
	$('#level_label span').text(CURRENT_ROUND);
	$('#counter_widget').show();
	doSimonPattern();
}

function doSimonPattern()
{	
	$('table#simon_says td').addClass('disabled');
	
	var current_pattern = 0;
	simon_pattern = [];
	INVERVAL_ID = setInterval(function()
	{
		current_pattern++;
		if (current_pattern > PATTERN_SIZE)
		{
			$('table#simon_says td').removeClass('disabled');
			clearInterval(INVERVAL_ID);
			user_pattern = [];
			//console.log(simon_pattern);
		}
		else
		{
			var color = getRandomColor();
			simon_pattern.push(color);
			lightUpColor(color);
			setTimeout(function()
			{
				clearColors();
			}, PATTERN_INTERVAL_MS/2);
		}
		
	}, PATTERN_INTERVAL_MS);
}

$('table#simon_says td').click(function()
{
	var color = $(this).attr('class');
	playColorSound(color);
	user_pattern.push(color);
	
	var index = user_pattern.length - 1;
	
	if (simon_pattern[index] !== user_pattern[index])
	{
		var losing_msg = "That is incorrect. The correct pattern was: ";
		losing_msg += simon_pattern.join(' -> ');
		alert(losing_msg);
	}
	else if (simon_pattern.length === user_pattern.length)
	{
		//console.log('You got the pattern correct!');
		setRoundValues();
		//console.log('Round #' + CURRENT_ROUND + ' at speed ' + PATTERN_INTERVAL_MS + ' and size ' + PATTERN_SIZE);
		doSimonPattern();
	}
});

function setRoundValues()
{
	$('#level_label span').text(++CURRENT_ROUND);
	
	if (CURRENT_ROUND < 20 && PATTERN_INTERVAL_MS >= 100)
	{
		PATTERN_INTERVAL_MS -= 50;
		
		if (CURRENT_ROUND % 3 === 0)
		{
			PATTERN_SIZE += 1;
		}
	}
	else
	{
		PATTERN_SIZE += 1;
	}
}

function lightUpColor(color)
{
	playColorSound(color);
	$('table#simon_says td.' + color + ' .overlay').show();
}

function playColorSound(color)
{
	COLOR_SOUNDS[COLORS.indexOf(color)].play();
}

function clearColors()
{
	$('table#simon_says td .overlay').hide();
}

function getRandomColor()
{
	return COLORS[Math.floor(Math.random() * COLORS.length)];
}

$('button#back_to_menu').click(function()
{
	var resp = confirm("Are you sure you want to leave this\ngame and go back to the menu?");
	if (resp == true)
	{
		showMenu();
	}
});

function showMenu()
{
	$('#menu_overlay').show();
}

function hideMenu()
{
	$('#menu_overlay').hide();
}