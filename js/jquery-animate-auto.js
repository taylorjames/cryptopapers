	
jQuery.fn.animateAutoBody = function (prop, speed, callback)
{
	return this.each(function (i, el)
	{
		$(el).animateAuto(prop, speed, callback, $('body'));
	});
}
jQuery.fn.animateAutoParent = function (prop, speed, callback)
{
	return this.each(function (i, el)
	{
		$(el).animateAuto(prop, speed, callback, $(el).parent());
	});
}
jQuery.fn.animateAuto = function (prop, speed, callback, addto)
{
	var elem, height, width;
	return this.each(function (i, el)
	{
		if (addto == undefined)
			addto = $('body');

		if (prop === "height")
		{
			el = jQuery(el);
			elem = el.clone();
			elem.css({ "height": "auto" })
			elem.appendTo(addto);
			height = elem.css("height");
			width = elem.css("width");
			elem.remove();

			Log(height);
			
			el.animate({ "height": height }, speed, callback);
		}
		else if (prop === "width")
		{
			el = jQuery(el);
			elem = el.clone().css({ "width": "auto" }).appendTo(addto);
			height = elem.css("height");
			width = elem.css("width");
			elem.remove();

			el.animate({ "width": width }, speed, callback);
		}
		else if (prop === "both")
		{
			el = jQuery(el);
			elem = el.clone().css({ "height": "auto", "width": "auto" }).appendTo(addto);
			height = elem.css("height");
			width = elem.css("width");
			elem.remove();

			el.animate({ "width": width, "height": height }, speed, callback);
		}
	});
}