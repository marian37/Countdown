var socket = io();

var zeroDate = new Date(0, 0, 0, 0, 0, 0, 0);
var redBg = 0;
var color = "red";

$(function() {
	if (window.location.pathname == "/") {
		socket.emit("join");
	}

	$("#playPause").on("click", function() {
		socket.emit("playPause");
	});
	$("#reset").on("click", function() {
		socket.emit("reset");
		color = "red";
		$(".top").css("background-color", color);
		$(".buttons").css("background-color", color);
	});
	$("#settings").on("click", function() {
		socket.emit("leave");
		window.location = "/settings";
	});

	socket.on("playPause", function(response) {
		playPauseSetText(response.running);
	});

	socket.on("tick", function(data) {
		if (new Date(data.countdown) <= zeroDate) {
			$(".top > .time").text('-' + new Date(2 * zeroDate.getTime() - new Date(data.countdown).getTime()).toLocaleTimeString('sk-SK', {hour12 : false}));			
			if (data.running) {
				if (redBg == 0) {
					color = "red";
				} else {
					color = "#FF4000";
				}
				$(".top").css("background-color", color);
				$(".buttons").css("background-color", color);
				redBg ^= 1;
			}
		} else {
			$(".top > .time").text(new Date(data.countdown).toLocaleTimeString('sk-SK', {hour12 : false}));
		}
		$(".bottom > .time").text(new Date(data.time).toLocaleTimeString('sk-SK', {hour12 : false}));
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
