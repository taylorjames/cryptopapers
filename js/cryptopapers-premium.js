 
 function InitPremium()
	{
	InitVanity();
	
	
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
	}
	

	