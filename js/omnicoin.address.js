


Omnicoin.Address = function(bytes, version)
{
	
	if ("string" == typeof bytes)
	{	// version is included with address string
		this.version = Omnicoin.Address.getVersion(bytes);
		bytes = Omnicoin.Address.decodeString(bytes);
	}
	else
	{
		// otherwise the version must be supplied or defaults to 0x00
		this.version = version ? version : 0x00;
	}
	
	this.hash = bytes;	
};

/**
 * Serialize this object as a standard Omnicoin address.
 *
 * Returns the address as a base58-encoded string in the standardized format.
 */
Omnicoin.Address.prototype.toString = function()
{
	// Get a copy of the hash
	var hash = this.hash.slice(0);

	// Version
	hash.unshift(this.version);

	var checksum = Crypto.SHA256(Crypto.SHA256(hash, {
		asBytes: true
	}), {
		asBytes: true
	});

	var bytes = hash.concat(checksum.slice(0, 4));

	return Bitcoin.Base58.encode(bytes);
};

Omnicoin.Address.prototype.getHashBase64 = function()
{
	return Crypto.util.bytesToBase64(this.hash);
};

Omnicoin.Address.getVersion = function(input) 
{
	var bytes = input;
	
	if ("string" == typeof bytes)
		{
		bytes = Bitcoin.Base58.decode(bytes);
		}
	
	return bytes.shift();
};

/**
 * Parse a Omnicoin address contained in a string.
 */
Omnicoin.Address.decodeString = function(string)
{
	var bytes = Bitcoin.Base58.decode(string);

	var hash = bytes.slice(0, 21);

	var checksum = Crypto.SHA256(Crypto.SHA256(hash, {
		asBytes: true
	}), {
		asBytes: true
	});

	if (checksum[0] != bytes[21] || checksum[1] != bytes[22] || checksum[2] != bytes[23] || checksum[3] != bytes[24])
	{
		throw "Checksum validation failed!";
	}

	var version = hash.shift();
	
	if (version != 0)
	{
//		throw "Version " + version + " not supported!";
	}

	return hash;
};

