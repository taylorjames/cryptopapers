
var Vanity_Enabled = false;
 
var Vanity = '';
var VanityCaseSensitive = false;

var VanityAllowLeet = false;

var VanityLeastCaps = false;
var VanityMostCaps = false;
var VanityLeastLower = false;
var VanityMostLower = false;
var VanityLeastNumbers = false;
var VanityMostNumbers = false;


var Vanity_TimeMS = 0;

var VanityLoopTimeout = 5;

var Vanity_Stop = false;

var VanityDictionary = false;
var VanityDictionary_AllowCaps = true;
var VanityDictionary_AllowLower = true;
var VanityDictionary_AllowTitle = true;
var VanityDictionary_AllowMixed = false;
var VanityDictionary_MinLetters = 4;

var VanityDictionary_Position = 'start'; // 'end' 'both'

var Vanity_AtTheStart = true;

 function InitVanity()
	{
	$('.vanity-addresses.minimized').click(function() {
		});	
		
	$('#vanity-address-start').click(function() {
				
		InitDictionary();
		
		$('.vanity-addresses > div > .progress').fadeIn();
		
		Vanity_Stop = false;
		GenerateVanity(false, 
			function(KeyBytes, KeyAddress) { // Good
				var KeyHex = Crypto.util.bytesToHex(KeyBytes);
				
				$('.vanity-good-results').insertAt(1, '<div class="result">' +
					'<div class="result-address">' + KeyAddress + '</div>' + 
					'<div class="result-key">' + KeyHex + '</div>' + 
					'</div>', 1);
				},
			function(KeyBytes, KeyAddress) { // New Best
				
				var KeyHex = Crypto.util.bytesToHex(KeyBytes);
				
				$('.vanity-good-results .best').removeClass('best');
				
				$('.vanity-good-results').prepend('<div class="result best">' +
					'<div class="result-address">' + KeyAddress + '</div>' + 
					'<div class="result-key">' + KeyHex + '</div>' + 
					'</div>');
				},
			function(KeyBytes, KeyAddress) { // Perfect
				Vanity_Stop = true;
				
				$('.vanity-addresses > div > .progress').fadeOut();
				
				var KeyHex = Crypto.util.bytesToHex(KeyBytes);
				
				$('.vanity-good-results .best').removeClass('best');
				
				$('.vanity-good-results').prepend('<div class="result best">' +
					'<div class="result-address">' + KeyAddress + '</div>' + 
					'<div class="result-key">' + KeyHex + '</div>' + 
					'</div>');
					
				$('#private-key-input').val(Crypto.util.bytesToHex(KeyBytes));
				$('#private-key-input').change();			
				});
	});
	$('#vanity-address-stop').click(function() {
	
		$('.vanity-addresses > div > .progress').fadeOut();
		Vanity_Stop = true;
	});
	
	$('input[name=vanity-type]').change(function() {
		var Type = $('input[name=vanity-type]:checked').val();
		if (Type == 'text')
			{
			$('.vanity-text-options').show();
			$('.vanity-characters-options').hide();
			$('.vanity-dictionary-options').hide();
			}
		else if (Type == 'characters')
			{
			$('.vanity-text-options').hide();
			$('.vanity-characters-options').show();
			$('.vanity-dictionary-options').hide();
			}
		else if (Type == 'dictionary')
			{
			$('.vanity-text-options').hide();
			$('.vanity-characters-options').hide();
			$('.vanity-dictionary-options').show();
			}
		/*
		if (Type == 'text')
			{
			$('.vanity-characters-options').fadeOut(300);
			$('.vanity-dictionary-options').fadeOut(300, function() 
				{
				$(this).hide();
				$('.vanity-text-options').show().fadeIn(300);
				});
			}
		else if (Type == 'characters')
			{
			$('.vanity-text-options').fadeOut(300);
			$('.vanity-dictionary-options').fadeOut(300, function() 
				{
				$(this).hide();
				$('.vanity-characters-options').show().fadeIn(300);
				});
			}
		else if (Type == 'dictionary')
			{
			$('.vanity-text-options').fadeOut(300);
			$('.vanity-characters-options').fadeOut(300, function() 
				{
				$(this).hide();
				$('.vanity-dictionary-options').show().fadeIn(300);
				});
			}
			*/
	});
	$('input[name=vanity-numbers], ' +
		'input[name=vanity-caps], ' +
		'input[name=vanity-lower], ' +
		'input[name=vanity-case-sensitive], ' + 
		'input[name=vanity-leet], ' + 
		'input[name=vanity-dictionary-caps], ' + 
		'input[name=vanity-dictionary-lower], ' + 
		'input[name=vanity-dictionary-title], ' + 
		'input[name=vanity-dictionary-mixed], ' + 
		'input[name=vanity-dictionary-length], ' +
		'input[name=vanity-words]').change(function() {
		UpdateVantiyOptions();
	});
	$('#vanity-custom-text').keyup(function() {
		UpdateVantiyOptions();
	});
	}
	
function RefreshVanity()
	{
	if (ArmoryMode || ElectrumMode || CoinInfo[CurrentCoinType].manual || !Vanity_Enabled)
		$('.vanity-addresses').fadeOut(300);
	else
		$('.vanity-addresses').fadeIn(300);	
	}
	
DictionaryWords_Split = false;

function InitDictionary()
	{
	if (!DictionaryWords_Split)
		{
		UpdateVantiyOptions();
	
		DictionaryWordsHash = SplitWordArray(DictionaryWords);
		DictionaryWordsHashReverse = SplitWordArray(DictionaryWords, true);
		
		DictionaryWords_Split = true;
		}
	}

var VanityEnabled = undefined;

function UpdateVantiyOptions()
	{
	var Numbers = $('input[name=vanity-numbers]:checked').val() == 'Yes';
	var Caps = $('input[name=vanity-caps]:checked').val() == 'Yes';
	var Lower = $('input[name=vanity-lower]:checked').val() == 'Yes';
	
	VanityCaseSensitive = $('input[name=vanity-case-sensitive]:checked').val() == 'Yes';
	VanityAllowLeet = $('input[name=vanity-leet]:checked').val() == 'Yes';
	
	VanityDictionary = $('input[name=vanity-words]:checked').val() == 'Yes';
	
	VanityDictionary_AllowCaps = $('input[name=vanity-dictionary-caps]:checked').val() == 'Yes';
	VanityDictionary_AllowLower = $('input[name=vanity-dictionary-lower]:checked').val() == 'Yes';
	VanityDictionary_AllowTitle = $('input[name=vanity-dictionary-title]:checked').val() == 'Yes';
	VanityDictionary_AllowMixed = $('input[name=vanity-dictionary-mixed]:checked').val() == 'Yes';
	VanityDictionary_MinLetters = parseInt($('input[name=vanity-dictionary-length]:checked').val());
		
	VanityDictionary_Position = $('input[name=vanity-dictionary-position]:checked').val();
	
	Vanity = $('#vanity-custom-text').val();
	
	VanityLeastCaps = false;
	VanityMostCaps = false;
	VanityLeastLower = false;
	VanityMostLower = false;
	VanityLeastNumbers = false;
	VanityMostNumbers = false;
	
	if (Vanity != '')
		{
		}
	else if (VanityDictionary)
		{
		}
	else if (Numbers && Caps && Lower)
		{	
		// All
		$('.vanity-generate-speed').html('');
		$('.vanity-generate-guesses').html('Odds: 1 / 1');
		$('.vanity-generate-estimate').html('Seconds: 0');	
		
		$('#vanity-address-start').attr('disabled', '');
		$('#vanity-address-stop').attr('disabled', '');
		return;
		}
	else if (Caps)
		{
		if (Numbers)
			{
			VanityLeastLower = true;
			}
		else if (Lower)
			{
			VanityLeastNumbers = true;
			}
		else
			{
			VanityMostCaps = true;
			}
		}
	else if (Lower)
		{
		if (Numbers)
			{
			VanityLeastCaps = true;
			}
		else
			{
			VanityMostLower = true;
			}
		}
	else if (Numbers)
		{
		VanityMostNumbers = true;
		}
	else
		{
		$('#vanity-address-start').attr('disabled', '');
		$('#vanity-address-stop').attr('disabled', '');
		// NONE
		return;
		}
		
	$('#vanity-address-start').removeAttr('disabled');
	$('#vanity-address-stop').removeAttr('disabled');
		
	var Result = VanityEstimateSeconds();
	
	var GuessesPerSecond = Result[0];
	var Guesses = Result[1];
	var Seconds = Result[2];
	
	$('.vanity-generate-speed').html('Keys/Sec: ' + GuessesPerSecond);
	$('.vanity-generate-guesses').html('Odds: 1 / ' + Guesses);
	$('.vanity-generated').html('Total Generated: ' + KeysGenerated);
	
	if (Seconds > 60)
		{
		var Minutes = Seconds / 60;
		
		if (Minutes > 60)
			{
			var Hours = Minutes / 60;
			
			if (Hours > 24)
				{
				var Days = Hours / 24;
				
				if (Days > 365)
					{
					var Years = Days / 365;
					
					if (Years > 100)
						{
						if (Years > 100000)
							{
							$('.vanity-generate-estimate').html('Never.');
							}
						else
							{
							$('.vanity-generate-estimate').html('Longer than your lifespan.');
							}
						}
					else
						{
						$('.vanity-generate-estimate').html('Years: ' + Math.round(Years,1));
						}
					}
				else
					{
					$('.vanity-generate-estimate').html('Days: ' + Math.round(Days,1));
					}
				}
			else
				{
				$('.vanity-generate-estimate').html('Hours: ' + Math.round(Hours));
				}
			}
		else
			{
			$('.vanity-generate-estimate').html('Minutes: ' + Math.round(Minutes));	
			}
		}
	else
		{
		$('.vanity-generate-estimate').html('Seconds: ' + Math.round(Seconds));	
		}
	}

function VanityEnabled()
	{
	return Vanity != '' || VanityLeastCaps || VanityMostCaps || VanityLeastNumbers || VanityMostNumbers || VanityLeastLower || VanityMostLower;
	}
	
function VanityEstimateSeconds()
	{	
	var Caps = "ABCDEFGHJKLMNPQRSTUVWXYZ".length;
	var Lower = "abcdefghijkmnopqrstuvwxyz".length;
	var Numbers = "123456789".length;
	var AllChars = "123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ";
	var All = AllChars.length;
	
	var AddressLen = Math.round((34 + 27) /2);
	
	var Odds = 1;
	
	if (Vanity != '')
		{
		var VanityLower = Vanity.toLowerCase();
		
		for (var i = 0; i < Vanity.length; i++)
			{
			var Char = Vanity[i];
			var CharLower = VanityLower[i];
			
			var Index = AllChars.indexOf(Char);
			if (Index < 0)
				{
				// Character was used that is not in Base 58
				Odds = Infinity;
				break;
				}	
			
			var CharOdds = 1;
			
			if (!VanityCaseSensitive)
				{
				if (Char == 'L' || Char == 'O' || Char == 'I' || Char == '1' || Char == '2' || Char == '3' || Char == '4' || Char == '5' || Char == '6' || Char == '7'
					|| Char == '8' || Char == '9')
					{
					CharOdds = 1;
					}
				else
					{
					CharOdds++;
					}
				
				}
			else
				{
				}
			
			if (VanityAllowLeet && (Char == 'O'  || Char == 'l' || Char == 'e' || Char == 'E' || Char == 'a' || Char == 'A' || Char == 's' || Char == 'S'
				|| Char == 'g' || Char == 'G' || Char == 't' || Char == 'T' || Char == 'b' || Char == 'b'))
				{
				CharOdds++;
				}
			
			Odds *= CharOdds / 58;
			}
		Odds = 1 / Odds;
		}
	else if (VanityLeastCaps != '')
		{
		Odds = 1 / Math.pow((Lower+Numbers) / All, AddressLen);
		}
	else if (VanityMostCaps != '')
		{
		Odds = 1 / Math.pow(Caps / All, AddressLen);
		}
	else if (VanityLeastNumbers != '')
		{
		Odds = 1 / Math.pow((Caps+Lower) / All, AddressLen);
		}
	else if (VanityMostNumbers != '')
		{
		Odds = 1 / Math.pow(Numbers / All, AddressLen);
		}
	else if (VanityLeastLower != '')
		{
		Odds = 1 / Math.pow((Caps+Numbers) / All, AddressLen);
		}
	else if (VanityMostLower != '')
		{
		Odds = 1 / Math.pow(Lower / All, AddressLen);
		}
	else
		{
		Odds = Infinity;
		}
	
	var Guesses = Math.round(Odds);
	var SecondsPerGuess = (Vanity_TimeMS  / 1000);
	var GuessesPerSecond = Math.round(1  / SecondsPerGuess);
	var Seconds = Guesses * SecondsPerGuess;
	
	return [GuessesPerSecond, Guesses, Seconds];
	}
	
function CountUpperCase(Str)
	{
	return Str.replace(/[^A-Z]/g, "").length;
	}
function CountLowerCase(Str)
	{
	return Str.replace(/[^a-z]/g, "").length;
	}
function CountNumbers(Str)
	{
	return Str.replace(/\D/g, "").length;
	}
function IndexFirstUpper(Str)
	{
	var Match = Str.match(/[A-Z]/);
	return Match == null ? Str.length : Match.index;
	}
function IndexFirstLower(Str)
	{
	var Match = Str.match(/[a-z]/);
	return Match == null ? Str.length : Match.index;
	}
function IndexFirstDigit(Str)
	{
	var Match = Str.match(/\d/);
	return Match == null ? Str.length : Match.index;
	}
function IndexFirstNonUpper(Str)
	{
	var Match = Str.match(/[^A-Z]/);
	return Match == null ? Str.length : Match.index;
	}
function IndexFirstNonLower(Str)
	{
	var Match = Str.match(/[^a-z]/);
	return Match == null ? Str.length : Match.index;
	}
function IndexFirstNonDigit(Str)
	{
	var Match = Str.match(/[^0-9]/);
	return Match == null ? Str.length : Match.index;
	}
	
var GlobalGoodFound = function() {};
var GlobalNewBestFound = function() {};
var GlobalPerfectFound = function() {};

var KeysGenerated = 0;

function GenerateVanity(TestSpeed, GoodFound, NewBestFound, PerfectFound)
	{
	if (!VanityCaseSensitive)
		Vanity = Vanity.toLowerCase();

	if (Default_Compress == undefined)
		{
		Default_Compress = GetDefaultCompress(CurrentCoinType);
		}
		
	var tries = 0;
	var tries_count2 = 0;

	var CoinType = $('div.coin.active').attr('data');

	var PrivKeyBytes_Best = undefined;
	var Address_Best = '';
	var Count_Best = -1;
	
	var Vanity_Time_Begin = window.performance.now();

	var TestCount = 100;
	var TestCounted = 0;
	
	KeysGenerated = 0;
	
	GlobalGoodFound = GoodFound;
	GlobalNewBestFound = NewBestFound;
	GlobalPerfectFound = PerfectFound;
	
	/*
	var code = "GenerateLoop(" + TestSpeed + ", " + tries+ ", " + tries_count2 + ", '" + CoinType + "', undefined, '" + Address_Best+ "', " + Count_Best + ", " + Vanity_Time_Begin + ", " + TestCount + ", " + TestCounted + ");";
	
	Log(code);
	
	var blob = new Blob([code], {type: 'text/javascript'});

	code = window.URL.createObjectURL(blob);

	new Worker(code);
	new Worker(code);
	new Worker(code);
	new Worker(code);
	*/	
	
	GenerateLoop(TestSpeed, tries, tries_count2, CoinType, PrivKeyBytes_Best, Address_Best, Count_Best, Vanity_Time_Begin, TestCount, TestCounted);
	}
	
function GenerateLoop(TestSpeed, tries, tries_count2, CoinType, PrivKeyBytes_Best, Address_Best, Count_Best, Vanity_Time_Begin, TestCount, TestCounted)
	{
	if (Vanity_Stop)
		return;
		
	if (TestSpeed)
		{
		if (TestCounted < TestCount)
			{
			TestCounted++;
			}
		else
			{
			Vanity_TimeMS  = window.performance.now() - Vanity_Time_Begin;
			Vanity_TimeMS  = Vanity_TimeMS / TestCount;
			
			return Vanity_TimeMS;
			}
		}
	
	var PrivateBytes = sr.getBytes(32);
	
	sr.seedTime();
	
	var KeyDetails = new Omnicoin.ECKey(PrivateBytes, eval('0x' + CoinInfo[CoinType].addressVersion), Default_Compress).getDetails();
	
	var PubKey = KeyDetails.publicKey;
	var Address = KeyDetails.address;
	
	if (Vanity != '')
		{
		AddressLower = Address;
		
		if (!VanityCaseSensitive)
			{
			AddressLower = Address.toLowerCase();	
			}
			
		if (VanityAllowLeet)
			AddressLower = ReplaceLeet(AddressLower);
			
		if (Vanity[0] != AddressLower[1])
			{
			GenerateContinue(TestSpeed, tries, tries_count2, CoinType, PrivKeyBytes_Best, Address_Best, Count_Best, Vanity_Time_Begin, TestCount, TestCounted);
			return;
			}
		else if (Count_Best < 1)
			{
			Count_Best = 1;
			PrivKeyBytes_Best = PrivateBytes;
			Address_Best = Address;
			
			if (GlobalNewBestFound)
				GlobalNewBestFound(PrivKeyBytes_Best, Address_Best);
			}
			
		if (Vanity.length > 1 && Vanity[1] != AddressLower[2])
			{
			GenerateContinue(TestSpeed, tries, tries_count2, CoinType, PrivKeyBytes_Best, Address_Best, Count_Best, Vanity_Time_Begin, TestCount, TestCounted);
			return;
			}
		else if (Count_Best < 2)
			{
			Count_Best = 2;
			PrivKeyBytes_Best = PrivateBytes;
			Address_Best = Address;
			
			if (GlobalNewBestFound)
				GlobalNewBestFound(PrivKeyBytes_Best, Address_Best);
			}
			
		if (Vanity.length > 2 && Vanity[2] != AddressLower[3])
			{
			if (Count_Best == 2)
				{
				if (GlobalGoodFound)
					GlobalGoodFound(PrivateBytes, Address);				
				}
				
			GenerateContinue(TestSpeed, tries, tries_count2, CoinType, PrivKeyBytes_Best, Address_Best, Count_Best, Vanity_Time_Begin, TestCount, TestCounted);
			return;
			}
		else if (Count_Best < 3)
			{
			Count_Best = 3;
			PrivKeyBytes_Best = PrivateBytes;
			Address_Best = Address;
			
			if (GlobalNewBestFound)
				GlobalNewBestFound(PrivKeyBytes_Best, Address_Best);
			}
			
		if (Vanity.length > 3 && Vanity[3] != AddressLower[4])
			{
			if (Count_Best == 3)
				{
				if (GlobalGoodFound)
					GlobalGoodFound(PrivateBytes, Address);				
				}
				
			GenerateContinue(TestSpeed, tries, tries_count2, CoinType, PrivKeyBytes_Best, Address_Best, Count_Best, Vanity_Time_Begin, TestCount, TestCounted);
			return;
			}
		else if (Count_Best < 4)
			{
			Count_Best = 4;
			PrivKeyBytes_Best = PrivateBytes;
			Address_Best = Address;
			
			if (GlobalNewBestFound)
				GlobalNewBestFound(PrivKeyBytes_Best, Address_Best);
			}
			
		if (Vanity.length > 4 && Vanity[4] != AddressLower[5])
			{
			if (Count_Best == 4)
				{
				if (GlobalGoodFound)
					GlobalGoodFound(PrivateBytes, Address);				
				}
				
			GenerateContinue(TestSpeed, tries, tries_count2, CoinType, PrivKeyBytes_Best, Address_Best, Count_Best, Vanity_Time_Begin, TestCount, TestCounted);
			return;
			}
		else if (Count_Best < 5)
			{
			Count_Best = 5;
			PrivKeyBytes_Best = PrivateBytes;
			Address_Best = Address;
			
			if (GlobalPerfectFound)
				GlobalPerfectFound(PrivKeyBytes_Best, Address_Best);
			}
		}
	else if (VanityDictionary)
		{		
		var Result = null;
		var Result2 = null;
		var Result3 = null;
		
		if (VanityDictionary_Position == 'start' || VanityDictionary_Position == 'both')
			{
			Result = BeginsWithDictionaryWord(DictionaryWordsHash, Address);
			Result2 = BeginsWithDictionaryWord(DictionaryWordsHash, Address.substr(1));
			}
		if (VanityDictionary_Position == 'end' || VanityDictionary_Position == 'both')
			{
			Result3 = EndsWithDictionaryWord(DictionaryWordsHashReverse, Address);
			}
		
		if ((Result != null && Result[0]) || (Result2 != null && Result2[0]) || (Result3 != null && Result3[0]))
			{
			var CountWordLength = 0;
			
			if (Result != null && Result[0])
				CountWordLength = Result[1];
			if (Result2 != null && Result2[0] && CountWordLength < Result2[1])
				CountWordLength = Result2[1];
			if (Result3 != null && Result3[0] && CountWordLength < Result3[1])
				CountWordLength = Result3[1];
			
			if (Count_Best == -1 || CountWordLength > Count_Best)
				{
				Count_Best = CountWordLength;
				PrivKeyBytes_Best = PrivateBytes;
				Address_Best = Address;
				
				if (GlobalNewBestFound)
					GlobalNewBestFound(PrivKeyBytes_Best, Address_Best);
				}
			else if (CountWordLength >= VanityDictionary_MinLetters)
				{
				if (GlobalGoodFound)
					GlobalGoodFound(PrivateBytes, Address);
				}
			}
		}
	else if (VanityLeastCaps)
		{
		var CountCaps = Vanity_AtTheStart ? Address.length - 1 - IndexFirstUpper(Address.substr(1)) :CountUpperCase(Address.substr(1));
		
		if (Count_Best == -1 || CountCaps < Count_Best)
			{
			Count_Best = CountCaps;
			PrivKeyBytes_Best = PrivateBytes;
			Address_Best = Address;
			
			if (GlobalNewBestFound)
				GlobalNewBestFound(PrivKeyBytes_Best, Address_Best);
			}
		else if (CountCaps == Count_Best)
			{
			if (GlobalGoodFound)
				GlobalGoodFound(PrivateBytes, Address);
			}
		
		if (CountCaps == 0)
			{
			if (GlobalPerfectFound)
				GlobalPerfectFound(PrivKeyBytes_Best, Address_Best);
			return;
			}
		else
			{
			GenerateContinue(TestSpeed, tries, tries_count2, CoinType, PrivKeyBytes_Best, Address_Best, Count_Best, Vanity_Time_Begin, TestCount, TestCounted);
			return;
			}
		}
	else if (VanityMostCaps)
		{
		var CountCaps = Vanity_AtTheStart ? IndexFirstNonUpper(Address.substr(1)) :CountUpperCase(Address.substr(1));
		
		if (Count_Best == -1 || CountCaps > Count_Best)
			{
			Count_Best = CountCaps;
			PrivKeyBytes_Best = PrivateBytes;
			Address_Best = Address;
			
			if (GlobalNewBestFound)
				GlobalNewBestFound(PrivKeyBytes_Best, Address_Best);
			}
		else if (CountCaps == Count_Best)
			{
			if (GlobalGoodFound)
				GlobalGoodFound(PrivateBytes, Address);
			}
		
		if (CountCaps == Address.length-1)
			{
			if (GlobalPerfectFound)
				GlobalPerfectFound(PrivKeyBytes_Best, Address_Best);
			return;
			}
		else
			{
			GenerateContinue(TestSpeed, tries, tries_count2, CoinType, PrivKeyBytes_Best, Address_Best, Count_Best, Vanity_Time_Begin, TestCount, TestCounted);
			return;
			}
		}
	else if (VanityLeastNumbers)
		{
		var CountNum = Vanity_AtTheStart ? Address.length - 1 - IndexFirstDigit(Address.substr(1)) : CountNumbers(Address.substr(1));
		
		if (Count_Best == -1 || CountNum < Count_Best)
			{
			Count_Best = CountNum;
			PrivKeyBytes_Best = PrivateBytes;
			Address_Best = Address;
			
			if (GlobalNewBestFound)
				GlobalNewBestFound(PrivKeyBytes_Best, Address_Best);
			}
		else if (CountNum == Count_Best)
			{
			if (GlobalGoodFound)
				GlobalGoodFound(PrivateBytes, Address);
			}
		
		if (CountNum == 0)
			{
			if (GlobalPerfectFound)
				GlobalPerfectFound(PrivKeyBytes_Best, Address_Best);
			return;
			}
		else
			{
			GenerateContinue(TestSpeed, tries, tries_count2, CoinType, PrivKeyBytes_Best, Address_Best, Count_Best, Vanity_Time_Begin, TestCount, TestCounted);
			return;
			}
		}
	else if (VanityMostNumbers)
		{
		var CountNum =  Vanity_AtTheStart ? IndexFirstNonDigit(Address.substr(1)) : CountNumbers(Address.substr(1));
		
		if (Count_Best == -1 || CountNum > Count_Best)
			{
			Count_Best = CountNum;
			PrivKeyBytes_Best = PrivateBytes;
			Address_Best = Address;
			
			if (GlobalNewBestFound)
				GlobalNewBestFound(PrivKeyBytes_Best, Address_Best);
			}
		else if (CountNum == Count_Best)
			{
			if (GlobalGoodFound)
				GlobalGoodFound(PrivateBytes, Address);
			}
		
		if (CountNum == Address.length-1)
			{
			if (GlobalPerfectFound)
				GlobalPerfectFound(PrivKeyBytes_Best, Address_Best);
			return;
			}
		else
			{
			GenerateContinue(TestSpeed, tries, tries_count2, CoinType, PrivKeyBytes_Best, Address_Best, Count_Best, Vanity_Time_Begin, TestCount, TestCounted);
			return;
			}
		}
	else if (VanityLeastLower)
		{
		var CountLower = Vanity_AtTheStart ? Address.length - 1 - IndexFirstLower(Address.substr(1)) : CountLowerCase(Address.substr(1));
		
		if (Count_Best == -1 || CountLower < Count_Best)
			{
			Count_Best = CountLower;
			PrivKeyBytes_Best = PrivateBytes;
			Address_Best = Address;
			
			if (GlobalNewBestFound)
				GlobalNewBestFound(PrivKeyBytes_Best, Address_Best);
			}
		else if (CountLower == Count_Best)
			{
			if (GlobalGoodFound)
				GlobalGoodFound(PrivateBytes, Address);
			}
		
		if (CountLower == 0)
			{
			if (GlobalPerfectFound)
				GlobalPerfectFound(PrivKeyBytes_Best, Address_Best);
			return;
			}
		else
			{
			GenerateContinue(TestSpeed, tries, tries_count2, CoinType, PrivKeyBytes_Best, Address_Best, Count_Best, Vanity_Time_Begin, TestCount, TestCounted);
			return;
			}
		}
	else if (VanityMostLower)
		{
		var CountLower = Vanity_AtTheStart ? IndexFirstNonLower(Address.substr(1)) : CountLowerCase(Address.substr(1));
		
		if (Count_Best == -1 || CountLower > Count_Best)
			{
			Count_Best = CountLower;
			PrivKeyBytes_Best = PrivateBytes;
			Address_Best = Address;
			
			if (GlobalNewBestFound)
				GlobalNewBestFound(PrivKeyBytes_Best, Address_Best);
			}
		else if (CountLower == Count_Best)
			{
			if (GlobalGoodFound)
				GlobalGoodFound(PrivateBytes, Address);
			}
		
		if (CountLower == Address.length-1)
			{
			if (GlobalPerfectFound)
				GlobalPerfectFound(PrivKeyBytes_Best, Address_Best);
			return;
			}
		else
			{
			GenerateContinue(TestSpeed, tries, tries_count2, CoinType, PrivKeyBytes_Best, Address_Best, Count_Best, Vanity_Time_Begin, TestCount, TestCounted);
			return;
			}
		}
		
	GenerateContinue(TestSpeed, tries, tries_count2, CoinType, PrivKeyBytes_Best, Address_Best, Count_Best, Vanity_Time_Begin, TestCount, TestCounted);
	
	return;
	}
	
function GenerateContinue(TestSpeed, tries, tries_count2, CoinType, PrivKeyBytes_Best, Address_Best, Count_Best, Vanity_Time_Begin, TestCount, TestCounted)
	{
	tries++;
	tries_count2++;
	
	if (tries_count2 == VanityLoopTimeout)
		{
		KeysGenerated += VanityLoopTimeout;
		
		Vanity_TimeMS  = window.performance.now() - Vanity_Time_Begin;
		Vanity_TimeMS  = Vanity_TimeMS / VanityLoopTimeout;
		
		UpdateVantiyOptions();
		
		Vanity_Time_Begin = window.performance.now();
		setTimeout(function()
			{
			tries_count2 = 0;
			GenerateContinue(TestSpeed, tries, tries_count2, CoinType, PrivKeyBytes_Best, Address_Best, Count_Best, Vanity_Time_Begin, TestCount, TestCounted)
			}, 0);
		}
	else
		{
		GenerateLoop(TestSpeed, tries, tries_count2, CoinType, PrivKeyBytes_Best, Address_Best, Count_Best, Vanity_Time_Begin, TestCount, TestCounted);
		}
	}

function ReplaceLeet(Str)
	{
	Str = Str.replace('0', 'o');
	Str = Str.replace('1', 'l');
	Str = Str.replace('3', 'e');
	Str = Str.replace('4', 'a');
	Str = Str.replace('5', 's');
	Str = Str.replace('6', 'g');
	Str = Str.replace('7', 't');
	Str = Str.replace('8', 'b');
	return Str;
	}
	
function EndsWithDictionaryWord(DictionaryWords, Address)
	{
	return BeginsWithDictionaryWord(DictionaryWords, Address, true);
	}
function BeginsWithDictionaryWord(DictionaryWords, Address, Ends)
	{
	var FoundWord = '';
	var FoundWordEnd = '';
	// Address = Address.toLowerCase();
	
	if (VanityAllowLeet)
		Address = ReplaceLeet(Address);
	
	var Out = [false, 0];
	var Cursor = DictionaryWords;
	
	var Goal_Upper = VanityDictionary_AllowCaps;
	var Goal_Lower = VanityDictionary_AllowLower;
	var Goal_Title = VanityDictionary_AllowTitle;
	
	var i = Ends ? Address.length-1 : 0;
	var inc = Ends ? -1 : 1;
	
	for (i = i; (Ends? (i >= 0) : (i < Address.length)); i += inc)
		{
		var Length = Ends ? Address.length - i : (i + 1);
		
		var Char = Address[i];
		
		if (Char != Char.toLowerCase())
			{
			Goal_Lower = false;
			}
		if (Char != Char.toUpperCase())
			{
			Goal_Upper = false;
			}
		
		if (Ends)
			{
			// Fix
			Goal_Title = false;
			}
		else
			{
			if (i == 0 && Char != Char.toUpperCase())
				{
				Goal_Title = false;
				}
			else if (i > 0 && Char != Char.toLowerCase())
				{
				Goal_Title = false;
				}
			}
			
		if (!VanityDictionary_AllowMixed && !Goal_Upper && !Goal_Lower && !Goal_Title)
			{
			FoundWord = '';
			break;
			}

		Cursor = Cursor[Char.toLowerCase()];
		if (Cursor != undefined)
			{
			FoundWord += Char.toLowerCase();
			
			if (Cursor['WORD'] == true && Length >= VanityDictionary_MinLetters)
				{
				FoundWordEnd = FoundWord;
				Out = [true, Length];
				}
			}
		else
			{
			FoundWord = '';
			break;
			}
		}
	
	if (FoundWordEnd != '')
		{
		if (Ends)
			Log(FoundWordEnd.split("").reverse().join(""));
		else
			Log(FoundWordEnd);
		}
		
	return Out;
	}
	
function SplitWordArray(Words, Reverse)
	{
	var Out = {};
	for (var i = 0; i < Words.length; i++)
		{
		var Word = Words[i];
		
		if (Word == 'WORD')
			{
			Out['WORD'] = true;
			continue;
			}
		
		if (Reverse)
			{
			Word = Word.split("").reverse().join("");
			}
		
		var Char = Word[0];
		
		if (Word.length >= 1)
			{
			if (Out[Char] == undefined)
				Out[Char] = new Array();
			
			if (Word.length > 1)
				Out[Char].push(Word.substr(1));
			else if (Word.length == 1)
				Out[Char].push('WORD');
			}
		}
	
	for (var j = 0; j < Object.keys(Out).length; j++)
		{
		if (Object.keys(Out)[j] != 'WORD')
			Out[Object.keys(Out)[j]] = SplitWordArray(Out[Object.keys(Out)[j]], 
			false /* Only reverse on the first iteration */ );
		}
	
	return Out;
	}