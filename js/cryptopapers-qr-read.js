
var sayCheese;

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
					Log('started');
					
					SnapShotLoop_Stop = false;
					SnapShotLoop();
					});

				sayCheese.on('stop', function() {
					 // do something when started
					
					Log('stopped');
					
					SnapShotLoop_Stop = true;
					});

					
				sayCheese.on('error', function(error) {
					 // handle errors, such as when a user denies the request to use the webcam,
					 // or when the getUserMedia API isn't supported
					 Log(error);
					});

				sayCheese.on('snapshot', function(snapshot) {
					Log(snapshot);
					$('.webcam-area #qr-canvas').remove();
					$('.webcam-area').append(snapshot);
					
					setTimeout(function() {
					
						try
							{
							var Decode = qrcode.decode();
							
							Log('decode: ' + Decode);
							$('.qr-webcam .result').html('Found: <b>' + Decode + '</b>');
														
							setTimeout(function()
								{
								var Input = '#' + $('.qr-webcam').attr('sender');
								
								$('.qr-webcam .result').html('');
								
								$(Input).val(Decode);
								
								SnapShotLoop_Stop = true;
								
								sayCheese.stop();
								
								sayCheese = undefined;
								
								$('.qr-webcam .close-button').click();
								
								$(Input).change();
								
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
		
		Log(sayCheese);
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