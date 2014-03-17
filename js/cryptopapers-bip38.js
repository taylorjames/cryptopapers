
function InitBIP38()
	{
	$('#encryption-key, #encryption-key-confirm').keyup(function()
		{
		if ($(this).val() != '' && $('#encryption-key').val() == $('#encryption-key-confirm').val())
			{
			$('#encrypt-button').removeClass('error');
			$('#encrypt-button').removeAttr('disabled');
			}
		else if ($(this).val() != '' && $('#encryption-key').val().length == $('#encryption-key-confirm').val().length)
			{
			$('#encrypt-button').addClass('error');
			$('#encrypt-button').attr('disabled', '');
			}
		else
			{
			$('#encrypt-button').removeClass('error');
			$('#encrypt-button').attr('disabled', '');
			}
		})
	
	$('#encrypt-button').click(function() 
		{
		$('#encrypt-button').attr('disabled', '');
		$('.encrypting').fadeIn(300);
		
		var CoinType = CurrentCoinType;
		var Address = $('#public-address').val();
		var Key = $('#encryption-key').val();
		var WIF = $('#unencrypted-key').val();
		var Compressed = $('input[name=compression]:checked').val() == "Yes";
				
		$('#encryption-key').val('');
		$('#encryption-key-confirm').val('');
		
		$('.encryption-keys').snazzyHide();
			
		$('.encryption-details').snazzyShow();
		
		$('.encrypting').fadeIn(300);
		
		Bitcoin.BIP38.PrivateKeyToEncryptedKeyAsync(WIF, Key, Compressed, Address, function (o, n)
			{			
			DisplayWallet(CoinType, o, Address, true);
			
			$('.encrypting').fadeOut(300);
			
			$('.encrypted').fadeIn(300);
			
			$('#encrypt-remove-button').removeAttr('disabled');
			})
		});
		
	$('#encrypt-remove-button').click(function()
		{		
		$('#encryption-key').val('');
		$('#encryption-key-confirm').val('');
		
		var WIF = $('#unencrypted-key').val();
		var Address = $('#public-address').val();
		
		$('.encryption-details').snazzyHide(300,  function() 
			{			
			$('#encrypt-remove-button').attr('disabled', '');
			});
			
		$('.encryption-keys').snazzyShow();
			
		$('.encrypted').fadeOut(300);
			
		
		DisplayWallet(CurrentCoinType, WIF, Address, false);
		});
		
	$('#decrypt-password').keyup(function ()
		{
		if ($(this).val().length > 0)
			{
			$('#private-key-decrypt').removeAttr('disabled');
			}
		else
			{
			$('#private-key-decrypt').attr('disabled', '');
			}
		});
		
	$('#private-key-decrypt').click(function ()
		{
		$('#private-key-decrypt').attr('disabled', '');
		$('.decrypt-key .progress').fadeIn(300);
		
		$(".decrypt-key .key-error").fadeOut(300, function ()
			{
			$(this).hide();
			});
		
		var Key = $('#private-key-input').val();
		var Password = $('#decrypt-password').val();
		
		$('#decrypt-password').val('');		
		
		try
			{
			Bitcoin.BIP38.EncryptedKeyToByteArrayAsync(Key, Password, function (n, o)
				{	
				$('#private-key-decrypt').removeAttr('disabled');
				$('.decrypt-key .progress').fadeOut(300);
									
				if (n != null && n.length > 0)
					{
					if (n.length == 32)
						n = Crypto.util.bytesToHex(n);
						
					// success
					$('.key-success').fadeIn(300, function()
						{
						setTimeout(function()
							{
							$('.key-success').fadeOut(300, function()
								{
								$('#private-key-input').val(n);
								$('#private-key-input').change();
								});
							},600);
						});
						
					}
				else
					{
					$(".decrypt-key .key-error").show().fadeIn(300);
					}
				})
			}
		catch (k)
			{
			$('#private-key-decrypt').removeAttr('disabled');
			Log(k);
			$(".decrypt-key .key-error").show().fadeIn(300);
			}
		});
		
	}
