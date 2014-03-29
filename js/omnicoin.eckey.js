window.Omnicoin = {}

Omnicoin.ECKey = (function()
{
	var ECDSA = Bitcoin.ECDSA;
	var ecparams = getSECCurveByName("secp256k1");
	var rng = new SecureRandom();

	var ECKey = function(input, version, compressed)
		{
			this.version = version ? version : 0x00;
			
			if (!input)
			{
				// Generate new key
				var n = ecparams.getN();
				this.priv = ECDSA.getBigRandom(n);
			}
			else if (input instanceof BigInteger)
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
					// Version must be supplied.
					// 32 hex bytes
					input = Crypto.util.hexToBytes(input);
					this.priv = BigInteger.fromByteArrayUnsigned(input);
				}
				else
				{
					// Version taken from key
					this.version = Omnicoin.ECKey.getVersion(input);
					
				//	if (input.length == 51 && input[0] == '5')
				//	{
						// Base58 encoded private key
						this.priv = BigInteger.fromByteArrayUnsigned(Omnicoin.ECKey.decodeString(input));
				//	}
				//	else
				//	{
						// Prepend zero byte to prevent interpretation as negative integer
				//		this.priv = BigInteger.fromByteArrayUnsigned(Crypto.util.base64ToBytes(input));
				//	}
				}
			}
			Log(this.priv);
			this.compressed = compressed != undefined ? compressed : !! ECKey.compressByDefault;
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
		
		hash.unshift((this.version + 128) & 255);
		
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
			return Crypto.util.bytesToBase64(this.priv.toByteArrayUnsigned());
		}
		else
		{
			return Crypto.util.bytesToHex(this.priv.toByteArrayUnsigned());
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
		return {
			privateKey: Crypto.util.bytesToHex(this.priv.toByteArrayUnsigned()),
			privateKeyWIF: this.getExportedPrivateKey(),
			privateKeyChecksum: Crypto.util.bytesToHex(Bitcoin.Base58.decode(this.getExportedPrivateKey()).slice(28,32)),
			compressed: this.compressed,
			publicKey: Crypto.util.bytesToHex(this.getPub()),
			publicKeyHash: Crypto.util.bytesToHex(this.getPubKeyHash()),
			addressChecksum: Crypto.util.bytesToHex(Bitcoin.Base58.decode(this.getOmnicoinAddress().toString()).slice(16,20)),
			address: this.getOmnicoinAddress().toString()
			}
	};

	ECKey.getVersion = function(input)
		{
		var bytes = input;
		
		if ("string" == typeof bytes)
			{
			bytes = Bitcoin.Base58.decode(bytes);
			}
		
		return bytes.shift() - 128;
		};
	
	/**
	 * Parse an exported private key contained in a string.
	 */
	ECKey.decodeString = function(string)
	{
		var bytes = Bitcoin.Base58.decode(string);

		var end = bytes.length - 4;
		var hash = bytes.slice(0, end);

		var checksum = Crypto.SHA256(Crypto.SHA256(hash, {
			asBytes: true
		}), {
			asBytes: true
		});
		
		Log(Crypto.util.bytesToHex(checksum.slice(0,4)));
		Log(Crypto.util.bytesToHex(bytes));
		
		if (checksum[0] != bytes[end] || 
		checksum[1] != bytes[end+1] || 
		checksum[2] != bytes[end+2] || 
		checksum[3] != bytes[end+3])
		{
			throw "Checksum validation failed!";
		}

		var version = hash.shift();

		if (version != 0x80)
		{
//			throw "Version " + version + " not supported!";
		}

		hash = hash.slice(0, 32);
		
		return hash;
	};

	return ECKey;
})();