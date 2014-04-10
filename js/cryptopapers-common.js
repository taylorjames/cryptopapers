
function Log(Text)
	{
	if (true) // LOG?
		console.log(Text);
	}
	
function IsHex(Str)
	{	
	for (i=0; i< Str.length; i++)
		{
		if (isNaN(parseInt(Str.charAt(i), 16)))
			{
			return false;
			}
		}
		
	return true;
	}

$.fn.allVisible = 	function() {
	var Out = true;
	
	this.each(function() {
		if (this != undefined && $(this) != undefined && $(this).css('height') == undefined || parseFloat($(this).css('opacity')) <= 0 || $(this).css('display') == 'none')
			{
			Out = false;
			return;
			}
		});
		
	return Out;
	}

$.fn.snazzyShow = function(speed, callback) {
	if (this.allVisible())
		{
		$(this).show();
		
		if (callback)
			callback();
		return; // Already visible
		}
	
	speed = speed == undefined ?  300 : speed;
	
	var minimized = $(this).hasClass('minimized')
	var height = minimized ? $(this).attr('minimized-height') : $(this).getTrueHeight();
	
	$(this).attr('oldpadding-top') 
	if ($(this).attr('oldpadding-top') == undefined)
		$(this).css('display', 'block').animate({'height': height}, speed, function() {
			$(this).animate({opacity: '1'}, speed);
			
			if ($(this).attr('fixed-height') == undefined || $(this).attr('fixed-height') == null || $(this).attr('fixed-height').length == 0)
				if (!minimized)
					$(this).css('height', 'inherit');
					
			if (callback)
				callback();
		});
	else
		$(this).show().css('height', '0').animate({'padding-top': $(this).attr('oldpadding-top'), 'padding-bottom': $(this).attr('oldpadding-bottom'), 'height': height}, speed, function() {
			$(this).animate({opacity: '1'}, speed, function() { 
			
			if ($(this).attr('fixed-height') == undefined || $(this).attr('fixed-height') == null || $(this).attr('fixed-height').length == 0)
				if (!minimized)
					$(this).css('height', 'inherit');
	
			if (callback)
				callback();
			});
			
		});
		
	if ($(this).length == 0)
		if (callback)
			callback();
	};

$.fn.snazzyHide = function(speed, callback) {
	
	var Count = this.length;
	
	this.each(function() {
		if (!$(this).allVisible())
			{
			$(this).hide();
			if (callback)
				callback();
			return; // Already hidden
			}
			
		speed = speed == undefined ?  300 : speed;
		
		$(this).animate({opacity: '0'}, speed, function() {
		
			$(this).attr('oldpadding-top', $(this).css('padding-top'));
			$(this).attr('oldpadding-bottom', $(this).css('padding-bottom'));
			
			$(this).animate({'padding-top': '0px', 'padding-bottom': '0px', height: '0px'}, speed, function() {
				$(this).css('display', 'none');
				if (Count == 1)
					{
					if (callback)
						callback();
					}
				});
			});
		});
	
	if (Count == 0)
		{
		if (callback)
			callback();
		}
	else if (Count > 1)
		{
		setTimeout(function() {
		if (callback)
			callback();
			}, speed*2+10);
		}
};

$.fn.getTrueHeight = function() {
	if (this.attr('fixed-height') != undefined)
		return parseInt(this.attr('fixed-height'));
		
	var OldHeight = this.css('height');
	var OldMaxHeight = this.css('max-height');
	this.css('height', 'auto');
	this.css('max-height', 'auto');
	var NewHeight = this.css('height');
	
	if (NewHeight != OldHeight)
		this.css('height', OldHeight);
		
	this.css('max-height', OldMaxHeight);
	
	if ($(this).attr('oldpadding-top') != undefined)
		{
		NewHeight = parseInt(NewHeight.substring(0, NewHeight.length-2));
		NewHeight +=  parseInt($(this).attr('oldpadding-top').substring(0, $(this).attr('oldpadding-top').length-2));
		NewHeight +=  parseInt($(this).attr('oldpadding-bottom').substring(0, $(this).attr('oldpadding-bottom').length-2));
		}
		
	return NewHeight;
}