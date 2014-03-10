 /*

All crucial code and private key handling is done in this file along with prng4.js, which handles the RNG pool.
Changes to this file should be rare and should be heavily scrutinized. 

The majority of changes to this file should be the addition of new coin types.

*/

var Default_Compress = undefined;
var HasPrivateKey = false;
var DefaultCoin = 'btc';
var CurrentCoinType = DefaultCoin;

var CoinInfo = {
	'btc': {
		name: 'btc',
		fullName: 'Bitcoin',
		addressVersion: '00',
		defaultCompress: true,
		donateAddress: '18445kiESU6kAVHLRjxvHcAtPJ1gvQZX7b',
		enabled: true
		},
	'ltc': {
		name: 'ltc',
		fullName: 'Litecoin',
		addressVersion: '30',
		defaultCompress: true,
		donateAddress: 'LapsL7RwrZqzXduiaVBrtLBibyroqujmvr',
		enabled: true	
		},
	'ppc': {
		name: 'ppc',
		fullName: 'Peercoin',
		addressVersion: '37',
		defaultCompress: false,
		donateAddress: 'P8r6T77etknGTKKNdB7amRWnEBno3mAxud',
		enabled: true
		},
	'doge': {
		name: 'doge',
		fullName: 'Dogecoin',
		addressVersion: '1E',
		defaultCompress: false,
		donateAddress: 'DNwWMvq2V9DjbwDK1g8bouqBa23SV34QQ1',
		enabled: true
		},
	'nmc': {
		name: 'nmc',
		fullName: 'Namecoin',
		addressVersion: '34',
		defaultCompress: false,
		donateAddress: 'N5XHb3UH93WjZuq8XLmRpiM25J4d3djQYG',
		enabled: true
		},
	'nxt': {
		name: 'nxt',
		fullName: 'NXT',
		addressVersion: '',
		defaultCompress: true,
		donateAddress: '',
		enabled: false
		}, 
	'nem': {
		name: 'nem',
		fullName: 'NEM',
		addressVersion: '',
		defaultCompress: true,
		donateAddress: '',
		enabled: false
		}, 
	'msc': {
		name: 'msc',
		fullName: 'Mastercoin',
		addressVersion: '00',
		defaultCompress: true,
		donateAddress: '18445kiESU6kAVHLRjxvHcAtPJ1gvQZX7b',
		enabled: true
		},
	'xpm': {
		name: 'xpm',
		fullName: 'Primecoin',
		addressVersion: '17',
		defaultCompress: true,
		donateAddress: 'Aw44AFgoGm4KC5FgVyqbgrMZXKEdZ6iwhJ',
		enabled: true
		},
	'aur': {
		name: 'aur',
		fullName: 'Auroracoin',
		addressVersion: '17',
		defaultCompress: true,
		donateAddress: 'AScmXdw1AEPoutgmMp9vHGMxev8L2bwEMX',
		enabled: true
		},
	'vtc': {
		name: 'vtc',
		fullName: 'Vertcoin',
		addressVersion: '47',
		defaultCompress: true,
		donateAddress: 'VcQEG8NKd5C3HjBdYcnepsEA7H5yFtQXbv',
		enabled: true
		},
	'mint': {
		name: 'mint',
		fullName: 'Mintcoin',
		addressVersion: '33',
		defaultCompress: true,
		donateAddress: 'MbFhQX7b6DbuzFmiSYv1MxJpgs9jjH2Hah',
		enabled: true
		},
	'xcp': {
		name: 'xcp',
		fullName: 'Counterparty',
		addressVersion: '00',
		defaultCompress: true,
		donateAddress: '18445kiESU6kAVHLRjxvHcAtPJ1gvQZX7b',
		enabled: true
		},
	'ftc': {
		name: 'ftc',
		fullName: 'Feathercoin',
		addressVersion: '0e',
		defaultCompress: true,
		donateAddress: '6nCuFhvyWCYibjVT2JjfTftFymzwXvghs6',
		enabled: true
		},
	'pts': {
		name: 'pts',
		fullName: 'ProtoShares',
		addressVersion: '38',
		defaultCompress: true,
		donateAddress: 'PgzC3bGqcHfMG5uPS8rMLovfeogSVMP7bC',
		enabled: true
		},
	'qrk': {
		name: 'qrk',
		fullName: 'Quark',
		addressVersion: '3a',
		defaultCompress: true,
		donateAddress: 'QVfQ1osZ2eb6txBZUyWzK4UEupCKpDZQB4',
		enabled: true
		}
		
	};
	
var AllCoinTypes = '';

var CoinTypes = new Array();

for (var i =0 ; i < Object.keys(CoinInfo).length; i++)
	{
	CoinTypes[i] = CoinInfo[Object.keys(CoinInfo)[i]].name;
	AllCoinTypes += CoinInfo[Object.keys(CoinInfo)[i]].name;
	
	if (i < Object.keys(CoinInfo).length - 1)
		AllCoinTypes += ' ';
	}
	
 function InitPrivateKeyPage()
	 {
	$('.generate-button').click(function()
		{
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
		});
	
	$('#private-key-input').change(function() 
		{
		var Address = GenerateAddress(true);	

		// $('ul#coin-setup-menu li#calibrate.step').removeClass('disabled');
		$('ul#coin-setup-menu li#print.step').removeClass('disabled');		
		
		SetLettering();
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
		$('.coin-wallet').fadeOut(300, function() 
			{
			$('#public-key-hex').val(PubKeyHex);
			$('#public-address').val(Address);
			
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
			
			SetLettering();
			
			$('.coin-wallet').fadeIn(300);
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
	if (PrivateKey.length == 64)
		{
		return GetAddressFromKeyHex(CoinType, PrivateKey, Compressed);
		}
	else if (PrivateKey.length == 51 || PrivateKey.length == 52)
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
	
	$('#public-key-hash160').val(Crypto.util.bytesToHex(KeyHash160Bytes));
	
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
	
