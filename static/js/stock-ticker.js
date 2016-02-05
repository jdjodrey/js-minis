var symbols =
	[
	"GOOG", // Google
	"AAPL", // Apple
	"CSCO", // Cisco
	"IBM", // IBM
	"FB" // Facebook
	];

$(document).ready(function()
{
	for (var i = 0; i < symbols.length; i++)
	{
		$.getJSON('https://finance.google.com/finance/info?client=ig&q=NYSE:' + symbols[i] + '&callback=?',
		function(response)
		{
			$('#stock_container').prepend(stockTemplate(response[0]));
			$('#time_updated label').text(response[0].ltt);
		});
	}
	
	var refresh_id = setInterval(function()
	{
		for (var i = 0; i < symbols.length; i++)
		{
			$.getJSON('https://finance.google.com/finance/info?client=ig&q=NYSE:' + symbols[i] + '&callback=?',
			function(response)
			{
				var stock = response[0];
				var price = parseFloat(stock.l.replace(',', ''));
				var change = parseFloat(stock.c);
				
				var row = $('#stock_container .stock_row[data-symbol="' + stock.t + '"]');
				$(row).children('.stock_price').text(price);
				var direction = (change >= 0) ? 'up' : 'down';
				if (change === 0) direction = 'none';
				$(row).children('.stock_change').text(change).removeClass('none up down').addClass(direction);
				
				$('#time_updated label').text(stock.ltt);
				
				console.log(row);
			});
		}

	}, 5000); // update every 5 seconds
});

function stockTemplate(stock)
{
	var symbol = stock.t;
	var price = parseFloat(stock.l.replace(',', ''));
	var change = parseFloat(stock.c);
	
	var direction = (change >= 0) ? 'up' : 'down';
	if (change === 0) direction = 'none';
	
	var template =
	'<div class="stock_row" data-symbol="%%%symbol">' +
	'	<div class="stock_symbol">%%%symbol</div>' +
	'	<div class="stock_price">%%%price</div>' +
	'	<div class="stock_change %%%direction">%%%change</div>' +
	'</div>';
	
	return template.replace(/%%%symbol/g, symbol)
				   .replace(/%%%price/g, price)
				   .replace(/%%%change/g, change)
				   .replace(/%%%direction/g, direction);
}