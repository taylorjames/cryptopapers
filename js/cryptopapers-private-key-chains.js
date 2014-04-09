 
var ChainMode = false;
var ArmoryMode = false;
var ElectrumMode = false;

var LastInput_Armory = '';
var LastInput_Electrum = '';
var LastInput_ElectrumRoot = '';

var ChainSet = 0;

function InitKeyChains()
	{
	$('input[name=electrum-change]').change(function()
		{
		LastInput = '';
		$('#private-key-input').change();		
		});
		
	$('.chain-set-last').click(function() 
		{
		ChainSetLast_Click(this);
		});
		
	$('.chain-set-next').click(function() 
		{
		ChainSetNext_Click(this);
		});
	
	$('#private-key-electrum-root').keyup(function() 
		{
		$('#private-key-electrum-root').change();
		});
	$('#private-key-electrum-root').change(function() 
		{
		PrivateKeyElectrumRoot_Change(this);
		});
	
	$('#private-key-electrum').keyup(function() 
		{
		//$('#private-key-electrum').change();
		});
		
	$('#private-key-electrum').change(function() 
		{
		PrivateKeyElectrum_Change(this);
		});
		
	$('.electrum-icon.toggle').click(function()
		{
		ElectrumIconToggle_Click(this);
		});
		
	$('#private-key-armory').mask('xxxx xxxx xxxx xxxx xxxx xxxx xxxx xxxx xxxx\n' + 
												'xxxx xxxx xxxx xxxx xxxx xxxx xxxx xxxx xxxx');
	
	$('#private-key-armory').keyup(function() 
		{
		$('#private-key-armory').change();
		});
		
	$('#private-key-armory').change(function() 
		{
		PrivateKeyArmory_Change(this);
		});
		
	$('.armory-icon.toggle').click(function()
		{
		ArmoryIconToggle_Click(this);
		});
	}
	
function ShowElectrum(Show, ElectrumChange, PKChange)
	{
	var Switch = false;
	if (Show)
		{		
		if (!ElectrumMode)
			Switch = true;
		
		if (ArmoryMode)
			{
			ShowArmory(false, false, false);
			}
			
		ChainMode = true;
		ElectrumMode = true;
		
		$('.key-import .private-key').snazzyHide();
		$('.key-import .electrum').snazzyShow();
		$('.electrum-icon.toggle').animate({opacity: 1}, 300);
		$('.electrum-icon.toggle').addClass('selected');
		
		if ($('#private-key-electrum-root').val().length == 0 && $('#private-key-input').val().length == 64)
			{
			if ($('#private-key-electrum-root').val() != $('#private-key-input').val().substr(0,32))
				{
				PKChange = true;
				$('#private-key-electrum-root').val($('#private-key-input').val().substr(0,32));
				}
			}
		else
			{
			}
		
		if (PKChange && $('#private-key-electrum-root').val().length == 32)
			{
			// Forces keys to regenerate only if codes are changed
			$('#private-key-electrum-chain-key').val('');
			$('#private-key-electrum-chain-key').attr('for-code', '');
			
			var NewKey = $('#private-key-electrum-root').val();
			
			var Mnemonic = mn_encode(NewKey);

			if ($('#private-key-electrum').val() != Mnemonic)
				{
				$('#private-key-electrum').val(Mnemonic);
				Switch = true;
				}
				
			if ($('#private-key-electrum-root').val() != NewKey)
				{
				$('#private-key-electrum-root').val(NewKey);
				Switch = true;
				}
			}

		if (ElectrumChange && $('#private-key-electrum').val().length > 0)
			{
			// Forces keys to regenerate only if codes are changed
			$('#private-key-electrum-chain-key').val('');
			$('#private-key-electrum-chain-key').attr('for-code', '');
			
			var NewMnemonic = $('#private-key-electrum').val();
			
			var NewKey = mn_decode(NewMnemonic);
			
			if (NewKey.length == 32)
				{					
				if ($('#private-key-electrum-root').val() != NewKey)
					{
					$('#private-key-electrum-root').val(NewKey);
					Switch = true;
					}
				}
			}
			
		if ($('#compressed').is(':checked'))
			{
			$('#decompressed').click();
			return;
			}			
			
		if (Switch)
			{
			LastInput = '';
			$('#private-key-input').change();
			}
		}
	else
		{
		if (ElectrumMode)
			Switch = true;
			
		ChainMode = false;
		ElectrumMode = false;
		$('.key-import .private-key').snazzyShow();
		$('.key-import .electrum').snazzyHide();
		$('.electrum-icon.toggle').animate({opacity: 0.3}, 300);
		$('.electrum-icon.toggle').removeClass('selected');
		
		if (Switch)
			{
			LastInput = '';
			$('#private-key-input').change();
			}
		}
	}

function ShowArmory(Show, ArmoryChange, PKChange)
	{	
	var Switch = false;
	if (Show)
		{
		if (ElectrumMode)
			{
			ShowElectrum(false, false, false);
			}
			
		if (!ArmoryMode)
			Switch = true;
		
		ChainMode = true;
		ArmoryMode = true;
		
		$('.key-import .armory').snazzyShow();
		$('.armory-icon.toggle').animate({opacity: 1}, 300);
		$('.armory-icon.toggle').addClass('selected');
		
	//	$('.switch-toggle.compression input').attr('disabled', '');
	//	$('.switch-toggle.compression a').attr('disabled', '');

		if (PKChange && $('#private-key-hex').val().length == 64 && 
			($('#private-key-armory').val().length == 0  || 
			$('#private-key-armory').val().length == 89))
			{			
			var Easy16Key = ConvertToEasy16(Crypto.util.hexToBytes($('#private-key-hex').val()));

			if ($('#private-key-armory').val() != Easy16Key)
				{
				$('#private-key-armory').val(Easy16Key);
				Switch = true;
				}
			}

		if (ArmoryChange && $('#private-key-armory').val().length == 89
			&& $('#private-key-armory').val().indexOf('_') < 0)
			{
			
			var HexKey = Crypto.util.bytesToHex(ConvertFromEasy16($('#private-key-armory').val()));
			
			if ($('#private-key-input').val() != HexKey)
				{
				$('#private-key-input').val(HexKey);
				Switch = true;
				}
			}
			
		if ($('#compressed').is(':checked'))
			{
			$('#decompressed').click();
			return;
			}			
			
		if (Switch)
			{
			LastInput = '';
			$('#private-key-input').change();
			}
		}
	else
		{
		if (ArmoryMode)
			Switch = true;
			
		ChainMode = false;
		ArmoryMode = false;
		$('.key-import .armory').snazzyHide();
		$('.armory-icon.toggle').animate({opacity: 0.3}, 300);
		$('.armory-icon.toggle').removeClass('selected');
		
		if (Switch)
			{
			LastInput = '';
			$('#private-key-input').change();
			}

	//	$('.switch-toggle.compression input').removeAttr('disabled');
	//	$('.switch-toggle.compression a').removeAttr('disabled');
		}
	}
	
function ChainSetLast_Click(sender)
	{
	if ($('.chain-set-buttons').hasClass('set-1'))
		return;
		
	$('.chain-set-buttons').removeClass('set-'+ (ChainSet+1));
	
	ChainSet--;
	
	LastInput = '';
	$('#private-key-input').change();
	
	$('.chain-set-buttons').addClass('set-'+ (ChainSet+1));
	$('.chain-set-number').html((ChainSet+1));
	}

function ChainSetNext_Click(sender)
	{
	$('.chain-set-buttons').removeClass('set-'+ (ChainSet+1));
	
	ChainSet++;
	
	LastInput = '';
	$('#private-key-input').change();
	
	$('.chain-set-buttons').addClass('set-'+ (ChainSet+1));
	}

function PrivateKeyElectrumRoot_Change(sender)
	{
	if (ElectrumMode)
		{
		var InputElectrumRoot = $('#private-key-electrum-root').val();
		
		if (LastInput_ElectrumRoot == InputElectrumRoot)
			{
			return;
			}
		LastInput_ElectrumRoot = InputElectrumRoot;
		
		ShowElectrum(true, false, true);
		}
	}

function PrivateKeyElectrum_Change(sender)
	{
	if (ElectrumMode)
		{
		var InputElectrum = $('#private-key-electrum').val();
		
		if (LastInput_Electrum == InputElectrum)
			{
			return;
			}
		LastInput_Electrum = InputElectrum;
		
		ShowElectrum(true, true, false);
		}
	}
	
function ElectrumIconToggle_Click(sender)
	{
	if ($(sender).hasClass('selected'))
		{
		ShowElectrum(false, false, false);
		}
	else
		{
		ShowElectrum(true, false, true);
		}
	}
	
function ArmoryIconToggle_Click(sender)
	{
	if ($(sender).hasClass('selected'))
		{
		ShowArmory(false, false, false);
		}
	else
		{
		ShowArmory(true, false, true);
		}
	}
	
function PrivateKeyArmory_Change(sender)
	{
	if (ArmoryMode)
		{
		var InputArmory = $('#private-key-armory').val();
		
		if (LastInput_Armory == InputArmory)
			{
			return;
			}
		LastInput_Armory = InputArmory;
		
		ShowArmory(true, true, false);
		}
	}
	