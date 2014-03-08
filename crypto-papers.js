

var CoinInfo = {
	'btc': {
		name: 'btc',
		fullName: 'Bitcoin',
		addressVersion: '00',
		defaultCompress: true,
		donateAddress: '',
		enabled: true
		},
	'ltc': {
		name: 'ltc',
		fullName: 'Litecoin',
		addressVersion: '30',
		defaultCompress: true,
		donateAddress: '',
		enabled: true	
		},
	'ppc': {
		name: 'ppc',
		fullName: 'Peercoin',
		addressVersion: '37',
		defaultCompress: false,
		donateAddress: '',
		enabled: true
		},
	'doge': {
		name: 'doge',
		fullName: 'Dogecoin',
		addressVersion: '1E',
		defaultCompress: false,
		donateAddress: '',
		enabled: true
		},
	'nmc': {
		name: 'nmc',
		fullName: 'Namecoin',
		addressVersion: '34',
		defaultCompress: false,
		donateAddress: '',
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
		donateAddress: '',
		enabled: true
		},
	'xpm': {
		name: 'xpm',
		fullName: 'Primecoin',
		addressVersion: '17',
		defaultCompress: true,
		donateAddress: '',
		enabled: true
		},
	'aur': {
		name: 'aur',
		fullName: 'Auroracoin',
		addressVersion: '17',
		defaultCompress: true,
		donateAddress: '',
		enabled: true
		},
	'vtc': {
		name: 'vtc',
		fullName: 'Vertcoin',
		addressVersion: '47',
		defaultCompress: true,
		donateAddress: '',
		enabled: true
		},
	'mint': {
		name: 'mint',
		fullName: 'Mintcoin',
		addressVersion: '33',
		defaultCompress: true,
		donateAddress: '',
		enabled: true
		},
	'xcp': {
		name: 'xcp',
		fullName: 'Counterparty',
		addressVersion: '00',
		defaultCompress: true,
		donateAddress: '',
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
	

//Log(FigureOutCoinPrefix('', ''));

function FigureOutCoinPrefix(PrivateKeyWIF, Address)
	{
	var Out = '';
	
	for (var i = 0; i < 256; i++)
		{
		var Prefix = (i).toString(16);
		
		if (Prefix.length == 1)
			Prefix = "0" + Prefix;
			
		OverrideAddressPrefix = Prefix;
		
		var TestAddress = GetAddressFromKeyWIF('btc', PrivateKeyWIF, false);
		var TestAddress2 = GetAddressFromKeyWIF('btc', PrivateKeyWIF, true);
		
		OverrideAddressPrefix = undefined;
		
		if (TestAddress == Address || TestAddress2 == Address)
			{
			Out += 'Coin Version Prefix (HEX): ' + Prefix + (TestAddress2 == Address ? ' Compressed' : '') + '\r\n';
			return Out;
			}
		}
	
	return Out;
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

function Log(Text)
	{
	if (true) // LOG?
		console.log(Text);
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

	//Log("Public Key: " + PublicKeyHex);
	
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
	


function GetAddressFromKeyWIF(CoinType, PrivateKeyWIF, Compressed)
	{
	return GetAddressFromKeyHex(CoinType, PrivateKeyWIFToHex(PrivateKeyWIF), Compressed);
	}

	
function GetAddressFromKeyHex(CoinType, PrivateKeyHex, Compressed)
	{
	return GetAddressFromKey(CoinType, Crypto.util.hexToBytes(PrivateKeyHex), Compressed);
	}
	
function GetAddressFromKey(CoinType, PrivateKeyBytes, Compressed)
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
	
	//Log("Key Hash160: " + KeyHash160);
			
	var version = Crypto.util.hexToBytes(GetAddressPrefixHex(CoinType));
	var KeyHash160Bytes = Crypto.util.hexToBytes(KeyHash160);
	KeyHash160Bytes.unshift(version);
	
	$('#public-key-hash160').val(Crypto.util.bytesToHex(KeyHash160Bytes));
	
	var CheckSum = GetCheckSum(KeyHash160Bytes);
	
	$('#public-key-address-checksum').val(CheckSum);
	
	//Log("CheckSum: " + CheckSum);
	
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
	
	//Log("Private Key SHA 1: " + PrivateKeyHexHash);
	
	PrivateKeyHexHash = Crypto.SHA256(Crypto.util.hexToBytes(PrivateKeyHexHash));
	
	//Log("Private Key SHA 2: " + PrivateKeyHexHash);
	
	var CheckSum = PrivateKeyHexHash.substr(0, 8);
	
	$('#private-key-checksum').val(CheckSum);
	
	PrivateKeyHexExt = PrivateKeyHexExt + CheckSum;
	
	var PrivateKeyBase58 =  Bitcoin.Base58.encode(Crypto.util.hexToBytes(PrivateKeyHexExt));
	
	return PrivateKeyBase58;
	/*
	if (UseCompression)
		{
		var PrivKeyBytesCompressed = Crypto.util.hexToBytes(PrivKeyHex);
		PrivKeyBytesCompressed.push(0x01);
		
		var privateKeyWIFCompressed = new Bitcoin.Address(PrivKeyBytesCompressed);
		privateKeyWIFCompressed.version = 0x80;
		privateKeyWIFCompressed = privateKeyWIFCompressed.toString();
		
		PrivKeyWIF = privateKeyWIFCompressed;
		}
	else
		{
		PrivKeyWIF = new Bitcoin.Address(Crypto.util.hexToBytes(PrivKeyHex));
		PrivKeyWIF.version = 0x80; //0x80 = 128, https://en.bitcoin.it/wiki/List_of_address_prefixes
		PrivKeyWIF = PrivKeyWIF.toString();
		}
	*/
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
	
	
/* NXT Address Generation - Convert from Java to JavaScript

//12237344381764262326
Log(GetNXTAccountIdFromSecret('a'));


function StringToUnicodeBytes(str)
	{
	var bytes = [];

	for (var i = 0; i < str.length; ++i)
		{
		bytes.push(str.charCodeAt(i));
		}

	return bytes;
	}
	
function StringToUTF8Bytes(str)
	{
	var utf8 = [];
	for (var i=0; i < str.length; i++)
		{
		var charcode = str.charCodeAt(i);
		if (charcode < 0x80) utf8.push(charcode);
		else if (charcode < 0x800)
			{
			utf8.push(0xc0 | (charcode >> 6), 
					  0x80 | (charcode & 0x3f));
			}
		else if (charcode < 0xd800 || charcode >= 0xe000)
			{
			utf8.push(0xe0 | (charcode >> 12), 
					  0x80 | ((charcode>>6) & 0x3f), 
					  0x80 | (charcode & 0x3f));
			}
		// surrogate pair
		else
			{
			i++;
			// UTF-16 encodes 0x10000-0x10FFFF by
			// subtracting 0x10000 and splitting the
			// 20 bits of 0x0-0xFFFFF into two halves
			charcode = 0x10000 + (((charcode & 0x3ff)<<10)
					  | (str.charCodeAt(i) & 0x3ff))
			utf8.push(0xf0 | (charcode >>18), 
					  0x80 | ((charcode>>12) & 0x3f), 
					  0x80 | ((charcode>>6) & 0x3f), 
					  0x80 | (charcode & 0x3f));
			}
		}
	return utf8;
	}
	
function stringToUint(string) {
	charList = string.split('');
	uintArray = [];
for (var i = 0; i < charList.length; i++) {
	uintArray.push(charList[i].charCodeAt(0));
}
	Log(uintArray);
return new Uint8Array(uintArray);
}

function GetNXTAccountIdFromSecret(NXTSecretPhrase)
	{
	var PublicKeyBytes = GetNXTPublicKey(NXTSecretPhrase);
	
	return GetNXTAccountId(PublicKeyBytes)
	}
	
function UByteShift(Bytes)
	{
	var BytesOut = [];

	for (var i = 0; i < Bytes.length; i++)
		{
		var a = Bytes[i];
		
		if (a >= 128)
			a -= 256;
			
		BytesOut.push(a);
		}

	return BytesOut;	
	}
	
function GetNXTPublicKey(NXTSecretPhrase)
	{
	var SecretBytes = StringToUTF8Bytes(NXTSecretPhrase)
	
	var shaObj = new jsSHA(NXTSecretPhrase, "ASCII");
	var test = bi2bytes(hex2bi(shaObj.getHash("SHA-256", "HEX")), 32).reverse();
	  
	Log(test);
	Log(UByteShift(test));
	
	var SHABytes = Crypto.SHA256(SecretBytes, { asBytes: true });
	var SHABytesShift = UByteShift(SHABytes);
	
	var Curve = curve25519(bi(Crypto.util.bytesToHex(SHABytesShift)));
	var PublicKey = ed25519_publickey(Curve);
	var PublicKeyShift = UByteShift(PublicKey);
	
	Log(NXTSecretPhrase);
	Log(SecretBytes);
	Log(SHABytes);
	Log(SHABytesShift);
	Log(Curve);
	Log('pk ' + PublicKey);
	Log('pkshift ' + PublicKeyShift);
	
	return PublicKeyShift;
	}
function GetNXTAccountId(PublicKeyBytes)
	{		
	var publicKeyHash = Crypto.SHA256(Crypto.util.bytesToHex(PublicKeyBytes), {asBytes: true});
	Log(publicKeyHash);
	var publicKeyHashReverse = [ publicKeyHash[7], 
		publicKeyHash[6], publicKeyHash[5], publicKeyHash[4], 
		publicKeyHash[3], publicKeyHash[2], publicKeyHash[1], 
		publicKeyHash[0]];
	Log(publicKeyHashReverse);
	
	var bigInteger = bi(publicKeyHashReverse);
	
	return bigInteger.longValue();
	}

*/

/*
// Find Curve25519 JavaScript implementation

static byte[] GetNXTPublicKey(NXTSecretPhrase)
	{		
	byte[] PublicKey = new byte[32];
	Curve25519.keygen(publicKey, null, MessageDigest.getInstance("SHA-256").digest(secretPhrase.getBytes("UTF-8")));
	
	return publicKey;
	}
	
static long getId(byte[] publicKey) throws Exception
	{		
	byte[] publicKeyHash = MessageDigest.getInstance("SHA-256").digest(publicKey);
	BigInteger bigInteger = new BigInteger(1, new byte[] {publicKeyHash[7], publicKeyHash[6], publicKeyHash[5], publicKeyHash[4], publicKeyHash[3], publicKeyHash[2], publicKeyHash[1], publicKeyHash[0]});
	return bigInteger.longValue();
	}
	
*/
