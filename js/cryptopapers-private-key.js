 /*

All crucial code and private key handling is done in this file along with prng4.js, which handles the RNG pool.
Changes to this file should be rare and should be heavily scrutinized. 

The majority of changes to this file should be the addition of new coin types.

*/

var Default_Compress = undefined;
var HasPrivateKey = false;
var DefaultCoin = 'btc';
var CurrentCoinType = DefaultCoin;

var VanityEnabled = undefined;

var CoinInfo = {
	'btc': {
		name: 'btc',
		fullName: 'Bitcoin',
		addressVersion: '00',
		defaultCompress: true,
		donateAddress: '18445kiESU6kAVHLRjxvHcAtPJ1gvQZX7B',
		enabled: true,
		manual: false
		},
	'ltc': {
		name: 'ltc',
		fullName: 'Litecoin',
		addressVersion: '30',
		defaultCompress: true,
		donateAddress: 'LaPsL7RwrZqzXduiaVBrtLBibyroqujmvr',
		enabled: true,
		manual: false
		},
	'ppc': {
		name: 'ppc',
		fullName: 'Peercoin',
		addressVersion: '37',
		defaultCompress: false,
		donateAddress: 'P8r6T77etknGTKKNdB7amRWnEBno3mAxud',
		enabled: true,
		manual: false
		},
	'doge': {
		name: 'doge',
		fullName: 'Dogecoin',
		addressVersion: '1E',
		defaultCompress: false,
		donateAddress: 'DNwWMvq2V9DJbwDK1g8bouqBa23SV34QQ1',
		enabled: true,
		manual: false
		},
	'nmc': {
		name: 'nmc',
		fullName: 'Namecoin',
		addressVersion: '34',
		defaultCompress: false,
		donateAddress: 'N5XHb3UH93WjZuq8XLmRpiM25J4d3djQYG',
		enabled: true,
		manual: false
		},
	'nxt': {
		name: 'nxt',
		fullName: 'NXT',
		addressVersion: '',
		defaultCompress: false,
		donateAddress: '',
		enabled: true,
		manual: true
		}, 
	'nem': {
		name: 'nem',
		fullName: 'NEM',
		addressVersion: '',
		defaultCompress: false,
		donateAddress: '',
		enabled: false,
		manual: false
		}, 
	'msc': {
		name: 'msc',
		fullName: 'Mastercoin',
		addressVersion: '00',
		defaultCompress: false,
		donateAddress: '18445kiESU6kAVHLRjxvHcAtPJ1gvQZX7B',
		enabled: true,
		manual: false
		},
	'xpm': {
		name: 'xpm',
		fullName: 'Primecoin',
		addressVersion: '17',
		defaultCompress: false,
		donateAddress: 'Aw44AFgoGm4KC5FgVyqbgrMZXKEdZ6iwhJ',
		enabled: true,
		manual: false
		},
	'aur': {
		name: 'aur',
		fullName: 'Auroracoin',
		addressVersion: '17',
		defaultCompress: false,
		donateAddress: 'AScmXdw1AEPoutgmMp9vHGMxev8L2bwEMX',
		enabled: true,
		manual: false
		},
	'vtc': {
		name: 'vtc',
		fullName: 'Vertcoin',
		addressVersion: '47',
		defaultCompress: false,
		donateAddress: 'VcQEG8NKd5C3HjBdYcnepsEA7H5yFtQXbv',
		enabled: true,
		manual: false
		},
	'mint': {
		name: 'mint',
		fullName: 'Mintcoin',
		addressVersion: '33',
		defaultCompress: false,
		donateAddress: 'MbFhQX7b6DbuzFmiSYv1MxJpgs9jjH2Hah',
		enabled: true,
		manual: false
		},
	'xcp': {
		name: 'xcp',
		fullName: 'Counterparty',
		addressVersion: '00',
		defaultCompress: true,
		donateAddress: '18445kiESU6kAVHLRjxvHcAtPJ1gvQZX7B',
		enabled: true,
		manual: false
		},
	'ftc': {
		name: 'ftc',
		fullName: 'Feathercoin',
		addressVersion: '0e',
		defaultCompress: false,
		donateAddress: '6nCuFhvyWCYibjVT2JjfTftFymzwXvghs6',
		enabled: true,
		manual: false
		},
	'pts': {
		name: 'pts',
		fullName: 'ProtoShares',
		addressVersion: '38',
		defaultCompress: false,
		donateAddress: 'PgzC3bGycHfMG5uPS8rMLovfeogSVMP7bC',
		enabled: true,
		manual: false
		},
	'qrk': {
		name: 'qrk',
		fullName: 'Quark',
		addressVersion: '3a',
		defaultCompress: false,
		donateAddress: 'QVfQ1osZ2eb6txBZUyWzK4UEupCKpDZQB4',
		enabled: true,
		manual: false
		},
	'cgb': {
		name: 'cgb',
		fullName: 'Cryptogenic',
		addressVersion: '0b',
		defaultCompress: false,
		donateAddress: '5gfHt9pbZFhM4C7bRUQV42fUugerpXtyvf',
		enabled: true,
		manual: false
		},
	'dtc': {
		name: 'dtc',
		fullName: 'Datacoin',
		addressVersion: '1e',
		defaultCompress: false,
		donateAddress: 'D6Pk6fWVBEVRB4WH93XeQfEubnGnAPSTzZ',
		enabled: true,
		manual: false
		},
	'dvc': {
		name: 'dvc',
		fullName: 'Devcoin',
		addressVersion: '00',
		defaultCompress: false,
		donateAddress: '18445kiESU6kAVHLRjxvHcAtPJ1gvQZX7B',
		enabled: true,
		manual: false
		},
	'dgc': {
		name: 'dgc',
		fullName: 'Digitalcoin',
		addressVersion: '1e',
		defaultCompress: false,
		donateAddress: 'DAFAosyZjS9KjXJtBN23TnEuSLExCWWjyg',
		enabled: true
		},
	'ifc': {
		name: 'ifc',
		fullName: 'Infinitecoin',
		addressVersion: '66',
		defaultCompress: false,
		donateAddress: 'iGMBJRSY4yHaQ8k2aHBQd3qDoYnFn7hjDg',
		enabled: true,
		manual: false
		},
	'ixc': {
		name: 'ixc',
		fullName: 'Ixcoin',
		addressVersion: '8a',
		defaultCompress: false,
		donateAddress: 'xvygH7smhtT8N5h8apXsAf3YUTjbDd8e5w',
		enabled: true
		},
	'mmc': {
		name: 'mmc',
		fullName: 'Memorycoin',
		addressVersion: '32',
		defaultCompress: false,
		donateAddress: 'ML4rdNofSU4NDuLG5SetAmpowMcUh18NJJ',
		enabled: true,
		manual: false
		},
	'nvc': {
		name: 'nvc',
		fullName: 'Novacoin',
		addressVersion: '08',
		defaultCompress: false,
		donateAddress: '4JLDcmKUqniXFETijMfwPa299ysprqgri7',
		enabled: true
		},
	'trc': {
		name: 'trc',
		fullName: 'Terracoin',
		addressVersion: '00',
		defaultCompress: false,
		donateAddress: '18445kiESU6kAVHLRjxvHcAtPJ1gvQZX7B',
		enabled: true,
		manual: false
		},
	'wdc': {
		name: 'wdc',
		fullName: 'Worldcoin',
		addressVersion: '49',
		defaultCompress: false,
		donateAddress: 'WmZcammKRsLEAwYyeofZGUQSTkinbmTavx',
		enabled: true,
		manual: false
		},
	'zet': {
		name: 'zet',
		fullName: 'Zetacoin',
		addressVersion: '50',
		defaultCompress: false,
		donateAddress: 'ZPr2d8DDmRaVFyXRrbfcQjapsat3QpeMry',
		enabled: true,
		manual: false
		},
	'drk': {
		name: 'drk',
		fullName: 'Darkcoin',
		addressVersion: '50',
		defaultCompress: false,
		donateAddress: '',
		enabled: true,
		manual: true
		},
	};
	
var AllCoinTypes = '';
var AllCoinTypesFull = '';

var CoinTypes = new Array();

for (var i =0 ; i < Object.keys(CoinInfo).length; i++)
	{
	CoinTypes[i] = CoinInfo[Object.keys(CoinInfo)[i]].name;
	AllCoinTypes += CoinInfo[Object.keys(CoinInfo)[i]].name;
	AllCoinTypesFull += CoinInfo[Object.keys(CoinInfo)[i]].fullName;
	
	if (i < Object.keys(CoinInfo).length - 1)
		{
		AllCoinTypes += ' ';
		AllCoinTypesFull += ', ';
		}
	}
	
var CurrentKey = undefined;
var KeyWallet = [];
	
function RemoveKey(Key)
	{
	var index = KeyWallet.indexOf(Key);
	
	if (index >= 0)
		KeyWallet.splice(index, 1);
		
	}
function WalletContains(CoinType, Key)
	{
	for (var i = 0; i < KeyWallet.length; i++)
		{
		if (KeyWallet[i].key == Key && KeyWallet[i].coinType == CoinType)
			{
			return true;
			}
		}
		
	return false;
	}
	
function DisplayWallets()
	{
	var Keys = '';
	for (var i = 0; i < KeyWallet.length; i++)
		{
		var Key = KeyWallet[i];
		
		var IsCurrentKey = (CurrentKey == KeyWallet[i]) ? ' current-key' : '';
		
		Keys += '<div class="key' + IsCurrentKey+ '" data="' + i + '">';		
		Keys += '<a>';
		Keys += '<div class="wallet-coin-type ' + Key.coinType + '-coin coin"></div>';
		Keys += '<div class="address">' + Key.address + '</div>';
		Keys += '<div class="print-status"></div>';
		Keys += '</a>';
		Keys += '</div>';
		}
		
	$('.key-wallet .keys').html(Keys);
	$('.key-wallet .key-count').html(KeyWallet.length);
	
	if (KeyWallet.length == 0)
		$('.key-wallet').addClass('empty');
	else
		$('.key-wallet').removeClass('empty');	
		
	$('.key-wallet .key.current-key').mouseenter(function() 
	{
			$(this).parent().find('.key:not(.current-key)').show().animate({height: 36, opacity: 1});
	});	
	
	$('.key-wallet .key').bind('click', function() 
		{
		if ($(this).hasClass('current-key'))
			{
			if (KeyWallet.length > 1)
				return true;
			else
				return false;
			}
			
		var index = parseInt($(this).attr('data'));
		
		CurrentKey = KeyWallet[index];
		
		var cointype = $('.coin-type .coin.selector[data=' + CurrentKey.coinType + ']');
				
		if (!cointype.hasClass('active'))
			{			
			var Width = $('.coin-type').attr('colwidth');
			
			$('.coin-type .coin-grid-row.active').removeClass('active');
			$('.coin-type .coin.active').removeClass('active');
			$('.coin-type .coin-grid-row:not(.active)').css('height', '0');
			cointype.css('width', Width).css('height', 'inherit').addClass('active');
			cointype.parent().css('height', 'inherit').addClass('active');
			
			ChangeCoinType(CurrentKey.coinType, false);
			}
		
		if (CoinInfo[CurrentKey.coinType].manual)
			{
			$('#private-key-manul-address').val(CurrentKey.address);
			$('#private-key-input').val(CurrentKey.key);
			$('#private-key-input').change();
			}
		else
			{
			$('#private-key-input').val(CurrentKey.key);
			$('#private-key-input').change();
			}
		
		$('.generate-button').snazzyHide();
		
		$('.key-wallet .key.current-key').removeClass('current-key');
		$(this).addClass('current-key');
		
		$(this).parent().find('.key:not(.current-key)').animate({height: 0, opacity: 0}, 300, function() { 
			DisplayWallets();
			$('.key-wallet').removeClass('expand-y')
			});
			
		return false;
		});
	}
	
 function InitPrivateKeyPage()
	{
	
	$('.key-wallet .keys').mouseleave(function() 
	{
			$('.key-wallet').find('.key:not(.current-key)').show().animate({height: 0, opacity: 0});
	});
	
	$('.key-wallet').click(function() 
		{
		if ($(this).hasClass('expand-x'))
			{
			if (CurrentKey == undefined)
				{
				var a = $(this);
				
				$(this).find('.key:not(.current-key)').snazzyHide(300, function() { 
					a.animate({width: 86}, 300, function() {
						a.removeClass('expand-x').removeClass('expand-y');
						});
					});
				}
			else
				{
				ClearCurrentKey();
				$(this).removeClass('expand-x').removeClass('expand-y');
				
				/*
				if ($(this).hasClass('expand-y'))
					{
					$(this).find('.key:not(.current-key)').snazzyHide(300, function() { 
						});
						
					//$(this).animate({height: 63}, 300, function() {
						$(this).removeClass('expand-y');
					//	});
					
					ClearCurrentKey();
					
					$(this).animate({width: 86}, 300, function() {
						$(this).removeClass('expand-x').removeClass('expand-y');
						});
					
					}
				else
					{
					var a = $(this);
					
					
					$(this).find('.key:not(.current-key)').snazzyShow(300, function() { 
					
						
						});
						a.addClass('expand-y');
					//a.animate({height: a.getTrueHeight()}, 300);
					/*
					var OldHeight = $(this).css('height');
					
					$(this).addClass('expand-y');
					
					var NewHeight = $(this).css('height');
					
					$(this).css('height', OldHeight).animate({height: NewHeight}, 300, function() { 
						
						});
					}
						*/
				}
			}
		else if (KeyWallet.length != 0)
			{		
			
			$(this).find('.key:not(.current-key)').snazzyShow();
					
			$(this).animate({width: 390}, 300, function() { 
			
				$(this).addClass('expand-x').addClass('expand-y');
			
			//	var NewHeight = $(this).css('height');
				
			//	$(this).animate({height: NewHeight}, 300);
				});
			}
		});
		
	
	 
	$('.generate-button').click(function()
		{
		if (VanityEnabled != undefined && VanityEnabled())
			{
			var AddressStart = '-----';
			
			GenerateVanity();
			}
		else
			{
			//ClearCurrentKey();
			
			var bytes = sr.getBytes(32);
			sr.seedTime();
			var hex = Crypto.util.bytesToHex(bytes);
				
			$('#private-key-input').val(hex);
			$('#private-key-input').change();
			
			$(this).snazzyHide();
			
			$('#security-generate-import-no').click();
			}
		});
		
	
	$('#private-key-remove').click(function() 
		{
		$(this).fadeOut(300, function() {
			$('#private-key-remove-yes').fadeIn(300);
			$('#private-key-remove-no').fadeIn(300);
			
			});
		});
		
	$('#private-key-remove-no').click(function() {
		$('#private-key-remove-yes, #private-key-remove-no').fadeOut(300, function() {
			$('#private-key-remove').fadeIn(300);
			});
		});		
		
	$('#private-key-remove-yes').click(function() {
	
		$('#private-key-remove-yes, #private-key-remove-no').fadeOut(300, function() {
			$('#private-key-remove').fadeIn(300);
			});
		
		var WalletCount = 0;
		
		if (WalletCount == 0)
			{
			window.onbeforeunload = undefined;
			$('#coin-setup-menu #print').addClass('disabled');
			}
		
		RemoveKey(CurrentKey);
		
		ClearCurrentKey();
		});
		
	$('#private-key-add').click(function() 
		{
		var Address = $('#public-address').val();
		var Key = $('#private-key-wif').val();
		var EncryptedKey = $('#private-key-encrypted').val();
		
		var StartLeft =  $('#public-address').offset().left;
		var StartTop = $('#public-address').offset().top;
		var StartSize = $('#public-address').css('font-size');
		
		var DisplayKey = $('#private-key-input').val();		
		
		var StartLeft2 =  $('#private-key-input').offset().left + 100;
		var StartTop2 = $('#private-key-input').offset().top + 15;
		var StartSize2 = $('#private-key-input').css('font-size');
		
		var EndLeft = $('.key-wallet .wallet-image').offset().left - 20;
		var EndTop = $('.key-wallet .wallet-image').offset().top + 10;		
		var EndSize = '4px';
		
		$('body').parent().prepend('<div class="address-effect address">' + Address + '</div>');
		$('body').parent().prepend('<div class="address-effect key">' + DisplayKey + '</div>');
		
		$('#private-key-input').val('');
		$('#public-address').val('');
		
		$('.address-effect.key').css('left', StartLeft2).css('top', StartTop2).css('font-size', StartSize2)
			.animate({top: EndTop, left: EndLeft, 'font-size': EndSize}, 600, function () 
			{
			$(this).remove();			
			});
		$('.address-effect.address').css('left', StartLeft).css('top', StartTop).css('font-size', StartSize)
			.animate({top: EndTop, left: EndLeft, 'font-size': EndSize}, 600, function ()
			{
			var Wallet = { 
				coinType: CurrentCoinType,
				address: Address,
				key: Key,
				encryptedKey: EncryptedKey
				};
				
			if (!WalletContains(CurrentCoinType, Key))
				{
				KeyWallet.push(Wallet);
				}
			
			DisplayWallets();
			
			$(this).remove();
			
			ClearKeyText();		
			
			$('#private-key-input').val('');
			$('#private-key-address-manual').val('');
			$('#private-key-add').attr('disabled', '');
			$('#private-key-remove').attr('disabled', '');
			$('.print-encryption').snazzyHide();
			$('.key-details').snazzyHide(300, function() { 
				if (!CoinInfo[CurrentCoinType].manual)
					$('.generate-button').snazzyShow();	
				});
			});
		});
	
	$('#private-key-input, #private-key-address-manual').keyup(function() 
		{		
		$(this).change();
		}
		);
	$('#private-key-input, #private-key-address-manual').change(function() 
		{
		if (CoinInfo[CurrentCoinType].manual)
			{
			ClearKeyText();

			
			var Address = $('#private-key-address-manual').val();
			var Key = $('#private-key-input').val();
			
			DisplayWallet(CurrentCoinType, Key, Address, false);	
			
			if (Key.length == 0 || Address.length == 0)
				{
				$('#coin-setup-menu #print').addClass('disabled');
				}
			else
				{
				$('.key-details').snazzyShow();
				$('#coin-setup-menu #print').removeClass('disabled');
				}
			}
		else
			{
			if (Bitcoin.BIP38.isBIP38Format($(this).val()))
				{
				$('.decrypt-key').snazzyShow();
				
				return;
				}
			else
				{
				$('.decrypt-key').snazzyHide();
				}
			
			var Address = GenerateAddress(true);	

			// $('ul#coin-setup-menu li#calibrate.step').removeClass('disabled');
			$('ul#coin-setup-menu li#print.step').removeClass('disabled');		
			
			SetLettering();
			}
		});	 
	}
	
	
function ClearKeyText()
{
	$('#private-key-hex').val('');
	$('#private-key-encrypted').val('');
	$('.private-key-encrypted').snazzyHide();
	$('#private-key-checksum').val('');
	$('#public-key-hex').val('');
	$('#public-key-hash160').val('');
	$('#public-key-address-checksum').val('');
	
	$('#public-address').val('');
	$('#public-key-address-checksum').val('');
	$('#private-key-wif').val('');
	$('#public-address').val('');
	$('.coin-wallet-address').html('');	
	$('.coin-wallet-address-qr').html('');
	$('.coin-wallet-private-key-qr').html('');
}

function closeEditorWarning(){
    return 'You have possibly unsaved private keys stored. If you close this window, those private keys will be lost forever unless you have them backed up. \nAre you sure you want to close this window?'
}

function DisplayWallet(CoinType, PrivKeyWIF, Address, Encrypted)
	{
	if (PrivKeyWIF != undefined && PrivKeyWIF != '' && Address != undefined && Address != '')
		{

		window.onbeforeunload = closeEditorWarning;
		
		if (!WalletContains(CoinType, PrivKeyWIF))
			{
			$('#private-key-add').removeAttr('disabled');
			}
		else
			{
			$('#private-key-add').attr('disabled', '');
			}
			
		$('#private-key-remove').removeAttr('disabled');
		$('.key-details').snazzyShow();
		if (!CoinInfo[CoinType].manual)
			$('.print-encryption').snazzyShow();			
		}
	else
		{
		$('#private-key-add').attr('disabled', '');
		$('#private-key-remove').attr('disabled', '');
		$('.key-details').snazzyHide();
		$('.print-encryption').snazzyHide();
		}
	
	if (!Encrypted)
		$('#private-key-wif').val(PrivKeyWIF);
		
	$('#public-address').val(Address);
	$('.coin-wallet-address').html(Address);
	
	$('.coin-wallet-address').html(Address);
	$('.coin-wallet-address-qr').qrcode(Address);

	var split = Encrypted ? 29 : 26;
	
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
		
	$('.coin-wallets').removeClass(AllCoinTypes);
	$('.coin-wallets').addClass(CoinType);
	
	$('.coin-wallet-address-qr').html('');
	$('.coin-wallet-address-qr').qrcode(Address, QRErrorCorrectLevel.H);
	
	if (!Encrypted)
		{
		$('.print-encryption #unencrypted-key').val(PrivKeyWIF);
		$('.print-encryption #encrypted-key').val('');
		$('.encrypted').fadeOut(300);
		$('.warning-encryption').fadeOut(300);
		
		$('.coin-wallets').removeClass('keys-encrypted');
		$('#encryption-key').val('');
		$('#encryption-key-confirm').val('');
		$('.private-key-encrypted').snazzyHide();
		$('#encrypt-remove-button').attr('disabled', '');
		$('.encryption-details').hide();
		$('.encryption-keys').show().css('opacity','1').css('height', 'auto');
		}
	else
		{
		$('.coin-wallets').addClass('keys-encrypted');
		$('.print-encryption #encrypted-key').val(PrivKeyWIF);
		$('.private-key-encrypted').snazzyShow();
		$('.warning-encryption').fadeIn(300);
		$('#private-key-encrypted').val(PrivKeyWIF);
		$('.encryption-details').show().css('height', 'auto').css('opacity','1');
		$('.encryption-keys').hide();
		}	
	
	$('.coin-wallet-private-key.top').html(PrivKeyWIF_Part1);
	$('.coin-wallet-private-key.top').html(PrivKeyWIF_Part1);
	$('.coin-wallet-private-key.bottom').html(PrivKeyWIF_Part2);
	
	$('.coin-wallet-private-key-qr').html('');
	$('.coin-wallet-private-key-qr').qrcode(PrivKeyWIF, QRErrorCorrectLevel.H);
	
	SetLettering();
	
	$('.coin-wallet').fadeIn(300);
	}

// Only used for 'FigureOutCoinAddressVersion' function
var OverrideAddressPrefix = undefined;
	
function GetAddressPrefixHex(CoinType)
	{
	if (OverrideAddressPrefix != undefined)
		return OverrideAddressPrefix;
	
	return CoinInfo[CoinType].addressVersion;
	}

function ClearCurrentKey()
	{
	ClearKeyText();		

	CurrentKey = undefined;
	
	DisplayWallets();
	
	$('.key-wallet.expand-x').click();

	$('#private-key-input').val('');
	$('#private-key-address-manual').val('');
	$('#private-key-add').attr('disabled', '');
	$('#private-key-remove').attr('disabled', '');
	$('.print-encryption').snazzyHide();
	$('.key-details').snazzyHide(300, function() { 
		if (!CoinInfo[CurrentCoinType].manual)
			$('.generate-button').snazzyShow();	
		});
	}

function Log(Text)
	{
	if (true) // LOG?
		console.log(Text);
	}
	
function GetDefaultCompress(CoinType)
	{
	return CoinInfo[CoinType].defaultCompress;	
	}
	
function GetPrivateKeyCompressed(CoinType, PrivateKeyWIF)
	{
	if (CoinType == 'nmc')
		{
		var t = PrivateKeyWIF.substr(0, 1);
		return t == 'L' || t == 'K';
		}
		
	var res = ParseBase58PrivateKey(PrivateKeyWIF); 
	var version = res[0];
	var payload = res[1];
	var Compressed = (payload.length > 32);
	return Compressed;
	}
	
function GenerateAddress(display)
	{
	if (display)
		$('#coin-address-verify').val('');
	
	var CoinType = CurrentCoinType;
	
	if (!CoinType)
		return;
	
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
		$('.private-key-error').fadeOut(300);
	
		PrivKeyHex = PrivKey;
		PrivKeyWIF = PrivateKeyHexToWIF(CoinType, PrivKeyHex, Default_Compress);
		}
	else if (PrivKey.length == 50 || PrivKey.length == 51 || PrivKey.length == 52)
		{
		$('.private-key-error').fadeOut(300);
		
		PrivKeyWIF = PrivKey;
		Compressed = GetPrivateKeyCompressed(CoinType, PrivKeyWIF);
		PrivKeyHex = PrivateKeyWIFToHex(PrivKeyWIF);
		
		if (Compressed && !Default_Compress)
			PrivKeyWIF = PrivateKeyHexToWIF(CoinType, PrivKeyHex, false);
		if (!Compressed && Default_Compress)
			PrivKeyWIF = PrivateKeyHexToWIF(CoinType, PrivKeyHex, true);
			
		Compressed = Default_Compress;
		}
	else if (PrivKey.length == 0)
		{
		$('.private-key-error').fadeOut(300);
		return;
		}		
	else
		{
		$('.private-key-error').fadeIn(300).html('Error: Unknown wallet format');
		Log("Unknown format: Size " + PrivKey.length);
		return;
		}
		
	HasPrivateKey = true;
	
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
		
	
	if (true || CoinType == 'btc')
		{
		/*
		// Verify
		var BitcoinAddress = new Bitcoin.ECKey(PrivKeyWIF);
		//BitcoinAddress.version = eval('0x' + CoinInfo[CoinType].addressVersion) + 128;
		Log(BitcoinAddress.version);
		var VerifyPrivKeyWIF = BitcoinAddress.toString();
		Log(VerifyPrivKeyWIF);
		
		var BitcoinECKey = new Bitcoin.ECKey(Crypto.util.hexToBytes(PrivKeyHex));
		BitcoinECKey.compressed = Compressed;
		BitcoinECKey.version = eval('0x' + CoinInfo[CoinType].addressVersion) + 128;
		
		/*
		var VerifyAddressECKey = new Bitcoin.ECKey(Crypto.util.hexToBytes(PrivKeyHex));
		VerifyAddressECKey.compressed = Compressed;
		var VerifyAddress = VerifyAddressECKey.getBitcoinAddress().toString();
		var Verified = (PrivKeyHex != '') && (VerifyPrivKeyWIF == PrivKeyWIF && Address == VerifyAddress);
		
		$('#coin-address-verify').val(Verified ? 'Yes' : 'No');
		*/
		}	
		
	if (display)
		{		
		$('#private-key-hex').val(PrivKeyHex);
		$('#private-key-compressed').val(Compressed ? 'Yes' : 'No');
		$('#public-key-hex').val(PubKeyHex);
		
		$('.coin-wallet').fadeOut(300, function() 
			{
			DisplayWallet(CoinType, PrivKeyWIF, Address, false);
			});
		}
	
	return Address;
	}
	
	
function ParseBase58PrivateKey(PrivateKeyHex)
	{
	var bytes = Bitcoin.Base58.decode(PrivateKeyHex);
	
	var end = bytes.length - 4;
	var hash = bytes.slice(0, end);
	
	var checksum = Crypto.SHA256(Crypto.SHA256(hash, {asBytes: true}), {asBytes: true});
	
	if (checksum[0] != bytes[end] ||
		checksum[1] != bytes[end+1] ||
		checksum[2] != bytes[end+2] ||
		checksum[3] != bytes[end+3])
			throw new Error("Wrong checksum");
			
	var version = hash.shift();
	
	return [version, hash];
	}
	
function GetEncoded(pt, Compressed) 
	{
	var x = pt.getX().toBigInteger();
	var y = pt.getY().toBigInteger();
	var enc = integerToBytes(x, 32);
	
	if (Compressed)
		{
		if (y.isEven())
			{
			enc.unshift(0x02);
			} 
		else
			{
			enc.unshift(0x03);
			}
		}
	else
		{
		enc.unshift(0x04);
		enc = enc.concat(integerToBytes(y, 32));
		}
	return enc;
	}

function GetPublicKey(PrivateKeyBytes, Compressed)
	{
	var PublicKeyHex = Crypto.util.bytesToHex(GetPublicKeyBytes(PrivateKeyBytes, Compressed));
	
	return PublicKeyHex;
	}
	
function GetPublicKeyBytes(PrivateKeyBytes, Compressed)
	{
	var curve = getSECCurveByName("secp256k1") //found in bitcoin-js/src/jsbn/sec.js

	//convert our random array or private key to a Big Integer
	var privateKeyBN = BigInteger.fromByteArrayUnsigned(PrivateKeyBytes);

	var curvePt = curve.getG().multiply(privateKeyBN);

	var PublicKeyBytes = GetEncoded(curvePt, Compressed);
	
	return PublicKeyBytes;
	}

function GetAddressFromKeyUnknown(CoinType, PrivateKey, Compressed)
	{
	if (PrivateKey.length == 32)
		{
		return GetAddressFromKeyHex(CoinType, Crypto.util.bytesToHex(PrivateKey), Compressed);
		}
	else if (PrivateKey.length == 64)
		{
		return GetAddressFromKeyHex(CoinType, PrivateKey, Compressed);
		}
	else if (PrivateKey.length == 50 ||PrivateKey.length == 51 || PrivateKey.length == 52)
		{
		return GetAddressFromKeyWIF(CoinType, PrivateKey, Compressed);
		}
	else
		{
		Log("Unknown format: Size " + PrivateKey.length);
		}		
	}
	
function GetAddressFromKeyWIF(CoinType, PrivateKeyWIF, Compressed)
	{
	return GetAddressFromKeyHex(CoinType, PrivateKeyWIFToHex(PrivateKeyWIF), Compressed);
	}
	
function GetAddressFromKeyHex(CoinType, PrivateKeyHex, Compressed)
	{
	return GetAddressFromKeyBytes(CoinType, Crypto.util.hexToBytes(PrivateKeyHex), Compressed);
	}
	
function GetAddressFromKeyBytes(CoinType, PrivateKeyBytes, Compressed)
	{
	var PublicKeyHex = GetPublicKey(PrivateKeyBytes, Compressed);
	
	return GetAddress(CoinType, PublicKeyHex);
	}
	
function GetAddress(CoinType, PublicKeyHex)
	{
	var PublicKeyBytes = Crypto.util.hexToBytes(PublicKeyHex);
	
	return GetAddressFromBytes(CoinType, PublicKeyBytes);
	}
	
function GetAddressFromBytes(CoinType, PublicKeyBytes)
	{	
	var KeyHash160 = GetKeyHash160(PublicKeyBytes);
			
	var version = Crypto.util.hexToBytes(GetAddressPrefixHex(CoinType));
	var KeyHash160Bytes = Crypto.util.hexToBytes(KeyHash160);
	KeyHash160Bytes.unshift(version);
	
	// Don't show the first two characters of the Hash 160.
	$('#public-key-hash160').val(Crypto.util.bytesToHex(KeyHash160Bytes).substring(2));
	
	var CheckSum = GetCheckSum(KeyHash160Bytes);
	
	$('#public-key-address-checksum').val(CheckSum);
	
	var UnencodedAddress = GetAddressPrefixHex(CoinType) + KeyHash160 + CheckSum;

	var Address = Bitcoin.Base58.encode(Crypto.util.hexToBytes(UnencodedAddress));
	
	return Address;
	}
	
function GetKeyHash160(PublicKeyBytes)
	{
	return Crypto.RIPEMD160(Crypto.util.hexToBytes(Crypto.SHA256(PublicKeyBytes)));
	}
	
function GetCheckSum(KeyHashBytes)
	{
	var DoubleSHA = Crypto.SHA256(Crypto.util.hexToBytes(Crypto.SHA256(KeyHashBytes)));
	return DoubleSHA.substr(0, 8);
	}
	
function GetVersionHex(CoinType)
	{
	//The private key prefix byte is always public key version plus 128
	
	var AddressPrefix = GetAddressPrefixHex(CoinType);
	
	var AddressPrefixInt = parseInt('0x' + AddressPrefix);
	AddressPrefixInt += 128;
	
	return AddressPrefixInt.toString(16);
	}
	
function PrivateKeyHexToWIF(CoinType, PrivateKeyHex, Compressed)
	{
	if (Compressed)
		{
		var PrivKeyBytes = Crypto.util.hexToBytes(PrivateKeyHex);
		PrivKeyBytes.push(0x01);
		
		PrivateKeyHex = Crypto.util.bytesToHex(PrivKeyBytes);
		}
		
	var PrivateKeyHexExt = GetVersionHex(CoinType) + PrivateKeyHex;
	
	var PrivateKeyHexHash = Crypto.SHA256(Crypto.util.hexToBytes(PrivateKeyHexExt));
	
	PrivateKeyHexHash = Crypto.SHA256(Crypto.util.hexToBytes(PrivateKeyHexHash));
	
	var CheckSum = PrivateKeyHexHash.substr(0, 8);
	
	$('#private-key-checksum').val(CheckSum);
	
	PrivateKeyHexExt = PrivateKeyHexExt + CheckSum;
	
	var PrivateKeyBase58 =  Bitcoin.Base58.encode(Crypto.util.hexToBytes(PrivateKeyHexExt));
	
	return PrivateKeyBase58;
	}
	
function CurveAdd(PubKeyHex1, PubKeyHex2)
	{
	var ECCurve = getSECCurveByName("secp256k1");
	
	var Curve = ECCurve.getCurve();
	
	var ECPoint1 = Curve.decodePointHex(PubKeyHex1);
	var ECPoint2 = Curve.decodePointHex(PubKeyHex2);
	
	if (ECPoint1.equals(ECPoint2))
		return null;
	
	var Compressed = (ECPoint1.compressed && ECPoint2.compressed);
	
	var PubKeyOut = ECPoint1.add(ECPoint2).getEncoded(Compressed);
	
	return PubKeyOut;	
	}
function CurveMultiply(PubKeyHex1, ECKey)
	{
	var ECCurve = getSECCurveByName("secp256k1");
	var ECPoint = ECCurve.getCurve().decodePointHex(pubKeyHex);
	
	var Compressed = (ECPoint.compressed && ECKey.compressed);
	
	ECKey.setCompressed(false);
	
	if (ECPoint.equals(ECKey.getPubPoint()))
		{
		return null;
		}
	
	var BigInt = ECKey.priv;
	
	var PubKeyOut = ECPoint.multiply(BigInt).getEncoded(Compressed);
	
	return PubKeyOut;	
	}
	
function PrivateKeyWIFToHex(PrivateKeyWIF)
	{
	var PrivateKeyBase58 = Bitcoin.Base58.decode(PrivateKeyWIF);
	PrivateKeyBase58 = Crypto.util.bytesToHex(PrivateKeyBase58);
	PrivateKeyBase58 = PrivateKeyBase58.substr(0, PrivateKeyBase58.length - 8);
	PrivateKeyBase58 = PrivateKeyBase58.substr(2);
	
	var res = ParseBase58PrivateKey(PrivateKeyWIF); 
	var version = res[0];
	var payload = res[1];
	if (payload.length > 32)
		{
		payload.pop();
		compressed = true;
		return Crypto.util.bytesToHex(payload);
		}
		
	return PrivateKeyBase58;
	}
	
