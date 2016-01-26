var IMAGE_DIR = "static/img/";
var CARD_IMAGES = [
					"bolt.png",
					"circle.png",
					"diamond.png",
					"heart.png",
					"hexagon.png",
					"octagon.png",
					"oval.png",
					"pentagon.png",
					"square.png",
					"star_4_point.png",
					"star_5_point.png",
					"star_6_point.png",
					"triangle_acute.png",
					"triangle_right.png",
					"arrow_down.png",
					"arrow_left.png",
					"arrow_right.png",
					"arrow_up.png",
					"cloud.png",
					"drop.png",
				  ];

var GAME_SIZE = ["4x4", "6x5", "8x5"];
var GAME_DIFFICULTY = ["Easy", "Normal", "Hard"];

var GUESSES = 0;
var MATCHES_MADE = 0;
var MATCHES_LEFT = 0;

$(document).ready(function()
{
	initMenu();
});

function initMenu()
{
	var menu = $('#button_div');
	
	for (var i = 0; i < GAME_SIZE.length; i++)
	{
		var game_width = GAME_SIZE[i].split('x')[0];
		var game_height = GAME_SIZE[i].split('x')[1];
		var button = '<button class="menu_button"' +
						'data-game-width="' + game_width + '" ' +
						'data-game-height="' + game_height + '">' +
						GAME_SIZE[i] + ' - ' + GAME_DIFFICULTY[i] +
					'</button>';
		menu.append(button);
	}
	
	menu.find('button').click(function()
	{
		initCards($(this).attr('data-game-width'), $(this).attr('data-game-height'));
	});
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

function initCards(width, height)
{
	$('#menu_overlay').hide();
	initCardElements(width, height);
	initCardFronts();
	initGlobalCounts((width * height));
}

function initCardElements(width, height)
{
	var table = $('#card_table');
	table.empty();
	
	for (var i = 0; i < height; i++)
	{
		var row = '';
		
		row = '<tr>';
		
		for (var j = 0; j < width; j++)
		{
			row += 	'<td class="card"><div class="card_front"></div></div></td>';
		}
	
		row += '</tr>';
		
		table.append(row);
	}
}

function initCardFronts()
{
	var cards = $('#card_table td.card');
	var num_cards = cards.length;
	var images = CARD_IMAGES.slice(0, (num_cards/2));
	var used_images = [];
	
	for (var i = 0; i < num_cards; i++)
	{
		var image_index = Math.floor(Math.random() * images.length);
		var image = images[image_index];
		
		var card_index = Math.floor(Math.random() * cards.length);
		var card = cards[card_index];
		
		cards.splice(card_index, 1);
		
		if (used_images.indexOf(image) !== -1)
		{
			images.splice(image_index, 1);
		}
		else
		{
			used_images.push(image);
		}
		
		$(card).attr('data-match-index', CARD_IMAGES.indexOf(image));
		$(card).find('.card_front').css('background-image', "url('" + IMAGE_DIR + image + "')");
	}
}

function initGlobalCounts(total_cards)
{
	GUESSES = 0;
	MATCHES_MADE = 0;
	MATCHES_LEFT = total_cards / 2;
	
	$('#guess_label span').text(GUESSES);
	$('#matches_made_label span').text(MATCHES_MADE);
	$('#matches_left_label span').text(MATCHES_LEFT);
	
	$('#counter_widget').show();
}

$('td.card').live('click', function()
{
	if ($(this).hasClass('matched')) return;
	
	var card = $(this);
	var flipped_cards = $('#card_table td.card').filter('.flipped');
	var num_flipped = flipped_cards.length;
	
	switch(num_flipped)
	{
		case 1:
			showCard(card, checkForMatch);
			break;
		default:
			showCard(card);
			break;
	}
});


function showCard(card, callback)
{
	card.addClass('flipped');
	card.find('.card_front').show();
	card.flip({
		direction: 'rl',
		speed: 200,
		color: '#FFFFFF',
		onEnd: function()
		{
			if (callback === undefined) return;
			else callback();
		}
	});
}

function hideCards(cards)
{
	if (cards.length === 0) return;
	
	var current_color = $('#card_color_widget div.color.selected').data('color');
	
	cards.removeClass('flipped');
	cards.find('.card_front').hide();
	cards.flip({
		direction: 'lr',
		speed: 200,
		color: current_color
	});
}

function checkForMatch()
{	
	var flipped_cards = $('#card_table td.card').filter('.flipped');
	var card_1_index = $(flipped_cards[0]).attr('data-match-index');
	var card_2_index = $(flipped_cards[1]).attr('data-match-index');
	
	if (card_1_index === card_2_index)
	{
		setTimeout(function()
		{
			flipped_cards.removeClass('flipped');
			flipped_cards.addClass('matched');
			updateGlobalCounts(true);
		}, 250);
	}
	else
	{
		setTimeout(function()
		{
			hideCards(flipped_cards);
		}, 500);
		updateGlobalCounts(false);
	}
}

function updateGlobalCounts(matched)
{
	$('#guess_label span').text(++GUESSES);
	
	if (matched)
	{
		$('#matches_made_label span').text(++MATCHES_MADE);
		$('#matches_left_label span').text(--MATCHES_LEFT);
	}
	
	if (!MATCHES_LEFT)
	{
		alert('You won in ' + GUESSES + ' guesses!');
		showMenu();
	}
}

$('#card_color_widget div.color').click(function ()
{
	$('td.card').css('background-color', $(this).data('color'));
	$('#card_color_widget div.color').removeClass('selected');
	$(this).addClass('selected');
});
