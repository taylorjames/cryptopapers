
var sayCheese;

var VerifyResult = undefined;
var VerifyResult2 = undefined;
var VerifyResult3 = undefined;

function InitQRRead()
	{
	$('.qr-icon').click(function () {
		
		if($(this).attr('for') != undefined && $(this).attr('for') != '')
			{
			if (sayCheese == undefined)
				{
				sayCheese = new SayCheese('.webcam-area', { snapshots: true });
					
				sayCheese.on('start', function() {
					 // do something when started					
					FirstResult = undefined;
					
					SnapShotLoop_Stop = false;
					SnapShotLoop();
					});

				sayCheese.on('stop', function() {
					 // do something when started
					
					SnapShotLoop_Stop = true;
					});

					
				sayCheese.on('error', function(error) {
					 // handle errors, such as when a user denies the request to use the webcam,
					 // or when the getUserMedia API isn't supported
					 Log(error);
					});

				sayCheese.on('snapshot', function(snapshot) {
					$('.webcam-area #qr-canvas').remove();
					$('.webcam-area').append(snapshot);
					
					setTimeout(function() {
					
						try
							{
							var Decode = qrcode.decode();
							
							var confirm = (Decode == VerifyResult && Decode == VerifyResult2 && Decode  == VerifyResult3) ? 4 :
								(Decode == VerifyResult && Decode  == VerifyResult2) ? 3 : 
								(Decode == VerifyResult) ? 2 : 1;
								
							$('.qr-webcam .result').html('Found (' + confirm + '/4): <b>' + Decode + '</b>');
														
							setTimeout(function()
								{
								var Input = '#' + $('.qr-webcam').attr('sender');
								
								// Require 3 identical reads to validate the QR. This really helps with bad scans.
								if (Decode != '' && confirm == 4)
									{
									VerifyResult = '';
									VerifyResult2 = '';
									VerifyResult3 = '';
									
									$('.qr-webcam .result').html('');
									
									$(Input).val(Decode);
									
									SnapShotLoop_Stop = true;
									
									sayCheese.stop();
									
									sayCheese = undefined;
									
									$('.qr-webcam .close-button').click();
									
									$(Input).change();
									}
								else
									{
									VerifyResult3 = VerifyResult2;
									VerifyResult2 = VerifyResult;
									VerifyResult = Decode;
									}
								
								}, 700);
							}
						catch(ex)
							{
							Log('decode error' + ex);
							}
						
						}, 3);
					});
				}
				
			$('.qr-webcam').snazzyShow(200);
			$('.qr-webcam').attr('sender',$(this).attr('for'));
		
			sayCheese.start();
			
			$('.webcam-area video').remove();
			$('.webcam-area #qr-canvas').remove();
			}
			
		});
		
	$('.qr-webcam .close-button').bind('click', function() {
	
		if (sayCheese != undefined)
			{
			SnapShotLoop_Stop = true;
			
			sayCheese.stop();
			
			sayCheese = undefined;
			}
		});
	
/*
	$('#qr-scan-button').click(function() {
		sayCheese.takeSnapshot(640,480);
	});
*/
	}
	
var SnapShotLoop_Stop = false;

function SnapShotLoop()
	{
	if (!$('.qr-webcam').allVisible() || SnapShotLoop_Stop)
		{		
		if (sayCheese)		
			{
			sayCheese.stop();		
			sayCheese = undefined;
			}
			
		return;
		}
		
	
	sayCheese.takeSnapshot(640,480);
		
	setTimeout(function() {
		SnapShotLoop();
		}, 500);
	}