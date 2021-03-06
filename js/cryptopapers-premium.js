 
 var LeftPercent = 50;
 var TopPercent = 0;
 var ZoomPercent = 100;
 

var HueShift = 0;
var HueShiftChange = 5;

 function InitPremium()
	{
	InitVanity();
	
	
	$('.premium').show();
	
	$('.print-appearance-reset').click(function () {
		HueShift = 0;
		LeftPercent = 50;
		TopPercent = 0;
		ZoomPercent = 100;
		
		$( "#hue-slider" ).slider('value', HueShift);
		$( "#custom-design-x-slider" ).slider('value', LeftPercent);
		$( "#custom-design-y-slider" ).slider('value', TopPercent);
		$( "#custom-design-zoom-slider" ).slider('value', ZoomPercent);
		
		UpdateBackground();
		
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
			
			$('.custom-design-x-amount').html(x + '%');
			
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
			
			$('.custom-design-y-amount').html(y + '%');
			
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
			
			$('.custom-design-zoom-amount').html(zoom + '%');
			
			ZoomPercent = zoom;
			
			UpdateBackground();			
		}
		});
	}

function ApplyHueShift()
	{	
	$('.hue-shift-amount').html((HueShift > 0 ? '+' : '') + HueShift + '&deg;');
	$('.coin-wallet-background, #header, .footer, #page .inner input[type=button], #page .inner .button, .pool-status-complete, #page .inner .switch-toggle, #coin-setup-menu, .donate-reminder img').css('filter', 'hue-rotate(' + HueShift + 'deg)');
	$('.coin-wallet-background, #header, .footer, #page .inner input[type=button], #page .inner .button, .pool-status-complete, #page .inner .switch-toggle, #coin-setup-menu, .donate-reminder img').css('-webkit-filter', 'hue-rotate(' + HueShift + 'deg)');
	}
	
function UpdateBackground()
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
	else if (totalwidth >= 1100)
		{
		left = ((totalwidth / 1100) - 1) / 2
		left = -left;
		left = left * (LeftPercent/50) * 100 + '%';
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
	$('.custom.coin-wallet-background').css('width', width).css('left', left).css('top', top);
	
	}
