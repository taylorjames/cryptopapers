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


function GetSplitAddressAddFromPrivKeys(CoinType, PrivKey1, PrivKey2)
	{
	var PubKey1 = GetPublicKey(PrivKey1);
	var PubKey2 = GetPublicKey(PrivKey2);
	
	return GetSplitAddressAddFromPubKeys(CoinType, PubKey1, PubKey2)
	}
	
function GetSplitAddressAddFromPrivPubKey(CoinType, PrivKey1, PubKey2)
	{
	var PubKey1 = GetPublicKey(PrivKey1);
	
	return GetSplitAddressAddFromPubKeys(CoinType, PubKey1, PubKey2)
	}
	
	
function GetSplitAddressAddFromPubKeys(CoinType, PubKey1, PubKey2)
	{
	var PubKeyJoined = CurveAdd(PubKey1, PubKey2);
	var PubKeyJoined = Crypto.util.bytesToHex(PubKeyJoined);
	Log(PubKeyJoined);
	
	var Address = GetAddress(CoinType, PubKeyJoined);
	Log(Address);
	
	return [PubKeyJoined, Address];
	}
	
// What is the purpose of this?
function GetSplitAddressMultiplyFromPrivKeys(CoinType, PrivKey1, PrivKey2)
	{
	}
	

// bitaddress.org stolen vanity wallet code- for Split Keys


/*
ninja.wallets.vanitywallet = {
	open: function () {
		document.getElementById("vanityarea").style.display = "block";
	},

	close: function () {
		document.getElementById("vanityarea").style.display = "none";
		document.getElementById("vanitystep1area").style.display = "none";
		document.getElementById("vanitystep2area").style.display = "none";
		document.getElementById("vanitystep1icon").setAttribute("class", "more");
		document.getElementById("vanitystep2icon").setAttribute("class", "more");
	},

	generateKeyPair: function () {
		var key = new Bitcoin.ECKey(false);
		var publicKey = key.getPubKeyHex();
		var privateKey = key.getBitcoinHexFormat();
		document.getElementById("vanitypubkey").innerHTML = publicKey;
		document.getElementById("vanityprivatekey").innerHTML = privateKey;
		document.getElementById("vanityarea").style.display = "block";
		document.getElementById("vanitystep1area").style.display = "none";
	},

	addKeys: function () {
		var privateKeyWif = ninja.translator.get("vanityinvalidinputcouldnotcombinekeys");
		var bitcoinAddress = ninja.translator.get("vanityinvalidinputcouldnotcombinekeys");
		var publicKeyHex = ninja.translator.get("vanityinvalidinputcouldnotcombinekeys");
		try {
			var input1KeyString = document.getElementById("vanityinput1").value;
			var input2KeyString = document.getElementById("vanityinput2").value;

			// both inputs are public keys
			if (ninja.publicKey.isPublicKeyHexFormat(input1KeyString) && ninja.publicKey.isPublicKeyHexFormat(input2KeyString)) {
				// add both public keys together
				if (document.getElementById("vanityradioadd").checked) {
					var pubKeyByteArray = ninja.publicKey.getByteArrayFromAdding(input1KeyString, input2KeyString);
					if (pubKeyByteArray == null) {
						alert(ninja.translator.get("vanityalertinvalidinputpublickeysmatch"));
					}
					else {
						privateKeyWif = ninja.translator.get("vanityprivatekeyonlyavailable");
						bitcoinAddress = ninja.publicKey.getBitcoinAddressFromByteArray(pubKeyByteArray);
						publicKeyHex = ninja.publicKey.getHexFromByteArray(pubKeyByteArray);
					}
				}
				else {
					alert(ninja.translator.get("vanityalertinvalidinputcannotmultiple"));
				}
			}
			// one public key and one private key
			else if ((ninja.publicKey.isPublicKeyHexFormat(input1KeyString) && ninja.privateKey.isPrivateKey(input2KeyString))
							|| (ninja.publicKey.isPublicKeyHexFormat(input2KeyString) && ninja.privateKey.isPrivateKey(input1KeyString))
						) {
				privateKeyWif = ninja.translator.get("vanityprivatekeyonlyavailable");
				var pubKeyHex = (ninja.publicKey.isPublicKeyHexFormat(input1KeyString)) ? input1KeyString : input2KeyString;
				var ecKey = (ninja.privateKey.isPrivateKey(input1KeyString)) ? new Bitcoin.ECKey(input1KeyString) : new Bitcoin.ECKey(input2KeyString);
				// add 
				if (document.getElementById("vanityradioadd").checked) {
					var pubKeyCombined = ninja.publicKey.getByteArrayFromAdding(pubKeyHex, ecKey.getPubKeyHex());
				}
				// multiply
				else {
					var pubKeyCombined = ninja.publicKey.getByteArrayFromMultiplying(pubKeyHex, ecKey);
				}
				if (pubKeyCombined == null) {
					alert(ninja.translator.get("vanityalertinvalidinputpublickeysmatch"));
				} else {
					bitcoinAddress = ninja.publicKey.getBitcoinAddressFromByteArray(pubKeyCombined);
					publicKeyHex = ninja.publicKey.getHexFromByteArray(pubKeyCombined);
				}
			}
			// both inputs are private keys
			else if (ninja.privateKey.isPrivateKey(input1KeyString) && ninja.privateKey.isPrivateKey(input2KeyString)) {
				var combinedPrivateKey;
				// add both private keys together
				if (document.getElementById("vanityradioadd").checked) {
					combinedPrivateKey = ninja.privateKey.getECKeyFromAdding(input1KeyString, input2KeyString);
				}
				// multiply both private keys together
				else {
					combinedPrivateKey = ninja.privateKey.getECKeyFromMultiplying(input1KeyString, input2KeyString);
				}
				if (combinedPrivateKey == null) {
					alert(ninja.translator.get("vanityalertinvalidinputprivatekeysmatch"));
				}
				else {
					bitcoinAddress = combinedPrivateKey.getBitcoinAddress();
					privateKeyWif = combinedPrivateKey.getBitcoinWalletImportFormat();
					publicKeyHex = combinedPrivateKey.getPubKeyHex();
				}
			}
		} catch (e) {
			alert(e);
		}
		document.getElementById("vanityprivatekeywif").innerHTML = privateKeyWif;
		document.getElementById("vanityaddress").innerHTML = bitcoinAddress;
		document.getElementById("vanitypublickeyhex").innerHTML = publicKeyHex;
		document.getElementById("vanitystep2area").style.display = "block";
		document.getElementById("vanitystep2icon").setAttribute("class", "less");
	},

	openCloseStep: function (num) {
		// do close
		if (document.getElementById("vanitystep" + num + "area").style.display == "block") {
			document.getElementById("vanitystep" + num + "area").style.display = "none";
			document.getElementById("vanitystep" + num + "icon").setAttribute("class", "more");
		}
		// do open
		else {
			document.getElementById("vanitystep" + num + "area").style.display = "block";
			document.getElementById("vanitystep" + num + "icon").setAttribute("class", "less");
		}
	}
};
*/
