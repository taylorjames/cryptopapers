
var MissingPrivKeyError = 'Error: Private key cannot be empty';
var InvalidAddressVersionError = 'Error: Address version must be from 0 to 255.';
var InvalidPrivateKeyError = 'Error: Invalid private key';
var BadWIFChecksumError = 'Error: Invalid WIF checksum';
var AddressVersionMismatchError = 'Error: WIF Address version did not match supplied version';
var CompressionMismatchError = 'Error: WIF Compression status did not match';

window.Omnicoin = {}

Omnicoin.ECKey = (function()
{
	var ECDSA = Bitcoin.ECDSA;
	var ecparams = getSECCurveByName("secp256k1");
	var rng = new SecureRandom();

	var ECKey = function(input, version, compressed)
		{
			if (input == undefined || input == '')
				throw MissingPrivKeyError;
				
			if (version < 0 || version > 255)
				throw InvalidAddressVersionError;
			
			if (version != undefined)
				this.version = version;
			else
				this.version = 0x00;
			
			if (input instanceof BigInteger)
			{
				// Version must be supplied.
				this.version = version;
				
				// Input is a private key value
				this.priv = input;
			}
			else if (Bitcoin.Util.isArray(input))
			{
				// Version must be supplied.
				this.version = version;
				
				// Prepend zero byte to prevent interpretation as negative integer
				this.priv = BigInteger.fromByteArrayUnsigned(input);
			}
			else if ("string" == typeof input)
			{
				if (input.length == 64)
				{
					if (!IsHex(input))
						throw InvalidPrivateKeyError;
					
					// Version must be supplied.
					// 32 hex bytes
					input = Crypto.util.hexToBytes(input);
					this.priv = BigInteger.fromByteArrayUnsigned(input);
				}
				else
				{
					// Detects compression based on the size of the WIF.
					if (input.length == 50 || input.length == 51)
						{
						if (compressed == undefined)
							compressed = false;
						else if (compressed != false)
							throw CompressionMismatchError;
						}
					else if (input.length == 52)
						{
						if (compressed == undefined)
							compressed = true;
						else if (compressed != true)
							throw CompressionMismatchError;
						}
					else
						{
						throw InvalidPrivateKeyError;
						}
						
					this.priv = BigInteger.fromByteArrayUnsigned(Omnicoin.ECKey.decodeString(input, version));
					
					// Version is taken from key
					this.version = Omnicoin.ECKey.getVersion(input);
				}
			}
			else
			{
			throw InvalidPrivateKeyError;
			}
			
			this.setCompressed(compressed);
		};

	/**
	 * Whether public keys should be returned compressed by default.
	 */
	ECKey.compressByDefault = false;

	/**
	 * Set whether the public key should be returned compressed or not.
	 */
	ECKey.prototype.setCompressed = function(v)
	{
		this.compressed = !! v;
	};

	/**
	 * Return public key in DER encoding.
	 */
	ECKey.prototype.getPub = function()
	{
		return this.getPubPoint().getEncoded(this.compressed);
	};

	/**
	 * Return public point as ECPoint object.
	 */
	ECKey.prototype.getPubPoint = function()
	{
		if (!this.pub) this.pub = ecparams.getG().multiply(this.priv);

		return this.pub;
	};

	/**
	 * Get the pubKeyHash for this key.
	 *
	 * This is calculated as RIPE160(SHA256([encoded pubkey])) and returned as
	 * a byte array.
	 */
	ECKey.prototype.getPubKeyHash = function()
	{
		if (this.pubKeyHash) return this.pubKeyHash;

		return this.pubKeyHash = Bitcoin.Util.sha256ripe160(this.getPub());
	};

	ECKey.prototype.getOmnicoinAddress = function()
	{
		var hash = this.getPubKeyHash();
		var addr = new Omnicoin.Address(hash, this.version);
		return addr;
	};

	ECKey.prototype.getExportedPrivateKey = function()
	{
		var hash = this.priv.toByteArrayUnsigned();
		
		while (hash.length < 32) hash.unshift(0);
		
		if (this.compressed)
			{
			hash.push(0x01);
			}			
		
		hash.unshift(ECKey.versionShiftUp(this.version));
		
		
		var checksum = Crypto.SHA256(Crypto.SHA256(hash, {
			asBytes: true
		}), {
			asBytes: true
		});
		var bytes = hash.concat(checksum.slice(0, 4));
		return Bitcoin.Base58.encode(bytes);
	};

	ECKey.prototype.setPub = function(pub)
	{
		this.pub = ECPointFp.decodeFrom(ecparams.getCurve(), pub);
	};

	ECKey.prototype.toString = function(format)
	{
		if (format === "base64")
		{
			var privKey = this.priv.toByteArrayUnsigned();
			while (privKey.length < 32) privKey.unshift(0);
			privKey = Crypto.util.bytesToBase64(privKey);
			
			return privKey;
		}
		else
		{
			var privKey = this.priv.toByteArrayUnsigned();
			while (privKey.length < 32) privKey.unshift(0);
			privKey = Crypto.util.bytesToHex(privKey);
		
			return privKey;
		}
	};

	ECKey.prototype.sign = function(hash)
	{
		return ECDSA.sign(hash, this.priv);
	};

	ECKey.prototype.verify = function(hash, sig)
	{
		return ECDSA.verify(hash, sig, this.getPub());
	};
	
	ECKey.prototype.getDetails = function()
	{
		// Prepends '0's to bytes if the private key is not long enough.
		// This happens if the private key starts with any number of 0 bytes.
		var privKey = this.priv.toByteArrayUnsigned();
		while (privKey.length < 32) privKey.unshift(0);
		privKey = Crypto.util.bytesToHex(privKey);
		
		return {
			privateKey: privKey,
			privateKeyWIF: this.getExportedPrivateKey(),
			privateKeyChecksum: Crypto.util.bytesToHex(Bitcoin.Base58.decode(this.getExportedPrivateKey()).slice(28,32)),
			compressed: this.compressed,
			publicKey: Crypto.util.bytesToHex(this.getPub()),
			publicKeyHash: Crypto.util.bytesToHex(this.getPubKeyHash()),
			addressChecksum: Crypto.util.bytesToHex(Bitcoin.Base58.decode(this.getOmnicoinAddress().toString()).slice(16,20)),
			addressVersion: this.version,
			address: this.getOmnicoinAddress().toString()
			};
	};
	
	ECKey.versionShiftUp = function(version)
		{
		return ((version + 128) & 255);
		};
		
	ECKey.versionShiftDown = function(version)
		{
		if (version >= 128)
			return version - 128;
		else
			return version + 128;
		};
		
	ECKey.getVersion = function(input)
		{
		var bytes = input;
		
		if ("string" == typeof bytes)
			{
			bytes = Bitcoin.Base58.decode(bytes);
			}
		
		var versioncode = bytes.shift();
		
		return ECKey.versionShiftDown(versioncode);
		};
	
	/**
	 * Parse an exported private key contained in a string.
	 */
	ECKey.decodeString = function(string, expectedVersion)
	{
		var bytes = Bitcoin.Base58.decode(string);

		var end = bytes.length - 4;
		var hash = bytes.slice(0, end);

		var checksum = Crypto.SHA256(Crypto.SHA256(hash, {
			asBytes: true
		}), {
			asBytes: true
		});
				
		if (checksum[0] != bytes[end] || 
			checksum[1] != bytes[end+1] || 
			checksum[2] != bytes[end+2] || 
			checksum[3] != bytes[end+3])
			throw BadWIFChecksumError;

		var version = hash.shift();

		if (expectedVersion != undefined && version != ECKey.versionShiftUp(expectedVersion))
			{
			throw AddressVersionMismatchError;
			}

		hash = hash.slice(0, 32);
		
		return hash;
	};

	return ECKey;
})();