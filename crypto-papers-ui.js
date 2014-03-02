
var Default_Compress = undefined;
var AutoGenerateWhenEntropyPoolFills = true;
var HasPrivateKey = false;
var Vanity = '';
var VanityCaseSensitive = true;

var Security_Online;
var Security_Cookies;

function TestTheory()
	{
	/*
	var bytes1 = sr.getBytes(32);
	var byteshex1 = Crypto.util.bytesToHex(bytes1);
	var wallet1 = new Bitcoin.ECKey(bytes1);
	var walletpt1 = wallet1.getPubPoint();
	var walletptpublichex1 = Crypto.util.bytesToHex(GetEncoded(walletpt1, false));
	
	var bytes2 = sr.getBytes(32);
	var byteshex2 = Crypto.util.bytesToHex(bytes2);
	var wallet2 = new Bitcoin.ECKey(bytes2);
	var walletpt2 = wallet2.getPubPoint();
	var walletptpublichex2 = Crypto.util.bytesToHex(GetEncoded(walletpt2, false));
	var publickey2 = GetPublicKeyBytes(bytes2);
	var publickeyhex2 = Crypto.util.bytesToHex(publickey2);

	var walletpt3 = walletpt1.add(walletpt2);
	
//	var walletptpublichex3 = Crypto.util.bytesToHex(GetEncoded(walletpt3, false));
//	var address = GetAddress(walletptpublichex3);
	
	var wallet3 = new Bitcoin.ECKey();
	wallet3.setPub(walletpt3);
	var address2 = wallet3.getBitcoinAddress();
	
	Log(publickeyhex2);
	Log(walletptpublichex2);
//	Log(walletptpublichex3);
//	Log(address);
	Log(address2);
	*/
//	walletpt3.add(walletpt2);
	/*
	var CoinType = 'btc';
	
	var bytes1 = sr.getBytes(32);
	var byteshex1 = Crypto.util.bytesToHex(bytes1);
	var publickey1 = GetPublicKeyBytes(bytes1);
	var publickeyhex1 = Crypto.util.bytesToHex(publickey1);
	var address1 = GetAddressFromBytes(CoinType, publickey1);
	
	var bytes2 = sr.getBytes(32);
	var byteshex2 = Crypto.util.bytesToHex(bytes2);
	var publickey2 = GetPublicKeyBytes(bytes2);
	var publickeyhex2 = Crypto.util.bytesToHex(publickey2);
	var address2 = GetAddressFromBytes(CoinType, publickey2);
	
	var bytes3 = XORBytes(bytes1, bytes2);
	var byteshex3 = Crypto.util.bytesToHex(bytes3);
	var publickey3 = GetPublicKeyBytes(bytes3);
	var publickeyhex3 = Crypto.util.bytesToHex(publickey3);
	var address3 = GetAddressFromBytes(CoinType, publickey3);
	
	
	var publickey4 = XORBytes(publickey1, publickey2);
	var publickeyhex4 = Crypto.util.bytesToHex(publickey4);
	var address4 = GetAddressFromBytes(CoinType, publickey4);
	
	Log(byteshex1);
	Log(publickeyhex1);
	Log(address1);
	
	Log(byteshex2);
	Log(publickeyhex2);
	Log(address2);
	
	Log(byteshex3);
	Log(publickeyhex3);
	Log(address3);	
	
	Log();
	Log(publickeyhex4);
	Log(address4);	
	*/
	}


function XORBytes(a, b)
	{
	var c = new Array();
	
	for (var i = 0; i < a.length; i++)
		{
		c[i] = (a[i] + b[i]) & 255;
		}
		
	return c;
	}


function GenerateVanity()
	{
	if (!VanityCaseSensitive)
		Vanity = Vanity.toLowerCase();

	var tries = 0;
	var tries_count2 = 0;

	var CoinType = $('div.coin.active').attr('data');

	while (true)
		{
		var PrivateBytes = sr.getBytes(32);
		
		sr.seedTime();
		
		var PubKeyBytes = GetPublicKeyBytes(PrivateBytes, Default_Compress);
		
		var Address = GetAddressFromBytes(CoinType, PubKeyBytes);
							
		if (tries_count2 == 100)
			{
			Log(tries);
			tries_count2 = 0;
			}
		//Log(AddressStart);
		
		tries++;
		tries_count2++;
		
		if (!VanityCaseSensitive)
			{
			Address = Address.toLowerCase();	
			}
			
		if (Vanity[0] != Address[1])
			continue;
		if (Vanity.length > 1 && Vanity[1] != Address[2])
			continue;
		if (Vanity.length > 2 && Vanity[2] != Address[3])
			continue;
		if (Vanity.length > 3 && Vanity[3] != Address[4])
			continue;
		if (Vanity.length > 4 && Vanity[4] != Address[5])
			continue;
			
		break;						
		}

	$('#private-key-input').val(Crypto.util.bytesToHex(PrivateBytes));
	$('#private-key-submit').click();
	}

function GenerateAddress(display)
	{
	if (display)
		$('#coin-address-verify').val('');
	
	var CoinType = $('div.coin.active').attr('data');
	
	if (display)
		Log("Coin Type: " + CoinType);
	
	if (Default_Compress == undefined)
		{
		Default_Compress = GetDefaultCompress(CoinType);
		}
	
	var Compressed = Default_Compress;
	
	var PrivKey = $("#private-key-input").val();
	
	var PrivKeyHex = '';
	var PrivKeyWIF = '';
	
	if (PrivKey.length == 64)
		{
		PrivKeyHex = PrivKey;
		PrivKeyWIF = PrivateKeyHexToWIF(CoinType, PrivKeyHex, Default_Compress);
		}
	else if (PrivKey.length == 51 || PrivKey.length == 52)
		{
		PrivKeyWIF = PrivKey;
		Compressed = GetPrivateKeyCompressed(CoinType, PrivKeyWIF);
		PrivKeyHex = PrivateKeyWIFToHex(PrivKeyWIF);
		
		if (Compressed && !Default_Compress)
			PrivKeyWIF = PrivateKeyHexToWIF(CoinType, PrivKeyHex, false);
		if (!Compressed && Default_Compress)
			PrivKeyWIF = PrivateKeyHexToWIF(CoinType, PrivKeyHex, true);
			
		Compressed = Default_Compress;
		}
	else
		{
		Log("Unknown format: Size " + PrivKey.length);
		return;
		}
		
	HasPrivateKey = true;
	
	if (display)
		{
		$('.key-details').fadeIn();
		
		$('#private-key-hex').val(PrivKeyHex);
		$('#private-key-wif').val(PrivKeyWIF);
		$('#private-key-compressed').val(Compressed ? 'Yes' : 'No');
		
		Log("Private Key Hex: " + PrivKeyHex);
		Log("Private Key WIF: " + PrivKeyWIF);
		Log("Compressed: " + Compressed);
		}
	
	var PubKeyHex;
	var Address;
	if (display)
		{
		var PubKeyHex = GetPublicKey(Crypto.util.hexToBytes(PrivKeyHex), Compressed);
		
		var Address = GetAddress(CoinType, PubKeyHex);
		}
	else
		{
		var PubKeyBytes = GetPublicKeyBytes(Crypto.util.hexToBytes(PrivKeyHex), Compressed);
		
		var Address = GetAddressFromBytes(CoinType, PubKeyBytes);
		}
		
	if (display)
		{
		$('#public-key-hex').val(PubKeyHex);
		$('#public-address').val(Address);
	
		Log("Public Address: " + Address);
		
		$('.coin-wallet-address').html(Address);
		$('.coin-wallet-address-qr').qrcode(Address);
	
		var split = Math.round(PrivKeyWIF.length/2);
		
		var PrivKeyWIF_Part1 = PrivKeyWIF.substr(0, split);
		var PrivKeyWIF_Part2 = PrivKeyWIF.substr(split);
		
		
		var Backup = ($('input[name=wallet-backup]:checked').val() == "Yes");
				
		if (Backup)
			{
			$('.coin-wallet-2').css('display', 'block');
			}
		else
			{
			$('.coin-wallet-2').css('display', 'none');
			}
		
		if (CoinType == 'btc')
			{
			// Verify
			var VerifyAddressECKey = new Bitcoin.ECKey(Crypto.util.hexToBytes(PrivKeyHex));
			VerifyAddressECKey.compressed = Compressed;
			var VerifyAddress = VerifyAddressECKey.getBitcoinAddress().toString();
			var Verified = (PrivKeyHex != '') && (Address == VerifyAddress);
			
			$('#coin-address-verify').val(Verified ? 'Yes' : 'No');
			}	
			
		$('.coin-wallets').removeClass('btc').removeClass('ltc').removeClass('nmc').removeClass('ppc').removeClass('nxt');
		$('.coin-wallets').addClass(CoinType);

		$('.coin-wallet-address').html(Address);
		
		$('.coin-wallet-address-qr').html('');
		$('.coin-wallet-address-qr').qrcode(Address);
		
		$('.coin-wallet-private-key.top').html(PrivKeyWIF_Part1);
		$('.coin-wallet-private-key.bottom').html(PrivKeyWIF_Part2);
		
		$('.coin-wallet-private-key-qr').html('');
		$('.coin-wallet-private-key-qr').qrcode(PrivKeyWIF);
		}
	
	return Address;
	}


	
function TestEnvironment()
	{
	Security_Online = navigator.onLine;
	Security_Cookies = navigator.cookieEnabled;
	
    if (typeof navigator.cookieEnabled == "undefined" && !cookieEnabled)
		{ 
		try
			{
			document.cookie="testcookie";
			Security_Cookies = (document.cookie.indexOf("testcookie") != -1) ? true : false;
			}
		catch(ex)
			{
			Security_Cookies = false;
			}
		}
	}
	
function InitPage()
	{
	$('body').mousemove(function(ev) {
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
		
		if (collected_points == total_points && !HasPrivateKey)
			{
			$('.generate-button').removeAttr('disabled').addClass('enabled');
			$('ul#coin-setup-menu li#print.step').removeClass('disabled');

			if (AutoGenerateWhenEntropyPoolFills)
				{
				$('#private-key-generate').click();
				}
			}
	});
	
	$(".donate-reminder").click(function() 
		{
		$('.menu-key-donate').click();
		});
		
	$("#private-key-submit").click(function() 
		{
		var Address = GenerateAddress(true);
		});
		
	$('input[name=print-face]').change(function() 
		{
		$('.coin-wallet').hide();
		$('.coin-wallets').toggleClass('back');
		$('.coin-wallet').fadeIn();
		});
		
	$('#print-button').click(function() 
		{
		$('.coin-wallet').attr('style', '');
		window.print();
		});
		
	$('input[name=compression]').change(function() 
		{
		Default_Compress = !Default_Compress;

		$("#private-key-submit").click();
		});
	
	$('input[name=wallet-backup]').change(function()
		{
		var Backup = ($('input[name=wallet-backup]:checked').val() == "Yes");
				
		if (Backup)
			{
			$('.coin-wallet-2').fadeIn();
			}
		else
			{
			$('.coin-wallet-2').fadeOut();
			}

		});
		
	$('input[name=theme]').change(function() {
		if ($(this).val() == "Yes")
			$('body').removeClass('dark-theme');
		else
			$('body').addClass('dark-theme');
	});
	$('input[name=rng-keep-collecting]').change(function() {
		sr.pointsKeepCollecting = $(this).val() == "Yes";
	});
	
	$('input[name=wallet-zoom]').change(function()
		{
		var Zoom = $('input[name=wallet-zoom]:checked').val();
		
		$('.coin-wallet').animate({zoom: Zoom + '%'}, 300);
		
		setTimeout(301, function() {
			$('.coin-wallet').css('zoom', '');
			$('.coin-wallet').removeClass('zoom-90').removeClass('zoom-95').removeClass('zoom-100').removeClass('zoom-105').removeClass('zoom-110');		
			$('.coin-wallet').addClass('zoom-' + Zoom);
		});
		
		});

		
	$('#coin-setup-menu.menu li').click(function() 
		{
		if ($(this).hasClass('disabled') || $(this).hasClass('active'))
			return;
		
		var section = $(this).attr('section');

		$('#coin-setup-menu.menu li.active').removeClass('active');

		$('.coin-setup .sub-section').each(function() {
			$(this).fadeOut(300);
		});
		
		$(this).addClass('active');		
		
		setTimeout(function()
			{
			$('.coin-setup .sub-section.' + section).fadeIn(300);		
			}, 300);
		
		});
		
	$('#main-menu.menu li').click(function() 
		{
		if ($(this).hasClass('disabled') || $(this).hasClass('active'))
			return;
		
		var section = $(this).attr('section');

		if (section != 'coin-wallets')
			{
			$('#main-menu.menu li.active').removeClass('active');
			}

		$(this).addClass('active');
		
		$('.wrapper .inner > .section').each(function() {
			$(this).fadeOut(300);
		});
		
		setTimeout(function() {
			$('.wrapper .inner > .section.' + section).fadeIn(300);
		}, 300);
		
		});
		
	$('.coin-type input[type=radio]').change(function() {
		$('#private-key-submit').click();
		
	});
	
	$('.generate-button').click(function() {
        
		if (Vanity == null || Vanity.length == 0)
			{
			var bytes = sr.getBytes(32);
			sr.seedTime();
			var hex = Crypto.util.bytesToHex(bytes);
				
			$('#private-key-input').val(hex);
			$('#private-key-submit').click();
			
			$('#private-key-input').val(hex);
			$('#private-key-submit').click();
			}
		else
			{
			var AddressStart = '-----';
			
			setTimeout(GenerateVanity, 100);
			setTimeout(GenerateVanity, 101);
			}
		
	});
	

	$('.coins-grid-wrapper .coin:not(.disabled)').click(function(e)
		{
		if ($('.coins-grid-wrapper').hasClass('selecting'))
			{
			$('.coins-grid-wrapper .coin.active').removeClass('active');
			$('.coins-grid-wrapper .coin-grid-row.active').removeClass('active');
			
			$(this).parent().addClass('active');
			$(this).addClass('active');
			
			$('.coin-grid-row:not(.active)').animate({ height: '0px'}, 300);
			$('.coins-grid-wrapper .coin:not(.active)').animate({height: '0px', width: '0px'}, 300, function() 
				{
				$('.coins-grid-wrapper').removeClass('selecting');
				});
			
			$("#private-key-submit").click();
			}
		else
			{
			$('.coins-grid-wrapper').addClass('selecting');
			
			$('.coin-grid-row').animate({ height: '140px'}, 300);
			
			$('.coins-grid-wrapper .coin:not(.active)').css('width', '0px').css('height', '0px').animate({width: '120px', height: '140px'}, 300);
			}
		});	
		
	// Show the active page, hide the others
	var section = $('.menu li.active').attr('section');
	var subsection = $('#coin-setup-menu li.active').attr('section');
	$('.wrapper .inner > .section').hide();
	$('.wrapper .inner > .section.' + section).show();
	$('.sub-section').hide();
	$('.sub-section.' + subsection).show();
	
	TestEnvironment();
	}