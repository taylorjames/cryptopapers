/*

This script written/modified by CryptoPapers but was helped and inspired by:

http://bitcoinpaperwallet.com by Canton Becker
Donate: 1Pjg628vjMLBvADrPHsthtzKiryM2y46DG

http://bitaddress.org by pointbiz
Donate: 1NiNja1bUmhSoTXozBRBEtR8LeF9TGbZBN


*/


var WhenEntropyPoolFills_AutoGenerateKeys = true;
var WhenEntropyPoolFills_GoToPrint = false;

var MINIMUM_CAPTURE_TIME_DIFFERENCE = 10;

var sr = window.SecureRandom = function () { };

sr.i = 0;
sr.j = 0;
sr.pool = null;
sr.poolSize = 256;
sr.pptr = 0;

sr.pointsKeepCollecting = true;
sr.pointsRequiredMin = 20; // 300;
sr.pointsRequiredMax = 100; // 400;
sr.pointsRequired = Math.round(Math.random() * (sr.pointsRequiredMax - sr.pointsRequiredMin)) + sr.pointsRequiredMin;
sr.pointsCaptured = 0;
sr.lastCaptureTime = new Date().getTime();


function InitRNG() 
	{
	$('.rng-point-count').html(sr.pointsRequired);
	
	$('input[name=rng-keep-collecting]').change(function()
		{
		sr.pointsKeepCollecting = $(this).val() == "Yes";
		});
		
	$('body').mousemove(function(ev)
		{
		sr.mouse_move(ev);
		
		$('#random-pool').val(Crypto.util.bytesToHex(sr.pool));
		
		var collected_points = sr.pointsCaptured;
		var total_points = sr.pointsRequired;
		
		var percent = Math.round(collected_points / total_points * 100);
		
		if (percent > 100)
			percent = 100;
		
		if (collected_points > total_points)
			collected_points = total_points;
			
		$('.rng-status .rng-status-text').html(percent + '% ' + '(' + collected_points + ' / ' + total_points + ')');
		
			
		$('.pool-status-bar .pool-status-complete').attr('style', 'width:' + percent + '%');
		
		var shadow = 55 - Math.round(collected_points / total_points  * 55);
		$('.rng-move-mouse').css('box-shadow', '1px 1px ' + shadow + 'px #' + ($('body').hasClass('dark-theme') ? 'ffffff': '000000'));
		
		if (collected_points == total_points)
			{
			$('.entropy-satisfied').fadeIn(300);
			$('.rng-move-mouse').animate({opacity: '0', padding: '0', height: '0'}, 300);
			
			if (!HasPrivateKey)
				{
				$('.generate-button').removeAttr('disabled').addClass('enabled');
				
				if (WhenEntropyPoolFills_AutoGenerateKeys)
					{
					$('#private-key-generate').click();
					
					if (WhenEntropyPoolFills_GoToPrint)
						{
						$('#coin-setup-menu #print').click();
						}
					}
				}
			}
		});
	}

// Mix in the current time (w/milliseconds) into the pool
// NOTE: this method should be called from body click/keypress event handlers to increase entropy
sr.seedTime = function () {
	sr.seedInt(new Date().getTime());
}

sr.getByte = function () {
	if (sr.state == null) {
		sr.seedTime();
		sr.state = sr.ArcFour(); // Plug in your RNG constructor here
		sr.state.init(sr.pool);
		sr.poolCopyOnInit = [];
		for (sr.pptr = 0; sr.pptr < sr.pool.length; ++sr.pptr)
			sr.poolCopyOnInit[sr.pptr] = sr.pool[sr.pptr];
		sr.pptr = 0;
	}
	// TODO: allow reseeding after first request
	return sr.state.next();
}

// Mix in a 32-bit integer into the pool
sr.seedInt = function (x) {
	sr.seedInt8(x);
	sr.seedInt8((x >> 8));
	sr.seedInt8((x >> 16));
	sr.seedInt8((x >> 24));
}

// Mix in a 16-bit integer into the pool
sr.seedInt16 = function (x) {
	sr.seedInt8(x);
	sr.seedInt8((x >> 8));
}

// Mix in a 8-bit integer into the pool
sr.seedInt8 = function (x) {
	sr.pool[sr.pptr++] ^= x & 255;
	if (sr.pptr >= sr.poolSize) sr.pptr -= sr.poolSize;
}

sr.seed_init = function()
	{	
	// Initialize the pool with junk if needed.
	if (sr.pool == null)
		{
		sr.pool = new Array();
		sr.pptr = 0;

		/*
		var i, j, t;
		for(i = 0; i < 256; ++i)
		sr.pool[i] = i;
		j = 0;
		
		for(i = 0; i < 256; ++i)
			{
			j = (j + sr.pool[i] + key[i % key.length]) & 255;
			t = sr.pool[i];
			sr.pool[i] = sr.pool[j];
			sr.pool[j] = t;
			}
			
		sr.i = 0;
		sr.j = 0;
		*/
		
		var t;
		if (window.crypto && window.crypto.getRandomValues && window.Uint8Array)
			{
			try
				{
				// Use webcrypto if available
				var ua = new Uint8Array(sr.poolSize);
				window.crypto.getRandomValues(ua);
				for (t = 0; t < sr.poolSize; ++t)
					sr.pool[sr.pptr++] = ua[t];
				}
			catch (e) 
				{
				alert(e); 
				}
			}
			
		while (sr.pptr < sr.poolSize)
			{  // extract some randomness from Math.random()
			t = Math.floor(65536 * Math.random());
			sr.pool[sr.pptr++] = t >>> 8;
			sr.pool[sr.pptr++] = t & 255;
			}
			
		sr.pptr = Math.floor(sr.poolSize * Math.random());
		sr.seedTime();
		
		// entropy
		var entropyStr = "";
		
		// screen size and color depth: ~4.8 to ~5.4 bits
		entropyStr += (window.screen.height * window.screen.width * window.screen.colorDepth);
		entropyStr += (window.screen.availHeight * window.screen.availWidth * window.screen.pixelDepth);
		
		// time zone offset: ~4 bits
		var dateObj = new Date();
		var timeZoneOffset = dateObj.getTimezoneOffset();
		entropyStr += timeZoneOffset;
		
		// user agent: ~8.3 to ~11.6 bits
		entropyStr += navigator.userAgent;
		
		// browser plugin details: ~16.2 to ~21.8 bits
		var pluginsStr = "";
		for (var i = 0; i < navigator.plugins.length; i++)
			{
			pluginsStr += navigator.plugins[i].name + " " + navigator.plugins[i].filename + " " + navigator.plugins[i].description + " " + navigator.plugins[i].version + ", ";
			}
			
		var mimeTypesStr = "";
		for (var i = 0; i < navigator.mimeTypes.length; i++)
			{
			mimeTypesStr += navigator.mimeTypes[i].description + " " + navigator.mimeTypes[i].type + " " + navigator.mimeTypes[i].suffixes + ", ";
			}
		entropyStr += pluginsStr + mimeTypesStr;
		
		try
			{
			// cookies and storage: 1 bit
			entropyStr += navigator.cookieEnabled + typeof (sessionStorage) + typeof (localStorage);
			}
		catch(ex) { }
		
		// language: ~7 bit
		entropyStr += navigator.language;
		
		// history: ~2 bit
		entropyStr += window.history.length;
		
		// location
		entropyStr += window.location;

		var entropyBytes = Crypto.SHA256(entropyStr, { asBytes: true });
		
		for (var i = 0 ; i < entropyBytes.length ; i++)
			{
			sr.seedInt8(entropyBytes[i]);
			}
		}
	}

sr.seed_next = function()
	{
	var t;
	sr.i = (sr.i + 1) & 255;
	sr.j = (sr.j + sr.pool[sr.i]) & 255;
	t = sr.pool[sr.i];
	sr.pool[sr.i] = sr.pool[sr.j];
	sr.pool[sr.j] = t;
	return sr.pool[(t + sr.pool[sr.i]) & 255];
	}
sr.getBytes = function(count)
	{
	var Out = new Array();
	var temp = 0;
	
	while (temp < count)
		{
		Out[temp] = sr.seed_next();
		temp++;
		}
	
	return Out;
	}
	
sr.mouse_move = function(ev)
	{
	if (sr.pointsCaptured < sr.pointsRequired || 
		sr.pointsKeepCollecting == true)
		{
		var timeStamp = new Date().getTime();
		
		if (ev && (timeStamp - sr.lastCaptureTime) > MINIMUM_CAPTURE_TIME_DIFFERENCE)
			{
			sr.seedTime();
			var seed = ev.clientX * ev.clientY;
			sr.seedInt16(seed);
						
			sr.pointsCaptured++;
			sr.lastCaptureTime = new Date().getTime();
			}
		}
	}

sr.seed_init();


