var socket = io();

$(function() {
	var timer = setInterval(myTimer, 1000);

	if (window.location.pathname == "/settings") {
		clearInterval(timer);
	}

	$("#playPause").on("click", function() {
		socket.emit("playPause");
	});
	$("#reset").on("click", function() {
		socket.emit("reset");
	});
	$("#settings").on("click", function() {
		window.location = "/settings";
	});

	socket.on("playPause", function(response) {
		playPauseSetText(response.running);
	});

	socket.on("tick", function(data) {
		$(".top > .time").text(new Date(data.countdown).toLocaleTimeString());
		$(".bottom > .time").text(new Date(data.time).toLocaleTimeString());
	});

	socket.on("titleChange", function(data) {
		$(".top > .title").text(data.countdownTitle);
		$(".bottom > .title").text(data.timeTitle);
	});

	$("#save").on("click", function() {
		var countdownTitle = check(document.getElementsByName('countdown-title')[0].value, "title");
		var timeTitle = check(document.getElementsByName('time-title')[0].value, "title");

		var hours = check(document.getElementsByName('countdown-hours')[0].value, "hours");
		var minutes = check(document.getElementsByName('countdown-minutes')[0].value, "minutes");
		var seconds = check(document.getElementsByName('countdown-seconds')[0].value, "seconds");

		var countdown = new Date(0, 0, 0, hours, minutes, seconds, 0);
		
		socket.emit("save", {
			countdownTitle: countdownTitle,
			timeTitle: timeTitle,
			countdown: countdown
		});

		window.location = "/";
	});

	$("#cancel").on("click", function() {
		window.location = "/";
	});
});

function myTimer() {
	socket.emit("tick");
}

function playPauseSetText(running) {
	if (running) {
		$("#playPause").text("Pause");
	} else {
		$("#playPause").text("Play");
	}
}

function check(string, type) {
	string = string.trim();
	string = string.replace("\"", "\\\"");

	var reg = /^[0-9]+$/;
	
	switch (type) {
		case "title":
			return string;
		case "hours":			
			if (reg.test(string) && string < 24) {
				return string;
			} else {
				return 0;
			}
		case "minutes":
		case "seconds":
			if (reg.test(string) && string < 60) {
				return string;
			} else {
				return 0;
			}
	}
}
