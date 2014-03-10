 /*
 
 Functions in development,  used for testing or miscellaneous things
 
 
 */
 
 
 
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

 
var Vanity = '';
var VanityCaseSensitive = true;

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
	
function XORBytes(a, b)
	{
	var c = new Array();
	
	for (var i = 0; i < a.length; i++)
		{
		c[i] = (a[i] + b[i]) & 255;
		}
		
	return c;
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
