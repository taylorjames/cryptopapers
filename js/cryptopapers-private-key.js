 /*

All crucial code and private key handling is done in this file along with prng4.js, which handles the RNG pool.
Changes to this file should be rare and should be heavily scrutinized. 

The majority of changes to this file should be the addition of new coin types.

*/

var Default_Compress = undefined;
var HasPrivateKey = false;
var DefaultCoin = 'btc';
var CurrentCoinType = DefaultCoin;

var ChainMode = false;
var ArmoryMode = false;
var ElectrumMode = false;

var VanityEnabled = undefined;

var LastInput = '';
var LastInput_Armory = '';
var LastInput_Electrum = '';
var LastInput_ElectrumRoot = '';

var ChainSet = 0;

function InitPrivateKeyPage()
	{
	$('input[name=electrum-change]').change(function()
		{
		LastInput = '';
		$('#private-key-input').change();		
		});
		
	$('.chain-set-last').click(function() 
		{
		if ($('.chain-set-buttons').hasClass('set-1'))
			return;
			
		$('.chain-set-buttons').removeClass('set-'+ (ChainSet+1));
		
		ChainSet--;
		
		LastInput = '';
		$('#private-key-input').change();
		
		$('.chain-set-buttons').addClass('set-'+ (ChainSet+1));
		$('.chain-set-number').html((ChainSet+1));
		});
		
	$('.chain-set-next').click(function() 
		{
		$('.chain-set-buttons').removeClass('set-'+ (ChainSet+1));
		
		ChainSet++;
		
		LastInput = '';
		$('#private-key-input').change();
		
		$('.chain-set-buttons').addClass('set-'+ (ChainSet+1));
		});
	
	$('#private-key-electrum-root').keyup(function() 
		{
		$('#private-key-electrum-root').change();
		});
		
	$('#private-key-electrum-root').change(function() 
		{
		if (ElectrumMode)
			{
			var InputElectrumRoot = $('#private-key-electrum-root').val();
			
			if (LastInput_ElectrumRoot == InputElectrumRoot)
				{
				return;
				}
			LastInput_ElectrumRoot = InputElectrumRoot;
			
			ShowElectrum(true, false, true);
			}
		});
	$('#private-key-electrum').keyup(function() 
		{
		//$('#private-key-electrum').change();
		});
		
	$('#private-key-electrum').change(function() 
		{
		if (ElectrumMode)
			{
			var InputElectrum = $('#private-key-electrum').val();
			
			if (LastInput_Electrum == InputElectrum)
				{
				return;
				}
			LastInput_Electrum = InputElectrum;
			
			ShowElectrum(true, true, false);
			}
		});
		
	$('.electrum-icon.toggle').click(function()
		{
		if ($(this).hasClass('selected'))
			{
			ShowElectrum(false, false, false);
			}
		else
			{
			ShowElectrum(true, false, true);
			}
		});
		
	$('#private-key-armory').mask('xxxx xxxx xxxx xxxx xxxx xxxx xxxx xxxx xxxx\n' + 
												'xxxx xxxx xxxx xxxx xxxx xxxx xxxx xxxx xxxx');
	
	$('#private-key-armory').keyup(function() 
		{
		$('#private-key-armory').change();
		});
		
	$('#private-key-armory').change(function() 
		{
		if (ArmoryMode)
			{
			var InputArmory = $('#private-key-armory').val();
			
			if (LastInput_Armory == InputArmory)
				{
				return;
				}
			LastInput_Armory = InputArmory;
			
			ShowArmory(true, true, false);
			}
		});
		
	$('.armory-icon.toggle').click(function()
		{
		if ($(this).hasClass('selected'))
			{
			ShowArmory(false, false, false);
			}
		else
			{
			ShowArmory(true, false, true);
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
			var bytes = sr.getBytes(32);
			sr.seedTime();
			var hex = Crypto.util.bytesToHex(bytes);
						
			$('#private-key-input').val(hex);
			
			if (ElectrumMode)
				{
				$('#private-key-electrum-root').val(hex.substr(0,32));
				ShowElectrum(true, false, true);
				}			
			
			$('#private-key-input').change();
		
			$('#security-generate-import-no').click();
			}
		});
		
	$('input[name=compression]').change(function() 
		{
		Default_Compress = $('input[name=compression]:checked').val() == 'Yes';
		
		// If a WIF was entered, we must convert it to Hex in order to compute the other comressed/uncompressed version
		var PrivKey = $('#private-key-input').val();
		
		if (PrivKey.length == 50 || PrivKey.length == 51 || PrivKey.length == 52 || PrivKey.length == 53)
			{
			$('#private-key-input').val($('#private-key-hex').val());
			}
			
		// Force refresh
		LastInput = '';
		$('#private-key-input').change();
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
				
			// Invalid WIF error correction
			var InputKey = $('#private-key-input').val();
			var FirstChar = InputKey[0];
			
			if (LastInput == InputKey)
				{
				return;
				}
			LastInput = InputKey;
			
			if (IsEasy16(InputKey))
				{
				
				var Sections = InputKey.split(' ');
				
				if (Sections.length == 18)
					{
					InputKey = Sections.slice(0, 9).join(' ') + '\n' + 
						Sections.slice(9, 18).join(' ');
						
					$('#private-key-armory').val(InputKey);
					
					ShowArmory(true, true, false);
					}
				return;
				}
			else if (FirstChar != undefined &&
				CoinInfo[CurrentCoinType].uncompressedKeyStart.indexOf(FirstChar) < 0 &&
				CoinInfo[CurrentCoinType].compressedKeyStart.indexOf(FirstChar) < 0 &&
				(InputKey.length == 50 || InputKey.length == 51 || InputKey.length == 52 || InputKey.length == 53))
				{
				var KeyBytes = Bitcoin.Base58.decode(InputKey);
				
				var KeyHex = Crypto.util.bytesToHex(KeyBytes);
				
				var Option1Key = KeyHex.substr(1, 64);
				var Option1Address = new Omnicoin.ECKey(Option1Key, eval('0x' + CoinInfo[CurrentCoinType].addressVersion), true).getDetails().address;
				var Option2Key = KeyHex.substr(2, 64);
				var Option2Address = new Omnicoin.ECKey(Option2Key, eval('0x' + CoinInfo[CurrentCoinType].addressVersion), true).getDetails().address;
				var Option3Key = KeyHex.substr(3, 64);
				var Option3Address = new Omnicoin.ECKey(Option3Key, eval('0x' + CoinInfo[CurrentCoinType].addressVersion), true).getDetails().address;
				var Option4Key = KeyHex.substr(1, 64);
				var Option4Address = new Omnicoin.ECKey(Option4Key, eval('0x' + CoinInfo[CurrentCoinType].addressVersion), false).getDetails().address;
				var Option5Key = KeyHex.substr(2, 64);
				var Option5Address = new Omnicoin.ECKey(Option5Key, eval('0x' + CoinInfo[CurrentCoinType].addressVersion), false).getDetails().address;
				var Option6Key = KeyHex.substr(3, 64);
				var Option6Address = new Omnicoin.ECKey(Option6Key, eval('0x' + CoinInfo[CurrentCoinType].addressVersion), false).getDetails().address;
				
				var Options =
					'<div><input type="radio" id="error-correct-1" name="error-correct" value="' + Option1Key + '">' + 
					'<label for="error-correct-1">' + Option1Address + '</label></div>' + 
					'<div><input type="radio" id="error-correct-2" name="error-correct" value="' + Option2Key + '">' + 
					'<label for="error-correct-2">' + Option2Address + '</label></div>' + 
					'<div><input type="radio" id="error-correct-3" name="error-correct" value="' + Option3Key + '">' + 
					'<label for="error-correct-3">' + Option3Address + '</label></div>' + 
					'<div><input type="radio" id="error-correct-4" name="error-correct" value="' + Option4Key + '">' + 
					'<label for="error-correct-4">' + Option4Address + '</label></div>' + 
					'<div><input type="radio" id="error-correct-5" name="error-correct" value="' + Option5Key + '">' + 
					'<label for="error-correct-5">' + Option5Address + '</label></div>' + 
					'<div><input type="radio" id="error-correct-6" name="error-correct" value="' + Option6Key + '">' + 
					'<label for="error-correct-6">' + Option6Address + '</label></div>';
				
				$('.error-correct-options').html(Options);
				
				$('input[name=error-correct]').change(function() 
					{
					$('#private-key-recover-yes').removeAttr('disabled');
					});
					
				$('#private-key-recover-yes').attr('disabled', '');
				
				$('.private-key-error-correction').snazzyShow();
				}
			else
				{				
				$('.private-key-error-correction').snazzyHide();
				
				var Address = GenerateAddress(true);	
				
				if (ArmoryMode)
					ShowArmory(true, false, true);
					
				// $('ul#coin-setup-menu li#calibrate.step').removeClass('disabled');
				$('ul#coin-setup-menu li#print.step').removeClass('disabled');		
				
				SetLettering();
				}				
			}
		});
	$('#private-key-recover-no').click(function()
		{
			$('.private-key-error-correction').snazzyHide();
		});
	$('#private-key-recover-yes').click(function()
		{
			// Discard the WIF enclosure and extract the raw key.
			KeyHex = $('input[name=error-correct]:checked').val();
			
			$('#private-key-input').val(KeyHex);
			
			$('.private-key-error-correction').snazzyHide();
		});
	}
	
function ShowElectrum(Show, ElectrumChange, PKChange)
	{
	var Switch = false;
	if (Show)
		{		
		if (!ElectrumMode)
			Switch = true;
		
		if (ArmoryMode)
			{
			ShowArmory(false, false, false);
			}
			
		ChainMode = true;
		ElectrumMode = true;
		
		$('.key-import .private-key').snazzyHide();
		$('.key-import .electrum').snazzyShow();
		$('.electrum-icon.toggle').animate({opacity: 1}, 300);
		$('.electrum-icon.toggle').addClass('selected');

		if ($('#private-key-electrum-root').val().length == 0 && $('#private-key-input').val().length == 64)
			{
			if ($('#private-key-electrum-root').val() != $('#private-key-input').val().substr(0,32))
				{
				PKChange = true;
				$('#private-key-electrum-root').val($('#private-key-input').val().substr(0,32));
				}
			}
		else
			{
			}
		
		if (PKChange && $('#private-key-electrum-root').val().length == 32)
			{
			// Forces keys to regenerate only if codes are changed
			$('#private-key-electrum-chain-key').val('');
			$('#private-key-electrum-chain-key').attr('for-code', '');
			
			var NewKey = $('#private-key-electrum-root').val();
			
			var Mnemonic = mn_encode(NewKey);

			if ($('#private-key-electrum').val() != Mnemonic)
				{
				$('#private-key-electrum').val(Mnemonic);
				Switch = true;
				}
				
			if ($('#private-key-electrum-root').val() != NewKey)
				{
				$('#private-key-electrum-root').val(NewKey);
				Switch = true;
				}
			}

		if (ElectrumChange && $('#private-key-electrum').val().length > 0)
			{
			// Forces keys to regenerate only if codes are changed
			$('#private-key-electrum-chain-key').val('');
			$('#private-key-electrum-chain-key').attr('for-code', '');
			
			var NewMnemonic = $('#private-key-electrum').val();
			
			var NewKey = mn_decode(NewMnemonic);
			
			if (NewKey.length == 32)
				{					
				if ($('#private-key-electrum-root').val() != NewKey)
					{
					$('#private-key-electrum-root').val(NewKey);
					Switch = true;
					}
				}
			}
			
		if ($('#compressed').is(':checked'))
			{
			$('#decompressed').click();
			return;
			}			
			
		if (Switch)
			{
			LastInput = '';
			$('#private-key-input').change();
			}
		}
	else
		{
		if (ElectrumMode)
			Switch = true;
			
		ChainMode = false;
		ElectrumMode = false;
		$('.key-import .private-key').snazzyShow();
		$('.key-import .electrum').snazzyHide();
		$('.electrum-icon.toggle').animate({opacity: 0.3}, 300);
		$('.electrum-icon.toggle').removeClass('selected');
		
		if (Switch)
			{
			LastInput = '';
			$('#private-key-input').change();
			}
		}
	}

function ShowArmory(Show, ArmoryChange, PKChange)
	{
	var Switch = false;
	if (Show)
		{
		if (ElectrumMode)
			{
			ShowElectrum(false, false, false);
			}
			
		if (!ArmoryMode)
			Switch = true;
		
		ChainMode = true;
		ArmoryMode = true;
		
		$('.key-import .armory').snazzyShow();
		$('.armory-icon.toggle').animate({opacity: 1}, 300);
		$('.armory-icon.toggle').addClass('selected');
		
	//	$('.switch-toggle.compression input').attr('disabled', '');
	//	$('.switch-toggle.compression a').attr('disabled', '');

		if (PKChange && $('#private-key-hex').val().length == 64 && 
			($('#private-key-armory').val().length == 0  || 
			$('#private-key-armory').val().length == 89))
			{			
			var Easy16Key = ConvertToEasy16(Crypto.util.hexToBytes($('#private-key-hex').val()));

			if ($('#private-key-armory').val() != Easy16Key)
				{
				$('#private-key-armory').val(Easy16Key);
				Switch = true;
				}
			}

		if (ArmoryChange && $('#private-key-armory').val().length == 89
			&& $('#private-key-armory').val().indexOf('_') < 0)
			{
			
			var HexKey = Crypto.util.bytesToHex(ConvertFromEasy16($('#private-key-armory').val()));
			
			if ($('#private-key-input').val() != HexKey)
				{
				$('#private-key-input').val(HexKey);
				Switch = true;
				}
			}
			
		if ($('#compressed').is(':checked'))
			{
			$('#decompressed').click();
			return;
			}			
			
		if (Switch)
			{
			LastInput = '';
			$('#private-key-input').change();
			}
		}
	else
		{
		if (ArmoryMode)
			Switch = true;
			
		ChainMode = false;
		ArmoryMode = false;
		$('.key-import .armory').snazzyHide();
		$('.armory-icon.toggle').animate({opacity: 0.3}, 300);
		$('.armory-icon.toggle').removeClass('selected');
		
		if (Switch)
			{
			LastInput = '';
			$('#private-key-input').change();
			}

	//	$('.switch-toggle.compression input').removeAttr('disabled');
	//	$('.switch-toggle.compression a').removeAttr('disabled');
		}
	}

function DisplayWallet(CoinType, PrivKeyWIF, Address, Encrypted)
	{	
	Armory.stop();
	Electrum.stop();
	
	$('.coin-wallet').animate({opacity: 0}, 300);	
		
	$('.key-details').animate({opacity: 0}, 300, function()
		{
		
		if (ChainMode)
			{
			$('.key-details .chain-keys').show();
			$('.key-details .single-key').hide();
			}
		else
			{
			$('.key-details .chain-keys').hide();
			$('.key-details .single-key').show();
			}
			
		if (PrivKeyWIF != undefined && PrivKeyWIF != '' && Address != undefined && Address != '' || ElectrumMode)
			{
			if (!CoinInfo[CoinType].manual && !ChainMode)
				$('.print-encryption').snazzyShow();			
			}
		else
			{
			$('.print-encryption').snazzyHide();
			}
		
		if (!Encrypted)
			$('#private-key-wif').val(PrivKeyWIF);
			
		$('#public-address').val(Address);
		$('.coin-wallet-address.address-1').html(Address);

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
		
		$('.coin-wallet-address-qr.qr-1').html('');
		$('.coin-wallet-address-qr.qr-1').qrcode(Address, QRErrorCorrectLevel.H);
		
		if (!Encrypted)
			{
			$('.print-encryption #unencrypted-key').val(PrivKeyWIF);
			$('.print-encryption #encrypted-key').val('');
			
			$('.encrypted').fadeOut(300);
			$('.warning-encryption').fadeOut(300);
			
			$('.coin-wallets').removeClass('keys-encrypted');
			$('.private-key-encrypted').snazzyHide();
			$('#encrypt-remove-button').attr('disabled', '');
			
			if (PersistPassword != undefined && PersistPassword != '')
				{
				$('#encryption-key').val(PersistPassword);
				$('#encryption-key-confirm').val(PersistPassword);
				$('#encrypt-button').click();
				}
			else
				{
				$('#encryption-key').val('');
				$('#encryption-key-confirm').val('');
			
				$('.encryption-details').hide();
				$('.encryption-keys').show().css('opacity','1').css('height', 'auto');
				}
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
		
		if (ChainMode)
			{
			$('.coin-wallets').addClass('key-chain');
			SetFrame('Frame-10');
			$('.frame-type.selector-grid').addClass('disabled');
			}
		
		if (ArmoryMode)
			{						
			var ArmoryKey = $('#private-key-armory').val();
			
			$('.chain-keys').addClass('armory');
			$('.chain-keys').removeClass('electrum');
			$('.coin-wallets').addClass('armory');
			
			var KeyIndex = 1;
			
			$('.coin-wallet-private-key.top').html(ArmoryKey.replace('\n', '<br>'));
			$('.coin-wallet-private-key.bottom').html(ArmoryKey.replace('\n', '<br>'));
		
			$('.coin-wallet-private-key-qr.qr-master').html('');
			$('.coin-wallet-private-key-qr.qr-master').qrcode(ArmoryKey, QRErrorCorrectLevel.H);
			
			/*
			$('.chain-key.1 h4').html('Address ' + ((ChainSet * 6) + 1));
			$('.chain-key.2 h4').html('Address ' + ((ChainSet * 6) + 2));
			$('.chain-key.3 h4').html('Address ' + ((ChainSet * 6) + 3));
			$('.chain-key.4 h4').html('Address ' + ((ChainSet * 6) + 4));
			$('.chain-key.5 h4').html('Address ' + ((ChainSet * 6) + 5));
			$('.chain-key.6 h4').html('Address ' + ((ChainSet * 6) + 6));
			*/
			
			$('.chain-set-number').html((ChainSet+1));
		
			var Current = 0;
			
			var Total = (ChainSet+1)*6;
			var Begin = (ChainSet*6);
			
			var Debug = '				[\'' + $('#private-key-input').val() + '\',\n' +
					'					\'' + ArmoryKey.replace('\n', '\\n') + '\',\n' + 
					'					[\n';
			
			Armory.gen(ArmoryKey, Total, eval('0x' + CoinInfo[CoinType].addressVersion),			
			function(Key) 
				{ // Update
				var Percent  = Math.round((Current +1) * 100 / Total);
				
				Debug += '					[\'' + Key[1] + '\',\n' +
					'						\'' + Key[0] + '\'],\n';
				
				$('.chain-progress').html(Percent + '%');
					
				if (Current >= Begin)
					{
					var Address = Key[0];
					var WIF = Key[1];
					
					$('.chain-key.' + KeyIndex + ' #chain-public-address-' + KeyIndex).val(Address);
					$('.chain-key.' + KeyIndex + ' #chain-private-key-wif-' + KeyIndex).val(WIF);
					
					$('.coin-wallet-address.address-' + KeyIndex).html(Address);
					
					$('.coin-wallet-address-qr.qr-' + KeyIndex).html('');
					$('.coin-wallet-address-qr.qr-' + KeyIndex).qrcode(Address, QRErrorCorrectLevel.H);
					
					$('.coin-wallet-private-key-qr.qr-' + KeyIndex).html('');
					$('.coin-wallet-private-key-qr.qr-' + KeyIndex).qrcode(WIF, QRErrorCorrectLevel.H);
					KeyIndex++;
					}
					
				Current++;
				},
			function() 
				{ // Success
				$('.chain-progress').html('');
				
				Debug += '					],\n' + 
				'				],';
				
				Log(Debug);
				
				SetLettering();
			
				if (PrivKeyWIF != undefined && PrivKeyWIF != '' && Address != undefined && Address != '')
					{
					$('.key-details').animate({opacity: 1}, 300);
					$('.coin-wallet').animate({opacity: 1}, 300);
					}
				});
			return
			}
		else if (ElectrumMode)
			{			
			var ElectrumKey = $('#private-key-electrum').val();
			var ElectrumKeyRoot = $('#private-key-electrum-root').val();
			
			$('.chain-keys').addClass('electrum');
			$('.chain-keys').removeClass('armory');
			$('.coin-wallets').addClass('electrum');
			
			var KeyIndex = 1;
			
			$('.coin-wallet-private-key.top').html(ElectrumKey);
			$('.coin-wallet-private-key.bottom').html(ElectrumKey);
		
			$('.coin-wallet-private-key-qr.qr-master').html('');
			$('.coin-wallet-private-key-qr.qr-master').qrcode(ElectrumKey, QRErrorCorrectLevel.H);
			
			/*
			$('.chain-key.1 h4').html('Address ' + ((ChainSet * 6) + 1));
			$('.chain-key.2 h4').html('Address ' + ((ChainSet * 6) + 2));
			$('.chain-key.3 h4').html('Address ' + ((ChainSet * 6) + 3));
			$('.chain-key.4 h4').html('Address ' + ((ChainSet * 6) + 4));
			$('.chain-key.5 h4').html('Address ' + ((ChainSet * 6) + 5));
			$('.chain-key.6 h4').html('Address ' + ((ChainSet * 6) + 6));
			*/
			
			$('.chain-set-number').html((ChainSet+1));
		
			var Current = 0;
			
			var ChangeCount = parseInt($('input[name=electrum-change]:checked').val());
			var AddressCount = 6 - ChangeCount;
			
			var TotalAddress = (ChainSet+1)*AddressCount;
			var BeginAddress = (ChainSet*AddressCount);
			var TotalChange = (ChainSet+1)*ChangeCount;
			var BeginChange = BeginAddress + AddressCount + (ChainSet*ChangeCount);
			
			var Success = function(a) 
				{ // Success
					$('.chain-progress').html('');
					
					var ChainCode = Crypto.util.bytesToHex(a);
					
					var Debug = '				[\'' + ElectrumKeyRoot + '\',\n' +
							'					\'' + ElectrumKey + '\',\n' + 
							'					\'' + ChainCode + '\',\n' + 
							'					[\n';
						
					$('#private-key-electrum-chain-key').val(ChainCode);
					
					$('#private-key-electrum-chain-key').attr('for-code', $('#private-key-electrum').val());
					
					Electrum.gen(TotalAddress, TotalChange, eval('0x' + CoinInfo[CoinType].addressVersion), 
						function(a)
						{	// Update
						var Change = false;
						
						if (KeyIndex > AddressCount)
							{
							Change = true;
							}
							
						Debug += '					[\'' + a[1] + '\',\n' +
							'						\'' + a[0] + '\'],\n';
							
						var Percent  = Math.round((Current +1) * 100 / (TotalAddress + TotalChange));
						
						$('.chain-progress').html(Percent + '%');
						
						if ((!Change && Current >= BeginAddress) ||
							(Change && Current >= BeginChange))
							{
							var Address = a[0];
							var WIF = a[1];
							
							$('.chain-key.' + KeyIndex + ' #chain-public-address-' + KeyIndex).val(Address);
							$('.chain-key.' + KeyIndex + ' #chain-private-key-wif-' + KeyIndex).val(WIF);
							
							$('.coin-wallet-address.address-' + KeyIndex).html(Address);
							
							if (Change)
								{
								$('.chain-key.' + KeyIndex + ' h4').html('Change Address ' + (KeyIndex - AddressCount));
								$('.coin-wallet-address-qr.qr-' + KeyIndex).removeClass('change-1 change-2 change-3 change-4 change-5');
								$('.coin-wallet-address-qr.qr-' + KeyIndex).addClass('change-' + (KeyIndex - AddressCount));
								$('.coin-wallet-private-key.qr-' + KeyIndex).removeClass('change-1 change-2 change-3 change-4 change-5');
								$('.coin-wallet-private-key.qr-' + KeyIndex).addClass('change-' + (KeyIndex - AddressCount));
								}
							else
								{
								$('.chain-key.' + KeyIndex + ' h4').html('Address ' + KeyIndex);
								}
								
							$('.coin-wallet-address-qr.qr-' + KeyIndex).html('');
							$('.coin-wallet-address-qr.qr-' + KeyIndex).toggleClass('change', Change);
							$('.coin-wallet-address-qr.qr-' + KeyIndex).qrcode(Address, QRErrorCorrectLevel.H);
							
							$('.coin-wallet-private-key-qr.qr-' + KeyIndex).html('');
							$('.coin-wallet-private-key-qr.qr-' + KeyIndex).toggleClass('change', Change);
							$('.coin-wallet-private-key-qr.qr-' + KeyIndex).qrcode(WIF, QRErrorCorrectLevel.H);
							
							KeyIndex++;
							}
							
						Current++;
						},
						function(a)
						{  // Success
						$('.chain-progress').html('');
						
						Debug += '					],\n' + 
						'				],';
						Log(Debug);
						
						SetLettering();
					
						if (PrivKeyWIF != undefined && PrivKeyWIF != '' && Address != undefined && Address != '')
							{
							$('.key-details').animate({opacity: 1}, 300);
							$('.coin-wallet').animate({opacity: 1}, 300);
							}
						});
				}			
			
			var ChainKey = $('#private-key-electrum-chain-key').val();
			
			if (ChainKey.length == 64 && $('#private-key-electrum-chain-key').attr('for-code') == $('#private-key-electrum').val())
				{				
				Success(Crypto.util.hexToBytes(ChainKey));
				}
			else
				{				
				Electrum.init(ElectrumKeyRoot, 
					function(a, b) 
					{ // Update
						$('.chain-progress').html((a) + '%');
						
						$('#private-key-electrum-chain-key').val(Crypto.util.bytesToHex(b));
					},
					Success);
				}
				
			return;
			}
		else
			{
			$('.coin-wallets').removeClass('key-chain');
			$('.coin-wallets').removeClass('armory');
			$('.coin-wallets').removeClass('electrum');
			$('.chain-keys').removeClass('armory');
			$('.chain-keys').removeClass('electrum');
			
			SetFrame(DefaultFrame);
			$('.frame-type.selector-grid').removeClass('disabled');
			
			$('.coin-wallet-private-key.top').html(PrivKeyWIF_Part1);
			$('.coin-wallet-private-key.bottom').html(PrivKeyWIF_Part2);
			
			$('.coin-wallet-private-key-qr').html('');
			$('.coin-wallet-private-key-qr').qrcode(PrivKeyWIF, QRErrorCorrectLevel.H);
			}
		
		SetLettering();
	
		if (PrivKeyWIF != undefined && PrivKeyWIF != '' && Address != undefined && Address != '')
			{
			$('.key-details').animate({opacity: 1}, 300);
			$('.coin-wallet').animate({opacity: 1}, 300);
			}
		});
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
		Default_Compress = !ArmoryMode && !ElectrumMode && CoinInfo[CoinType].defaultCompress;
		}
	
	var Compressed = !ArmoryMode && !ElectrumMode && Default_Compress;
	
	if (ArmoryMode || ElectrumMode)
		{
		Compressed = false;
		Default_Compress = false;
		
		if ($('#compressed').is(':checked'))
			{
			$('#decompressed').click();
			return;
			}
		}
		
	var PrivKey = $("#private-key-input").val();
	
	var PrivKeyHex = '';
	var PrivKeyWIF = '';
	
	var KeyDetails = undefined;
	
	if (PrivKey.length == 0)
		{
		$('.private-key-error').fadeOut(300);
		return;
		}
	
	try
		{
		if (PrivKey.length == 64)
			{
			KeyDetails = new Omnicoin.ECKey(PrivKey, eval('0x' + CoinInfo[CoinType].addressVersion), Default_Compress).getDetails();
			}
		else
			{
			KeyDetails = new Omnicoin.ECKey(PrivKey, eval('0x' + CoinInfo[CoinType].addressVersion)).getDetails();
			}
		
		$('.private-key-error').fadeOut(300);
		}
	catch (ex)
		{
		$('.private-key-error').fadeIn(300);
		$('.private-key-error').html(ex);
		return;
		}
	
	if (PrivKey.length == 64)
		{
		PrivKeyHex = KeyDetails.privateKey;
		PrivKeyWIF = KeyDetails.privateKeyWIF;
		
		Compressed = GetPrivateKeyCompressed(CoinType, PrivKeyWIF);
		
		if (Compressed && !$('#compressed').is(':checked'))
			{
			$('#compressed').click();
			return;
			}
		else if (!Compressed && $('#compressed').is(':checked'))
			{
			$('#decompressed').click();
			return;
			}
		}
	else if (PrivKey.length == 50 || PrivKey.length == 51 || PrivKey.length == 52 || PrivKey.length == 53)
		{		
		Compressed = GetPrivateKeyCompressed(CoinType, KeyDetails.privateKeyWIF);
		
		PrivKeyHex = KeyDetails.privateKey;		
		PrivKeyWIF = KeyDetails.privateKeyWIF;
		
		if (PrivKeyWIF != PrivKey)
			throw 'Private Key did not match'
		
		if (Compressed && !$('#compressed').is(':checked'))
			{
			$('#compressed').click();
			return;
			}
		else if (!Compressed && $('#compressed').is(':checked'))
			{
			$('#decompressed').click();
			return;
			}
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
	
	var PubKeyHex = KeyDetails.publicKey;
	var Address = KeyDetails.address;
		
	if (display)
		{
		$('#private-key-hex').val(PrivKeyHex);
		$('#private-key-compressed').val(Compressed ? 'Yes' : 'No');
		$('#public-key-hex').val(PubKeyHex);
		$('#private-key-checksum').val(KeyDetails.privateKeyChecksum);
		$('#public-key-hash160').val(KeyDetails.publicKeyHash);
		$('#public-key-address-checksum').val(KeyDetails.addressChecksum);
		
		DisplayWallet(CoinType, PrivKeyWIF, Address, false);
		}
	
	return Address;
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
	
function GetPrivateKeyCompressed(CoinType, PrivateKeyWIF)
	{	
	var WIFKeyChar = PrivateKeyWIF[0];
	
	if (CoinInfo[CoinType].uncompressedKeyStart.indexOf(WIFKeyChar) >= 0)
		{
		return false;
		}
	else if (CoinInfo[CoinType].compressedKeyStart.indexOf(WIFKeyChar) >= 0)
		{
		return true;
		}
	else
		{
		throw new Error('Invalid WIF - could not determine key compression');
		// ?????
		}
	}
	
/* Obsolete - replaced by Omnicoin

function GetAddressPrefixHex(CoinType)
	{
	if (OverrideAddressPrefix != undefined)
		return OverrideAddressPrefix;
	
	return CoinInfo[CoinType].addressVersion;
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
	return GetAddressFromKeyHex(CoinType, PrivateKeyWIFToHex(CoinType, PrivateKeyWIF), Compressed);
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
	
	var Out = AddressPrefixInt.toString(16);
	
	// Versions that are greater than 0x80 produce a prefix longer than 2 bytes, the least significant bytes are kept.
	if (Out.length > 2)
		{
		Out = Out.substr(1);
		}
		
	return Out;
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
	
function PrivateKeyWIFToHex(CoinType, PrivateKeyWIF)
	{
	var PrivateKeyBase58 = Bitcoin.Base58.decode(PrivateKeyWIF);
	PrivateKeyBase58 = Crypto.util.bytesToHex(PrivateKeyBase58);
	PrivateKeyBase58 = PrivateKeyBase58.substr(0, PrivateKeyBase58.length - 8);
	PrivateKeyBase58 = PrivateKeyBase58.substr(2);
	
	if (GetPrivateKeyCompressed(CoinType, PrivateKeyWIF))
		{
		var res = ParseBase58PrivateKey(PrivateKeyWIF); 
		var version = res[0];
		var payload = res[1];
		
		payload.pop();
		
		return Crypto.util.bytesToHex(payload);
		}
		
	return PrivateKeyBase58;
	}
*/

	
