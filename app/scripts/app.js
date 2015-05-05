(function (document) {
	'use strict';

	// Grab a reference to our auto-binding template
	// and give it some initial binding values
	// Learn more about auto-binding templates at http://goo.gl/Dx1u2g
	var app = document.querySelector('#app');
	app.appName = 'Tablettieren, bitte!';

	// Listen for template bound event to know when bindings
	// have resolved and content has been stamped to the page
	app.addEventListener('template-bound', function () {
		$('#programChange').on('core-activate', function (e, detail) {
			activeProgram = e.currentTarget.selectedIndex_ + 1;
			loadStep();
		});
		setupLocalStorage();
		handlePrevious();
		handleNext();
		handlePlayControls();
		handleExport();
		leds = $('tablet-glass');

		loadStep();
		updateStep(activeStep);

	});
	var timer = $.timer(1000, function () {
		saveStep();
		if (activeStep < 16) {
			activeStep++
		}
		else {
			activeStep = 1;
		}
		loadStep();
		updateStep(activeStep);
	});
	timer.stop();
	var programs = createArray(4, 16, 16);
	var activeProgram = 1;
	var activeStep = 1;
	var leds = 0;
	var output = "";
	saveStep();


	function handleExport(){
		$('.export').click(function(e){
			if($(this).hasClass('active')){
				$(this).removeClass('active');
				$('.export-window').fadeOut();
			}
			else {
				$('#exportTextField').val(showOutput());
				$(this).addClass('active');
				$('.export-window').fadeIn();
			}

		});
	}

	function randomize() {
		console.log('Our app is ready to rock!');
		setInterval(function () {
			document.querySelector('#mytablet').leds[Math.floor((Math.random() * 16))] = Math.floor((Math.random() * 255) + 1);
		}, 100);
	}

	function handlePlayControls() {
		$('#play').click(function () {
			timer.reset();
		});
		$('#stop').click(function () {
			timer.stop();
		});
		$('#speed').on('core-change', function () {
			timer.reset($(this).attr('aria-valuenow'));
		});
	}

	function setupLocalStorage() {
		programs = loadFromLocalStorage('programs',programs);
		activeProgram = loadFromLocalStorage('activeProgram',activeProgram);
		activeStep = loadFromLocalStorage('activeStep',activeStep);
		$('#programChange').prop('selected',activeProgram-1);
		console.log(activeProgram-1);

		window.onbeforeunload = function () {
			saveStep(activeStep);
			saveToLocalStorage('programs',programs);
			saveToLocalStorage('activeProgram',activeProgram);
			saveToLocalStorage('activeStep',activeStep);
		};
	}


	function saveToLocalStorage(name,value){
		$.totalStorage(name,value);
	}

	function loadFromLocalStorage(name,fallback){
		var returnValue = $.totalStorage(name);
		console.log(returnValue);
		if(returnValue != null) {
			return returnValue;
		}
		else {
			return fallback;
		}
	}

	function createArray(length) {
		var arr = new Array(length || 0),
			i = length;

		if (arguments.length > 1) {
			var args = Array.prototype.slice.call(arguments, 1);
			while (i--) {
				arr[length - 1 - i] = createArray.apply(this, args);
			}
		}

		return arr;
	}

	function handlePrevious() {
		$('#previous').click(function () {
			saveStep();
			if (activeStep > 1) {
				activeStep--;
			}
			else {
				activeStep = 16;
			}
			console.log('prev');
			loadStep();
			updateStep(activeStep);
		});
	}

	function handleNext() {
		$('#next').click(function () {
			saveStep();
			if (activeStep < 16) {
				activeStep++;
			}
			else {
				activeStep = 1;
			}
			loadStep();
			updateStep(activeStep);
		});
	}

	function saveStep() {
		for (var i = 0; i < 16; i++) {
			programs[activeProgram - 1][activeStep - 1][i] = $(leds[i]).attr('lightness');
		}
	}

	function loadStep() {
		for (var i = 0; i < 16; i++) {
			if (programs[activeProgram - 1][activeStep - 1][i] == undefined) {
				$(leds[i]).attr('lightness', 0);
			}
			else {
				$(leds[i]).attr('lightness', programs[activeProgram - 1][activeStep - 1][i]);
			}
		}
	}

	function showOutput() {
		var o = '{\n';
		// generate Output here
		for (var p = 0; p < 4; p++) {
			o += '{\n';
			for (var s = 0; s < 16; s++) {
				o += '{';
				o += programs[p][s].toString();
				o += '}';
				if (s <= 14) {
					o += ',';
				}
			}
			o += '\n}';
			if (p < 3) {
				o += ',\n';
			}
		}
		o += '\n}';
		return o;
	}

	function updateStep(stepNumber) {
		$('#step').attr('value', 100 / 16 * stepNumber);
		$('#stepNumber').html(stepNumber);
	}

// wrap document so it plays nice with other libraries
// http://www.polymer-project.org/platform/shadow-dom.html#wrappers
})(wrap(document));
