var logger = require("./ndConsoleLogger");
var config = require("./ndOptions");
var _getStatus = function() {
	var status = {
		positions: []
	};
	var threads = _options.threads;
	status.speed = Math.round(_options.dataReceived / seconds);
	status.completed = Math.round(_options.dataReceived / _options.fileSize * 10000) / 100;
	status.time = Math.round(seconds);
	status.eta = Math.round((_options.fileSize - _options.dataReceived) * seconds / _options.dataReceived);
	threads.getStatus().forEach(function(t) {
		var val = Math.floor((t.position - t.start) * 10000 / (t.end - t.start)) / 100;
		val = val.toString();
		status.positions.push(val);

		//console.log((t.position - t.start) / (t.end - t.start));
	});
	status.data = _options.dataReceived + '/' + _options.fileSize + ' bytes';
	return status;
};

var _showStatus = function() {

	var status = _getStatus();

	if (config.show_download_status) {
		logger.logInline(
		[
			'speed: ', status.speed + 'bps',
			'completed:', status.completed + '% ',
			'time:', status.time + 's',
			'eta:', status.eta + 's',
			'data:', status.data
		//'threads:', status.positions.join('|')
		//Random
		].join(' '));
	}
	seconds += config.status_update_every / 1000;

	//	console.log(threads.getStatus());
};

var _dataReceived = function(data) {
	_options.dataReceived += data;
};

var _start = function() {
	//return;
	timer = setInterval(_showStatus, config.status_update_every);
};

var _stop = function() {
	if (_options.dataReceived != _options.fileSize) {
		console.log('Unsuccessful download');
	}
	_showStatus();
	clearInterval(timer);

};


module.exports = function(options) {
	_options = options;

	seconds = 0;


	return {
		dataReceived: _dataReceived,
		stop: _stop,
		start: _start
	};
};