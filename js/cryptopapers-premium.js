 
 var LeftPercent = 50;
 var TopPercent = 0;
 var ZoomPercent = 100;
 
 function InitPremium()
	{
	$('.premium').show();
	
	$('.hue-shift-reset').click(function () {
		HueShift = 0;
		$( "#hue-slider" ).slider('value',0);
		ApplyHueShift();
	});	
	
    $( "#hue-slider" ).slider({
		min: -180,
		max: 180,
		// Which is better?
		//min: 0,
		//max: 360,
		value: 0,
		step: 10,
		slide: function( event, ui ) {
			HueShift = ui.value;
			ApplyHueShift();	
		}
		});

    $("#custom-design-x-slider" ).slider({
		min: 0,
		max: 100,
		value: LeftPercent,
		step: 1,
		slide: function( event, ui ) {
			var x = ui.value;
			
			$('.custom-design-x-amount').html('X: ' + x + '%');
			
			LeftPercent = x;
			
			UpdateBackground();
		}
		});
		
    $("#custom-design-y-slider" ).slider({
		min: 0,
		max: 100,
		value: 0,
		step: 1,
		slide: function( event, ui ) {
			var y = ui.value;
			
			$('.custom-design-y-amount').html('Y: ' + y + '%');
			
			TopPercent = y;
			
			UpdateBackground();
		}
		});
		
    $("#custom-design-zoom-slider" ).slider({
		min: 50,
		max: 200,
		value: 100,
		step: 1,
		slide: function( event, ui ) {
			var zoom = ui.value;
			
			$('.custom-design-zoom-amount').html('Zoom: ' + zoom + '%');
			
			ZoomPercent = zoom;
			
			UpdateBackground();			
		}
		});
	}

function UpdateBackground ()
	{
	var totalwidth = $('.coin-wallet .coin-wallet-background').css('width');
	totalwidth = totalwidth.substr(0, totalwidth.length-2);
	
	var totalheight = $('.coin-wallet .coin-wallet-background').css('height');
	totalheight = totalheight.substr(0, totalheight.length-2);
	
	var width = ZoomPercent + '%';
	var left = (LeftPercent - 50) + '%';
	var top = '-' + Math.round((totalheight - 360) * (TopPercent / 100)) + 'px';
	
	if (totalwidth < 1100)
		{
		left = (1-(totalwidth / 1100)) / 2;
		
		left = left * (LeftPercent/50)  * 100+ '%';
		}
	if (totalheight < 360)
		{
		top =  (1-(totalheight / 360)) / 2;		
		
		top = top * (TopPercent/50) * 100 + '%';		
		}
		
	Log(totalwidth)
	Log(totalheight)
	Log(LeftPercent)
	Log(TopPercent)
	
	$('.coin-wallet .coin-wallet-background').css('width', width).css('left', left).css('top', top);
	
	}