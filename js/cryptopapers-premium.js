 
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
	}

DictionaryWords_Split = false;

function InitDictionary()
	{
	if (!DictionaryWords_Split)
		{
		DictionaryWords = SplitWordArray(DictionaryWords);
		DictionaryWords_Split = true;
		}
	}
	
function SplitWordArray(Words)
	{
	var Out = {};
	for (var i = 0; i < Words.length; i++)
		{
		var Word = Words[i];
		var Char = Words[i][0];
		
		if (Word.length >= 1)
			{
			if (Out[Char] == undefined)
				Out[Char] = new Array();
			
			if (Word.length > 1)
				Out[Char].push(Word.substr(1));
			}
		}
	
	for (var j = 0; j < Object.keys(Out).length; j++)
		{
		Out[Object.keys(Out)[j]] = SplitWordArray(Out[Object.keys(Out)[j]]);
		}
	
	return Out;
	}