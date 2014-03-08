
var Default_Compress = undefined;
var WhenEntropyPoolFills_AutoGenerateKeys = true;
var WhenEntropyPoolFills_GoToPrint = true;
var HasPrivateKey = false;
var Vanity = '';
var VanityCaseSensitive = true;

var Security_IsOnline = true;
var Security_Cookies = true;

var Security_LiveCD = false
var Security_OfflinePermanent = false;
var Security_LocalPrinter = false;
var Security_OfflinePrinter = false;
var Security_PrinterHistory = false;
var Security_GenerateImport = false;
var Security_ManualVerify = false;

var AllBGs = undefined;

var DefaultBG = 'fractal-1';
var DefaultFrame = 'Frame-1';

var BackgroundCategories = [
	'abstract',
	'bricks',
	'camo',
	'cash',
	'coin',
	'fire',
	'flower',
	'food',
	'fractal',
	'glass',
	'holiday',
	'love',
	'metal',
	'misc',
	'music',
	'paper',
	'plants',
	'rocks-sand',
	'sky',
	'stars',
	'tech',
	'texture',
	'tiles',
	'water',
	'wood'];
	

var WalletFrames = 6;

var Frames = 
	{
	'Frame-1': {
		Name: 'Coin Wallet',
		Creator: 'CryptoPapers',
		Difficulty: 'Advanced',
		Description: 'This stylish paper wallet folds into the shape of a coin!',
		Instructions: '<ol>' + 
			'<li>Cut the wallet using the front side as a guide, discarding any excess background on the back side</li>' +
			'<li>Fold along the dotted lines so that the Public Address on the front and the large coin logo on the back display outwards, keeping the private keys secured in the middle.</li>' +
			'<li>Apply tape or holographic stickers along the top and bottom of the wallet.</li>' + 
			'</ol>'
	},
	'Frame-2': {
		Name: 'Coin Wallet Booklet',
		Creator: 'CryptoPapers',
		Difficulty: 'Advanced',
		Description: 'This wallet folds into a circular wallet booklet, with plenty of room for writing.',
		Instructions: '<ol>' + 
			'<li>Cut the wallet out using the front side as a guide, discarding any excess background on the back side</li>' +
			'<li>Fold along the dotted lines so that the Public Address and large coin logo on the front display outwards, keeping the private keys secured in the middle.</li>' +
			'<li>Using tape or holographic stickers, tape together the last three sections of the wallet, keeping the private key secure while allowing wallet to unfold to display written notes.</li>' + 
			'</ol>'
	},
	'Frame-3': {
		Name: 'Coin Slip',
		Creator: 'CryptoPapers',
		Difficulty: 'Intermediate',
		Description: 'This wallet is part slip, part coin!',
		Instructions: '<ol>' + 
			'<li>Cut the wallet out using the front side as a guide, discarding any excess background on the back side</li>' +
			'<li>Fold along the dotted lines so that the Public Address and large coin logo on the front display outwards, keeping the private keys secured in the middle.</li>' +
			'<li>Apply tape or holographic stickers along the top and bottom of the fold-out portion of the wallet.</li>' + 
			'</ol>'
	},
	'Frame-4': {
		Name: 'Standard Wallet V2',
		Creator: 'CryptoPapers',
		Difficulty: 'Intermediate',
		Description: 'Simple yet attractive twist on the classic wallet.',
		Instructions: '<ol>' + 
			'<li>Cut the wallet out using the front side as a guide, discarding any excess background on the back side</li>' +
			'<li>Fold along the vertical dotted lines so that the Public Address and small coin logo on the front display outwards, keeping the private keys secured in the middle.</li>' +
			'<li>Fold the remaining flaps downward, fully enclosing the private key.</li>' +
			'<li>Apply tape or holographic stickers along the top and bottom of the fold-out portion of the wallet.</li>' + 
			'</ol>'
	},
	'Frame-5': {
		Name: 'BitcoinPaperWallet.com Variation',
		Creator: 'Canton Becker',
		Difficulty: 'Beginner',
		Description: 'Donate BTC: 1Pjg628vjMLBvADrPHsthtzKiryM2y46DG',
		Instructions: '<ol>' + 
			'<li>Cut the wallet out using the front side as a guide, discarding any excess background on the back side</li>' +
			'<li>Fold along the dotted lines so that the Public Address and small coin logo on the front display outwards, keeping the private keys secured in the middle.</li>' +
			'<li>Apply tape or holographic stickers along the top and bottom of the fold-out portion of the wallet.</li>' + 
			'</ol>'
	},
	'Frame-6': {
		Name: 'Standard Wallet',
		Creator: 'Whoever invented the rectangle',
		Difficulty: 'Beginner',
		Description: 'This wallet frame is great if you hate cutting things out!',
		Instructions: '<ol>' + 
			'<li>Cut the wallet out using the front side as a guide, discarding any excess background on the back side</li>' +
			'<li>Fold along the dotted lines so that the Public Address and small coin logo on the front display outwards, keeping the private keys secured in the middle.</li>' +
			'<li>Apply tape or holographic stickers along the top and bottom of the fold-out portion of the wallet.</li>' + 
			'</ol>'
	}
	};
	
var Backgrounds = 
	{	
	'abstract': 53,
	'bricks': 12,
	'camo': 2,
	'cash': 2,
	'coin': 6,
	'fire': 4,
	'flower': 11,
	'food': 7,
	'fractal': 5,
	'glass': 2,
	'holiday': 6,
	'love': 4,
	'metal': 10,
	'misc': 17,
	'music': 1,
	'paper': 2,
	'plants': 14,
	'rocks-sand': 6,
	'sky': 7,
	'stars': 3,
	'tech': 3,
	'texture': 21,
	'tiles': 7,
	'water': 16,
	'wood': 20
	};

function BGString(Category, Number)
	{	
	var Out = "";
	for (var i = 0; i < Number; i++)
	{ 
	Out += Category + "-" + (i+1) + " ";
	}
	
	return Out;	
	}
function TestEnvironment()
	{
	Security_IsOnline = navigator.onLine;
	Security_Cookies = navigator.cookieEnabled;
	
    if (typeof navigator.cookieEnabled == "undefined" && !cookieEnabled)
		{ 
		try
			{
			document.cookie= "testcookie";
			Security_Cookies = (document.cookie.indexOf("testcookie") != -1) ? true : false;
			}
		catch(ex)
			{
			Security_Cookies = false;
			}
		}
	
	if (Security_IsOnline)
		{
		$('.security-offline-permanent input, .security-offline-permanent a').attr('disabled', '');
		$('.security-offline-printer input, .security-offline-printer a').attr('disabled', '');
		
		$('#security-local-printer-no').click();
		$('.security-local-printer input, .security-local-printer a').attr('disabled', '');
		
		$('#internet-status').removeClass('disabled').addClass('enabled').html('Online');
		}
	else
		{
		$('.security-offline-permanent input, .security-offline-permanent a').removeAttr('disabled');
		$('.security-offline-printer input, .security-offline-printer a').removeAttr('disabled');
		
		$('.security-local-printer input, .security-local-printer a').removeAttr('disabled');
		$('#security-local-printer-yes').click();
		
		
		$('#internet-status').removeClass('enabled').addClass('disabled').html('Offline');
		}
		
	if (Security_Cookies)
		$('#cookie-status').removeClass('disabled').addClass('enabled').html('Enabled');
	else
		$('#cookie-status').removeClass('enabled').addClass('disabled').html('Disabled');
		
	UpdateSecurityTrust();
	}
	
function UpdateSecurityTrust()
	{
	$('.risk').removeClass('safe').addClass('at-risk');
	$('.trust-item').removeClass('trust-level-fully').removeClass('trust-level-some').removeClass('trust-level-zero');
	
	var ZeroTrust = true;
	
	
	// -- Infections --
	if (!Security_IsOnline)
		{
		$('#risk-infection-online').addClass('safe');
		
		if (Security_OfflinePermanent || Security_LiveCD)
			{
			$('#risk-infection-offline').addClass('safe');
			
			$('.trust-bugs').addClass('trust-level-zero');
			}	
		else
			{
			$('.trust-bugs').addClass('trust-level-some');
			ZeroTrust = false;
			}
		}
	else
		{
		$('.trust-bugs').addClass('trust-level-fully');
		ZeroTrust = false;
		}
		
	// -- Network --
	if (Security_LocalPrinter)
		{
		$('#risk-network-printer').addClass('safe');
		
		$('.trust-your-network').addClass('trust-level-zero');
		}
	else
		{
		$('.trust-your-network').addClass('trust-level-fully');
		ZeroTrust = false;
		}
		
		
	// -- Printer --
	if (Security_LocalPrinter || Security_PrinterHistory)
		{
		$('#risk-printer-online-storage').addClass('safe');
		
		if (Security_OfflinePrinter || Security_PrinterHistory)
			{
			$('#risk-printer-offline-storage').addClass('safe');
			
			$('.trust-your-printer').addClass('trust-level-zero');
			}
		else
			{
			$('.trust-your-printer').addClass('trust-level-some');
			ZeroTrust = false;
			}
		}
	else
		{
		$('.trust-your-printer').addClass('trust-level-fully');
		ZeroTrust = false;
		}
		
	// -- Browser --
	if (!Security_IsOnline)
		{
		$('#risk-browser-addons-online').addClass('safe');
		
		if (Security_OfflinePermanent)
			{
			$('#risk-browser-addons-offline').addClass('safe');
			
			$('.trust-your-browser').addClass('trust-level-zero');
			}
		else
			{
			$('.trust-your-browser').addClass('trust-level-some');
			ZeroTrust = false;
			}
		}
	else
		{
		$('.trust-your-browser').addClass('trust-level-fully');
		ZeroTrust = false;
		}
		
	// -- OS --
	if (!Security_IsOnline)
		{
		$('#risk-os-online').addClass('safe');
		
		if (Security_OfflinePermanent)
			{
			$('#risk-os-offline').addClass('safe');
			
			$('.trust-your-os').addClass('trust-level-zero');
			}
		else
			{
			$('.trust-your-os').addClass('trust-level-some');
			ZeroTrust = false;
			}
		}
	else
		{
		$('.trust-your-os').addClass('trust-level-fully');
		ZeroTrust = false;
		}
		
	// -- This Tool --
	if (!Security_IsOnline)
		{
		$('#risk-this-tool-online').addClass('safe');
		
		if (!Security_Cookies || Security_OfflinePermanent)
			{
			$('#risk-this-tool-offline-cookies').addClass('safe');
			}
		}
	if (Security_GenerateImport)
		{
		$('#risk-this-tool-badrng').addClass('safe');
		}
	if (Security_ManualVerify)
		{
		$('#risk-this-tool-badcodes').addClass('safe');
		}
		
	if (!Security_IsOnline && (!Security_Cookies || Security_OfflinePermanent) && Security_GenerateImport && Security_ManualVerify)
		{
		$('.trust-this-tool').addClass('trust-level-zero');
		}
	else if (!Security_IsOnline || Security_GenerateImport || Security_ManualVerify)
		{
		$('.trust-this-tool').addClass('trust-level-some');
		ZeroTrust = false;
		}
	else
		{
		$('.trust-this-tool').addClass('trust-level-fully');
		ZeroTrust = false;
		}
		
	if (ZeroTrust && $('.zero-trust-seal').hasClass('hidden'))
		{
		$('.coin-wallet').addClass('zero-trust');
		$('.zero-trust-seal').removeClass('hidden');
		$('.zero-trust-seal').fadeIn();
		}
	else if (!ZeroTrust && !$('.zero-trust-seal').hasClass('hidden'))
		{
		$('.coin-wallet').removeClass('zero-trust');
		$('.zero-trust-seal').fadeOut();
		$('.zero-trust-seal').addClass('hidden');
		}
	
	}
	
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
	$('#private-key-input').change();
	}

function GenerateAddress(display)
	{
	if (display)
		$('#coin-address-verify').val('');
	
	var CoinType = $('div.coin.active').attr('data');
	
	//if (display)
	//	Log("Coin Type: " + CoinType);
	
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
		
		//Log("Private Key Hex: " + PrivKeyHex);
		//Log("Private Key WIF: " + PrivKeyWIF);
		//Log("Compressed: " + Compressed);
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
	
		//Log("Public Address: " + Address);
		
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
			
		$('.coin-wallets').removeClass(AllCoinTypes);
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
	
function InitPage()
	{
	AddFrames();
	AddBackgrounds();
	
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

			if (WhenEntropyPoolFills_AutoGenerateKeys)
				{
				$('#private-key-generate').click();
				
				if (WhenEntropyPoolFills_GoToPrint)
					{
					$('#coin-setup-menu #print').click();
					}
				}
			}
	});
	
	$('#js-test-refresh').click(function() 
		{
		TestEnvironment();
		});
	$('input[name=security-live-cd]').change(function() 
		{
		Security_LiveCD = $(this).val() == "Yes";
		UpdateSecurityTrust();
		});
	$('input[name=security-offline-permanent]').change(function() 
		{
		Security_OfflinePermanent = $(this).val() == "Yes";
		UpdateSecurityTrust();
		});
	$('input[name=security-local-printer]').change(function() 
		{
		Security_LocalPrinter = $(this).val() == "Yes";
		UpdateSecurityTrust();
		});
	$('input[name=security-offline-printer]').change(function() 
		{
		Security_OfflinePrinter = $(this).val() == "Yes";
		UpdateSecurityTrust();
		});
	$('input[name=security-printer-history]').change(function() 
		{
		Security_PrinterHistory = $(this).val() == "Yes";
		UpdateSecurityTrust();
		});
	$('input[name=security-generate-import]').change(function() 
		{
		Security_GenerateImport = $(this).val() == "Yes";
		UpdateSecurityTrust();
		});
	$('input[name=security-manual-verify]').change(function() 
		{
		Security_ManualVerify = $(this).val() == "Yes";
		UpdateSecurityTrust();
		});	
		
	$(".donate-reminder").click(function() 
		{
		$('.menu-key-donate').click();
		});
		
	$('#private-key-input').change(function() 
		{
		var Address = GenerateAddress(true);	

		// $('ul#coin-setup-menu li#calibrate.step').removeClass('disabled');
		$('ul#coin-setup-menu li#print.step').removeClass('disabled');		
		});
		
	$('input[name=print-face]').change(function() 
		{
		$('.coin-wallets').fadeOut(300, function() {
			$('.coin-wallets').toggleClass('back');
			$('.coin-wallets').fadeIn(300);
			});
		});
		
	$('#print-button').click(function() 
		{
		$('.coin-wallet').attr('style', '');
		window.print();
		});
		
	$('input[name=compression]').change(function() 
		{
		Default_Compress = !Default_Compress;

		$('#private-key-input').change();
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

		if($(this).hasClass('one'))$('#coin-setup-menu a').animate({'margin-left' : '0px'}, 400, function(){});
		if($(this).hasClass('two'))$('#coin-setup-menu a').animate({'margin-left' : '220px'}, 400, function(){});
		if($(this).hasClass('three'))$('#coin-setup-menu a').animate({'margin-left' : '459px'}, 400, function(){});
		
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
		
	$('.frame-grid-row-header').click(function() {
		$(this).parent().find('.frame.selector').click();
	});
	
	$('.frame.selector').click(function() {
		if (!$('.frame-type').hasClass('selecting'))
			return;
			
		var val = $(this).attr('data');
		
		if (val)
			{
			$('.coin-wallets').fadeOut(300, function()
				{			
				SetFrame(val);
				
				$('.coin-wallets').fadeIn(300);
				
				SetLettering();
				});
			}
	});
		
	$('.generate-button').click(function() {
        
		if (Vanity == null || Vanity.length == 0)
			{
			var bytes = sr.getBytes(32);
			sr.seedTime();
			var hex = Crypto.util.bytesToHex(bytes);
				
			$('#private-key-input').val(hex);
			$('#private-key-input').change();
			
			$('#security-generate-import-no').click();
			
			}
		else
			{
			var AddressStart = '-----';
			
			setTimeout(GenerateVanity, 100);
			}
		
		
		SetLettering();
	});
	
	$('.coin.selector').mouseup(function() {	
	});
	
	$('.design.selector').click(function() {
		$('.hue-shift-reset').click();
		
		SetLettering();
		});
		
	$('.design.selector:not(.active)').click(function() {
		
		if ($(this).hasClass('active'))
			return;
			
		SetDesign($(this).attr('data'));
		
		
	});
	
	$('#custom-design').change(function(evt) {
		Log(evt);
		Log(evt.target);
		Log(evt.target.files);
		Log(evt.target.files[0]);
		
		var fr = new FileReader();
		var	filecontent = fr.readAsArrayBuffer(evt.target.files[0]);
		var binary = window.btoa(filecontent);
		
		Log(filecontent);
		Log(binary);
		
	//	$('.coin-wallet').css('background-image', 'url("' + '' + '")');
	});
	

	$('.selector-grid-wrapper .selector:not(.disabled)').click(function(e)
		{
		var ParentRow = $(this).parents('.selector-grid-row');
		var ParentGridWrapper = $(this).parents('.selector-grid-wrapper');
		var ParentGrid = $(this).parents('.selector-grid');
		var Fade = ParentGrid.attr('fade') == 'true';
		var Scroll = ParentGrid.attr('scroll') == 'true';
		
		if (ParentGridWrapper.hasClass('selecting'))
			{
			ParentGridWrapper.find('.selector.active').removeClass('active');
			ParentGridWrapper.find('.selector-grid-row.active').removeClass('active');
			
			$(this).parent().addClass('active');
			$(this).addClass('active');
			
			if (Fade)
				{
				ParentGrid.find('.selector-grid-row:not(.active)').animate({ height: '0px'}, 300);
				ParentGridWrapper.find('.selector:not(.active)').fadeOut(300, function() {
					ParentGridWrapper.removeClass('selecting');
					ParentGrid.removeClass('selecting');
					
					});
				}
			else
				{
				ParentGrid.find('.selector-grid-row:not(.active)').animate({ height: '0px'}, 300);
				ParentGridWrapper.find('.selector:not(.active)').animate({height: '0px', width: '0px'}, 300, function() 
					{
					ParentGridWrapper.removeClass('selecting');
					ParentGrid.removeClass('selecting');
					
					});
				}
			$('#private-key-input').change();
			}
		else
			{
			ParentGrid.addClass('selecting');
			ParentGridWrapper.addClass('selecting');
			
			if (Fade)
				{
				ParentGrid.find('.selector-grid-row:not(.active)').animate({ height: ParentGrid.attr('rowheight')}, 300);
				ParentGridWrapper.find('.selector:not(.active)').fadeIn(300, function() {
					if (Scroll)
						{
						var Obj = $(this);
						
					
						var Position = Obj.offset().top;
						
						$('html, body').animate({
							scrollTop: Position
						}, 300);
						Scroll = false;
						}
				});
				}
			else
				{
			
			//	ParentRow.animate({ height: }, 300);
				
				ParentGrid.find('.selector-grid-row:not(.active)').animate({ height: ParentGrid.attr('rowheight')}, 300);
				ParentGridWrapper.find('.selector:not(.active)').css('width', '0px').css('height', '0px').animate({width: '100px', height: '100px'}, 300, function() {
				
					if (Scroll)
						{
						var Obj = $(this);
						
						var Position = Obj.offset().top;
						
						$('html, body').animate({
							scrollTop: Position
						}, 300);
						Scroll = false;
						}
				});
				
				}
			}
		
		});	
	/*
	$('.hue-shift-up').click(function () {
		HueShift += HueShiftChange;
		
		if (HueShift > 180)
			HueShift -= 360;
			
		ApplyHueShift();		
	});
	$('.hue-shift-down').click(function () {
		HueShift -= HueShiftChange;
		
		if (HueShift < -180)
			HueShift += 360;
		
		ApplyHueShift();
	});	
	*/
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
	
	// Show the active page, hide the others
	var section = $('.menu li.active').attr('section');
	var subsection = $('#coin-setup-menu li.active').attr('section');
	$('.wrapper .inner > .section').hide();
	$('.wrapper .inner > .section.' + section).show();
	$('.sub-section').hide();
	$('.sub-section.' + subsection).show();
	
	TestEnvironment();	
	
	if (!Security_IsOnline)
		{
		$('#lights-off').click();
		}
	else
		{
		$('#lights-on').click();
		}
	
	SetFrame(DefaultFrame);
	SetDesign(DefaultBG);
		
	setTimeout(function()
		{
		AllBGs = '';
		
		for (var i = 0; i < BackgroundCategories.length; i++)
			{
			AllBGs += BGString(BackgroundCategories[i], Backgrounds[BackgroundCategories[i]]); 
			}
		
		AllBGs = AllBGs.substr(0, AllBGs.length-1);
		}, 100);
	}
	
var HueShift = 0;
var HueShiftChange = 5;

function SetDesign(Design)
	{
	setTimeout(function() {		
		$('.coin-wallet').fadeOut(300, function() {
			$('.coin-wallets').removeClass(AllBGs);
			
			$('.coin-wallets').addClass(Design);
			
			$('.coin-wallet .coin-wallet-background').attr('src', 'images/wallet-backgrounds/' + Design + '.jpg');
			
			SetLettering();
	
			$('.coin-wallet').fadeIn(300);
			});
		}, 500);
		
	}
	
function SetFrame(Frame)
	{
	$('.coin-wallets').removeClass(BGString('frame', Object.keys(Frames).length));

	$('.coin-wallets').addClass(Frame.toLowerCase());
	
	$('.frame-instructions .frame-name').html(Frames[Frame].Name);
	$('.frame-instructions .frame-creator').html(Frames[Frame].Creator);
	$('.frame-instructions .frame-description').html(Frames[Frame].Description);
	$('.frame-instructions .frame-difficulty').html(Frames[Frame].Difficulty);
	$('.frame-instructions .frame-detail-instructions').html(Frames[Frame].Instructions);
	}
	
function SetLettering()
	{
	$('.frame-1 .coin-wallet-address').lettering();
	$('.frame-1 .coin-wallet-private-key').lettering();
	$('.frame-2 .coin-wallet-address').lettering();
	$('.frame-2 .coin-wallet-private-key').lettering();
	}

function ApplyHueShift()
	{	
	$('.hue-shift-amount').html((HueShift > 0 ? '+' : '') + HueShift + '&deg;');
	$('.coin-wallet-background').css('filter', 'hue-rotate(' + HueShift + 'deg)');
	$('.coin-wallet-background').css('-webkit-filter', 'hue-rotate(' + HueShift + 'deg)');
	}

function AddFrames()
	{
	var cols = 10;
	var frames = '';
	
	for (var i = 0; i < Object.keys(Frames).length; i++)
		{
		var Frame = "Frame-" + (i+1);
		var FrameName = Frames[Object.keys(Frames)[i]].Name;
				
		frames += '<div class="frame-grid-row selector-grid-row">';
		
			
		frames += '<div class="frame-grid-row-header ' + Frame + '">' + FrameName + '</div>';
			
		
		var Active = (Frame == DefaultFrame) ? ' active' : '';
		
		frames += '<div class="frame selector ' + Frame + '-frame' + Active+ '" data=' + Frame + '>';
		frames += '<img class="coin-wallet-frame" src="images/wallet-frames/' + Frame + '.png" />';
		frames += '</div>';
		
		if (i != 0 && i % cols == 0 && i < CategoryCount)
			{
			frames += '</div>';
			frames += '<div class="frame-grid-row selector-grid-row">';
			}
		
		
		frames += '</div>';
		}
	
	$('.frame-grid-wrapper').html(frames);
	}
function AddBackgrounds()
	{
	var cols = 5;
	var designs = '';
	
	for (var i = 0; i < BackgroundCategories.length; i++)
		{
		var Category = BackgroundCategories[i];
		
		designs += '<div class="design-grid-row selector-grid-row">';
		
			
		designs += '<div class="design-grid-row-header ' + Category + '">' + Category + '</div>';
			
		var CategoryCount = Backgrounds[BackgroundCategories[i]];
		
		for (var j = 0; j < CategoryCount; j++)
			{
			var BGString = Category + '-' + (j+1);
			
			var Active = (BGString == DefaultBG) ? ' active' : '';
			
			designs += '<div class="design selector ' + BGString + '-design' + Active+ '" data=' + BGString + '>';
			designs += '<img class="coin-wallet-background" src="images/wallet-backgrounds/' + BGString + '.jpg" />';
			designs += '</div>';
			
			if (j != 0 && j % 10 == 0 && j < CategoryCount)
				{
				designs += '</div>';
				designs += '<div class="design-grid-row selector-grid-row">';
				}
			}
		
		
		designs += '</div>';
		}
	
	$('.designs-grid-wrapper').html(designs);
	}