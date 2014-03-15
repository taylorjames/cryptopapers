 
var Security_IsOnline = true;
var Security_Cookies = true;

var Security_LiveCD = false
var Security_OfflinePermanent = false;
var Security_LocalPrinter = false;
var Security_OfflinePrinter = false;
var Security_PrinterHistory = false;
var Security_GenerateImport = false;
var Security_ManualVerify = false;

 
 function InitSecurityPage()
	{
	TestEnvironment();
	
	$('#js-test-refresh').click(function() 
		{
		TestEnvironment();
		});
		
	$('input[name=security-live-cd]').change(function() 
		{
		Security_LiveCD = $(this).val() == "Yes";
		UpdateSecurityTrust();
		});
	$('input[name=security-offline-permanent]').change(function() 
		{
		Security_OfflinePermanent = $(this).val() == "Yes";
		UpdateSecurityTrust();
		});
	$('input[name=security-local-printer]').change(function() 
		{
		Security_LocalPrinter = $(this).val() == "Yes";
		UpdateSecurityTrust();
		});
	$('input[name=security-offline-printer]').change(function() 
		{
		Security_OfflinePrinter = $(this).val() == "Yes";
		UpdateSecurityTrust();
		});
	$('input[name=security-printer-history]').change(function() 
		{
		Security_PrinterHistory = $(this).val() == "Yes";
		UpdateSecurityTrust();
		});
	$('input[name=security-generate-import]').change(function() 
		{
		Security_GenerateImport = $(this).val() == "Yes";
		UpdateSecurityTrust();
		});
	$('input[name=security-manual-verify]').change(function() 
		{
		Security_ManualVerify = $(this).val() == "Yes";
		UpdateSecurityTrust();
		});
	
	var ScrollOffset = -50;
	
	$('.trust-bugs').click(function()
		{
		$('html, body').animate({
			scrollTop: $(".risk-category.bugs").offset().top + ScrollOffset
		}, 300);
		});
	$('.trust-your-network').click(function()
		{
		$('html, body').animate({
			scrollTop: $(".risk-category.your-network").offset().top+ ScrollOffset
		}, 300);
		});
	$('.trust-your-printer').click(function()
		{
		$('html, body').animate({
			scrollTop: $(".risk-category.your-printer").offset().top+ ScrollOffset
		}, 300);
		});
	$('.trust-your-browser').click(function()
		{
		$('html, body').animate({
			scrollTop: $(".risk-category.your-browser").offset().top+ ScrollOffset
		}, 300);
		});
	$('.trust-your-os').click(function()
		{
		$('html, body').animate({
			scrollTop: $(".risk-category.your-os").offset().top+ ScrollOffset
		}, 300);
		});
	$('.trust-this-tool').click(function()
		{
		$('html, body').animate({
			scrollTop: $(".risk-category.this-tool").offset().top+ ScrollOffset
		}, 300);
		});
	}
	
	
function TestEnvironment()
	{
	Security_IsOnline = navigator.onLine;
	Security_Cookies = navigator.cookieEnabled;
	
    if (typeof navigator.cookieEnabled == "undefined" && !cookieEnabled)
		{ 
		try
			{
			document.cookie= "testcookie";
			Security_Cookies = (document.cookie.indexOf("testcookie") != -1) ? true : false;
			}
		catch(ex)
			{
			Security_Cookies = false;
			}
		}
	
	if (Security_IsOnline)
		{
		$('.security-offline-permanent input, .security-offline-permanent a').attr('disabled', '');
		$('.security-offline-printer input, .security-offline-printer a').attr('disabled', '');
		
		$('#security-local-printer-no').click();
		$('.security-local-printer input, .security-local-printer a').attr('disabled', '');
		
		$('#internet-status').removeClass('disabled').addClass('enabled').html('Online');
		}
	else
		{
		$('.security-offline-permanent input, .security-offline-permanent a').removeAttr('disabled');
		$('.security-offline-printer input, .security-offline-printer a').removeAttr('disabled');
		
		$('.security-local-printer input, .security-local-printer a').removeAttr('disabled');
		$('#security-local-printer-yes').click();
		
		
		$('#internet-status').removeClass('enabled').addClass('disabled').html('Offline');
		}
		
	if (Security_Cookies)
		$('#cookie-status').removeClass('disabled').addClass('enabled').html('Enabled');
	else
		$('#cookie-status').removeClass('enabled').addClass('disabled').html('Disabled');
		
	UpdateSecurityTrust();
	}
	
	
function UpdateSecurityTrust()
	{
	$('.risk').removeClass('safe').addClass('at-risk');
	$('.trust-item').removeClass('trust-level-fully').removeClass('trust-level-some').removeClass('trust-level-zero');
	
	var ZeroTrust = true;
	
	
	// -- Infections --
	if (!Security_IsOnline)
		{
		$('#risk-infection-online').addClass('safe');
		
		if (Security_OfflinePermanent || Security_LiveCD)
			{
			$('#risk-infection-offline').addClass('safe');
			
			$('.trust-bugs').addClass('trust-level-zero');
			}	
		else
			{
			$('.trust-bugs').addClass('trust-level-some');
			ZeroTrust = false;
			}
		}
	else
		{
		$('.trust-bugs').addClass('trust-level-fully');
		ZeroTrust = false;
		}
		
	// -- Network --
	if (Security_LocalPrinter)
		{
		$('#risk-network-printer').addClass('safe');
		
		$('.trust-your-network').addClass('trust-level-zero');
		}
	else
		{
		$('.trust-your-network').addClass('trust-level-fully');
		ZeroTrust = false;
		}
		
		
	// -- Printer --
	if (Security_LocalPrinter || Security_PrinterHistory)
		{
		$('#risk-printer-online-storage').addClass('safe');
		
		if (Security_OfflinePrinter || Security_PrinterHistory)
			{
			$('#risk-printer-offline-storage').addClass('safe');
			
			$('.trust-your-printer').addClass('trust-level-zero');
			}
		else
			{
			$('.trust-your-printer').addClass('trust-level-some');
			ZeroTrust = false;
			}
		}
	else
		{
		$('.trust-your-printer').addClass('trust-level-fully');
		ZeroTrust = false;
		}
		
	// -- Browser --
	if (!Security_IsOnline)
		{
		$('#risk-browser-addons-online').addClass('safe');
		
		if (Security_OfflinePermanent)
			{
			$('#risk-browser-addons-offline').addClass('safe');
			
			$('.trust-your-browser').addClass('trust-level-zero');
			}
		else
			{
			$('.trust-your-browser').addClass('trust-level-some');
			ZeroTrust = false;
			}
		}
	else
		{
		$('.trust-your-browser').addClass('trust-level-fully');
		ZeroTrust = false;
		}
		
	// -- OS --
	if (!Security_IsOnline)
		{
		$('#risk-os-online').addClass('safe');
		
		if (Security_OfflinePermanent)
			{
			$('#risk-os-offline').addClass('safe');
			
			$('.trust-your-os').addClass('trust-level-zero');
			}
		else
			{
			$('.trust-your-os').addClass('trust-level-some');
			ZeroTrust = false;
			}
		}
	else
		{
		$('.trust-your-os').addClass('trust-level-fully');
		ZeroTrust = false;
		}
		
	// -- This Tool --
	if (!Security_IsOnline)
		{
		$('#risk-this-tool-online').addClass('safe');
		
		if (!Security_Cookies || Security_OfflinePermanent)
			{
			$('#risk-this-tool-offline-cookies').addClass('safe');
			}
		}
	if (Security_GenerateImport)
		{
		$('#risk-this-tool-badrng').addClass('safe');
		}
	if (Security_ManualVerify)
		{
		$('#risk-this-tool-badcodes').addClass('safe');
		}
		
	if (!Security_IsOnline && (!Security_Cookies || Security_OfflinePermanent) && Security_GenerateImport && Security_ManualVerify)
		{
		$('.trust-this-tool').addClass('trust-level-zero');
		}
	else if (!Security_IsOnline || Security_GenerateImport || Security_ManualVerify)
		{
		$('.trust-this-tool').addClass('trust-level-some');
		ZeroTrust = false;
		}
	else
		{
		$('.trust-this-tool').addClass('trust-level-fully');
		ZeroTrust = false;
		}
		
	if (ZeroTrust && $('.zero-trust-seal').hasClass('hidden'))
		{
		$('.coin-wallet').addClass('zero-trust');
		$('.zero-trust-seal').removeClass('hidden');
		$('.zero-trust-seal').fadeIn();
		}
	else if (!ZeroTrust && !$('.zero-trust-seal').hasClass('hidden'))
		{
		$('.coin-wallet').removeClass('zero-trust');
		$('.zero-trust-seal').fadeOut();
		$('.zero-trust-seal').addClass('hidden');
		}
	
	}