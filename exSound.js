
// use webKit sound to do things. 

var exNote = require('./exNote');
var exNoteList = require('./exNoteList');
var exSignature = require('./exSignature');


function exSound(sig) {
	this.audioCon = new webkitAudioContext();
	this.oscillator = audioCon.createOscillator();
	this.gainNode = audioCon.createGain(); 
	this.signature = new exSignature(); 
	this.signature.copy(sig); 
	this.hasAudio =0; 


	// c1= midi 24 last note is 7*12 up = 104. I can't hear MIDI<48. Sad, yes, I know. 
	this.freqs = new Array( 
		32.703, 34.648, 36.708, 38.891, 41.203,   43.654, 46.249, 48.999, 51.913, 55.0,    58.270, 61.735,  // you know?
	    65.406, 69.296, 73.416, 77.782, 82.407,   87.307, 92.499, 97.999, 103.83,110.00,  116.54, 123.47, // can't hear these. 
	   130.81, 138.59, 146.83, 155.56, 164.81,   174.61, 185.00, 196.00, 207.65, 220.00,  233.08, 246.94, 
	   261.63, 277.18, 293.67, 311.13, 329.63,   349.23, 369.99, 392.00, 415.30, 440.00,  466.16, 493.88, 
	   523.25, 554.37, 587.33, 622.25, 659.26,   698.46, 739.99, 783.99, 830.61, 880.00,  932.33, 987.77,
	  1046.5, 1108.7, 1174.7, 1244.5, 1318.5,   1396.9, 1480.0, 1568.0, 1661.2, 1760.0,  1864.7, 1975.5, 
	  2093.0, 2217.5, 2349.3, 2489.0, 2637.0,   2793.0, 2960.0, 3136.0, 3322.4, 3520.0,  3729.3, 3951.1
	); 
	// I'd think about putting it in the prototype, but this class is a singleton, so, meh. 

	try {
		window.AudioContext = window.AudioContext||window.webkitAudioContext;
		this.context = new AudioContext();
	    this.oscillator.type = 0
		this.oscillator.frequency.value = 220.0// freqs[note-24];
		this.gainNode.gain.value = 0.0; 
	    this.oscillator.connect(this.gainNode);
	    this.gainNode.connect(this.audioCon.destination);
	    this.oscillator.start(); 
	    this.gainNode.gain.value = 0.0; 
	    this.hasAudio = 1; 
	} catch(e) {
		alert('Web Audio API is not supported in this browser');
	}

	this.notes = new exNoteList(); 
}


exSound.prototype = { 
	setNoteList: function(nL) { 
		this.notes.copy(nL); 
	},


	restart: function() { 

	},


    play: function(note) {
    	if (this.hasAudio===1) {
			if ((note>23)&&(note<105)) {
				this.oscillator.frequency.value = this.freqs[note-24];
				this.gainNode.gain.value = 1.0; 
			} else {
				this.gainNode.gain.value = 0.0;
			}
	    }
	},


    pause: function() {
    	if (this.hasAudio===1) {
			this.oscillator.disconnect();
		}
    },
	

	update: function() {
		var i, interval, lex, ley; 

		this.signature.update(); 
    	if (this.hasAudio===1) {
    		// get prev t and current t
    		// if any note starts between the two: play that note its oscillator
    		// if any note ends: stop that oscillator. 


		}
	},


	test: function() { 

	}

}







