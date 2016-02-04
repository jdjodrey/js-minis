var GLOBAL_TIMEOUT_ID = -1;
var GLOBAL_NUM_POINTS = 100;
var GLOBAL_INTERVAL_MS = 250;
var GLOBAL_TIMEOUT_FLAG = true;
var HOST = 'www.yahoo.com';

var data = [];
var plot = null;

$(document).ready(function()
{
	plot = $.plot("#graph_placeholder", [initialData()],
	{
		series: {
			shadowSize: 0	// Drawing is faster without shadows
		},
		yaxis: {
			min: 0,
			max: 1000,
			axisLabel: "Ping (ms)"
		},
		xaxis: {
			show: false
		},
	});
});

function initialData()
{
	for (var i = 0; i < GLOBAL_NUM_POINTS; i++)
	{
		data.push(0);
	}
	
	var coordinates = [];
	
	for (var i = 0; i < data.length; i++)
	{
		coordinates.push([i, data[i]]);
	}
	
	return coordinates;
}

function generateData()
{
	data = data.slice(1);
	
	pingServer(HOST, update);
}

function update()
{
	var coordinates = [];
	
	for (var i = 0; i < data.length; i++)
	{
		coordinates.push([i, data[i]]);
	}
	
	plot.setData([coordinates]);
	plot.draw();

	if (GLOBAL_TIMEOUT_FLAG)
	{
		GLOBAL_TIMEOUT_ID = setTimeout(generateData, GLOBAL_INTERVAL_MS);
	}
}

function pingServer(server_name, callback)
{
	var s = {};
	s.name = server_name;
	
	new ping(s.name, function (status, ping) {
		s.status = status;
		data.push(ping);
		console.log(server_name + ' ' + s.status + ' in ' + ping + 'ms');
		callback();
	});
}

$('#go_button').click(function()
{
	var new_host = $.trim($('#ping_host').val());
	if (!new_host.match("^www\.") || !new_host.match("\.[com|org|edu|net]$"))
	{
		alert("Please enter a valid site address, i.e: www.example.[com|org|edu|net]");
		return;
	}

	if (GLOBAL_TIMEOUT_ID !== -1)
	{
		clearTimeout(GLOBAL_TIMEOUT_ID);
	}
	
	console.log(HOST + " --> " + new_host);
	GLOBAL_TIMEOUT_FLAG = true;
	HOST = new_host;
	generateData();
});

$('#stop_button').click(function()
{
	if (GLOBAL_TIMEOUT_ID !== -1)
	{
		clearTimeout(GLOBAL_TIMEOUT_ID);
		GLOBAL_TIMEOUT_FLAG = false;
	}
});

function ping(ip, callback)
{

    if (!this.inUse)
	{
        this.status = 'unchecked';
        this.inUse = true;
        this.callback = callback;
        this.ip = ip;
		
        var _that = this;
		
        this.img = new Image();
        this.img.onload = function ()
		{
            _that.inUse = false;
			
			var ping = new Date().getTime() - _that.start;
			
            _that.callback('responded', ping);

        };
		
        this.img.onerror = function (e)
		{
            if (_that.inUse)
			{
                _that.inUse = false;
				
				var ping = new Date().getTime() - _that.start;
				
                _that.callback('responded', ping);
            }

        };
		
        this.start = new Date().getTime();
        this.img.src = "http://" + ip;
        this.timer = setTimeout(function ()
		{
            if (_that.inUse)
			{
                _that.inUse = false;
                _that.callback('timeout');
            }
        }, 1500);
    }
}