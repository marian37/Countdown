var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var countdown = require('./countdown');

var defaultCountdown = new Date(0, 0, 0, 0, 30, 0, 0);
var defaultCountdownTitle = "Prednáška";
var defaultTimeTitle = "Aktuálny čas";

app.use(express.static('public'));
app.set('view engine', 'ejs');
countdown.setCountdown(defaultCountdown);

app.get('/', function(req, res) {
	var playPause = "Play";
	if (countdown.getRunning()) {
		playPause = "Pause";
	}
	res.render("index", {
		countdownTitle: defaultCountdownTitle,
		countdown: new Date(countdown.countdown).toLocaleTimeString(),
		timeTitle: defaultTimeTitle,
		time: new Date(countdown.time).toLocaleTimeString(),
		playPause: playPause
	});
});

app.get('/settings', function(req, res) {
	var countdownTime = countdown.countdown;
	res.render("settings", {
		countdownTitle: defaultCountdownTitle,
		timeTitle: defaultTimeTitle,
		countdownHours: countdownTime.getHours(),
		countdownMinutes: countdownTime.getMinutes(),
		countdownSeconds: countdownTime.getSeconds(),
	});
});

io.on("connection", function(socket) {
	socket.on("playPause", function() {
		var running = countdown.playPause();
		io.emit("playPause", {
			running: running
		});
	});
	socket.on("reset", function() {
		countdown.setCountdown(defaultCountdown);
		socket.emit("tick", {
			countdown: countdown.countdown,
			time: countdown.time,
		});
	});
	socket.on("save", function(data) {
		if (data.countdown != "") {
			defaultCountdown = data.countdown;
		}
		if (data.countdownTitle != "") {
			defaultCountdownTitle = data.countdownTitle;
		}
		if (data.timeTitle != "") {
			defaultTimeTitle = data.timeTitle;
		}

		io.emit("titleChange", {
			countdownTitle: defaultCountdownTitle,
			timeTitle: defaultTimeTitle
		});
	});
	socket.on("join", function() {
		socket.join("countdown");
	});
	socket.on("leave", function() {
		socket.leave("countdown");
	});
});

function myTimer() {
	io.to("countdown").emit("tick", {
		countdown: countdown.countdown,
		time: countdown.time,
	});
}
setInterval(myTimer, 1000);

var server = http.listen(8080);
