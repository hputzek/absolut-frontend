(function (document) {
  'use strict';


  // Grab a reference to our auto-binding template
  // and give it some initial binding values
  // Learn more about auto-binding templates at http://goo.gl/Dx1u2g
  var app = document.querySelector('#app');
  app.appName = 'Tablettieren, bitte!';

  // Listen for template bound event to know when bindings
  // have resolved and content has been stamped to the page
  app.addEventListener('template-bound', function() {
		$('#programChange').on('core-activate',function(e,detail){
			activeProgram = e.currentTarget.selectedIndex_ +1;
			loadStep();
		});
	  updateStep(activeProgram);
	  handlePrevious();
	  handleNext();
	  leds = $('tablet-glass');
  });

	var programs = createArray(4,16,16);
	var activeProgram = 1;
	var activeStep = 1;
	var leds = 0;
	var output = "";
	saveStep();



	function randomize(){
		console.log('Our app is ready to rock!');
		setInterval(function () {
			document.querySelector('#mytablet').leds[Math.floor((Math.random() * 16))] = Math.floor((Math.random() * 255) + 1);
		}, 100);
	}

	function createArray(length) {
		var arr = new Array(length || 0),
			i = length;

		if (arguments.length > 1) {
			var args = Array.prototype.slice.call(arguments, 1);
			while(i--) arr[length-1 - i] = createArray.apply(this, args);
		}

		return arr;
	}

	function handlePrevious(){
		$('#previous').click(function(){
			saveStep();
			if(activeStep > 1){
				activeStep --;
			}
			else {
				activeStep = 16;
			}
			console.log('prev');
			loadStep();
			updateStep(activeStep);
		});
	}
	function handleNext(){
		$('#next').click(function(){
			saveStep();
			if(activeStep < 16){
				activeStep ++;
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
			programs[activeProgram-1][activeStep-1][i]= $(leds[i]).attr('lightness');
		}
	}

	function loadStep() {
		for (var i = 0; i < 16; i++) {
			if(programs[activeProgram-1][activeStep-1][i] == undefined){
				$(leds[i]).attr('lightness',0);
			}
			else {
				$(leds[i]).attr('lightness',programs[activeProgram-1][activeStep-1][i]);
			}

		}
	}

	function showOutput() {
		// generate Output here
	}


	function updateStep(stepNumber){
		$('#step').attr('value',100/16*stepNumber);
		$('#stepNumber').attr('value',stepNumber);
		console.log(stepNumber);
	}

// wrap document so it plays nice with other libraries
// http://www.polymer-project.org/platform/shadow-dom.html#wrappers
})(wrap(document));
