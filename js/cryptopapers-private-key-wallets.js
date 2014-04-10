 
var Multiple_Wallets = false;

var KeyWallet = [];
	
var CurrentKey = undefined;
var CurrentKey_Updated = false;

function InitKeyWallet()
	{
	$('.key-wallet .keys').mouseleave(function() 
		{
		KeyWalletKeys_MouseLeave(this);
		});
	
	$('.key-wallet').click(function() 
		{
		KeyWallet_Click(this);
		});
		
	$('#private-key-remove').click(function() 
		{
		PrivateKeyRemove_Click(this);
		});
		
	$('#private-key-remove-no').click(function()
		{
		PrivateKeyRemoveNo_Click(this);
		});		
		
	$('#private-key-remove-yes').click(function()
		{
		PrivateKeyRemoveYes_Click(this);
		});
		
	$('#private-key-add').click(function() 
		{
		PrivateKeyAdd_Click(this);
		});	
	}
	
function KeyWalletKeys_MouseLeave(sender)
	{
	if ($('.key-wallet').hasClass('expand-x') && $('.key-wallet').hasClass('expand-y'))
		{
		}
	else
		{
		$('.key-wallet').find('.key:not(.current-key)').show().animate({height: 0, opacity: 0, 'margin-bottom': 0});
		}
	}

function KeyWallet_Click(sender)
	{
	if ($(sender).hasClass('expand-x'))
		{
		if (CurrentKey == undefined)
			{
			var a = $(sender);
			
			$(this).find('.key:not(.current-key)').snazzyHide(300, function() { 
				a.animate({width: 86}, 300, function() {
					a.removeClass('expand-x').removeClass('expand-y');
					});
				});
			}
		else
			{
			ClearCurrentKey();
			$(this).removeClass('expand-x').removeClass('expand-y');
			
			if (ArmoryMode)
				{
				}
			else if (ElectrumMode)
				{
				}
			else
				{
				if (!CoinInfo[CurrentCoinType].manua && $('#private-key-input').val() == '')
					{
					GenerateButton_Click();
					}
				}
			/*
			if ($(this).hasClass('expand-y'))
				{
				$(this).find('.key:not(.current-key)').snazzyHide(300, function() { 
					});
					
				//$(this).animate({height: 63}, 300, function() {
					$(this).removeClass('expand-y');
				//	});
				
				ClearCurrentKey();
				
				$(this).animate({width: 86}, 300, function() {
					$(this).removeClass('expand-x').removeClass('expand-y');
					});
				
				}
			else
				{
				var a = $(this);
				
				
				$(this).find('.key:not(.current-key)').snazzyShow(300, function() { 
				
					
					});
					a.addClass('expand-y');
				//a.animate({height: a.getTrueHeight()}, 300);
				/*
				var OldHeight = $(this).css('height');
				
				$(this).addClass('expand-y');
				
				var NewHeight = $(this).css('height');
				
				$(this).css('height', OldHeight).animate({height: NewHeight}, 300, function() { 
					
					});
				}
					*/
			}
		}
	else if (KeyWallet.length != 0)
		{		
		
		$(sender).find('.key:not(.current-key)').snazzyShow();
				
		$(sender).animate({width: 444}, 300, function() { 
		
			$(sender).addClass('expand-x').addClass('expand-y');
		
		//	var NewHeight = $(this).css('height');
			
		//	$(this).animate({height: NewHeight}, 300);
			});
		}
	}

function PrivateKeyRemove_Click(sender)
	{
	$(sender).fadeOut(300, function()
		{
		$('#private-key-remove-yes').fadeIn(300);
		$('#private-key-remove-no').fadeIn(300);
		});
	}
	
function PrivateKeyRemoveNo_Click(sender)
	{
	$('#private-key-remove-yes, #private-key-remove-no').fadeOut(300, function()
		{
		$('#private-key-remove').fadeIn(300);
		});
	}
	
function RemoveKey(Key)
	{
	var index = KeyWallet.indexOf(Key);
	
	if (index >= 0)
		KeyWallet.splice(index, 1);
		
	}

function PrivateKeyRemoveYes_Click(sender)
	{
	$('#private-key-remove-yes, #private-key-remove-no').fadeOut(300, function() {
		$('#private-key-remove').fadeIn(300);
		});
	
	var WalletCount = 0;
	
	if (WalletCount == 0)
		{
		window.onbeforeunload = undefined;
		$('#coin-setup-menu #print').addClass('disabled');
		}
		
	RemoveKey(CurrentKey);
	
	ClearCurrentKey(function()
		{
		DisplayWallets();
		
		$('#private-key-input').val('');
		$('#private-key-address-manual').val('');
		$('#private-key-add').attr('disabled', '');
		$('#private-key-remove').attr('disabled', '');
		$('.print-encryption').snazzyHide();
		$('.key-details').animate({opacity: 0}, 300, function() { 
			if (!CoinInfo[CurrentCoinType].manual && !Multiple_Wallets)
				$('.generate-button').snazzyShow();
					
			GenerateButton_Click($('.generate-button').get());
			});
		});
	}

function PrivateKeyAdd_Click(sender)
	{
	var Address = '';
	var Key = '';
	var EncryptedKey = '';
	
	var KeyDiv = '';
	var AddressDiv = '';
	
	var Offset1 = 0;
	var Offset2 = 0;
	var Offset3 = 100;
	var Offset4 = 15;
	
	if (CoinInfo[CurrentCoinType].manual)
		{
		KeyDiv= '#private-key-input';
		AddressDiv= '#private-key-address-manual';
		
		Address = $('#chain-public-address-manual').val();
		Key = $('#private-key-input').val();
		}
	else if (ArmoryMode)
		{
		Offset1 = 140;
		Offset2 = 12;
		Offset3 = 100;
		Offset4 = 12;
		
		Address = $('#chain-public-address-1').val();
		Key = $('#private-key-armory').val();
		
		KeyDiv= '#private-key-input';
		AddressDiv= '#private-key-armory';
		}
	else if (ElectrumMode)
		{
		Offset1 = 210;
		Offset2 = 15;
		Offset3 = 110;
		Offset4 = 15;
		
		Address = $('#chain-public-address-1').val();
		Key = $('#private-key-electrum').val();
		
		KeyDiv= '#private-key-electrum';
		AddressDiv= '#private-key-electrum-root';
		}
	else
		{
		Address = $('#public-address').val();
		Key = $('#private-key-wif').val();
		EncryptedKey = $('#private-key-encrypted').val();
		
		KeyDiv = '#private-key-input';
		AddressDiv= '#public-address';
		}
		
	var StartLeft =  $(AddressDiv).offset().left + Offset1;
	var StartTop = $(AddressDiv).offset().top + Offset2;
	var StartSize = $(AddressDiv).css('font-size');
	var StartFont = $(AddressDiv).css('font-family');
	
	var DisplayKey = $(KeyDiv).val();		
	
	var StartLeft2 =  $(KeyDiv).offset().left + Offset3;
	var StartTop2 = $(KeyDiv).offset().top + Offset4;
	var StartSize2 = $(KeyDiv).css('font-size');
	var StartFont2 = $(KeyDiv).css('font-family');
	
	var EndLeft = $('.key-wallet .wallet-image').offset().left - 10;
	var EndTop = $('.key-wallet .wallet-image').offset().top + 10;		
	var EndSize = '1px';
	
	$('body').parent().prepend('<div class="address-effect address">' + $(AddressDiv).val().replace('\n', '<br>') + '</div>');
	$('body').parent().prepend('<div class="address-effect key">' + DisplayKey + '</div>');
	
	$(KeyDiv).val('');
	$(AddressDiv).val('');
	
	$('.address-effect.key').css('left', StartLeft2).css('top', StartTop2).css('font-size', StartSize2).css('font-family', StartFont2)
		.animate({top: EndTop, left: EndLeft, 'font-size': EndSize}, 600, function () 
		{
		$(this).remove();			
		});
	$('.address-effect.address').css('left', StartLeft).css('top', StartTop).css('font-size', StartSize).css('font-family', StartFont)
		.animate({top: EndTop, left: EndLeft, 'font-size': EndSize}, 600, function ()
		{
		var Wallet = { 
			coinType: CurrentCoinType,
			address: Address,
			key: Key,
			encryptedKey: EncryptedKey,
			armoryMode: ArmoryMode,
			electrumMode: ElectrumMode,
			};
		
		if (!WalletContains(CurrentCoinType, Key))
			{
			KeyWallet.push(Wallet);
			}			
		
		DisplayWallets();
		
		$(this).remove();
		
		ClearKeyText();		
		
		$('#private-key-input').val('');
		$('#private-key-address-manual').val('');
		$('#private-key-add').attr('disabled', '');
		$('#private-key-remove').attr('disabled', '');
		$('.print-encryption').snazzyHide();
		$('.key-details').animate({opacity: 0}, 300, function() { 
			if (!CoinInfo[CurrentCoinType].manual && !Multiple_Wallets)
				$('.generate-button').snazzyShow();
				
			if (!CoinInfo[CurrentCoinType].manual)
				GenerateButton_Click($('.generate-button').get());
			});
		});
	}

function WalletContains(CoinType, Key)
	{
	for (var i = 0; i < KeyWallet.length; i++)
		{
		if (KeyWallet[i].coinType == CoinType &&
			(KeyWallet[i].key == Key || KeyWallet[i].encryptedKey == Key))
			{
			return true;
			}
		}
		
	return false;
	}
	
function DisplayWallets()
	{
	var Keys = '';
	for (var i = 0; i < KeyWallet.length; i++)
		{
		var Key = KeyWallet[i];
		
		var IsCurrentKey = (CurrentKey == KeyWallet[i]) ? ' current-key' : '';
		
		Keys += '<div class="key' + IsCurrentKey+ '" data="' + i + '">';		
		Keys += '<a>';
		Keys += '<div class="wallet-coin-type ' + Key.coinType + '-coin coin"></div>';
		Keys += '<div class="address">' + Key.address + '</div>';
		
		if (Key.encryptedKey != undefined && Key.encryptedKey != '')
			Keys += '<div class="encrypted"></div>';
		if (Key.armoryMode == true)
			Keys += '<div class="armory"></div>';
		if (Key.electrumMode == true)
			Keys += '<div class="electrum"></div>';
			
		
		Keys += '<div class="print-status"></div>';
		Keys += '</a>';
		Keys += '</div>';
		}
		
	$('.key-wallet .keys').html(Keys);
	$('.key-wallet .key-count').html(KeyWallet.length);
	
	if (KeyWallet.length == 0)
		$('.key-wallet').addClass('empty');
	else
		$('.key-wallet').removeClass('empty');	
		
	$('.key-wallet .key.current-key').mouseenter(function() 
	{
			$(this).parent().find('.key:not(.current-key)').show().animate({height: 36, opacity: 1, 'margin-bottom': 5});
	});	
	
	$('.key-wallet .key').bind('click', function() 
		{
		if ($(this).hasClass('current-key'))
			{
			if (KeyWallet.length > 1)
				return true;
			else
				return false;
			}
			
		var index = parseInt($(this).attr('data'));
		
		CurrentKey = KeyWallet[index];
		
		var cointype = $('.coin-type .coin.selector[data=' + CurrentKey.coinType + ']');
				
		if (!cointype.hasClass('active'))
			{			
			var Width = $('.coin-type').attr('colwidth');
			
			$('.coin-type .coin-grid-row.active').removeClass('active');
			$('.coin-type .coin.active').removeClass('active');
			$('.coin-type .coin-grid-row:not(.active)').css('height', '0');
			cointype.css('width', Width).css('height', 'inherit').addClass('active');
			cointype.parent().css('height', 'inherit').addClass('active');
			
			ChangeCoinType(CurrentKey.coinType, false);
			}
		
		$('#private-key-remove').val('Remove Key');
			
		if (CoinInfo[CurrentKey.coinType].manual)
			{
			$('#private-key-address-manual').val(CurrentKey.address);
			$('#private-key-input').val(CurrentKey.key);
			$('#private-key-input').change();
			}
		else if (CurrentKey.armoryMode)
			{
			$('#private-key-armory').val(CurrentKey.key);
			$('#private-key-armory').change();
			
			if (!ArmoryMode)
				ShowArmory(true, true, false);
			}
		else if (CurrentKey.electrumMode)
			{
			$('#private-key-electrum').val(CurrentKey.key);
			$('#private-key-electrum').change();
			
			if (!ElectrumMode)
				ShowArmory(true, true, false);
			}
		else
			{
			if (ElectrumMode)
				ShowArmory(false, false, false);
			if (ArmoryMode)
				ShowArmory(false, false, false);
				
			$('#private-key-input').val(CurrentKey.key);
			
			DisplayWallet(CurrentKey.coinType, CurrentKey.key, CurrentKey.address, CurrentKey.encryptedKey);
			
			/*
			$('#private-key-input').change();
			
			setTimeout(function() {
			if (CurrentKey.encryptedKey != undefined && CurrentKey.encryptedKey != '')
				{
				DisplayWallet(CurrentKey.coinType, CurrentKey.key, CurrentKey.address, CurrentKey.encryptedKey);
				}			
				},1000);
			*/
			}
			
		if (Multiple_Wallets)
			$('.generate-button').snazzyHide();
		
		$('.key-wallet .key.current-key').removeClass('current-key');
		$(this).addClass('current-key');
		
		$(this).parent().find('.key:not(.current-key)').animate({height: 0, opacity: 0}, 300, function() { 
			DisplayWallets();
			$('.key-wallet').removeClass('expand-y')
			});
			
		return false;
		});
	}
	