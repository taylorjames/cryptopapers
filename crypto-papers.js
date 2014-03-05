

var CoinInfo = {
	'btc': {
		name: 'btc',
		fullname: 'Bitcoin',
		addressversion: '00',
		defaultcompress: true
		},
	'ltc': {
		name: 'ltc',
		fullname: 'Litecoin',
		addressversion: '30',
		defaultcompress: true
	
		},
	'nmc': {
		name: 'nmc',
		fullname: 'Namecoin',
		addressversion: '34',
		defaultcompress: false
	
		},
	'ppc': {
		name: 'ppc',
		fullname: 'Peercoin',
		addressversion: '37',
		defaultcompress: false
	
		},
	'nxt': {
		name: 'nxt',
		fullname: 'NXT',
		addressversion: '',
		defaultcompress: true
	
		}, 
	'nem': {
		name: 'nem',
		fullname: 'NEM',
		addressversion: '',
		defaultcompress: true
	
		}, 
	'doge': {
		name: 'doge',
		fullname: 'Dogecoin',
		addressversion: '1E',
		defaultcompress: false
	
		},
	'xpm': {
		name: 'xpm',
		fullname: 'Primecoin',
		addressversion: '17',
		defaultcompress: true
	
		},
	'aur': {
		name: 'aur',
		fullname: 'Auroracoin',
		addressversion: '17',
		defaultcompress: true
	
		},
	'msc': {
		name: 'msc',
		fullname: 'Bitcoin',
		addressversion: '00',
		defaultcompress: true
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
	
	return CoinInfo[CoinType].addressversion;
	}
	
function GetDefaultCompress(CoinType)
	{
	return CoinInfo[CoinType].defaultcompress;	
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

// Find Curve25519 JavaScript implementation

function GetNXTPublicKey(NXTSecretPhrase)
	{		
	var PublicKey = new byte[32];
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
