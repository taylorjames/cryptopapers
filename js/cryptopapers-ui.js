
var InitPremium;

function InitPage()
	{
	AddDropdownCoins();
	
	AddFrames();
	AddBackgrounds();
	
	InitPrivateKeyPage();
	InitSecurityPage();
	InitPrintPage();
	
	InitRNG();	
	
	InitHelp();

	InitSelectorGrid();		
	
	InitMenus();
	
	InitTheme();
	
	InitDonate();
	
	InitBIP38();
	
	InitDismissable();
	 
	$('.coin-full-name').html(CoinInfo[CurrentCoinType].fullName);
	
	$('#run-self-tests').click(function() {
		var Result = RunTests();
		Log(Result);
		
		// Get a better display box.
		alert(Result);		
	});
	
	if (InitPremium)
		InitPremium();
	}
	
function InitDismissable()
	{
	$('.dismissable').prepend('<div class="close-button"></div>');
	
	$('.dismissable .close-button').click(function() {
		$(this).parent().animate({opacity: '0'}, 300, function() {
			$(this).hide();
			//$('.sub-section.coin-setup-print').animate({'margin-top': '0px'}, 500);
		});
	});
	$('.dismissable.warning.beta-software .close-button').click(function() {
		$(this).parent().animate({opacity: '0'}, 300, function() {
			$(this).hide();
			$('.sub-section.coin-setup-print').animate({'margin-top': '0px'}, 500);
		});
	});

		
	
	}
	
function InitDonate()
	{
	$(".donate-reminder, .donate-reminder *").click(function() 
		{
		$('.menu-key-donate').click();
		});
	AddDonateCoins();
	}
	
function InitHelp()
	{
	$('.help-section').each(function(section)
		{
		$(this).prepend('<div class="help-toggle"></div>');
		});
		
	$('.help-toggle').click(function() 
		{
		var Toggle = $(this);
		if (Toggle.parent().hasClass('help-active'))
			{
			Toggle.animate({opacity: '0.5'});
			Toggle.parent().find('.help-bubble').animate({opacity: '0', height: '0px'}, 300 , function() 
				{
				Toggle.parent().removeClass('help-active');
				$(this).hide();
				});
			}
		else
			{
			Toggle.animate({opacity: '1'});
			Toggle.parent().addClass('help-active');
			
			Toggle.parent().find('.help-bubble').show().css('opacity','1').animateAuto('height', 300, function() 
				{
				});
			}
		});
	}

function InitMenus()
	{
	// Show the active page, hide the others
	var section = $('.menu li.active').attr('section');
	var subsection = $('#coin-setup-menu li.active').attr('section');
	$('.wrapper .inner > .section').hide();
	$('.wrapper .inner > .section.' + section).show();
	$('.sub-section').hide();
	$('.sub-section.' + subsection).show();
	
	$('.private-key-page').click(function() 
		{
		$('#coin-setup-menu #generate').click();
		});

	$('#coin-setup-menu.menu li').click(function() 
		{
		if ($(this).hasClass('disabled') || $(this).hasClass('active'))
			return;

		if($(this).hasClass('one'))$('#coin-setup-menu a').animate({'margin-left' : '0px'}, 400, function(){});
		if($(this).hasClass('two'))$('#coin-setup-menu a').animate({'margin-left' : '220px'}, 400, function(){});
		if($(this).hasClass('three'))$('#coin-setup-menu a').animate({'margin-left' : '459px'}, 400, function(){});
		
		var section = $(this).attr('section');

		$('#coin-setup-menu.menu li.active').removeClass('active');

		$('.coin-setup .sub-section').fadeOut(300);
		
		$(this).addClass('active');
		
		setTimeout(function()
			{
			$('.coin-setup .sub-section.' + section).fadeIn(300);		
			}, 300);
		});
		
	$('#main-menu.menu li').click(function() 
		{
		if ($(this).hasClass('disabled') || $(this).hasClass('active'))
			return;
		
		var section = $(this).attr('section');

		if (section != 'coin-wallets')
			{
			$('#main-menu.menu li.active').removeClass('active');
			}

		$(this).addClass('active');
		
		$('.wrapper .inner > .section').each(function() {
			$(this).fadeOut(300);
		});
		
		setTimeout(function() {
			$('.wrapper .inner > .section.' + section).fadeIn(300);
		}, 300);
		
		});
	}
	
function InitTheme()
	{
	$('input[name=theme]').change(function()
		{
		if ($(this).val() == "Yes")
			$('body').removeClass('dark-theme');
		else
			$('body').addClass('dark-theme');
		});
		
	/*
	if (!Security_IsOnline)
		{
		$('#lights-off').click();
		}
	else
		{
		$('#lights-on').click();
		}
	*/
		
	}

function InitSelectorGrid()
	{
		/*
		$('#coin-selected').click(function(e){
			e.preventDefault();
			if ($(this).hasClass('active'))
				{
				$('div.coin-type').fadeOut('fast');	
				$(this).removeClass('active');			
				}
			else
				{
				$('div.coin-type').fadeIn('fast');
				$(this).addClass('active');
				}
		});
	
		$('div.coin.selector').click(function(e){
			e.preventDefault();
			var abbrev = $(this).attr('data');
			$('#coin-selected img').attr('src', 'images/coin-icons/' + abbrev + '-logo.png');
			$('#coin-selected em').html(abbrev);
			$('div.coin-type').fadeOut('fast');
			$('#coin-selected.active').removeClass('active');

		});

		$('div.frame-type .frame-grid-row .frame').click(function(){
			var newFrame = $(this).attr('data').toString();
			var newLabel = $(this).siblings('.frame-grid-row-header').html();
			$('#current-frame img').attr('src', 'images/wallet-frames/' + newFrame + '.png');
			$('#current-frame-label').html(newLabel);

			$('div.frame-type').fadeOut('fast');
		});

		$('#current-frame img').click(function(){
			$('.frame-type, #black-out').fadeIn('fast');
		});
		*/

	 $('.selector-grid-wrapper .selector:not(.disabled)').click(function(e)
	 	{
	 	e.preventDefault();
		
	 	var ParentRow = $(this).parents('.selector-grid-row');
	 	var ParentGridWrapper = $(this).parents('.selector-grid-wrapper');
	 	var ParentGrid = $(this).parents('.selector-grid');
	 	var Fade = ParentGrid.attr('fade') == 'true';
	 	var Scroll = ParentGrid.attr('scroll') == 'true';
		var Effect = ParentGrid.attr('effect') != 'false';
		
		var RowHeight = ParentGrid.attr('rowheight');
		var ColWidth = ParentGrid.attr('colwidth');
		
	 	if (ParentGridWrapper.hasClass('selecting'))
	 		{
	 		ParentGridWrapper.find('.selector.active').removeClass('active');
	 		ParentGridWrapper.find('.selector-grid-row.active').removeClass('active');
			
	 		$(this).parent().addClass('active');
	 		$(this).addClass('active');
			
	 		if (Fade)
	 			{
	 			ParentGrid.find('.selector-grid-row:not(.active)').animate({ height: '0px'}, 300);
	 			ParentGridWrapper.find('.selector:not(.active)').fadeOut(300, function() {
	 				ParentGridWrapper.removeClass('selecting');
	 				ParentGrid.removeClass('selecting');
					
	 				});
	 			}
			else if (!Effect)
				{
				ParentGrid.find('.selector-grid-row:not(.active)').css('height', '0px');
				ParentGridWrapper.find('.selector:not(.active)').css('height', '0px').css('width', '0px').hide();
				
				ParentGridWrapper.removeClass('selecting');
				ParentGrid.removeClass('selecting');
				}
	 		else
	 			{
	 			ParentGrid.find('.selector-grid-row:not(.active)').animate({ height: '0px'}, 300);
	 			ParentGridWrapper.find('.selector:not(.active)').animate({height: '0px', width: '0px'}, 300, function() 
	 				{
	 				ParentGridWrapper.removeClass('selecting');
	 				ParentGrid.removeClass('selecting');
	 				});
	 			}
	 		}
		else
	 		{
	 		ParentGrid.addClass('selecting');
	 		ParentGridWrapper.addClass('selecting');
			
	 		if (Fade)
	 			{
	 			ParentGrid.find('.selector-grid-row:not(.active)').animate({ height: RowHeight}, 300);
	 			ParentGridWrapper.find('.selector:not(.active)').fadeIn(300, function() {
	 				if (Scroll)
	 					{
	 					var Obj = $(this);						
					
	 					var Position = Obj.offset().top;
						
	 					$('html, body').animate({
	 						scrollTop: Position - 100
	 					}, 300);
	 					Scroll = false;
	 					}
	 			});
	 			}
	 		else
	 			{
				if (!Effect)
					{
					ParentRow.css('height', RowHeight + 'px');
				
					ParentGrid.find('.selector-grid-row:not(.active)').css('height', RowHeight);
					ParentGridWrapper.find('.selector:not(.active)').css('width', ColWidth).css('height', RowHeight).show();
					
	 				if (Scroll)
	 					{
	 					var Obj = $(this);
						
					
	 					var Position = Obj.offset().top;
						
	 					$('html, body').animate({
	 						scrollTop: Position - 100
	 					}, 300);
	 					Scroll = false;
	 					}
					}
				else
					{
					ParentRow.animate({ height: RowHeight}, 300);
				
					ParentGrid.find('.selector-grid-row:not(.active)').animate({ height: RowHeight}, 300);
					ParentGridWrapper.find('.selector:not(.active)').css('width', '0px').css('height', '0px').animate({width: ColWidth, height: RowHeight}, 300, function() {
						
						
					
						if (Scroll)
							{
							var Obj = $(this);
							
							var Position = Obj.offset().top;
							
							$('html, body').animate({
								scrollTop: Position - 100
							}, 300);
							Scroll = false;
							}
					});
					}
				
	 			}
	 		}
			
	 	return true;
	 	});	
	}

function AddDropdownCoins()
	{
	var cols = 7;
	var coins = '';
	
	for (var i = 0; i < Object.keys(CoinInfo).length; i++)
		{
		var CoinAbbreviation = CoinInfo[Object.keys(CoinInfo)[i]].name;
		var CoinFullName = CoinInfo[Object.keys(CoinInfo)[i]].fullName;
		var Enabled = CoinInfo[Object.keys(CoinInfo)[i]].enabled;
		var CoinImage = CoinAbbreviation + "-logo.png";
		
		var Disabled = (Enabled ? '' : ' disabled');
		var ComingSoon = (Enabled ? '' : '<span class="coming-soon">COMING&nbsp;SOON</span>');
		var Tests = (Enabled && !HasTests(CoinAbbreviation) ? '<span class="coming-soon untested">UNTESTED</span>' : '');
		var Active = (CoinAbbreviation == DefaultCoin ? ' active' : '');
		var ActiveFloat = (CoinAbbreviation == DefaultCoin ? ' style="float:left;"' : '');
		
		
		if (i == 0)
			coins += '<div class="coin-grid-row selector-grid-row">';
			
		coins += '<div class="coin selector ' + Disabled + Active + '" ' + ActiveFloat + 'data="' + CoinAbbreviation + '">' + '<img src="images/coin-icons/' + CoinAbbreviation + '-logo.png" class="' + CoinAbbreviation + '-coin" />'
		+ ComingSoon + Tests + '<em>' + CoinFullName + '</em></div>';
				
		if ((i+1) % cols == 0)
			{
			coins += '</div>';
			coins += '<div class="coin-grid-row selector-grid-row">';
			}
			
		}
			coins += '</div>';
	
	
	$('.coins-grid-wrapper').html(coins);

	
	$('.coin-type .selector.coin:not(disabled)').click(function()
		{
		var NewCoinType = $(this).attr('data');
		var CurrentCoinType_Persist = CurrentCoinType;
		
		if (NewCoinType == CurrentCoinType)
			return;			
		
		$('.changing-coin').fadeOut(300, function() { 
			$('.changing-coin').removeClass(CurrentCoinType_Persist + '-coin').addClass(NewCoinType + '-coin');
			$('.changing-coin').fadeIn(300)
			})
		
		if (CurrentCoinType == 'btc' && NewCoinType != 'btc')
			$('.btc-only').fadeOut(300);
		else if (NewCoinType == 'btc' && CurrentCoinType != 'btc')
			$('.btc-only').fadeIn(300);
		
		
		CurrentCoinType = NewCoinType;

		console.log(CurrentCoinType);
		
		$('.coin-full-name').html(CoinInfo[CurrentCoinType].fullName);
		
		$('#private-key-input').change();
		});
	}
	
function AddDonateCoins()
	{
	var donate = '';
	
	for (var i = 0; i < Object.keys(CoinInfo).length; i++)
		{
		var CoinAbbreviation= CoinInfo[Object.keys(CoinInfo)[i]].name;
		
		if (CoinInfo[Object.keys(CoinInfo)[i]].enabled || CoinInfo[Object.keys(CoinInfo)[i]].donateAddress != '')
			{	
			donate += '<div class="donate-key">';
			donate += '<div class="coin ' + CoinAbbreviation + '-coin">';
			donate += '<div class="donate-address">' + CoinInfo[Object.keys(CoinInfo)[i]].donateAddress + '</div>';
			donate += '</div>';				
			donate += '</div>';
			}
		}
	
	$('.donate-coins-auto').html(donate);
	}
