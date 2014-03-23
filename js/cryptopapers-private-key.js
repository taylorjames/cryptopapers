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

	
 function InitPrivateKeyPage()
	 {
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
			$('#private-key-input').change();
		
			$('#security-generate-import-no').click();
			}
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
		
			var Address = GenerateAddress(true);	
			
			// $('ul#coin-setup-menu li#calibrate.step').removeClass('disabled');
			$('ul#coin-setup-menu li#print.step').removeClass('disabled');		
			
			SetLettering();
				
			}
		});	 
	}
	 
	 

function DisplayWallet(CoinType, PrivKeyWIF, Address, Encrypted)
	{
	$('.coin-wallet').animate({opacity: 0}, 300);	
	
	$('.key-details').animate({opacity: 0}, 300, function()
		{
		if (PrivKeyWIF != undefined && PrivKeyWIF != '' && Address != undefined && Address != '')
			{
			if (!CoinInfo[CoinType].manual)
				$('.print-encryption').snazzyShow();			
			}
		else
			{
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
	
		if (PrivKeyWIF != undefined && PrivKeyWIF != '' && Address != undefined && Address != '')
			{
			$('.key-details').animate({opacity: 1}, 300);
			$('.coin-wallet').animate({opacity: 1}, 300);
			}
		});
	}

// Only used for 'FigureOutCoinAddressVersion' function
var OverrideAddressPrefix = undefined;
	
function GetAddressPrefixHex(CoinType)
	{
	if (OverrideAddressPrefix != undefined)
		return OverrideAddressPrefix;
	
	return CoinInfo[CoinType].addressVersion;
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
		
		DisplayWallet(CoinType, PrivKeyWIF, Address, false);
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
	
