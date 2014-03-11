(function ()
{
	var b = 2147483647;
	var a = null;
	window.Crypto_scrypt = function (h, m, o, d, g, u, s)
	{
		if (o == 0 || (o & (o - 1)) != 0)
		{
			throw Error("N must be > 0 and a power of 2")
		}
		if (o > b / 128 / d)
		{
			throw Error("Parameter N is too large")
		}
		if (d > b / 128 / g)
		{
			throw Error("Parameter r is too large")
		}
		var k = {
			iterations: 1,
			hasher: Crypto.SHA256,
			asBytes: true
		};
		var f = Crypto.PBKDF2(h, m, g * 128 * d, k);
		try
		{
			var l = 0;
			var t = 0;
			var q = function ()
			{
				if (!a)
				{
					var p = "(" + j.toString() + ")()";
					var i;
					try
					{
						i = new Blob([p],
						{
							type: "text/javascript"
						})
					}
					catch (r)
					{
						window.BlobBuilder = window.BlobBuilder || window.WebKitBlobBuilder || window.MozBlobBuilder || window.MSBlobBuilder;
						i = new BlobBuilder();
						i.append(p);
						i = i.getBlob("text/javascript")
					}
					a = URL.createObjectURL(i)
				}
				var v = new Worker(a);
				v.onmessage = function (z)
				{
					var w = z.data[0],
						A = z.data[1];
					t++;
					if (l < g)
					{
						v.postMessage([o, d, g, f, l++])
					}
					var y = A.length,
						e = w * 128 * d,
						x = 0;
					while (y--)
					{
						f[e++] = A[x++]
					}
					if (t == g)
					{
						s(Crypto.PBKDF2(h, f, u, k))
					}
				};
				return v
			};
			var c = [q(), q()];
			c[0].postMessage([o, d, g, f, l++]);
			if (g > 1)
			{
				c[1].postMessage([o, d, g, f, l++])
			}
		}
		catch (n)
		{
			window.setTimeout(function ()
			{
				j();
				s(Crypto.PBKDF2(h, f, u, k))
			}, 0)
		}

		function j()
		{
			var w = [],
				e = [];
			y(new Array(32));
			if (typeof f === "undefined")
			{
				onmessage = function (F)
				{
					var G = F.data;
					var J = G[0],
						E = G[1],
						H = G[2],
						K = G[3],
						D = G[4];
					var I = [];
					z(K, D * 128 * E, I, 0, 128 * E);
					B(I, 0, E, J, e, w);
					postMessage([D, I])
				}
			}
			else
			{
				for (var v = 0; v < g; v++)
				{
					B(f, v * 128 * d, d, o, e, w)
				}
			}

			function B(E, J, D, L, F, K)
			{
				var M = 0;
				var I = 128 * D;
				var H;
				z(E, J, K, M, I);
				for (H = 0; H < L; H++)
				{
					z(K, M, F, H * I, I);
					p(K, M, I, D)
				}
				for (H = 0; H < L; H++)
				{
					var G = A(K, M, D) & (L - 1);
					C(F, G * I, K, M, I);
					p(K, M, I, D)
				}
				z(K, M, E, J, I)
			}

			function p(H, E, G, F)
			{
				var I = [];
				var D;
				z(H, E + (2 * F - 1) * 64, I, 0, 64);
				for (D = 0; D < 2 * F; D++)
				{
					C(H, D * 64, I, 0, 64);
					y(I);
					z(I, 0, H, G + (D * 64), 64)
				}
				for (D = 0; D < F; D++)
				{
					z(H, G + (D * 2) * 64, H, E + (D * 64), 64)
				}
				for (D = 0; D < F; D++)
				{
					z(H, G + (D * 2 + 1) * 64, H, E + (D + F) * 64, 64)
				}
			}

			function r(D, i)
			{
				return (D << i) | (D >>> (32 - i))
			}

			function y(H)
			{
				var G = new Array(32);
				var D = new Array(32);
				var F;
				for (F = 0; F < 16; F++)
				{
					G[F] = (H[F * 4 + 0] & 255) << 0;
					G[F] |= (H[F * 4 + 1] & 255) << 8;
					G[F] |= (H[F * 4 + 2] & 255) << 16;
					G[F] |= (H[F * 4 + 3] & 255) << 24
				}
				x(G, 0, D, 0, 16);
				for (F = 8; F > 0; F -= 2)
				{
					D[4] ^= r(D[0] + D[12], 7);
					D[8] ^= r(D[4] + D[0], 9);
					D[12] ^= r(D[8] + D[4], 13);
					D[0] ^= r(D[12] + D[8], 18);
					D[9] ^= r(D[5] + D[1], 7);
					D[13] ^= r(D[9] + D[5], 9);
					D[1] ^= r(D[13] + D[9], 13);
					D[5] ^= r(D[1] + D[13], 18);
					D[14] ^= r(D[10] + D[6], 7);
					D[2] ^= r(D[14] + D[10], 9);
					D[6] ^= r(D[2] + D[14], 13);
					D[10] ^= r(D[6] + D[2], 18);
					D[3] ^= r(D[15] + D[11], 7);
					D[7] ^= r(D[3] + D[15], 9);
					D[11] ^= r(D[7] + D[3], 13);
					D[15] ^= r(D[11] + D[7], 18);
					D[1] ^= r(D[0] + D[3], 7);
					D[2] ^= r(D[1] + D[0], 9);
					D[3] ^= r(D[2] + D[1], 13);
					D[0] ^= r(D[3] + D[2], 18);
					D[6] ^= r(D[5] + D[4], 7);
					D[7] ^= r(D[6] + D[5], 9);
					D[4] ^= r(D[7] + D[6], 13);
					D[5] ^= r(D[4] + D[7], 18);
					D[11] ^= r(D[10] + D[9], 7);
					D[8] ^= r(D[11] + D[10], 9);
					D[9] ^= r(D[8] + D[11], 13);
					D[10] ^= r(D[9] + D[8], 18);
					D[12] ^= r(D[15] + D[14], 7);
					D[13] ^= r(D[12] + D[15], 9);
					D[14] ^= r(D[13] + D[12], 13);
					D[15] ^= r(D[14] + D[13], 18)
				}
				for (F = 0; F < 16; ++F)
				{
					G[F] = D[F] + G[F]
				}
				for (F = 0; F < 16; F++)
				{
					var E = F * 4;
					H[E + 0] = (G[F] >> 0 & 255);
					H[E + 1] = (G[F] >> 8 & 255);
					H[E + 2] = (G[F] >> 16 & 255);
					H[E + 3] = (G[F] >> 24 & 255)
				}
			}

			function C(G, H, J, I, E)
			{
				var F = E >> 6;
				while (F--)
				{
					J[I++] ^= G[H++];
					J[I++] ^= G[H++];
					J[I++] ^= G[H++];
					J[I++] ^= G[H++];
					J[I++] ^= G[H++];
					J[I++] ^= G[H++];
					J[I++] ^= G[H++];
					J[I++] ^= G[H++];
					J[I++] ^= G[H++];
					J[I++] ^= G[H++];
					J[I++] ^= G[H++];
					J[I++] ^= G[H++];
					J[I++] ^= G[H++];
					J[I++] ^= G[H++];
					J[I++] ^= G[H++];
					J[I++] ^= G[H++];
					J[I++] ^= G[H++];
					J[I++] ^= G[H++];
					J[I++] ^= G[H++];
					J[I++] ^= G[H++];
					J[I++] ^= G[H++];
					J[I++] ^= G[H++];
					J[I++] ^= G[H++];
					J[I++] ^= G[H++];
					J[I++] ^= G[H++];
					J[I++] ^= G[H++];
					J[I++] ^= G[H++];
					J[I++] ^= G[H++];
					J[I++] ^= G[H++];
					J[I++] ^= G[H++];
					J[I++] ^= G[H++];
					J[I++] ^= G[H++];
					J[I++] ^= G[H++];
					J[I++] ^= G[H++];
					J[I++] ^= G[H++];
					J[I++] ^= G[H++];
					J[I++] ^= G[H++];
					J[I++] ^= G[H++];
					J[I++] ^= G[H++];
					J[I++] ^= G[H++];
					J[I++] ^= G[H++];
					J[I++] ^= G[H++];
					J[I++] ^= G[H++];
					J[I++] ^= G[H++];
					J[I++] ^= G[H++];
					J[I++] ^= G[H++];
					J[I++] ^= G[H++];
					J[I++] ^= G[H++];
					J[I++] ^= G[H++];
					J[I++] ^= G[H++];
					J[I++] ^= G[H++];
					J[I++] ^= G[H++];
					J[I++] ^= G[H++];
					J[I++] ^= G[H++];
					J[I++] ^= G[H++];
					J[I++] ^= G[H++];
					J[I++] ^= G[H++];
					J[I++] ^= G[H++];
					J[I++] ^= G[H++];
					J[I++] ^= G[H++];
					J[I++] ^= G[H++];
					J[I++] ^= G[H++];
					J[I++] ^= G[H++];
					J[I++] ^= G[H++]
				}
			}

			function A(F, i, D)
			{
				var E;
				i += (2 * D - 1) * 64;
				E = (F[i + 0] & 255) << 0;
				E |= (F[i + 1] & 255) << 8;
				E |= (F[i + 2] & 255) << 16;
				E |= (F[i + 3] & 255) << 24;
				return E
			}

			function x(G, E, D, i, F)
			{
				while (F--)
				{
					D[i++] = G[E++]
				}
			}

			function z(I, G, E, D, H)
			{
				var F = H >> 5;
				while (F--)
				{
					E[D++] = I[G++];
					E[D++] = I[G++];
					E[D++] = I[G++];
					E[D++] = I[G++];
					E[D++] = I[G++];
					E[D++] = I[G++];
					E[D++] = I[G++];
					E[D++] = I[G++];
					E[D++] = I[G++];
					E[D++] = I[G++];
					E[D++] = I[G++];
					E[D++] = I[G++];
					E[D++] = I[G++];
					E[D++] = I[G++];
					E[D++] = I[G++];
					E[D++] = I[G++];
					E[D++] = I[G++];
					E[D++] = I[G++];
					E[D++] = I[G++];
					E[D++] = I[G++];
					E[D++] = I[G++];
					E[D++] = I[G++];
					E[D++] = I[G++];
					E[D++] = I[G++];
					E[D++] = I[G++];
					E[D++] = I[G++];
					E[D++] = I[G++];
					E[D++] = I[G++];
					E[D++] = I[G++];
					E[D++] = I[G++];
					E[D++] = I[G++];
					E[D++] = I[G++]
				}
			}
		}
	}
})();


/*
 * Crypto-JS v2.5.4	PBKDF2.js
 * http://code.google.com/p/crypto-js/
 * Copyright (c) 2009-2013, Jeff Mott. All rights reserved.
 * http://code.google.com/p/crypto-js/wiki/License
 */
(function ()
{
	var e = Crypto,
		a = e.util,
		b = e.charenc,
		d = b.UTF8,
		c = b.Binary;
	e.PBKDF2 = function (q, o, f, t)
	{
		if (q.constructor == String)
		{
			q = d.stringToBytes(q)
		}
		if (o.constructor == String)
		{
			o = d.stringToBytes(o)
		}
		var s = t && t.hasher || e.SHA1,
			k = t && t.iterations || 1;

		function p(i, j)
		{
			return e.HMAC(s, j, i,
			{
				asBytes: true
			})
		}
		var h = [],
			g = 1;
		while (h.length < f)
		{
			var l = p(q, o.concat(a.wordsToBytes([g])));
			for (var r = l, n = 1; n < k; n++)
			{
				r = p(q, r);
				for (var m = 0; m < l.length; m++)
				{
					l[m] ^= r[m]
				}
			}
			h = h.concat(l);
			g++
		}
		h.length = f;
		return t && t.asBytes ? h : t && t.asString ? c.bytesToString(h) : a.bytesToHex(h)
	}
})();

/*
 * Crypto-JS v2.5.4	HMAC.js
 * http://code.google.com/p/crypto-js/
 * Copyright (c) 2009-2013, Jeff Mott. All rights reserved.
 * http://code.google.com/p/crypto-js/wiki/License
 */
(function ()
{
	var e = Crypto,
		a = e.util,
		b = e.charenc,
		d = b.UTF8,
		c = b.Binary;
	e.HMAC = function (l, m, k, h)
	{
		if (m.constructor == String)
		{
			m = d.stringToBytes(m)
		}
		if (k.constructor == String)
		{
			k = d.stringToBytes(k)
		}
		if (k.length > l._blocksize * 4)
		{
			k = l(k,
			{
				asBytes: true
			})
		}
		var g = k.slice(0),
			n = k.slice(0);
		for (var j = 0; j < l._blocksize * 4; j++)
		{
			g[j] ^= 92;
			n[j] ^= 54
		}
		var f = l(g.concat(l(n.concat(m),
		{
			asBytes: true
		})),
		{
			asBytes: true
		});
		return h && h.asBytes ? f : h && h.asString ? c.bytesToString(f) : a.bytesToHex(f)
	}
})();