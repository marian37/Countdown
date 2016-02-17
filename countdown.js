var timer = setInterval(myTimer, 1000);
var zeroTime = new Date(0, 0, 0, 0, 0, 0, 0);
var countdown = zeroTime;
var running = false;

function myTimer() {
	exports.time = new Date();
	if (running) {
		if (countdown - 1000 >= zeroTime) {
			countdown -= 1000;
		} else {
			countdown = zeroTime;
		}
	}
	exports.countdown = new Date(countdown);
}

exports.playPause = function() {	
	return running = !running;
}

exports.setCountdown = function(newCountdown) {
	countdown = new Date(newCountdown);
}

exports.getRunning = function() {
	return running;
}
