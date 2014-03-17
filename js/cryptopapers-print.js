
var DefaultBG = 'fractal-1';
var DefaultFrame = 'Frame-4';

var HueShift = 0;
var HueShiftChange = 5;

var WalletFrames = 6;

var Frames = 
	{
	'Frame-1': {
		Active: true,
		Name: 'Folding Coin Wallet',
		Creator: 'CryptoPapers',
		Difficulty: 'Advanced',
		Description: 'This stylish paper wallet folds into the shape of a coin!',
		Instructions: '<ol>' + 
			'<li>Cut the wallet using the front side as a guide, discarding any excess background on the back side</li>' +
			'<li>Fold along the dotted lines so that the Public Address on the front and the large coin logo on the back display outwards, keeping the private keys secured in the middle.</li>' +
			'<li><b>Three Tape Spots:</b> Apply tape or holographic stickers along the top and bottom as well as the side of the wallet to prevent peeking.</li>' + 
			'</ol>'
	},
	'Frame-2': {
		Active: true,
		Name: 'Coin Wallet Booklet',
		Creator: 'CryptoPapers',
		Difficulty: 'Advanced',
		Description: 'This wallet folds into a circular wallet booklet, with plenty of room for writing.',
		Instructions: '<ol>' + 
			'<li>Cut the wallet out using the front side as a guide, discarding any excess background on the back side</li>' +
			'<li>Fold along the dotted lines so that the Public Address and large coin logo on the front display outwards, keeping the private keys secured in the middle.</li>' +
			'<li><b>Two Tape Spots:</b> Using tape or holographic stickers, tape together the last three sections of the wallet by taping the top and bottom, keeping the private key secure while allowing wallet to unfold to display written notes.</li>' + 
			'</ol>'
	},
	'Frame-3': {
		Active: true,
		Name: 'Coin Slip',
		Creator: 'CryptoPapers',
		Difficulty: 'Intermediate',
		Description: 'This wallet is part slip, part coin!',
		Instructions: '<ol>' + 
			'<li>Cut the wallet out using the front side as a guide, discarding any excess background on the back side</li>' +
			'<li>Fold along the dotted lines so that the Public Address and large coin logo on the front display outwards, keeping the private keys secured in the middle.</li>' +
			'<li><b>Two Tape Spots:</b> Apply tape or holographic stickers along the top and bottom of the fold-out portion of the wallet.</li>' + 
			'</ol>'
	},
	'Frame-4': {
		Active: true,
		Name: 'Credit Card Wallet',
		Creator: 'CryptoPapers',
		Difficulty: 'Beginner',
		Description: 'This wallet is exactly the size of a credit card!',
		Instructions: '<ol>' + 
			'<li>Cut the wallet out using the front side as a guide, discarding any excess background on the back side</li>' +
			'<li>Fold along the dotted lines so that the Public Address and small coin logo on the front display outwards, keeping the private keys secured in the middle.</li>' +
			'<li><b>Two Tape Spots:</b> Apply tape or holographic stickers along the top and bottom of the wallet, making sure to cover the small flap to prevent peeking.</li>' + 
			'</ol>'
	},
	'Frame-5': {
		Active: true,
		Name: 'Rounded Credit Card Wallet',
		Creator: 'CryptoPapers',
		Difficulty: 'Intermediate',
		Description: 'Credit Card Wallet too boring? This one has some curves...',
		Instructions: '<ol>' + 
			'<li>Cut the wallet out using the front side as a guide, discarding any excess background on the back side</li>' +
			'<li>Fold along the dotted lines so that the private key is hidden behind the public key. The small flap should be showing on the front</li>' +
			'<li><b>Two Tape Spots:</b> Apply tape or holographic stickers along the top and bottom of the wallet, making sure to cover the small flap to prevent peeking.</li>' + 
			'</ol>'
	},
	'Frame-6': {
		Active: true,
		Name: 'Standard Wallet V2',
		Creator: 'CryptoPapers',
		Difficulty: 'Intermediate',
		Description: 'Simple yet attractive twist on the classic wallet.',
		Instructions: '<ol>' + 
			'<li>Cut the wallet out using the front side as a guide, discarding any excess background on the back side</li>' +
			'<li>Fold along the vertical dotted lines so that the Public Address and small coin logo on the front display outwards, keeping the private keys secured in the middle.</li>' +
			'<li>Fold the remaining flaps downward, fully enclosing the private key.</li>' +
			'<li><b>Two Tape Spots:</b> Apply tape or holographic stickers along the top and bottom of the fold-out portion of the wallet.</li>' + 
			'</ol>'
	},
	'Frame-7': {
		Active: false
	},
	'Frame-8': {
		Active: true,
		Name: 'Standard Wallet',
		Creator: 'Whoever invented the rectangle',
		Difficulty: 'Beginner',
		Description: 'This wallet frame is great if you hate cutting things out!',
		Instructions: '<ol>' + 
			'<li>Cut the wallet out using the front side as a guide, discarding any excess background on the back side</li>' +
			'<li>Fold along the dotted lines so that the Public Address and small coin logo on the front display outwards, keeping the private keys secured in the middle.</li>' +
			'<li><b>Two Tape Spots:</b> Apply tape or holographic stickers along the top and bottom of the fold-out portion of the wallet.</li>' + 
			'</ol>'
	},
	'Frame-9': {
		Active: true,
		Name: 'Coin Wallet',
		Creator: 'CryptoPapers',
		Difficulty: 'Ninja',
		Description: 'This wallet has no folds and is perfectly circular, the private key is inside!',
		Instructions: '<ol>' + 
			'<li>Cut the wallet out using the front side as a guide, discarding any excess background on the back side</li>' +
			'<li>Use the two larger circles to sandwich in the smaller circle, the private key. make sure the public address and the large coin logo are facing outwards.</li>' +
			'<li><b>Glue:</b> Lay one of the larger circle sections face down, so that the anti-candling grid is shown.' +
			' Lay the private key down in the center of the circle and apply glue around the outer edge. Lay the other side down, and allow it to dry.</li>' + 
			'</ol>'
	}
	};
	
var Backgrounds = 
	{	
	'abstract': 53,
	'bricks': 12,
	'camo': 2,
	'cash': 2,
	'coin': 6,
	'fire': 4,
	'flower': 11,
	'food': 7,
	'fractal': 5,
	'glass': 2,
	'holiday': 6,
	'love': 4,
	'metal': 10,
	'misc': 17,
	'music': 1,
	'paper': 2,
	'plants': 14,
	'rocks-sand': 6,
	'sky': 7,
	'stars': 3,
	'tech': 3,
	'texture': 21,
	'tiles': 7,
	'water': 16,
	'wood': 20
	};

	
 function InitPrintPage()
	{
	SetFrame(DefaultFrame);
	SetDesign(DefaultBG);
		
	SetLettering();
	
	// Compute list of all background classes
	setTimeout(function()
		{
		AllBGs = '';
		
		for (var i = 0; i < Object.keys(Backgrounds).length; i++)
			{
			AllBGs += BGString(Object.keys(Backgrounds)[i], Backgrounds[Object.keys(Backgrounds)[i]]); 
			}
		
		AllBGs = AllBGs.substr(0, AllBGs.length-1);
		}, 100);
		
	$('input[name=print-face]').change(function() 
		{
		$('.coin-wallets').fadeOut(300, function() {
			$('.coin-wallets').toggleClass('back');
			$('.coin-wallets').fadeIn(300);
			});
		});
		
	$('input[name=sample-wallet]').change(function() 
		{
		var Sample = ($('input[name=sample-wallet]:checked').val() == 'Yes');
		
		if (Sample)
			{
			$('.coin-wallets').addClass('sample');
			}
		else
			{
			$('.coin-wallets').removeClass('sample');
			}
		});
		
	$('#print-button').click(function() 
		{
		$('.coin-wallet').attr('style', '');
		window.print();
		});
		
	$('input[name=compression]').change(function() 
		{
		Default_Compress = !Default_Compress;

		$('#private-key-input').change();
		});
	
	$('input[name=wallet-backup]').change(function()
		{
		var Backup = ($('input[name=wallet-backup]:checked').val() == "Yes");
				
		if (Backup)
			{
			$('.coin-wallet-2').fadeIn();
			}
		else
			{
			$('.coin-wallet-2').fadeOut();
			}

		});
	
	
	$('.frame-grid-row-header').click(function()
		{
		$(this).parent().find('.frame.selector').click();
		});
	
	$('input[name=wallet-zoom]').change(function()
		{
		var Zoom = $('input[name=wallet-zoom]:checked').val();
		
		$('.coin-wallet').animate({zoom: Zoom + '%'}, 300);
		
		setTimeout(function()
			{
			$('.coin-wallet').css('zoom', '');
			$('.coin-wallet').removeClass('zoom-90').removeClass('zoom-95').removeClass('zoom-100').removeClass('zoom-105').removeClass('zoom-110');		
			$('.coin-wallet').addClass('zoom-' + Zoom);
			}, 301);
		
		});
		
	$('.frame.selector').click(function()
		{
		if (!$('.frame-type').hasClass('selecting'))
			return;
		if ($(this).hasClass('active'))
			return;
			
		var val = $(this).attr('data');
		
		if (val)
			{
			$('.coin-wallets').fadeOut(300, function()
				{			
				SetFrame(val);
				
				$('.coin-wallets').fadeIn(300);
				
				
				SetLettering();
				});
			}
		});
		
	$('.design.selector').click(function()
		{
		$('.hue-shift-reset').click();
		
		SetLettering();
		});
		
	$('.design.selector:not(.active)').click(function()
		{
		if ($(this).hasClass('active'))
			return;
			
		SetDesign($(this).attr('data'));
		});
		
		
	$('#custom-design').change(function(evt)
		{
		Log(evt);
		Log(evt.target);
		Log(evt.target.files);
		Log(evt.target.files[0]);
		
		var fr = new FileReader();
		var	filecontent = fr.readAsArrayBuffer(evt.target.files[0]);
		var binary = window.btoa(filecontent);
		
		Log(filecontent);
		Log(binary);
		
	//	$('.coin-wallet').css('background-image', 'url("' + '' + '")');
		});
	}
	
var AllBGs = undefined;

function BGString(Category, Number)
	{	
	var Out = "";
	for (var i = 0; i < Number; i++)
	{ 
	Out += Category + "-" + (i+1) + " ";
	}
	
	return Out;	
	}
	

function AddFrames()
	{
	var cols = 10;
	var frames = '';
	
	for (var i = 0; i < Object.keys(Frames).length; i++)
		{
		if (!Frames[Object.keys(Frames)[i]].Active)
			continue;
			
		var Frame = "Frame-" + (i+1);
		var FrameName = Frames[Object.keys(Frames)[i]].Name;
				
		frames += '<div class="frame-grid-row selector-grid-row">';
		
			
		frames += '<div class="frame-grid-row-header ' + Frame + '">' + FrameName + '</div>';
			
		
		var Active = (Frame == DefaultFrame) ? ' active' : '';
		
		frames += '<div class="frame selector ' + Frame + '-frame' + Active+ '" data=' + Frame + '>';
		frames += '<img class="coin-wallet-frame" src="images/wallet-frames/' + Frame + '.png" />';
		frames += '</div>';
		
		if (i != 0 && i % cols == 0 && i < CategoryCount)
			{
			frames += '</div>';
			frames += '<div class="frame-grid-row selector-grid-row">';
			}
		
		
		frames += '</div>';
		}
	
	$('.frame-grid-wrapper').html(frames);
	$('#current-frame-img').attr('src', 'images/wallet-frames/' + DefaultFrame + '.png')
	}
	
function AddBackgrounds()
	{
	var cols = 5;
	var designs = '';
	
	for (var i = 0; i < Object.keys(Backgrounds).length; i++)
		{
		var Category = Object.keys(Backgrounds)[i];
		
		designs += '<div class="design-grid-row selector-grid-row">';
		
			
		designs += '<div class="design-grid-row-header ' + Category + '">' + Category + '</div>';
			
		var CategoryCount = Backgrounds[Object.keys(Backgrounds)[i]];
		
		for (var j = 0; j < CategoryCount; j++)
			{
			var BGString = Category + '-' + (j+1);
			
			var Active = (BGString == DefaultBG) ? ' active' : '';
			
			designs += '<div class="design selector ' + BGString + '-design' + Active+ '" data=' + BGString + '>';
			designs += '<img class="coin-wallet-background" src="images/wallet-backgrounds/' + BGString + '.jpg" />';
			designs += '</div>';
			
			if (j != 0 && j % 10 == 0 && j < CategoryCount)
				{
				designs += '</div>';
				designs += '<div class="design-grid-row selector-grid-row">';
				}
			}
		
		
		designs += '</div>';
		}
	
	$('.designs-grid-wrapper').html(designs);
	$('#current-bkg-img').attr('src', 'images/wallet-backgrounds/' + DefaultBG + '.jpg')

	}

function SetDesign(Design)
	{
	setTimeout(function() {		
		$('.coin-wallet').fadeOut(300, function() {
			$('.coin-wallets').removeClass(AllBGs);
			
			$('.coin-wallets').addClass(Design);
			
			$('.coin-wallet .coin-wallet-background').attr('src', 'images/wallet-backgrounds/' + Design + '.jpg');
			
			SetLettering();
	
			$('.coin-wallet').fadeIn(300);
			});
		}, 500);
		
	}
	
function SetFrame(Frame)
	{
	$('.coin-wallets').removeClass(BGString('frame', Object.keys(Frames).length));

	$('.coin-wallets').addClass(Frame.toLowerCase());
	
	$('.frame-instructions .frame-name').html(Frames[Frame].Name);
	$('.frame-instructions .frame-creator').html(Frames[Frame].Creator);
	$('.frame-instructions .frame-description').html(Frames[Frame].Description);
	$('.frame-instructions .frame-difficulty').html(Frames[Frame].Difficulty);
	$('.frame-instructions .frame-detail-instructions').html(Frames[Frame].Instructions);
	}
	
function SetLettering()
	{
	$('.frame-1 .coin-wallet-address').lettering();
	$('.frame-1 .coin-wallet-private-key').lettering();
	$('.frame-2 .coin-wallet-address').lettering();
	$('.frame-2 .coin-wallet-private-key').lettering();
	$('.frame-9 .coin-wallet-address').lettering();
	$('.frame-9 .coin-wallet-private-key').lettering();
	}

function ApplyHueShift()
	{	
	$('.hue-shift-amount').html((HueShift > 0 ? '+' : '') + HueShift + '&deg;');
	$('.coin-wallet-background').css('filter', 'hue-rotate(' + HueShift + 'deg)');
	$('.coin-wallet-background').css('-webkit-filter', 'hue-rotate(' + HueShift + 'deg)');
	}