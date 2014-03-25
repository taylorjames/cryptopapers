/*
Donation Address: 1MnKnd2t7Tfpy1Cs8bm5DraC9HzrHmHoso

Notice of Copyrights and Licenses:
***********************************
The bit2factor.org project, software and embedded resources are copyright bit2factor.org. 

The individual copyrights are included throughout the document along with their licenses.
Included JavaScript libraries are separated with HTML script tags.

Summary of JavaScript functions with a redistributable license:

JavaScript            License				INCLUDED
********************  ***************
window.Bitcoin.BIP38 		MIT License
window.Crypto.Scrypt  		MIT License
window.Bitcoin        			MIT License

JavaScript            License				NOT INCLUDED
********************  ***************
Array.prototype.map  	 	Public Domain
window.Crypto         		BSD License
window.SecureRandom   	BSD License
window.EllipticCurve  		BSD License
window.BigInteger    		 	BSD License
window.UAParser    		   MIT License

Framework             License			NOT INCLUDED
*******************   **************
Boostrap              Apache License

The bit2factor.org software is available under The MIT License (MIT)
Copyright (c) 2013 bit2factor.org

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and 
associated documentation files (the "Software"), to deal in the Software without restriction, including 
without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or 
sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject 
to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial 
portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT 
LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. 
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, 
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE 
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

GitHub Repository: https://github.com/mannkind/bit2factor.org
*/

Bitcoin.BIP38 = {
	isBIP38Format: function (a)
	{
		a = a.toString();
		return (/^6P[123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz]{56}$/.test(a) 
		|| /^3w[123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz]{62}$/.test(a))
	},
	EncryptedKeyToByteArrayAsync: function (c, q, m)
	{
		var f;
		try
		{
			f = Bitcoin.Base58.decode(c)
		}
		catch (h)
		{
			m(new Error("Invalid Private Key"));
			return
		}
		if (f.length != 43)
		{
			m(new Error("Invalid Private Key"));
			return
		}
		else
		{
			if (f[0] != 1)
			{
				m(new Error("Invalid Private Key"));
				return
			}
		}
		var j = f.slice(-4);
		f = f.slice(0, -4);
		var i = Bitcoin.Util.dsha256(f);
		if (i[0] != j[0] || i[1] != j[1] || i[2] != j[2] || i[3] != j[3])
		{
			m(new Error("Invalid Private Key"));
			return
		}
		var k = false;
		var g = false;
		var d = false;
		if (f[1] == 66)
		{
			if (f[2] == 224)
			{
				k = true
			}
			else
			{
				if (f[2] != 192)
				{
					m(new Error("Invalid Private Key"));
					return
				}
			}
		}
		else
		{
			if (f[1] == 67)
			{
				g = true;
				k = (f[2] & 32) != 0;
				d = (f[2] & 4) != 0;
				if ((f[2] & 36) != f[2])
				{
					m(new Error("Invalid Private Key"));
					return
				}
			}
			else
			{
				m(new Error("Invalid Private Key"));
				return
			}
		}
		var l;
		var p = {
			mode: new Crypto.mode.ECB(Crypto.pad.NoPadding),
			asBytes: true
		};
		var o = function ()
		{
			//var r = new Bitcoin.ECKey(l);
			//r.setCompressed(k);
			
			// Backwards compatibility for invalid BIP38 uncompressed alt-coins
			if (l[l.length-1] == 0)
				{
				for (var z = 0; z < 256; z++)
					{
					l[l.length-1] = z;
					
					var x= GetAddressFromKeyUnknown(CurrentCoinType, l, true);
					var x2 = GetAddressFromKeyUnknown(CurrentCoinType, l, false);
							
					var v = Bitcoin.Util.dsha256(x);
					var v2 = Bitcoin.Util.dsha256(x2);
					
					if (z == 125)
						{
						Log('x ' + x);
						Log('x2 ' + x2);
						Log('f ' + f);
						Log('v ' + v2);
						Log('v2 ' + v2);
						}
						
					if (v[0] != f[3] || v[1] != f[4] || v[2] != f[5] || v[3] != f[6])
						{
						if (v2[0] != f[3] || v2[1] != f[4] || v2[2] != f[5] || v2[3] != f[6])
							{
							m(new Error("Incorrect Passphrase"));
							continue;
							}
						else
							{
							k = false;
							}
						}
					else
						{
						k = true;
						}
						
					m(l, k);
					return;
					}
				}
			else
				{
				// Test both compressed an uncompressed keys.
				var e = GetAddressFromKeyUnknown(CurrentCoinType, l, true);
				var e2 = GetAddressFromKeyUnknown(CurrentCoinType, l, false); //Address; //r.getBitcoinAddress();
				
				Log(l);
				Log(e);
				Log(e2);
				
				i = Bitcoin.Util.dsha256(e);
				i2 = Bitcoin.Util.dsha256(e2);
				
					
				if (i[0] != f[3] || i[1] != f[4] || i[2] != f[5] || i[3] != f[6])
					{
					if (i2[0] != f[3] || i2[1] != f[4] || i2[2] != f[5] || i2[3] != f[6])
						{
						m(new Error("Incorrect Passphrase"));
						return
						}
					else
						{
						k = false;
						}
					}
				else
					{
					k = true;
					}
				m(l, k);
				}
		};
		if (!g)
		{
			var a = f.slice(3, 7);
			window.Crypto_scrypt(q, a, 16384, 8, 8, 64, function (s)
			{
				var r = s.slice(32, 32 + 32);
				l = Crypto.AES.decrypt(f.slice(7, 7 + 32), r, p);
				for (var e = 0; e < 32; e++)
				{
					l[e] ^= s[e]
				}
				o()
			})
		}
		else
		{
			var b = f.slice(7, 7 + 8);
			var n = !d ? b : b.slice(0, 4);
			window.Crypto_scrypt(q, n, 16384, 8, 8, 32, function (s)
			{
				var w;
				if (!d)
				{
					w = s
				}
				else
				{
					var r = s.concat(b);
					w = Bitcoin.Util.dsha256(r)
				}
				var u = new Bitcoin.ECKey(w);
				u.setCompressed(k);
				var e = u.getPub();
				var t = f.slice(23, 23 + 16);
				var v = f.slice(3, 3 + 12);
				window.Crypto_scrypt(e, v, 1024, 1, 1, 64, function (y)
				{
					var A = y.slice(32);
					var E = Crypto.AES.decrypt(t, A, p);
					for (var B = 0; B < 16; B++)
					{
						E[B] ^= y[B + 16]
					}
					var z = f.slice(15, 15 + 8).concat(E.slice(0, 0 + 8));
					var F = Crypto.AES.decrypt(z, A, p);
					for (var B = 0; B < 16; B++)
					{
						F[B] ^= y[B]
					}
					var D = F.slice(0, 0 + 16).concat(E.slice(8, 8 + 8));
					var C = Bitcoin.Util.dsha256(D);
					var x = EllipticCurve.getSECCurveByName("secp256k1");
					var G = BigInteger.fromByteArrayUnsigned(w).multiply(BigInteger.fromByteArrayUnsigned(C)).remainder(x.getN());
					l = G.toByteArrayUnsigned();
					o()
				})
			})
		}
	},
	GenerateIntermediatePointAsync: function (i, f, c, h)
	{
		var b = f === null || c === null;
		var a = new SecureRandom();
		var g, d;
		if (b)
		{
			d = g = new Array(8);
			a.nextBytes(g)
		}
		else
		{
			var d = Array(4);
			a.nextBytes(d);
			var e = BigInteger(4096 * f + c).toByteArrayUnsigned();
			var g = d.concat(e)
		}
		window.Crypto_scrypt(i, d, 16384, 8, 8, 32, function (o)
		{
			var p = b ? o : Bitcoin.Util.dsha256(o.concat(g));
			var m = BigInteger.fromByteArrayUnsigned(p);
			var l = EllipticCurve.getSECCurveByName("secp256k1");
			var j = l.getG().multiply(m).getEncoded(1);
			var k = [44, 233, 179, 225, 255, 57, 226, 81];
			if (b)
			{
				k[7] = 83
			}
			var n = k.concat(g).concat(j);
			n = n.concat(Bitcoin.Util.dsha256(n).slice(0, 4));
			h(Bitcoin.Base58.encode(n))
		})
	},
	PrivateKeyToEncryptedKeyAsync: function (a, i, c, Address, g)
	{
		
		Log(c);
		var e = null;
		if (!c) ///^5[123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz]{50}$/.test(a))
		{
			e = Bitcoin.Base58.decode(a);
			e.shift();
			e = e.slice(0, e.length - 4)
		}
		else
		{
			if (c) // /^[LK][123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz]{51}$/.test(a))
			{
				e = Bitcoin.Base58.decode(a);
				e.shift();
				e.pop();
				e = e.slice(0, e.length - 4)
			}
		}
		//var d = new Bitcoin.ECKey(e);
		//d.setCompressed(c);
		var f = Address; // d.getBitcoinAddress();
		var b = Bitcoin.Util.dsha256(f).slice(0, 4);
		var h = {
			mode: new Crypto.mode.ECB(Crypto.pad.NoPadding),
			asBytes: true
		};
		window.Crypto_scrypt(i, b, 16384, 8, 8, 64, function (m)
		{
			for (var j = 0; j < 32; ++j)
			{
				e[j] ^= m[j]
			}
			var l = c ? 224 : 192;
			var k = [1, 66, l].concat(b);
			var k = k.concat(Crypto.AES.encrypt(e, m.slice(32), h));
			k = k.concat(Bitcoin.Util.dsha256(k).slice(0, 4));
			g(Bitcoin.Base58.encode(k), f)
		})
	},
	GenerateECAddressAsync: function (h, i, p)
	{
		var n = Bitcoin.Base58.decode(h);
		var c = (n[7] === 83);
		var m = n.slice(8, 8 + 8);
		var j = n.slice(16, 16 + 33);
		var f = (i ? 32 : 0) | (c ? 0 : 4);
		var q = new Array(24);
		var b = new SecureRandom();
		b.nextBytes(q);
		var o = Bitcoin.Util.dsha256(q);
		var e = EllipticCurve.getSECCurveByName("secp256k1");
		var k = e.getCurve();
		var a = k.decodePointHex(Crypto.util.bytesToHex(j).toString().toUpperCase());
		var d = a.multiply(BigInteger.fromByteArrayUnsigned(o)).getEncoded(i);
		var l = (new Bitcoin.Address(Bitcoin.Util.sha256ripe160(d))).toString();
		var g = Bitcoin.Util.dsha256(l).slice(0, 4);
		window.Crypto_scrypt(j, g.concat(m), 1024, 1, 1, 64, function (t)
		{
			for (var v = 0; v < 16; ++v)
			{
				q[v] ^= t[v]
			}
			var D = {
				mode: new Crypto.mode.ECB(Crypto.pad.NoPadding),
				asBytes: true
			};
			var r = Crypto.AES.encrypt(q.slice(0, 16), t.slice(32), D);
			var s = r.slice(8, 8 + 8).concat(q.slice(16, 16 + 8));
			for (var v = 0; v < 16; ++v)
			{
				s[v] ^= t[v + 16]
			}
			var z = Crypto.AES.encrypt(s, t.slice(32), D);
			var u = [1, 67, f].concat(g).concat(m).concat(r.slice(0, 8)).concat(z);
			u = u.concat(Bitcoin.Util.dsha256(u).slice(0, 4));
			var y = e.getG().multiply(BigInteger.fromByteArrayUnsigned(o)).getEncoded(1);
			var x = y[0] ^ (t[63] & 1);
			for (var v = 0; v < 16; ++v)
			{
				y[v + 1] ^= t[v]
			}
			var C = Crypto.AES.encrypt(y.slice(1, 17), t.slice(32), D);
			for (var v = 16; v < 32; ++v)
			{
				y[v + 1] ^= t[v]
			}
			var A = Crypto.AES.encrypt(y.slice(17, 33), t.slice(32), D);
			var w = [x].concat(C).concat(A);
			var B = [100, 59, 246, 168, 154, f].concat(g).concat(m).concat(w);
			B = B.concat(Bitcoin.Util.dsha256(B).slice(0, 4));
			p(Bitcoin.Base58.encode(B), l, Bitcoin.Base58.encode(u))
		})
	},
	ValidateConfirmationAsync: function (i, j, h)
	{
		var k = Bitcoin.Base58.decode(i);
		var c = k[5];
		var d = k.slice(6, 10);
		var g = k.slice(10, 18);
		var f = k.slice(18, 51);
		var e = (c & 32) == 32;
		var a = (c & 4) == 4;
		var b = g.slice(0, a ? 4 : 8);
		window.Crypto_scrypt(j, b, 16384, 8, 8, 32, function (o)
		{
			var p = !a ? o : Bitcoin.Util.dsha256(o.concat(g));
			var n = BigInteger.fromByteArrayUnsigned(p);
			var r = EllipticCurve.getSECCurveByName("secp256k1");
			var q = r.getCurve();
			var l = r.getG().multiply(n).getEncoded(1);
			var m = d.concat(g);
			window.Crypto_scrypt(l, m, 1024, 1, 1, 64, function (y)
			{
				var E = {
					mode: new Crypto.mode.ECB(Crypto.pad.NoPadding),
					asBytes: true
				};
				var D = [];
				D[0] = f[0] ^ (y[63] & 1);
				decrypted1 = Crypto.AES.decrypt(f.slice(1, 17), y.slice(32), E);
				decrypted2 = Crypto.AES.decrypt(f.slice(17, 33), y.slice(32), E);
				decrypted = D.concat(decrypted1).concat(decrypted2);
				for (var C = 0; C < 32; C++)
				{
					decrypted[C + 1] ^= y[C]
				}
				var u = EllipticCurve.getSECCurveByName("secp256k1");
				var A = u.getCurve();
				var t = A.decodePointHex(Crypto.util.bytesToHex(decrypted).toString().toUpperCase());
				var v = t.multiply(BigInteger.fromByteArrayUnsigned(n)).getEncoded(e);
				var B = (new Bitcoin.Address(Bitcoin.Util.sha256ripe160(v))).toString();
				var w = Bitcoin.Util.dsha256(B).slice(0, 4);
				var s = true;
				for (var z = 0; z < 4; z++)
				{
					if (d[z] != w[z])
					{
						s = false
					}
				}
				h(s, B)
			})
		})
	}
};



Bitcoin.Util = {
	isArray: Array.isArray || function (a)
	{
		return Object.prototype.toString.call(a) === "[object Array]"
	},
	makeFilledArray: function (a, c)
	{
		var d = [];
		var b = 0;
		while (b < a)
		{
			d[b++] = c
		}
		return d
	},
	numToVarInt: function (a)
	{
		if (a < 253)
		{
			return [a]
		}
		else
		{
			if (a <= 1 << 16)
			{
				return [253, a >>> 8, a & 255]
			}
			else
			{
				if (a <= 1 << 32)
				{
					return [254].concat(Crypto.util.wordsToBytes([a]))
				}
				else
				{
					return [255].concat(Crypto.util.wordsToBytes([a >>> 32, a]))
				}
			}
		}
	},
	valueToBigInt: function (a)
	{
		if (a instanceof BigInteger)
		{
			return a
		}
		return BigInteger.fromByteArrayUnsigned(a)
	},
	formatValue: function (a)
	{
		var c = this.valueToBigInt(a).toString();
		var d = c.length > 8 ? c.substr(0, c.length - 8) : "0";
		var b = c.length > 8 ? c.substr(c.length - 8) : c;
		while (b.length < 8)
		{
			b = "0" + b
		}
		b = b.replace(/0*$/, "");
		while (b.length < 2)
		{
			b += "0"
		}
		return d + "." + b
	},
	parseValue: function (a)
	{
		var d = a.split(".");
		var e = d[0];
		var b = d[1] || "0";
		while (b.length < 8)
		{
			b += "0"
		}
		b = b.replace(/^0+/g, "");
		var c = BigInteger.valueOf(parseInt(e));
		c = c.multiply(BigInteger.valueOf(100000000));
		c = c.add(BigInteger.valueOf(parseInt(b)));
		return c
	},
	sha256ripe160: function (a)
	{
		return Crypto.RIPEMD160(Crypto.SHA256(a,
		{
			asBytes: true
		}),
		{
			asBytes: true
		})
	},
	dsha256: function (a)
	{
		return Crypto.SHA256(Crypto.SHA256(a,
		{
			asBytes: true
		}),
		{
			asBytes: true
		})
	}
};


/*
 * Crypto-JS 2.5.4 BlockModes.js
 * contribution from Simon Greatrix
 */
(function (a)
{
	var k = a.pad = {};

	function c(q, s)
	{
		var t = q._blocksize * 4;
		var r = t - s.length % t;
		return r
	}
	var d = function (r, t, x, v)
	{
		var u = t.pop();
		if (u == 0)
		{
			throw new Error("Invalid zero-length padding specified for " + x + ". Wrong cipher specification or key used?")
		}
		var w = r._blocksize * 4;
		if (u > w)
		{
			throw new Error("Invalid padding length of " + u + " specified for " + x + ". Wrong cipher specification or key used?")
		}
		for (var s = 1; s < u; s++)
		{
			var q = t.pop();
			if (v != undefined && v != q)
			{
				throw new Error("Invalid padding byte of 0x" + q.toString(16) + " specified for " + x + ". Wrong cipher specification or key used?")
			}
		}
	};
	k.NoPadding = {
		pad: function (q, r) {},
		unpad: function (q, r) {}
	};
	k.ZeroPadding = {
		pad: function (q, s)
		{
			var t = q._blocksize * 4;
			var r = s.length % t;
			if (r != 0)
			{
				for (r = t - r; r > 0; r--)
				{
					s.push(0)
				}
			}
		},
		unpad: function (q, r)
		{
			while (r[r.length - 1] == 0)
			{
				r.pop()
			}
		}
	};
	k.iso7816 = {
		pad: function (q, s)
		{
			var r = c(q, s);
			s.push(128);
			for (; r > 1; r--)
			{
				s.push(0)
			}
		},
		unpad: function (r, s)
		{
			var t;
			for (t = r._blocksize * 4; t > 0; t--)
			{
				var q = s.pop();
				if (q == 128)
				{
					return
				}
				if (q != 0)
				{
					throw new Error("ISO-7816 padding byte must be 0, not 0x" + q.toString(16) + ". Wrong cipher specification or key used?")
				}
			}
			throw new Error("ISO-7816 padded beyond cipher block size. Wrong cipher specification or key used?")
		}
	};
	k.ansix923 = {
		pad: function (q, t)
		{
			var s = c(q, t);
			for (var r = 1; r < s; r++)
			{
				t.push(0)
			}
			t.push(s)
		},
		unpad: function (q, r)
		{
			d(q, r, "ANSI X.923", 0)
		}
	};
	k.iso10126 = {
		pad: function (q, t)
		{
			var s = c(q, t);
			for (var r = 1; r < s; r++)
			{
				t.push(Math.floor(Math.random() * 256))
			}
			t.push(s)
		},
		unpad: function (q, r)
		{
			d(q, r, "ISO 10126", undefined)
		}
	};
	k.pkcs7 = {
		pad: function (q, t)
		{
			var s = c(q, t);
			for (var r = 0; r < s; r++)
			{
				t.push(s)
			}
		},
		unpad: function (q, r)
		{
			d(q, r, "PKCS 7", r[r.length - 1])
		}
	};
	var j = a.mode = {};
	var o = j.Mode = function (q)
	{
		if (q)
		{
			this._padding = q
		}
	};
	o.prototype = {
		encrypt: function (r, q, s)
		{
			this._padding.pad(r, q);
			this._doEncrypt(r, q, s)
		},
		decrypt: function (r, q, s)
		{
			this._doDecrypt(r, q, s);
			this._padding.unpad(r, q)
		},
		_padding: k.iso7816
	};
	var n = j.ECB = function ()
	{
		o.apply(this, arguments)
	};
	var h = n.prototype = new o;
	h._doEncrypt = function (r, q, s)
	{
		var u = r._blocksize * 4;
		for (var t = 0; t < q.length; t += u)
		{
			r._encryptblock(q, t)
		}
	};
	h._doDecrypt = function (q, u, r)
	{
		var t = q._blocksize * 4;
		for (var s = 0; s < u.length; s += t)
		{
			q._decryptblock(u, s)
		}
	};
	h.fixOptions = function (q)
	{
		q.iv = []
	};
	var l = j.CBC = function ()
	{
		o.apply(this, arguments)
	};
	var f = l.prototype = new o;
	f._doEncrypt = function (r, q, s)
	{
		var v = r._blocksize * 4;
		for (var u = 0; u < q.length; u += v)
		{
			if (u == 0)
			{
				for (var t = 0; t < v; t++)
				{
					q[t] ^= s[t]
				}
			}
			else
			{
				for (var t = 0; t < v; t++)
				{
					q[u + t] ^= q[u + t - v]
				}
			}
			r._encryptblock(q, u)
		}
	};
	f._doDecrypt = function (q, x, s)
	{
		var w = q._blocksize * 4;
		var u = s;
		for (var v = 0; v < x.length; v += w)
		{
			var r = x.slice(v, v + w);
			q._decryptblock(x, v);
			for (var t = 0; t < w; t++)
			{
				x[v + t] ^= u[t]
			}
			u = r
		}
	};
	var e = j.CFB = function ()
	{
		o.apply(this, arguments)
	};
	var b = e.prototype = new o;
	b._padding = k.NoPadding;
	b._doEncrypt = function (r, q, t)
	{
		var w = r._blocksize * 4,
			v = t.slice(0);
		for (var u = 0; u < q.length; u++)
		{
			var s = u % w;
			if (s == 0)
			{
				r._encryptblock(v, 0)
			}
			q[u] ^= v[s];
			v[s] = q[u]
		}
	};
	b._doDecrypt = function (r, x, t)
	{
		var w = r._blocksize * 4,
			v = t.slice(0);
		for (var u = 0; u < x.length; u++)
		{
			var s = u % w;
			if (s == 0)
			{
				r._encryptblock(v, 0)
			}
			var q = x[u];
			x[u] ^= v[s];
			v[s] = q
		}
	};
	var p = j.OFB = function ()
	{
		o.apply(this, arguments)
	};
	var i = p.prototype = new o;
	i._padding = k.NoPadding;
	i._doEncrypt = function (r, q, s)
	{
		var v = r._blocksize * 4,
			u = s.slice(0);
		for (var t = 0; t < q.length; t++)
		{
			if (t % v == 0)
			{
				r._encryptblock(u, 0)
			}
			q[t] ^= u[t % v]
		}
	};
	i._doDecrypt = i._doEncrypt;
	var m = j.CTR = function ()
	{
		o.apply(this, arguments)
	};
	var g = m.prototype = new o;
	g._padding = k.NoPadding;
	g._doEncrypt = function (r, q, u)
	{
		var x = r._blocksize * 4;
		var s = u.slice(0);
		for (var v = 0; v < q.length;)
		{
			var w = s.slice(0);
			r._encryptblock(w, 0);
			for (var t = 0; v < q.length && t < x; t++, v++)
			{
				q[v] ^= w[t]
			}
			if (++(s[x - 1]) == 256)
			{
				s[x - 1] = 0;
				if (++(s[x - 2]) == 256)
				{
					s[x - 2] = 0;
					if (++(s[x - 3]) == 256)
					{
						s[x - 3] = 0;
						++(s[x - 4])
					}
				}
			}
		}
	};
	g._doDecrypt = g._doEncrypt
})(Crypto);


/*
 * Crypto-JS v2.5.4	AES.js
 * http://code.google.com/p/crypto-js/
 * Copyright (c) 2009-2013, Jeff Mott. All rights reserved.
 * http://code.google.com/p/crypto-js/wiki/License
 */
(function ()
{
	var k = Crypto,
		a = k.util,
		t = k.charenc,
		r = t.UTF8;
	var u = [99, 124, 119, 123, 242, 107, 111, 197, 48, 1, 103, 43, 254, 215, 171, 118, 202, 130, 201, 125, 250, 89, 71, 240, 173, 212, 162, 175, 156, 164, 114, 192, 183, 253, 147, 38, 54, 63, 247, 204, 52, 165, 229, 241, 113, 216, 49, 21, 4, 199, 35, 195, 24, 150, 5, 154, 7, 18, 128, 226, 235, 39, 178, 117, 9, 131, 44, 26, 27, 110, 90, 160, 82, 59, 214, 179, 41, 227, 47, 132, 83, 209, 0, 237, 32, 252, 177, 91, 106, 203, 190, 57, 74, 76, 88, 207, 208, 239, 170, 251, 67, 77, 51, 133, 69, 249, 2, 127, 80, 60, 159, 168, 81, 163, 64, 143, 146, 157, 56, 245, 188, 182, 218, 33, 16, 255, 243, 210, 205, 12, 19, 236, 95, 151, 68, 23, 196, 167, 126, 61, 100, 93, 25, 115, 96, 129, 79, 220, 34, 42, 144, 136, 70, 238, 184, 20, 222, 94, 11, 219, 224, 50, 58, 10, 73, 6, 36, 92, 194, 211, 172, 98, 145, 149, 228, 121, 231, 200, 55, 109, 141, 213, 78, 169, 108, 86, 244, 234, 101, 122, 174, 8, 186, 120, 37, 46, 28, 166, 180, 198, 232, 221, 116, 31, 75, 189, 139, 138, 112, 62, 181, 102, 72, 3, 246, 14, 97, 53, 87, 185, 134, 193, 29, 158, 225, 248, 152, 17, 105, 217, 142, 148, 155, 30, 135, 233, 206, 85, 40, 223, 140, 161, 137, 13, 191, 230, 66, 104, 65, 153, 45, 15, 176, 84, 187, 22];
	for (var m = [], q = 0; q < 256; q++)
	{
		m[u[q]] = q
	}
	var p = [],
		o = [],
		l = [],
		h = [],
		g = [],
		e = [];

	function f(x, w)
	{
		for (var v = 0, y = 0; y < 8; y++)
		{
			if (w & 1)
			{
				v ^= x
			}
			var z = x & 128;
			x = (x << 1) & 255;
			if (z)
			{
				x ^= 27
			}
			w >>>= 1
		}
		return v
	}
	for (var q = 0; q < 256; q++)
	{
		p[q] = f(q, 2);
		o[q] = f(q, 3);
		l[q] = f(q, 9);
		h[q] = f(q, 11);
		g[q] = f(q, 13);
		e[q] = f(q, 14)
	}
	var j = [0, 1, 2, 4, 8, 16, 32, 64, 128, 27, 54];
	var c = [
		[],
		[],
		[],
		[]
	],
		d, b, s;
	var n = k.AES = {
		encrypt: function (z, y, x)
		{
			x = x ||
			{};
			var A = x.mode || new k.mode.OFB;
			if (A.fixOptions)
			{
				A.fixOptions(x)
			}
			var i = (z.constructor == String ? r.stringToBytes(z) : z),
				w = x.iv || a.randomBytes(n._blocksize * 4),
				v = (y.constructor == String ? k.PBKDF2(y, w, 32,
				{
					asBytes: true
				}) : y);
			n._init(v);
			A.encrypt(n, i, w);
			i = x.iv ? i : w.concat(i);
			return (x && x.asBytes) ? i : a.bytesToBase64(i)
		},
		decrypt: function (y, x, w)
		{
			w = w ||
			{};
			var z = w.mode || new k.mode.OFB;
			if (z.fixOptions)
			{
				z.fixOptions(w)
			}
			var A = (y.constructor == String ? a.base64ToBytes(y) : y),
				v = w.iv || A.splice(0, n._blocksize * 4),
				i = (x.constructor == String ? k.PBKDF2(x, v, 32,
				{
					asBytes: true
				}) : x);
			n._init(i);
			z.decrypt(n, A, v);
			return (w && w.asBytes) ? A : r.bytesToString(A)
		},
		_blocksize: 4,
		_encryptblock: function (v, w)
		{
			for (var C = 0; C < n._blocksize; C++)
			{
				for (var i = 0; i < 4; i++)
				{
					c[C][i] = v[w + i * 4 + C]
				}
			}
			for (var C = 0; C < 4; C++)
			{
				for (var i = 0; i < 4; i++)
				{
					c[C][i] ^= s[i][C]
				}
			}
			for (var B = 1; B < b; B++)
			{
				for (var C = 0; C < 4; C++)
				{
					for (var i = 0; i < 4; i++)
					{
						c[C][i] = u[c[C][i]]
					}
				}
				c[1].push(c[1].shift());
				c[2].push(c[2].shift());
				c[2].push(c[2].shift());
				c[3].unshift(c[3].pop());
				for (var i = 0; i < 4; i++)
				{
					var A = c[0][i],
						z = c[1][i],
						y = c[2][i],
						x = c[3][i];
					c[0][i] = p[A] ^ o[z] ^ y ^ x;
					c[1][i] = A ^ p[z] ^ o[y] ^ x;
					c[2][i] = A ^ z ^ p[y] ^ o[x];
					c[3][i] = o[A] ^ z ^ y ^ p[x]
				}
				for (var C = 0; C < 4; C++)
				{
					for (var i = 0; i < 4; i++)
					{
						c[C][i] ^= s[B * 4 + i][C]
					}
				}
			}
			for (var C = 0; C < 4; C++)
			{
				for (var i = 0; i < 4; i++)
				{
					c[C][i] = u[c[C][i]]
				}
			}
			c[1].push(c[1].shift());
			c[2].push(c[2].shift());
			c[2].push(c[2].shift());
			c[3].unshift(c[3].pop());
			for (var C = 0; C < 4; C++)
			{
				for (var i = 0; i < 4; i++)
				{
					c[C][i] ^= s[b * 4 + i][C]
				}
			}
			for (var C = 0; C < n._blocksize; C++)
			{
				for (var i = 0; i < 4; i++)
				{
					v[w + i * 4 + C] = c[C][i]
				}
			}
		},
		_decryptblock: function (w, v)
		{
			for (var C = 0; C < n._blocksize; C++)
			{
				for (var i = 0; i < 4; i++)
				{
					c[C][i] = w[v + i * 4 + C]
				}
			}
			for (var C = 0; C < 4; C++)
			{
				for (var i = 0; i < 4; i++)
				{
					c[C][i] ^= s[b * 4 + i][C]
				}
			}
			for (var B = 1; B < b; B++)
			{
				c[1].unshift(c[1].pop());
				c[2].push(c[2].shift());
				c[2].push(c[2].shift());
				c[3].push(c[3].shift());
				for (var C = 0; C < 4; C++)
				{
					for (var i = 0; i < 4; i++)
					{
						c[C][i] = m[c[C][i]]
					}
				}
				for (var C = 0; C < 4; C++)
				{
					for (var i = 0; i < 4; i++)
					{
						c[C][i] ^= s[(b - B) * 4 + i][C]
					}
				}
				for (var i = 0; i < 4; i++)
				{
					var A = c[0][i],
						z = c[1][i],
						y = c[2][i],
						x = c[3][i];
					c[0][i] = e[A] ^ h[z] ^ g[y] ^ l[x];
					c[1][i] = l[A] ^ e[z] ^ h[y] ^ g[x];
					c[2][i] = g[A] ^ l[z] ^ e[y] ^ h[x];
					c[3][i] = h[A] ^ g[z] ^ l[y] ^ e[x]
				}
			}
			c[1].unshift(c[1].pop());
			c[2].push(c[2].shift());
			c[2].push(c[2].shift());
			c[3].push(c[3].shift());
			for (var C = 0; C < 4; C++)
			{
				for (var i = 0; i < 4; i++)
				{
					c[C][i] = m[c[C][i]]
				}
			}
			for (var C = 0; C < 4; C++)
			{
				for (var i = 0; i < 4; i++)
				{
					c[C][i] ^= s[i][C]
				}
			}
			for (var C = 0; C < n._blocksize; C++)
			{
				for (var i = 0; i < 4; i++)
				{
					w[v + i * 4 + C] = c[C][i]
				}
			}
		},
		_init: function (i)
		{
			d = i.length / 4;
			b = d + 6;
			n._keyexpansion(i)
		},
		_keyexpansion: function (v)
		{
			s = [];
			for (var w = 0; w < d; w++)
			{
				s[w] = [v[w * 4], v[w * 4 + 1], v[w * 4 + 2], v[w * 4 + 3]]
			}
			for (var w = d; w < n._blocksize * (b + 1); w++)
			{
				var i = [s[w - 1][0], s[w - 1][1], s[w - 1][2], s[w - 1][3]];
				if (w % d == 0)
				{
					i.push(i.shift());
					i[0] = u[i[0]];
					i[1] = u[i[1]];
					i[2] = u[i[2]];
					i[3] = u[i[3]];
					i[0] ^= j[w / d]
				}
				else
				{
					if (d > 6 && w % d == 4)
					{
						i[0] = u[i[0]];
						i[1] = u[i[1]];
						i[2] = u[i[2]];
						i[3] = u[i[3]]
					}
				}
				s[w] = [s[w - d][0] ^ i[0], s[w - d][1] ^ i[1], s[w - d][2] ^ i[2], s[w - d][3] ^ i[3]]
			}
		}
	}
})();

