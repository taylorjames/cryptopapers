
var Multiple_Wallets = true;

var InitPremium;

function InitPage()
	{
	AddDropdownCoins();
	
	AddFrames();
	AddBackgrounds();
	
	InitPrivateKeyPage();
	
	InitQRRead();
	
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
	InitMinimizable();
	
	InitWallets();
		
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
	
function InitWallets()
	{
	if (Multiple_Wallets)
		{
		$('.key-wallet').show();
		$('#private-key-add').show();
		$('#private-key-remove').show();
		}
	else
		{
		$('.key-wallet').hide();
		$('#private-key-add').hide();
		$('#private-key-remove').hide();
		}
	}
	
function InitMinimizable()
	{
	$('.minimizable').prepend('<div class="minimize-button"></div>');
	
	
	$('.minimizable .minimize-button').click(function() {
	
		var height = $(this).parent().attr('minimized-height') == undefined ? 40 : parseInt($(this).parent().attr('minimized-height'));
		var oldheight = $(this).parent().attr('maximized-height') == undefined || $(this).parent().attr('maximized-height') == '' ? $(this).parent().getTrueHeight() : $(this).parent().attr('maximized-height');
		
		if ($(this).parent().hasClass('minimized'))
			{
			$(this).parent().animate({'height': oldheight}, 300, function() 
				{
				$(this).css('height', 'inherit');
				});
			$(this).parent().find('h3:not(.stay)').animate({'margin-top': 0 }, 300);
			$(this).parent().find('.help-toggle').fadeIn(300);
			$(this).parent().find('.minimize-hide').fadeIn(300);
			if ($(this).parent().hasClass('help-active'))
				$(this).parent().find('.help-bubble').snazzyShow();
			$(this).parent().removeClass('minimized');
			}
		else
			{
			$(this).parent().attr('maximized-height', $(this).parent().getTrueHeight());
			$(this).parent().animate({'height': height}, 300);
			$(this).parent().find('h3:not(.stay)').animate({'margin-top': -20 }, 300);
			$(this).parent().find('.help-toggle').fadeOut(300);
			$(this).parent().find('.minimize-hide').fadeOut(300);
			$(this).parent().find('.help-bubble').snazzyHide();
			$(this).parent().addClass('minimized');
			}
	});	
	$('.minimizable.minimized').each(function() {
		$(this).removeClass('minimized').find('.minimize-button').click();
		});
	}
	
function InitDismissable()
	{
	$('.dismissable').prepend('<div class="close-button"></div>');
	
	$('.dismissable .close-button').click(function() {
		$(this).parent().snazzyHide();
		return true;
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
			Toggle.animate({opacity: '0.5'}, 300);
			Toggle.parent().find('.help-bubble').snazzyHide(300 , function() 
				{
				Toggle.parent().removeClass('help-active');
				});
			}
		else
			{
			Toggle.animate({opacity: '1'}, 300);
			Toggle.parent().addClass('help-active');
			
			Toggle.parent().find('.help-bubble').snazzyShow();
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
		var Manual = CoinInfo[Object.keys(CoinInfo)[i]].manual;
		
		var CoinImage = CoinAbbreviation + "-logo.png";
		
		var Disabled = (Enabled ? '' : ' disabled');
		var ComingSoon = (Enabled ? '' : '<span class="coming-soon">COMING SOON</span>');
		var Tests = (Enabled && !HasTests(CoinAbbreviation) ? '<span class="coming-soon untested">UNTESTED</span>' : '');
		var Tests = Manual ? '<span class="coming-soon manual-entry">IMPORT ONLY</span>' : Tests;
		var Active = (CoinAbbreviation == DefaultCoin ? ' active' : '');
		var ActiveFloat = (CoinAbbreviation == DefaultCoin ? ' style="float:left;"' : '');
		
		
		if (i == 0)
			coins += '<div class="coin-grid-row selector-grid-row">';
			
		coins += '<div class="coin selector ' + Disabled + Active + '" ' + ActiveFloat + 'data="' + CoinAbbreviation + '">' + '<img src="images/coin-icons/' + CoinAbbreviation + '-logo.png" class="' + CoinAbbreviation + '-coin" />'
		+ ComingSoon + Tests + '<em>' + CoinFullName + '</em></div>';
				
		if ((i+1) % cols == 0 && i < Object.keys(CoinInfo).length-1)
			{
			coins += '</div>';
			coins += '<div class="coin-grid-row selector-grid-row">';
			}
			
		}
			coins += '</div>';
	
	
	$('.coins-grid-wrapper').html(coins);
	
	$('.coin-type .selector.coin:not(.disabled)').click(function()
		{
		var NewCoinType = $(this).attr('data');
		var CurrentCoinType_Persist = CurrentCoinType;
		
		});
	}

function ChangeCoinType(NewCoinType, Clear)
	{
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
	
	if (CoinInfo[NewCoinType].manual)
		{
		if ($('#main-menu .menu-key-import').hasClass('active') && !$('#coin-setup-menu #generate').hasClass('active'))
			{
			if ($('#main-menu .menu-key-import').hasClass('active') && !$('#coin-setup-menu #generate').hasClass('active'))
				{
				$('#coin-setup-menu #generate').click();
				}
				
			$('#private-key-input').val('');
			$('.private-key-address-manual').snazzyShow();
			
			$('.manual-hide').snazzyHide();
			
			$('.print-encryption').snazzyHide();
			$('.warning.manual-keys').snazzyShow();
			
			$('#private-key-input').change();
			}
			
		if (Clear)
			$('#private-key-input').val('');
			
		$('.private-key-address-manual').snazzyShow();
		
		if (!CoinInfo[NewCoinType].manual)
			{
			$('#private-key-input').val('');
			$('#private-key-address-manual').val('');
			
			$('#private-key-input').change();
			}
		
		$('.key-details').snazzyHide();
		
		$('.manual-hide').snazzyHide();
		
		$('.print-encryption').snazzyHide();
		$('.warning.manual-keys').snazzyShow();
		}
	else if (CoinInfo[CurrentCoinType].manual)
		{
		$('.warning.manual-keys').snazzyHide();
		$('.manual-hide').snazzyShow();
		$('.private-key-address-manual').snazzyHide();
		}
	
	CurrentCoinType = NewCoinType;
	
	$('.coin-full-name').html(CoinInfo[CurrentCoinType].fullName);
	
	if (Clear)
		$('#private-key-input').change();
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
